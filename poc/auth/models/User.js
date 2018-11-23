const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use async/await to wait for queries

// By default, monogodb is strict and requires a schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true, // white space trim
		required: 'Please enter a user name' // required is true, string is error messsage
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags : [String]
});

// Export store so that it can be used in userController.js
module.exports = mongoose.model('User', userSchema);