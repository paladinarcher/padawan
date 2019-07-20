import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { User,Profile } from "/imports/api/users/users.js";
import './dash_min.html';

//const Qnaires = new Mongo.Collection('qnaire');

function findQResp (thisQnrid) {
	let uid = Meteor.userId();
    let u = Meteor.users.findOne({_id:uid});
	let responses = u.MyProfile.QnaireResponses;
	let returnQresp = "no qrespondent";
	let tempQresp = "-1";
	if (responses != undefined && responses.constructor === Array) {
		responses.forEach(function (element, index) {
			tempQresp = QRespondent.findOne({_id: responses[index]});
			// console.log("tqr: ", tempQresp);
			// console.log("thisQnrid: ", thisQnrid);
			if (tempQresp != undefined && tempQresp.qnrid == thisQnrid) {
				returnQresp = tempQresp;
			}
		});
	}
	// console.log("returnQresp: ", returnQresp);
	return returnQresp;
}

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
        this.subscription3 = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
	});
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
		//console.log("noQABool: ", noQABool);
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
	pageIsLocalhost() {
		let isLocal = false;
		if (Meteor.absoluteUrl() == "http://localhost/") {
			isLocal = true;
		}
		return isLocal;
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
		let qnaires = Qnaire.find().fetch();
		let thisQnaire = qnaires[event.target.value];
		//console.log('thisQnaire ', thisQnaire);
		// mbti qnaire starts with 8 personality questions that should be skipped
		if (thisQnaire._id === '5c9544d9baef97574') {
			let mbtiLabels = ['_IE', '_NS', '_TF', '_JP', '_IE_count', '_NS_count', '_TF_count', '_JP_count'];
			mbtiLabels.forEach((mbtiLabel) => {
				let index = thisQnaire.questions.map((e) => { return e.label; }).indexOf(mbtiLabel);
				if (index > -1) {
					thisQnaire.questions.splice(index, 1);
				}
			})
			console.log('thisQnaire.questions: ', thisQnaire.questions);
		}
        let userId = Meteor.userId();
		let previouslyAnswered = 0;
		let qresp = findQResp(thisQnaire._id);
		Session.set("rid"+thisQnaire._id, qresp._id);
        if (userId && qresp != "no qrespondent") {
			// check each qnaire question to find the first question that hasn't been answered
			thisQnaire.questions.some(function(value, index) {
				console.log('qresp.responses: ', qresp.responses);
				qrespResponse = qresp.responses.find((response) => {
					return response.qqLabel == value.label;
				});
				// unanswered qdata
				if (qrespResponse == undefined) {
					previouslyAnswered = index;
					return true; // qdata not answered; exit loop
				// answered qdata
				} else {
					return false; // qdata was previously answered; keep looping
				}
			});
			console.log("previouslyAnswered: ", previouslyAnswered);
		}
		let perPage = thisQnaire.qqPerPage;
        FlowRouter.go("/qnaire/" + thisQnaire._id + "?p=" + (Math.floor(previouslyAnswered / perPage) + 1));
	},
    'click button.restart'(event, instance) {
		// QRespondent deleteResponse(qqlbl)
        //let u = Meteor.users.findOne({_id:userId});
		//Meteor.users.update({_id: userid}, {$pull: {u.MyProfile.QnaireResponses: }});
		//alert(Meteor.absoluteUrl());
		if (confirm('Are you sure you want to restart the qnaire? Restart only shows up when the url is localhost')) {
			alert("0");
			qnaires = Qnaire.find().fetch();
			let userId = Meteor.userId();
		    let u = Meteor.users.findOne({_id:userId});
			alert("0.9");
			let qresp = findQResp(qnaires[event.target.value]._id);
			alert("1");
			console.log(u);
			//u.removeQnaireResponse("jmZqcP6haseDoaM5K");
			u.MyProfile.addQnaireResponse("test responce id");
			alert("1.11");
			alert(qresp._id);
			// Remove user's QResponse id

			//let userid = Meteor.userId();
			//let user = User.findOne({_id: userid});
			//user.MyProfile.addQnaireResponse("testing Responce");

			//alert("1.2");

			//u.MyProfile.removeQnaireResponse(qresp._id);
			alert("2");
			// Remove qnaire's qnair_data
			qresp.deleteQRespondent();
			alert("3");
		}


//		const correctPassword = "password";
//		qnaires = Qnaire.find().fetch();
//		let restartPassword = prompt("Please enter the password to reset the questionaire", "password");
//		if (restartPassword == correctPassword) {
//			alert("The password was correct");
//        	Meteor.call('user.removeQnaire', qnaires[event.target.value]._id,  (error) => {
//				if (error) {
//					console.log("EEEEEERRRORRRRR: ", error);
//					alert("Error deleting assessment");
//				} else {
//					alert("Assessment Deleted");
//				}
//			});
//
//		}
//		else {
//			alert("The password was incorrect");
//		}
    },
    'click button.currentRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
    'click button.finalRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
});



