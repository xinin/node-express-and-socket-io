/**
 * Main application file
 */

'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const App = require(__dirname + '/services/App');
let app = App.launch();
module.exports = app;

