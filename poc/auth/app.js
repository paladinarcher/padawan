const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const {promisify} = require('es6-promisify');

const globals = require('./globals');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

// create Express app
const app = express();

// no view templating engine setup
// app.set('views', path.join(__dirname, 'views')); 
// app.set('view engine', 'pug');

// no static files
// app.use(express.static(path.join(__dirname, 'public')));

/* 
 * Application wide middleware
 */

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // extended form data

// populates res.cookie() with any cookies that came along with the request
app.use(cookieParser());

// Sessions allows storage information for visitors from request to 
// request. This keeps users logged in
app.use(session({
	secret: process.env.APP_SECRET,
	key: process.env.APP_KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));

// // Passport JS is what is used to handle user logins
app.use(passport.initialize());
app.use(passport.session());

// pass variables to all requests
app.use((req, res, next) => {
	res.locals.globals = globals;
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
  });

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use(`/api/v${globals.majorVersion}`, routes);

console.log(process.env.NODE_ENV);

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
