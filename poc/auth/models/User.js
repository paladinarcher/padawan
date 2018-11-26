const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Might not need this; only here for silencing warnings
const bcrypt = require('bcrypt');
const validator = require('validator');

// FIXME: Provide nicer errors
const mongodbErrorHandler = require('mongoose-mongodb-errors');

// FIXME: Using passport local strategy
const passportLocalMongoose = require('passport-local-mongoose');


// By default, monogodb is strict and requires a schema
// FIXME: This has been created by my own inference of the padawan DB
const userSchema = new mongoose.Schema({
	_id: {
		type: String,
		trim: true,
	},
	createdAt: {
		type: Date,
	},
	updateAt: {
		type: Date,
	},
	services: {
		password: {
			bcrypt: {
				type: String,
				trim: true,
			},
		},
		email: {
			verificationTokens: [
				{
					address: {
						type: String,
						trim: true,
						validate: [validator.isEmail, 'Invalid Email Address'],
					},
					token: {
						type: String,
						trim: true,
					},
					when: {
						type: Date,
					},
				},
			],
		},
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		//required: 'username required',
	},
	emails: [
		{
			address: {
				type: String,
				trim: true,
				validate: [validator.isEmail, 'Invalid Email Address'],
			}
		},
		{
			verified: Boolean
		},
	],
	slug: {
		type: String,
		trim: true,
	},
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
	teams: [
		{
			type: String,
			trim: true,	
		}
	],

	/* FIXME */
	roles: {
		__global_roles__: {
			type: mongoose.Schema.ObjectId,
			ref: 'Role',
		},
	}
});

/* FIXME: Return the array of roles for this user has */
userSchema.statics.getRoles = function(username) {
	/* FIXME */
	return this.aggregate([
		{ $unwind: '$__global_roles__'},
		{ $group: { _id: '$__global_roles__'} },
		{ $sort: {count: -1} }
	]);
}

// FIXME: Using passport local strategy; this adds passport fields to the userSchema
userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(mongodbErrorHandler);

// Export store so that it can be used in userController.js
module.exports = mongoose.model('User', userSchema);