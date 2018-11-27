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

// populates res.cookie() with any cookies that came along with the request
app.use(cookieParser());

// decode the JWT (if any) and add userId to request
// Token is required to authenticate session
app.use((req, res, next) => {
	// Get the JWT token from the cookie
	const { token } = req.cookies;
	if (token) {
		// Get the the userId from the token
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		
		// put the userId on to the req
		req.userId = userId;
	}

	next();
});

/* Populate current user object on the req, to save 
   lookups if needed */
app.use(async (req, res, next) => {
	// if they aren't logged in, skip this
	if (!req.userId) 
		return next();

	const user = await User.find({_id: req.userId}); // FIXME: Try catch
	req.user = user;
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
