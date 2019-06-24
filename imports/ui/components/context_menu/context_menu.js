import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';

var minQuestionsAnswered = 72;

function totalQuestions() {
    alert('entering totalQuestions');
    let u = User.findOne({_id: Meteor.userId()});
    let aqTotal = u.MyProfile.UserType.AnsweredQuestions.length;
    alert('aqTotal: ', aqTotal);
    console.log('aqTotal: ', aqTotal);
    //console.log("myUserID", u._id);
    console.log('user: ', u);
    let total = u.MyProfile.UserType.getTotalQuestions();
    console.log("preTotalQuestions", total);
    Meteor.call('question.countQuestions', u._id, (error, result) => {
        if (error) {
            console.log("EEERRR0r: ", error);
        } else {
            //success
            total = u.MyProfile.UserType.getTotalQuestions();
            u.MyProfile.UserType.setTotalQuestions(total);
        }
    });
    alert('totalQuestions: ', total);
    return total;
}

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
        alert('entering mbtiRefineResults');
        let u = User.findOne({_id:Meteor.userId()});
        alert('just before totalQuestions');
        let mbtiTotal = totalQuestions();
        alert('made it passed total: ', mbtiTotal);
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length <= minQuestionsAnswered
            || u.MyProfile.UserType.AnsweredQuestions.length >= mbtiTotal) {
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
