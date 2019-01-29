// Definition of the questions collection

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { User } from '../users/users.js';
import { Defaults } from '/imports/startup/both/defaults.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

const MyersBriggsCategory = Enum.create({
    name: 'MyersBriggsCategory',
    identifiers: ['IE','NS','TF','JP']
});
const Reading = Class.create({
    name:'Reading',
    fields: {
        Rank: {
            type: Number,
            default: 0,
            validators: [{
                type: 'lte',
                resolveParam: function () { return 50; }
            },{
                type: 'gte',
                resolveParam: function () { return -50; }
            }]
        },
        Text: {
            type:String,
            default: 'Well, you feel...'
        }
    }
});
const PolarStats = Class.create({
    name: 'PolarStats',
    fields: {
        LeftSum: {
            type: Number,
            default: 0
        },
        RightSum: {
            type: Number,
            default: 0
        }
    },
    helpers: {
        reset() {
            this.LeftSum = 0;
            this.RightSum = 0;
        }
    }
});
const Question = Class.create({
    name: "Question",
    collection: new Mongo.Collection('questions'),
    fields: {
        Category: {
            type: MyersBriggsCategory,
            default: 'IE'
        },
        Categories: {
            type: [MyersBriggsCategory],
            default: []
        },
        Text: {
            type: String,
            default: 'Whoa! What we askin\' here?'
        },
        LeftText: {
            type: String,
            default: 'Whoa! What we askin\' here?'
        },
        RightText: {
            type: String,
            default: 'Whoa! What we askin\' here?'
        },
        Readings: {
            type: [Reading],
            default: function () {
                return [
                    { Rank: -50, Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."},
                    { Rank: -49, Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."},
                    { Rank: -40, Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "},
                    { Rank: -30, Text: "This is your most common behavior, but there are definitely times you've done the opposite."},
                    { Rank: -20, Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."},
                    { Rank: -10, Text: "You don't have much of a preference either way, but this side sounds a bit more likely."},
                    { Rank: 10, Text: "You don't have much of a preference either way, but this side sounds a bit more likely."},
                    { Rank: 20, Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."},
                    { Rank: 30, Text: "This is your most common behavior, but there are definitely times you've done the opposite."},
                    { Rank: 40, Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "},
                    { Rank: 49, Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."},
                    { Rank: 50, Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."}
                ];
            }
        },
        segments: {
            type: [String],
            default: []
        },
        Active: {
            type: Boolean,
            default: false
        },
        CreatedBy: {
            type: String,
            default: function() { return Meteor.userId(); }
        },
        TimesAnswered: {
            type: PolarStats,
            default: function () { return new PolarStats(); }
        },
        SumOfAnswers: {
            type: PolarStats,
            default: function () { return new PolarStats(); }
        },
		mochaTesting: {
			type: Boolean,
			default: false
		}
    },
    meteorMethods: {
        getUser() {
            let u = User.findOne({_id:this.CreatedBy});
            return u;
        }
    },
    helpers: {
        addAnswer(answer) {
            if(answer.Value < 0) {
                this.TimesAnswered.LeftSum++;
                this.SumOfAnswers.LeftSum += answer.Value;
            } else {
                this.TimesAnswered.RightSum++;
                this.SumOfAnswers.RightSum += answer.Value;
            }
            this.save();
        },
        removeAnswer(answer) {
            if(answer.Value < 0) {
                this.TimesAnswered.LeftSum--;
                if(this.TimesAnswered.LeftSum <= 0) { this.TimesAnswered.LeftSum = 0; this.SumOfAnswers.LeftSum = 0; }
                else { this.SumOfAnswers.LeftSum -= answer.Value; }
            } else {
                this.TimesAnswered.RightSum--;
                if(this.TimesAnswered.RightSum <= 0) { this.TimesAnswered.RightSum = 0; this.SumOfAnswers.RightSum = 0; }
                else { this.SumOfAnswers.RightSum -= answer.Value; }
            }
            this.save();
        },
        allAnsweredUsers() {
            return User.find({ 'MyProfile.UserType.AnsweredQuestions.QuestionID':{ $eq: this._id } });
        },
        unanswerAll(noSave) {
            let self = this;
            self.allAnsweredUsers().forEach(function (user) {
                let b = user.MyProfile.UserType.AnsweredQuestions.length;
                user.MyProfile.UserType.unAnswerQuestion(user.MyProfile.UserType.getAnswerForQuestion(self._id), false);
                if(!noSave) { user.save(); }
            });
            this.reset();
        },
        reset() {
            this.TimesAnswered.reset();
            this.SumOfAnswers.reset();
            this.save();
        }
    },
    behaviors: {
        timestamp: {},
        softremove: {}
    },
    secured: {
        update: false
    },
    events: {
        beforeInsert(e) {
			if (e.target.mochaTesting != true){
				let u = User.findOne( {username:Defaults.user.username} );
				UserNotify.add({
					userId: u._id,
					title: 'Questions',
					body: 'New question added',
					action: 'questions:'+e.currentTarget._id
				});
			}
        },
        beforeUpdate(e) {
            const allowed = [ 'updatedAt', 'TimesAnswered', 'TimesAnswered.LeftSum', 'SumOfAnswers', 'SumOfAnswers.LeftSum', 'TimesAnswered.RightSum', 'SumOfAnswers.RightSum' ];
            const doc = e.currentTarget;
            const fieldNames = doc.getModified();
            _.each(fieldNames, function (fieldName) {
                if(!Meteor.isServer && allowed.indexOf(fieldName) < 0 && !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
                    throw new Meteor.Error(403, "You are not authorized");
                }
            });
        }
    }
});

export { Question, Reading, MyersBriggsCategory };
