import { Meteor } from 'meteor/meteor';
import { UserSegment } from '../user_segments.js';

Meteor.publish('segmentList', function () {
    //if (Meteor.userId()) {
        return UserSegment.find();
    //} else {
    //    this.stop();
    //    return;
    //}
});
