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
let reload = new ReactiveVar();


function updateContextDisplay(customPage) {
    // code for if the header context menu shows up by default
    let u = User.findOne({_id:Meteor.userId()});
    console.log('u: ', u);

    if (u !== undefined) {
        let ansQstn = u.MyProfile.UserType.AnsweredQuestions;
        let trtSpcAnswered = false;
        let tsqAnswered = false;
        let curPage = FlowRouter.current().path;
        if (customPage !== undefined) {
            curPage = customPage;
        }
        let onTrtSpct = /questions/;
        onTrtSpct = onTrtSpct.test(curPage);
        let onTsq = /technicalSkillsQuestionaire/;
        onTsq = onTsq.test(curPage);


        // is trait spectrum started?
        if (ansQstn === undefined || ansQstn.length == 0) {
            trtSpcAnswered = false;
        } else {
            trtSpcAnswered = true;
        }

        // is tsq started?
        if( !isUndefined(keyInfo) && !isUndefined(keyInfo.get()) && !isUndefined(keyInfo.get().skills) && keyInfo.get().skills.length > 0 ) {
        // if( !isUndefined(keyInfo.get().skills) ) {
            tsqAnswered = true;
        } else {
            tsqAnswered = false;
        }

        console.log('curPagePath: ', curPage);
        console.log('trtSpcAnswered: ', trtSpcAnswered);
        console.log('tsqAnswered: ', tsqAnswered);
        console.log('onTrtSpct :', onTrtSpct);
        console.log('onTsq :', onTsq);

        // show the context menu if everthing is answered or web page is on answered test 
        if (trtSpcAnswered == true && tsqAnswered == true ||
            trtSpcAnswered == true && tsqAnswered == false && onTrtSpct ||
            trtSpcAnswered == false && tsqAnswered == true && onTsq) {
            console.log('header context menu open');
            let menu = $('#context-menu-div');
            menu.css('display', 'block');
            Session.set('summaryClicked', true);
        } else {
            console.log('header context menu closed');
            let menu = $('#context-menu-div');
            menu.css('display', 'none');
            Session.set('summaryClicked', false);
        }
    }
};

function updateTsq() {
  let userId = Meteor.userId();
  user = User.findOne({ _id: userId });
  checkForKeyAndGetData(user);
  if (reload.get() == true) { // used in context_menu.js
    reload.set(false);
  } else {
    reload.set(true);
  }
};


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
        }
      );
    }
};


Template.header.onCreated(function() {


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
    this.subscription2 = this.subscribe('tsqUserList', this.userId, {
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

        this.subscription = this.subscribe('userData', this.teamName, {
            onStop: function () {
                console.log("User header subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User header subscription ready! ", arguments, this);

                // update context only the first time header.js is rendered
                if (Session.get('reloadStart') == 2) {
                    Session.set('reloadStart', 1);
                }
                else if (Session.get('reloadStart') == 1) {
                    Session.set('reloadStart', 0);
                    updateContextDisplay();
                }
            }
        });
    });
});
Template.header.onRendered(function(){
    //session variable for knowing if page was just reloaded
    Session.set('reloadStart', 2);
    $("#nav-traitSpectrum").tooltip();
})
Template.header.helpers({
    reloadContext() {
        Template.instance().data.reload.get();
        let userId = Meteor.userId();
        user = User.findOne({ _id: userId });
        checkForKeyAndGetData(user);
        // let foo = Session.get('confidenceClick');
    },

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
    },
    reload() {
      return reload;
    }
})
Template.header.events({
    'click a#nav-traitSpectrum'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/questions');
        FlowRouter.go('/questions');
    },
    'click a#nav-addquestions'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('pide');
        updateContextDisplay('/addQuestions/IE');
        FlowRouter.go('/addQuestions/IE');
    },
    'click a#nav-qnaireList'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/qnaireList');
        FlowRouter.go('/qnaireList');
    },
    'click a#nav-learnshare'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/learnShareList');
        FlowRouter.go('/learnShareList');
    },
    'click a#nav-teams'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/adminTeams');
        FlowRouter.go('/adminTeams');
    },
    'click a#nav-goals'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/goals');
        FlowRouter.go('/goals');
    },
    'click a#nav-mbtiresults'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/mbtiResults');
        FlowRouter.go('/mbtiResults');
    },
    'click a#nav-commentreport'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/commentReport');
        FlowRouter.go('/commentReport');
    },
    'click a#nav-traitdesc'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/addTraitDescriptions');
        FlowRouter.go('/addTraitDescriptions');
    },
    'click a#nav-profile'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/profile');
        FlowRouter.go('/profile');
    },
    'click a.navbar-brand'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        let u = User.findOne( {_id:Meteor.userId()} );
        let uid = Meteor.userId();
        if (uid == undefined) {
            updateContextDisplay('/char_sheet');
            FlowRouter.go('/char_sheet');
        } else {
            updateContextDisplay('/char_sheet/' + uid);
            FlowRouter.go('/char_sheet/' + uid);
        }
    },
    'click a#nav-assessments'(event, instance) {
        event.preventDefault();
        updateTsq();
        $(".navbar-collapse").collapse('hide');
        updateContextDisplay('/dashboard');
        FlowRouter.go('/dashboard');
    },
    'click a#nav-adminreports'(event, instance) {
        event.preventDefault();
        updateTsq();
        updateContextDisplay('/tools/reports');
        FlowRouter.go('/tools/reports');
        console.log('hello');
    },
    'click a#nav-tools'(event, instance) {
        event.preventDefault();
        updateTsq();
        updateContextDisplay('/tools');
        FlowRouter.go('/tools');
        console.log('hllo');
    },
    'click a#nav-usermgmt'(event, instance) {
        event.preventDefault();
        updateTsq();
        updateContextDisplay('/tools/userManagement');
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
        updateTsq();
        if (event.ctrlKey) {
            window.open(event.target.href);
        } else {
            updateContextDisplay('/technicalSkillsQuestionaire/results');
            FlowRouter.go('/technicalSkillsQuestionaire/results');
        }
    }
});
