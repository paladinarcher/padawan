const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/*
 *	returns simple object, including any query params
 */
router.get('/', indexController.index);

router.get('/reverse/:name', indexController.reverse);

module.exports = router;