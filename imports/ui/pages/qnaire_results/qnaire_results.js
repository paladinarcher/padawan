import { Meteor } from "meteor/meteor";
import { User } from "../../../api/users/users.js";
import "./qnaire_results.html";
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';

function subscribeToUsers(self) {
    self.subscription = self.subscribe('userList', {
        onReady: subOnReady(),
        onStop: subOnStop()
    })
    console.log('subscribed to users DB')
    return false
}

function findQResp (thisQnrid) {
	console.log('in findQResp');
	let uid = Meteor.userId();
	//let u = Meteor.users.findOne({_id:uid});
	let u = User.findOne({_id:uid});
	console.log('findQResp u: ', u);
	let responces = u.MyProfile.QnaireResponses;
	console.log('responces: ', responces);
	let returnQresp = "no qrespondent";
	let tempQresp = "-1";
	if (responces.constructor === Array) {
		responces.forEach(function (element, index) {
			tempQresp = QRespondent.findOne({_id: responces[index]});
			console.log('tempQresp: ', tempQresp);
			if (tempQresp !== undefined) {
				//console.log("tqr: ", tempQresp);
				if (tempQresp.qnrid == thisQnrid) {
					returnQresp = tempQresp;
				}
			}
		});
	}
	console.log('returnQresp: ', returnQresp);
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
  	resultTable(userObj) {
		qnaires = Qnaire.find().fetch();
		let uid = Meteor.userId();
		//let u = Meteor.users.findOne({_id:uid});
		let u = User.findOne({_id:uid});
		console.log("qnaire: ", qnaire);
		console.log("u: ", u);
		questionsAnswered = false;
		let qresp = findQResp(Template.instance().qnrid);
		console.log("qresp: ", qresp);
  	  	let myTable =  "<table class='result'>";
  	  	myTable +=   "<tr class='result'>";
  	  	myTable +=     "<th class='result'>Question Label </th><th class='result'>Answer </th>";
  	  	myTable +=   "</tr>";
  	  	qresp.responses.forEach(function(value, index) {
  	  		myTable += "<tr class='result'>";
  	  	  	myTable +=   "<td class='result'>" + value.qqLabel + "</td>";
  	  	  	myTable +=   "<td class='result'>" + value.qqData + "</td>";
  	  	  	myTable += "</tr>";
  	  	});
  	  	myTable += "</table>";
  	  	return myTable;
	},
	qrespResultTable(userObj) {
		let uid = Meteor.userId();
		//let u = Meteor.users.findOne({_id:uid});
		let u = User.findOne({_id:uid});
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
