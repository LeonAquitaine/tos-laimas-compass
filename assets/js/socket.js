    global.app.server.callbacks.onSocketConnection = function(socket){
      
        if (global.app.data.maps){
            socket.emit('data:maps', global.app.data.maps);
        }

        if (global.app.data.mobs)
        {
            socket.emit('data:mobs', global.app.data.mobs);
        }
    };
