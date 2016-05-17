global.app.server.callbacks.onSocketConnection = function (socket) {

    if (global.app.data.maps) {
        socket.emit('maps', global.app.data.maps);
    }

    if (global.app.data.mobs) {
        socket.emit('mobs', global.app.data.mobs);
    }

    sendTracker(socket);

    if (global.app.data.lastEvent) {
        socket.emit('event', global.app.data.lastEvent);
    }

    var os = require("os");
    var host = os.hostname();

    socket.emit('server', host + ":" + global.app.constants.__SERVER_PORT);
    
    sendSettings(socket);
};

function sendSettings(socket)
{
    if (global.app.data.settings) {
        sendContent('settings', global.app.data.settings, socket);
    }
}

function sendTracker(socket) {
    if (global.app.data.tracker) {
        sendContent('tracker', global.app.data.tracker, socket);
    }
}

function sendContent(event, content, socket) {
    if (socket) // If specific socket...
        socket.emit(event, content);
    else // Otherwise broadcast.
        global.app.server.io.emit(event, content);
}

module.exports = { sendTracker, sendSettings };