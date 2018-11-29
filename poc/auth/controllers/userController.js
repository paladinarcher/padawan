const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const User = mongoose.model('User');

const { transport, makeEmail } = require('../handlers/mail');

/**
 * Validate user creation data. This function is intended to be chained
 * together via usage of next() with register().
 * 
 * @param req.body.email user's email address.
 * @param req.body.username user's username.
 * @param req.body.firstName user's first name.
 * @param req.body.lastName user's last name.
 * @param req.body.password user's. password.
 * @param res response object.
 
 * @return JSON response if validation fails, or next() if success.
 */
exports.validateRegister = async (req, res, next) => {
	req.sanitizeBody('firstName');
	req.checkBody('firstName', 'You must supply a first name.').notEmpty();

	req.sanitizeBody('lastName');
	req.checkBody('lastName', 'You must supply a last name,').notEmpty();

	req.sanitizeBody('username');
	req.checkBody('username', 'You must supply a user name.').notEmpty();
	req.checkBody('username', `${req.body.username} username is already used.`).isUsernameAvailable();

	req.checkBody('email', 'That Email is not valid!').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		gmail_remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});

	req.checkBody('password', 'Password cannot be blank').notEmpty();
	req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
	req.checkBody('password-confirm', 'Password and confirmed password do not match').equals(req.body.password);
	
	req.asyncValidationErrors()
		.then(() => next()) // no errors
		.catch(function(errors) {;
			return res.locals.globals.jsonResponse({
				res, 
				message: "Registration validation error",
				errors: errors.map(err => err.msg),
				status: 400,
			});
		});
}

/**
 * Register user, which saves the user in the DB. All incoming data is assumed
 * to be sanitized and validated.
 * 
 * @param req.body.email user's email address.
 * @param req.body.username user's username.
 * @param req.body.firstName user's first name.
 * @param req.body.lastName user's last name.
 * @param req.body.password user's. password.
 * @param res response object.
 
 * @return JSON response, indicating success or failure.
 */
exports.register = async (req, res) => {
	let password;

	// Hash the password
	try {
		// SALT length is hardcoded at 10
		password = await bcrypt.hash(req.body.password, 10);
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "bcrypt password hash error",
			errors: [error.message],
			status: 400
		}));
	}

	// Create user in DB
	try {
		const user = await new User({
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			password: password,

			// FIXME (the next two fields are a total hack)
			roles: req.body.roles,
			demographics: req.body.demographics,
		}).save();
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Unable to save user information to the database",
			errors: [error.message],
			status: 400
		}));
	}

	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 201
	}));
	// If wanted to signin user at login time, next() could be called here
}

/**
 * Login user.
 * 
 * @param req.body.username user's username.
 * @param req.body.password user's. password.
 * @param res response object.
 
 * @return JSON response, indicating success or failure. If successful, the
 * token object is set into a cookie as well as returned in the JSON.
 */
exports.login = async (req, res) => {
	// see if the user exists
	let user = null;
	try {
		user = await User.findOne({username: req.body.username});
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while reading database",
			errors: [error.message],
			status: 400
		}));
	}
	
	// If no user returned, not a valid login
	if (!user) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid login credentials",
			status: 400
		}));
	}

	let valid = null;

	try {
		valid = await bcrypt.compare(req.body.password, user.password);
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "bcrypt comparison error",
			errors: [error.message],
			status: 400
		}));
	}

	if (!valid) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid login credentials",
			status: 400
		}));
	}

	// Create a token which can be used for the session
	const token = jwt.sign({ 
		userId: user._id,
		/* Might wish to consider a shorter timeout as compared to cookies */
		/* Even if the user decodes token on the client, any adjustment to the
		   token would be detected and flagged as an error */
		tokenTimeout: Date.now() + res.locals.globals.tokenTimeout, 
	}, process.env.APP_SECRET);
	
	// Set the token into a cookie
	res.cookie('token', token, {
		httpOnly: false, // Might wish to consider if this creates a security issue
		maxAge: res.locals.globals.tokenTimeout,
	});

	// Token is also returned here
	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
		data: token
	}));
}
/**
 * Logout user.
 * 
 * @param res response object.
 *
 * @return JSON response, indicating success
 */
exports.logout = async (req, res) => {
	res.clearCookie('token');
	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200
	}));
}

/**
 * Check if user is logged in
 * 
 * @param res response object.
 * @param req req.user 
 * @param next
 *
 * @return JSON response, indicating success
 */
exports.isLoggedin = async(req, res, next) => {
	// check to see if user is logged in
	if (!req.user) return next(); // Will result in a 404

	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}

/**
 * Return a list of all users for properly authenticated users with proper
 * permissions (ie. admin).
 * 
 * @param res response object.
 *
 * @return JSON response, indicating success
 */
exports.users = async (req, res, next) => {
	// check to see if any user is logged in
	if (!req.user) return next(); // Will result in a 404
	const hasPermission = res.locals.globals.hasPermission(req.user.roles, ["admin", "manage-users", "view-members"]);

	if (hasPermission) {
		let users = null;
		try {
			users = await User.find();
		} catch (error) {
			return(res.locals.globals.jsonResponse({
				res,
				message: "Error while reading database",
				errors: [error.message],
				status: 400
			}));
		}
	
		// Success
		return(res.locals.globals.jsonResponse({
			res,
			message:  "Success",
			data: users.map(user => ({
				name: user.demographics.name,
				gender: user.demographics.gender,
				email: user.email,
			})),
			status: 200,
		}));
	} else {
		next(); //404
	}
}

/**
 * Return user demographic information for a username, if the logged in user is
 * properly authenticated with permissions (ie. admin, self, etc).
 * 
 * @param res response object.
 * @param req req.user 
 * @param next
 *
 * @return JSON response, indicating success
 */
exports.getUserByUsername = async(req, res, next) => {
	// check to see if any user is logged in
	if (!req.user) return next(); // Will result in a 404

	// find the user queried by the username
	let user = null;
	try {
		user = await User.findOne({ username: req.params.username });
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while reading database",
			errors: [error.message],
			status: 400
		}));
	}

	const hasPermission = res.locals.globals.hasPermission(req.user.roles, ["admin", "manage-users", "view-members"]);

	/*
	 * If the currently logged in user has permissions to view other users,
	 * or if the user being queried is the same as the currently logged in 
	 * user, show the demographics
	 */
	if ((user && hasPermission) || (user && (`${user._id}` === `${req.user._id}`))) {
		return(res.locals.globals.jsonResponse({
			res,
			message:  "Success",
			data: {
				name: user.demographics.name,
				gender: user.demographics.gender,
				email: user.email,
			},
			status: 200,
		}));
	} else if (!user && hasPermission) {
		return(res.locals.globals.jsonResponse({
			res,
			message: `${req.params.username}: Not found`,
			status: 404 // In this case, the 404 says no user for username found
		}));
	} else {
		return next(); //404
	}
}

/**
 * Return user information for a username, if the logged in user is properly 
 * authenticated with permissions (ie. admin, self, etc).
 * 
 * @param res response object.
 * @param req req.user 
 * @param next
 *
 * @return JSON response, indicating success
 */
exports.getUserRoles = async(req, res, next) => {
	// check to see if any user is logged in
	if (!req.user) return next(); // Will result in a 404

	// find the user queried by the username
	let user = null;
	try {
		user = await User.findOne({ username: req.params.username });
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while reading database",
			errors: [error.message],
			status: 400
		}));
	}

	const hasPermission = res.locals.globals.hasPermission(req.user.roles, ["admin", "manage-users", "view-members"]);

	/*
	 * If the currently logged in user has permissions to view other users,
	 * or if the user being queried is the same as the currently logged in 
	 * user, show the demographics
	 */
	if ((user && hasPermission) || (user && (`${user._id}` === `${req.user._id}`))) {
		return(res.locals.globals.jsonResponse({
			res,
			message:  "Success",
			data: {
				username: user.username,
				roles: user.roles,
			},
			status: 200,
		}));
	} else if (!user && hasPermission) {
		return(res.locals.globals.jsonResponse({
			res,
			message: `${req.params.username}: Not found`,
			status: 404 // In this case, the 404 says no user for username found
		}));
	} else {
		return next(); //404
	}
}

/**
 * Request a password reset for a username
 * 
 * @param res response object.
 * @param req req.user 
 * @param next
 *
 * @return JSON response, indicating success
 */

exports.requestReset = async(req, res, next) => {
	//1. Check if real user
	// Sanitize username
	req.sanitizeBody('username');
	req.checkBody('username', 'You must supply a user name.').notEmpty();
	
	req.asyncValidationErrors()
		.then(() => {}) // no errors
		.catch(function(errors) {;
			return res.locals.globals.jsonResponse({
				res, 
				message: "Request reset validation error",
				errors: errors.map(err => err.msg),
				status: 400,
			});
		});

	try {
		user = await User.findOne({ username: req.body.username });
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while reading database",
			errors: [error.message],
			status: 400
		}));
	}

	if (!user) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid username supplied",
			status: 400
		}));
	}

	//2. Set a reset token and expiry on that user
	const randomBytesPromisified = promisify(randomBytes);

	const resetToken = (await randomBytesPromisified(20)).toString('hex');
	const resetTokenExpiry = Date.now() + 36000000; // 1 hour
	
	const updates = {
		resetToken,
		resetTokenExpiry
	};

	try {
		user = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: updates },
			{ new: true, runValidators: true, context: 'query' }
		);
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while updating database",
			errors: [error.message],
			status: 400
		}));
	}

	//3. send reset token email
	try {
		const mailRes = await transport.sendMail({
			from: '<no-reply>@codedeveloper.com',
			to: user.email,
			subject: 'Your password reset token',
			html: makeEmail(`Your password reset token is here!
									\n\n
									<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
										Click here to reset
								</a>`)
		});
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while sending reset email",
			errors: [error.message],
			status: 400
		}));
	}

	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}

/**
 * Reset password based on a resetToken
 * 
 * @param res response object.
 * @param req req.user 
 * @param next
 *
 * @return JSON response, indicating success
 */

exports.reset = async(req, res, next) => {
	// Check if it is a legit reset token
	let user = null;
	try {
		user = await User.findOne({ resetToken: req.query.resetToken });
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while reading database",
			errors: [error.message],
			status: 400
		}));
	}

	if (!user || user.resetTokenExpiry < (Date.now() - 36000000)) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid password reset token",
			status: 400
		}));
	}

	// Sanitize and check new password
	req.checkBody('password', 'Password cannot be blank').notEmpty();
	req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
	req.checkBody('password-confirm', 'Password and confirmed password do not match').equals(req.body.password);
	
	req.asyncValidationErrors()
		.then(() => {}) // no errors
		.catch(function(errors) {;
			return res.locals.globals.jsonResponse({
				res, 
				message: "Password reset validation error",
				errors: errors.map(err => err.msg),
				status: 400,
			});
		});

	// Hash the new password
	// SALT length is 10
	const password = await bcrypt.hash(req.body.password, 10);

	// update the user
	const updates = {
		password,
		resetToken: null,
		resetTokenExpiry: 0
	};

	try {
		const newUser = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: updates },
			{ new: true, runValidators: true, context: 'query' }
		);
	} catch (error) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Error while updating database",
			errors: [error.message],
			status: 400
		}));
	}

	// User needs to signin with updated password

	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}
