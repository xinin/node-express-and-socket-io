'use strict';
const EventEmitter = require('events');
const App = require(__dirname+'/index');
const config = App.Config();
const DB = App.DB();
const util = require('util');

// Cargas iniciales y dependencias
const setup = function setup(){
    EventEmitter.call(this);

    if(config.envVars){ //Carga de variables de entorno
        for (let key in config.envVars) {
            process.env[key] = config.envVars[key];
        }
    }

    let promises = [DB.mongoConnect()];
    // let promises = [];
    Promise.all(promises).then(
        ()=>this.emit('success',null),
        (err)=>this.emit('error',err)
    );

};

util.inherits(setup,EventEmitter);

module.exports = new setup();
