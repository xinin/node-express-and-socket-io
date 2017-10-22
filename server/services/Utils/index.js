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
        if (!_.isObject(data)) {
            data = {
                msg: data,
                code: code || 500
            };
        } else {
            if (!data.msg) {
                data = {
                    code: data.statusCode || isNaN(data.code) ? 500 : data.code,
                    msg: data.toString() || JSON.stringify(data),
                    alert: data.alert || false
                }
            }
        }
        console.error(data); //TODO cambiar por sistema de logs
        if (data.code > 600) {
            data.code = 500;
        }
        return res.status(data.code).send({
            code: data.statusCode || data.code,
            msg: data.msg
        });
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
