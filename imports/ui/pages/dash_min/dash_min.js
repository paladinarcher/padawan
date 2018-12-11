import { Qnaire } from '../qnaire/qnaire.js';
import './dash_min.html';

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
		return [1, 2, 3, 4];
	},
    getAssessment() { //console.log(this.index, arguments, this);
		return `<div>Hello assessment</div>`;
        //return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    },

});
