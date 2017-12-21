import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { LearnShareSession } from './learn_share.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('LearnShareSession', function () {
        it('can add a participant', function () {
            resetDatabase();
            let lssid = "2017-11-01-ab";
            let lssess = new LearnShareSession({
                _id: lssid,
                title: "Test session for Mocha"
            });
            lssess.save();

            let uid = "Xz4XTeeb5YEj5J3f3";

            lssess.addParticipant(uid);

            let testSess = LearnShareSession.findOne( {_id:lssid, participants:uid} );
            chai.assert( testSess, true );
        });
        it('can remove a participant');
        it('can add a presenter');
        it('can remove a presenter');
        it('can add current user to participants');
        it('can save session title and notes');
    });
}
