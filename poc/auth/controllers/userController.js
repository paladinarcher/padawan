const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.users = async (req, res, next) => {
	const users = await User.find();

	res.json(users);
	// res.json(users.map((user) => {
	// 	return {
	// 		name: user._doc['MyProfile']['firstName'] + " " + user._doc['MyProfile']['lastName'],
	// 		username: user._doc['username'],
	// 		email: user._doc['emails'][0]['address'],
	// 		createdAt: res.locals.globals.moment(user._doc['createdAt']).format('MMMM Do YYYY, h:mm:ss a')
	// 	}
	// }));
}

exports.getUserBySlug = async(req, res, next) => {
	const user = await User.findOne({ slug: req.params.slug });
	if (!user) return next(); // Will result in a 404

	const { _doc:userFromDb } = user;

	response = {
		name: userFromDb['MyProfile']['firstName'] + " " + userFromDb['MyProfile']['lastName'],
		username: userFromDb['username'],
		email: userFromDb['emails'][0]['address'],
		createdAt: res.locals.globals.moment(userFromDb['createdAt']).format('MMMM Do YYYY, h:mm:ss a')
	}
	res.json(response);
}