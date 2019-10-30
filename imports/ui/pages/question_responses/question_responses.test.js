
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { User } from '/imports/api/users/users.js';
import { chai } from 'meteor/practicalmeteor:chai';
/*
import { Question } from '/imports/api/questions/questions.js';
import { PolarStats } from '/imports/api/questions/questions.js';
import { Defaults } from '/imports/startup/both/defaults.js';
import { Answer } from "/imports/api/users/users.js";
import { UserType } from "/imports/api/users/users.js";
import { Profile } from "/imports/api/users/users.js";
import { UserNotify } from '/imports/api/user_notify/user_notify.js';
import '/imports/startup/both/at_config.js';
import { Random } from 'meteor/random'
*/

if (Meteor.isServer) {
    describe('Question Responses', function () {
        it('can create a new non admin user', function testCreateUser(done) {
            resetDatabase()
            FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
            let dbLookupUser = User.findOne({ _id: "1234567899912839" })
            chai.assert(dbLookupUser !== undefined, "Non Admin User was not created")
            done()
        })
        it('can create a new admin user', function testCreateAdminUser(done) {
            resetDatabase()
            FactoryBoy.create("adminUser1", { _id: '999' })
            let dbLookupUser = User.findOne({_id: "999"})
            chai.assert(dbLookupUser !== undefined, "Admin User was not created")
            done()
        });
    });
}