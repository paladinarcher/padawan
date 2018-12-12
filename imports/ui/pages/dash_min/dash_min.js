import { Qnaire } from '/imports/api/qnaire/qnaire.js';
//import { Qnaire } from '../qnaire/qnaire.js';
import './dash_min.html';

//const Qnaires = new Mongo.Collection('qnaire');

Tracker.autorun(() => {
	alert("hello autorun");
	handle = Meteor.subscribe('qnaire');
	alert(handle);
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
		//return Qnaire.find().count();
		return [1, 2, 3];
	},

});

Template.displayAssessment.helpers({
    getAssessment() { //console.log(this.index, arguments, this);
		title = Qnaire.find().fetch();
		console.log("dddddddddddddddddddddddd", title);
		return title;
		//return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    },
});

