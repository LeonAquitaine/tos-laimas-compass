function startMonitor() {
    var chokidar = require('chokidar');
    var pathSvc = require('path');
    var fs = require('fs');

    // One-liner for current directory, ignores .dotfiles
    chokidar.watch(global.app.settings.addOnPath).on('all', (event, path) => {
        var fn = pathSvc.basename(path);

        if (fn === 'data.txt') {
            if ((event === 'change') || (event === 'add')) {
                
                fs.readFile(path, 'utf8', function (err, data) {
                    
                    if (err) {
                        return console.log(err);
                    }

                    var queue = data.replace('\r', '').split('\n');

                    console.log("Processing " + (queue.length - 1) + " line(s)");

                    var dataEvent = null;

                    for (var i = 0; i < queue.length; i++) {

                        var li = queue[i].replace('\n', '');

                        var dat = li.split('|');

                        if (dat.length > 3) {

                            var event = {
                                Type: dat[0],
                                Character: dat[1],
                                Family: dat[2],
                                Level: dat[3],
                                Map: dat[4],
                                Mob: dat[5],
                                Kills: Number(dat[6]),
                                ReqKills: Number(dat[7]),
                                ExplorationCurrent: Number(dat[5]),
                                ExplorationTotal: Number(dat[6])
                            };

                            if (global.app.maps.maps[event.Map] !== null)
                                event.MapData = global.app.maps.maps[event.Map];

                            if (global.app.maps.mobs[event.Mob] !== null)
                                event.MobData = global.app.maps.mobs[event.Mob];

                            if (!global.app.data.tracker)
                                global.app.data.tracker = {};

                            if (!global.app.data.tracker[event.Family]) {
                                console.log('Creating Family ' + event.Family)
                                global.app.data.tracker[event.Family] = {};
                            }

                            if (!global.app.data.tracker[event.Family][event.Character]) {
                                console.log('Creating Character ' + event.Character)
                                global.app.data.tracker[event.Family][event.Character] = { map: {}, mob: {} };
                            }

                            global.app.data.tracker[event.Family][event.Character].Level = event.Level;

                            if (!global.app.data.tracker[event.Family][event.Character].map)
                                global.app.data.tracker[event.Family][event.Character].map = {};

                            if (!global.app.data.tracker[event.Family][event.Character].mob)
                                global.app.data.tracker[event.Family][event.Character].mob = {};

                            if (!global.app.data.tracker[event.Family][event.Character].map[event.Map]) {
                                console.log('Creating Map ' + event.Map)
                                global.app.data.tracker[event.Family][event.Character].map[event.Map] = {};
                            }

                            if (!global.app.data.tracker[event.Family][event.Character].map[event.Map].mobs)
                                global.app.data.tracker[event.Family][event.Character].map[event.Map].mobs = [];

                            if (!global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration)
                                global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration = {};

                            if (event.Type == "KILL") {

                                if (global.app.data.tracker[event.Family][event.Character].map[event.Map].mobs.indexOf(event.Mob) == -1)
                                    global.app.data.tracker[event.Family][event.Character].map[event.Map].mobs.push(event.Mob);

                                if (!global.app.data.tracker[event.Family][event.Character].mob[event.Mob]) {
                                    global.app.data.tracker[event.Family][event.Character].mob[event.Mob] = {};

                                    if (global.app.maps.mobs[event.Mob])
                                        global.app.data.tracker[event.Family][event.Character].mob[event.Mob].Data = global.app.maps.mobs[event.Mob];
                                }

                                global.app.data.tracker[event.Family][event.Character].mob[event.Mob].Total = event.ReqKills;
                                global.app.data.tracker[event.Family][event.Character].mob[event.Mob].Current = event.Kills;
                                global.app.data.tracker[event.Family][event.Character].mob[event.Mob].Completed = event.Kills >= event.ReqKills;
                            }

                            if (event.Type == "MAP") {
                                global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration.Total = event.ExplorationTotal;
                                global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration.Current = event.ExplorationCurrent;
                                global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration.Completed = event.ExplorationCurrent >= event.ExplorationTotal;
                            }

                            var preEventDump = global.app.data.tracker[event.Family][event.Character].map[event.Map].mobs.map(function (i) {
                                return global.app.data.tracker[event.Family][event.Character].mob[i];
                            });

                            var eventDump = {};

                            preEventDump.forEach(function (i) { eventDump[i.Data.ClassID] = i; });

                            if (global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration)
                                eventDump.Exploration = global.app.data.tracker[event.Family][event.Character].map[event.Map].Exploration;

                            dataEvent = {
                                Character: event.Character + ' ' + event.Family,
                                Map: event.Map,
                                MapData: event.MapData,
                                Data: eventDump,
                                EventSource: (event.Type === "KILL") ? event.Mob : "Exploration"
                            }
                        }
                    }

                    if (dataEvent !== null) {

                        try {
                            fs.unlinkSync(path); // Delete file
                        }
                        catch (e) {
                        }
                        global.app.server.io.emit('data:event', dataEvent);
                        global.app.data.lastEvent = dataEvent;
                        fs.writeFileSync(app.constants.trackerRepository, JSON.stringify(global.app.data.tracker), 'utf-8');
                    }
                });
            }
        }
    });
}

function detectRepo() {

    var fs = require('fs');
    var regedit = require('regedit')

    regedit.list('HKCU\\Software\\Valve\\Steam', function (err, result) {
        if (!err) {
            var steamPath = result['HKCU\\Software\\Valve\\Steam'].values.SteamPath.value;

            var path = require('path');

            var repoPath = path.join(steamPath, '\\steamapps\\common\\TreeOfSavior');

            console.log(repoPath + ": Checking");

            fs.access(repoPath, fs.F_OK, function (err) {
                if (!err) {
                    console.log(repoPath + ': Found');

                    var addOnPath = path.join(repoPath, '\\addons\\laimascompass');
                    console.log(addOnPath + ': Add-On folder');
                    global.app.settings.addOnPath = addOnPath;

                    startMonitor();

                } else {
                    console.log(repoPath + ": Not found")
                }
            });
        }
    })
};

detectRepo();