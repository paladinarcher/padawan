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
    }
})
Template.header.events({
    'click a#nav-answerquestions'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/');
    },
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
    'click a#nav-goals'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/goals');
    },
    'click a#nav-traitdesc'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/addTraitDescriptions');
    },
    'click a#nav-profile'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/profile');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/dashboard');
    }
});
