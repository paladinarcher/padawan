import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js'
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

// takes a qrespondent and returns true if there is a duplicate qqLabel
function hasDuplicateQQLabels(qrespondent) {
	// console.log(qrespondent);
	if (qrespondent.responses != undefined) {
		let qqlabelArr = [];
		qrespondent.responses.forEach(function (element, index) {
			qqlabelArr.push(element.qqLabel);
		});
		let qqSet = (new Set(qqlabelArr)).size;
		let hasDuplicate = qqSet !== qqlabelArr.length;
		return hasDuplicate;
	} else {
		return false;
	}
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
		// this.subscription2 = this.subscribe('qnaireData', this.qnrid(), {
        //     onStop: function () {
        //         console.log("QnaireData subscription stopped! ", arguments, this);
        //     },
        //     onReady: function () {
		// 		console.log("QnaireData subscription ready! ", arguments, this);
		// 	}
		// });
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
	dataError(index) {
		qnaires = Qnaire.find().fetch();
		let uid = Meteor.userId();
		let u = Meteor.users.findOne({_id:uid});
		questionsAnswered = false;
		let qresp = "no qrespondent";
		if (qnaires[index] != undefined) {
			qresp = findQResp(qnaires[index]._id);
		}
		if (uid && qresp != "no qrespondent" && qresp.responses != undefined) {
			// Check for data errors
			let returnVal = false;
			// 1. check for duplicate labels
			if (hasDuplicateQQLabels(qresp)) {
				console.log("QRespondentID " + qresp._id + " has a duplicate qqLabel");
				returnVal = true;
			}
			// 2. check if the number of answered is greater then the total possible
			totalQnaires = qnaires[index].questions.length;	
			if (qresp.responses.length > totalQnaires) {
				console.log("QRespondentID " + qresp._id + " has too many answers");
				returnVal = true;
			}
			return returnVal;
		} else {
			return false;
		}

	},
	qnaireMinimum(index) {
		qnaires = Qnaire.find().fetch();
		rtn = 1;
		if (qnaires[index].minimum >= 0) {
			rtn = qnaires[index].minimum
		}
		return rtn;
	},
	allQuestionsAnswered(index) {
		qnaires = Qnaire.find().fetch();
		// console.log("qnaires: ", qnaires);
        let userId = Meteor.userId();
		questionsAnswered = false;
		totalQnaires = qnaires[index].questions.length;
		let qresp = findQResp(qnaires[index]._id);
		// console.log("qresp", qresp);
        if (userId && qresp != "no qrespondent") {
			if (qresp.responses.length == totalQnaires) {
				questionsAnswered = true;
			}
		}
		return questionsAnswered;
	},
	isDevelopment() {
		let dev = false;
		if (Meteor.isDevelopment) {
			dev = true;
		}
		return dev;
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
		let qresp = findQResp(qnaires[event.target.value]._id);
		// alert("qresp._id");
		// alert(qresp._id);
		if (qresp._id == "no qrespondent") {
			Session.set("rid"+qnaires[event.target.value]._id, "no qrespondent");
		} else {
			Session.set("rid"+qnaires[event.target.value]._id, qresp._id);
		}
		
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
		qnaires = Qnaire.find().fetch();
		let userId = Meteor.userId();
		// let u = Meteor.users.findOne({_id:userId}); // doesn't seem to have profile methods
		let u = User.findOne({_id: userId});
		let qresp = findQResp(qnaires[event.target.value]._id);
		if (userId && qresp != "no qrespondent") {
			console.log("deleting qnaire-data");
			// Remove qnaire-data
			qresp.deleteQRespondent();
			// remove QRespondent _id from user QnaireResponses array
			u.MyProfile.removeQnaireResponse(qresp._id);
		}
    },
    'click button.currentRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
    'click button.finalRslt'(event, instance) {
		FlowRouter.go('/qnaireResults/' + qnaires[event.target.value]._id);
	},
});



