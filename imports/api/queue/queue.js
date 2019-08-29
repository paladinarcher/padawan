import { Meteor } from 'meteor/meteor';

var Queue = require('bull');

var UserActivitiesQueue = new Queue('User Activities Processing', {
  limiter: Meteor.settings.private.Queue.Limiter,
  redis: Meteor.settings.private.Queue.Redis
});

export { UserActivitiesQueue };