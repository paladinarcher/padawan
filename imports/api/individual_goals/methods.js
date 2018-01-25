import { IndividualGoal } from './individual_goals.js';

Meteor.methods({
    'individualgoals.createNewGoal'(goal) {
        if (goal.userId !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin'], goal.teamName)) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        let g = new IndividualGoal(goal);
        return g.save();
    }
});
