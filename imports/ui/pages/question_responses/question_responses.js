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
                    this.data.questionText = FlowRouter.getQueryParam('question');
console.log("!!!!!!!!!! In onCreated   " + this.data.questionText);
                }
            }
        });
        this.subscription = this.subscribe('questions.questionList', {
            onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: true, arguments, THIS: this}) : null,
            onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: false, arguments, THIS: this}) : null,
            onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions', readyStatus: false, arguments, THIS: this}) : null,
        });
    });

    Template.question_responses.helpers({
        usersWithQuestion() {
console.log("!!!!!!!!!! In usersWithQuestion       " + Template.instance().data.questionText);

            let questionFound = Question.findOne({Text: Template.instance().data.questionText});
            return User.find({ 'MyProfile.UserType.AnsweredQuestions.QuestionID':{ $eq:questionFound._id}});
        },
        getValue(userId){
            var aqValue = -1;
            let questionId = Question.findOne({Text: Template.instance().data.questionText})._id;
            let thisUser = User.findOne({ _id: userId});

            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
               if(questionId == aq.QuestionID){
                   aqValue = aq.Value;
               }
           });
            return aqValue;
        },
        getLeftRightText(whichSide){
console.log("!!!!!!!!!! In getLeftRightText       " + Template.instance().data.questionText);
            let questionFound = Question.findOne({Text: Template.instance().data.questionText});
            if("L" === whichSide) {
                return questionFound.LeftText;
            }else{
                return questionFound.RightText;
            }
        },
        getTraitValue(whichTrait, userId){
            let aqValue = 0;
            let count = 0;
            let thisUser = User.findOne({_id: userId});
            let cat = 0;
            let direction = 'L';
            switch(whichTrait){
                case 'E':
                    cat = 0;
                    direction = "R"
                    break;
                case 'I':
                    cat = 0;
                    direction = "L"
                    break;
                case 'S':
                    cat = 1;
                    direction = "R"
                    break;
                case 'N':
                    cat = 1;
                    direction = "L"
                    break;
                case 'T':
                    cat = 2;
                    direction = "L"
                    break;
                case 'F':
                    cat = 2;
                    direction = "R"
                    break;
                case 'J':
                    cat = 3;
                    direction = "L"
                    break;
                case 'P':
                    cat = 3;
                    direction = "R"
                    break;
            }
            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if (aq.Categories[0] === cat) {
                    if(direction === "L"){
                        if (aq.Value < 0) {
                            aqValue += aq.Value;
                            count++;
                        }
                    }else{
                        if (aq.Value > 0) {
                            aqValue += aq.Value;
                            count++;
                        }
                    }
                }
            });
            if (count > 0) {
                aqValue /= count;
                if(aqValue < 0){
                    aqValue *= -1;
                }
            }else{
                aqValue = 0;
            }
            return aqValue.toFixed(2);
        },
        getQuestionText() {
console.log("!!!!!!!!!! In getQuestionText       " + Template.instance().data.questionText);

            return Template.instance().data.questionText;
        }
    });