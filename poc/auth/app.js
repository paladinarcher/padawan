const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const jwt = require ('jsonwebtoken');
const globals = require('./globals');
const routes = require('./routes/index');
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

	if (req.body.token) {
		token = req.body.token;
	} 

	let success = true;
	let message;
	let errors;

	if (token && !(Object.keys(token).length === 0)) {
		/* Get the the userId from the token. This will fail if user has 
		   modified the token object */
		let jwtVerifyObj;

		try {
			jwtVerifyObj = jwt.verify(token, process.env.APP_SECRET);
		} catch (error) {
			return globals.jsonResponse({
				res,
				message: "Token verification failure",
				errors: [error.message],
				status: 400
			});
		}

		userId = jwtVerifyObj.userId;
		tokenAge = jwtVerifyObj.tokenAge;

		if (!userId) {
			message = "Token verfication failed";
			success = false;
		}

		/* check to see if non-cookie token has expired (if present). Cookie
		   timeouts on the other hand are handled via the cookie library */
		if (tokenAge && !success) {
			if (Date.now() > tokenAge + globals.tokenTimeout) {
				message = "Token has expired";
				success = false;
			}
		}
		
		// put the user on to the req
		let user;
		try {
			user = await User.findOne({_id: userId}); 
			if (user) {
				req.user = user;
			} else {
				message = "Failed to find user";
				success = false;
			}
		} catch (error) {
			message = "Database failure";
			success = false;
			errors = [error.message];
		}
	}

	// If no token, the user can access public routes
	if (!token || !success) {
		if (req.user) {
			if (req.user)
				delete req.user;
		}
	}

	/* 
	 * If a token came through, it might or might not imply the client is
	 * trying to access a non-public API. In any case, if a token is present
	 * either through cookie or incoming data request, and if token validation
	 * has failed, an error response will be returned. Stated differently, any
	 * token failure will result in an error response. If the client wishes to 
	 * access a public API either don't pass a token or pass a valid token.
	 */ 
	if (token && !success) {
		return globals.jsonResponse({
			res,
			message,
			errors,
			status: 400
		});
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

// export it so we can start the site in start.js
module.exports = app;
