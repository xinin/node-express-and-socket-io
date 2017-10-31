'use strict';

const App = require(__dirname+'/../App');
const Lobby = App.getModel('Lobby');

module.exports = function(io) {

    //TODO HACER UN MIDDLEWARE PARA LOS SOCKETS

    io.on('connection', function (socket) {
        const Socket = App.Socket(io, socket);

        console.log('a user connected');
        Socket.sendGlobalMessage('Tenemos un usuario nuevo', {broadcast: true});
        Socket.sendGlobalMessage('Se ha conectado otro usuario');

        socket.on('chat message', function(msg){
            console.log("Mensaje recibido "+msg);
            Socket.sendMessage('chat message','Me has enviado un mensaje');
        });

        socket.on('disconnect', function(args){
            console.log('user disconnected', args);
        });

        /***
         * args será el player
         */
        socket.on('addQueue', (args) =>{
            let player = args.player;
            Lobby.addPlayerToQueue(null, player).then(
                data =>{
                    if(!data) data = {};  //TODO HACER UN UTILS PARA REQUEST DE SOCKETS
                    data.process = 'addQueue';
                    Socket.sendMessage('addQueue',data);
                }, err => {
                    err.process = 'addQueue';
                    Socket.sendMessage('addQueue',err);
                }
            );
        })

    });

};
