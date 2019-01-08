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

if (Meteor.isServer)
{
    describe('Questions', function () {
        this.timeout(15000);

        beforeEach(function() {
            resetDatabase();

			
			if(Meteor.users.find().count() < 1) {
				defaultUser = Accounts.createUser({
					username: Defaults.user.username,
					email: Defaults.user.email,
					password: "password",
					isAdmin: Defaults.user.isAdmin,
					profile: Defaults.user.profile,
					teams: [Team.Default.Name]
				});
				//let t = Team.findOne( {Name: Team.Default.Name} );
				//t.CreatedBy = defaultUser._id;
				//t.save();
			}



            testData = {
                testQuestion: {
                    Text: 'Text Unit Test',
                    LeftText: 'Unit Test LeftText',
                    RightText: 'Unit Test RightText',
                    CreatedBy: 'TestId', //defaultUser._id.str,
                    Category: 0,
					//_id: 'TestQuestionId'
                }
            };

            //sinon.stub(Meteor, 'userId').returns(defaultUser._id);
			
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
            let q = new Question( testData.testQuestion );
            q.save();
            console.log("can create a question, q:", q);
			console.log(q._id);
			console.log("q._id: ", q._id);
            let qTest = Question.find( {_id: q._id} );
			console.log(qTest);
        });

        // Test of Question methods and helpers
        it('getUser returns the user that created the question', function() {
            let u = User.findOne( {username: Defaults.user.username} );
            let q = new Question( testData.testQuestion );
            q.CreatedBy = u._id;
            q.save();
            let qTest = q.getUser();
            chai.assert.equal( qTest._id, u._id );

        });
        it('Negative addAnswer results in addition to TimesAnswered.LeftSum', function() {
            let q = new Question( testData.testQuestion );
            q.save();
            let lsStart = q.TimesAnswered.LeftSum;
            let ans = {Value: -1};
            q.addAnswer(ans);
            let lsFinal = q.TimesAnswered.LeftSum;
            chai.assert(lsFinal == lsStart + 1);

        });
        it('Positve removeAnswer results in negation of TimesAnswered.RightSum', function() {
            let q = new Question( testData.testQuestion );
            let rsStart = q.TimesAnswered.RightSum;
            let ans = {Value: 1};
            q.addAnswer(ans);
            let rsAdd = q.TimesAnswered.RightSum;
            chai.assert(rsAdd == rsStart + 1);
            q.removeAnswer(ans);
            let rsRemove = q.TimesAnswered.RightSum;
            chai.assert(rsRemove == rsAdd - 1);

        });

        it('todo allAnsweredUsers returns at least one user that answered the question', function() {
          // We need to be able to access the database to test this function
          console.log("todo allAnsweredUsers... needs to be tested with the database");
        });
        it('todo unanswerAll unanswers the question for all users', function() {
          // We need to be able to access the database to test this function
          console.log("todo allAnsweredUsers... needs to be tested with the database");
        });
        it('reset() resets TimesAnswered and SumOfAnswers', function() {
            let q = new Question( testData.testQuestion );
            let taStart = ++q.TimesAnswered.LeftSum;
            let soaStart = ++q.SumOfAnswers.LeftSum;
            q.reset();
            let taFinish = q.TimesAnswered.LeftSum;
            let soaFinish = q.SumOfAnswers.LeftSum;
            chai.assert((taFinish == 0) && (soaFinish == 0));
        });


    });
}

