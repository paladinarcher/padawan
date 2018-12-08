const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

 /* Authentication not required */
router.get('/',	catchErrors(indexController.index));

/* Possibly these should be auth instead of user routes */
router.post('/register', 
	catchErrors(userController.validateRegistration),
	catchErrors(userController.register));
router.post('/login', userController.login); 
router.delete('/logout', userController.logout); 
router.post('/requestreset', userController.requestReset); 
router.post('/reset', userController.reset); 

// /* Authentication required*/
router.get('/isloggedin', catchErrors(userController.isLoggedin));
router.get('/users', catchErrors(userController.users));
router.get('/user/:username', catchErrors(userController.getUserByUsername));
router.get('/user/:username/roles', catchErrors(userController.getUserRoles));


module.exports = router;