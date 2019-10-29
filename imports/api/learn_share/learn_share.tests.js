import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { User, Profile, UserType, MyersBriggs, Answer, QnaireAnswer } from '/imports/api/users/users.js';
import { Team } from '/imports/api/teams/teams.js';
import { fstat } from 'fs';
var fs = require('fs');


let testData = {
    lssess: {
        id: "2017-11-01-ab",
        title: "Test session for Mocha",
        titleChange: "Test title change",
        notes: "Test notes 123"
    },
    participant: {
        id: "Xz4XTeeb5YEj5J3f3",
        name: "Test User"
    }
};

if (Meteor.isServer) {
    describe('LearnShareSession older original', function () {
        this.timeout(15000);
        it('can add a participant', function () {
            //resetDatabase();
            let lssess = new LearnShareSession({
                _id: testData.lssess.id,
                title: testData.lssess.title
            });
            lssess.save();

            lssess.addParticipant(testData.participant);

            let testSess = LearnShareSession.findOne({ _id: testData.lssess.id, participants: { $elemMatch: { id: testData.participant.id } } });
            //let testSess = LearnShareSession.findOne( {_id:lssid} );
            chai.assert(testSess, true);
        });
        it('can add a presenter', function () {
            let lssess = LearnShareSession.findOne({ _id: testData.lssess.id });
            lssess.addPresenter(testData.participant);
            let testSess = LearnShareSession.findOne({ _id: testData.lssess.id, presenters: { $elemMatch: { id: testData.participant.id } } });
            chai.assert(testSess, true);
        });
        it('can remove a presenter', function () {
            let lssess = LearnShareSession.findOne({ _id: testData.lssess.id });
            lssess.removePresenter(testData.participant.id);
            let testSess = LearnShareSession.findOne({ _id: testData.lssess.id, presenters: { $elemMatch: { id: testData.participant.id } } });
            chai.assert(!testSess, true);
        });
        it('can remove a participant', function () {
            let lssess = LearnShareSession.findOne({ _id: testData.lssess.id });
            lssess.removeParticipant(testData.participant.id);
            let testSess = LearnShareSession.findOne({ _id: testData.lssess.id, participants: { $elemMatch: { id: testData.participant.id } } });
            chai.assert(!testSess, true);
        });
        it('can save session title and notes'/*, function () {
            let lssess = LearnShareSession.findOne( {_id:testData.lssess.id} );
            lssess.saveText( testData.lssess.titleChange, testData.lssess.notes );
            let testSess = LearnShareSession.findOne( {_id:testData.lssess.id} );
            chai.assert(
                testSess.title == testData.lssess.titleChange &&
                testSess.notes == testData.lssess.notes,
                true
            );
        }*/); //this test fails because user is not logged in; test remains pending until user auth can be set up for unit tests
    });
}

//==============Below are for a new set of tests added after 10/23/2019 geared toward Istanbul coverage=================

if (Meteor.isServer) {

    const MLSID = 'myLearnShareID';
    const macUser = {
        "id": "macUserID",
        "name": "Mac Jack"
    };

    FactoryBoy.define('viperUser', User, {
        '_id': 'viperUserId',
        'MyProfile': {
            'firstName': 'Viper',
            'lastName': 'Vay'
        },
        "roles": {
            "No Team": [
              "member",
              "No-Permissions"
            ]
        },
        "services": {
            "password": {
              "bcrypt": "$2a$10$h17tYYy6G2pPFDHAOLNdT.BA0kqu61/d2CeWCGGlsbB9ZMiG1tykK"
            },
            "resume": {
              "loginTokens": []
            },
            "email": {
              "verificationTokens": [
                {
                  "token": "PyAOY9pH6ejjQSp5rb3nHzNhd7OsfSxrTP2FDrMYgI2",
                  "address": "FlyingCockroach@mydomain.com",
                  "when": "2018-11-21T19:34:58.643Z"
                },
                {
                  "token": "vWfX5GfuTzFtirr47zSNgI19IlwP5VEiWg-OLvG4iQ-",
                  "address": "FlyingCockroach@mydomain.com",
                  "when": "2018-11-21T21:15:41.955Z"
                }
              ]
            }
        }
    });

    FactoryBoy.define('duplicateGuest', LearnShareSession, {
        "_id": MLSID,
        "createdAt": "2018-07-06T20:36:55.087Z",
        "updatedAt": "2018-07-06T21:37:18.567Z",
        "title": "Friday July 6th",
        "participants": [{
            id: "macUserId", name: 'Mac Jack' },
            { id: "macUserId", name: 'Mac Jack' }
        ],
        "guests": [{
            id: "macUserId1", name: 'Mac Jack' },
            { id: "macUserId2", name: 'Mac Jack' }
        ]
    });

    FactoryBoy.define('myLearnShare', LearnShareSession, {
        "_id": MLSID,
        "createdAt": "2018-07-06T20:36:55.087Z",
        "updatedAt": "2018-07-06T21:37:18.567Z",
        "title": "Friday July 6th",
        // "notes":"Moroni failed at taking notes today....\nDeb = Resiliance\nDarren = The Slight Edge book",
        // "notes":["Moroni failed at taking notes today....\nDeb = Resiliance\nDarren = The Slight Edge book"],
        "participants": [
            {
                "id": "captainSmackId",
                "name": "Captain Smack"
            },
            {
                "id": "frF29wnTrpeDwMKoA",
                "name": "Moroni Pickering"
            },
            {
                "id": "gQgt2eucaghmudQnD",
                "name": "Wayne Jensen"
            },
            {
                "id": "ro2NRbs7xmTuq72Mc",
                "name": "Paul Robbins"
            },
            {
                "id": "5TrqZfGdCjLRZxoEP",
                "name": "Jay Ward"
            },
            {
                "id": "8KpjJ9YzeD6Ji46ZT",
                "name": "Bryant Austin"
            },
            {
                "id": "7ATZQo4hDfyGmsTtK",
                "name": "Bowen Pickering"
            },
            {
                "id": "eQoQLL5PsQNKc2RTh",
                "name": "Cascade Pickering"
            },
            {
                "id": "PkJMi3K22vcCaoj9v",
                "name": "Debra Starks"
            },
            {
                "id": "6RsteCA4qoKgz54Dj",
                "name": "Darren Moody"
            }
        ],
        "guests": [],
        "presenters": [
            {
                "id": "captainSmackId",
                "name": "Captain Smack"
            },
            {
                "id": "ro2NRbs7xmTuq72Mc",
                "name": "Paul Robbins"
            },
            {
                "id": "8KpjJ9YzeD6Ji46ZT",
                "name": "Bryant Austin"
            },
            {
                "id": "5TrqZfGdCjLRZxoEP",
                "name": "Jay Ward"
            },
            {
                "id": "frF29wnTrpeDwMKoA",
                "name": "Moroni Pickering"
            },
            {
                "id": "eQoQLL5PsQNKc2RTh",
                "name": "Cascade Pickering"
            },
            {
                "id": "gQgt2eucaghmudQnD",
                "name": "Wayne Jensen"
            },
            {
                "id": "7ATZQo4hDfyGmsTtK",
                "name": "Bowen Pickering"
            },
            {
                "id": "PkJMi3K22vcCaoj9v",
                "name": "Debra Starks"
            },
            {
                "id": "6RsteCA4qoKgz54Dj",
                "name": "Darren Moody"
            }
        ],
        "state": "locked",
        "skypeUrl": "https://meet.lync.com/paladinarcher.com/craig/19J5HQ5M",
        "teamId": ""
    });

    function unlockLearnShare(learnShare) {
        // admin users should be able to unlock LearnShare
        let adminStub = sinon.stub(Roles, "userIsInRole");
        adminStub.returns(true);
        learnShare.unlockSession();
        adminStub.restore();
        learnShare = LearnShareSession.findOne({ _id: learnShare._id });
        // console.log('learnShare: ', learnShare);
        chai.assert.strictEqual(learnShare.state, 'active', 'unlockSession should have set the LearnShare state to active');
        return learnShare;
    }

    describe('LearnShareSession for Istanbul coverage', function () {
        beforeEach(function () {
            resetDatabase();
        });
        // addPresenter
        it('tests for addPresenter unlockSession and lockSession', function () { // also test lock and unlock
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            let methodResponse = myLS.addPresenter(macUser);
            // console.log('methodSuccess', methodSuccess);
            chai.assert.strictEqual(methodResponse, undefined, 'addPresenter should return undefined since LearnShare is locked');

            // non admin users should not be able to unlock LearnShare
            function unlockThrowsError() {
                myLS.unlockSession();
            }
            chai.assert.throws(unlockThrowsError, Error, 'You are not authorized', 'non admin accessing lock should have thrown an error');

            // admin users should be able to unlock LearnShare
            let adminStub = sinon.stub(Roles, "userIsInRole");
            adminStub.returns(true);
            myLS.unlockSession();
            adminStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(myLS.state, 'active', 'unlockSession should have set the LearnShare state to active');

            // Add a presenter
            // console.log('before myLS: ', myLS);
            myLS.addPresenter(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            let macIndex = myLS.presenters.findIndex((element) => {
                return element.id == macUser.id;
            });
            // console.log('macIndex: ', macIndex);
            chai.assert.strictEqual(myLS.presenters[macIndex].name, macUser.name, 'addPresenter should have added the macUser presenter');

            // test for adding duplicate presenters. If length stays the same, a duplicate isn't added
            let startPresenterSize = myLS.presenters.length;
            // console.log('startPresenterSize: ', startPresenterSize);
            let tryDuplicate = myLS.addPresenter(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.isFalse(tryDuplicate, 'Adding a duplicate presenter should have returned false');
            chai.assert.strictEqual(startPresenterSize, myLS.presenters.length, 'duplicate presenters should not have increased the presenters array size');


            // test locking session as non admin
            function lockThrowsError() {
                myLS.lockSession();
            }
            chai.assert.throws(lockThrowsError, Error, 'You are not authorized', 'non admin accessing lock should have thrown an error');

            // test locking session as an admin
            let lockStub = sinon.stub(Roles, 'userIsInRole');
            lockStub.returns(true);
            myLS.lockSession();
            lockStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(myLS.state, 'locked', 'Admin should have been able to locked the LearnShareSession');
        });
        // addParticipant
        it('tests for addParticipant method', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // addParticipant returns undefined if the state is locked
            let methResp = myLS.addParticipant(macUser);
            chai.assert.strictEqual(methResp, undefined, 'addParticipant should have returned undefined because LearnShare is locked');

            // Add a participant
            myLS = unlockLearnShare(myLS);
            // console.log('before myLS: ', myLS);
            myLS.addParticipant(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            let macIndex = myLS.participants.findIndex((element) => {
                return element.id == macUser.id;
            });
            // console.log('macIndex: ', macIndex);
            chai.assert.strictEqual(myLS.participants[macIndex].name, macUser.name, 'addParticipant should have added the macUser participant');

            // test that addParticipant returns false when trying to add duplicate participants. If length stays the same, a duplicate isn't added.
            let startParticipantSize = myLS.participants.length;
            // console.log('startParticipantSize: ', startParticipantSize);
            let tryDuplicate = myLS.addParticipant(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.isFalse(tryDuplicate, 'Adding a duplicate participant should have returned false');
            chai.assert.strictEqual(startParticipantSize, myLS.participants.length, 'duplicate participant should not have increased the participant array size');
            
        });
        // removeParticipant
        it('test for removeParticipant method', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // test that the removeParticipant returns undefined if the Session state is locked
            let methRtn = myLS.removeParticipant(macUser);
            // console.log('methRtn: ', methRtn);
            chai.assert.strictEqual(methRtn, undefined, 'removeParticipant while LearnShare is locked should have returned undefined');
        });
        // removeGuest
        it('tests for the saveGuest and removeGuest methods', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);

            // test that the removeGuest returns undefined if the Session state is locked
            let methRtn = myLS.removeGuest(macUser);
            chai.assert.strictEqual(methRtn, undefined, 'removeGuest method should return undefined when LearnShare is locked');

            // add a guest
            myLS = unlockLearnShare(myLS);
            myLS.saveGuest(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(myLS.guests[0].name, macUser.name, 'The saveGuest method did not add a guest to the LearnShare');

            // test that guests can be removed
            myLS.removeGuest(macUser.id); // removeGuest takes a userId, not a user
            myLS = LearnShareSession.findOne({ _id: MLSID });
            let guestLength = myLS.guests.length;
            // console.log('myLS 2: ', myLS);
            chai.assert.strictEqual(guestLength, 0, 'The LearnShare guests array should be empty');
        });
        // removePresenter
        it('removePresenter method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // test that removePresenter returns undefined if learnShare is locked
            let methRet = myLS.removePresenter('captainSmackId');
            chai.assert.strictEqual(methRet, undefined, 'removePresenter should have returned undefined. The LearnShare is locked.')
        });
        // setNextParticipant
        it('setNextParticipant method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // test that setNextParticipant does not change nextParticipant for non admin users.
            myLS.setNextParticipant(macUser.id);
            // console.log('myLS.nextParticipant: ', myLS.nextParticipant);
            // console.log('myLS: ', myLS);
            chai.assert.notStrictEqual(myLS.nextParticipant, macUser.id, 'setNextParticipant should have not changed nextParticipant for non Admin users');

            // test that using setNextParticipant as an admin sets nextParticipant to given userId
            let adminStub = sinon.stub(Roles, 'userIsInRole');
            adminStub.returns(true);
            myLS.setNextParticipant(macUser.id);
            adminStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(myLS.nextParticipant, macUser.id, 'setNextParticipant should have changed nextParticipant for Admin users');
        });
        // addParticipantSelf
        it('addParticipantSelf method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // addParticipantSelf returns undefined if LearnShare state is locked
            let methRet = myLS.addParticipantSelf(macUser.id);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(methRet, undefined, 'The LearnShare is locked. addParticipantSelf should return undefined.');

            // if Meteor.userId is falsey, "You are not authorized" error is thrown when calling addParticipantSelf
            myLS = unlockLearnShare(myLS);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            function addParticipantSelfError() {
                myLS.addParticipantSelf();
            }
            let stubId = sinon.stub(Meteor, 'userId');
            stubId.returns(false);
            chai.assert.throws(addParticipantSelfError, Error, 'You are not authorized', 'False userId in addParticipantSelf should have thrown an error');
            stubId.restore();

            // User.findOne stub that returns false throws a 403 'You are not authorized' error
            FactoryBoy.create('viperUser');
            // console.log('myLS: ', myLS);
            let viper = User.findOne('viperUserId');
            chai.assert.strictEqual(viper.MyProfile.firstName, 'Viper', 'The viper first name should be viper. Failed to create viper user');
            let errStub = sinon.stub(User, 'findOne');
            errStub.returns(false);
            function userFindErr() {
                myLS.addParticipantSelf();
            }
            chai.assert.throws(userFindErr, Error, 'You are not authorized', 'User.findOne false stub should throw an error');
            errStub.restore();

            // addParticipantSelf adds the users MyProfile name to the LearnShare participants
            function containsViperName(value) {
                return value.name == 'Viper Vay';
            }
            let filterViper = myLS.participants.filter(containsViperName);
            // console.log('filterViper1: ', filterViper);
            chai.assert.strictEqual(filterViper.length, 0, 'Viper user should not have been added to participants yet');
            let stubViper = sinon.stub(Meteor, 'userId');
            stubViper.returns(viper._id);
            myLS.addParticipantSelf();
            stubViper.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            filterViper = myLS.participants.filter(containsViperName);
            // console.log('filterViper: ', filterViper);
            chai.assert.strictEqual(filterViper.length, 1, 'Viper user should have been added to participants');

        });
        // saveGuest
        it('saveGuest method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // saveGuest returns undefined if LearnSharestate is locked
            let methRet = myLS.saveGuest(macUser);
            chai.assert.strictEqual(methRet, undefined, 'LearnShare is locked. savedGuests should return undefined');
            myLS = LearnShareSession.findOne({ _id: MLSID });

            // if guest already exists (id), the new guest user name will replace the old guests name
            let fakeMacUser = {
                "id": "macUserID",
                "name": "Fake Jack"
            };
            function hasMacId (value) {
                return value.id == macUser.id;
            }
            let guestMac = myLS.guests.filter(hasMacId);
            chai.assert.strictEqual(guestMac.length, 0, 'Mac userId should not be in guests list');
            myLS = unlockLearnShare(myLS);
            methRet = myLS.saveGuest(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('methRet: ', methRet);
            chai.assert.strictEqual(methRet, 1, 'saveGuest should have returned 1 when saving the guest');
            guestMac = myLS.guests.filter(hasMacId);
            chai.assert.strictEqual(guestMac[0].name, 'Mac Jack', 'Mac Jack name should be in guests list');
            methRet = myLS.saveGuest(fakeMacUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            guestMac = myLS.guests.filter(hasMacId);
            chai.assert.strictEqual(guestMac[0].name, 'Fake Jack', 'Fake Jack name should be in guests list');
        });
        // enableNotes
        it('enableNotes method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // enableNotes can change sessionWideNotesEnabled between true and false
            // console.log('myLS.sessionWideNotesEnabled: ', myLS.sessionWideNotesEnabled);
            chai.assert.strictEqual(myLS.sessionWideNotesEnabled, false, 'sessionWideNotesEnabled should start as false');
            myLS.enableNotes(true);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(myLS.sessionWideNotesEnabled, true, 'sessionWideNotesEnabled should end as true');
        });
        // notesEnabled
        it('notesEnabled method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // notesEnabled returns the value of sessionWideNotesEnabled.
            let methRet = myLS.notesEnabled();
            // console.log('methRet: ', methRet);
            chai.assert.strictEqual(methRet, myLS.sessionWideNotesEnabled, 'notesEnabled did not return the value of sessionWideNotesEnabled');
        });
        // createNote
        it('createNote method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // createNote creates a new note
            let user = 'cool user';
            let details = 'some details about how cool the cool user is';
            let myNote = { user, details };
            myLS.createNote(myNote);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(myLS.notes[0].user, user, 'createNote did not create note with matching user information');
            chai.assert.strictEqual(myLS.notes[0].details, details, 'createNote did not create note with matching details information');

        });
        // saveText
        it('saveText method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // saveText returns undefined when LearnShare is locked
            let methRet = myLS.saveText('title', 'notes');
            chai.assert.strictEqual(methRet, undefined, 'saveText should return undefined when LearnShare state is locked');


            // saveText can update title and notes
            myLS = unlockLearnShare(myLS);
            myLS.enableNotes(true);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            let tTitle = 'test title';
            let tNotes = [{
                user: 'cool user',
                details: 'some details about how cool the cool user is' 
            }];
            let teamStub = sinon.stub(Team, 'findOne');
            teamStub.returns({Name: 'test team name'});
            myLS.saveText(tTitle, tNotes);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(myLS.title, tTitle, 'saveText should have updated the LearnShare title');
            chai.assert.strictEqual(myLS.notes[0].details, tNotes[0].details, 'saveText should have updated the LearnShare notes');
            teamStub.restore();

            // saveText throws a 403 'You are not authorized' error when notesEnabled is false and not an admin
            function unauthorizedSaveText () {
                myLS.saveText(tTitle, tNotes);
            }
            myLS.enableNotes(false);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            let rolesStub = sinon.stub(Roles, 'userIsInRole');
            teamStub = sinon.stub(Team, 'findOne');
            rolesStub.returns(false);
            teamStub.returns({Name: 'test team name'});
            chai.assert.throws(unauthorizedSaveText, Error, 'You are not authorized', 'Error should be thrown in saveText. enabled notes and Roles should return false');
            rolesStub.restore();
            teamStub.restore();
        });
        // setSkypeUrl
        it('setSkypeUrl method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // setSkypeUrl can update skypeUrl
            let rolesStub = sinon.stub(Roles, 'userIsInRole');
            let testUrl = 'coconut.net'
            rolesStub.returns(true);
            myLS.setSkypeUrl(testUrl);
            rolesStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            chai.assert.strictEqual(testUrl, myLS.skypeUrl, 'The LearnShare skypeUrl was not updated');

        });
        // setTeam
        it('setTeam method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // setTeam can update teamId
            let testTeamId = 'testTeamId123';
            let rolesStub = sinon.stub(Roles, 'userIsInRole');
            rolesStub.returns(true);
            myLS.setTeam(testTeamId);
            rolesStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(myLS.teamId, testTeamId, 'setTeam did not update the LearnShare teamId');
        });
        // uploadRecording
        it('uploadRecording method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js/4482701
            // https://www.w3schools.com/nodejs/nodejs_filesystem.asp 
            // check that uploadRecording creates a new file in '/uploads/'
            let testFileInfo = 'test file info';
            let testFileData = 'test file data';
            let rolesStub = sinon.stub(Roles, 'userIsInRole');
            rolesStub.returns(true);
            myLS.uploadRecording(testFileInfo, testFileData);
            rolesStub.restore();
            // console.log('uploaded it');
            // let path = './';
            let path = './uploads/';
            // let path = '/uploads/';
            let dirInfo = fs.readdirSync(path);
            // console.log('dirInfo: ', dirInfo);
            // console.log('past readirSync');
            let fileRet = fs.readFileSync('./uploads/myLearnShareID.mp4');
            // fileInfo.setEncoding('utf8');
            // console.log('fileInfo: ', fileRet);
            // console.log('fileInfo: ', fileRet.toString());
            chai.assert.strictEqual(testFileData, fileRet.toString(), 'uploadRecording did not upload data properly');
            myLS = LearnShareSession.findOne({ _id: MLSID });
            let testFileDataAgain = 'test file data again';
            rolesStub = sinon.stub(Roles, 'userIsInRole');
            rolesStub.returns(true);
            myLS.uploadRecording(testFileInfo, testFileDataAgain);
            rolesStub.restore();
            let fileRetAgain = fs.readFileSync('./uploads/myLearnShareID.mp4');
            chai.assert.strictEqual(testFileDataAgain, fileRetAgain.toString(), 'uploadRecording did not upload data properly a second time');
            
        });
        // uniqueParticipants
        it('uniqueParticipants method test', function () {
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID });

            // test that duplicate guests are removed
            myLS = unlockLearnShare(myLS);
            myLS.addParticipant(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            myLS.saveGuest(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(1, myLS.guests.length, 'There should be 1 guest users');
            myLS.uniqueParticipants(MLSID);
            myLS = LearnShareSession.findOne({ _id: MLSID });
            // console.log('myLS: ', myLS);
            chai.assert.strictEqual(0, myLS.guests.length, 'There should be no guest users');
        });
    });
}

// learnShareSession methods that are showing up red in istanbul
// addPresenter
// addParticipant
// removeParticipant
// removeGuest
// removePresenter
// setNextParticipant
// addParticipantSelf
// saveGuest
// enableNotes
// notesEnabled
// createNote
// saveText
// lockSession
// unlockSession
// setSkypeUrl
// setTeam
// uploadRecording
// uniqueParticipants