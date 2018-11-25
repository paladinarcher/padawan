const mongoose = require('mongoose');
const User = mongoose.model('User');

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
exports.users = async (req, res) => {
	// TODO: Check if properly authenticated (admin), otherwise return a 404
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