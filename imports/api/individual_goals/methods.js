import { IndividualGoal } from './individual_goals.js';

Meteor.methods({
    'individualgoals.createNewGoal'(goal) {
        if (goal.userId !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin'], goal.teamName)) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        goal.createdBy = Meteor.userId();
        console.log('000000000000000000000000000000000000000000');
        console.log(goal.privacy);
        let g = new IndividualGoal(goal);
        return g.save();
    }
});
