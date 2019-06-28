import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { mbtiGraph } from '../../components/mbtiGraph/mbtiGraph.js';
import { behavior_pattern_area } from '../../components/behavior_pattern_area/behavior_pattern_area.js';
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';

var minQuestionsAnswered = 72;

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
		handle = Meteor.subscribe('qnaire');
		handle2 = Meteor.subscribe('qnaireData');
		handle3 = Meteor.subscribe('userData');
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
            return minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length;
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
        if (u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
            return true;
        } else {
            return false;
        }
    },
    opacityByCategory(category, userObj) {
        // return 0.5;

        // if (typeof userObj === "undefined") return false;
        // console.log('asdfjkl;');
        // var identifier = userObj.MyProfile.UserType.removeQnaireResponse('hi qniare ');
        // var identifier = userObj.MyProfile.UserType.traitSpectrumQnaire('hi qniare ');
        // console.log('hhh');
        let randQresp = QRespondent.findOne({});
        if (typeof userObj == undefined || typeof randQresp == undefined) return false;
        // console.log('tempQresp: ', tempQresp);
        // let retVal = userObj.MyProfile.traitSpectrumQnaire('hi qniare ')(userObj);
        // let retVal = userObj.MyProfile.traitSpectrumQnaire('categoryLetters');
        // console.log('iiihhh'); 
        // console.log(retVal);
        tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        // console.log('tsEval: ', tsEval);
        // eval(retVal);
        // var identifier = userObj.MyProfile.traitSpectrumQnaire('hi qniare ');
        // console.log('identifier: ', identifier);
        // identifier();
        // return 42;
        var value = '?';
        if (category == 0) {value = tsEval[1];}
        else if (category == 1) {value = tsEval[4];}
        else if (category == 2) {value = tsEval[7];}
        else if (category == 3) {value = tsEval[10];}
        // console.log('catValue: ', value);
        // console.log('(Math.abs(value) * 2) / 100', (Math.abs(value) * 2) / 100);
        if (value == '?') {return 0;}
        return (Math.abs(value) * 2) / 100;
        return 0.5;
        return '?';


        // console.log('opacity_value_enter');
        // // if (typeof userObj === "undefined") return false;
        // let randQresp = QRespondent.findOne({});
        // if (typeof userObj === undefined || typeof randQresp === undefined) return false;
        // // var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
        // // console.log('value: ', value);
        // console.log('opacity_value_enter2');
        // tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        // console.log('opacity_value_enter3');
        // var value = '?';
        // if (category == 0) {value = tsEval[1];}
        // else if (category == 1) {value = tsEval[4];}
        // else if (category == 2) {value = tsEval[7];}
        // else if (category == 3) {value = tsEval[10];}
        // console.log('opacity_value: ', value);
        // if (value = '?') {return false;}
        // return (Math.abs(value) * 2) / 100;
    },
    letterByCategory(category, userObj) {
        // if (typeof userObj === "undefined") return false;
        // console.log('asdfjkl;');
        // var identifier = userObj.MyProfile.UserType.removeQnaireResponse('hi qniare ');
        // var identifier = userObj.MyProfile.UserType.traitSpectrumQnaire('hi qniare ');
        // console.log('hhh');
        let randQresp = QRespondent.findOne({});
        if (typeof userObj === undefined || typeof randQresp === undefined) return false;
        // console.log('tempQresp: ', tempQresp);
        // let retVal = userObj.MyProfile.traitSpectrumQnaire('hi qniare ')(userObj);
        // let retVal = userObj.MyProfile.traitSpectrumQnaire('categoryLetters');
        // console.log('iiihhh'); 
        // console.log(retVal);
        tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        // console.log('tsEval: ', tsEval);
        // eval(retVal);
        // var identifier = userObj.MyProfile.traitSpectrumQnaire('hi qniare ');
        // console.log('identifier: ', identifier);
        // identifier();
        // return 42;
        if (category == 0) {return tsEval[0];}
        else if (category == 1) {return tsEval[3];}
        else if (category == 2) {return tsEval[6];}
        else if (category == 3) {return tsEval[9];}
        return '?';

        // if (typeof userObj === "undefined") return false;
        // var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
        // var value = userObj.MyProfile.UserType.Personality[identifier].Value;
        // if (userObj.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
        //     return (value === 0 ? "?" : (value < 0 ? identifier.slice(0, 1) : identifier.slice(1, 2)));
        // } else {
        //     return "?";
        // }
    },
    results(category, userObj) {
        // return '?';
        let randQresp = QRespondent.findOne({});
        if (typeof userObj === undefined || typeof randQresp === undefined) return false;
        tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
        if (category == 0) {return tsEval[2];}
        else if (category == 1) {return tsEval[5];}
        else if (category == 2) {return tsEval[8];}
        else if (category == 3) {return tsEval[11];}
        return '?';

        // let identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(
        //     category
        // );

        // let identifierValue =
        //     userObj.MyProfile.UserType.Personality[identifier].Value;

        // let percentageValue =
        //     userObj.MyProfile.UserType.Personality[
        //     userObj.MyProfile.UserType.Personality.getIdentifierById(category)
        //     ];

        // let percentage = Math.ceil(Math.abs(percentageValue.Value));

        // if (identifierValue) {
        //     return 50 + percentage;
        // }
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