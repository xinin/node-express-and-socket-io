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

    sendMessage(msg, params) { //Envio de mensaje al emisor del mensaje original
        this.socket.emit('chat message', msg);
    }

}

module.exports = Socket;
