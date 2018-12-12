const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const globals = require('./globals');
const routes = require('./routes/index');
const { verify } = require ("./util/jwt_module");
const errorHandlers = require('./handlers/errorHandlers');

const User = mongoose.model('User');

// create Express app
const app = express();

/* 
 * Application wide middleware
 */

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true })); // extended form data

// Exposes a bunch of methods for validating data. Used heavily on 
// userController.validateRegister
app.use(expressValidator());

// This validation function is used in userController.validateRegister to check
// for duplicate usernames.
app.use(expressValidator({
	customValidators: {
		isUsernameAvailable: function(username) {
			return new Promise(function(resolve, reject) {
				User.findOne({'username': username}, function(err, results) { 
					if(err) reject({
						res,
						message: "Database error while querying username from database",
						errors: results,
						status: 400
					});
					const user = results;
					if (user == null) {
						resolve();
					} else {
						reject();
					}
				});
			});
		}
	}
}));

// populate res.cookie() with any cookies that came along with the request
app.use(cookieParser());

// Check for a token to allow access to authenticated APIs (or not)
app.use( async (req, res, next) => {
	// Get token from cookie
	let { token } = req.cookies;

	/* Alternatively, cookies are not required and the application may pass the
	   token in the body of the request using the "token" property. */

	if (!token && req.body.token) {
		token = req.body.token;
	} 

	if (token) {
		/* Get the the userId from the token. This will fail if user has 
		   modified the token object */
		let jwtVerifyObj;

		try {
			jwtVerifyObj = verify({token});
		} catch (error) {
			console.log("verification error");
			return globals.jsonResponse({
				res,
				message: "Token verification failure",
				errors: [error.message],
				status: 400
			});
		}

		if (!jwtVerifyObj) {
			return globals.jsonResponse({
				res,
				message: "Token verification failed",
				status: 400
			});
		}

		const { userId, tokenTimeout } = jwtVerifyObj;

		if (!userId || !tokenTimeout) {
			return globals.jsonResponse({
				res,
				message: "Token verification failed",
				status: 400
			});
		}

		/* check to see if non-cookie token has expired (if present). */
		if (tokenTimeout < Date.now()) {
			return globals.jsonResponse({
				res,
				message: "Token has expired",
				status: 400
			});
		}
		
		// put the user on to the req which signifies user is logged in
		let user;
		try {
			user = await User.findOne({_id: userId}); 
			if (user) {
				req.user = user;
			} else {
				return globals.jsonResponse({
					res,
					message: "Database error",
					status: 500
				});
			}
		} catch (error) {
			return globals.jsonResponse({
				res,
				message: "Database failure",
				errors: [error.message],
				status: 500
			});
		}
	}

	// Everything is happy, move on
	next();
});

// pass variables to all requests
app.use((req, res, next) => {
	res.locals.globals = globals;
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
  });

// check the incoming route, if it is supported, this function will handle it
app.use(`/api/v${globals.majorVersion}`, routes);

console.log(`Currently running in ****${process.env.NODE_ENV}**** mode`);

// If the above routes didnt work, a 404 will occur
app.use(errorHandlers.notFound);

// Otherwise it was an unexpected error
if (process.env.NODE_ENV === 'development') {
	/* Development Error Handler - Prints stack trace */
	app.use(errorHandlers.developmentErrors);
} else {
	// production error handler
	app.use(errorHandlers.productionErrors);
}

// app.use(errorHandlers.productionErrors);

// export it so we can start the site in start.js
module.exports = app;
