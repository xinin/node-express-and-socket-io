'use strict';

const App = require(__dirname + '/../../App');
const Player = App.getModel('Player');

class Lobby{

    constructor(){
        this.collection = 'lobby';
    }

    addPlayerToQueue(req, player){
        const $this = this;
        return new Promise((resolve, reject)=>{
            Player.isValid(req, player).then(
                ()=> {
                    player.time = new Date().getTime();
                    player._id = player.id;
                    delete player.id;

                    App.DB().mongoDb().collection($this.collection).insert(player, (err) => {
                        if (err) {
                            console.log("ERR", err); //TODO ESTO A ALERTAS
                            return reject({msg: 'Unnable to add Player to the Queue', code: 500})
                        } else {
                            return resolve();
                        }
                    });

                }, err => {
                    reject({msg: `Player not valid`, data: err.details, code: 412});
                }
            );
        });
    }

    checkAvailableGame(req){
        //TODO Mirar si hay alguien esperando con el que poder ser emperejado y si es asi notificar a ambos, si el usuario no tiene disponible crea una y este se subscribe a este scoket
    }

}

module.exports = Lobby;