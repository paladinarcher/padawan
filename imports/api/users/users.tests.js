import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from './learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('LearnShareSession', function () {
        it('can add a participant', function () {
            //
        });
        it('can remove a participant');
        it('can add a presenter');
        it('can remove a presenter');
        it('can add current user to participants');
        it('can save session title and notes');
    });
}
