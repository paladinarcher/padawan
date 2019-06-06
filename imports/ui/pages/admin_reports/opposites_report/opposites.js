import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './opposites.html';

// var minQuestionsAnswered = 72;

// function htmlToElement(html) {
//     var template = document.createElement('template');
//     html = html.trim(); // Never return a text node of whitespace as the result
//     template.innerHTML = html;
//     return template.content.firstChild;
// }

Template.opposite_responses.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else {
        this.userId = Meteor.userId();
    }

    if (Roles.subscription.ready()) {
        if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
            FlowRouter.redirect('/notfound');
        }
    }
    this.subscribe('userList');

//     this.subscribe('questions.bycategory', 0, {
//         onStop: function () {
//             console.log("QQ Subscription stopped! ", arguments, this);
//         }, onReady: function () {
//             console.log("QQ Subscription ready! ", arguments, this);
//         },
//         sort: {createdAt: -1}
//     });

//     this.subscribe('questions.bycategory', 1, {
//         onStop: function () {
//             console.log("QQ Subscription stopped! ", arguments, this);
//         }, onReady: function () {
//             console.log("QQ Subscription ready! ", arguments, this);
//         },
//         sort: {createdAt: -1}
//     });

//     this.subscribe('questions.bycategory', 2, {
//         onStop: function () {
//             console.log("QQ Subscription stopped! ", arguments, this);
//         }, onReady: function () {
//             console.log("QQ Subscription ready! ", arguments, this);
//         },
//         sort: {createdAt: -1}
//     });

//     this.subscribe('questions.bycategory', 3, {
//         onStop: function () {
//             console.log("QQ Subscription stopped! ", arguments, this);
//         }, onReady: function () {
//             console.log("QQ Subscription ready! ", arguments, this);
//         },
//         sort: {createdAt: -1}
//     });

//     this.autorun( () => {
        
//     });
});


Template.opposite_responses.helpers({
    getSummary() {
        let users = Meteor.users.find({}).fetch();
        users = users.filter((user) => {
            return user.MyProfile.UserType.AnsweredQuestions.length > 71;
        })
        return `Questions answered by ${users.length} users `
    },
    
    responders() {
        //hacks();
        let users = Meteor.users.find({}).fetch();
        users = users.filter((user) => {
            return user.MyProfile.UserType.AnsweredQuestions.length > 71;
        });
        let responders = [];
            if (users.length)  {
                users.forEach(function (user) {
                    responders = responders.concat(user.MyProfile);
                }); 
            };
        this.responders = responders;
        console.log('responders: ', responders);
        
        return responders;
        
    },
    ie(u) {
        var value = u.Personality.IE.Value;
        //console.log('value: ', Math.ceil(value));
        return (value === 0 ? "?" : (value < 0 ? "I" : "E"));
    },
    ei(u) {
        var value = u.Personality.IE.Value;
        return (value === 0 ? "?" : (value < 0 ? "E" : "I"));
    },
    ns(u) {
        var value = u.Personality.NS.Value;
        return (value === 0 ? "?" : (value < 0 ? "N" : "S"));
    },
    sn(u) {
        var value = u.Personality.NS.Value;
        return (value === 0 ? "?" : (value < 0 ? "S" : "N"));
    },
    tf(u) {
        var value = u.Personality.TF.Value;
        return (value === 0 ? "?" : (value < 0 ? "T" : "F"));
    },
    ft(u) {
        var value = u.Personality.TF.Value;
        return (value === 0 ? "?" : (value < 0 ? "F" : "T"));
    },
    jp(u) {
        var value = u.Personality.JP.Value;
        return (value === 0 ? "?" : (value < 0 ? "J" : "P"));
    },
    pj(u) {
        var value = u.Personality.JP.Value;
        return (value === 0 ? "?" : (value < 0 ? "P" : "J"));
    },
    ansIE(u) {
        let trait = u.Personality.IE.Value;
        console.log('trait: ', trait);
        
        let responses = u.AnsweredQuestions;
        responses = responses.filter((response) => {
            return response.Categories[0] === 0;
        });

        if(trait === 0){
            return 'Answer more Questions';
        } else if (trait < 0) {
            responses = responses.filter((response)=>{
                return response.Value > 0;
            });
        } else {
            responses = responses.filter((response)=>{
                return response.Value < 0;
            });
        }

        let value = responses.map(function(response){
            // console.log('response4: ', responses);
            let id = response.QuestionID;
            //let question = Meteor.questions.findOne({ _id: id }).LeftText;
            
            let value =  response.Value;
            let info = 'Question ID: ' + id + ' ' + 'Value: ' + value;     
            return info;
        });
        console.log('qs: ', Meteor);
        return value;
    },
    ansNS(u) {
        let trait = u.Personality.NS.Value;
        let responses = u.AnsweredQuestions;
        responses = responses.filter((response) => {
            return response.Categories[0] === 1;
        });

        if(trait === 0){
            return 'Answer more Questions';
        } else if (trait < 0) {
            responses = responses.filter((response)=>{
                return response.Value > 0;
            });
        } else {
            responses = responses.filter((response)=>{
                return response.Value < 0;
            });
        }

        let value = responses.map(function(response){
            // console.log('response4: ', responses);
            let id = response.QuestionID;
            //let question = Meteor.questions.findOne({ _id: id }).LeftText;
            let value =  response.Value;
            let info = 'Question ID: ' + id + ' ' + 'Value: ' + value;     
            return info;
        });
        return value;
    },
    ansTF(u) {
        let trait = u.Personality.TF.Value;
        let responses = u.AnsweredQuestions;
        responses = responses.filter((response) => {
            return response.Categories[0] === 2;
        });

        if(trait === 0){
            return 'Answer more Questions';
        } else if (trait < 0) {
            responses = responses.filter((response)=>{
                return response.Value > 0;
            });
        } else {
            responses = responses.filter((response)=>{
                return response.Value < 0;
            });
        }

        let value = responses.map(function(response){
            // console.log('response4: ', responses);
            let id = response.QuestionID;
            //let question = Meteor.questions.findOne({ _id: id }).LeftText;
            let value =  response.Value;
            let info = 'Question ID: ' + id + ' ' + 'Value: ' + value;     
            return info;
        });
        return value;
    },
    ansJP(u) {
        let trait = u.Personality.JP.Value;
        let responses = u.AnsweredQuestions;
        responses = responses.filter((response) => {
            return response.Categories[0] === 3;
        });

        if(trait === 0){
            return 'Answer more Questions';
        } else if (trait < 0) {
            responses = responses.filter((response)=>{
                return response.Value > 0;
            });
        } else {
            responses = responses.filter((response)=>{
                return response.Value < 0;
            });
        }

        let value = responses.map(function(response){
            // console.log('response4: ', responses);
            let id = response.QuestionID;
            //let question = Meteor.questions.findOne({ _id: id }).LeftText;
            let value =  response.Value;
            let info = 'Question ID: ' + id + ' ' + 'Value: ' + value;     
            return info;
        });
        return value;
    },
   
    
    answers() {
        // const u = User.findOne({_id:Template.instance().userId});
        const users = Meteor.users.find({}).fetch();
        let answers = [];
        if (users.length) {
            users.forEach(function(user) {
                answers = answers.concat(user.MyProfile.UserType.AnsweredQuestions);
            });
        }
        
        answers = answers.filter((answer) => {
            return answer.Value >= -5 && answer.Value <= 5
        })
        this.answers = answers;
        return answers;
    },
    getRightValue(value) {
        return 50 + value;
    },
    getLeftValue(value) {
        return 50 - value;
    },
    getQuestion(questionID) {
        return Question.findOne({ _id: questionID });
    },
    getLeftText(questionID) {
        return Question.findOne({ _id: questionID }).LeftText;
    },
    getRightText(questionID) {
        return Question.findOne({ _id: questionID }).RightText;
    }
});



