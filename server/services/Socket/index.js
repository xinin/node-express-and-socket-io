'use strict';

const App = require(__dirname + '/../App');

class Socket {

    constructor(io, socket){
        this.io= io;
        this.socket = socket;
    }

    sendGlobalMessage(msg, params) { //Envio a todos los clientes conectados
        if(params && params.broadcast){ //ENVIO A TODOS LOS CONECTADOS
            this.io.emit('global', { for: 'everyone' , msg});
        } else { //ENVIO A TODOS LOS CONECTADOS MENOS AL EMISOR DEL MENSAJE ORIGINAL
            this.socket.broadcast.emit('global', 'Se ha conectado otro usuario');
        }
    }

    sendRoomMessage(msg, channel, room){
        this.io.to(room).emit(channel, msg);
    }

    sendMessage(msg, channel) { //Envio de mensaje al emisor del mensaje original
        this.socket.emit(channel, msg);
    }

    sendError(msg) {
        this.socket.emit('error', msg);
    }

    joinRoom(room) {
        this.socket.join(room);
    }

    leaveRoom(room) {
        this.socket.leave(room);
    }

}

module.exports = Socket;
