import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User, UserQnaire } from './users.js';
import { Team } from '../teams/teams.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
//commented the above code line out because it was failing in the build production test.

// FactoryBoy.define("testUserQnaire", UserQnaire, {
//     _id: "whatever"
// });

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

        // Istanbul coverage is below 80%. The tests below should fix it
		it.only('MyersBriggsBit functions', () => {
            // MyersBriggsBit -> addValue, removeValue, reset
            resetDatabase()
            let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
            // console.log('adminUser.MyProfile.UserType.Personality', adminUser.MyProfile.UserType.Personality);
            // console.log('adminUser.MyProfile.UserType.Personality.NS', adminUser.MyProfile.UserType.Personality.NS);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit value should start at 0');
            adminUser.MyProfile.UserType.Personality.NS.addValue(1);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 1, 'MyerBriggsBit Value should be 1');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 1, 'MyerBriggsBit QuestionCount should be 1');
            adminUser.MyProfile.UserType.Personality.NS.removeValue(1);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit value should be 0');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 0, 'MyerBriggsBit QuestionCount should be 0');
            adminUser.MyProfile.UserType.Personality.NS.addValue(1);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 1, 'MyerBriggsBit Value should be 1');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 1, 'MyerBriggsBit QuestionCount should be 1');
            adminUser.MyProfile.UserType.Personality.NS.reset();
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 0, 'MyerBriggsBit QuestionCount should be 0');
            // console.log('2 adminUser.MyProfile.UserType.Personality.NS', adminUser.MyProfile.UserType.Personality.NS);
		})
		it.only('MyersBriggs functions', () => {
            // MyersBriggs -> addByCategory, removeByCategory, getIdentifierById, getFourLetter, reset
            resetDatabase()
            let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
            adminUser.MyProfile.UserType.Personality.addByCategory(0, -1);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.Value, -1, 'MyerBriggsBit IE Value should be -1');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.QuestionCount, 1, 'MyerBriggsBit IE QuestionCount should be 1');
            adminUser.MyProfile.UserType.Personality.removeByCategory(0, -1);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.Value, 0, 'MyerBriggsBit IE Value should be 0');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.QuestionCount, 0, 'MyerBriggsBit IE QuestionCount should be 0');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.getIdentifierById(1), 'NS', 'MyerBriggsBit getIdentifierById categoryId 1 should return NS');
            adminUser.MyProfile.UserType.Personality.addByCategory(0, -1);
            adminUser.MyProfile.UserType.Personality.addByCategory(1, 1);
            adminUser.MyProfile.UserType.Personality.addByCategory(2, 2);
            adminUser.MyProfile.UserType.Personality.addByCategory(3, 3);
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.getFourLetter(), 'ISFP', 'Because IE is negative and the others are positive, getFourLetter should be ISFP');
            adminUser.MyProfile.UserType.Personality.reset();
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit NS Value should be 0');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.TF.Totals, 0, 'MyerBriggsBit TF Totals should be 0');
            chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.JP.QuestionCount, 0, 'MyerBriggsBit JP QuestionCount should be 0');
        })
		it.only('MyersBriggs functions', () => {
            // UserQnaire -> setAnswer, qnAnIndex
            // UserQnaire isn't important, save it for last or delete it.
            resetDatabase()
            let usrQnr = FactoryBoy.create("testUserQnaire", { _id: "123" })
            console.log('usrQnr', usrQnr);
        })
    });
}

/*
 * Istanbul coverage is below 80%
 * Tests that need to be done:
 * 
 * MyersBriggsBit -> addValue, removeValue, reset
 * MyersBriggs -> addByCategory, removeByCategory, getIdentifierById, getFourLetter, reset
 * UserQnaire -> setAnswer, qnAnIndex
 * UserType -> getAnsweredQuestionsIDs, setTotalQuestions, getTotalQuestions, answerQuestion, unAnswerQuestion, getQnaire, getAnswerIndexForQuestionID, reset
 * Profile -> fullName, traitSpectrumQnaire, returnString, addQnaireResponse
 * User -> resolveError, create, profileUpdate, removeQnaireResponse, registerTechnicalSkillsDataKey
 * UserType.extend (only one line)
 * 
 * User -> Profile -> UserType -> MyersBriggs -> MyersBriggsBit
 * User -> Profile -> UserType -> UserQnaire
 */
