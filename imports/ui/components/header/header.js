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
    }
})
Template.header.events({
    'click a#nav-traitSpectrum'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/questions');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/addQuestions/IE');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-qnaireList'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/qnaireList');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-learnshare'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/learnShareList');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-teams'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/adminTeams');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-goals'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/goals');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-mbtiresults'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/mbtiResults');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-commentreport'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/commentReport');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-traitdesc'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/addTraitDescriptions');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-profile'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/profile');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            console.log(event);
            alert(event.currentTarget.href);
            window.open(event.currentTarget.href);
        } else {
            FlowRouter.go('/dashboard');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-assessments'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/dashboard');
        }
        $(".navbar-collapse").collapse('hide');
    },
    'click a#nav-adminreports'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/tools/reports');
        }
    },
    'click a#nav-tools'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/tools');
        }
    },
    'click a#nav-usermgmt'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/tools/userManagement');
        }
    }
});
