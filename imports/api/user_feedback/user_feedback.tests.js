
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { UserFeedback } from './user_feedback.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

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
            createdDate = uf._id; // for next test
            let ufTest = UserFeedback.findOne( {_id:uf._id} );
            chai.assert( ufTest, true);
        });
        // it('Creates a date for user feedback', function () {
        //     let ufTest = UserFeedback.findOne( {_id:createdDate} );
        //     chai.assert( ufTest.dateCreated, createdDate);
        //     console.log("## type of ufTest.dateCreated",ufTest.dateCreated.typeOf());
        // });
    });
}  
