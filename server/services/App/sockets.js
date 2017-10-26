'use strict';

const App = require(__dirname+'/../App');

module.exports = function(io) {

    io.on('connection', function (socket) {
        const Socket = App.Socket(io, socket);

        console.log('a user connected');
        Socket.sendGlobalMessage('Tenemos un usuario nuevo', {broadcast: true});
        Socket.sendGlobalMessage('Se ha conectado otro usuario');

        socket.on('chat message', function(msg){
            console.log("Mensaje recibido "+msg);
            Socket.sendMessage('Me has enviado un mensaje');
        });

        socket.on('disconnect', function(args){
            console.log('user disconnected', args);
        });

    });

};
