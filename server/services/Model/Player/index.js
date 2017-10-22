'use strict';

const App = require(__dirname + '/../../App');


class Player {

    constructor() {
        this.collection = 'player';
        //this.schema = new Schema();
        //TODO USAR JOI
        this.schema = {
            /**
             *
             * id
             * password (hash)
             * email
             * avatar
             * points
             * cards
             * ...
             */
        };
    }

    isValid(req, params) {
        //TODO
        return true;
    }

    register(req, params) { //TODO ver como hacer el envio de la contraseña si necesita aceptar una confirmacion de email o algo asi o no
        const $this = this;
        return new Promise((resolve, reject) => {
            console.log("Entrando usuario para ser registrado"); //TODO modulo de logs
            let player = params.player;
            if ($this.isValid(req, {player})) {
                $this.findById(req, player.id).then(
                    data => {
                        reject({msg: 'User alredy exists', code: 412});
                    }, err => {
                        if (err && err.code === 404) {
                            player._id= player.id;
                            delete player.id;
                            App.DB().mongoDb().collection($this.collection).insert(player, (err) => {
                                if(err){
                                    console.log("ERR", err); //TODO ESTO A ALERTAS
                                    return reject({msg: 'Register service error', code: 500})
                                } else {
                                    return resolve(player);
                                }
                            });
                        } else {
                            console.log("ERR", err); //TODO ESTO A ALERTA
                            reject({msg: 'Register service error', code: 500});
                        }
                    }
                );
            } else {
                reject({msg: 'User not valid', code: 412}); //TODO devovler error de JOI
            }
        });
    }

    findById(req, playerId) { //TODO añadir parametro de proyeccion para cuando solo ns interese una parte como por ejemplo en el exists
        const $this = this;
        return new Promise((resolve, reject) => {
            if (playerId) {
                playerId = playerId.trim();
                console.log("Comprobando si el jugador existe", playerId);
                App.DB().mongoDb().collection($this.collection).findOne({_id: playerId}, (err, item) => {
                    if (!item) {
                        if (err) {
                            console.log("ERROR:", JSON.stringify(err));//TODO esto a log de alertas
                            reject({msg: 'Error recovering user data', code: 500});
                        } else {
                            reject({msg: 'Non existent user', code: 404});
                        }
                    } else {
                        resolve(item);
                    }
                });
            } else {
                reject({msg: 'Player ID is required', code: 412});
            }
        });
    }

}

module.exports = Player;