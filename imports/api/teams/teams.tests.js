import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from './learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('Team', function () {
        it('user can ask to join a team', function () {
            //
        });
        it('admin can ask user to join a team');
        it('user can accept team invite');
        it('user can decline team invite');
        it('admin can accept user join request');
        it('admin can reject user join request');
        it('admin can add team role to team member');
        it('admin can remove team role from team member');
    });
}
