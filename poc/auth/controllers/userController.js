const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

exports.validateRegister = (req, res, next) => {
	req.sanitizeBody('firstName');
	req.checkBody('firstName', 'You must supply a first name!').notEmpty();
	req.sanitizeBody('lastName');
	req.checkBody('lastName', 'You must supply a last name!').notEmpty();
	req.sanitizeBody('username');
	req.checkBody('username', 'You must supply a user name!').notEmpty();
	req.checkBody('email', 'That Email is not valid!').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		gmail_remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});
	req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
	req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
	req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);
	
	const errors = req.validationErrors();
	if (errors) {
		res.json({
			message: "Registration validation error",
			errors: errors.map(err => err.msg),
			status: 400,
		});
		return; // stop the fn from running
	}
	next(); // there were no errors
}


exports.register = async (req, res) => {
	// Hash the password
	const password = await bcrypt.hash(req.body.password, 10); 	// SALT length is 10 FIXME

	// Create user in DB, get user id in return
	const user = new User({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		password: password,
	});
	
	await user.save(); // FIXME: needs to be try catch

	res.json({
		message: "Success",
		status: 201,
	});
}

exports.login = async (req, res) => {
	// see if the user exists
	const user = await User.findOne({username: req.body.username}); // try/catch

	// If no user returned, not a valid login
	if (!user) {
		res.json({
			message: "Invalid login credentials",
			status: 400,
		});
		return;	
	}

	const valid = await bcrypt.compare(req.body.password, user.password);

	if (!valid) {
		res.json({
			message: "Invalid login credentials",
			status: 400,
		});
		return;
	}

	// Create a token which can be used for the session
	const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
	res.cookie('token', token, {
		// httpOnly: true, // The cookie and hence JWT token can only be accessed via http, and not JS
		maxAge: 1000 * 60 * 60 * 24 * 365, // one year timeout on cookie and signin
	});

	res.json({
		message: "success", 
		status: 200
		// Could possibly return token here
	});
}

/* Return all users */
exports.users = async (req, res, next) => {
	// if (!req.isAuthenticated()) next(); // 404

	const users = await User.find();

	res.json({
		message: "Success",
		data: users,
		status: 200,
	});
}

/* Return user */
exports.getUserByUsername = async(req, res, next) => {
	if (!req.userId) return next(); // Will result in a 404

	const user = await User.findOne({ username: req.params.username });
	console.log(user);

	if (!user || user._id != req.userId) return next(); // Will result in a 404

	res.json({
		message: "Success",
		data: req.user, // FIXME: Needs filtering
		status: 200,
	});
}

/* Return array of roles for a user */
exports.getUserRoles = async(req, res, next) => {
	// TODO: Check if properly authenticated (admin or self), otherwise return a 404
	const roles = await User.getRoles(req.params.username);

	if (!roles || roles.length === 0) return next(); // Will result in a 404

	//FIXME .... needs more testing
	res.json({
		message: "Success",
		data: roles,
		status: 200,
	});
}
