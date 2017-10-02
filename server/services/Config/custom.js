'use strict';


module.exports = {
    env : 'dev', // dev, pre y pro
    app : {
        port : 9000,
        ip : '0.0.0.0',
    },
    mongo : {
        path: `localhost:27017/skalia`
    }
};
