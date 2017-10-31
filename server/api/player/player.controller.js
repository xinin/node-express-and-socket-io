'use strict';

const App = require(__dirname + '/../../services/App');
const Utils = App.Utils();

let Player = App.getModel('Player');

exports.signUp = (req, res) => {

    let player = req.body.player;
    player.password = Utils.base64decode(player.password); //TODO cambiar por la decrypt que se decida en el futuro

    if(player){
        Player.signUp(req, {player}).then(
            data =>{
                Utils.response(req, res, data, 200);
            }, err => {
                Utils.error(req, res, err)
            }
        );
    } else {
        Utils.error(req, res, 'Player info is required', 412);
    }
};

exports.logIn = (req, res) => {

    let player = req.body.player;
    player.password = Utils.base64decode(player.password);

    if(player){
        Player.logIn(req, {player}).then(
            data => {
                Utils.response(req, res, data, 200);
            }, err => {
                Utils.error(req, res, err);
            }
        )
    } else {
        Utils.error(req, res, 'Player info is required', 412);
    }


};