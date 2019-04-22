import './familiarVsUnfamiliar.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { callWithPromise } from '/imports/client/callWithPromise';

// /*
// Variables
// */

let usersKeyData = new ReactiveVar();
let userHasUnfamilarSkills = new ReactiveVar(false);
let unfamiliarList = new ReactiveVar([]);

// /*
// Functions
// */

function createTheListToDisplay(unfamiliarList, usersSkillsArray) {
  usersSkillsArray.forEach(skillEntry => {
    if (skillEntry.familiar === false) {
      if (
        unfamiliarList.findIndex(
          updateObj => skillEntry.name.name === updateObj.name.name
        ) < 0
      ) {
        unfamiliarList.push(buildUpdateObjects(skillEntry));
      }
    }
  });
  return unfamiliarList;
}

function checkForUnfamiliarSkillsExist(skillsArray) {
  skillsArray.forEach(skillEntry => {
    if (skillEntry.familiar === false) {
      userHasUnfamilarSkills.set(true);
    }
  });
  return userHasUnfamilarSkills.get();
}

function buildUpdateObjects(skill) {
  return { id: skill._id, name: skill.name };
}

async function updateUser(updateObject, key) {
  let result = await callWithPromise('tsq.addSkillToUser', updateObject, key);
  return result;
}

async function addUnfamiliarSkillsToUser(counter, unfamiliarList) {
  if (counter < 10) {
    let result = await callWithPromise('tsq.getRandomSkills', 10 - counter);
    let updateArray = [];
    result.data.data.payload.forEach(skill => {
      skillObj = { id: skill._id, name: skill };
      updateArray.push(buildUpdateObjects(skillObj));
    });
    const updatedUnfamiliarList = unfamiliarList.get().concat(updateArray);
    unfamiliarList.set(updatedUnfamiliarList);
    return await updateUser(updateArray, usersKeyData.get().key);
  }
}

function updateSkillFamiliarSetting(key, skillId, familiar) {
  Meteor.call(
    'tsq.updateFamiliarInformation',
    key,
    skillId,
    familiar,
    (error, result) => {
      if (error) {
        Meteor.Error('updateSkillFamiliarSetting', error);
      }
    }
  );
}

// /*
// Templates
// */

Template.tsq_familiarVsUnfamiliar.onCreated(function() {
  this.autorun(() => {
    Template.instance().userKey = FlowRouter.getParam('key'); // add key to template from route params
    Meteor.call(
      'tsq.getKeyData',
      Template.instance().userKey,
      (error, result) => {
        if (error) {
          console.error(error);
        } else {
          usersKeyData.set(result.data.data.payload); // set users key data to reactive var
        }
      }
    );
  });
});

Template.tsq_familiarVsUnfamiliar.helpers({
  checkForSkillsExist() {
    return usersKeyData.get(); // get keydata
  },
  checkForUnfamiliarSkills() {
    if (usersKeyData.get().skills) {
      checkForUnfamiliarSkillsExist(usersKeyData.get().skills);
      createTheListToDisplay(unfamiliarList.get(), usersKeyData.get().skills);
      addUnfamiliarSkillsToUser(unfamiliarList.get().length, unfamiliarList);
      createTheListToDisplay(unfamiliarList.get(), usersKeyData.get().skills);
    }
  },
  unfamiliarList() {
    return unfamiliarList.get();
  },
  createId(name) {
    const n = name.hash.name;
    return n.replace(/\s+/g, '-').toLowerCase();
  }
});

Template.tsq_familiarVsUnfamiliar.events({
  'change .unfamiliar-item-checkbox': function(event, instance) {
    // const labelData = $(event.target).next(0).text()
    const skillId = $(event.target).data('id');
    const familiarValue = event.target.checked;
    const userKey = usersKeyData.get().key;
    if (familiarValue) {
      updateSkillFamiliarSetting(userKey, skillId, true);
    } else {
      updateSkillFamiliarSetting(userKey, skillId, false);
    }
  },
  'click #confidenceQnaireStart': function(event, instance) {
    FlowRouter.go(
      '/technicalSkillsQuestionaire/confidenceQuestionaire/' +
        usersKeyData.get().key
    );
  }
});
