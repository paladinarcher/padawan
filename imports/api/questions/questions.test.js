import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { Question } from './questions.js';
import { PolarStats } from './questions.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Defaults } from '/imports/startup/both/defaults.js';
import { User } from '../users/users.js';
import { Answer } from "../users/users.js";
import { UserType } from "../users/users.js";
import { Profile } from "../users/users.js";
import { UserNotify } from '/imports/api/user_notify/user_notify.js';
import '/imports/startup/both/at_config.js';
import { Random } from 'meteor/random'
import { Team } from '../teams/teams.js';


let testData;
let defaultUser;



FactoryBoy.define("user2", User, {
  _id: "12345678942",
  services: {
    password: {}
  },
  username: "TestUser42",
  emails: [],
  slug: "testUser42@domain.com",
  MyProfile: {
    firstName: "testUser42",
    lastName: "test42",
    gender: true,
    UserType: {
      Personality: {},
      AnsweredQuestions: []
    },
    birthDate: new Date("December 22, 1995 03:24:00")
  },
  teams: [],
  roles: {},
  profile: {
    first_name: "testUser42",
    last_name: "test42",
    gender: "male"
  }
});

FactoryBoy.define("question1", Question, {
	_id: '98765432142',
	Category: 0,
//	Categories: [],
//	Text: 'Text Unit Test',
//	LeftText: 'Unit Test LeftText',
//	RightText: 'Unit Test RightText',
//	Readings: [],
//	segments: [],
//	active: false,
	CreatedBy: 'Bill Murray',
	mochaTesting: true
});

FactoryBoy.define("answer1", Answer, {
	QuestionID: '98765432142'
});

if (Meteor.isServer)
{
    describe('Questions', function () {
        this.timeout(15000);

        beforeEach(function() {
            resetDatabase();

			
//			if(Meteor.users.find().count() < 1) {
//				defaultUser = Accounts.createUser({
//					username: Defaults.user.username,
//					email: Defaults.user.email,
//					password: "password",
//					isAdmin: Defaults.user.isAdmin,
//					profile: Defaults.user.profile,
//					teams: [Team.Default.Name]
//				});
//				//let t = Team.findOne( {Name: Team.Default.Name} );
//				//t.CreatedBy = defaultUser._id;
//				//t.save();
//			}
//
//
//
//            testData = {
//                testQuestion: {
//                    Text: 'Text Unit Test',
//                    LeftText: 'Unit Test LeftText',
//                    RightText: 'Unit Test RightText',
//                    CreatedBy: 'TestId', //defaultUser._id.str,
//                    Category: 0,
//					//_id: 'TestQuestionId'
//                }
//            };
//
//            //sinon.stub(Meteor, 'userId').returns(defaultUser._id);
			
        });

        afterEach(function () {
            //Meteor.userId.restore();
            resetDatabase();
        });
        it('totalQuestions is greater than or equal to 0', function () {
            let totalQuestions = Question.find().count();
            chai.assert(totalQuestions >= 0, 'totalQuestions is negative');
        });

        it('can create a question', function () {
			let user42 = FactoryBoy.create('user2');
			let findUser = User.findOne({_id: user42._id});
            let q = FactoryBoy.create('question1');
			let findQuestion = Question.findOne({_id: "98765432142"});
            let qTest = Question.find( {_id: q._id} );
			chai.assert(qTest != undefined);
        });

        // Test of Question methods and helpers
        it('getUser returns the user that created the question', function() {
            let u = FactoryBoy.create('user2');
            let q = FactoryBoy.create('question1', {CreatedBy: u._id});
            let qTest = q.getUser();
            chai.assert.equal( qTest._id, u._id );

        });
        it('Negative addAnswer results in addition to TimesAnswered.LeftSum', function() {
            let q = FactoryBoy.create('question1');
            let lsStart = q.TimesAnswered.LeftSum;
            let ans = {Value: -1};
            q.addAnswer(ans);
            let lsFinal = q.TimesAnswered.LeftSum;
            chai.assert(lsFinal == lsStart + 1);

        });
        it('Positve removeAnswer results in negation of TimesAnswered.RightSum', function() {
            let q = FactoryBoy.create('question1');
            let rsStart = q.TimesAnswered.RightSum;
            let ans = {Value: 1};
            q.addAnswer(ans);
            let rsAdd = q.TimesAnswered.RightSum;
            chai.assert(rsAdd == rsStart + 1);
            q.removeAnswer(ans);
            let rsRemove = q.TimesAnswered.RightSum;
            chai.assert(rsRemove == rsAdd - 1);
        });

        it('allAnsweredUsers returns at least one user that answered the question', function() {
            let q = FactoryBoy.create('question1');
            let u = FactoryBoy.create('user2');
            let a = FactoryBoy.build('answer1');
			//u.MyProfile.UserType.answerQuestion(q);
            let myStub = sinon.stub(Meteor, 'userId').returns(u);
			User.update({_id: u._id}, {$push: {'MyProfile.UserType.AnsweredQuestions': a}});
            myStub.restore();

			let u2 = User.find({_id: u._id}).fetch()
			//console.log(u2[0].MyProfile.UserType.AnsweredQuestions[0].QuestionID);
			chai.assert.equal(u2[0].MyProfile.UserType.AnsweredQuestions[0].QuestionID, q._id, "Answer ID is not the same as Question ID");
			let ansUser = q.allAnsweredUsers();
			//console.log(ansUser.fetch());
            chai.assert.equal( ansUser.fetch()[0]._id, u._id, "question.allAnsweredUsers doesn't match the user ID");
		});
        it('reset() resets TimesAnswered and SumOfAnswers', function() {
            let q = FactoryBoy.create('question1');
            let ans = {Value: -2};
            q.addAnswer(ans);
            let taStart = q.TimesAnswered.LeftSum;
            let soaStart = q.SumOfAnswers.LeftSum;
            chai.assert((taStart == 1) && (soaStart == -2), "Error while adding an answer");
            q.reset();
            let taFinish = q.TimesAnswered.LeftSum;
            let soaFinish = q.SumOfAnswers.LeftSum;
            chai.assert((taFinish == 0) && (soaFinish == 0), "Error while reseting answers");
        });


    });
}

