'use strict';

var path = require('path');
var _ = require('lodash');

var Config = {
    param1 : 'tururu',
    security : {
        start : 3
    }
};

let custom;
try{
    custom = require('/var/properties/config.js');
}catch(e){
    custom = require(__dirname+'/custom.js');
}

// Export the config object based on the NODE_ENV
// ==============================================

//TODO coger de sistemas
module.exports = _.merge(
    Config,
    custom || {});
