import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
//import { Qnaire } from '../qnaire/qnaire.js';
import './dash_min.html';

//const Qnaires = new Mongo.Collection('qnaire');

Tracker.autorun(() => {
	handle = Meteor.subscribe('qnaire');
    handle2 = Meteor.subscribe('qnaireData');
});

Template.dash_min.events({
    'click button.questions'(event, instance) {
        FlowRouter.go('/questions');
    },
    'click button.learnshare'(event, instance) {
        FlowRouter.go('/learnShareList');
    },
    'click button.user-segments'(event, instance) {
        FlowRouter.go('/userSegments');
    }
});


Template.dash_min.helpers({
	assessments() {
		questionaires = Qnaire.find().fetch();
		return questionaires;
	},

});

Template.displayAssessment.helpers({
    getAssessment(index) { //console.log(this.index, arguments, this);
		qnaires = Qnaire.find().fetch();
		return qnaires[index].title;
		//return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    },
	qnaireTotal(index) {
		qnaires = Qnaire.find().fetch();
		return qnaires[index].questions.length;
	},
	qnaireAnswered(index) {
		qnaires = Qnaire.find().fetch();
		//Session.set('tqAnswers', -2);
		//Session.get('tqAnswers');
		return Session.get('tqAnswers' + index);
	},
	qnaireAnsweredUpdate(index) {
		Meteor.call('user.totalQnaireAnswers', qnaires[index]._id, (error, result) => {
			if (error) {
				console.log("EEEEEERRRORRRRR: ", error);
			} else {
				console.log('delete this');
				Session.set('tqAnswers' + index, result);
			}
		});
	},
	noQnaireAnswers(index) {
		qnaires = Qnaire.find().fetch();
        let userId = Meteor.userId();
		noQABool = true;
        if (userId) {
            let u = Meteor.users.findOne({_id:userId});

			u.MyProfile.UserType.AnsweredQnaireQuestions.forEach(function(element, index2) {
				console.log("element.QnaireId qnaires[index]._id: ", element.QnaireId, qnaires[index]._id);
				console.log("middle");
				if (element.QnaireId == qnaires[index]._id) {
					console.log("element.QnaireAnswers.length: ", element.QnaireAnswers);
					if (element.QnaireAnswers.length > 0) {
						console.log("returning false");
						noQABool = false;
						return;
					}
				}
			});
		}
		return noQABool;

	},
	allQuestionsAnswered(index) {
		qnaires = Qnaire.find().fetch();
        let userId = Meteor.userId();
		questionsAnswered = false;
		totalQnaires = qnaires[index].questions.length;
        if (userId) {
            let u = Meteor.users.findOne({_id:userId});

			u.MyProfile.UserType.AnsweredQnaireQuestions.forEach(function(element, index2) {
				console.log("element.QnaireId qnaires[index]._id: ", element.QnaireId, qnaires[index]._id);
				console.log("middle");
				if (element.QnaireId == qnaires[index]._id) {
					console.log("element.QnaireAnswers.length: ", element.QnaireAnswers);
					if (element.QnaireAnswers.length == totalQnaires) {
						console.log("returning false");
						questionsAnswered = true;
						return;
					}
				}
			});
		}
		return questionsAnswered;
	},
});

Template.displayAssessment.events({
    'click button.start'(event, instance) {
		qnaires = Qnaire.find().fetch();
        FlowRouter.go("/qnaire/" + qnaires[event.target.value]._id);
    },
	'click button.continue'(event, instance) {
		qnaires = Qnaire.find().fetch();
        let userId = Meteor.userId();
		let previouslyAnswered = 0;
        if (userId) {
            let u = Meteor.users.findOne({_id:userId});

			u.MyProfile.UserType.AnsweredQnaireQuestions.forEach(function(element) {
				if (element.QnaireId == qnaires[event.target.value]._id) {
					previouslyAnswered = element.QnaireAnswers.length;
					return;
				}
			});
		}
        FlowRouter.go("/qnaire/" + qnaires[event.target.value]._id + "?p=" + (previouslyAnswered + 1));
	},
    'click button.restart'(event, instance) {
		const correctPassword = "password";
		qnaires = Qnaire.find().fetch();
		let restartPassword = prompt("Please enter the password to reset the questionaire", "password");
		if (restartPassword == correctPassword) {
			alert("The password was correct");
        	Meteor.call('user.removeQnaire', qnaires[event.target.value]._id,  (error) => {
				if (error) {
					console.log("EEEEEERRRORRRRR: ", error);
					alert("Error deleting assessment");
				} else {
					alert("Assessment Deleted");
				}
			});

		}
		else {
			alert("The password was incorrect");
		}
    },
});



