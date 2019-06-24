import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';

var minQuestionsAnswered = 72;

Template.context_menu.onCreated(function() {
    if (Session.get('conMenuClick') == undefined) {
        Session.set('conMenuClick', 'overview');
    }
    Meteor.call('question.countQuestions', Meteor.userId(), (error, result) => {
        if (error) {
            console.log("EEERRR0r: ", error);
        } else {
            //success
            Session.set('totalMbtiQuestions', result);
        }
    });
});

Template.context_menu.helpers({
    isSelected(curMenu) {
        if (curMenu == Session.get('conMenuClick')) {
            return 'btn-primary';
        } else {
            return 'btn-light';
        }
    },
    or(a, b) {
        return a || b;
    },
    overviewSelected() {
        if ('overview' == Session.get('conMenuClick')) {
            return true;
        } else {
            return false;
        }
    },
    trtSpcSelected() {
        if ('traitSpectrum' == Session.get('conMenuClick')) {
            return true;
        } else {
            return false;
        }
    },
    tsqSelected() {
        if ('tsq' == Session.get('conMenuClick')) {
            return true;
        } else {
            return false;
        }
    },
    questionsLeft() {
        let u = User.findOne({_id:Meteor.userId()});
        if (!u) {
            return 'an unknown amount of';
        } else {
            return minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length;
        }
    },
    mbtiNonAnswered() {
        let u = User.findOne({_id:Meteor.userId()});
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length !== 0) {
            return false;
        } else {
            return true;
        }
    },
    mbtiAnswerMore() {
        let u = User.findOne({_id:Meteor.userId()});
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length <= 0
            || u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
            return false;
        } else {
            return true;
        }
    },
    mbtiRefineResults() {
        let u = User.findOne({_id:Meteor.userId()});
        let mbtiTotal = Session.get('totalMbtiQuestions');
        console.log('mbtiTotal: ', mbtiTotal);
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length <= minQuestionsAnswered
            || u.MyProfile.UserType.AnsweredQuestions.length >= mbtiTotal) {
            return false;
        } else {
            return true;
        }
    },
    possibleQuestionsLeft() {
        let u = User.findOne({_id:Meteor.userId()});
        let mbtiTotal = Session.get('totalMbtiQuestions');
        if (u) {
            return mbtiTotal - u.MyProfile.UserType.AnsweredQuestions.length;
        }
    },
    mbtiFinished() {
        let u = User.findOne({_id:Meteor.userId()});
        let mbtiTotal = Session.get('totalMbtiQuestions');
        console.log('mbtiTotal: ', mbtiTotal);
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length < mbtiTotal) {
            return false;
        } else {
            return true;
        }
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
    'click .btn.traitSpecButton' (event, instance) {
        event.preventDefault();
        FlowRouter.go('/questions');
    }
});
