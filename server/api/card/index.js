'use strict';

const express = require('express');
const controller = require('./card.controller');

const router = express.Router();

router.get('/:id', controller.get);
router.get('/', controller.list);




module.exports = router;