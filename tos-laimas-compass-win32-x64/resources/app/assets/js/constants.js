// http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

var path = require('path');

define("__SERVER_PORT", 9183);

define("rawSources", path.join(__dirname, '..\\..\\assets\\data\\src'));


define("parsedMaps", path.join(__dirname, '..\\..\\res\\data\\maps.json'));
define("parsedMobs", path.join(__dirname, '..\\..\\res\\data\\mobs.json'));
define("killLogDirectory", path.join(__dirname, '..\\..\\assets\\data\\killLog'));
define("trackerRepository", path.join(__dirname, '..\\..\\assets\\data\\tracker.json'));
define("settingsRepository", path.join(__dirname, '..\\..\\assets\\data\\settings.json'));