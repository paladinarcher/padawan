import { UserNotify } from '/imports/api/user_notify/user_notify.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon } from "meteor/practicalmeteor:sinon";
import { chai } from 'meteor/practicalmeteor:chai';

if(Meteor.isClient) {
    console.log('wabalubadubdub');
}

// UserNotify functions: markRead, markNotified, test, pushNotify, 
if (Meteor.isServer) {
    FactoryBoy.define('myUserNotify', UserNotify, { _id: '421234'});

    describe('UserNotify', function() {
        afterEach(function() {
            resetDatabase();
        });
        it('markRead function', function() {
            resetDatabase();
            let theUN = FactoryBoy.create('myUserNotify');
            chai.assert.isFalse(theUN.isRead, 'isRead should start out false');
            theUN.markRead();
            theUN = UserNotify.findOne({ _id: '421234' });
            // console.log('theUN: ', theUN);
            chai.assert.isTrue(theUN.isRead, 'markRead should have set isRead to true');
        });
        it('markNotified function', function() {
            resetDatabase();
            let theUN = FactoryBoy.create('myUserNotify');
            chai.assert.isFalse(theUN.isPushed, 'isPushed should start out false');
            theUN.markNotified();
            theUN = UserNotify.findOne({ _id: '421234' });
            // console.log('theUN: ', theUN);
            chai.assert.isTrue(theUN.isPushed, 'markNotified should have set isPushed to true');
        });
        it('test function', function() {
            resetDatabase();
            let theUN = FactoryBoy.create('myUserNotify');
            let consoleSpy = sinon.spy(console, 'log');
            theUN.test();
            // console.log.calledWith('123')
            chai.assert.isTrue(console.log.calledWith('123'), 'the test function should have output 123 to the console');
            // console.log('console.log.calledWith("123")', console.log.calledWith('123'));
            // consoleSpy.called.shoud.be.true;
            // console.log('theUN: ', theUN);
            // chai.assert.isTrue(theUN.isPushed, 'markRead should have set isPushed to true');
            consoleSpy.restore();
        });
        it('pushNotify function', function() {
            resetDatabase();
            console.log('todo pushNotify');
            let theUN = FactoryBoy.create('myUserNotify');
            // chai.assert.isFalse(theUN.isPushed, 'isPushed should start out false');
            // theUN.pushNotify();
            // theUN = UserNotify.findOne({ _id: '421234' });
            // console.log('theUN: ', theUN);
            // chai.assert.isTrue(theUN.isPushed, 'markRead should have set isPushed to true');
        });
    });
}