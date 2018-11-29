const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

/*
 * You don't need to make it work with the existing site
 *
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
 * 
 */

 /* Authentication not required */
router.get('/',	indexController.index);

/* Possibly these should be auth instead of user routes */
router.post('/register', 
	userController.validateRegister,
	userController.register
);
router.post('/login', userController.login); 
router.delete('/logout/', userController.logout); 
router.post('/requestreset', userController.requestReset); 
router.post('/reset', userController.reset); 

// /* Authentication required*/
router.get('/isloggedin', catchErrors(userController.isLoggedin));
router.get('/users', catchErrors(userController.users));
router.get('/user/:username', catchErrors(userController.getUserByUsername));
router.get('/user/:username/roles', catchErrors(userController.getUserRoles));


module.exports = router;