import { Meteor } from 'meteor/meteor';

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});
