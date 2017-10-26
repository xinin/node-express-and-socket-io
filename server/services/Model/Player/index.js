'use strict';

const Joi = require('joi');


const App = require(__dirname + '/../../App');


class Player {

    constructor() {
        this.collection = 'player';
        this.schema = Joi.object().keys({ //TODO completar como deberia ser
            id: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string(), //habra que convertirlo en hash y blablabal ahora paso
            email: Joi.string().email(),
            avatar: Joi.string()
        });
    }

    isValid(req, player, params) {
        return new Promise((resolve, reject) => {
            //TODO hacer extensible a posibles parametros futuros y log en la req
            Joi.validate(player, this.schema).then(resolve, reject);
        });
    }

    register(req, params) { //TODO ver como hacer el envio de la contraseña si necesita aceptar una confirmacion de email o algo asi o no
        const $this = this;
        return new Promise((resolve, reject) => {
            console.log("Entrando usuario para ser registrado"); //TODO modulo de logs
            let player = params.player;

            $this.isValid(req, player).then(
                ()=> {
                    $this.findById(req, player.id).then(
                        () => reject({msg: 'User alredy exists', code: 412}),
                        err => {
                            if (err && err.code === 404) {
                                player._id = player.id;
                                delete player.id;
                                App.DB().mongoDb().collection($this.collection).insert(player, (err) => {
                                    if (err) {
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
                }, err => {
                    reject({msg: `User not valid`, data: err.details, code: 412});
                }
            );
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