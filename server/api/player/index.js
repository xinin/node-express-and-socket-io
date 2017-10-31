'use strict';

var express = require('express');
var controller = require('./player.controller');

var router = express.Router();

router.post('/signUp', controller.signUp);
router.post('/logIn', controller.logIn);

module.exports = router;