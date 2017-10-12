import './header.html';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.header.events({
    'click a#seh'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/addQuestions/IE');
    },
    ''(event, instance) {
    }
});