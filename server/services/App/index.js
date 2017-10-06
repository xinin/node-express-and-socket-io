'use strict';
let config;
let db;
let socket;

/**
 * Clase que gestiona la APP y todas sus dependencias
 */

class App {
    static Config(){
        if(!config) config = require(__dirname+'/../Config');
        return config;
    }

    static DB(){
        if(!db) db = require(__dirname+'/../DB');
        return new db();
    }

    static Socket(){
        if(!socket) socket = require(_dirname+'/../Socket');
        return socket;
    }

    static launch(){
        return require(__dirname+'/servers');
    }
}

module.exports = App;
