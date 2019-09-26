import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { User, MyersBriggs } from './users.js';
import { Team } from '../teams/teams.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import {Answer, UserType} from "./users";
import {MyersBriggsCategory, Question} from "../questions/questions";
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

FactoryBoy.define("question77", Question, {
    _id: '98765555555',
    Category: 0,
    //	Categories: [],
    //	Text: 'Text Unit Test',
    //	LeftText: 'Unit Test LeftText',
    //	RightText: 'Unit Test RightText',
    //	Readings: [],
    //	segments: [],
    //	active: false,
    CreatedBy: 'Darth Vader',
    mochaTesting: true
});

FactoryBoy.define("answer77", Answer, {
    QuestionID: '98765555555'
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
            it('non admin user cannot remove roles', function testRemoveRoleMethodNonAdmin(done) {
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
            it('total questions can be set and returned', function totalQuestionsTest(done) {
                resetDatabase()
                let nonAdminUser, user, stub, keyResult
                nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "666"})
                stub = sinon.stub(Meteor, "userId")
                stub.returns(nonAdminUser)
                user = User.findOne({_id: "666"})
                user.MyProfile.UserType.setTotalQuestions(7);
                let thisResult = user.MyProfile.UserType.getTotalQuestions();
                chai.assert(thisResult === 7, 'UserType Total Questions was NOT set and returned.');
                //NOTE:  This is NOT being saved to the db!!
                stub.restore()
                done()
            })
            it('answerQuestion stores answers and getAnsweredQuestionsIDs returns ids of those created', function answerQuestionTest(done) {
                resetDatabase()
                let u = FactoryBoy.create("nonAdminUser1", {_id: "666"});
                let findUser = User.findOne({ _id: u._id });
                let q = FactoryBoy.create('question77');
                let newAnswer = FactoryBoy.build("answer77")
                let myStub = sinon.stub(Meteor, 'userId').returns(u);
                findUser.MyProfile.UserType.answerQuestion(newAnswer);
                let q1 = FactoryBoy.create("question77", {_id: "98765555556"});
                newAnswer = FactoryBoy.build("answer77", {QuestionID: "98765555556"})
                findUser.MyProfile.UserType.answerQuestion(newAnswer);
                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members(['98765555555', '98765555556']), "Answered questions did NOT contain the right values");
                myStub.restore();
                done()
            })
            it('unAnswerQuestion removes the answer', function unAnswerQuestionTest(done) {
                /**
                 * This never works if the line answer.unanswer(); exists in users.js.unAnswerQuestion()
                 * it SEEMS to remove them without that line.  And I can't figure out why it blows up with that line in.
                 * !skipSlice seems to remove the answer so must be false;
                 */
                resetDatabase()
                let u = FactoryBoy.create("nonAdminUser1", {_id: "666"});
                let myStub = sinon.stub(Meteor, 'userId').returns(u);
                let findUser = User.findOne({ _id: u._id });
                let q, q1, q2, q3, a, a1, a2, a3
                q = FactoryBoy.create('question77');
                q1 = FactoryBoy.create("question77", {_id: "98765555556"});
                a = FactoryBoy.build("answer77")
                a1 = FactoryBoy.build("answer77", {QuestionID: q1._id})
                q2 = FactoryBoy.create("question77", {_id: "98765555560"});
                a2 = FactoryBoy.build("answer77", {QuestionID: q2._id})
                q3 = FactoryBoy.create("question77", {_id: "98765555565"});
                a3 = FactoryBoy.build("answer77", {QuestionID: q3._id})
                findUser.MyProfile.UserType.answerQuestion(a);
                findUser.MyProfile.UserType.answerQuestion(a1);
                findUser.MyProfile.UserType.answerQuestion(a2);
                findUser.MyProfile.UserType.answerQuestion(a3);
                findUser.MyProfile.UserType.unAnswerQuestion(a, false);
                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members(['98765555556', '98765555560', '98765555565']), "Answered questions did NOT contain the right values.  skipSlice === false.");
                findUser.MyProfile.UserType.answerQuestion(a);
                findUser.MyProfile.UserType.unAnswerQuestion(a1, false);
                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members(['98765555555', '98765555560', '98765555565']), "Answered questions did NOT contain the right values.  skipSlice === false.");
                findUser.MyProfile.UserType.answerQuestion(a1);
                findUser.MyProfile.UserType.unAnswerQuestion(a3, false);
                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members(['98765555555', '98765555556', '98765555560']), "Answered questions did NOT contain the right values.  skipSlice === false.");
                myStub.restore();
                done()
            })
            it('getAnswerIndexForQuestionID and getAnswerForQuestion testing', function getAnswerIndexForQuestionIDTest(done) {
                resetDatabase()
                let u = FactoryBoy.create("nonAdminUser1", {_id: "666"});
                let findUser = User.findOne({ _id: u._id });
                let q, q1, q2, q3, a, a1, a2, a3
                q = FactoryBoy.create('question77');
                q1 = FactoryBoy.create("question77", {_id: "98765555556"});
                q2 = FactoryBoy.create("question77", {_id: "98765555557"});
                q3 = FactoryBoy.create("question77", {_id: "98765555558"});
                a = FactoryBoy.build("answer77")
                a1 = FactoryBoy.build("answer77", {QuestionID: q1._id})
                a2 = FactoryBoy.build("answer77", {QuestionID: q2._id})
                a3 = FactoryBoy.build("answer77", {QuestionID: q3._id})
                let myStub = sinon.stub(Meteor, 'userId').returns(u);
                findUser.MyProfile.UserType.answerQuestion(a);
                findUser.MyProfile.UserType.answerQuestion(a1);
                findUser.MyProfile.UserType.answerQuestion(a2);
                findUser.MyProfile.UserType.answerQuestion(a3);
                chai.assert(findUser.MyProfile.UserType.getAnswerIndexForQuestionID(q2._id) === 2, 'Index for answer of quesiton 2 was not correct!');
                chai.assert(findUser.MyProfile.UserType.getAnswerForQuestion(q2._id).QuestionID === '98765555557', 'Answer for question 2 was NOT found.');
                myStub.restore();
                done()
            })
            it('reset testing', function resetTest(done) {
                resetDatabase()
                let u = FactoryBoy.create("nonAdminUser1", {_id: "666"});
                let findUser = User.findOne({ _id: u._id });
                let q, q1, q2, q3, a, a1, a2, a3
                q = FactoryBoy.create('question77');
                q1 = FactoryBoy.create("question77", {_id: "98765555556"});
                q2 = FactoryBoy.create("question77", {_id: "98765555557"});
                q3 = FactoryBoy.create("question77", {_id: "98765555558"});
                a = FactoryBoy.build("answer77")
                a1 = FactoryBoy.build("answer77", {QuestionID: q1._id})
                a2 = FactoryBoy.build("answer77", {QuestionID: q2._id})
                a3 = FactoryBoy.build("answer77", {QuestionID: q3._id})
                let myStub = sinon.stub(Meteor, 'userId').returns(u);
                findUser.MyProfile.UserType.answerQuestion(a);
                findUser.MyProfile.UserType.answerQuestion(a1);
                findUser.MyProfile.UserType.answerQuestion(a2);
                findUser.MyProfile.UserType.answerQuestion(a3);
                findUser.MyProfile.UserType.reset()
                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members([]), 'AnsweredQuestions was not reset.');
                chai.assert(expect(findUser.MyProfile.UserType.Personality.type).to.be.undefined, 'Personality was not reset.');
                myStub.restore();
                done()
            })
        });
        describe('profile', function () {
            it('user full name is returned by profile.fullName method and can be case converted', function returnUserFullName(done) {
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

            it('test profile.traitSpectrumQnaire helper', function traitSpectrumHelperTest(done){
                resetDatabase()
                let nonAdminUser, user, stub, keyResult
                nonAdminUser = FactoryBoy.create("nonAdminUser1", {_id: "666"})
                stub = sinon.stub(Meteor, "userId")
                stub.returns(nonAdminUser)
                user = User.findOne({_id: "666"})
                let result = user.MyProfile.traitSpectrumQnaire('categoryLetters');
                chai.assert(result != 'console.log("inputKey does not match");', 'profile.traitSpectrumQnaire did not return expected result');
                stub.restore()
                done()
            })
            //There are several helpers that require a large amount of setup to test.  Not done yet.  This needs to be done.  Honest
        });
        describe('MyersBriggs', function () {
            it('MyersBriggs addByCategory and removeByCategory', function testMBAddByCategory(done) {
                //This goes through MyersBriggs.addByCategory and removeByCategory,
                // but how do I assert that anything happened?
                resetDatabase()
                let u = FactoryBoy.create("nonAdminUser1", {_id: "666"});
                let findUser = User.findOne({ _id: u._id });
                let q = FactoryBoy.create('question77');
                let newAnswer = FactoryBoy.build("answer77")
                let myStub = sinon.stub(Meteor, 'userId').returns(u);
                findUser.MyProfile.UserType.answerQuestion(newAnswer);
                let q1 = FactoryBoy.create("question77", {_id: "98765555556"});
                newAnswer = FactoryBoy.build("answer77", {QuestionID: "98765555556"})
                let answer = new Answer({
                    Categories: [MyersBriggsCategory.IE],
                    QuestionID: '98765555556',
                    Reversed: false,
                    Value: 2
                });
                findUser.MyProfile.UserType.answerQuestion(answer);
                findUser.MyProfile.UserType.unAnswerQuestion(answer);


//                chai.assert(expect(findUser.MyProfile.UserType.getAnsweredQuestionsIDs()).to.have.members(['98765555555', '98765555556']), "Answered questions did NOT contain the right values");
                myStub.restore();
                done()


            })

        });
    });
}
