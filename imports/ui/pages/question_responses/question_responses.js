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
        getReversed(userId){
            var aqReversed = "False";
            let questionId = Question.findOne({Text: Template.instance().data.questionAnsweredText})._id;
            let thisUser = User.findOne({ _id: userId});

            thisUser.MyProfile.UserType.AnsweredQuestions.forEach(aq => {
                if(questionId == aq.QuestionID){
                    if(aq.Reversed !== false){
                        aqReversed = "True";
                    }
                }
            });
            return aqReversed;
        },
        getIEScore(){

        },
        getQuestionNumber() {
            return Template.instance().data.questionNumberDisplay;
        }
    });

/*
            console.log(questionFound._id);
            console.log(Question.find().fetch());
            console.log(Question.find().count());
            console.log(Question.findOne({_id :{$eq:"2Y4CtdMLzKzuMKx5H"}}));
            console.log(User.find().fetch());

 */
//console.log(User.find(({User._id: ).MyProfile.UserType.AnsweredQuestions}).fetch();
/*
            var user = User.findOne({_id:'9ij57fDHGJDZHSLeg'});
            console.log('User last Name ^^^^^^^^^^^^^^^^^^^^^^^' + user.MyProfile.lastName);
console.log(Question.find().fetch());

 */
//    _id: '9F7nEAix2FLWBp4Xa'}).fetch());
/*
let question = Question.findOne({
    _id: '9F7nEAix2FLWBp4Xa'});

console.log('Text from found question ===        ' + question.Text);

return question._id;

 */
