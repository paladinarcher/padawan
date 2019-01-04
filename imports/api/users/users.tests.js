import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User } from './users.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
//commented the above code line out because it was failing in the build production test.

if (Meteor.isServer) {
    describe('User', function () {
        this.timeout(15000);
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
