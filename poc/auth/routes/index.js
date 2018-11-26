const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

/*
 * - receive authentication information and respond properly (including 
 * returning success/failure/whatever else needs returning)
 * 
 * - receive some sort of user identifier and return whether that user 
 *   is logged in
 * 
 * - receive some sort of user identifier and return basic demographic 
 *   info
 * 
 * - receive some sort of user identifier and return global user roles 
 *  (admin, etc; Team roles are not necessary)
 */

 /* A basic informational route */
router.get('/', indexController.index);

router.get('/users', catchErrors(userController.users));
router.get('/user/:username', catchErrors(userController.getUserByUsername));
router.get('/user/:username/demographics', catchErrors(userController.getUserDemographics));
router.get('/user/:username/roles', catchErrors(userController.getUserRoles));

router.post('/register',
	userController.validateRegister,
	userController.register,
	authController.login
);
router.post('/login', catchErrors(userController.roles));

router.get('/roles', catchErrors(roleController.roles));

module.exports = router;