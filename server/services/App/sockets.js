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
        socket.on('matching', (args) =>{
            let player = args.player;
            Lobby.matching(null, player).then(
                match=>{
                    socket.join(match.id);
                    Socket.sendMessage('matching',{match: match, code:200});
                    if(!match.new){
                        io.to(match).emit('match ready', {players: [match.id, player.id]});
                    }
                }, err => {
                    err.process = 'matching';
                    Socket.sendMessage('matching',err);
                }
            );
        })

    });

};
