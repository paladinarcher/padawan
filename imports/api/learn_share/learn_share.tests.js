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
    describe('LearnShareSession', function () {
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
