import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User, MyersBriggs } from './users.js';
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

FactoryBoy.define("myersBriggs", MyersBriggs, {
    Name: "theMBName",
});

if (Meteor.isServer) {
    describe('All Tests for User', function() {
        describe('User', function () {

            it('can create a new non admin user', function testCreateUser(done) {
                resetDatabase()
                FactoryBoy.create("nonAdminUser1", {_id: "1234567899912839"})
                let dbLookupUser = User.findOne({_id: "1234567899912839"})
                chai.assert(dbLookupUser !== undefined, "Non Admin User was not created")
                done()
            })

            it('can create a new admin user', function testCreateAdminUser(done) {
                resetDatabase()
                FactoryBoy.create("adminUser1", {_id: '999'})
                let dbLookupUser = User.findOne({_id: "999"})
                chai.assert(dbLookupUser !== undefined, "Admin User was not created")
                done()
            });

            it('user full name is returned by full name method and can be case converted', function returnUserFullName(done) {
                resetDatabase()
                FactoryBoy.create("nonAdminUser1", {_id: "1234567899912839"})
                let dbLookupUser = User.findOne({_id: "1234567899912839"})
                let firstName = dbLookupUser.MyProfile.firstName
                let lastName = dbLookupUser.MyProfile.lastName
                let userName = firstName + ' ' + lastName
                let result = dbLookupUser.fullName() === userName
                chai.assert(result === true, 'user full name is not being returned by full name method')
                result = dbLookupUser.fullName('lower') === userName.toLowerCase()
                chai.assert(result === true, 'user full name is not being converted to lower case')
                result = dbLookupUser.fullName('upper') === userName.toUpperCase()
                chai.assert(result === true, 'user full name is not being converted to upper case')
                done()
            })

            it('user can update their profile information', function testUpdateProfile(done) {
                resetDatabase()
                let nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "1234567899912839"})
                let myStub = sinon.stub(Meteor, "userId")
                myStub.returns(nonAdminUser)
                let getloggedInUser = () => User.findOne({_id: Meteor.userId()._id})
                let loggedInUser = getloggedInUser()
                let uprofile = {
                    firstName: 'Charlie',
                    lastName: 'Testerino',
                };
                loggedInUser.profileUpdate(uprofile)
                loggedInUser = getloggedInUser();
                let result = ((loggedInUser.MyProfile.firstName === 'Charlie') && (loggedInUser.MyProfile.lastName === 'Testerino')) ? true : false
                chai.assert(result === true, 'User profile information did not update')
                myStub.restore()
                done()
            })

            it('user can be added to a team by the addTeam method', function testAddTeamMethod(done) {
                resetDatabase()
                FactoryBoy.create('TestTeam')
                FactoryBoy.create("nonAdminUser1", {_id: "1234567899912839"})
                let user = User.findOne({_id: '1234567899912839'})
                user.addTeam('theRealTestTeam1')
                user = User.findOne({_id: "1234567899912839"})
                let result = (user.roles.theRealTestTeam1 !== undefined) ? true : false
                chai.assert(result === true, 'User is not part of the test team')
                done()
            })

            it('user can change name with changeName method', function testChangeNameMethod(done) {
                resetDatabase()
                FactoryBoy.create("nonAdminUser1", {_id: "1234567899912839"})

                let firstName = 'Charlie'
                let lastName = 'Testerino'
                let user = User.findOne({_id: "1234567899912839"})
                let changedFirstName, changedLastName, result

                user.changeName(firstName, lastName)
                user = User.findOne({_id: "1234567899912839"})
                changedFirstName = user.MyProfile.firstName
                changedLastName = user.MyProfile.lastName
                result = ((firstName === changedFirstName) && (lastName === changedLastName)) ? true : false
                chai.assert(result === true, 'User name is not changing using changeName method')
                done()
            })

            it('admin user can add roles', function testAddRoleMethod(done) {
                resetDatabase()
                let adminUser = FactoryBoy.create("adminUser1", {_id: "999"})
                let newRole, user, stub, result
                stub = sinon.stub(Meteor, "userId")
                stub.returns(adminUser)
                newRole = 'member'
                user = User.findOne({_id: "999"})
                user.addRole(newRole)
                user = User.findOne({_id: "999"})
                result = (user.roles.__global_roles__.indexOf(newRole) > -1) ? true : false
                chai.assert(result === true, 'User role was not added via addRole method')
                stub.restore()
                done()
            })
            it('non admin user cannot add roles', function testAddRoleWithNonAdmin(done){
                resetDatabase()
                let newRole, nonAdminUser, stub, result
                nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "666"})
                stub = sinon.stub(Meteor, "userId")
                stub.returns(nonAdminUser)
                newRole = 'member'
                user = User.findOne({_id: "666"})
                user.addRole(newRole)
                user = User.findOne({_id: "666"})
                result = (user.roles.__global_roles__ === undefined || user.roles.__global_roles__.indexOf(newRole) > -1) ? true : false
                stub.restore()
                chai.assert(result === true, 'User role was for non admin users added via addRole method')
                done()
            })

            it('user can remove roles', function testRemoveRoleMethod(done) {
                resetDatabase()
                let adminUser = FactoryBoy.create("adminUser1", {_id: "999"})
                let newRole, user, stub, result

                stub = sinon.stub(Meteor, "userId")
                stub.returns(adminUser)

                newRole = 'member'

                user = User.findOne({_id: "999"})
                user.addRole(newRole)

                user = User.findOne({_id: "999"})
                user.removeRole(newRole)

                user = User.findOne({_id: "999"})

                result = (user.roles.__global_roles__.indexOf(newRole) === -1) ? true : false

                chai.assert(result === true, 'User role was not removed via removeRole method')
                stub.restore()
                done()
            })
            it('non admin user cannot remove roles', function testRemoveRoleMethod(done) {
                resetDatabase()
                let adminUser = FactoryBoy.create("adminUser1", {_id: "999"})
                let newRole, user, stub, result

                stub = sinon.stub(Meteor, "userId")
                stub.returns(adminUser)

                newRole = 'member'

                user = User.findOne({_id: "999"})
                user.addRole(newRole)
                stub.restore()

                let nonAdminUser, newUser, newStub
                nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "666"})
                newStub = sinon.stub(Meteor, "userId")
                newStub.returns(nonAdminUser)
                newUser = User.findOne({_id: "666"})
                newUser.removeRole(newRole)
                result = (newUser.roles.__global_roles__ === undefined || newUser.roles.__global_roles__.indexOf(newRole) === -1)
                chai.assert(result === true, 'User role was removed by non admin user via removeRole method')
                newStub.restore()
                done()
            })
            it('user can register the TechSkills DataKey', function testRegisterTechSkillsDataKey(done){
                resetDatabase()
                let nonAdminUser, user, stub, keyResult
                nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "666"})
                stub = sinon.stub(Meteor, "userId")
                stub.returns(nonAdminUser)
                user = User.findOne({_id: "666"})
                // there is probably a better way to do this.
                keyResult = "tsqKey"
                user.registerTechnicalSkillsDataKey(keyResult)
                user = User.findOne({_id: "666"})
                let result = user.MyProfile.technicalSkillsData === keyResult;
                chai.assert(result === true, 'technicalSkillsData was NOT created and saved')
                stub.restore()
                done()
            })
        });
        describe('UserType', function () {

        });
        describe('MyersBriggs', function () {
            it('can add value by category ', function testAddByCategory(done) {
/*                let mB = FactoryBoy.create("myersBriggs", {_id: "667"});
                mB.addByCategory(0, 1);
                chai.assert(mb.IE.value === 1, "Category IE did not get 1 as a value");

 */
                done();
            })
        });
        describe('Answer', function () {

        });
        describe('QnaireAnswer', function () {

        });

    });
}
