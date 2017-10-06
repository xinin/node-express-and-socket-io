'use strict';

const io = require('socket.io');

const App = require(__dirname+'/../App');
let socketInstance = null;
//let mysqlPool;

/**
 * Clase que administra las distintas bases de datos de la aplicación.
 * Devuelve siempre la misma instancia
 */
class Socket {

    socketCreate(server){
        socketInstance = io.listen(server);
        return socketInstance;
    }


}

module.exports = Socket;

