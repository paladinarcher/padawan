// import { UserNotify } from '/imports/api/user_notify/user_notify.js';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { sinon } from "meteor/practicalmeteor:sinon";
// import { chai } from 'meteor/practicalmeteor:chai';

// // UserNotify functions: markRead, markNotified, test, pushNotify, 

// if(Meteor.isClient) {
//     FactoryBoy.define('myUserNotify', UserNotify, { _id: '421234'});

//     describe('UserNotify', function() {
//         afterEach(function() {
//             resetDatabase();
//         });
//         it('pushNotify function', function() {
//             resetDatabase();
//             let theUN = FactoryBoy.create('myUserNotify');
//             let myOpt = {onclick: 'cow'};
//             let bn = theUN.pushNotify(myOpt);
//             chai.assert.strictEqual(Notification.permission, 'denied', 'the Notification permission should be denied');
//             chai.assert.strictEqual(bn, undefined, 'the browserNote should be undefined');
//         });
//     });
// }

// if (Meteor.isServer) {
//     FactoryBoy.define('myUserNotify', UserNotify, { _id: '421234'});

//     describe('UserNotify', function() {
//         afterEach(function() {
//             resetDatabase();
//         });
//         it('markRead function', function() {
//             resetDatabase();
//             let theUN = FactoryBoy.create('myUserNotify');
//             chai.assert.isFalse(theUN.isRead, 'isRead should start out false');
//             theUN.markRead();
//             theUN = UserNotify.findOne({ _id: '421234' });
//             chai.assert.isTrue(theUN.isRead, 'markRead should have set isRead to true');
//         });
//         it('markNotified function', function() {
//             resetDatabase();
//             let theUN = FactoryBoy.create('myUserNotify');
//             chai.assert.isFalse(theUN.isPushed, 'isPushed should start out false');
//             theUN.markNotified();
//             theUN = UserNotify.findOne({ _id: '421234' });
//             chai.assert.isTrue(theUN.isPushed, 'markNotified should have set isPushed to true');
//         });
//         it('test function', function() {
//             resetDatabase();
//             let theUN = FactoryBoy.create('myUserNotify');
//             let consoleSpy = sinon.spy(console, 'log');
//             theUN.test();
//             chai.assert.isTrue(console.log.calledWith('      #####     '), 'the test function should have output face art to the console');
//             consoleSpy.restore();
//         });
//     });
// }