'use strict';


module.exports = {
    env : 'dev', // dev, pre y pro
    app : {
        port : 3000,
        ip : '127.0.0.1',
    },
    mongo : {
        path: `localhost:27017/skalia`
    },
    numCPUs : 1
};
