import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { User } from '/imports/api/users/users.js';

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
      //console.log('tsq.registerKeyToUser set keyData', keyInfo);
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
            //console.log('tsq.registerKeyToUser set keyData', keyInfo);
            user.registerTechnicalSkillsDataKey(key);
          } else {
           // console.log('tsq.getKeyData result', result);
            if (result.data.data.payload === null) {
              result = await registerUser();
              key = result.data.data.key;
              keyInfo.set(result.data.data);
              //console.log('tsq.registerKeyToUser set keyData', keyInfo);
              user.registerTechnicalSkillsDataKey(key);
            }
            if (result.data.data.payload.skills.length !== 0) {
              userAlreadyHasSkills.set(true);
            }
            keyInfo.set(result.data.data.payload);
            //console.log('tsq.getKeyData set keyInfo', keyInfo);
          }
          //session variable for reloading page data
          if (Session.get('reload') == true) {
            Session.set('reload', false);
          } else {
            Session.set('reload', true);
          }
        }
      );
    }
}

Template.tsq_char_report.onCreated(function() {
    Session.set('reload', false);
    Session.set('reload', true);
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
});

Template.tsq_char_report.helpers({
    tsqStarted() {
        Session.get('reload');
        if( isUndefined(keyInfo.get().skills) || keyInfo.get().skills.length < 1 ) {
            return false; 
        } else {
            return true;
        }
    }
});

Template.tsq_char_report.events({
    'click .btn.startTsq' (events, instance) {
        event.preventDefault();
        FlowRouter.go('/technicalSkillsQuestionaire/userLanguageList');
    }
});