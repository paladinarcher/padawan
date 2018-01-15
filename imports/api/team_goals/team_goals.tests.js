import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { TeamGoal } from './team_goals.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

let testData = {
    teamGoal: {
        teamName: 'Team Unit Test',
        title: 'Unit Test Goal Title',
        description: 'Unit Test Goal Description',
    }
}
if (Meteor.isServer) {
    describe('TeamGoal', function () {
        this.timeout(15000);
        it('can create team goal', function () {
            let tg = new TeamGoal( testData.teamGoal );
            tg.save();
            testData.teamGoal._id = tg._id;
            let tgTest = TeamGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest, true);
        });
        it('can set due date', function () {
            let tg = TeamGoal.findOne( {_id:testData.teamGoal._id} );
            let due = new Date();
            tg.setDateField("dueDate", due);
            tg.save();

            let tgTest = TeamGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.dueDate.getTime() == due.getTime(), true);
        });
        it('can set goal reached', function () {
            let tg = TeamGoal.findOne( {_id:testData.teamGoal._id} );
            let due = new Date();
            tg.setDateField("reachedDate", due);
            tg.save();

            let tgTest = TeamGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reachedDate.getTime() == due.getTime(), true);
        });
        it('can set review date', function () {
            let tg = TeamGoal.findOne( {_id:testData.teamGoal._id} );
            let due = new Date();
            tg.setDateField("reviewDate", due);
            tg.save();

            let tgTest = TeamGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reviewDate.getTime() == due.getTime(), true);
        });
        it('can set goal reviewed', function () {
            let tg = TeamGoal.findOne( {_id:testData.teamGoal._id} );
            let due = new Date();
            tg.setDateField("reviewedOnDate", due);
            tg.save();

            let tgTest = TeamGoal.findOne( {_id:tg._id} );
            chai.assert( tgTest.reviewedOnDate.getTime() == due.getTime(), true);
        });
        it('can add comment'); //requires logged in user; remains pending until unit test auth can be done
    });
}
