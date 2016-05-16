    global.app.server.callbacks.onSocketConnection = function(socket){
      
        if (global.app.data.maps){
            socket.emit('data:maps', global.app.data.maps);
        }

        if (global.app.data.mobs)
        {
            socket.emit('data:mobs', global.app.data.mobs);
        }

        if (global.app.data.tracker)
        {
            socket.emit('data:tracker', global.app.data.tracker);
        }
        
        if (global.app.data.lastEvent)
        {
            socket.emit('data:event', global.app.data.lastEvent);
        }
        
        var os = require("os");
        var host = os.hostname();
        
        socket.emit('data:server', host + ":" + global.app.constants.__SERVER_PORT);
    };
