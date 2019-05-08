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
  console.log("user skills: %o", usersSkillsArray);
  console.log("start unfamiliarList: %o", unfamiliarList);
  usersSkillsArray.forEach(skillEntry => {
    if (skillEntry.familiar === false) {
      let i = unfamiliarList.findIndex(
        updateObj => skillEntry.name.name === updateObj.name.name
      );
      if (i < 0) {
        unfamiliarList.push(buildUpdateObjects(skillEntry));
      }
    }
  });
  console.log("end unfamiliarList: %o", unfamiliarList);
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
  return { id: skill._id, name: skill.name, familiar: false, };
}

async function updateUser(updateObject, key) {
  let result = await callWithPromise('tsq.addSkillToUser', updateObject, key);
  return result;
}
function addSkillsToUser(arrayOfSkillInformation, userKey) {
  console.log("trying to add: ", arrayOfSkillInformation);
  Meteor.call(
    'tsq.addSkillToUser',
    arrayOfSkillInformation,
    userKey,
    (error, result) => {
      if (error) {
        console.log('METEOR CALL ERROR: ', error);
      } else {
        console.log('tsq.addSkilToUser: %o', result);
      }
    }
  );
}

async function addUnfamiliarSkillsToUser(counter, unfamiliarList) {
  if (counter < 10) {
    let result = await callWithPromise('tsq.getRandomSkills', 10 - counter);
    let updateArray = [];
    result.data.data.payload.forEach(skill => {
      let i = usersKeyData.get().skills.findIndex(
        updateObj => skill.name === updateObj.name.name
      );
      if (i < 0) {
        skillObj = { id: skill.name._id, name: skill };
        updateArray.push(buildUpdateObjects(skillObj));
      }
    });
    const updatedUnfamiliarList = unfamiliarList.get().concat(updateArray);
    unfamiliarList.set(updatedUnfamiliarList);
    return await addSkillsToUser(updateArray, usersKeyData.get().key);
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
      checkForUnfamiliarSkillsExist(usersKeyData.get().skills)
      createTheListToDisplay(unfamiliarList.get(), usersKeyData.get().skills);
      let added = addUnfamiliarSkillsToUser(unfamiliarList.get().length, unfamiliarList);
      console.log("This is what was added: %o", added);
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
  'click .unfamiliar-item-checkbox': function(event, instance) {
    // const labelData = $(event.target).next(0).text()
    const skillId = $(event.target).data('id');
    const familiarValue = $(event.target).is(':checked');
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
