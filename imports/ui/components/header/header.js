import './header.html';
import { User } from '/imports/api/users/users.js';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';
import '../../components/notification_list/notification_list.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { Team,TeamIcon } from '/imports/api/teams/teams.js';
import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';

let keyInfo = new ReactiveVar();
let userAlreadyHasSkills = new ReactiveVar(false); // boolean value indicating whether or not the user already has skill data in their key
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs


async function registerUser (user) {
  let result =  await callWithPromise('tsq.registerKeyToUser');
  const { key } = result.data.data;
  user.registerTechnicalSkillsDataKey(key)
}

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

Template.header.onCreated(function() {
    //session variable for reloading page data
    Session.set('reload', true);
    Session.set('reload', false);


    Session.set('summaryClicked', false); 
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
    });


  this.autorun(() => {
    this.subscription1 = this.subscribe('tsqUserList', this.userId, {
      onStop: function() {
        console.log('tsq user List subscription stopped! ', arguments, this);
      },
      onReady: async () => {
        console.log({subName: 'tsqUserList', readyStatus: true, arguments, self: this});
        let userId = Meteor.userId();
        user = User.findOne({ _id: userId });

        if (user.MyProfile.technicalSkillsData === undefined || !user.MyProfile.technicalSkillsData) {
          await registerUser(user);
        }

        this.tsqSkillSub = this.subscribe('tsq.allSkills', {
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

        this.keyDataSub = this.subscribe('tsq.keyData', User.findOne({_id: userId}).MyProfile.technicalSkillsData, {
          onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: this}) : null,
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this}) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this}) : null,
        });
      }
    });
  });


    this.autorun( () => {




        let tsqData = KeyData.findOne();
        console.log('tsqData: ', tsqData);
        alert('delete this');

        this.subscription = this.subscribe('userData', this.teamName, {
            onStop: function () {
                console.log("User header subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User header subscription ready! ", arguments, this);
            }
        });
        // code for if the header context menu shows up by default
        let u = User.findOne({_id:Meteor.userId()});
        console.log('u: ', u);

        if (u !== undefined) {
            let ansQstn = u.MyProfile.UserType.AnsweredQuestions;
            let trtSpcAnswered = false;
            let tsqAnswered = false;
            curPage = FlowRouter.current().path;
            // is trait spectrum started?
            if (ansQstn === undefined || ansQstn.length == 0) {
                trtSpcAnswered = false;
            } else {
                trtSpcAnswered = true;
            }

            // is tsq started?
            if( !isUndefined(keyInfo.get().skills) && keyInfo.get().skills.length > 0 ) {
                tsqAnswered = false;
            } else {
                tsqAnswered = true;
            }

            console.log('curPagePath: ', curPage);
            console.log('trtSpcAnswered: ', trtSpcAnswered);
            console.log('tsqAnswered: ', tsqAnswered);
            // show the context menu if everthing is answered or web page is on answered test 
            if (trtSpcAnswered == true && tsqAnswered == true ||
                trtSpcAnswered == true && tsqAnswered == false && curPage == '/questions') {
                console.log('header context menu open');
                let menu = $('#context-menu-div');
                menu.css('display', 'block');
                Session.set('summaryClicked', false);
            } else {
                console.log('header context menu closed');
                let menu = $('#context-menu-div');
                menu.css('display', 'none');
                Session.set('summaryClicked', true);
            }
        }
    });
});
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
    },
    summaryClicked() {
        if ([false, undefined].includes(Session.get('summaryClicked'))) {
            return false;
        } else {
            return true;
        }
    }
})
Template.header.events({
    'click a#nav-traitSpectrum'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/questions');
    },
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/addQuestions/IE');
    },
    'click a#nav-qnaireList'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/qnaireList');
    },
    'click a#nav-learnshare'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/learnShareList');
    },
    'click a#nav-teams'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/adminTeams');
    },
    'click a#nav-goals'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/goals');
    },
    'click a#nav-mbtiresults'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/mbtiResults');
    },
    'click a#nav-commentreport'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/commentReport');
    },
    'click a#nav-traitdesc'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/addTraitDescriptions');
    },
    'click a#nav-profile'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/profile');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        let u = User.findOne( {_id:Meteor.userId()} );
        let uid = Meteor.userId();
        if (uid == undefined) {
            FlowRouter.go('/char_sheet');
        } else {
            FlowRouter.go('/char_sheet/' + uid);
        }
    },
    'click a#nav-assessments'(event, instance) {
        event.preventDefault();
        $(".navbar-collapse").collapse('hide');
        FlowRouter.go('/dashboard');
    },
    'click a#nav-adminreports'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools/reports');
        console.log('hello');
    },
    'click a#nav-tools'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools');
        console.log('hllo');
    },
    'click a#nav-usermgmt'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/tools/userManagement');
        console.log('hello user management page');
    },
    'click a#nav-contextmenu'(event, instance) {
        event.preventDefault();
        if (Session.get('summaryClicked') == true) {
            Session.set('summaryClicked', false);
        } else {
            Session.set('summaryClicked', true);
        }
        let menu = $('#context-menu-div');
        let hideValues = $('.hamburgerHide');
        if (menu.css('display') == 'block') {
            menu.css('display', 'none');
            hideValues.css('display', 'block');
        } else {
            menu.css('display', 'block');
            hideValues.css('display', 'none');
        }
    },
    'click a#nav-tsq'(event, instance) {
        event.preventDefault();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            FlowRouter.go('/technicalSkillsQuestionaire/results');
        }
    }
});
