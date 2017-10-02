'use strict';

var express = require('express');
var controller = require('./card.controller');

var router = express.Router();

router.get('/:id', controller.get);
router.get('/', controller.list);


module.exports = router;