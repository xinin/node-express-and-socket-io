'use strict';

const App = require(__dirname + '/../../services/App');
const Utils = App.Utils();

let Player = App.getModel('Player');

exports.register = function (req, res) {

    let player = req.body.player;

    console.log("PLAYER", Player)

    if(player){
        Player.register(req, {player}).then(
            data =>{
                Utils.response(req, res, data, 200);
            }, err => {
                console.log("ENVIAMOS ERROR");
                Utils.error(req, res, err)
            }
        );
    } else {
        Utils.error(req, res, 412, 'Player info is required');
    }

};
