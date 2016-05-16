//Check if source CSV was parsed already

var fs = require('fs');
var path = require('path');

function load(pParsed, pSource, dataCollectionName, mapKey, postParser) {
    var found = false;

    console.log(pParsed + ': Checking');

    fs.access(pParsed, fs.F_OK, function (err) {
        if (!err) {
            console.log(pParsed + ': Found');
            global.app.data[dataCollectionName] = require(pParsed);
            console.log(pParsed + ': Loaded');
            found = true;
        } else {

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
                
                for(var i = 0; i < src.length; i++){
                    var v = src[i];
                    global.app.maps[dataCollectionName][v[mapKey]] = v;
                }
                
            }

            global.app.server.io.emit('data:' + dataCollectionName, global.app.data[dataCollectionName]);
        }
    });
};

load(app.constants.parsedMaps, app.constants.sourceMaps, 'maps', 'ClassName');
load(app.constants.parsedMobs, app.constants.sourceMobs, 'mobs', 'ClassID');
load(app.constants.trackerRepository, null, 'tracker');
