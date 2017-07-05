// Definition of the questions collection

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { User } from '../users/users.js';

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
        beforeUpdate(e) {
            const allowed = [ 'updatedAt', 'TimesAnswered', 'TimesAnswered.LeftSum', 'SumOfAnswers', 'SumOfAnswers.LeftSum', 'TimesAnswered.RightSum', 'SumOfAnswers.RightSum' ];
            const doc = e.currentTarget;
            const fieldNames = doc.getModified();
            _.each(fieldNames, function (fieldName) {
                if(allowed.indexOf(fieldName) < 0 && !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
                    throw new Meteor.Error(403, "You are not authorized");
                }
            });
        }
    }
});

export { Question, Reading, MyersBriggsCategory };
