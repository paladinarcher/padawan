import {Team } from './teams.js';

Meteor.methods({
    'team.createNewTeam'(newTeam) {
        if ( !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP) ) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        newTeam.CreatedBy = Meteor.userId();
        let t = new Team(newTeam);
        return t.save();
    }
});
