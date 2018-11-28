/*
 * Root level api
 */
exports.index = (req, res) => {
	return res.locals.globals.jsonResponse({
		res,
		message: "Success",
		data: {
			name: res.locals.globals.siteName, 
			version: res.locals.globals.siteVersion,
			queryString: req.query,
			now: res.locals.globals.moment().format('MMMM Do YYYY, h:mm:ss a'),
		},
		status: 200
	});
}