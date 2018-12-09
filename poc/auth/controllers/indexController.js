/*
 * Root level api
 */
exports.index = async (req, res) => {
	data = {
		name: res.locals.globals.siteName, 
		version: res.locals.globals.siteVersion,
		now: res.locals.globals.moment().format('MMMM Do YYYY, h:mm:ss a'),
	};

	return res.locals.globals.jsonResponse({
		res,
		message: "Success",
		data,
		status: 200
	});
}