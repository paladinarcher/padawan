

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { UserFeedback } from './user_feedback.js';

let userID;
let createdDate;
let testData = {
    userFeedback: {
        source: 'User FB Unit Test Source',
        context: 'Unit Test User FB Context',
        comment: 'Unit Test User FB Comment'
    }
}
if (Meteor.isServer) {
    describe('UserFeedback', function () {
        this.timeout(15000);
        it('can create user feedback', function () {
            let uf = new UserFeedback( testData.userFeedback );
            uf.save();
            testData.userFeedback._id = uf._id;
            userID = uf._id;  // for the next tests
            createdDate = uf.dateCreated; // for next test
            let ufTest = UserFeedback.findOne( {_id:uf._id} );
            chai.assert( ufTest, true);
        });
        it('the date stored is the same as the one created for the feedback', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert( ufTest.dateCreated, createdDate);
        });
        it('the feedback created previously is an object', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert.typeOf(ufTest, "object");
        });
        it('the userId created previously is actually a string', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert.typeOf(ufTest.userId, "string");
        });
        it('the source created previously is actually a string', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert.typeOf(ufTest.source, "string");
        });
        it('the context created previously is actually a string', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert.typeOf(ufTest.context, "string");
        });
        it('the dateCreated created previously is actually a date', function () {
            let ufTest = UserFeedback.findOne( {_id:userID} );
            chai.assert.typeOf(ufTest.dateCreated, "date");
            console.log("UserFeedback",UserFeedback);
        });
    });
}  