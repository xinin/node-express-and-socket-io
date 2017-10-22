'use strict';

var express = require('express');
var controller = require('./player.controller');

var router = express.Router();

router.post('/register', controller.register);

module.exports = router;