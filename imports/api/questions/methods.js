// Methods related to Questions

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Question, MyersBriggsCategory } from './questions.js';
import { User, Answer} from '../users/users.js';

Meteor.methods({
    'question.insert'(category, text, left, right) {
        let newQuestion = new Question({ Category: parseInt(category), Text: text, LeftText:left, RightText:right, CreatedBy:Meteor.userId() });
        console.log(category, text, newQuestion);
        newQuestion.validate({
            cast: true
        });

        return newQuestion.save();
    },
    'question.answer'(questionId, value, isReversed) {
        let question = Question.findOne({_id:questionId});
        let me = User.findOne({_id:Meteor.userId()});
        value = parseFloat(value);
        if(!!isReversed) { value = ~value + 1; }
        console.log(questionId, value, !!isReversed);
        if(value < 0) {
            question.TimesAnswered.LeftSum++;
            question.SumOfAnswers.LeftSum += value;
        } else {
            question.TimesAnswered.RightSum++;
            question.SumOfAnswers.RightSum += value;
        }
        question.save();
        let answer = new Answer({
            Category: question.Category,
            QuestionID: questionId,
            Reversed: !!isReversed,
            Value: value
        });
        me.MyProfile.UserType.answerQuestion(answer);
        //console.log(me.MyProfile.UserType);
        me.save();
    },
    'question.delete'(questionId) {
        
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let me = User.findOne({_id:Meteor.userId()});
        let question = Question.findOne({_id:questionId});
        question.remove();
    }
});
