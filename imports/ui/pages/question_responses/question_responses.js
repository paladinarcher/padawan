import './question_responses.html';
import {Question} from "../../../api/questions/questions";
import { Meteor } from 'meteor/meteor';
import {User} from "../../../api/users/users";

    Template.question_responses.onCreated(function () {
        this.autorun( () => {
            if (Roles.subscription.ready()) {
                if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                    FlowRouter.redirect('/notfound');
                } else {
                    let questionNumber = (parseInt(FlowRouter.getQueryParam('question')) ? FlowRouter.getQueryParam('question') : -1);
                    if (questionNumber > -1) {
                        this.data.questionNumberDisplay = questionNumber;
                        this.data.questionAnsweredText = "question" + questionNumber;
console.log("QuestionNumber =======    " + questionNumber);

                    }
                }
            }
        });
/*
        this.getQuestionNumber = () => {
            return this.data.questionNumberDisplay;
        };
        this.getQuestionAnsweredText = () => {
            return this.data.questionAnsweredText;
        };

 */
        this.subscription = this.subscribe('questions.questionList', {
            onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: true, arguments, THIS: this}) : null,
            onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: false, arguments, THIS: this}) : null,
            onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: false, arguments, THIS: this}) : null,
        });
    });

    Template.question_responses.helpers({
        usersWithQuestion() {
            let questionFound = Question.findOne({Text: Template.instance().data.questionAnsweredText});
            return User.find({ 'MyProfile.UserType.AnsweredQuestions.QuestionID':{ $eq:questionFound._id}});
        },
        getValue(userId){
            var aqValue = -1;
            let questionId = Question.findOne({Text: Template.instance().data.questionAnsweredText})._id;
            let thisUser = User.findOne({ _id: userId});

            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
               if(questionId == aq.QuestionID){
                   aqValue = aq.Value;
               }
           });
            return aqValue;
        },
        getLeftText(){
            let questionFound = Question.findOne({Text: Template.instance().data.questionAnsweredText});
            return questionFound.LeftText;
        },
        getRightText(){
            let questionFound = Question.findOne({Text: Template.instance().data.questionAnsweredText});
            return questionFound.RightText;
        },
        getI(userId) {
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({_id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if (aq.Categories[0] === 0) {
                    if (aq.Value < 0) {
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
                aqValue *= -1;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getE(userId){
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 0){
                    if(aq.Value > 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getN(userId){
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 1){
                    if(aq.Value < 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
                aqValue *= -1;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getS(userId){
            var aqValue = 0;
            var count;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 1){
                    if(aq.Value > 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getT(userId) {
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({_id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if (aq.Categories[0] === 2) {
                    if (aq.Value < 0) {
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
                aqValue *= -1;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getF(userId){
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 2){
                    if(aq.Value > 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getJ(userId){
            var aqValue = 0;
            var count = 0;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 3){
                    if(aq.Value < 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
                aqValue *= -1;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getP(userId){
            var aqValue = 0;
            var count;
            let thisUser = User.findOne({ _id: userId});
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(aq.Categories[0] === 3){
                    if(aq.Value > 0){
                        aqValue += aq.Value;
                        count++;
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getQuestionNumber() {
            return Template.instance().data.questionNumberDisplay;
        }
    });