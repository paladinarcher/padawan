const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

 /* Authentication not required */
router.get('/',	catchErrors(indexController.index));

/* Auth routes */
router.post('/register', 
	catchErrors(authController.validateRegistration),
	catchErrors(authController.register));
router.post('/login', 
	catchErrors(authController.validateLogin),
	catchErrors(authController.login)); 
router.delete('/logout', authController.logout); 
router.post('/requestreset', authController.requestReset); 
router.post('/reset', authController.reset);
router.get('/isloggedin', catchErrors(authController.isLoggedin)); 

// User routes
router.get('/users', catchErrors(userController.users));
router.get('/user/:username', catchErrors(userController.getUserByUsername));
router.get('/user/:username/roles', catchErrors(userController.getUserRoles));

module.exports = router;