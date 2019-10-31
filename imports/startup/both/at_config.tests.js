// import myPostLogout from '/imports/startup/both/at_config.js';
// import {myPostLogout} from './at_config.js';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Team } from '/imports/api/teams/teams.js';



const user = {
    email: 'cool@email.com',
    password: 'coolPassword',
    profile: {
        name: { first: 'cool', last: 'karl' },
    },
    roles: { 'No Team': [] },
};

FactoryBoy.define('myTeam', Team, {
    Name: Team.Default.Name,
    CreatedBy: 'cool karl'
});

if (Meteor.isServer) {
    describe.only('startup/both/at_config', function () {
        it('myPostLogout function test', function () {
            console.log('todo');
            // Meteor.call('users.insert', user);
            // Accounts.createUser(user);
            let t = Team.findOne({ Name: Team.Default.Name });
            FactoryBoy.create('myTeam');
            Accounts.createUser({
                username: 'flyUserName',
                email: 'FlyUserNam@mydomain.com',
                password: 'password',
                profile: {
                    first_name: 'Bob',
                    last_name: 'Thompson',
                    gender: 'male'
                }
            });
            // myPostLogout();
            // let retVal = Accounts.validateNewUser();
            // let retVal = Accounts.validateLoginAttempt();
            // console.log('retVal: ', retVal);
        });
    });
}
// myPostLogout
// test that myPostLogout sends FlowRouter to the signin page
// mySubmitFunc
// test signIn and signUp
// myPreSubmitFunc
// myPostSubmitFunc
// addFields
// test each func: function(value) code
// onCreateUser 
// test pretty much everything
// validateNewUser
// validateLoginAttempt