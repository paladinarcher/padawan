/*
 * Root level api
 */
exports.index = (req, res) => {
	data = {
		name: res.locals.globals.siteName, 
		version: res.locals.globals.siteVersion,
		now: res.locals.globals.moment().format('MMMM Do YYYY, h:mm:ss a'),
	};

	if (Object.keys(req.query).length !== 0) {
		data.queryString = req.query;
	}

	return res.locals.globals.jsonResponse({
		res,
		message: "Success",
		data,
		status: 200
	});
}