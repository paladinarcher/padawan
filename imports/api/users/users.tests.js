import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User } from './users.js';
import { Team } from '../teams/teams.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
//commented the above code line out because it was failing in the build production test.

FactoryBoy.define("nonAdminUser1", User, {
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

FactoryBoy.define("TestTeam", Team, {
    Name: "theRealTestTeam1",
    Description: "team description",
    CreatedBy: "The Man, The Myth, The Legend.",
    Members: ["coolest member"]
});

if (Meteor.isServer) {
    describe('User', function () {

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

        it('user full name is returned by full name method', function returnUserFullName(done) {
            resetDatabase()
            FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
            let dbLookupUser = User.findOne({ _id: "1234567899912839" })
            let firstName = dbLookupUser.MyProfile.firstName
            let lastName = dbLookupUser.MyProfile.lastName
            let userName = firstName + ' ' + lastName
            let result = (dbLookupUser.fullName() === userName) ? true : false
            chai.assert(result === true, 'user full name is not being returned by full name method')
            done()
        })

        it('user can update their profile information', function testUpdateProfile(done) {
            resetDatabase()
            let nonAdminUser = FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
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
            done()
        })

        it('user can be added to a team by the addTeam method', function testAddTeamMethod(done) {
            resetDatabase()
            FactoryBoy.create('TestTeam')
            FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
            let user = User.findOne({ _id: '1234567899912839'})
            user.addTeam('theRealTestTeam1')
            user = User.findOne({ _id: "1234567899912839"})
            let result = (user.roles.theRealTestTeam1 !== undefined) ? true : false
            chai.assert(result === true, 'User is not part of the test team')
            done()
        })

        it('user can change name with changeName method', function testChangeNameMethod(done) {
            resetDatabase()
            FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
            
            let firstName = 'Charlie'
            let lastName = 'Testerino'
            let user = User.findOne({ _id: "1234567899912839" })
            let changedFirstName, changedLastName, result
            
            user.changeName(firstName, lastName)
            user = User.findOne({ _id: "1234567899912839" })
            changedFirstName = user.MyProfile.firstName
            changedLastName = user.MyProfile.lastName
            result = ((firstName === changedFirstName) && (lastName === changedLastName)) ? true : false
            chai.assert(result === true, 'User name is not changing using changeName method')
            done()
        })

        it('user can add roles', function testAddRoleMethod(done) {
            resetDatabase()
            let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
            let newRole, user, stub, result 
            stub = sinon.stub(Meteor, "userId")
            stub.returns(adminUser)
            newRole = 'member'
            user = User.findOne({ _id: "999" })
            user.addRole(newRole)
            user = User.findOne({ _id: "999" })
            result = (user.roles.__global_roles__.indexOf(newRole) > -1) ? true : false 
            chai.assert(result === true, 'User role was not added via addRole method')
            stub.restore()
            done()
        })

        it('user can remove roles', function testRemoveRoleMethod(done) {
            resetDatabase()
            let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
            let newRole, user, stub, result

            stub = sinon.stub(Meteor, "userId")
            stub.returns(adminUser)
            
            newRole = 'member'

            user = User.findOne({ _id: "999" })
            user.addRole(newRole)
            
            user = User.findOne({ _id: "999" })
            user.removeRole(newRole)
            
            user = User.findOne({ _id: "999" })

            result = (user.roles.__global_roles__.indexOf(newRole) === -1) ? true : false
            
            chai.assert(result === true, 'User role was not removed via removeRole method')
            stub.restore()
            done()
        })
    });
}
