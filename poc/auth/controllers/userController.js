const mongoose = require('mongoose');
const User = mongoose.model('User');

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
		["admin", "manage_users", "view_members"]);

	if (hasPermission) {
			// Get the array of all users
			users = await User.find().catch((err) => {
				const error = new Error("Database error");
				error.status = 500;
				throw error; // caught by errorHandler
			});
	
		// Success
		return(res.locals.globals.jsonResponse({
			res,
			message:  "Success",
			// FIXME: filter user data
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
