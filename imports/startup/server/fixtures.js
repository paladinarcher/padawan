// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Question } from '../../api/questions/questions.js';
import { User } from '../../api/users/users.js';

Meteor.startup(() => {
    if(Meteor.users.find().count() < 1) {
        Accounts.createUser({
            username: 'admin',
            email: 'admin@mydomain.com',
            password: 'admin',
            isAdmin: true,
            profile: {
                first_name: 'Admin',
                last_name: 'Admin',
                gender: 'female'
            }
        });
    }
    //Roles.addUsersToRoles('5TrqZfGdCjLRZxoEP', 'admin', Roles.GLOBAL_GROUP);
    //Roles.addUsersToRoles('ro2NRbs7xmTuq72Mc', 'admin', Roles.GLOBAL_GROUP);
    
});
