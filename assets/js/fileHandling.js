function fileMd5(file) {

    var fs = require('fs');
    var md5 = require('md5');

    var hash = "nil";

    try {
        var content = fs.readFileSync(file);
        hash = md5(content);

    } catch (e) {
    }

    console.log("   MD5 " + hash + " " + file);
    return hash;

}

//http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js

function fileCopy(source, target, cb) {

    var fs = require('fs');

    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target, { flags: 'w' });
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {

        if (err) {
            console.log("   fileCopy ERR");
            console.log(err);
        }

        if (!cbCalled) {
            if (cb)
                cb(err);
            cbCalled = true;
        }
    }
}
function fileValidate(source, destination) {

    try {
        if (fileMd5(source) != fileMd5(destination)) {
            var fs = require('fs');
            fileCopy(source, destination);
            console.log("UPDATE: " + destination);
        } else {
            console.log("SAME: " + destination);
        }

    } catch (e) {
        console.log("ERR: " + destination);
        console.log(e);
    }

};

function detectRepo() {
    
    console.log('Detecting Steam folder...');

    var fs = require('fs');
    var regedit = require('regedit')

    regedit.list('HKCU\\Software\\Valve\\Steam', function (err, result) {
        if (!err) {
            var steamPath = result['HKCU\\Software\\Valve\\Steam'].values.SteamPath.value;

            var path = require('path');

            var repoPath = path.join(steamPath, '\\steamapps\\common\\TreeOfSavior');
            
            trySetGameFolder(repoPath);
        }
    })
};

function trySetGameFolder(repoPath) {

    console.log(repoPath + ": Checking");

    var fs = require('fs');
    var path = require('path');

    if (fs.existsSync(repoPath)) {
        console.log(repoPath + ': Found');

        global.app.data.settings.gameFolder = repoPath;

        fileValidate(
            path.join(__dirname, '\\..\\SumAni.ipf'),
            path.join(repoPath, '\\data\\SumAni.ipf')
        );

        var mustCopy = false;
        var currPath = path.join(repoPath, '\\addons');

        if (!fs.existsSync(currPath)) // Creates the add-on folder if it doesn't exist 
            fs.mkdirSync(currPath);

        var addOnPath = currPath;

        fileValidate(
            path.join(__dirname, '\\..\\addonloader.lua'),
            path.join(repoPath, '\\addons\\addonloader.lua')
        );


        global.app.data.settings.gameAddOnFolder = addOnPath;

        currPath = path.join(path.join(repoPath, '\\addons\\laimascompass'));

        if (!fs.existsSync(currPath)) // Creates the add-on specific folder if it doesn't exist 
            fs.mkdirSync(currPath);

        fileValidate(
            path.join(__dirname, '\\..\\laimascompass.lua'),
            path.join(repoPath, '\\addons\\laimascompass\\laimascompass.lua')
        );

        global.app.data.settings.addOnPath = addOnPath;

        global.app.modules.fileMonitor.startMonitor();

    }

    global.app.modules.data.saveSettings();

    fs.access(repoPath, fs.F_OK, function (err) {
        if (!err) {

        } else {
            console.log(repoPath + ": Not found")
        }
    });
};

if (!global.app.data.settings.gameFolder) detectRepo();

module.exports = {
    detectRepo,
    trySetGameFolder
 };
