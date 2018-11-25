const mongoose = require('mongoose');
const Roles = mongoose.model('Role');

exports.roles = async (req, res, next) => {
	const users = await Roles.find();

	res.json(users);
}