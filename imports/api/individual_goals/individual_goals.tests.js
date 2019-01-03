import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { IndividualGoal } from './individual_goals.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

let testData = {
    individualGoal: {
        title: 'Unit Test Individual Goal Title',
        description: 'Unit Test Individual Goal Description',
    }
}
if (Meteor.isServer) {
    describe('IndividualGoal', function () {
        this.timeout(15000);
        it('can create individual goal', function () {
            let tg = new IndividualGoal( testData.individualGoal );
            tg.save();
            testData.individualGoal._id = tg._id;
            let tgTest = IndividualGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest, true);
        });
        it('can set due date', function () {
            let tg = IndividualGoal.findOne( {_id:testData.individualGoal._id} );
            let due = new Date();
            tg.setDateField("dueDate", due);
            tg.save();

            let tgTest = IndividualGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.dueDate.getTime() == due.getTime(), true);
        });
        it('can set goal reached', function () {
            let tg = IndividualGoal.findOne( {_id:testData.individualGoal._id} );
            let due = new Date();
            tg.setDateField("reachedDate", due);
            tg.save();

            let tgTest = IndividualGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reachedDate.getTime() == due.getTime(), true);
        });
        it('can set review date', function () {
            let tg = IndividualGoal.findOne( {_id:testData.individualGoal._id} );
            let due = new Date();
            tg.setDateField("reviewDate", due);
            tg.save();

            let tgTest = IndividualGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reviewDate.getTime() == due.getTime(), true);
        });
        it('can set goal reviewed', function () {
            let tg = IndividualGoal.findOne( {_id:testData.individualGoal._id} );
            let due = new Date();
            tg.setDateField("reviewedOnDate", due);
            tg.save();

            let tgTest = IndividualGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reviewedOnDate.getTime() == due.getTime(), true);
        });
        it('can add comment'); //requires logged in user; remains pending until unit test auth can be done
    });
}
