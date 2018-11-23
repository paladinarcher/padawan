const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const {promisify} = require('es6-promisify');

const routes = require('./routes/index');

// create Express app
const app = express();

// no view templating engine setup
// no static files

/* 
 * Application wide middleware
 */

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// populates res.cookie() with any cookies that came along with the request
app.use(cookieParser());

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use('/api/v1', routes);

// export it so we can start the site in start.js
module.exports = app;
