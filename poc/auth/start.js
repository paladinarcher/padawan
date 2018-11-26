const mongoose = require('mongoose');

// Make sure we are running node 7.6+ (support for promises)
console.log(process.versions);
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
	console.log('\nYou\'re on an older version of node that isn\'t supported (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
	process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to Database and handle any bad connections
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
	console.error(`Error connection to database → ${err.message}`);
});

// Import all models
require('./models/User.js');
require('./models/Role.js');

// Start the server!
// note that app is the instance of express. Also note that the Meteor
// app must already be started, causing MongoDB to be started before
// running this app.
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
