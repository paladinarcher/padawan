import './header.html';
import { User } from '/imports/api/users/users.js';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';
import '../../components/notification_list/notification_list.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.header.onCreated(function() {
    this.autorun( () => {
        this.subscription = this.subscribe('userData', this.teamName, {
            onStop: function () {
                console.log("User header subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User header subscription ready! ", arguments, this);
            }
        });
    })
})
Template.header.helpers({
    userName() {
        let u = User.findOne( {_id:Meteor.userId()} );
        if (u) {
            return u.MyProfile.fullName('');
        } else {
            return "";
        }
    },
	
    first_name() {
        let u = User.findOne( {_id:Meteor.userId()} );
        if (u) {
            return u.MyProfile.firstName;
        } else {
            return "";
        }
    },
    paTeam() {
        // Roles.addUsersToRoles(Meteor.userId(), 'P&A team', Roles.GLOBAL_GROUP);
        if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP) || Roles.userIsInRole(Meteor.userId(), ['member'], 'Paladin & Archer')) {
            return true;
        }
        else {
            return false;
        }
    }
})
Template.header.events({
    'click a#nav-answerquestions'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/questions');
    },
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/addQuestions/IE');
    },
    'click a#nav-learnshare'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/learnShareList');
    },
    'click a#nav-teams'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/adminTeams');
    },
    'click a#nav-goals'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/goals');
    },
    'click a#nav-mbtiresults'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/mbtiResults');
    },
    'click a#nav-traitdesc'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/addTraitDescriptions');
    },
    'click a#nav-profile'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/profile');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/dashboard');
    },
    'click a#nav-adminreports'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools/reports');
        console.log('hello');
    },
    'click a#nav-tools'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools');
        console.log('hllo');
    }
});
