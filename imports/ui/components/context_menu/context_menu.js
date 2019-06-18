// import { context_menu } from './context_menu.html';

Template.context_menu.onCreated(function() {
    if (Session.get('conMenuClick') == undefined) {
        Session.set('conMenuClick', 'overview');
    }
});

Template.context_menu.helpers({
    isSelected(curMenu) {
        if (curMenu == Session.get('conMenuClick')) {
            return 'btn-primary';
        } else {
            return 'btn-light';
        }
    }
});

Template.context_menu.events({
    'click .btn.overview' (event, instance) {
        Session.set('conMenuClick', 'overview');
        FlowRouter.go('/char_sheet/' + Meteor.userId());
    },
    'click .btn.traitSpectrum' (event, instance) {
        Session.set('conMenuClick', 'traitSpectrum');
        FlowRouter.go('/char_sheet/' + Meteor.userId());
    },
    'click .btn.tsq' (event, instance) {
        Session.set('conMenuClick', 'tsq');
        FlowRouter.go('/char_sheet/' + Meteor.userId());
    }
});