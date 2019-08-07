import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { mbtiGraph } from '../../components/mbtiGraph/mbtiGraph.js';
import { behavior_pattern_area } from '../../components/behavior_pattern_area/behavior_pattern_area.js';
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { ReactiveVar } from 'meteor/reactive-var';

const TS = new ReactiveVar();
const minQuestionsAnswered = new ReactiveVar(72);

Template.mbti_char_report.onCreated(function () {
    this.autorun(() => {
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
        // Allow admin to see others characters sheets with the url. 
        // Non admins will be redirected to their character sheet.
        if (!Roles.subscription.ready()) {
            console.log('Roles subscription not ready');
        } else if (this.data.userId) {
            this.userId = this.data.userId;
        } else if (isAdmin && FlowRouter.getParam('userId')) {
            this.userId = FlowRouter.getParam('userId');
        } else if (FlowRouter.getParam('userId')) {
            let nonAdminId = FlowRouter.getParam('userId');
            let realId = Meteor.userId();
            if (nonAdminId == realId || isAdmin) {
                this.userId = FlowRouter.getParam('userId');
            } else {
                FlowRouter.go('/char_sheet/' + realId);
            }
        } else {
            this.userId = Meteor.userId();
        }

        this.subscription = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
        this.subscription2 = this.subscribe('userList', this.userId, {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
        this.subscription3 = this.subscribe('segmentList', this.userId, {
            onStop: function () {
                console.log("Segment List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Segment List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
		let handle = Meteor.subscribe('qnaire');
		let handle2 = Meteor.subscribe('qnaireData');
        let handle3 = Meteor.subscribe('userData');
    });
});


Template.mbti_char_report.helpers({
    sheetUserName() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) {
            return 'unknown name';
        } else {
            return u.MyProfile.firstName + ' ' + u.MyProfile.lastName;
        }
    },
    mbtiTotalQuestions() {
        return Session.get('allMbtiQuestions');
    },
    totalQuestions() {
        return Session.get('totalMbtiQuestions');
    },
    questionsAnswered() {
        let u = User.findOne({_id:Template.instance().userId});
        return u.MyProfile.UserType.AnsweredQuestions.length;
    },
    questionsLeft() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) {
            return 'an unknown amount of';
        } else {
            return minQuestionsAnswered.get() - u.MyProfile.UserType.AnsweredQuestions.length;
        }
    },
    finishedPercent() {
        let u = User.findOne({_id:Template.instance().userId});
        let fin = u.MyProfile.UserType.AnsweredQuestions.length;
        let tot = Session.get('totalMbtiQuestions');
        let min = minQuestionsAnswered.get();
        if(u) {
            return (fin/tot)*100;
        }
    },
    unfinishedPercent() {
        let u = User.findOne({_id:Template.instance().userId});
        let fin = u.MyProfile.UserType.AnsweredQuestions.length;
        let tot = Session.get('totalMbtiQuestions');
        let min = minQuestionsAnswered.get();
        if(u) {
            return (min/tot)*100;
        }
    },
    user() {
        return User.findOne({_id:Template.instance().userId});
    },
    shid() {
        return Template.instance().userId;
    },
    isMinMet() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) return false;
        if (u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered.get()) {
            return true;
        } else {
            return false;
        }
    },
    opacityByCategory(category, userObj) {
        let randQresp = QRespondent.findOne({});
        if (typeof userObj == undefined || typeof randQresp == undefined) return false;
        tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        var value = '?';
        if (category == 0) {value = tsEval.IE.presice;}
        else if (category == 1) {value = tsEval.NS.presice;}
        else if (category == 2) {value = tsEval.TF.presice;}
        else if (category == 3) {value = tsEval.JP.presice;}
        if (value == '?') {return 0;}
        return (Math.abs(value) * 2) / 100;
    },
    letterByCategory(category, userObj) {
        let randQresp = QRespondent.findOne({});
        if (typeof userObj === undefined || typeof randQresp === undefined) return false;
        let tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        if (category == 0) {return tsEval.IE.letter;}
        else if (category == 1) {return tsEval.NS.letter;}
        else if (category == 2) {return tsEval.TF.letter;}
        else if (category == 3) {return tsEval.JP.letter;}
        return '?';
    },
    results(category, userObj) {
        let randQresp = QRespondent.findOne({});
        if (typeof userObj === undefined || typeof randQresp === undefined) return false;
        let tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        let returnValue = '%';
        if (category == 0) {returnValue += tsEval.IE.rounded;}
        else if (category == 1) {returnValue += tsEval.NS.rounded;}
        else if (category == 2) {returnValue += tsEval.TF.rounded;}
        else if (category == 3) {returnValue += tsEval.JP.rounded;}
        return returnValue;
    }
});


Template.mbti_char_report.events({
    "click a#results_descriptions"(event, instance) {
        event.preventDefault();
        FlowRouter.go("/resultsDescriptions");
    },
    'click #traitSpecButton'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/questions');
    }
});