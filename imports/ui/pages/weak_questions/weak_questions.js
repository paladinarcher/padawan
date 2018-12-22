import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './weak_questions.html';

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


Template.weak_questions.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else {
        this.userId = Meteor.userId();
    }

    this.autorun( () => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        this.subscribe('questions.bycategory', 0, {
            onStop: function () {
                console.log("QQ Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("QQ Subscription ready! ", arguments, this);
            },
            sort: {createdAt: -1}
        });

        this.subscribe('questions.bycategory', 1, {
            onStop: function () {
                console.log("QQ Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("QQ Subscription ready! ", arguments, this);
            },
            sort: {createdAt: -1}
        });

        this.subscribe('questions.bycategory', 2, {
            onStop: function () {
                console.log("QQ Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("QQ Subscription ready! ", arguments, this);
            },
            sort: {createdAt: -1}
        });

        this.subscribe('questions.bycategory', 3, {
            onStop: function () {
                console.log("QQ Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("QQ Subscription ready! ", arguments, this);
            },
            sort: {createdAt: -1}
        });
    });
});


Template.weak_questions.helpers({
    getSummary() {
        const users = User.find({});
        return `Questions answered by ${users.count()} users `
    },
    getReport() {
        // const u = User.findOne({_id:Template.instance().userId});
        const users = User.find({});
        if (users.count()) {
            let answers = [];
            users.forEach(function(user) {
                answers = answers.concat(user.MyProfile.UserType.AnsweredQuestions);
            });

            this.answersLength = answers.length;

            if (answers.length > 0) {

                // Report header line
                let report = 'data:text/csv;charset=utf-8,\r\n question id, Right Text, Right Percentage, Left Text, Left Percentage \r\n';
        
                // Loop through the answers
                answers.forEach(function(answer) {
                    let question = answer.getQuestion();
                    // Make sure question object exists and that it is within %50-%55 either way
                    if (question && answer.Value >= -5 && answer.Value <= 5) {
                        // Create a line with the values of the question's and the answer's values
                        let reportLine = `${answer.QuestionID}, ${question.RightText}, ${50 + answer.Value}, ${question.LeftText}, ${50 - answer.Value}\r\n`;
                        report += reportLine;

                        // -------------------------- CREATE HTML REPORT ------------------------ //
                        let row = htmlToElement(`<tr><th>${answer.QuestionID}</th><td>${question.RightText}</td><td>${50 + answer.Value}</td><td>${question.LeftText}</td><td>${50 - answer.Value}</td></tr>`);
                        let reportContainer = document.getElementById('report-entries');
                        reportContainer.appendChild(row);
                    }
                });
                // Save the report in an instance variable
                this.report = report;
                return '';
            }
        }
        this.report = '';
        return '';
    }
});

Template.weak_questions.events({
    'click span.create-report'(event, instance) {

        var encodedUri = encodeURI(this.report);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // Fire the download action.
    },
});

