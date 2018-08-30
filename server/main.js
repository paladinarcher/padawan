// Server entry point, imports all server code

import '/imports/startup/both';
import '/imports/startup/server';

Accounts.validateLoginAttempt(function(options) {
  // search through the emails, and see if it matches the email loging in with
  if (options.methodArguments[0].user.email.verified === true) {
      return true;
  } else {
      throw new Meteor.Error('email-not-verified', 'Please verify your email before logging in');
  }


});
