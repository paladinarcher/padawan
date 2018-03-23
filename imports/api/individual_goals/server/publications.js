import { Meteor } from 'meteor/meteor';
import { IndividualGoal } from '../individual_goals.js';
import { User } from '../../users/users.js';

Meteor.publish('individualGoalsData', function (userId) {
    if (Meteor.userId() === userId) {
        return IndividualGoal.find( {userId: userId} );
    } else if (Roles.userIsInRole(Meteor.userId(), ['admin','view-goals'], Roles.GLOBAL_GROUP)) {
        return IndividualGoal.find( {
            userId: userId,
            privacy: {"$in":["team","public"]}
        } );
    } else {
        this.stop();
        return;
    }
});
