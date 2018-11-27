/*
 * Root level api
 */
exports.index = (req, res, next) => {
	res.json({
		name: res.locals.globals.siteName, 
		version: res.locals.globals.siteVersion,
		queryString: req.query,
		now: res.locals.globals.moment().format('MMMM Do YYYY, h:mm:ss a'),
	});
}