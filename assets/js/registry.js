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

                    console.log("Processing " + queue.length + " lines");

                    var dataEvent = null;


                    for (var i = 0; i < queue.length; i++) {
                        var dat = queue[i].split('|');

                        if (dat.length === 9) {

                            var event = {
                                Character: dat[0],
                                Family: dat[1],
                                Level: dat[2],
                                Map: dat[3],
                                Mob: dat[4],
                                Kills: dat[7],
                                ReqKills: dat[8]
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
                                global.app.data.tracker[event.Family][event.Character] = { Level: event.Level };
                            }

                            if (!global.app.data.tracker[event.Family][event.Character][event.Map]) {
                                console.log('Creating Map ' + event.Map)
                                global.app.data.tracker[event.Family][event.Character][event.Map] = {};
                            }

                            if (!global.app.data.tracker[event.Family][event.Character][event.Map][event.Mob])
                                global.app.data.tracker[event.Family][event.Character][event.Map][event.Mob] = {};
                                
                            global.app.data.tracker[event.Family][event.Character][event.Map][event.Mob].Data = event.MobData;
                            global.app.data.tracker[event.Family][event.Character][event.Map][event.Mob].Kills = event.Kills;
                            global.app.data.tracker[event.Family][event.Character][event.Map][event.Mob].ReqKills = event.ReqKills;

                            dataEvent = {
                                Character: event.Character + ' ' + event.Family,
                                Map: event.Map,
                                MapData: event.MapData,
                                Data: global.app.data.tracker[event.Family][event.Character][event.Map]
                            }
                        }
                    }

                    if (dataEvent !== null) {
                        fs.unlinkSync(path); // Delete file                        
                        global.app.server.io.emit('data:event', dataEvent);
                        fs.writeFileSync(app.constants.trackerRepository, JSON.stringify(global.app.data.tracker), 'utf-8');
                    }
                });
            }
        }

        console.log(event, path);
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