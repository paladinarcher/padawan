import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { mbtiGraph } from '../../components/mbtiGraph/mbtiGraph.js';
import { behavior_pattern_area } from '../../components/behavior_pattern_area/behavior_pattern_area.js';
import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { ReactiveVar } from 'meteor/reactive-var';

import { mbtiBarGraph } from "./mbtiBarGraph.js";


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


Template.mbti_char_report.onRendered(function () {
    // Helper code for the mbtiBarGraph
    let currentUser = User.findOne({ _id: Template.instance().userId});
    // console.log('currentUser: ', currentUser);
    
    let iColor = '#ABA6BF';
    let eColor = '#595775';
    let nColor = '#583E2E';
    let sColor = '#BF988F';
    let tColor = '#192E5B';
    let fColor = '#1D65A6';
    let jColor = '#00743F';
    let pColor = '#F2A104';

    let sortGraph = {
        ie: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        ns: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        tf: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        },
        jp: {
            largeLetter: 'todo',
            largePercent: 'todo',
            largeColor: 'todo',
            smallLetter: 'todo',
            smallPercent: 'todo',
            smallColor: 'todo',
            graphOrder: 'todo'
        }
    }
    console.log('sortGraph', sortGraph);

    // IE letters, colors, and percentages
    sortGraph.ie.largeLetter = Template.mbti_char_report.__helpers.get("letterByCategory").call('placholder', 0, currentUser);
    if (sortGraph.ie.largeLetter == '?') {
        sortGraph.ie.largeLetter = 'I';
        sortGraph.ie.smallLetter = 'E';
        sortGraph.ie.largeColor = iColor;
        sortGraph.ie.smallColor = eColor;
    } else if (sortGraph.ie.largeLetter == 'I') {
        sortGraph.ie.smallLetter = 'E';
        sortGraph.ie.largeColor = iColor;
        sortGraph.ie.smallColor = eColor;
    } else if (sortGraph.ie.largeLetter == 'E') {
        sortGraph.ie.smallLetter = 'I';
        sortGraph.ie.largeColor = eColor;
        sortGraph.ie.smallColor = iColor;
    }
    sortGraph.ie.largePercent = Template.mbti_char_report.__helpers.get("results").call('placholder', 0, currentUser);
    if (sortGraph.ie.largePercent == undefined) {
        sortGraph.ie.largePercent = 50
        sortGraph.ie.smallPercent = 50
    } else {
        sortGraph.ie.smallPercent = 100 - sortGraph.ie.largePercent;
    }

    // NS letters, colors, and percentages
    sortGraph.ns.largeLetter = Template.mbti_char_report.__helpers.get("letterByCategory").call('placholder', 1, currentUser);
    if (sortGraph.ns.largeLetter == '?') {
        sortGraph.ns.largeLetter = 'N';
        sortGraph.ns.smallLetter = 'S';
        sortGraph.ns.largeColor = nColor;
        sortGraph.ns.smallColor = sColor;
    } else if (sortGraph.ns.largeLetter == 'N') {
        sortGraph.ns.smallLetter = 'S';
        sortGraph.ns.largeColor = nColor;
        sortGraph.ns.smallColor = sColor;
    } else if (sortGraph.ns.largeLetter == 'S') {
        sortGraph.ns.smallLetter = 'N';
        sortGraph.ns.largeColor = sColor;
        sortGraph.ns.smallColor = nColor;
    }
    sortGraph.ns.largePercent = Template.mbti_char_report.__helpers.get("results").call('placholder', 1, currentUser);
    if (sortGraph.ns.largePercent == undefined) {
        sortGraph.ns.largePercent = 50
        sortGraph.ns.smallPercent = 50
    } else {
        sortGraph.ns.smallPercent = 100 - sortGraph.ns.largePercent;
    }

    // TF letters, colors, and percentages
    sortGraph.tf.largeLetter = Template.mbti_char_report.__helpers.get("letterByCategory").call('placholder', 2, currentUser);
    if (sortGraph.tf.largeLetter == '?') {
        sortGraph.tf.largeLetter = 'T';
        sortGraph.tf.smallLetter = 'F';
        sortGraph.tf.largeColor = tColor;
        sortGraph.tf.smallColor = fColor;
    } else if (sortGraph.tf.largeLetter == 'T') {
        sortGraph.tf.smallLetter = 'F';
        sortGraph.tf.largeColor = tColor;
        sortGraph.tf.smallColor = fColor;
    } else if (sortGraph.tf.largeLetter == 'F') {
        sortGraph.tf.smallLetter = 'T';
        sortGraph.tf.largeColor = fColor;
        sortGraph.tf.smallColor = tColor;
    }
    sortGraph.tf.largePercent = Template.mbti_char_report.__helpers.get("results").call('placholder', 2, currentUser);
    if (sortGraph.tf.largePercent == undefined) {
        sortGraph.tf.largePercent = 50
        sortGraph.tf.smallPercent = 50
    } else {
        sortGraph.tf.smallPercent = 100 - sortGraph.tf.largePercent;
    }

    // JP letters, colors, and percentages
    sortGraph.jp.largeLetter = Template.mbti_char_report.__helpers.get("letterByCategory").call('placholder', 3, currentUser);
    if (sortGraph.jp.largeLetter == '?') {
        sortGraph.jp.largeLetter = 'J';
        sortGraph.jp.smallLetter = 'P';
        sortGraph.jp.largeColor = jColor;
        sortGraph.jp.smallColor = pColor;
    } else if (sortGraph.jp.largeLetter == 'J') {
        sortGraph.jp.smallLetter = 'P';
        sortGraph.jp.largeColor = jColor;
        sortGraph.jp.smallColor = pColor;
    } else if (sortGraph.jp.largeLetter == 'P') {
        sortGraph.jp.smallLetter = 'J';
        sortGraph.jp.largeColor = pColor;
        sortGraph.jp.smallColor = jColor;
    }
    sortGraph.jp.largePercent = Template.mbti_char_report.__helpers.get("results").call('placholder', 3, currentUser);
    if (sortGraph.jp.largePercent == undefined) {
        sortGraph.jp.largePercent = 50
        sortGraph.jp.smallPercent = 50
    } else {
        sortGraph.jp.smallPercent = 100 - sortGraph.jp.largePercent;
    }

    // Sort the sortGraph (bubble sort)
    let mbtiArr =[sortGraph.ie, sortGraph.ns, sortGraph.tf, sortGraph.jp];
    let sorted = false;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < mbtiArr.length; i++) {
            if (mbtiArr[i].largePercent > mbtiArr[i-1].largePercent) {
                let tempLetters = mbtiArr[i];
                mbtiArr[i] = mbtiArr[i-1];
                mbtiArr[i-1] = tempLetters;
                sorted = false;
            }
        }
    }
    // Apply mbtiArr sort to the sortGraph
    console.log('mbtiArr: ', mbtiArr);
    for (let i = 0; i < mbtiArr.length; i++) {
        if (mbtiArr[i].largeLetter == 'I' || mbtiArr[i].largeLetter == 'E') {
            sortGraph.ie.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'N' || mbtiArr[i].largeLetter == 'S') {
            sortGraph.ns.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'T' || mbtiArr[i].largeLetter == 'F') {
            sortGraph.tf.graphOrder = i;
        } else if (mbtiArr[i].largeLetter == 'J' || mbtiArr[i].largeLetter == 'P') {
            sortGraph.jp.graphOrder = i;
        }
    }

    console.log('sortGraph', sortGraph);

    mbtiBarGraph(sortGraph);
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
            let finpct = (fin/tot)*100;
            let minpct = (min/tot)*100;
            let actminpct = minpct - finpct;
            if(actminpct > 0) {
                return actminpct;
            }
            return 0;
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
    // opacityByCategory(category, userObj) {
    //     let randQresp = QRespondent.findOne({});
    //     if (typeof userObj == undefined || typeof randQresp == undefined) return false;
    //     let personality = userObj.MyProfile.UserType.Personality;
    //     console.log('personality: ', personality);
        
    //     //tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
    //     var value = '?';
    //     if (category == 0) {value = personality.IE.presice;}
    //     else if (category == 1) {value = personality.NS.presice;}
    //     else if (category == 2) {value = personality.TF.presice;}
    //     else if (category == 3) {value = personality.JP.presice;}
    //     if (value == '?') {return 0;}
    //     return (Math.abs(value) * 2) / 100;
    // },
    // letterByCategory(category, userObj) {
    //     let randQresp = QRespondent.findOne({});
    //     if (typeof userObj === undefined || typeof randQresp === undefined) return false;
    //     let personality = userObj.MyProfile.UserType.Personality;
    //     console.log('personality2: ', personality.NS);
    //     //let tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
    //     if (category == 0) {return personality.IE.letter;}
    //     else if (category == 1) {return personality.NS.letter;}
    //     else if (category == 2) {return personality.TF.letter;}
    //     else if (category == 3) {return personality.JP.letter;}
    //     return '?';
    // },
    // results(category, userObj) {
    //     let randQresp = QRespondent.findOne({});
    //     if (typeof userObj === undefined || typeof randQresp === undefined) return false;
    //     let personality = userObj.MyProfile.UserType.Personality;
    //     console.log('personality3: ', personality.NS);
    //     //let tsEval = eval(userObj.MyProfile.traitSpectrumQnaire('categoryLetters'));
    //     let returnValue = '%';
    //     if (category == 0) {returnValue += personality.IE.rounded;}
    //     else if (category == 1) {returnValue += personality.NS.rounded;}
    //     else if (category == 2) {returnValue += personality.TF.rounded;}
    //     else if (category == 3) {returnValue += personality.JP.rounded;}
    //     return returnValue;
    // }
    anyQuestionsAnswered() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) return false;
        if (u.MyProfile.UserType.AnsweredQuestions.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    opacityByCategory(category, userObj) {
        if (typeof userObj === "undefined") return false;
        var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
        return (Math.abs(value.Value) * 2) / 100;
    },
    letterByCategory(category, userObj) {
        if (typeof userObj === "undefined") return false;
        var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
        var value = userObj.MyProfile.UserType.Personality[identifier].Value;
        console.log('asdfvalue: ', value);
        console.log('asdfidentifier: ', identifier);
        if (userObj.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered.get()) {
            return (value === 0 ? "?" : (value < 0 ? identifier.slice(0,1) : identifier.slice(1,2)));
        } else {
            return "?";
        }
    },
    results(category, userObj) {
        let identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(
          category
        );

        let identifierValue =
          userObj.MyProfile.UserType.Personality[identifier].Value;

        let percentageValue =
          userObj.MyProfile.UserType.Personality[
            userObj.MyProfile.UserType.Personality.getIdentifierById(category)
          ];
    
        let percentage = Math.round(Math.abs(percentageValue.Value));
    
        if (identifierValue) {
          return 50 + percentage;
        }
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
