// All users-related publications

import { Meteor } from 'meteor/meteor';
import { User } from '../users.js';

Meteor.publish('userData', function () {
    if(this.userId) {
        return User.find({ _id: this.userId }, {
            fields: { roles: 1, MyProfile: 1 }
        });
    } else {
        return this.ready();
    }
});

Meteor.publish('userList', function () {
    if ( Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP ) ) {
        return User.find( {} );
    } else {
        return User.find( {}, {
            fields: { roles: 1, username: 1, MyProfile: 1 }
        } );
    }
});
