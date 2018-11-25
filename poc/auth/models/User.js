const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use async/await to wait for queries

// By default, monogodb is strict and requires a schema
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
	},
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

/* Return the array of roles for this user has */
userSchema.statics.getRoles = function(username) {
	/* FIXME */
	return this.aggregate([
		{ $unwind: '$__global_roles__'},
		{ $group: { _id: '$__global_roles__'} },
		{ $sort: {count: -1} }
	]);
}

// Export store so that it can be used in userController.js
module.exports = mongoose.model('User', userSchema);