/*
 * Catch Errors Handler
 *
 * This is a general way to catch errors when using async/await. It can wrap 
 * any async function but is typically used to wrap controllers in the routes.
 * 
 * The async function will be wrapped using catchErrors() which is responsible
 * for catching any errors they throw, and pass it along to the middleware with
 * next().
 * 
 * In the current implementation, it is used mostly to display 404 errors,
 * and the other errors are custom.
 */

exports.catchErrors = (fn) => {
	return function(req, res, next) {
		return fn(req, res, next).catch(next);
	};
};

/*
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404 and pass it along 
 * to the next error handler to display.
 */
exports.notFound = (req, res, next) => {
	const err = new Error('Page not found');
	err.status = 404;
	next(err);
};

/*
 * Development Error Handler
 *
 * In development show the stack for any other previously un-handled error.
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
