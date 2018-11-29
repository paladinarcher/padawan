const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // FIXME: Might not need this; only here for silencing warnings

const mongodbErrorHandler = require('mongoose-mongodb-errors');

// By default, monogodb is strict and requires a schema
// FIXME: This has been created by my own inference of the padawan DB
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		unique: true,
		required: 'username required',
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: 'email required',
	},
	password: {
		type: String,
		trim: true,
	},
	firstName: {
		type: String,
		trim: true,
	},
	lastName: {
		type: String,
		trim: true,
	},
	resetToken: {
		type: String,
		trim: true,
	},
	resetTokenExpiry: {
		type: Number
	},
	demographics: {
		name: {
			type: String,
			trim: true,
		},
		gender: {
			type: String,
			trim: true,
		}
	},
	roles: [
		{
			type: String,
			trim: true,
		},
	],
});

userSchema.plugin(mongodbErrorHandler);

// Export store so that it can be used in userController.js
module.exports = mongoose.model('User', userSchema);