const mongoose = require('mongoose');
const User = mongoose.model('User');

// Enum datatype
const UserInfoType = Object.freeze({"DEMOGRAPHICS":1, "ROLES":2});

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
			const users = await User.find().catch((err) => {
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
	getUserInfo(req, res, next, UserInfoType.DEMOGRAPHICS);
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
	getUserInfo(req, res, next, UserInfoType.ROLES);
}

/**
 * A private method to return the information requested for the user
 * 
 * @param res response object.
 * @param req req.user 
 * @param next next.obj
 * @param infoType USerInfoType
 *
 * @return JSON response, indicating success
 */
getUserInfo = async(req, res, next, infoType) => {
		// check to see if any user is logged in
		if (!req.user) return next(); // Will result in a 404

		// find the user queried by the username
		const user = await User.findOne({ username: req.params.username }).catch((err) => {
			const error = new Error("Database error");
			error.status = 500;
			throw error; // caught by errorHandler
		});
	
		// Find out permissions for logged in user: Can they see information of other users
		const hasPermission = res.locals.globals.hasPermission(req.user.roles, 
			["admin", "manage-users", "view-members"]);
	
		/*
		 * If the currently logged in user has permissions to view other users,
		 * or if the user being queried is the same as the currently logged in 
		 * user, show the demographics
		 */
		if ((user && hasPermission) || (user && (`${user._id}` === `${req.user._id}`))) {
			const data = {};
			
			switch (infoType) {
				case UserInfoType.ROLES: {
					data.username = user.username;
					data.roles = user.roles;
					break;
				}

				case UserInfoType.DEMOGRAPHICS: {
					data.name = user.demographics.name;
					data.gender = user.demographics.gender;
					data.email = user.email;
					break;
				}

				default: 
					data.nodata = "";
			}

			return(res.locals.globals.jsonResponse({
				res,
				message:  "Success",
				data,
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
