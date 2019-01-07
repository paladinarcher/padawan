import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User } from './users.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('User', function () {
        this.timeout(15000)

        it('can create a new non admin user', function testCreateUser() {
        });
        
        // it('can verify the users email address', function checkVerificationEmail() {
        //     resetDatabase()
        //     let nonAdminUser = FactoryBoy.create("nonAdminUser", { _id: "1234567899912839" })
        //     let myStub = sinon.stub(Meteor, "userId")
    });
}
