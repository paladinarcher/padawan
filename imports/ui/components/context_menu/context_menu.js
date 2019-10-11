// The context menus slows everything down and it isn't being used. I am commenting it out.

// /*
import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { Team,TeamIcon } from '/imports/api/teams/teams.js';
import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';
import TSQ_DATA from '/imports/api/tsq/TSQData';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';

const TSQ = require("/imports/api/tsq/tsq.js");
let user;

let minQuestionsAnswered = new ReactiveVar(72);
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs

async function getAllSkillsFromDB(list) {
    list.set(SkillsData.find().fetch());
    return list;
}

function confidenceClick() {
  if (Session.get('confidenceClick') !== true) {
    Session.set('confidenceClick', true);
  } else {
    Session.set('confidenceClick', false);
  }
}


Template.context_menu.onCreated(function() {
    //session variable for reloading page data
    Template.instance().data.reload.get();


    if (Session.get('conMenuClick') == undefined) {
        Session.set('conMenuClick', 'overview');
    }
    // stores total mbti question count in totalMbtiQuestions
    Meteor.call('question.countQuestions', Meteor.userId(), (error, result) => {
        if (error) {
            console.log("EEERRR0r: ", error);
        } else {
            //success
            Session.set('totalMbtiQuestions', result);
            let segments = result;
            while(segments > 100) {
                segments = Math.round(segments/2);
            }
            Session.set('allMbtiQuestions', new Array(segments));

            Session.set('countQuestionsComplete', true);
            if (Session.get('tsqUserListComplete') == true) {
              confidenceClick();
            }
        }
    });
    this.autorun(async () => {
        let cur = this;
        cur.subscription1 = await cur.subscribe('tsqUserList', cur.userId, {
            onStop: function() {
             // console.log('tsq user List subscription stopped! ', arguments, this);
            },
            onReady: async function() {
                // console.log('tsq user List subscription ready! ', arguments, this);
                let userId = Meteor.userId();
                user = User.findOne({ _id: userId });
                console.log("THE USER IS", user);

                if (user.MyProfile.technicalSkillsData === undefined || !user.MyProfile.technicalSkillsData) {
                    await TSQ.registerUser(user);
                }
        
                cur.tsqSkillSub = cur.subscribe('tsq.allSkills', {
                onReady: () => {
                    // Load in the TSQ Test DATA
                    if (SkillsData.find().fetch().length < 1) {
                    for (skills of TSQ_DATA) {
                        let key = Object.keys(skills);
                        for (k of key) {
                        for (skill of skills[key]) {
                            callWithPromise('tsq.addSkill', skill.name);
                        }
                        }
                    }
                    }
        
                }
                });
        
                cur.keyDataSub = cur.subscribe('tsq.keyData', User.findOne({_id: userId}).MyProfile.technicalSkillsData, {
                    onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: cur}) : null,
                    onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: cur}) : null,
                    onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: cur}) : null,
                });
                getAllSkillsFromDB(allSkillsFromDB);

                Session.set('tsqUserListComplete', true);
                if (Session.get('countQuestionsComplete') == true) {
                    confidenceClick();
                }
            }
        });
        cur.subscription2 = cur.subscribe('teamsData', {
            onStop: function () {
                console.log("Team subscription stopped! ", arguments, cur);
            },
            onReady: function () {
                console.log("Team subscription ready! ", arguments, cur);
            }
        });
    });
});

Template.context_menu.onRendered(function() {
    Session.set('tsqUserListComplete', false);
    Session.set('countQuestionsComplete', false);
});

Template.context_menu.helpers({
    reloadContext() {
      if(typeof Template.instance().data.reload == "undefined") { return false; }
        return false;
    },
    isSelected(curMenu) {
        if (curMenu == Session.get('conMenuClick')) {
            return 'btn-primary';
        } else {
            return 'btn-light';
        }
    },
    userIsAdmin() {
        let isAdmin = false;
        let currentUser = User.findOne({ _id: Meteor.userId() });
        if (typeof currentUser == "undefined") { return isAdmin; }
        let currentUserTeams = currentUser.roles;
        for (let team in currentUserTeams){
            if(Roles.userIsInRole(Meteor.userId(), 'admin', team)) {
                isAdmin = true;
            }
        }
        return isAdmin;
    },
    userTeams() {
        let currentUser = User.findOne({ _id: Meteor.userId() });
        let currentUserTeams = currentUser.roles;
        userTeams = [];
        for (let team in currentUserTeams){
            if(team !== "__global_roles__"){
                if(Roles.userIsInRole(Meteor.userId(), 'admin', team)) {
                    let tId = Team.findOne({ Name: team });
                    if(typeof tId !== "undefined")
                      userTeams.push({team: team, id: tId._id});
                }
            }
        }
        return userTeams;
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
            return minQuestionsAnswered.get() - u.MyProfile.UserType.AnsweredQuestions.length;
        }
    },
    mbtiTotalQuestions() {
        return Session.get('totalMbtiQuestions');
    },
    mbtiQuestionsAnswered() {
        let u = User.findOne({_id:Meteor.userId()});
        return u.MyProfile.UserType.AnsweredQuestions.length;
    },
    mbtiMinimumQuestions() {
        return minQuestionsAnswered.get();
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
            || u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered.get()) {
            return false;
        } else {
            return true;
        }
    },
    mbtiRefineResults() {
        let u = User.findOne({_id:Meteor.userId()});
        let mbtiTotal = Session.get('totalMbtiQuestions');
        console.log('mbtiTotal: ', mbtiTotal);
        if (!u || u.MyProfile.UserType.AnsweredQuestions.length < minQuestionsAnswered.get()
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
    },
    totalCount() {
        return TSQ.totalSkills(KeyData.findOne()).length;
    },
    unfinishedPercent() {
        return TSQ.unansweredPercent(KeyData.findOne());
    },
    finishedPercent() {
        return 100 - Template.context_menu.__helpers.get('unfinishedPercent').call();
    },
    familiarCount() {
        let fs = TSQ.familiarSkills(KeyData.findOne());
        let familiar = fs.length;
        return familiar;
    },
    unfamiliarCount() {
        let un = TSQ.unfamiliarSkills(KeyData.findOne());
        let unfamiliar = un.length;
        return unfamiliar;
    },
    finishedPercentRound() {
        return (100 - Template.context_menu.__helpers.get('unfinishedPercent').call()).toFixed(2);
    },
    tsqNotStarted() {
        let ts = TSQ.totalSkills(KeyData.findOne());
        if(!isUndefined(ts) && ts.length > 0 ) {
            return false;
        } else {
            return true;
        }
    },
    continueTsq() {
        // Template.instance().data.reload.get();
        if (Template.context_menu.__helpers.get('tsqNotStarted').call()) {
            return false;
        } else {
            let myPercent = Template.context_menu.__helpers.get('finishedPercent').call();
            if(myPercent > 0 && myPercent < 100) {
                return true;
            } else {
                return false;
            }
        }
    },
    finishedTsq() {
        if (Template.context_menu.__helpers.get('tsqNotStarted').call()) {
            return false;
        } else {
            let myPercent = Template.context_menu.__helpers.get('finishedPercent').call();
            console.log('myPercent: ', myPercent);
            if(myPercent == 100) {
                return true;
            } else {
                return false;
            }
        }
    }

});

Template.context_menu.events({
    // 'click .btn' (event, instance) {
    //     Template.instance().data.reload.get();
    //     let userId = Meteor.userId();
    //     user = User.findOne({ _id: userId });
    //     checkForKeyAndGetData(user);
    // },
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
    },
    'click .btn.tsqButton' (event, instance) {
        event.preventDefault();
        FlowRouter.go('/technicalSkillsQuestionaire/userLanguageList');
    }
});
// */