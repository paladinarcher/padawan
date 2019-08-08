// Methods related to Questions

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Question, MyersBriggsCategory } from './questions.js';
import { User, Answer} from '../users/users.js';

Meteor.methods({
    'question.insert'(category, text, left, right, seg) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let newQuestion = new Question({ Category: parseInt(category[0]), Categories: category.map((a)=>{return parseInt(a);}), Text: text, LeftText:left, RightText:right, segments:seg, CreatedBy:Meteor.userId() });
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
        let answer = new Answer({
            Categories: question.Categories,
            QuestionID: questionId,
            Reversed: !!isReversed,
            Value: value
        });
        question.addAnswer(answer);
        me.MyProfile.UserType.answerQuestion(answer);
        me.save();
    },
    'question.unanswer'(questionId) {
        let me = User.findOne({_id:Meteor.userId()});
        let answer = me.MyProfile.UserType.getAnswerForQuestion(questionId);
        if(answer == null) { throw new Meteor.Error(403, 'You can\'t unanwer a question you haven\'t answered.'); }
        me.MyProfile.UserType.unAnswerQuestion(answer);
        me.save();
    },
    'question.unanswerAll'(questionIds) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        if(!questionIds instanceof Array) { questionIds = [questionIds]; }
        let questions = Question.find({_id:{ $in : questionIds}});
        questions.forEach(function (question) { question.unanswerAll(); });
    },
    'question.delete'(questionId) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let me = User.findOne({_id:Meteor.userId()});
        let question = Question.findOne({_id:questionId});
        question.remove();
    },
    'question.resetUsers'(userIds) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        if(!userIds instanceof Array) { userIds = [userIds]; }
        let us = User.find({_id:{$in:userIds}});
        if(!us) { throw new Meteor.Error(404, "User is not found."); }
        us.forEach(function (u) {
            u.MyProfile.UserType.reset();
            u.save();
        });
    },
    'question.resetAll'() {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let qs = Question.find({});
        qs.forEach(function (q) {
            q.unanswerAll();
        });
        let us = User.find({});
        us.forEach(function (u) {
            u.MyProfile.UserType.reset();
            u.save();
        });
    },
    'question.countQuestions'(myUserId) {
        //console.log("happy1");
        let me = User.findOne({_id:myUserId});
        //console.log("UserID", me);
        let totalQuestions = Question.find().count();
        //console.log("happy3", totalQuestions);
        me.MyProfile.UserType.setTotalQuestions(totalQuestions);
        //console.log("happy4", me.MyProfile.UserType.getTotalQuestions());
        return totalQuestions;
    },
    'question.getQuestions'() {
        return Question.find();
    },
});
