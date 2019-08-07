import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { Team,TeamIcon } from '/imports/api/teams/teams.js';
import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';

let minQuestionsAnswered = new ReactiveVar(72);
let keyInfo = new ReactiveVar();
let userAlreadyHasSkills = new ReactiveVar(false); // boolean value indicating whether or not the user already has skill data in their key
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs

async function getAllSkillsFromDB(list) {
    let result = await callWithPromise('tsq.getAllSkills');
    let arrayList = [];
    result.data.data.payload.forEach(element => {
      arrayList.push({
        value: element._id,
        text: element.name
      });
    });
    list.set(arrayList);
    Session.set('allSkills', list);
    console.log('All Skills List: ', list);
  
    // Load in the TSQ Test DATA
    if (list.get().length === 0) {
      for (skills of TSQ_DATA) {
        let key = Object.keys(skills);
        for (k of key) {
          for (skill of skills[key]) {
            await callWithPromise('tsq.addSkill', skill.name);
          }
        }
      }
    }
  
    return list;
  }

async function checkForKeyAndGetData(user) {
    let result;
    let key;
    if (user.MyProfile.technicalSkillsData === undefined) {
      result = await registerUser();
      key = result.data.data.key;
      keyInfo.set(result.data.data);
      user.registerTechnicalSkillsDataKey(key);
    } else {
      Meteor.call(
        'tsq.getKeyData',
        user.MyProfile.technicalSkillsData,
        async (error, result) => {
          if (error) {
            result = await registerUser();
            key = result.data.data.key;
            keyInfo.set(result.data.data);
            user.registerTechnicalSkillsDataKey(key);
          } else {
            if (result.data.data.payload === null) {
              result = await registerUser();
              key = result.data.data.key;
              keyInfo.set(result.data.data);
              user.registerTechnicalSkillsDataKey(key);
            }
            if (result.data.data.payload.skills.length !== 0) {
              userAlreadyHasSkills.set(true);
            }
            keyInfo.set(result.data.data.payload);
          }
          //session variable for reloading page data
          Session.set("keyInfo",keyInfo.get());
          if (Session.get('reload') == true) {
            Session.set('reload', false);
          } else {
            Session.set('reload', true);
          }
        }
      );
    }
}

Template.context_menu.onCreated(function() {
    //session variable for reloading page data
    Session.set('reload', true);
    Session.set('reload', false);

    if (Session.get('conMenuClick') == undefined) {
        Session.set('conMenuClick', 'overview');
    }
    // stores total mbti question count in totalMbtiQuestions
    Meteor.call('question.countQuestions', Meteor.userId(), (error, result) => {
        if (error) {
            console.log("EEERRR0r: ", error);
        } else {
            //success
            console.log("Question Count", result);
            Session.set('totalMbtiQuestions', result);
            let segments = result;
            if(segments > 200) {
                segments = segments/2;
            }
            Session.set('allMbtiQuestions', new Array(segments));
        }
    });
    this.autorun(async () => {
        this.subscription1 = await this.subscribe('tsqUserList', this.userId, {
            onStop: function() {
             // console.log('tsq user List subscription stopped! ', arguments, this);
            },
            onReady: function() {
             // console.log('tsq user List subscription ready! ', arguments, this);
              let userId = Meteor.userId();
              user = User.findOne({ _id: userId });
              checkForKeyAndGetData(user);
              //console.log("The Key is: "+keyInfo.get().key);
              getAllSkillsFromDB(allSkillsFromDB);
            }
        });
        this.subscription2 = this.subscribe('teamsData', {
            onStop: function () {
                console.log("Team subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team subscription ready! ", arguments, this);
            }
        });
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
    userIsAdmin() {
        let isAdmin = false;
        let currentUser = User.findOne({ _id: Meteor.userId() });
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
        all = 0;
        keyInfo.get().skills.forEach((value, index) => {
            all++;
        });
        return all;
    },
    unfinishedCount() {
        unfinished = 0;
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.confidenceLevel === 0) {
                unfinished += 1;
            }
        });
        return unfinished;
    },
    unfinishedPercent() {
        let tot = Template.context_menu.__helpers.get('totalCount').call() + 2;
        let ufc = Template.context_menu.__helpers.get('unfinishedCount').call();
        if(!Template.context_menu.__helpers.get('unfamiliarCount')) {
            ufc++;
        }
        return (ufc / tot) * 100;
    },
    finishedPercent() {
        return 100 - Template.context_menu.__helpers.get('unfinishedPercent').call();
    },
    familiarCount() {
        familiar = 0;
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.familiar === true) {
                familiar += 1;
            }
        });
        return familiar;
    },
    unfamiliarCount() {
        unfamiliar = 0;
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value.familiar, index);
            if (value.familiar === false) {
                unfamiliar += 1;
            }
        });
        return unfamiliar;
    },
    finishedPercentRound() {
        return (100 - Template.context_menu.__helpers.get('unfinishedPercent').call()).toFixed(2);
    },
    tsqNotStarted() {
        Session.get('reload');
        if( !isUndefined(keyInfo.get().skills) && keyInfo.get().skills.length > 0 ) {
            return false; 
        } else {
            return true;
        }
    },
    continueTsq() {
        Session.get('reload');
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
        // Session.get('reload', true);
        // Session.get('reload', false);
        Session.get('reload');
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
