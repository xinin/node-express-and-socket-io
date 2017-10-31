'use strict';

const App = require(__dirname + '/../App');
const Config = App.Config();

const _ = require('lodash');
const crypto = require('crypto');

class Utils {

    static response(req, res, data, code) {
        return res.status(code).json({
            code,
            data
        });
    }

    static error(req, res, data, code) {

        let response = {
            code: (code || ((data.code && !isNaN(data.code)) ? data.code : 500))
        };

        if (data.code) {
            delete data.code;
        }
        response.data = data;
        console.error("response", response); //TODO cambiar por sistema de logs
        return res.status(response.code).send(response);
    }

    static base64encode(string) {
        return new Buffer(string).toString('base64');
    }

    static base64decode(string) {
        return new Buffer(string, 'base64').toString('utf8');
    }

    static clone(origin) {
        return _.cloneDeep(origin);
    }

    static encrypt(text) {
        const cipher = crypto.createCipher(Config.crypto.algorithm, Config.crypto.password);
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    static decrypt(text) {
        try{
            const decipher = crypto.createDecipher(Config.crypto.algorithm, Config.crypto.password);
            let dec = decipher.update(text, 'hex', 'utf8')
            dec += decipher.final('utf8');
            return dec;
        } catch (e){
            console.log("ERROR decrypt",e);
            return null;
        }
    }

}

module.exports = Utils;
