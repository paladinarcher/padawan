import { Promise } from 'meteor/promise'

/**
 * 
 * Meteor promise handler - testing this  
 */

export const callWithPromise = (method, ...params) => {
	return new Promise((resolve, reject) => {
	  Meteor.call(method, ...params, (error, result) => {
        // if (error) reject(error);
        if (error) resolve(error)
		else resolve(result);
	  });
	});
}