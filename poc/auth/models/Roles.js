const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use async/await to wait for queries

// By default, monogodb is strict and requires a schema
const rolesSchema = new mongoose.Schema({
	_id: {
		type: String,
		trim: true,
	},
	name: {
		type: String,
		trim: true, // white space trim
	},
});

// Export store so that it can be used in rolesController.js
module.exports = mongoose.model('Roles', rolesSchema);