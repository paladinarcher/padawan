// import myPostLogout from '/imports/startup/both/at_config.js';
// import {myPostLogout} from './at_config.js';
// import myPostSubmitFunc from '/imports/startup/both/at_config.js';
import { myPostLogout, mySubmitFunc, myPreSubmitFunc, myPostSubmitFunc, accessCodeFunc } from '/imports/startup/both/at_config.js';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Team } from '/imports/api/teams/teams.js';

import { Session } from 'meteor/session';
import { AssertionError } from 'assert';
import { firstNameFunc, lastNameFunc } from './at_config';


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
    describe('startup/both/at_config', function () {
        it('at_config should pass Istanbul coverage', function () {
            resetDatabase();
            let myTeam = FactoryBoy.create('myTeam');
            function conso() {
                console.log('fake function called');
                console.log('umm second call');
                eval('console.log("string log");');
                eval('myPostSubmitFunc();');
                return myTeam;
            }
            let t = Team.findOne({ Name: Team.Default.Name });
            let uId = Accounts.createUser({
                username: 'flyUserName',
                email: 'FlyUserNam@mydomain.com',
                password: 'password',
                profile: {
                    first_name: 'Bob',
                    last_name: 'Thompson',
                    gender: 'male'
                }
            });
            let u = Meteor.users.findOne({ _id: uId });
            chai.assert.strictEqual('flyUserName', u.username, 'The users username should be flyUserName');
            myPostLogout();
            mySubmitFunc(false, 'signUp');
            myPostSubmitFunc(uId, 'sample info');
            accessCodeFunc('imaPADLo');
            accessCodeFunc('nothere');
            let stubLog = sinon.stub(console, 'log').returns('dont console log');
            firstNameFunc('first');
            lastNameFunc('last');
            stubLog.restore();
        });
    });
}