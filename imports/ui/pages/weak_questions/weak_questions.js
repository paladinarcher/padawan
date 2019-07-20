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

    if (Roles.subscription.ready()) {
        if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
            FlowRouter.redirect('/notfound');
        }
    }
    this.subscribe('userList');
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

    this.autorun( () => {
        
    });
});


Template.weak_questions.helpers({
    getSummary() {
        let users = Meteor.users.find({}).fetch();
        users = users.filter((user) => {
            return user.MyProfile.UserType.AnsweredQuestions.length > 0;
        })
        return `Questions answered by ${users.length} users `
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
        console.log('value: ', answers);
        
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

Template.weak_questions.events({
    'click span.create-report'(event, instance) {
        let report = 'data:text/csv;charset=utf-8,\r\n question id, Right Text, Right Percentage, Left Text, Left Percentage \r\n';

        this.answers.forEach(function(answer) {
            let question = Question.findOne({_id: answer.QuestionID});
            // Make sure question object exists and that it is within %50-%55 either way
            if (question && answer.Value >= -5 && answer.Value <= 5) {
                // Create a line with the values of the question's and the answer's values
                let reportLine = `${answer.QuestionID}, ${question.RightText}, ${50 + answer.Value}, ${question.LeftText}, ${50 - answer.Value}\r\n`;
                report += reportLine;
            }
        });

        var encodedUri = encodeURI(report);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // Fire the download action.
    },
});

