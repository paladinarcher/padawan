import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from './learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('TeamGoal', function () {
        it('can set due date', function () {
            //
        });
        it('can set goal reached');
        it('can set review date');
        it('can set goal reviewed');
        it('can add comment');
        it('can save session title and notes');
    });
}
