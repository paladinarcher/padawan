/*
 * Catch Errors Handler
 *
 * With async/await, a way to catch errors is needed.
 * Instead of using try{} catch(e) {} in each controller, 
 * the function will be wrapped in catchErrors() to catch 
 * any errors they throw, and pass it along to the 
 * middleware with next()
 */

exports.catchErrors = (fn) => {
	return function(req, res, next) {
		return fn(req, res, next).catch(next);
	};
};

/*
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404 and 
 * pass it along to the next error handler to display
 */
exports.notFound = (req, res, next) => {
	const err = new Error('Page not found');
	err.status = 404;
	next(err);
};

/*
 * MongoDB Validation Error Handler

 * Detect if there are mongodb validation errors that we can 
 * nicely show via flash messages

 * Not used
 */

exports.flashValidationErrors = (err, req, res, next) => {
	if (!err.errors) return next(err);
	// validation errors look like
	const errorKeys = Object.keys(err.errors);
	errorKeys.forEach(key => req.flash('error', err.errors[key].message));
	res.redirect('back');
};


/*
 * Development Error Handler
 *
 * In development show the stack for any other previously 
 * un-handled error
 */
exports.developmentErrors = (err, req, res, next) => {
	err.stack = err.stack || '';
	const errorDetails = {
		message: err.message,
		status: err.status,
		stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
	};
	res.status(err.status || 500);
	res.format({
		'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
	});
};


/*
 * Production Error Handler
 *
 * No stacktraces are leaked to user
 */
exports.productionErrors = (err, req, res, next) => {
	res.status(err.status || 500);
	res.json({errorMessage: err.message});
};
