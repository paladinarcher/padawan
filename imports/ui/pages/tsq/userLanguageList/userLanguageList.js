import './userLanguageList.html';
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import '../../../components/select_autocomplete/select_autocomplete.html';
import { callWithPromise } from '/imports/client/callWithPromise';
import { KeyData, SkillsData } from '/imports/client/clientSideDbs';

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

async function updateUserData() {
  return KeyData.findOne()
}

// already has skills helper fn
function alreadyHasSkills() {
  return KeyData.findOne().skills;
}

//
// Functions with Meteor Calls to the API
//

async function checkUserForSkill(skill, key) {
  let result = await callWithPromise('tsq.checkUserForSkill', skill, key);
  return result.statusCode === 200 ? true : false;
}

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
      onReady: () => {
        console.log({subName: 'tsqUserList', readyStatus: true, arguments, self: this});
        let userId = Meteor.userId();
        user = User.findOne({ _id: userId });

        if (user.MyProfile.technicalSkillsData === undefined) {
          registerUser(user)
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
        })

        this.keyDataSub = this.subscribe('tsq.keyData', User.findOne({_id: userId}).MyProfile.technicalSkillsData, {
          onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: this}) : null,
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, error, arguments, THIS: this}) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this}) : null,
        })
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

Template.tsq_pasteProfile.helpers({
  hasSkills() {
    return (KeyData.findOne().skills.length > 0) ? true : false 
  },
  userSkills() {
    return KeyData.findOne().skills;
  },
  unansweredPercent() {
    let newSkills = KeyData.findOne().skills.filter(skill => skill.confidenceLevel === 0);
    let totalSkills = KeyData.findOne().skills;
    let newSkillsCount = newSkills.length;
    let totalSkillsCount = totalSkills.length + 2;
    let hasUnfamiliar = totalSkills.filter(skill => skill.familar === false)

    if (!hasUnfamiliar && newSkillsCount === 0) {
      newSkillsCount += 2;
    } else if (!hasUnfamiliar) {
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
        const mappedSkills = [...KeyData.findOne().skills].map(skill => { return {...skill, id: skill._id, name: skill.name.name} })
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
    };
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
    FlowRouter.go(
      '/technicalSkillsQuestionaire/results'
    );
    return;
  }
});
