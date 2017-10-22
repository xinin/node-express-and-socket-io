'use strict';

var express = require('express');
var controller = require('./lobby.controller');

var router = express.Router();

// router.get('/', controller.index);

router.post('/', controller.queue);

module.exports = router;