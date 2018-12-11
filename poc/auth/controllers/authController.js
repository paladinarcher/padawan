const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const User = mongoose.model('User');

const { transport, makeEmail } = require('../handlers/mail');

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
	const password = await bcrypt.hash(req.body.password, res.locals.globals.salt).catch((err) => {
			const error = new Error(`Password hashing error: ${err}`);
			error.status = 500;
			throw error; // caught by errorHandler
		});

	// 2. Create user to be saved into DB
	const userBody = {
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password, // hashed password

		// FIXME (the next two fields are a total hack)
		roles: req.body.roles,
		demographics: req.body.demographics,
	};

	const user = new User(userBody);

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
	//1. see if the user exists
	const user = await User.findOne({username: req.body.username}).catch((err) => {
			const error = new Error(`Database error: ${err}`);
			error.status = 500;
			throw error; // caught by errorHandler
		});
	
	//2. If no user returned, not a valid login
	if (!user) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid login credentials",
			status: 400
		}));
	}

	//3. compare incoming plaintext body.password to hashed value in DB
	const valid = await bcrypt.compare(req.body.password, user.password).catch((err) => {
			const error = new Error(`Password comparison error: ${err}`);
			error.status = 500;
			throw error; // caught by errorHandler
		});

	if (!valid) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid login credentials",
			status: 400
		}));
	}

	//4. Create a token which can be used for the session
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
	
	//5. Set the token into a cookie
	res.cookie('token', token, {
		httpOnly: false, // Might wish to consider if this creates a security issue
		maxAge: res.locals.globals.tokenTimeout,
	});

	//6. Success; the token is also returned here
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
	
	//Success
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
	//Check to see if user is logged in
	if (!req.user) return next(); // Will result in a 404

	//Success
	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}

/**
 * Password request reset validation. The method validates the username field
 * associated with the requestReset method.
 * 
 * @param res response object.
 * @param req req.user 
 *
 * @return JSON response, indicating success
 */
exports.requestResetValidation = async(req, res, next) => {
	// Sanitize username
	validateUsername(req);
	
	checkValidation(req, res, next);
}

/**
 * Request a password reset for a username. It assumes the username information
 * has already been sanitized.
 * 
 * @param res response object.
 * @param req req.user
 */
exports.requestReset = async(req, res) => {
	//1. Check if real user
	const user = await User.findOne({ username: req.body.username }).catch((err) => {
			const error = new Error("Database error");
			error.status = 500;
			throw error; // caught by errorHandler
		});

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
	 * Here is a comment why it is "best" to run randomBytes async vs sync. 
	 * Hence the usage of promisify, which turns callback functions (in 
	 * this case randomBytes) into a promise based function. I don't claim
	 * to understand why it is better to use this api async rather than 
	 * sync.
	 * 
	 * The randomBytes method returns a Buffer.
	 *
	 * https://github.com/nodejs/help/issues/457#issuecomment-274976572
	 */
	const randomBytesPromisified = promisify(randomBytes);

	const resetToken = (await randomBytesPromisified(20)).toString('hex');
	const resetTokenExpiry = Date.now() + 36000000; // 1 hour
	
	//4. the values are updated in the user's DB
	const updates = {
		resetToken,
		resetTokenExpiry
	};

	const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: updates },
			{ new: true, runValidators: true, context: 'query' }
		).catch((err) => {
			const error = new Error("Database error");
			error.status = 500;
			throw error; // caught by errorHandler
		});

	//5. send reset token email
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
		}).catch((err) => {
			const error = new Error("Error while sending reset email");
			error.status = 501;
			throw error; // caught by errorHandler
		});

	/* Do not send the resetToken back to a real front end as this would
	   create a security hole. If a hacker knows a valid username,
	   they could use a resetToken returned in the response to reset
	   that user's password, thus controlling their account. It is only 
	   sent in development mode in order to perform testing. */
	if (process.env.NODE_ENV === 'development') {
		console.warn("Development mode!!! resetToken being returned in requestreset response");
		return(res.locals.globals.jsonResponse({
			res,
			message: "Success",
			data: {
				resetToken // FOR TESTING ONLY
			},
			status: 200,
		}));
	} else {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Success",
			status: 200,
		}));
	}
	//6. Success

}

/**
 * Password reset validation. The method validates the password fields
 * associated with the reset method. This method is not external 
 * because it is called internal to the reset method
 * 
 * @param req req.user
 */
requestResetValidation = async(req) => {
	//Sanitize password
	validatePassword(req);
	req.checkBody('password_confirm', 'Confirmed password cannot be blank').notEmpty();
	req.checkBody('password_confirm', 'Password and confirmed password do not match').equals(req.body.password);

	// Validation check performed in reset method to avoid call to next
}

/**
 * Reset password based on a resetToken. Password santiziation is performed
 * internally by this method.
 * 
 * @param res response object.
 * @param req.query.resetToken resetToken from requestreset API
 * @param next next object
 *
 * @return JSON response, indicating success
 */

exports.reset = async(req, res, next) => {
	if (!req.query.resetToken) return next(); // 404

	//1. See if we can find the user based on the reset token
	const user = await User.findOne({ resetToken: req.query.resetToken }).catch((err) => {
			const error = new Error("Database error");
			error.status = 500;
			throw error; // caught by errorHandler
		});

	//2. Check if user and token is valid
	if (!user || user.resetTokenExpiry < Date.now()) {
		return(res.locals.globals.jsonResponse({
			res,
			message: "Invalid password reset token",
			status: 400
		}));
	}

	//3. Sanitize and check new password
	requestResetValidation(req, res, next);

	req.asyncValidationErrors()
		.then() // no errors
		.catch(function(errors) {
			return res.locals.globals.jsonResponse({
				res, 
				message: "Password validation error",
				errors: errors.map(err => err.msg),
				status: 422,
			});
		});

	//4. Hash the new password
	const password = await bcrypt.hash(req.body.password, res.locals.globals.salt);

	//5. update the user
	const updates = {
		password,
		resetToken: null,
		resetTokenExpiry: 0
	};

	const newUser = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: updates },
			{ new: true, runValidators: true, context: 'query' }
		).catch((err) => {
			const error = new Error("Database error");
			error.status = 500;
			throw error; // caught by errorHandler
		});

	// FIXME: Leave them signed in or require them to log in?

	//6. Success
	return(res.locals.globals.jsonResponse({
		res,
		message: "Success",
		status: 200,
	}));
}

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
