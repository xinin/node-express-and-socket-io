'use strict';
let config;
let db;
let socket;
let utils;



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
        if(!socket) socket = require(__dirname+'/../Socket');
        return socket;
    }

    static Utils(){
        if(!utils) utils = require(__dirname+'/../Utils');
        return utils;
    }

    static getModel(model){
        let m = require(__dirname+'/../Model/'+model);
        return new m();
    }

    static launch(){
        return require(__dirname+'/servers');
    }

}

module.exports = App;
