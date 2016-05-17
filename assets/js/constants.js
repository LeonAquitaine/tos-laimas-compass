// http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

var path = require('path');

define("__SERVER_PORT", 9183);
define("parsedMaps", path.join(__dirname, '..\\..\\assets\\data\\maps.json'));
define("sourceMaps", path.join(__dirname, '..\\..\\assets\\data\\maps.csv'));
define("parsedMobs", path.join(__dirname, '..\\..\\assets\\data\\mobs.json'));
define("sourceMobs", path.join(__dirname, '..\\..\\assets\\data\\mobs.csv'));
define("trackerRepository", path.join(__dirname, '..\\..\\assets\\data\\tracker.json'));
define("settingsRepository", path.join(__dirname, '..\\..\\assets\\data\\settings.json'));