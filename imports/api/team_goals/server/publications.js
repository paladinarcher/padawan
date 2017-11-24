import { Meteor } from 'meteor/meteor';
import { TeamGoal } from '../team_goals.js';
import { User } from '../../users/users.js';

Meteor.publish('teamGoalsData', function (teamName) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin','view-goals'], teamName)) {
        return TeamGoal.find( {teamName: teamName} );
    } else {
        this.stop();
        return;
    }
});

Meteor.publishComposite('teamGoalsUsers', function (teamName) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin','view-goals'], teamName)) {
        return this.ready();
    }
    return {
        find() {
            return TeamGoal.find( {teamName: teamName} );
        },
        children: [{
            find(teamGoal) {
                let userList = teamGoal.assignedTo.concat(teamGoal.mentors).concat(teamGoal.admins);
                let fieldsObj = {};
                fieldsObj["MyProfile.firstName"] = 1;
                fieldsObj["MyProfile.lastName"] = 1;
                return User.find( {_id: userList}, {fields: fieldsObj} );
            }
        }]
    }
})
