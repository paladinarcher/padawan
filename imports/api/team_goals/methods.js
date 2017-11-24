import { TeamGoal } from './team_goals.js';

Meteor.methods({
    'teamgoals.createNewGoal'(goal) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'], goal.teamName)) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        let g = new TeamGoal(goal);
        return g.save();
    }
});
