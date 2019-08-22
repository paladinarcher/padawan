import './userLanguageList.html';
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import '../../../components/select_autocomplete/select_autocomplete.html';
import { callWithPromise } from '/imports/client/callWithPromise';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';
import { ReactiveVar } from 'meteor/reactive-var';
import TSQ_DATA from '/imports/api/tsq/TSQData';

/**
 * Variables/Constants
 */
const TSQ = require("/imports/api/tsq/tsq.js");
let user;

/**
 * Functions
 */
function confidenceClick() {
  if (Session.get('confidenceClick') !== true) {
    Session.set('confidenceClick', true);
  } else {
    Session.set('confidenceClick', false);
  }
}

// creates a properly formatted array for the selections
// on the autocomplete selections helper
function getSelections(selections) {
  let r = [];
  selections.forEach(sel => {
    let entry = {
      value: sel.name._id,
      text: sel.name.name,
      familiar: sel.familiar
    };
    r.push(entry);
  });
  return r;
}

// already has skills helper fn
function alreadyHasSkills() {
  return TSQ.totalSkills(KeyData.findOne());
}

/**
 * Templates
 */

// main temp
Template.tsq_userLanguageList.onCreated(function() {
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
          await TSQ.registerUser(user);
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
});

// global template helpers
Template.registerHelper('alreadyHasSkills', alreadyHasSkills);

//
// USER LANGUAGE LIST TEMP
//

Template.tsq_userLanguageList.helpers({
  userDataRetrieved() {
    return KeyData.findOne();
  }
});

//
// PASTE PROFILE TEMP
//
Template.tsq_pasteProfile.onCreated(function () {
  this._helpLevel = new ReactiveVar((isNaN(parseInt(FlowRouter.getQueryParam('h'))) ? (isNaN(parseInt(localStorage.getItem('tsq-h'))) ? "" : localStorage.getItem('tsq-h')) : FlowRouter.getQueryParam('h')));
  this.helpLevel = () => this._helpLevel.get();
  Template.tsq_pasteProfile.__helpers[" introLevel"](this.helpLevel());

  this.autorun(()=> {
    this.subscription2 = this.subscribe('tsq.helperTexts', {
      onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.helperTexts', readyStatus: true, arguments, THIS: this}) : null,
      onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.helperTexts', readyStatus: false, arguments, THIS: this}) : null,
      onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.helperTexts', readyStatus: false, arguments, THIS: this}) : null,
    });
  });
});
Template.tsq_pasteProfile.helpers({
  hasSkills() {
    return (alreadyHasSkills().length > 0) ? true : false ;
  },
  getIntroInstructions() {
    var tmp = HelpText.findOne();
    console.log(tmp);
    return tmp;
  },
  getIntroHTML() {
    var tmp = Template.tsq_pasteProfile.__helpers[" getIntroInstructions"]();
    return tmp.Intro;
  },
  getInstructionsHTML() {
    var tmp = Template.tsq_pasteProfile.__helpers[" getIntroInstructions"]();
    return tmp.Instructions;
  },
  hasIntro() {
    var tmp = Template.tsq_pasteProfile.__helpers[" getIntroInstructions"]();
    return tmp != null && typeof tmp.Intro != "undefined" && tmp.Intro != "";
  },
  hasInstructions() {
    var tmp = Template.tsq_pasteProfile.__helpers[" getIntroInstructions"]();
    return tmp != null && typeof tmp.Instructions != "undefined" && tmp.Instructions != "";
  },
  hasIntroInstructions() {
    return Template.tsq_pasteProfile.__helpers[" hasIntro"]() || Template.tsq_pasteProfile.__helpers[" hasInstructions"]();
  },
  introLevelIntro() {
    var lvl = Template.instance().helpLevel();
    return lvl == 2;
  },
  introLevelInstructions() {
    var lvl = Template.instance().helpLevel();
    return lvl == 1;
  },
  introLevelMain() {
    var lvl = Template.instance().helpLevel();
    return lvl != 1 && lvl != 2;
  },
  introLevel(lvl) {
    if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = FlowRouter.getQueryParam('h'); }
    if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = Session.get('tsq-h'); }
    if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = 20; }
    if(lvl < 0) { lvl = 0; }
    if(lvl > 2) { lvl = 2; }
    Template.instance()._helpLevel.set(lvl);
    localStorage.setItem('tsq-h',lvl);
    return Template.instance().helpLevel();
  },
  userSkills() {
    return TSQ.totalSkills(KeyData.findOne());
  },
  isFinished() {
    let skills = TSQ.totalSkills(KeyData.findOne());
    if(skills.length < 1) { return false; }
    return true;
  },
  unansweredPercent() {
    let kd = KeyData.findOne();
    return TSQ.unansweredPercent(kd);
  },
  answeredPercent() {
    return 100 - Template.tsq_pasteProfile.__helpers.get('unansweredPercent').call();
  },
  onItemAdd() {
    return (value, $item) => {
      const skillEntry = {
        id: value,
        name: $($item)
          .text()
          .substring(0, $($item).text().length - 1),
        familiar: true
      };
      let kd = KeyData.findOne();
      let uSkills = kd.skills;
      if (![...uSkills].map(skill => skill._id).includes(skillEntry.id)) {
        const mappedSkills = [...uSkills].map(skill => { return {...skill, id: skill._id, name: skill.name.name} });
        TSQ.addSkillsToUser([...mappedSkills, skillEntry], kd.key);
      } else {
        TSQ.updateSkillFamiliarSetting(kd.key, skillEntry.id, true);
      }
    };
  },
  onItemRemove() {
    return (value, $item) => {
      // create skill entry obj
      let skillEntry = {
        name: value
      };

      // remove the skill from the user
      TSQ.removeSkillFromUser([skillEntry], KeyData.findOne().key);
    }
  },
  itemSelectHandler() {
    let selections = getSelections(TSQ.totalSkills(KeyData.findOne()));
    let familiarSelections = selections.filter(
      selection => selection.familiar === true
    );
    return familiarSelections;
  },
  itemListHandler() {
    return SkillsData.find().fetch().map(skill => { return { text: skill.name, value: skill._id } });
  }
});

Template.tsq_pasteProfile.events({
  'click .tsq-enterSkillsContinue': function(event, instance) {
    confidenceClick();
    return;
  },
  'click .tsq-updateAndContinue': function(event, instance) {
    confidenceClick();
    FlowRouter.go(
      '/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + KeyData.findOne().key
    );
    return;
  },
  'click button.tsq-cancel': function(event, instance) {
    confidenceClick();
    FlowRouter.go('/technicalSkillsQuestionaire/results'); 
  },
  'click button.btn-back-intro'(event, instance) {
    var lvl = instance.view.template.__helpers[" introLevel"](instance._helpLevel.get() + 1);
    confidenceClick();
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
  },
  'click button.btn-continue-intro'(event, instance) {
    var lvl = instance.view.template.__helpers[" introLevel"](instance._helpLevel.get() - 1);
    confidenceClick();
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
  },
  'click span.showIntro'(event, instance) {
    var lvl = instance.view.template.__helpers[" introLevel"](2);
    confidenceClick();
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
  },
  'click span.showInstructions'(event, instance) {
    var lvl = instance.view.template.__helpers[" introLevel"](1);
    confidenceClick();
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
  }
});
