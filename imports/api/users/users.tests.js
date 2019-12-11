// import { Meteor } from 'meteor/meteor';
// import { chai } from 'meteor/practicalmeteor:chai';
// import { User, Answer, UserQnaire, QnaireAnswer } from './users.js';
// import { Team } from '../teams/teams.js';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { Question } from '/imports/api/questions/questions.js';
// import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js'; 

// const Q2ID = '838379240375'

// FactoryBoy.define("theQuestion", Question, {
//     _id: 'idNotSet'
// });

// FactoryBoy.define("question2", Question, {
//   _id: Q2ID,
//   Category: 0,
//   //	Categories: [],
//   //	Text: 'Text Unit Test',
//   //	LeftText: 'Unit Test LeftText',
//   //	RightText: 'Unit Test RightText',
//   //	Readings: [],
//   //	segments: [],
//   //	active: false,
//   CreatedBy: 'Bill Murray',
//   mochaTesting: true
// });

// FactoryBoy.define("nonAdminUser1", User, {
//     _id: "1234567899912839",
//     services: {
//         password: {}
//     },
//     username: "bestTestUser",
//     emails: [],
//     slug: "testUser@domain.com",
//     MyProfile: {
//         firstName: "testUser",
//         lastName: "test",
//         gender: true,
//         UserType: {
//             Personality: {},
//             AnsweredQuestions: []
//         },
//         birthDate: new Date("December 17, 1995 03:24:00")
//     },
//     teams: [],
//     roles: {},
//     profile: {
//         first_name: "testUser",
//         last_name: "test",
//         gender: "male"
//     }
// });

// FactoryBoy.define("adminUser1", User, {
//     _id: "999",
//     services: {
//         password: {}
//     },
//     MyProfile: {
//         firstName: "adminUser",
//         lastName: "admin",
//         gender: true
//     },
//     roles: {
//         __global_roles__: ["admin"]
//     }
// });

// FactoryBoy.define("TestTeam", Team, {
//     Name: "theRealTestTeam1",
//     Description: "team description",
//     CreatedBy: "The Man, The Myth, The Legend.",
//     Members: ["coolest member"]
// });

// if (Meteor.isServer) {
//     describe('User', function () {

//         afterEach(function () {
//             resetDatabase();
//         })
//         it('can create a new non admin user', function testCreateUser(done) {
//             resetDatabase()
//             FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
//             let dbLookupUser = User.findOne({ _id: "1234567899912839" })
//             chai.assert(dbLookupUser !== undefined, "Non Admin User was not created")
//             done()
//         })

//         it('can create a new admin user', function testCreateAdminUser(done) {
//             resetDatabase()
//             FactoryBoy.create("adminUser1", { _id: '999' })
//             let dbLookupUser = User.findOne({_id: "999"})
//             chai.assert(dbLookupUser !== undefined, "Admin User was not created")
//             done()
//         });

//         it('user full name is returned by full name method', function returnUserFullName(done) {
//             resetDatabase()
//             FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
//             let dbLookupUser = User.findOne({ _id: "1234567899912839" })
//             let firstName = dbLookupUser.MyProfile.firstName
//             let lastName = dbLookupUser.MyProfile.lastName
//             let userName = firstName + ' ' + lastName
//             let result = (dbLookupUser.fullName() === userName) ? true : false
//             chai.assert(result === true, 'user full name is not being returned by full name method')
//             done()
//         })

//         it('user can update their profile information', function testUpdateProfile(done) {
//             resetDatabase()
//             let nonAdminUser = FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
//             let myStub = sinon.stub(Meteor, "userId")
//             myStub.returns(nonAdminUser)
//             let getloggedInUser = () => User.findOne({ _id: Meteor.userId()._id }) 
//             let loggedInUser = getloggedInUser()
//             let uprofile = {
//                 firstName: 'Charlie',
//                 lastName: 'Testerino',
//             };
//             loggedInUser.profileUpdate(uprofile)
//             loggedInUser = getloggedInUser()
//             let result = ( (loggedInUser.MyProfile.firstName === 'Charlie') && (loggedInUser.MyProfile.lastName === 'Testerino') ) ? true : false 
//             chai.assert(result === true, 'User profile information did not update')
//             myStub.restore()
//             done()
//         })

//         it('user can be added to a team by the addTeam method', function testAddTeamMethod(done) {
//             resetDatabase()
//             FactoryBoy.create('TestTeam')
//             FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })
//             let user = User.findOne({ _id: '1234567899912839'})
//             user.addTeam('theRealTestTeam1')
//             user = User.findOne({ _id: "1234567899912839"})
//             let result = (user.roles.theRealTestTeam1 !== undefined) ? true : false
//             chai.assert(result === true, 'User is not part of the test team')
//             done()
//         })

//         it('user can change name with changeName method', function testChangeNameMethod(done) {
//             resetDatabase()
//             FactoryBoy.create("nonAdminUser1", { _id: "1234567899912839" })

//             let firstName = 'Charlie'
//             let lastName = 'Testerino'
//             let user = User.findOne({ _id: "1234567899912839" })
//             let changedFirstName, changedLastName, result
            
//             user.changeName(firstName, lastName)
//             user = User.findOne({ _id: "1234567899912839" })
//             changedFirstName = user.MyProfile.firstName
//             changedLastName = user.MyProfile.lastName
//             result = ((firstName === changedFirstName) && (lastName === changedLastName)) ? true : false
//             chai.assert(result === true, 'User name is not changing using changeName method')
//             done()
//         })

//         it('user can add roles', function testAddRoleMethod(done) {
//             resetDatabase()
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
//             let newRole, user, stub, result 
//             stub = sinon.stub(Meteor, "userId")
//             stub.returns(adminUser)
//             newRole = 'member'
//             user = User.findOne({ _id: "999" })
//             user.addRole(newRole)
//             user = User.findOne({ _id: "999" })
//             result = (user.roles.__global_roles__.indexOf(newRole) > -1) ? true : false 
//             chai.assert(result === true, 'User role was not added via addRole method')
//             stub.restore()
//             done()
//         })

//         it('user can remove roles', function testRemoveRoleMethod(done) {
//             resetDatabase()
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
//             let newRole, user, stub, result

//             stub = sinon.stub(Meteor, "userId")
//             stub.returns(adminUser)
            
//             newRole = 'member'

//             user = User.findOne({ _id: "999" })
//             user.addRole(newRole)
            
//             user = User.findOne({ _id: "999" })
//             user.removeRole(newRole)
            
//             user = User.findOne({ _id: "999" })

//             result = (user.roles.__global_roles__.indexOf(newRole) === -1) ? true : false
            
//             chai.assert(result === true, 'User role was not removed via removeRole method')
//             stub.restore()
//             done()
//         })

//         // Istanbul coverage is below 80%. The tests below should fix it
// 		it('MyersBriggsBit functions', () => {
//             // MyersBriggsBit -> addValue, removeValue, reset
//             resetDatabase()
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
//             // console.log('adminUser.MyProfile.UserType.Personality', adminUser.MyProfile.UserType.Personality);
//             // console.log('adminUser.MyProfile.UserType.Personality.NS', adminUser.MyProfile.UserType.Personality.NS);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit value should start at 0');
//             adminUser.MyProfile.UserType.Personality.NS.addValue(1);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 1, 'MyerBriggsBit Value should be 1');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 1, 'MyerBriggsBit QuestionCount should be 1');
//             adminUser.MyProfile.UserType.Personality.NS.removeValue(1);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit value should be 0');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 0, 'MyerBriggsBit QuestionCount should be 0');
//             adminUser.MyProfile.UserType.Personality.NS.addValue(1);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 1, 'MyerBriggsBit Value should be 1');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 1, 'MyerBriggsBit QuestionCount should be 1');
//             adminUser.MyProfile.UserType.Personality.NS.reset();
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.QuestionCount, 0, 'MyerBriggsBit QuestionCount should be 0');
//             // console.log('2 adminUser.MyProfile.UserType.Personality.NS', adminUser.MyProfile.UserType.Personality.NS);
// 		})
// 		it('MyersBriggs functions', () => {
//             // MyersBriggs -> addByCategory, removeByCategory, getIdentifierById, getFourLetter, reset
//             resetDatabase()
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" })
//             adminUser.MyProfile.UserType.Personality.addByCategory(0, -1);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.Value, -1, 'MyerBriggsBit IE Value should be -1');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.QuestionCount, 1, 'MyerBriggsBit IE QuestionCount should be 1');
//             adminUser.MyProfile.UserType.Personality.removeByCategory(0, -1);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.Value, 0, 'MyerBriggsBit IE Value should be 0');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.IE.QuestionCount, 0, 'MyerBriggsBit IE QuestionCount should be 0');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.getIdentifierById(1), 'NS', 'MyerBriggsBit getIdentifierById categoryId 1 should return NS');
//             adminUser.MyProfile.UserType.Personality.addByCategory(0, -1);
//             adminUser.MyProfile.UserType.Personality.addByCategory(1, 1);
//             adminUser.MyProfile.UserType.Personality.addByCategory(2, 2);
//             adminUser.MyProfile.UserType.Personality.addByCategory(3, 3);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.getFourLetter(), 'ISFP', 'Because IE is negative and the others are positive, getFourLetter should be ISFP');
//             adminUser.MyProfile.UserType.Personality.reset();
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.NS.Value, 0, 'MyerBriggsBit NS Value should be 0');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.TF.Totals, 0, 'MyerBriggsBit TF Totals should be 0');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.Personality.JP.QuestionCount, 0, 'MyerBriggsBit JP QuestionCount should be 0');
//         })
//         // if the UserQnaire test is failing, it could be that UserQnaire was deleted. If this is the case, delete the UserQnaire mocha test.
// 		it('UserQnaire functions', () => {
//             // UserQnaire -> setAnswer, qnAnIndex
//             // UserQnaire isn't important, save it for last or delete it.
//             resetDatabase();
//             // let usrQnr = FactoryBoy.create("testUserQnaire", { _id: "123" });
//             // console.log('usrQnr', usrQnr);

//             let myUQnr = new UserQnaire({ QnaireAnswers: [new QnaireAnswer] });
//             // console.log('myUQnr: ', myUQnr);
//             // console.log('myUQnr.QnaireAnswers: ', myUQnr.QnaireAnswers);
//             myUQnr.setAnswer('', new QnaireAnswer({ question: 'new test question' }));
//             // console.log('myUQnr.QnaireAnswers: ', myUQnr.QnaireAnswers[0]);
//             chai.assert.strictEqual(myUQnr.QnaireAnswers[0].question, 'new test question', 'the QnaireAnswer question text should have changed to: new test question');
//         })
// 		it('UserType functions', () => {
//             // UserType -> getAnsweredQuestionsIDs, setTotalQuestions, getTotalQuestions, answerQuestion, unAnswerQuestion, getQnaire (deleted it), getAnswerIndexForQuestionID, reset
//             resetDatabase();
//             // console.log('todo UserType');
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" });
//             FactoryBoy.create("question2");

//             // setTotalQuestions getTotalQuestions tests
//             adminUser.MyProfile.UserType.Personality.addByCategory(0, -1);
//             adminUser.MyProfile.UserType.Personality.addByCategory(1, 1);
//             adminUser.MyProfile.UserType.Personality.addByCategory(2, 2);
//             adminUser.MyProfile.UserType.Personality.addByCategory(3, 3);
//             // console.log('adminUser.MyProfile.UserType: ', adminUser.MyProfile.UserType);
//             adminUser.MyProfile.UserType.setTotalQuestions(2);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.getTotalQuestions(), 2, 'TotalQuestions should be set to 2');

//             // answerQuestion test
//             adminUser.MyProfile.UserType.answerQuestion(new Answer({ Value: -7, Categories: [1], QuestionID: 'ybId' }));
//             adminUser.MyProfile.UserType.answerQuestion(new Answer({ Value: -12, Categories: [0], QuestionID: Q2ID }));
//             adminUser.MyProfile.UserType.answerQuestion(new Answer({ Value: 8, Categories: [1], QuestionID: 'ybId2' }));
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.AnsweredQuestions[0].Value, -7, 'Answer should have been added with the value of -7');
            
//             // unAnswerQuestion
//             adminUser.MyProfile.UserType.unAnswerQuestion(adminUser.MyProfile.UserType.AnsweredQuestions[1], false);
//             // console.log('adminUser.MyProfile.UserType.AnsweredQuestions: ', adminUser.MyProfile.UserType.AnsweredQuestions);
//             // console.log('adminUser.MyProfile.UserType.answerQuestion: ', adminUser.MyProfile.UserType.answerQuestion);
//             chai.assert.notStrictEqual(adminUser.MyProfile.UserType.AnsweredQuestions[1].Value, -12, 'AnsweredQuestions array element 1 should not have -12 as a value');
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.AnsweredQuestions.length, 2, 'the AnsweredQuestions array length should be 2');

//             // getAnsweredQuestionsIDs
//             let aqids = adminUser.MyProfile.UserType.getAnsweredQuestionsIDs();
//             chai.assert.strictEqual(aqids[0], 'ybId', 'getAnsweredQuestionsIDs element 0 should be ybId')
//             // console.log('aqids: ', aqids);

//             // getAnswerIndexForQuestionID
//             // console.log('adminUser.MyProfile.UserType: ', adminUser.MyProfile.UserType);
//             let idx = adminUser.MyProfile.UserType.getAnswerIndexForQuestionID('ybId');
//             chai.assert.strictEqual(idx, 0, 'getAnswerIndexForQuestionID should have returned 0');

//             // reset
//             // console.log('1111adminUser.MyProfile.UserType: ', adminUser.MyProfile.UserType);
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.AnsweredQuestions.length, 2, 'AnsweredQuestions length should be 2')
//             FactoryBoy.create("question2", { _id: 'ybId' });
//             FactoryBoy.create("question2", { _id: 'ybId2' });
//             adminUser.MyProfile.UserType.reset();
//             chai.assert.strictEqual(adminUser.MyProfile.UserType.AnsweredQuestions.length, 0, 'AnsweredQuestions length should be 0')
//             // console.log('2222adminUser.MyProfile.UserType: ', adminUser.MyProfile.UserType);
//         })
// 		it('Profile functions', () => {
//             console.log('todo Profile functions');
//             // Profile -> fullName, traitSpectrumQnaire, returnString, addQnaireResponse
//             resetDatabase();
//             // console.log('todo UserType');
//             let adminUser = FactoryBoy.create("adminUser1", { _id: "999" });

//             // fullName function
//             let lowerName = adminUser.MyProfile.fullName('lower');
//             let upperName = adminUser.MyProfile.fullName('upper');
//             chai.assert.strictEqual(lowerName, 'adminuser admin', 'fullName should have returned adminuser admin');
//             chai.assert.strictEqual(upperName, 'ADMINUSER ADMIN', 'fullName should have returned ADMINUSER ADMIN');

//             // traitSpectrumQnaire function
//             let retString = adminUser.MyProfile.traitSpectrumQnaire('categoryLetters');
//             let retReg = /qLength = 0;/.test(retString);
//             // console.log('retString: ', retString);
//             chai.assert.strictEqual(retReg, true, 'The traitSpectrumQnaire should return the code qLength = 0;');

//             // NOT FINISHED:
//             // addQnaireResponse function
//             // adminUser = User.findOne({ _id: "999" })
//             // console.log('1adminUser: ', adminUser);
//             // // adminUser = user.findOne({_id: 999});
//             // console.log('2adminUser: ', adminUser);
//             // adminUser.MyProfile.addQnaireResponse('testRespId');
//             // console.log('3adminUser: ', adminUser);

//         })
//    });
// }

// /*
//  * Notes for Istanbul coverage being below 80%
//  * Tests that need to be done:
//  * 
//  * COMPLETED:
//  * MyersBriggsBit -> addValue, removeValue, reset
//  * MyersBriggs -> addByCategory, removeByCategory, getIdentifierById, getFourLetter, reset
//  * UserQnaire -> setAnswer, qnAnIndex
//  * UserType -> getAnsweredQuestionsIDs, setTotalQuestions, getTotalQuestions, answerQuestion, unAnswerQuestion, getQnaire, getAnswerIndexForQuestionID, reset
//  * 
//  * NOT COMPLETED:
//  * Profile -> fullName, traitSpectrumQnaire, addQnaireResponse
//  * User -> resolveError, create, profileUpdate, removeQnaireResponse, registerTechnicalSkillsDataKey
//  * UserType.extend (only one line)
//  * 
//  * User -> Profile -> UserType -> MyersBriggs -> MyersBriggsBit
//  * User -> Profile -> UserType -> UserQnaire
//  */
