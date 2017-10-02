/**
 * Main application file
 */

'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const App = require(__dirname + '/services/App');
let app = App.launch();
module.exports = app;
// Set default node environment to development


// // let config = App.Config();
// process.env.NODE_ENV = config.env;
// let app = AppBBVA.launch();
// module.exports = app;
//
//
//
//
// var express = require('express');
// var config = require('./config/environment');
// // Setup server
// var app = express();
// var server = require('http').createServer(app);
// require('./config/express')(app);
// require('./routes')(app);
//
// // Start server
// server.listen(config.port, config.ip, function () {
//   console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
// });
//
// // Expose app
// module.exports = app;
