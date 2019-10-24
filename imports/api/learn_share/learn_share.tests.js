import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

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
    describe.only('LearnShareSession older original', function () {
        this.timeout(15000);
        it('can add a participant', function () {
            //resetDatabase();
            let lssess = new LearnShareSession({
                _id: testData.lssess.id,
                title: testData.lssess.title
            });
            lssess.save();

            lssess.addParticipant(testData.participant);

            let testSess = LearnShareSession.findOne( {_id:testData.lssess.id, participants: {$elemMatch: {id:testData.participant.id}}} );
            //let testSess = LearnShareSession.findOne( {_id:lssid} );
            chai.assert( testSess, true );
        });
        it('can add a presenter', function () {
            let lssess = LearnShareSession.findOne( {_id:testData.lssess.id} );
            lssess.addPresenter(testData.participant);
            let testSess = LearnShareSession.findOne( {_id:testData.lssess.id, presenters: {$elemMatch: {id:testData.participant.id}}} );
            chai.assert( testSess, true );
        });
        it('can remove a presenter', function () {
            let lssess = LearnShareSession.findOne( {_id:testData.lssess.id} );
            lssess.removePresenter(testData.participant.id);
            let testSess = LearnShareSession.findOne( {_id:testData.lssess.id, presenters: {$elemMatch: {id:testData.participant.id}}} );
            chai.assert( !testSess, true );
        });
        it('can remove a participant', function () {
            let lssess = LearnShareSession.findOne( {_id:testData.lssess.id} );
            lssess.removeParticipant(testData.participant.id);
            let testSess = LearnShareSession.findOne( {_id:testData.lssess.id, participants: {$elemMatch: {id:testData.participant.id}}} );
            chai.assert( !testSess, true );
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
const MLSID = 'myLearnShareID'
const macUser = {
    "id": "macUserID",
    "name": "Mac Jack"
}

FactoryBoy.define('myLearnShare', LearnShareSession, {
    "_id":MLSID,
    "createdAt":"2018-07-06T20:36:55.087Z",
    "updatedAt":"2018-07-06T21:37:18.567Z",
    "title":"Friday July 6th",
    // "notes":"Moroni failed at taking notes today....\nDeb = Resiliance\nDarren = The Slight Edge book",
    // "notes":["Moroni failed at taking notes today....\nDeb = Resiliance\nDarren = The Slight Edge book"],
    "participants":[
        {
            "id":"frF29wnTrpeDwMKoA",
            "name":"Moroni Pickering"
        },
        {
            "id":"gQgt2eucaghmudQnD",
            "name":"Wayne Jensen"
        },
        {
            "id":"ro2NRbs7xmTuq72Mc",
            "name":"Paul Robbins"
        },
        {
            "id":"5TrqZfGdCjLRZxoEP",
            "name":"Jay Ward"
        },
        {
            "id":"8KpjJ9YzeD6Ji46ZT",
            "name":"Bryant Austin"
        },
        {
            "id":"7ATZQo4hDfyGmsTtK",
            "name":"Bowen Pickering"
        },
        {
            "id":"eQoQLL5PsQNKc2RTh",
            "name":"Cascade Pickering"
        },
        {
            "id":"PkJMi3K22vcCaoj9v",
            "name":"Debra Starks"
        },
        {
            "id":"6RsteCA4qoKgz54Dj",
            "name":"Darren Moody"
        }
    ],
    "guests":[],
    "presenters":[
        {
            "id":"ro2NRbs7xmTuq72Mc",
            "name":"Paul Robbins"
        },
        {
            "id":"8KpjJ9YzeD6Ji46ZT",
            "name":"Bryant Austin"
        },
        {
            "id":"5TrqZfGdCjLRZxoEP",
            "name":"Jay Ward"
        },
        {
            "id":"frF29wnTrpeDwMKoA",
            "name":"Moroni Pickering"
        },
        {
            "id":"eQoQLL5PsQNKc2RTh",
            "name":"Cascade Pickering"
        },
        {
            "id":"gQgt2eucaghmudQnD",
            "name":"Wayne Jensen"
        },
        {
            "id":"7ATZQo4hDfyGmsTtK",
            "name":"Bowen Pickering"
        },
        {
            "id":"PkJMi3K22vcCaoj9v",
            "name":"Debra Starks"
        },
        {
            "id":"6RsteCA4qoKgz54Dj",
            "name":"Darren Moody"
        }
    ],
    "state":"locked",
    "skypeUrl":"https://meet.lync.com/paladinarcher.com/craig/19J5HQ5M",
    "teamId":""
});
if (Meteor.isServer) {
    describe.only('LearnShareSession for Istanbul coverage', function () {
        beforeEach(function () {
            resetDatabase();
        });
        // addPresenter
        it('tests for addPresenter unlockSession and lockSession', function(){ // also test lock and unlock
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID});
            // console.log('myLS: ', myLS);
            let methodSuccess = myLS.addPresenter(macUser);
            // console.log('methodSuccess', methodSuccess);
            chai.assert.strictEqual(methodSuccess, undefined, 'addPresenter should return undefined since LearnShare is locked');

            // non admin users should not be able to unlock LearnShare
            function unlockThrowsError () {
                myLS.unlockSession();
            }
            chai.assert.throws(unlockThrowsError, Error, 'You are not authorized', 'non admin accessing lock should have thrown an error');

            // admin users should be able to unlock LearnShare
            let adminStub = sinon.stub(Roles, "userIsInRole");
            adminStub.returns(true);
            myLS.unlockSession();
            adminStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID});
            chai.assert.strictEqual(myLS.state, 'active', 'unlockSession should have set the LearnShare state to active');

            // Add a presenter
            // console.log('before myLS: ', myLS);
            myLS.addPresenter(macUser);
            myLS = LearnShareSession.findOne({ _id: MLSID});
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
            myLS = LearnShareSession.findOne({ _id: MLSID});
            chai.assert.isFalse(tryDuplicate, 'Adding a duplicate presenter should have returned false');
            chai.assert.strictEqual(startPresenterSize, myLS.presenters.length, 'duplicate presenters should not have increased the presenters array size');
            

            // test locking session as non admin
            function lockThrowsError () {
                myLS.lockSession();
            }
            chai.assert.throws(lockThrowsError, Error, 'You are not authorized', 'non admin accessing lock should have thrown an error');

            // test locking session as an admin
            let lockStub = sinon.stub(Roles, 'userIsInRole');
            lockStub.returns(true);
            myLS.lockSession();
            lockStub.restore();
            myLS = LearnShareSession.findOne({ _id: MLSID});
            chai.assert.strictEqual(myLS.state, 'locked', 'Admin should have been able to locked the LearnShareSession');
        });
        // addParticipant
        it('addParticipant', function(){
            console.log('todo addParticipant');
            FactoryBoy.create('myLearnShare');
            let myLS = LearnShareSession.findOne({ _id: MLSID});

            // addParticipant returns undefined if the state is locked

            // addParticipant returns false when trying to add duplicat participants
        });
        // incrementLastPresenterSelecedAt
        it('incrementLastPresenterSelecedAt', function(){
            console.log('todo incrementLastPresenterSelecedAt');
            // test that incrementLastPresenterSelecedAt gets incremented by one
        });
        // removeParticipant
        it('removeParticipant', function(){
            console.log('todo removeParticipant');
            // test that the removeParticipant returns undefined if the Session state is locked
        });
        // removeGuest
        it('removeGuest', function(){
            console.log('todo removeGuest');
            // test that the removeGuest returns undefined if the Session state is locked
        });
        // removePresenter
        it('removePresenter', function(){
            console.log('todo removePresenter');
        });
        // setNextParticipant
        it('setNextParticipant', function(){
            console.log('todo setNextParticipant');
        });
        // addParticipantSelf
        it('addParticipantSelf', function(){
            console.log('todo addParticipantSelf');
        });
        // saveGuest
        it('saveGuest', function(){
            console.log('todo saveGuest');
        });
        // enableNotes
        it('enableNotes', function(){
            console.log('todo enableNotes');
        });
        // notesEnabled
        it('notesEnabled', function(){
            console.log('todo notesEnabled');
        });
        // createNote
        it('createNote', function(){
            console.log('todo createNote');
        });
        // saveText
        it('saveText', function(){
            console.log('todo saveText');
        });
        // setSkypeUrl
        it('setSkypeUrl', function(){
            console.log('todo setSkypeUrl');
        });
        // setTeam
        it('setTeam', function(){
            console.log('todo setTeam');
        });
        // uploadRecording
        it('uploadRecording', function(){
            console.log('todo uploadRecording');
        });
        // uniqueParticipants
        it('uniqueParticipants', function(){
            console.log('todo uniqueParticipants');
        });
    });
}

// learnShareSession methods that are showing up red in istanbul
// addPresenter
// addParticipant
// incrementLastPresenterSelecedAt
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