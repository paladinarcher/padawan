import './userLanguageList.html';
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import '../../../components/select_autocomplete/select_autocomplete.html';
import { callWithPromise } from '/imports/client/callWithPromise';
import TSQ_DATA from './TSQData';
import { isUndefined } from 'util';

/**
 * Variables/Constants
 */

let user;

let keyData = new ReactiveVar(); // user's key data
let updatedSkills = new ReactiveVar(); //to help with setting progress.
let userSkillUpdateArray = new ReactiveVar([]); // array that mass updates the user with skills, (may not need anymore) - array of objs
let userAlreadyHasSkills = new ReactiveVar(false); // boolean value indicating whether or not the user already has skill data in their key
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs

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

async function getUserKey(key) {
  return callWithPromise('tsq.getKeyData', key);
}

async function updateUserData() {
  let keyInfo = await getUserKey(keyData.get().key);
  updatedSkills.set(keyInfo.data.data.payload);
}

// already has skills helper fn
function alreadyHasSkills() {
  return userAlreadyHasSkills.get();
}

// builds a user skill obj to mass add to the user
function buildUserSkillObject(skill) {
  let userSkillEntry = {
    name: skill,
    familiar: true
  };
  userSkillUpdateArray.get().push(userSkillEntry);
}

//
// Functions with Meteor Calls to the API
//

async function checkUserForSkill(skill, key) {
  let result = await callWithPromise('tsq.checkUserForSkill', skill, key);
  return result.statusCode === 200 ? true : false;
}

function removeSkillFromUser(SkillEntryarray, key, callback) {
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
  callback();
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

async function registerUser() {
  return await callWithPromise('tsq.registerKeyToUser');
}

async function lookupUserKey() {
  return await callWithPromise('tsq.getKeyData');
}

/**
 * @name checkForKeyAndGetData
 * @description checks user for a technicalSkillsData key,
 * 				assigns the key, stores the data in a reactive
 * 				var named keyData
 * @param {Object} user	User from the  db
 */
async function checkForKeyAndGetData(user) {
  let result;
  let key;
  if (user.MyProfile.technicalSkillsData === undefined) {
    result = await registerUser();
    key = result.data.data.key;
    keyData.set(result.data.data);
    console.log('tsq.registerKeyToUser set keyData', keyData);
    user.registerTechnicalSkillsDataKey(key);
  } else {
    Meteor.call(
      'tsq.getKeyData',
      user.MyProfile.technicalSkillsData,
      async (error, result) => {
        if (error) {
          result = await registerUser();
          key = result.data.data.key;
          keyData.set(result.data.data);
          console.log('tsq.registerKeyToUser set keyData', keyData);
          user.registerTechnicalSkillsDataKey(key);
        } else {
          console.log('tsq.getKeyData result', result);
          if (result.data.data.payload === null) {
            result = await registerUser();
            key = result.data.data.key;
            keyData.set(result.data.data);
            console.log('tsq.registerKeyToUser set keyData', keyData);
            user.registerTechnicalSkillsDataKey(key);
          }
          if (result.data.data.payload.skills.length !== 0) {
            userAlreadyHasSkills.set(true);
          }
          keyData.set(result.data.data.payload);
          console.log('tsq.getKeyData set keyData', keyData);
        }
      }
    );
  }
}

/**
 * @name addSkillToUser
 * @description	takes in a formatted array of skill objects to update the users tsq key with, and their key,
 * 				and updates the users tsq key
 * @param 	{Array<Object>} 	arrayOfSkillInformation 	formatted array of objects containing at least a 'name' parameter
 * @param 	{String} 			userKey 					users key
 * @returns {*} 				Returns a console log with either the result or the error if there is an error
 */
async function addSkillsToUser(arrayOfSkillInformation, userKey,  callback) {
  await arrayOfSkillInformation.forEach(async skillEntry => {
    let existsAlready = await checkUserForSkill(skillEntry.id, userKey); // returns true/false
    if (!existsAlready) {
      Meteor.call(
        'tsq.addSkillToUser',
        arrayOfSkillInformation,
        userKey,
        (error, result) => {
          if (error) {
            console.log('METEOR CALL ERROR: ', error);
          } else {
          }
        }
      );
    }
  });
  callback();
}

/**
 * @name addSkillToDb
 * @description 			add a skill into the microservice db
 * @param {String} skill 	name of the skill to add
 * @returns void
 */
function addSkillToDb(skill) {
  // check for empty string
  if (skill.length <= 0) {
    return;
  }
  // run meteor call to tsq api
  Meteor.call('tsq.addSkill', skill.toUpperCase().trim(), (error, result) => {
    if (error) {
      console.log('METEOR CALL ERROR: ', error);
    } else {
      console.log('METEOR CALL RESULT: ', result);
    }
  });
}

function getTheData() {
  let theData = [];
    if(updatedSkills.get()) {
      theData = updatedSkills.get().skills;
    } else {
      theData = keyData.get().skills;
    }
    return theData;
}

/**
 * @name checkMasterListForSkill
 * @description takes in a string that represents the name of a skill and checks the tsq db for existence of this skill
 * 				if the skill exists, it adds the skill to the queue of skills to update for the user, else it adds the
 * 				skill to the no-match list for the no-match alert
 * @param {String} skill 	string describing the name of a skill.  (API Search is case-sensitive)
 */
function checkMasterListForSkill(skill) {
  // check for empty string
  if (skill.length <= 0) {
    return;
  }

  // Meteor method to test api
  Meteor.call('tsq.skillLookup', skill, (error, response) => {
    if (error) {
      console.log('no match found in skill db, adding to db', skill);
      buildUserSkillObject(skill);
      if (userAlreadyHasSkills.get() === true) {
        addSkillToDb(skill);
      } else {
        userAlreadyHasSkills.set(true);
      }
    } else {
      // the skill was found do things here
      console.log(response);
      if (response.statusCode === 200) {
        let skillTags = response.data.data.payload.tags;
        buildUserSkillObject(skill);
        userAlreadyHasSkills.set(true);

        // check the tags for matches?
        if (skillTags !== undefined) {
          skillTags.forEach(tag => checkMasterListForSkill(tag));
        }
      }
    }
  });
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
      onReady: function() {
        console.log('tsq user List subscription ready! ', arguments, this);
        let userId = Meteor.userId();
        user = User.findOne({ _id: userId });
        checkForKeyAndGetData(user);
        getAllSkillsFromDB(allSkillsFromDB);
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
    return keyData.get();
  }
});

//
// PASTE PROFILE TEMP
//

Template.tsq_pasteProfile.helpers({
  hasSkills() {
    let theData = getTheData();
    if(theData.length > 0) {
      return true;
    }
    return false;
  },
  userSkills() {
    console.log("The Key Data: ",keyData.get().skills);
    return getTheData();
  },
  unansweredPercent() {
    let newSkills = [];
    let theData = getTheData();
    theData.forEach((curSkill, index) => {
      if(curSkill.confidenceLevel === 0) {
        newSkills.push(index);
      }
    });
    let newCount = newSkills.length;
    let allCount = theData.length + 2;
    let hasUnfamiliar = theData.find(theSkill => {
      return theSkill.familiar === false;
    });
    if (!hasUnfamiliar && newCount === 0) {
      newCount += 2;
    } else if (!hasUnfamiliar) {
      newCount++;
    }
    console.log("unanswered calc: ",newCount, allCount);
    return (newCount / allCount) * 100;
  },
  answeredPercent() {
    return 100 - Template.tsq_pasteProfile.__helpers.get('unansweredPercent').call();
  },
  onItemAdd() {
    return (value, $item) => {
      let skillEntry = {
        id: value,
        name: $($item)
          .text()
          .substring(0, $($item).text().length - 1),
        familiar: true
      };
      addSkillsToUser([skillEntry], keyData.get().key, updateUserData);
    };
  },
  onItemRemove() {
    return (value, $item) => {
      // create skill entry obj
      let skillEntry = {
        name: value
      };

      // remove the skill from the user
      removeSkillFromUser([skillEntry], keyData.get().key, updateUserData);
    };
  },
  itemSelectHandler() {
    let selections = getSelections(keyData.get().skills);
    let familiarSelections = selections.filter(
      selection => selection.familiar === true
    );
    return familiarSelections;
  },
  itemListHandler() {
    return allSkillsFromDB.get();
  }
});

Template.tsq_pasteProfile.events({
  'click .tsq-enterSkillsContinue': function(event, instance) {
    return;
  },
  'click .tsq-updateAndContinue': function(event, instance) {
    FlowRouter.go(
      '/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + keyData.get().key
    );
    return;
  },
  'click .tsq-cancel': function(event, instance) {
    if(!isUndefined(keyData.curValue.skills) && keyData.curValue.skills.length > 0) {
      alert('In cancel');
      FlowRouter.go(
        '/technicalSkillsQuestionaire/results'
      );
    }
    return;
  }
});
