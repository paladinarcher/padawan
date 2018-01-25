import { Meteor } from 'meteor/meteor';
import { IndividualGoal } from '../individual_goals.js';
import { User } from '../../users/users.js';

Meteor.publish('individualGoalsData', function (userId) {
    if (Meteor.userId() === userId || Roles.userIsInRole(Meteor.userId(), ['admin','view-goals'], teamName)) {
        return IndividualGoal.find( {userId: userId} );
    } else {
        this.stop();
        return;
    }
});
