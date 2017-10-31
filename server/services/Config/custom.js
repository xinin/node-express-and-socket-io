'use strict';


module.exports = {
    env : 'dev', // dev, pre y pro
    app : {
        port : 9000,
        ip : 'localhost',
    },
    mongo : {
        path: `localhost:27017/skalia`
    },
    numCPUs : 2,
    crypto: {
        algorithm: 'aes-256-ctr',
        password: 'passwordDEV'
    }
};
