/**
 * Main application routes
 */

'use strict';

// const path = require('path');
const path = __dirname+'/../../api';

module.exports = function(app) {

  // Insert routes below
  app.use('/thing', require(path+'/thing'));
  app.use('/card', require(path+'/card'));
  app.use('/player', require(path+'/player'));

};
