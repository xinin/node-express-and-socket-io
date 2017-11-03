'use strict';

const App = require(__dirname + '/../../App');
const Player = App.getModel('Player');

class Lobby{

    constructor(){
        this.collection = 'lobby';
    }

    matching(req, player){
        const $this = this;
        return new Promise((resolve, reject)=>{
           Player.isValid(req, player).then(
               ()=>{
                 $this.searchMatch(req, {}).then(
                     match => {
                         if(match){
                             resolve({id: match._id});
                         } else {
                             $this.addPlayerToQueue(req, player).then(
                                 ()=>{
                                     resolve({id: player._id, new : true});
                                 }, err => {
                                     console.log("ERR", err); //TODO A ALERTAS
                                     reject({msg: `Unable to create a match`, code: 500});
                                 }
                             );
                         }
                     }, err => {
                         console.log("ERR", err); //TODO A ALERTAS
                         reject({msg: `Unable to find a match`, code: 500});
                     }
                 )
               }, err => {
                   reject({msg: `Player not valid`, data: err.details, code: 412});
               }
           )
        });
    }

    searchMatch(req, params){
        const $this = this;
        return new Promise((resolve, reject)=>{
            App.DB().mongoDb().collection($this.collection).findOneAndDelete(
                {},
                {
                    sort: { "time": 1 },
                },
                (err, data) => {
                    if (err) {
                        console.log("ERR", err); //TODO ESTO A ALERTAS
                        reject({msg: 'Unnable to find a match', code: 500})
                    } else {
                       resolve(data.value);
                    }
                }
            );
        });
    }

    addPlayerToQueue(req, player){
        const $this = this;
        return new Promise((resolve, reject)=>{
            player.time = new Date().getTime();
            player._id = player.id;
            delete player.id;

            App.DB().mongoDb().collection($this.collection).replaceOne({ _id : player._id}, player, {upsert: true},(err) => {
                if (err) {
                    console.log("ERR", err); //TODO ESTO A ALERTAS
                    return reject({msg: 'Unnable to add Player to the Queue', code: 500})
                } else {
                    return resolve();
                }
            });
        });
    }

    checkAvailableGame(req){
        //TODO Mirar si hay alguien esperando con el que poder ser emperejado y si es asi notificar a ambos, si el usuario no tiene disponible crea una y este se subscribe a este scoket
    }

}

module.exports = Lobby;