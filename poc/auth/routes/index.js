const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const rolesController = require('../controllers/rolesController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', indexController.index);
router.get('/reverse/:name', indexController.reverse);

router.get('/users', catchErrors(userController.users));
router.get('/user/:slug', catchErrors(userController.getUserBySlug));

router.get('/roles', catchErrors(rolesController.roles));

module.exports = router;