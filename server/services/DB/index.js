'use strict';

const App = require(__dirname+'/../App');
const mongoInstances = {};
//let mysqlPool;

/**
 * Clase que administra las distintas bases de datos de la aplicación.
 * Devuelve siempre la misma instancia
 */
class DB {

    mongoConnect(instance){
        return new Promise((resolve,reject)=>{
            instance = instance || 'mongo';
            let config = App.Config();
            let MongoClient =   require('mongodb').MongoClient;
            let path = 'mongodb://'+config.mongo.path;

            MongoClient.connect(path, (err, db) => {
                if(err){
                    return reject(err);
                }else{
                    mongoInstances[instance]=db;
                    return resolve(db);
                }
            });
        });
    }

    checkStatus() {
        return new Promise((resolve, reject) => {

            let config = App.Config();
            let MongoClient =   require('mongodb').MongoClient;
            let path = 'mongodb://'+config.mongo.path;

            MongoClient.connect(path, {
                server: {
                    socketOptions: {
                        connectTimeoutMS: 5000
                    }
                }
            }).then(
                (db)=>{
                    db.close();
                    resolve();
                }, reject);
        });
    }



    mongoDb(instance){
        instance = instance || 'mongo';
        if(!mongoInstances[instance]){
            console.error('DB no iniciada');
            process.exit(1);
        }
        return mongoInstances[instance];
    }

}

module.exports = (function(){
    return DB;
})();

