/*
  This is a file of global data and helper functions, non 
  sensitive data which doesn't belong in environment 
  variables such as app secrets, database urls, etc
*/

// built in fs library for POSIX accesss to files on the server
const fs = require('fs');

// library for displaying dates (FIXME: Kinda big and not really used yet)
exports.moment = require('moment');

// Dump is a debugging function for data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Global variables for the app
exports.siteName = `Developer Level API`;
exports.majorVersion = "1";
exports.siteVersion = `${exports.majorVersion}.0.0.0`;
exports.tokenTimeout = 1000 * 60 * 60 * 24 * 365, // one year timeout on signin token/cookies
exports.salt  = parseInt(process.env.SALT, 10); //https://security.stackexchange.com/questions/51959/why-are-salted-hashes-more-secure-for-password-storage/51983#51983

// Generic JSON response function
exports.jsonResponse = ({res, message, status, errors, data}) => {
	status = status || 500;

	const response = {
		status,
		message
	}

	if (errors) {
		response.errors = errors;
	}

	if (data) {
		response.data = data;
	}

	return res.status(status).json(response);
}

/*
 * Look for permissions overlap 
 *
 * @param permissionsHeld is an array containing permissions currently held 
 * by a user (eg. ['ADMIN', 'UPDATE'])
 * @param permissionsNeeded array containing permissions required (eg. 
 * ['PERMISSIONUPDATE', 'ADMIN'])
 * 
 * @return true if a permissions overlap exists, otherwise false
 */
exports.hasPermission = (permissionsHeld, permissionsNeeded) => {
	// Do the permissions they currently have include what they are asking for?
	const matchedPermissions = permissionsHeld.filter(aPermissionTheyHave => 
		permissionsNeeded.includes(aPermissionTheyHave)
	);

	// If the array is greater than zero, proper permissions exist
	return matchedPermissions.length > 0;
}
