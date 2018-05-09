import { UserSegment } from './user_segments.js';

Meteor.methods({
    'segment.createNewSegment'(name, dscr) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        } else {
            let s = new UserSegment({
                name: name,
                description: dscr
            });
            return s.save();
        }
    }
});
