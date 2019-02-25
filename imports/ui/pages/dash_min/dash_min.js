import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
//import { Qnaire } from '../qnaire/qnaire.js';
import './dash_min.html';

//const Qnaires = new Mongo.Collection('qnaire');

Template.dash_min.onCreated(function() {
	//alert ("created");
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else if (FlowRouter.getParam('userId')) {
        this.userId = FlowRouter.getParam('userId');
    } else {
        this.userId = Meteor.userId();
    }

	this.autorun(() => {
		handle = Meteor.subscribe('qnaire');
		handle2 = Meteor.subscribe('qnaireData');
		handle3 = Meteor.subscribe('userData');
	});
});

//Template.dash_min.onRendered(function() {
//    let userId = Meteor.userId();
//    let u = Meteor.users.findOne({_id:userId});
//	if (u.MyProfile.UserType.AnsweredQnaireQuestions == undefined) {
//		Meteor.call('user.addAnsweredQnaire', (error) => {
//			if (error) {
//				console.log("Meteor Call ERRORRRRRRR");
//			}
//		});
//	}
//});

// This function returns a QResponse based off of the Qnaire ID and the users QnaireResponses
function findQResp (thisQnrid) {
	let uid = Meteor.userId();
    let u = Meteor.users.findOne({_id:uid});
	let responces = u.MyProfile.QnaireResponses;
	let returnQresp = "no qrespondent";
	let tempQresp = "-1";
	if (responces.constructor === Array) {
		responces.forEach(function (element, index) {
			tempQresp = QRespondent.findOne({_id: responces[index]});
			console.log("tqr: ", tempQresp);
			if (tempQresp.qnrid == thisQnrid) {
				returnQresp = tempQresp;
			}
		});
	}
	return returnQresp;
}

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
        let userId = Meteor.userId();
		let qresp = findQResp(qnaires[index]._id);
		answeredCount = 0;
        if (userId && qresp != "no qrespondent") {
            let u = Meteor.users.findOne({_id:userId});
			answeredCount = qresp.responses.length;
		}
		return answeredCount;
	},
	noQnaireAnswers(index) {
		qnaires = Qnaire.find().fetch();
        let userId = Meteor.userId();
		noQABool = true;
		let qresp = findQResp(qnaires[index]._id);
        if (userId && qresp != "no qrespondent") {
			if (qresp.responses.length > 0) {
				//console.log("returning false");
				noQABool = false;
				return;
			}
		}
		return noQABool;

	},
	qnaireMiniumum(index) {
		qnaires = Qnaire.find().fetch();
		rtn = 1;
		if (qnaires[index].minimum >= 0) {
			rtn = qnaires[index].minimum
		}
		return rtn;
	},
	allQuestionsAnswered(index) {
		qnaires = Qnaire.find().fetch();
        let userId = Meteor.userId();
		questionsAnswered = false;
		totalQnaires = qnaires[index].questions.length;
		let qresp = findQResp(qnaires[index]._id);
        if (userId && qresp != "no qrespondent") {
			if (qresp.responses.length == totalQnaires) {
				questionsAnswered = true;
			}
		}
		return questionsAnswered;
	},
	greaterThanMinimum(index) {
		qnaires = Qnaire.find().fetch();
		min = 1;
		overMinimum = false;
		if (qnaires[index].minimum >= 0) {
			min = qnaires[index].minimum
		}
        let userId = Meteor.userId();
		let qresp = findQResp(qnaires[index]._id);
        if (userId && qresp != "no qrespondent") {
			if (qresp.responses.length >= min) {
				overMinimum = true;
			}
		}
		return overMinimum;
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
		let qresp = findQResp(qnaires[event.target.value]._id);
        if (userId && qresp != "no qrespondent") {
			previouslyAnswered = qresp.responses.length;
		}
        FlowRouter.go("/qnaire/" + qnaires[event.target.value]._id + "?p=" + (previouslyAnswered + 1));
	},
    'click button.restart'(event, instance) {
		// QRespondent deleteResponse(qqlbl)
            	//let u = Meteor.users.findOne({_id:userId});
				//Meteor.users.update({_id: userid}, {$pull: {u.MyProfile.QnaireResponses: }});
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
    'click button.currentRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
    'click button.finalRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
});



