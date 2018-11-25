const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use async/await to wait for queries

// By default, monogodb is strict and requires a schema
const userSchema = new mongoose.Schema({
	emails: [
		{
			address: {
				type: String,
				trim: true,
			}
		},
		{
			verified: Boolean
		},
	],
	MyProfile: {
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		gender: Boolean,
		UserType: {
			AnsweredQuestions: [],
			Personality: {
				IE: String,
				JP: String,
				NS: String,
				TF: String,
			}
		},
	},
	profile: {
		first_name: {
			type: String,
			trim: true,
		},
		last_name: {
			type: String,
			trim: true,
		},
		gender: {
			type: String,
			trim: true,
		}
	},
	roles: {
		__global_roles__:{
			type: mongoose.Schema.ObjectId,
			ref: 'Roles',
		},
	}
});

// Export store so that it can be used in userController.js
module.exports = mongoose.model('User', userSchema);