/*
  This is a file of global data and helper functions, non 
  sensitive data which doesn't belong in environment 
  variables such as app secrets, database urls, etc
*/

// built in fs library for POSIX accesss to files on the server
const fs = require('fs');

// library for displaying dates
exports.moment = require('moment');

// Dump is a debugging function for data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Some details about the site
exports.siteName = `Developer Level API`;
exports.siteVersion = "1.0.0";
