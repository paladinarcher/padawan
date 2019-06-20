import './header.html';
import { User } from '/imports/api/users/users.js';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';
import '../../components/notification_list/notification_list.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.header.onCreated(function() {
    Session.set('summaryClicked', false);
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
Template.header.onRendered(function(){
    $("#nav-traitSpectrum").tooltip();
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
    },
    summaryClicked() {
        if ([false, undefined].includes(Session.get('summaryClicked'))) {
            return false;
        } else {
            return true;
        }
    }
})
Template.header.events({
    'click a#nav-traitSpectrum'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/questions');
    },
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/addQuestions/IE');
    },
    'click a#nav-qnaireList'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/qnaireList');
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
    'click a#nav-commentreport'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/commentReport');
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
        let u = User.findOne( {_id:Meteor.userId()} );
        let uid = Meteor.userId();
        if (uid == undefined) {
            FlowRouter.go('/char_sheet');
        } else {
            FlowRouter.go('/char_sheet/' + uid);
        }
    },
    'click a#nav-assessments'(event, instance) {
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
    },
    'click a#nav-usermgmt'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools/userManagement');
        console.log('hello user management page');
    },
    'click a#nav-contextmenu'(event, instance) {
        event.preventDefault();
        if (Session.get('summaryClicked') == true) {
            Session.set('summaryClicked', false);
        } else {
            Session.set('summaryClicked', true);
        }
        let menu = $('#context-menu-div');
        let hideValues = $('.hamburgerHide');
        if (menu.css('display') == 'block') {
            menu.css('display', 'none');
            hideValues.css('display', 'block');
        } else {
            menu.css('display', 'block');
            hideValues.css('display', 'none');
        }
    },
    'click a#nav-tsq'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/technicalSkillsQuestionaire/results');
        }
    }
});
