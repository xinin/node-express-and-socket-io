'use strict';

const App = require(__dirname + '/../App');

const _ = require('lodash');


class Utils {

    static response(req, res, data, code) {
        return res.status(code).json({
            code,
            data
        });
    }

    static error(req, res, data, code) {

        let response = {
            code: code || (data.code && !isNaN(data.code))? data.code : 500
        };

        if(data.code){
            delete data.code;
        }
        response.data = data;
        console.error(data); //TODO cambiar por sistema de logs
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

}

module.exports = Utils;
