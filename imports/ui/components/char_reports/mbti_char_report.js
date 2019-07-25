import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { mbtiGraph } from '../../components/mbtiGraph/mbtiGraph.js';
import { behavior_pattern_area } from '../../components/behavior_pattern_area/behavior_pattern_area.js';
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { ReactiveVar } from 'meteor/reactive-var';

const curUserId = Meteor.userId();
const TS = new ReactiveVar();
const minQuestionsAnswered = new ReactiveVar(72);

Template.mbti_char_report.onCreated(function () {
    this.autorun(() => {
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
        // Allow admin to see others characters sheets with the url. 
        // Non admins will be redirected to their character sheet.
        this.userId = curUserId;
        if (!Roles.subscription.ready()) {
            console.log('Roles subscription not ready');
        } else if (this.data.userId) {
            console.log("this.data.userId exists");
            this.userId = this.data.userId;
        } else if (isAdmin && FlowRouter.getParam('userId')) {
            console.log("I am admin and getParam from flow router is returning", FlowRouter.getParam('userId'));
            this.userId = FlowRouter.getParam('userId');
        } else if (FlowRouter.getParam('userId')) {
            console.log("I am not admin and getParam from flow router is returning", FlowRouter.getParam('userId'))
            let nonAdminId = FlowRouter.getParam('userId');
            let realId = Meteor.userId();
            if (nonAdminId == realId || isAdmin) {
                this.userId = FlowRouter.getParam('userId');
            } else {
                FlowRouter.go('/char_sheet/' + realId);
            }
        }

        console.log("UserID", this.userId);

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

        TS.set(Qnaire.findOne({ title: 'Trait Spectrum' }));
        ///minQuestionsAnswered.set(TS.get()['minimum']);
        console.log("Trait Spectrum", TS.get());
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
    questionsLeft() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) {
            return 'an unknown amount of';
        } else {
            return minQuestionsAnswered.get() - u.MyProfile.UserType.AnsweredQuestions.length;
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
    },
    traitSpecturmId() {
        return TS.get()._id;
    },
    mbtiTotalQuestions() {
        console.log("MBTI TOTAL", Session.get('totalMbtiQuestions'));
        let tot = Session.get('totalMbtiQuestions');
        if (tot > 225) {
            tot = tot/2;
        }
        let totArray = [];
        for(let i=0; i<tot; i++) {
            totArray.push(i);
        }
        return totArray;
    },
    finishedPercent() {
        let u = User.findOne({_id:Template.instance().userId});
        let fin = u.MyProfile.UserType.AnsweredQuestions.length;
        let tot = Session.get('totalMbtiQuestions');
        if(fin === 0) {
            return 0;
        } else {
            return (fin/tot)*100;
        }
    },
    unfinishedPercent() {
        let tot = Session.get('totalMbtiQuestions');
        let need = minQuestionsAnswered.get();
        if(need === 0) {
            return 0;
        } else {
            return (need/tot)*100;
        }
    }
});


Template.mbti_char_report.events({
    "click a#results_descriptions"(event, instance) {
        event.preventDefault();
        FlowRouter.go("/resultsDescriptions");
    }
});