import { UserFeedback } from './user_feedback.js';

Meteor.methods({
    'feedback.createNewFeedback'(newFeedback) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        newFeedback.userId = Meteor.userId();
        let f = new UserFeedback(newFeedback);
        return f.save();
    }
})
