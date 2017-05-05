// All users-related publications

import { Meteor } from 'meteor/meteor';
import { User } from '../users.js';

Meteor.publish('userData', function () {
    if(this.userId) {
        return User.find({ _id: this.userId }, {
            fields: { roles: 1, MyProfile: 1 }
        });
    } else {
        this.ready();
    }
});