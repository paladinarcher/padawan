import './results.html'; 
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { callWithPromise } from '/imports/client/callWithPromise';
import { isUndefined } from 'util';

const perPage = 10;

let user;
let keyInfo = new ReactiveVar();
let userAlreadyHasSkills = new ReactiveVar(false); // boolean value indicating whether or not the user already has skill data in their key
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs
let confidenceStatments = {
    '0': 'No confidence information',
    '1': 'a month or more',
    '2': 'a week or two',
    '3': 'a couple of days',
    '4': '8 - 10 hours',
    '5': 'a couple of hours',
    '6': 'I could architect and give detailed technical leadership to a team today'
}

// already has skills helper fn
function alreadyHasSkills() {
    return userAlreadyHasSkills.get();
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

async function checkForKeyAndGetData(user) {
    let result;
    let key;
    if (user.MyProfile.technicalSkillsData === undefined) {
        console.log("NO TSQ INFO for user");
      result = await registerUser();
      key = result.data.data.key;
      keyInfo.set(result.data.data);
      //console.log('tsq.registerKeyToUser set keyData', keyInfo);
      user.registerTechnicalSkillsDataKey(key);
    } else {
        console.log("THERE IS TSQ INFO for user");
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
            if (result.data.data.payload === null || result.data.data.payload === undefined) {
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
          console.log("key info", keyInfo.get());
          if( isUndefined(keyInfo.get().skills) || keyInfo.get().skills.length < 1 ) {
            //console.log("Key Info", keyInfo.get());
            FlowRouter.go(
                '/technicalSkillsQuestionaire/userLanguageList'
            );
            return; 
          }
        }
      );
    }
}
async function registerUser() {
    return await callWithPromise('tsq.registerKeyToUser');
}
  
async function lookupUserKey() {
    return await callWithPromise('tsq.getKeyData');
}

Template.tsq_results.onCreated(function(){
    this.autorun(async () => {
        if(FlowRouter.getParam('key')) {
            console.log("We are using key param");
            const getUserKey = await callWithPromise('tsq.getKeyData', FlowRouter.getParam('key'));
            let info = getUserKey.data.data.payload;
            keyInfo.set(info);
        } else {
            console.log("We are not using key param");
            this.subscription1 = await this.subscribe('tsqUserList', this.userId, {
                onStop: function() {
                 console.log('tsq user List subscription stopped! ', arguments, this);
                },
                onReady: function() {
                 console.log('tsq user List subscription ready! ', arguments, this);
                  let userId = Meteor.userId();
                  user = User.findOne({ _id: userId });
                  console.log("User collection", user);
                  checkForKeyAndGetData(user);
                  //console.log("The Key is: "+keyInfo.get().key);
                  getAllSkillsFromDB(allSkillsFromDB);
                }
            });
        }
        
    })
})

Template.tsq_results.helpers({
    skillList() {
        return keyInfo.get().skills
    },
    isFinished() {
        let skills = keyInfo.get().skills;
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
    returnConfidenceStatement(level) {
        return confidenceStatments[level.hash.level.toString()]
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
        if(keyInfo.get().skills.length < 1) {
            return 2;
        }
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.confidenceLevel === 0) {
                unfinished += 1;
            }
        });
        return unfinished;
    },
    unfinishedPercent() {
        let tot = Template.tsq_results.__helpers.get('totalCount').call() + 2;
        let ufc = Template.tsq_results.__helpers.get('unfinishedCount').call();
        if(!Template.tsq_results.__helpers.get('unfamiliarCount')) {
            ufc++;
        }
        return (ufc / tot) * 100;
    },
    finishedPercent() {
        let unfinishedPercent = Template.tsq_results.__helpers.get('unfinishedPercent').call();
        return 100 - unfinishedPercent;
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
    familiarAverage() {
        familiar = 0;
        confidenceSum = 0
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.familiar === true) {
                familiar += 1;
                confidenceSum += value.confidenceLevel;
            }
        });
        if (familiar > 0) {
            let ave = confidenceSum / familiar;
            if (ave % 1 !== 0) {
                return ave.toFixed(2);
            } else {
                return ave;
            }
        } else {
            return "No Familiar Technology";
        }
    },
    unfamiliarAverage() {
        unfamiliar = 0;
        confidenceSum = 0
        keyInfo.get().skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.familiar === false) {
                unfamiliar += 1;
                confidenceSum += value.confidenceLevel;
            }
        });
        if (unfamiliar > 0) {
            let ave = confidenceSum / unfamiliar
            if (ave % 1 !== 0) {
                return ave.toFixed(2);
            } else {
                return ave;
            }
        } else {
            return 0
        }
    }
})

Template.tsq_results.events({
    'click #restart': function(event, instance) {
        FlowRouter.go(
            '/technicalSkillsQuestionaire/userLanguageList'
        );
        return;
    },
    'click #continue': function(event, instance) {
        let unfamiliarCount = Template.tsq_results.__helpers.get('unfamiliarCount').call();
        let skills = keyInfo.get().skills;
        let firstUnfamiliar = skills.findIndex(skill => {
            return skill.confidenceLevel === 0;
        })
        if (firstUnfamiliar === -1) {
            firstUnfamiliar = 0;
        }
        let p = Math.ceil((firstUnfamiliar + 1) / perPage);
        if( unfamiliarCount ) {
            FlowRouter.go(
                '/technicalSkillsQuestionaire/confidenceQuestionaire/' + keyInfo.get().key + '?new=1&p='+p
            );
        } else {
            FlowRouter.go(
                '/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + keyInfo.get().key
            );
        }
      return;
    }
  });