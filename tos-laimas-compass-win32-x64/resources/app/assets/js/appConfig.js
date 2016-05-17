

function setGameFolder(path) {
    global.app.modules.fileHandling.trySetGameFolder(path);
};

module.exports = {
    setGameFolder
};
