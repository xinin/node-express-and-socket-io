'use strict';

const App = require(__dirname+'/../App');
const Lobby = App.getModel('Lobby');

module.exports = (io) => {

    //TODO HACER UN MIDDLEWARE PARA LOS SOCKETS

    io.on('connection', (socket) => {

        console.log("user connected");

        const Socket = App.Socket(io, socket);
        Socket.sendGlobalMessage('Tenemos un usuario nuevo', {broadcast: true});
        Socket.sendGlobalMessage('Se ha conectado otro usuario');

        socket.on('disconnect', (args) => {
            console.log('user disconnected', args);
        });

        socket.on('matching', (args) =>{
            let player = args.player;
            Lobby.matching(null, player).then(
                match=>{
                    Socket.joinRoom(match.id);
                    Socket.sendMessage({match: match, code:200},'matching');
                    if(!match.new){
                        Socket.sendRoomMessage({id:match.id, players: [match.id, player.id]},'matchready', match.id);
                    }
                }, err => {
                    err.process = 'matching';
                    Socket.sendMessage(err,'matching');
                }
            );
        });

        socket.on('cancelMatching', (args) => {
            let match = args.match;
            Lobby.cancelMatch(null, match.id).then(
                ()=>{
                    Socket.leaveRoom(match.id);
                    Socket.sendMessage({code:200},'cancelMatching');
                }, err => {
                    err.process = 'cancelMatching';
                    Socket.sendMessage(err, 'cancelMatching' );
                }
            )
        });

    });

};
