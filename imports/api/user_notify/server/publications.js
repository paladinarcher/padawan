import { Meteor } from 'meteor/meteor';
import { UserNotify } from '../user_notify.js';

Meteor.publish('notificationList', function (userId) {
    if (this.userId == userId) {
        let un = UserNotify.find( {userId:this.userId} );
        return un;
    } else {
        return [];
    }
});
