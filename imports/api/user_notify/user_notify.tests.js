import { UserNotify } from '/imports/api/user_notify/user_notify.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon } from "meteor/practicalmeteor:sinon";
import { chai } from 'meteor/practicalmeteor:chai';

if(Meteor.isClient) {
    console.log('wabalubadubdub');
    FactoryBoy.define('myUserNotify', UserNotify, { _id: '421234'});
    describe('UserNotify', function() {
        afterEach(function() {
            resetDatabase();
        });
        it('pushNotify function', function() {
            resetDatabase();
            let theUN = FactoryBoy.create('myUserNotify');
            let myOpt = {onclick: 'cow'};
            console.log('before theUN: ', theUN);
            // let browseNoteSpy = sinon.spy(browseNote, 'onclick');

            // Notification.requestPermission(function(permission) {
            //     console.log('permission: ', permission);
            // });
            // console.log('just requested permission');
            // let npStub = sinon.sandbox.create();
            // npStub.stub(Notification, "permission", "granted");
            // Notification.permission = 'ggranted';
            // let npStub = sinon.create();
            // npStub.stub(Meteor, "userId");
            // npStub.returns('hi');
            // console.log('Meteor.userId: ', Meteor.userId());
            // npStub.stub(Notification, 'permission').value('granted');

            // let npStub = sinon.stub(Notification, 'permission');
            // npStub.returns('granted');
            // Notification.permission = 'granted';

            console.log('Notification.permission: ', Notification.permission);
            console.log('before pushNotify');
            let bn = theUN.pushNotify(myOpt);
            // npStub.stub(Notification, 'permission').value('denied');
            // console.log('bn: ', bn);

            // bn = theUN.pushNotify(myOpt);

            // npStub.restore();
            // console.log('bn 2: ', bn);
            // console.log('change isFalse to isTrue');
            // chai.assert.isFalse(browseNoteSpy.calledOnce, 'browseNote.onclick should have been called once');
            // browseNoteSpy.restore();
            // console.log('spyRet: ', spyRet);
            // theUN = UserNotify.findOne({ _id: '421234' });
            console.log('theUN: ', theUN);
            chai.assert.strictEqual(Notification.permission, 'denied', 'the Notification permission should be denied');
            chai.assert.strictEqual(bn, undefined, 'the browserNote should be undefined');
            console.log('test');
            console.log('Notification.permission', Notification.permission);
            console.log('Notification', Notification);
        });
    });
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
            chai.assert.isTrue(console.log.calledWith('      #####     '), 'the test function should have output face art to the console');
            // console.log('console.log.calledWith("123")', console.log.calledWith('123'));
            // consoleSpy.called.shoud.be.true;
            // console.log('theUN: ', theUN);
            // chai.assert.isTrue(theUN.isPushed, 'markRead should have set isPushed to true');
            consoleSpy.restore();
        });
        // pushNotify uses dom variables and should be executed on the client, so not including the test.
    });
}