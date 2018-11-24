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

	next();
}

/*
 * A simple test API, which reverse the parameter
 *
 * For example, http://localhost:8888/api/v1/test/reversethis
 * 
 * Results in,
 * 
 * {
 * 	"reversedValue": "sihtesrever"
 * }
 */
exports.reverse = (req, res, next) => {
	res.json({
		reversedValue: [...req.params.name].reverse().join(''),
	});

	next();
}