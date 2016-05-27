//Check if source CSV was parsed already

var processRaws = false;

var fs = require('fs');
var path = require('path');
var csvConverter = require("csvtojson").Converter;
var csvParse = require('csv-parse/lib/sync');

var xmlParse = require('xml2js').parseString;

var rawCols = {};

// Basic preparations


console.log('Checking ' + app.constants.killLogDirectory);

if (!fs.existsSync(app.constants.killLogDirectory)) // Creates the kill log dir if it doesn't exist
{
    console.log('creating ' + app.constants.killLogDirectory);
    fs.mkdirSync(app.constants.killLogDirectory);
}

function loadRawCsv(file, options, postParser) {

    var _path = path.join(app.constants.rawSources, file);

    if (!options) options = { columns: true };

    console.log("READ  " + _path);

    var content = fs.readFileSync(_path);
    var recs = csvParse(content, options);

    if (postParser)
        recs = postParser(recs);

    global.app.data[file] = recs;

    fs.writeFileSync(_path + ".json", JSON.stringify(recs), 'utf-8');

    console.log("OK    " + _path);
}


function loadRawXml(file, postParser) {
    var _path = path.join(app.constants.rawSources, file);
    console.log("READ  " + _path);

    var content = fs.readFileSync(_path);

    xmlParse(content, function (err, recs) {

        if (postParser)
            recs = postParser(recs);

        global.app.data[file] = recs;

        fs.writeFileSync(_path + ".json", JSON.stringify(recs), 'utf-8');

        console.log("OK    " + _path);
    });
}


function load(pParsed, pSource, dataCollectionName, mapKey, postParser) {
    var found = false;

    console.log(pParsed + ': Checking');

    try {
        global.app.data[dataCollectionName] = JSON.parse(fs.readFileSync(pParsed));
        console.log(pParsed + ': Loaded');
        found = true;

    } catch (err) {
        console.log(pParsed + ': Not found');

        if (pSource !== null) {
            console.log(pSource + ': Checking');

            fs.access(pSource, fs.F_OK, function (err) {
                if (!err) {

                    console.log(pSource + ': Found');

                    var Converter = require("csvtojson").Converter;
                    var converter = new Converter({});

                    converter.on("end_parsed", function (data) {

                        if (postParser)
                            data = postParser(data);

                        console.log(pSource + ': Parsed');
                        fs.writeFileSync(pParsed, JSON.stringify(data), 'utf-8');
                        console.log(pSource + ': Saved');


                        global.app.data[dataCollectionName] = data;
                        found = true;
                    });

                    fs.createReadStream(pSource).pipe(converter);
                } else {
                    console.log("data: " + dataCollectionName + " source not found.")
                }
            });
        }

    }

    if (found) {

        if (mapKey !== null) {
            global.app.maps[dataCollectionName] = {};

            var src = global.app.data[dataCollectionName];

            for (var i = 0; i < src.length; i++) {
                var v = src[i];
                global.app.maps[dataCollectionName][v[mapKey]] = v;
            }

        }

        global.app.server.io.emit('data:' + dataCollectionName, global.app.data[dataCollectionName]);
    }
};

function saveSettings() {
    fs.writeFileSync(app.constants.settingsRepository, JSON.stringify(global.app.data.settings), 'utf-8');
    global.app.modules.socket.sendSettings();
}

function loadSettings() {
    load(app.constants.settingsRepository, null, 'settings');
}

function saveTracker() {
    fs.writeFileSync(app.constants.trackerRepository, JSON.stringify(global.app.data.tracker), 'utf-8');
}

function loadTracker() {
    load(app.constants.trackerRepository, null, 'tracker');
}


function getTimeStamp() {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
        + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
            .getSeconds()) : (now.getSeconds())));
}

function saveMobKillData(cid, char, mid, x, y) {

    var _path = path.join(app.constants.killLogDirectory, "\\" + cid + ".jsoncol");

    var sepMark = ",";

    if (!global.app.data.killLog[cid]) {

        if (!fs.existsSync(_path)) // Creates the kill log entry
        {
            fs.writeFileSync(_path, "", 'utf-8');
            sepMark = "";
        }

        global.app.data.killLog[cid] = [];
        global.app.data.killLog[cid] = JSON.parse("[" + fs.readFileSync(_path) + "]");
    }

    var newEntry = { c: char, x, y, m: mid, t: getTimeStamp() };

    global.app.data.killLog[cid].push(newEntry);

    fs.appendFile(_path, sepMark + JSON.stringify(newEntry));
}

if (processRaws) {
    global.app.data["mapsByClassName"] = {};

    // Basic sources 
    loadRawCsv("camp_warp.ies");
    global.app.data["mappos"] = JSON.parse(fs.readFileSync(path.join(app.constants.rawSources, "mappos.json")));

    loadRawCsv("map.ies", null, function (ii) {

        var ret = {};

        ii.forEach(function (i) {

            if (i.PhysicalLinkZone) { //Only show maps that are linked to another
                ret[i.ClassID] = {
                    ClassID: i.ClassID,
                    QuestLevel: i.QuestLevel,
                    MapType: i.MapType,
                    WarpCost: i.WarpCost,
                    DefGenX: i.DefGenX,
                    DefGenZ: i.DefGenZ,
                    Width: i.Width,
                    Height: i.Height,
                    ClassName: i.ClassName,
                    EngName: i.EngName,
                    PhysicalLinkZone: i.PhysicalLinkZone,
                    isVillage: i.isVillage,
                    MapRank: i.MapRank,
                    canPath: i.WarpCost != "500"
                };

                global.app.data["mapsByClassName"][i.ClassName] = i.ClassID;
            }

        });

        return ret;
    });

    loadRawCsv("monster.ies", null, function (ii) {

        var ret = {};

        ii.forEach(function (i) {

            if (i.Icon.indexOf('mon_') != 0)
                i.Icon = "mon_" + i.Icon;

            ret[i.ClassID] = {
                ClassID: i.ClassID,
                Level: i.Level,
                ClassName: i.ClassName,
                Icon: i.Icon,
                Name: i.ClassName
            };
        });

        return ret;
    });

    loadRawCsv("ETC.tsv",
        { delimiter: '\t', columns: ['id', 'name', 'kr', 'i0', 'i1', 'i2', 'i3', 'i4', 'i5'], relax_column_count: true, relax: true },
        function (data) {

            var ret = {};

            data.forEach(function (i) {
                ret[i.id] = i;
            });

            return ret;

        });

    loadRawXml("DicIDTable.xml", function (data) {

        function getFirstNumber(content) {

            var _wl = "0123456789";

            var currPos = -1;

            for (var i = 0; i < content.length; i++) {

                if (_wl.indexOf(content[i]) === -1) break;
                currPos = i;
            }

            if (currPos === -1)
                return "";

            return content.substring(0, currPos + 1);
        };

        function deDuplicate(content) {

            if (content.length % 2 !== 0)
                return content;

            var hct = content.length / 2;

            var t1 = content.substring(0, hct);
            var t2 = content.substring(hct, content.length);

            if (t1 === t2) return t1;

            return content;
        };

        var ret = [];

        data.DicIDTable.dic_data.forEach(function (ii) {
            var i = ii["$"];

            i.Contents = global.app.data["ETC.tsv"][i["ID"]].name;

            if (i.Filename === "xml\\monster.xml") {
                i.key = i.FilenameWithKey.split('CategoryNameMonsterClassClassID')[1];

                if (i.key) {
                    i.key = i.key.split("_EP_Name_")[0];
                    i.keyCode = deDuplicate(getFirstNumber(i.key));
                }

                if (global.app.data["monster.ies"][i.keyCode]) {
                    if (i.FilenameWithKey.indexOf("_EP_Name_0") !== -1)
                        global.app.data["monster.ies"][i.keyCode].Name = i.Contents;
                    else
                        global.app.data["monster.ies"][i.keyCode].Description = i.Contents;
                }
                ret.push(i);
            }

            if (i.Filename.substring(0, 11) === "xml\\map.xml") {
                i.key = i.FilenameWithKey.split('CategoryClassClassID')[1];

                if (i.key) {
                    i.key = i.key.split("_CategoryName_")[0];
                    i.keyCode = deDuplicate(getFirstNumber(i.key));
                }

                if (global.app.data["map.ies"][i.keyCode]) {
                    if (i.FilenameWithKey.indexOf("_CategoryName_Name_Theme_") !== -1)
                        global.app.data["map.ies"][i.keyCode].Theme = i.Contents;
                    else
                        global.app.data["map.ies"][i.keyCode].Name = i.Contents;
                }

                ret.push(i);
            }
        });

        return ret;
    });

    // Post-Process:
    // --- warpzones
    global.app.data["camp_warp.ies"].forEach(function (i) {
        global.app.data["map.ies"][global.app.data["mapsByClassName"][i.Zone]].HasWarp = true;
    });
    // --- Map position
    global.app.data["mappos"].forEach(function (i) {

        var mapo = global.app.data["map.ies"][i.ClassID];

        if (mapo) {
            global.app.data["map.ies"][i.ClassID].posX = 70 + i.x * 1.445;
            global.app.data["map.ies"][i.ClassID].posY = 60 + i.y * 1.445;
        }
        else {
            console.log('WARN map CID not found [' + i.ClassID + ']');
        }
    });

    // Post-process maps:
    for (var ik in global.app.data["map.ies"]) {

        var i = global.app.data["map.ies"][ik];

        var ls = [];

        if (i.PhysicalLinkZone) {
            var links = i.PhysicalLinkZone.split('/');

            links.forEach(function (ii) {
                ls.push(global.app.data["mapsByClassName"][ii]);
            });
        }

        i.nodes = ls;
    };

    // All done - now, save content:

    fs.writeFileSync(app.constants.parsedMobs, JSON.stringify(global.app.data["monster.ies"]), 'utf-8');
    fs.writeFileSync(app.constants.parsedMaps, JSON.stringify(global.app.data["map.ies"]), 'utf-8');
}

//load(app.constants.parsedMaps, app.constants.sourceMaps, 'maps', 'ClassName');
//load(app.constants.parsedMobs, app.constants.sourceMobs, 'mobs', 'ClassID');

global.app.data.maps = JSON.parse(fs.readFileSync(app.constants.parsedMaps));
global.app.data.mobs = JSON.parse(fs.readFileSync(app.constants.parsedMobs));

loadSettings();
loadTracker();



// Quick attemp to convert old Map data

var mapClassHash = {};

for (var fam in global.app.data.maps) {
    var mapo = global.app.data.maps[fam];
    mapClassHash[mapo.ClassName] = mapo.ClassID;
};

var mustSave = false;

for (var fam in global.app.data.tracker) {
    var famo = global.app.data.tracker[fam];
    console.log("Validating Family " + fam);

    for (var char in famo) {
        var charo = famo[char];
        console.log("Validating Character " + char);

        for (var map in charo.map) {
            var mapo = charo.map[map];

            if (mapClassHash[map]) {
                console.log(map + " FOUND");
                mustSave = true;
                charo.map[mapClassHash[map]] = mapo;
                delete charo.map[map];
            }
        };

        for (var mob in charo.mob) {
            var mobo = charo.mob[mob];
            if (mobo.Data) {
                console.log(mob + " FOUND");
                mustSave = true;
                delete mobo.Data;
            }
        };
    };
};

if (mustSave) saveTracker();

module.exports = {
    loadSettings,
    saveSettings,
    loadTracker,
    saveTracker,
    saveMobKillData
};
