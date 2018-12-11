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
		return [1, 2, 3];
	},

});

Template.displayAssessment.helpers({
    getAssessment() { //console.log(this.index, arguments, this);
		return `<tr>
					<th scope="row">42</th>
				  	<td>Mark</td>
				  	<td>Otto</td>
				  	<td>@mdo</td>
				</tr>`;
        //return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    },
});
