import './header.html';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.header.events({
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/addQuestions/IE');
    },
    'click a#nav-learnshare'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/learnShareList');
    },
    'click a#nav-teams'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/adminTeams');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/');
    }
});
