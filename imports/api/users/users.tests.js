import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User } from './users.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

FactoryBoy.define("nonAdminUser", User, {
    _id: "1234567899912839",
    services: {
        password: {}
    },
    username: "bestTestUser",
    emails: [],
    slug: "testUser@domain.com",
    MyProfile: {
        firstName: "testUser",
        lastName: "test",
        gender: true,
        UserType: {
            Personality: {},
            AnsweredQuestions: []
        },
        birthDate: new Date("December 17, 1995 03:24:00")
    },
    teams: [],
    roles: {},
    profile: {
        first_name: "testUser",
        last_name: "test",
        gender: "male"
    }
});

FactoryBoy.define("adminUser1", User, {
    _id: "999",
    services: {
        password: {}
    },
    MyProfile: {
        firstName: "adminUser",
        lastName: "admin",
        gender: true
    },
    roles: {
        __global_roles__: ["admin"]
    }
});

if (Meteor.isServer) {
    describe('User', function () {
        this.timeout(15000)

        it('can create a new non admin user', function testCreateUser() {
            resetDatabase()
            let nonAdminUser = FactoryBoy.create("nonAdminUser", { _id: "1234567899912839" })
            let dbLookupUser = User.findOne({ _id: "1234567899912839" })
            console.log(dbLookupUser)
            chai.assert(dbLookupUser !== undefined, "Non Admin User was not created")
        })

        it('can create a new admin user', function testCreateAdminUser() {
            resetDatabase()
            let createdAdminUser = FactoryBoy.create("adminUser1", { _id: '999' })
            let dbLookupUser = User.findOne({_id: "999"})
            console.log(dbLookupUser)
            chai.assert(dbLookupUser !== undefined, "Admin User was not created")
        });
        
        // it('can verify the users email address', function checkVerificationEmail() {
        //     resetDatabase()
        //     let nonAdminUser = FactoryBoy.create("nonAdminUser", { _id: "1234567899912839" })
        //     let myStub = sinon.stub(Meteor, "userId")
        //     myStub.returns(nonAdminUser)
        //     myStub.restore()
        // })

        it('user can change their profile information', function changeUserName() {
            resetDatabase()
            let nonAdminUser = FactoryBoy.create("nonAdminUser", { _id: "1234567899912839" })
            
            let myStub = sinon.stub(Meteor, "userId")
            myStub.returns(nonAdminUser)
            
            let getloggedInUser = () => User.findOne({ _id: Meteor.userId()._id }) 
            let loggedInUser = getloggedInUser()
            

            let uprofile = {
                firstName: 'Charlie',
                lastName: 'Testerino',
            };

            loggedInUser.profileUpdate(uprofile)

            loggedInUser = getloggedInUser()
            
            let result = ( (loggedInUser.MyProfile.firstName === 'Charlie') && (loggedInUser.MyProfile.lastName === 'Testerino') ) ? true : false 
            chai.assert(result === true, 'User profile information did not update')

            myStub.restore()

        })
    });
}
