const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

/* 
 * Intended to return a subset of the user information (ie. the pieces deemed
 * necessary to the application).
 * 
 * This is a private function
 */
filterUser = (user, globals) => {
	return {
		name: user['MyProfile']['firstName'] + " " + user['MyProfile']['lastName'],
		username: user['username'],
		email: user['emails'][0]['address'],
		createdAt: globals.moment(user['createdAt']).format('MMMM Do YYYY, h:mm:ss a')
	}
}

/* Return all users */
exports.users = async (req, res, next) => {
	// if (!req.isAuthenticated()) next(); // 404

	const users = await User.find();

	res.json(users.map((user) => {
			return filterUser(user, res.locals.globals);
		}));
	
	/* The following can be used when the schema is messed up */
	// res.json(users.map((user) => {
	// 	return {
	// 		name: user._doc['MyProfile']['firstName'] + " " + user._doc['MyProfile']['lastName'],
	// 		username: user._doc['username'],
	// 		email: user._doc['emails'][0]['address'],
	// 		createdAt: res.locals.globals.moment(user._doc['createdAt']).format('MMMM Do YYYY, h:mm:ss a')
	// 	}
	// }));
}

/* Return user */
exports.getUserByUsername = async(req, res, next) => {
	// TODO: Check if properly authenticated (admin or self), otherwise return a 404
	const user = await User.findOne({ username: req.params.username });
	
	if (!user) return next(); // Will result in a 404

	res.json(filterUser(user, res.locals.globals));
}

/* Return array of roles for a user */
exports.getUserRoles = async(req, res, next) => {
	// TODO: Check if properly authenticated (admin or self), otherwise return a 404
	const roles = await User.getRoles(req.params.username);

	if (!roles || roles.length === 0) return next(); // Will result in a 404

	console.log({roles});
	res.json(roles);
}

// FIXME
exports.validateRegister = (req, res, next) => {
	// express-validator
	req.sanitizeBody('firstName');
	req.checkBody('firstName', 'You must supply a first name!').notEmpty();
	req.sanitizeBody('lastName');
	req.checkBody('lastName', 'You must supply a last name!').notEmpty();
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
			// FIXME
			errors: errors.map(err => err.msg),
		});
		return; // stop the fn from running
	}
	next(); // there were no errors
}

// FIXME -- save new user to database
exports.register = async (req, res, next) => {
	const user = new User({ email: req.body.email, username: req.body.email, MyProfile: {firstName: req.body.firstName, lastName: req.body.firstName }});
	const register = promisify(User.register, User);
	await register(user, req.body.password);
	next(); // pass to authController.login
}