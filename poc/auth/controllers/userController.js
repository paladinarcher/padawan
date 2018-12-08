const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const User = mongoose.model('User');

const { transport, makeEmail } = require('../handlers/mail');

/**
 * A method to validate first and last names.
 * 
 * @param req.body.firstName user's first name.
 * @param req.body.lastName user's last name.
 */
validateName = (req) => {
	req.sanitizeBody('firstName');
	req.checkBody('firstName', 'You must supply a first name.').notEmpty();

	req.sanitizeBody('lastName');
	req.checkBody('lastName', 'You must supply a last name,').notEmpty();
}

/**
 * A method to validate the username. It does not check for username 
 * uniqueness; this must be performed seperately.
 * 
 * @param req.body.username user's username.
 */
validateUsername = (req) => {
	req.sanitizeBody('username');
	req.checkBody('username', 'You must supply a user name.').notEmpty();
}

/**
 * A method to validate user email address.
 * 
 * @param req.body.email user's email address.
 */
validateEmail = (req) => {
	req.checkBody('email', 'That email address is not valid!').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		gmail_remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});
}

/**
 * A method to validate registration information. This method is intended to
 * be chained together via usage of next() with register().
 * 
 * @param req.body.password user's. password.
 */
validatePassword = (req) => {
	req.checkBody('password', 'Password cannot be blank').notEmpty();
}

/**
 * A method to report any validation errors if any. This method must be called
 * after any req.checkBody() methods have been called. It can be used with 
 * either synchronous or asynchronous validators. It only returns if validation
 * errors are found. If no validation errors are found, next() is called. 
 * Typically it is used internally, but has been added to exports so it can 
 * be used externally.
 * 
 * @param req request object.
 * @param res response object.
 * @param next next object.
 * 
 * @return JSON response if validation fails, or next() if success.
 */
checkValidation = (req, res, next) => {
	req.asyncValidationErrors()
		.then(() => next()) // no errors
		.catch(function(errors) {
			return res.locals.globals.jsonResponse({
				res, 
				message: "Registration validation error",
				errors: errors.map(err => err.msg),
				status: 422,
			});
		});
}

/**
 * A method to validate registration information. This method is intended to
 * be chained together via usage of next() with register().
 * 
 * @param req.body.email user's email address.
 * @param req.body.username user's username.
 * @param req.body.firstName user's first name.
 * @param req.body.lastName user's last name.
 * @param req.body.password user's. password.
 * @param res response object.
 *
 * @return JSON response if validation fails, or next() if success.
 */
exports.validateRegistration = async (req, res, next) => {
	validateName(req, res, next);
	
	validateUsername(req, res, next);
	req.checkBody('username', 
		`${req.body.username} username is already used.`).isUsernameAvailable();

	validateEmail(req, res, next);

	validatePassword(req, res, next);
	req.checkBody('password_confirm', 
		'Confirmed password cannot be blank').notEmpty();
	req.checkBody('password_confirm', 
		'Password and confirmed password do not match').equals(req.body.password);

	checkValidation(req, res, next);
}

/**
 * Register user, which saves the user in the DB. All incoming data is assumed
 * to be sanitized and validated, for example by using the validateRegistration
 * method.
 * 
 * @param req.body.email user's email address.
 * @param req.body.username user's username.
 * @param req.body.firstName user's first name.
 * @param req.body.lastName user's last name.
 * @param req.body.password user's. password.
 * @param res response object.
 *
 * @return JSON response, indicating success or failure.
 */
exports.register = async (req, res) => {
	// 1. Hash the password
	// SALT length is hardcoded at 10
	const password = await bcrypt.hash(req.body.password, 10).catch((err) => {
		const error = new Error(`Password hashing error: ${err}`);
		error.status = 500;
		throw error; // caught by errorHandler
	});

	// 2. Create user to be saved into DB
	const user = new User({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password, // hashed password

		// FIXME (the next two fields are a total hack)
		roles: req.body.roles,
		demographics: req.body.demographics,
	});

	// 3. Save user to DB
	await user.save().catch((err) => {
		const error = new Error("Database error");
		error.status = 500;
		throw error; // caught by errorHandler
	});

	//3. Registration success
	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 201
	}));
	
	/* If wanted to login user at registration time, next() could be called 
	   here and then chain the login in the '/register' route like this:
	   
	   router.post('/register', 
			userController.validateRegister,
			userController.register,
			userController.login);
	 */
}

/**
 * A method to validate login information. This method is intended to
 * be chained together via usage of next() with login().
 * 
 * @param req.body.username user's username.
 * @param req.body.password user's. password.
 * @param res response object.
 *
 * @return JSON response if validation fails, or next() if success.
 */
exports.validateLogin = async (req, res, next) => {
	validateUsername(req, res, next);
	validatePassword(req, res, next);

	checkValidation(req, res, next);
}

/**
 * Login user. The username and password are assumed to be sanitized
 * prior to calling this method for example by using the 
 * validateLogin method.
 * 
 * @param req.body.username user's username.
 * @param req.body.password user's. password.
 * @param res response object.
 
 * @return JSON response, indicating success or failure. If successful, the
 * token object is set into a cookie as well as returned in the JSON.
 * 
 * FIXME: Two factor authentication is one idea (ie. send a text) but is a 
 * password even required?? How about just sending an email to obtain a token?
 */
exports.login = async (req, res) => {
	// 1. see if the user exists
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
	
	// 2. If no user returned, not a valid login
	if (!user) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid login credentials",
			status: 400
		}));
	}

	let valid = null;

	// 3. compare incoming plaintext body.password to hashed value in DB
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

	// 4. Create a token which can be used for the session
	/*
	 * https://jwt.io/introduction/
	 * https://auth0.com/learn/json-web-tokens/
	 *
	 * Although JWTs can be encrypted to also provide secrecy between 
	 * parties, we will focus on signed tokens. Signed tokens can 
	 * verify the integrity of the payload contained within it, while 
	 * encrypted tokens hide those payload from other parties. When 
	 * tokens are signed using public/private key pairs, the signature 
	 * also certifies that only the party holding the private key is 
	 * the one that signed it.
	 * 
	 * Stated differently, the contents of this token are visible to 
	 * anyone with little effort (for example, by pasting it into
	 * the debugger box located at https://jwt.io). See the following
	 * comment:
	 * 
	 * "Do note that for signed tokens this information, though 
	 * protected against tampering, is readable by anyone. Do not put 
	 * secret information in the payload or header elements of a JWT 
	 * unless it is encrypted.""
	 * 
	 * However, any attempt to modify the contents of the token will 
	 * result in a token validation failure.
	 */
	const token = jwt.sign({
		/* Could in theory try using a pure function which generates a hash
		   value to the userId */
		userId: user._id,
		/* Might wish to consider a shorter timeout as compared to cookies */
		tokenTimeout: Date.now() + res.locals.globals.tokenTimeout, 
	}, process.env.APP_SECRET);
	
	// 5. Set the token into a cookie
	res.cookie('token', token, {
		httpOnly: false, // Might wish to consider if this creates a security issue
		maxAge: res.locals.globals.tokenTimeout,
	});

	// 6. Token is also returned here
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
	
	// Logouts for clients holding a token must be cleared by the client
	
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

	// Check to see if user has permission to view other users
	const hasPermission = res.locals.globals.hasPermission(req.user.roles, 
		["admin", "manage-users", "view-members"]);

	if (hasPermission) {
		let users = null;
		try {
			// Get the array of all users
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
			// Fixme: filter user data
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
	// 1. check to see if any user is logged in
	if (!req.user) return next(); // Will result in a 404

	// 2. find the user queried by the username parameter
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

	/* 3. Find out permissions for logged in user: Can they see information of
		  other users */
	const hasPermission = res.locals.globals.hasPermission(req.user.roles, 
		["admin", "manage-users", "view-members"]);

	/*
	 * 4. 
	 *
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

	/* 5. If the currently logged in user does have permission to view other users
	   and if the user being queried doesn't exist in the database, then inform
	   the logged in user (who has admin permissions) that no such user exists */
	} else if (!user && hasPermission) {
		return(res.locals.globals.jsonResponse({
			res,
			message: `${req.params.username}: Not found`,
			status: 404 // In this case, the 404 says no user for username found
		}));

	/* 6. No permissions for the curently logged in user, means we don't provide any 
	   information on the queried user */
	} else {
		return next(); //404
	}
}

/**
 * Return user information for a username, if the logged in user is properly 
 * authenticated with permissions (ie. admin, self, etc).
 * 
 * FIXME: Merge this function with getUserByUsername??
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

	// Find out permissions for logged in user: Can they see information of other users
	const hasPermission = res.locals.globals.hasPermission(req.user.roles, 
		["admin", "manage-users", "view-members"]);

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
 *
 * @return JSON response, indicating success
 */

exports.requestReset = async(req, res) => {
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
				status: 422,
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

	// FIXME: Might be a security hole here by informing that no such user exists
	if (!user) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid username supplied",
			status: 400
		}));
	}

	//2. Set a reset token and expiry on that user
	/* 
	 * Generate a series of random bytes, which will be transformed into a 
	 * hexadecimal string. This value will be the reset token. The value of
	 * the reset token is completely unrelated to the user information in 
	 * DB, and can thus be safely provided publicly, and it will be 
	 * associated with a timeout.
	 * 
	 * I don't claim to understand why, but here is a comment why it is "best"
	 * to run randomBytes async vs sync. Hence the usage of promisify, which
	 * turns callback functions (in this case randomBytes) into a promise 
	 * based function. The randomBytes method returns a Buffer.
	 *
	 * https://github.com/nodejs/help/issues/457#issuecomment-274976572
	 */
	const randomBytesPromisified = promisify(randomBytes);

	const resetToken = (await randomBytesPromisified(20)).toString('hex');
	const resetTokenExpiry = Date.now() + 36000000; // 1 hour
	
	// 3. the values are updated in the user's DB
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
			// FIXME: use a templating engine
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
 *
 * @return JSON response, indicating success
 */

exports.reset = async(req, res) => {
	// 1. See if we can find the user based on the reset token
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

	// 2. Check if user and token is valid
	if (!user || user.resetTokenExpiry < (Date.now() - 36000000)) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid password reset token",
			status: 422
		}));
	}

	// 3. Sanitize and check new password
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
				status: 422,
			});
		});

	// 4. Hash the new password
	// SALT length is 10
	const password = await bcrypt.hash(req.body.password, 10);

	// 5. update the user
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

	// FIXME: Leave them signed in or require them to log in?

	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}
