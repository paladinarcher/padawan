import './userLanguageList.html';
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import '../../../components/select_autocomplete/select_autocomplete.html';
import { callWithPromise } from '/imports/client/callWithPromise';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';
import TSQ_DATA from './TSQData';
import { isUndefined } from 'util';

/**
 * Variables/Constants
 */

let user;

/**
 * Functions
 */

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
  return KeyData.findOne().skills;
}

//
// Functions with Meteor Calls to the API
//


function removeSkillFromUser(SkillEntryarray, key) {
  Meteor.call(
    'tsq.removeSkillFromUser',
    SkillEntryarray,
    key,
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
      }
    }
  );
}

async function registerUser (user) {
  let result =  await callWithPromise('tsq.registerKeyToUser');
  const { key } = result.data.data;
  user.registerTechnicalSkillsDataKey(key)
}

function addSkillsToUser(skillsToAdd, key) {
  Meteor.call('tsq.addSkillToUser', skillsToAdd, key, (error, result) => result )
}

function updateSkillFamiliarSetting(key, skillId, familiar) {
  Meteor.call(
    'tsq.updateFamiliarInformation',
    key,
    skillId,
    familiar,
    (error, result) => console.info({error, result})
  );
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
});

// global template helpers
Template.registerHelper('alreadyHasSkills', alreadyHasSkills);

//
// USER LANGUAGE LIST TEMP
//

Template.tsq_userLanguageList.helpers({
  userDataRetrieved() {
    return KeyData.find({});
  }
});

//
// PASTE PROFILE TEMP
//
Template.tsq_pasteProfile.onCreated(function () {
  this._helpLevel = new ReactiveVar((parseInt(FlowRouter.getQueryParam('h')) ? FlowRouter.getQueryParam('h') : -1));
  this.helpLevel = () => this._helpLevel.get();
  Template.tsq_pasteProfile.__helpers[" introLevel"]();

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
    return (KeyData.findOne().skills.length > 0) ? true : false ;
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
  introLevel() {
    var lvl = Template.instance().helpLevel();
    if(lvl < 0) {
      lvl = 2;//Template.tsq_pasteProfile.__helpers[" hasIntroInstructions"]() ? 2 : 0;
    }
    Template.instance()._helpLevel.set(lvl);
    return Template.instance().helpLevel();
  },
  userSkills() {
    return KeyData.findOne().skills;
  },
  isFinished() {
    let skills = KeyData.findOne().skills;
    if(skills.length < 1) { return false; }
    if(skills) {
        let hasUnfinished = skills.findIndex(element => {
            return element.confidenceLevel === 0;
        });
        if(hasUnfinished > -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
  },
  unansweredPercent() {
    let newSkills = KeyData.findOne().skills.filter(skill => skill.confidenceLevel === 0);
    let totalSkills = KeyData.findOne().skills;
    if(totalSkills.length < 1) {
      return 100;
    }
    let newSkillsCount = newSkills.length;
    let totalSkillsCount = totalSkills.length + 2;
    let hasUnfamiliar = totalSkills.filter(skill => skill.familiar === false)
    console.log("HU NSC",hasUnfamiliar, newSkillsCount);

    if (hasUnfamiliar.count === 0 && newSkillsCount === 0) {
      newSkillsCount += 2;
    } else if (hasUnfamiliar.count === 0) {
      newSkillsCount++;
    }
    
    return (newSkillsCount / totalSkillsCount) * 100;
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
      if (![...KeyData.findOne().skills].map(skill => skill._id).includes(skillEntry.id)) {
        const mappedSkills = [...KeyData.findOne().skills].map(skill => { return {...skill, id: skill._id, name: skill.name.name} });
        addSkillsToUser([...mappedSkills, skillEntry], KeyData.findOne().key);
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
      removeSkillFromUser([skillEntry], KeyData.findOne().key);
    }
  },
  itemSelectHandler() {
    let selections = getSelections(KeyData.findOne().skills);
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
    return;
  },
  'click .tsq-updateAndContinue': function(event, instance) {
    FlowRouter.go(
      '/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + KeyData.findOne().key
    );
    return;
  },
  'click .tsq-cancel': function(event, instance) {
    if( isUndefined(keyData.curValue.skills) || keyData.curValue.skills.length > 0 ) { 
      FlowRouter.go('/technicalSkillsQuestionaire/results'); 
    }
    return;
  },
  'click button.btn-back-intro'(event, instance) {
    var lvl = instance._helpLevel.get() + 1;
    if(lvl > 2) { lvl = 2; }
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
    instance._helpLevel.set(lvl);
  },
  'click button.btn-continue-intro'(event, instance) {
    var lvl = instance._helpLevel.get() - 1;
    if(lvl < 0) { lvl = 0; }
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
    instance._helpLevel.set(lvl);
  },
  'click span.showIntro'(event, instance) {
    let lvl = 2;
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
    instance._helpLevel.set(lvl);
  },
  'click span.showInstructions'(event, instance) {
    let lvl = 1;
    FlowRouter.go("/technicalSkillsQuestionaire/userLanguageList?h="+lvl);
    instance._helpLevel.set(lvl);
  }
});
