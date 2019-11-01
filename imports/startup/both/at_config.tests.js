// import myPostLogout from '/imports/startup/both/at_config.js';
// import {myPostLogout} from './at_config.js';
// import myPostSubmitFunc from '/imports/startup/both/at_config.js';
import { myPostLogout, mySubmitFunc, myPreSubmitFunc, myPostSubmitFunc } from '/imports/startup/both/at_config.js';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Team } from '/imports/api/teams/teams.js';

import { Session } from 'meteor/session';
import { AssertionError } from 'assert';


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
        beforeEach(function () {
            resetDatabase();
        });

        it('myPostLogout function test', function () {
            console.log('todo');
            // Meteor.call('users.insert', user);
            // Accounts.createUser(user);
            FactoryBoy.create('myTeam');
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
            console.log('uId: ', uId);
            let u = Meteor.users.findOne({ _id: uId });
            console.log('u: ', u);

            // myPostLogout();
            // let retVal = Accounts.validateNewUser();
            // let retVal = Accounts.validateLoginAttempt();
            // console.log('retVal: ', retVal);
        });
        it('test2 myPostLogout function test', function () {
            console.log('todo');
            // Meteor.call('users.insert', user);
            // Accounts.createUser(user);
            let myTeam = FactoryBoy.create('myTeam');
            function conso() {
                console.log('fake function called');
                console.log('umm second call');
                eval('console.log("string log");');
                eval('myPostSubmitFunc();');
                return myTeam;
            }
            // let postSubmitStub = sinon.stub(Team, 'findOne', conso);
            // let postSubmitStub = sinon.stub(t, 'addUsers', conso);
            // let postSubmitStub = sinon.stub(Team, 'findOne');
            // postSubmitStub.callsFake(conso);
            // postSubmitStub.callsFake(function() {
            //     console.log('in fake function');
            // });
            // postSubmitStub.returns('hi');
            // postSubmitStub.returns(conso.call());
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
            console.log('uId: ', uId);
            let u = Meteor.users.findOne({ _id: uId });
            
            myPostLogout();
            // let subVal = 'signIn';
            // let sesSpy = sinon.spy(Session, 'set');
            // let sesStub = sinon.stub(Session, 'set');
            // sesStub.returns('test');

            // mySubmitFunc(false, 'signIn');
            mySubmitFunc(false, 'signUp');

            // sesStub.restore();
            // myPreSubmitFunc()
            myPostSubmitFunc(uId, 'sample info');
            // console.log('sesSpy', sesSpy);
            // chai.assert.strictEqual()
            // console.log('Session.get("newLogin")', Session.get("newLogin"));
            // console.log('subVal: ', subVal);

            // Meteor.logout(function(err) {
            //     console.log(err);
            // });

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