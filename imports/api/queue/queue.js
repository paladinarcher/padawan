import { Meteor } from 'meteor/meteor';
//import Bull from 'bull';
var Bull = require('bull');

const UserActivitiesQueue = new Bull('User Activities Processing', {
  limiter: Meteor.settings.private.Queue.Limiter,
  redis: Meteor.settings.private.Queue.Redis
});

export { UserActivitiesQueue };