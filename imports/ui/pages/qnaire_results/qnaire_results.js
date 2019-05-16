import { Meteor } from "meteor/meteor";
import { User } from "../../../api/users/users.js";
import "./qnaire_results.html";
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';

function findQResp (thisQnrid) {
	let uid = Meteor.userId();
    let u = Meteor.users.findOne({_id:uid});
	let responces = u.MyProfile.QnaireResponses;
	let returnQresp = "no qrespondent";
	let tempQresp = "-1";
	if (responces.constructor === Array) {
		responces.forEach(function (element, index) {
			tempQresp = QRespondent.findOne({_id: responces[index]});
			//console.log("tqr: ", tempQresp);
			if (tempQresp.qnrid == thisQnrid) {
				returnQresp = tempQresp;
			}
		});
	}
	return returnQresp;
}

Template.qnaire_results.onCreated(function() {
	this.qnrid = FlowRouter.getParam('qnaireId');
	console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", this.qnrid);
  	if (this.data.userId) {
    	this.userId = this.data.userId;
  	} else {
    	this.userId = Meteor.userId();
  	}
	this.autorun(() => {
		handle = Meteor.subscribe('qnaire');
		handle2 = Meteor.subscribe('qnaireData');
		handle3 = Meteor.subscribe('userData');
	});
});

Template.qnaire_results.helpers({
	user() {
  		let user = User.findOne({ _id: Template.instance().userId });
  	  	return user;
  	},
  	getQnaireId() {
  		return Template.instance().qnrid;
  	},
  	getQRespondentId() {
  		return findQResp(Template.instance().qnrid)._id;
	},
	getCompleted() {
		return findQResp(Template.instance().qnrid).completed.toString();
	},
  	qnaireResultTable(userObj) {
		// qnaires = Qnaire.find().fetch();
		qnaire = Qnaire.findOne( {_id: Template.instance().qnrid});
		let uid = Meteor.userId();
		let u = Meteor.users.findOne({_id:uid});
		console.log("qnaire: ", qnaire);
		console.log("u: ", u);
		questionsAnswered = false;
		let qresp = findQResp(Template.instance().qnrid);
		console.log("qresp: ", qresp);
		// table header
  	  	let myTable =  "<table class='result'>";
  	  	myTable += "<tr class='result'>";
  	  	myTable += "<th class='result'>Qnaire Question Label </th><th class='result'>Question Answered </th><th class='result'>Answer </th>";
		myTable += "</tr>";
		// table data
		qnaire.questions.forEach(function(value, index) {
  	  		myTable += "<tr class='result'>";
			myTable += "<td class='result'>" + value.label + "</td>";
			qrespResponse = qresp.responses.find((response) => {
				return response.qqLabel == value.label;
			});
			// unanswered qdata
			if (qrespResponse == undefined) {
				myTable += "<td class='result'>" + "False" + "</td>";
				myTable += "<td class='result'></td>";
			// answered qdata
			} else {
				myTable += "<td class='result'>" + "True" + "</td>";
				myTable += "<td class='result'>" + qrespResponse.qqData + "</td>";
			}
  	  	  	myTable += "</tr>";
  	  	});
  	  	myTable += "</table>";
  	  	return myTable;
	},
	qrespResultTable(userObj) {
		let uid = Meteor.userId();
		let u = Meteor.users.findOne({_id:uid});
		console.log("u: ", u);
		questionsAnswered = false;
		let qresp = findQResp(Template.instance().qnrid);
		console.log("qresp: ", qresp);
		// table header
		let myTable =  "<table class='result'>";
		myTable +=       "<tr class='result'>";
		myTable +=         "<th class='result'>Qresponce Question Label </th><th class='result'>Answer </th>";
		myTable +=       "</tr>";
		//table data
		qresp.responses.forEach(function(value, index) {
			myTable += "<tr class='result'>";
			myTable +=   "<td class='result'>" + value.qqLabel + "</td>";
			myTable +=   "<td class='result'>" + value.qqData + "</td>";
			myTable += "</tr>";
		});
		myTable += "</table>";
		return myTable;
	},

});

Template.qnaire_results.events({
	"click a#results_descriptions"(event, instance) {
  		event.preventDefault();
  	  	FlowRouter.go("/resultsDescriptions");
  	}
});
