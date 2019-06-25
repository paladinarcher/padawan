// import { context_menu } from './context_menu.html';
import { User } from "../../../api/users/users.js";

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
    },
    userIsAdmin() {
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', '__global_roles__');
        return (isAdmin ? true : false);
    },
    userTeams() {
        let currentUser = User.findOne({ _id: Meteor.userId() });
        let currentUserTeams = currentUser.roles;

        userTeams = [];
        for (let team in currentUserTeams){
            if(team !== "__global_roles__"){
                userTeams.push(team);
            }
        }
        return userTeams;
    }
});

Template.context_menu.events({
    'click .btn.overview' (event, instance) {
        Session.set('conMenuClick', 'overview');
        if (FlowRouter.getRouteName() == 'char-sheet') {
            console.log('Already in char_sheet page');
        } else {
            FlowRouter.go('/char_sheet/' + Meteor.userId());
        }
    },
    'click .btn.traitSpectrum' (event, instance) {
        Session.set('conMenuClick', 'traitSpectrum');
        if (FlowRouter.getRouteName() == 'char-sheet') {
            console.log('Already in char_sheet page');
        } else {
            FlowRouter.go('/char_sheet/' + Meteor.userId());
        }
    },
    'click .btn.tsq' (event, instance) {
        Session.set('conMenuClick', 'tsq');
        if (FlowRouter.getRouteName() == 'char-sheet') {
            console.log('Already in char_sheet page');
        } else {
            FlowRouter.go('/char_sheet/' + Meteor.userId());
        }
    },
    'click .btn.unlockBtn' (event, instance) {
        console.log('unlockBtn clicked');
    }
});
