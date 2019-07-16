import './familiarVsUnfamiliar.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { User } from '/imports/api/users/users.js';
import { callWithPromise } from '/imports/client/callWithPromise';
import { KeyData, SkillsData } from '/imports/client/clientSideDbs';

// /*
// Variables
// */
let unfamiliarInfo = new ReactiveDict()
unfamiliarInfo.set({
  unfamiliars: [],
  count: 0
})


// /*
// Functions
// */

function createTheListToDisplay(unfamiliarList, usersSkillsArray) {
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
  console.log(unfamiliarList)
  return unfamiliarList;
}

function buildUpdateObjects(skill) {
  return { id: skill.id, name: skill.name, familiar: false, };
}

function addSkillsToUser(arrayOfSkillInformation, userKey) {
  Meteor.call(
    'tsq.addSkillToUser',
    arrayOfSkillInformation,
    userKey,
    (error, result) => {
      if (error) {
        console.warn('METEOR CALL ERROR: ', error);
      } else {
        console.info({ result });
      }
    }
  );
}

function getNewUnfamiliarSkillsToAdd (counter, array) {
  let addedSkills = [];
  while (addedSkills.length < (10-counter)) {
    const randomSkill = array[Math.floor(Math.random()*array.length)]
    const ids = addedSkills.map(skill => skill._id)
    if (!ids.includes(randomSkill._id)) {
      addedSkills.push(randomSkill)
    } else {
      continue
    }
  }
  return addedSkills;
}

async function addUnfamiliarSkillsToUser(counter, unfamiliarInfoObject) {
  if (counter < 10) {
    const allSkills = SkillsData.find().fetch();
    const usersSkillsById = KeyData.findOne().skills.map(skill => skill._id);
    const filteredSkills = allSkills.filter(skill => !usersSkillsById.includes(skill._id));
    const skillsToAdd = getNewUnfamiliarSkillsToAdd(counter, filteredSkills)
    
    const usersSkills = KeyData.findOne().skills.map(skill => {  
      const { _id, familiar, confidenceLevel } = skill;
      const { name } = skill.name
      return { id: _id, name, familiar, confidenceLevel }
    });

    const updateArray = skillsToAdd.map(skill => { return { id: skill._id, name: skill.name, familiar: false } })    
    
    unfamiliarInfo.set({
      unfamiliars: [...unfamiliarInfo.get('unfamiliars'), ...updateArray],
      count: 10
    })

    await addSkillsToUser([...usersSkills, ...updateArray], KeyData.findOne({}).key);
  }
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

// /*
// Templates
// */

Template.tsq_familiarVsUnfamiliar.onCreated(function() {
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
          onReady: () =>  {
            (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: this}) : null
          },
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, error: true, arguments, THIS: this}) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this}) : null,
        })
        
      }
      

    });
    
    Template.instance().subscriptionsReady(function () {
      const unfamiliar = KeyData.findOne().skills.filter(skill => skill.familiar === false)
      unfamiliarInfo.set({
        unfamiliars: unfamiliar,
        count: unfamiliar.length
      })
    })

    });
});

Template.tsq_familiarVsUnfamiliar.helpers({
  hasUnfamiliarSkills() {
    let unfamiliarList = unfamiliarInfo.get('count');
    console.log("hasUnfamiliarSkills", unfamiliarList);
    return (unfamiliarList > 0) ? true : false 
  },
  userSkills() {
    return KeyData.findOne({}).skills;
  },
  isFinished() {
    let skills = KeyData.findOne().skills;
    if(skills.length < 1) { return false; }
    if(skills) {
        let hasUnfamiliar = skills.findIndex(element => {
            return element.familiar === true;
        });
        if(hasUnfamiliar > -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
  }, 
  unansweredPercent() {
    const noConfidenceList = KeyData.findOne({}).skills.filter(skill => skill.confidenceLevel === 0)
    const unfamiliarList = KeyData.findOne({}).skills.filter(skill => skill.familiar === false)
    
    let newCount = noConfidenceList.length;
    let allCount = KeyData.findOne({}).skills.length + 2;
    
    if (unfamiliarList.length === 0 && newCount === 0) {
      newCount += 2;
    } else if (unfamiliarList.length === 0) {
      newCount++;
    }
    
    return (newCount / allCount) * 100;
  },
  answeredPercent() {
    return 100 - Template.tsq_familiarVsUnfamiliar.__helpers.get('unansweredPercent').call();
  },
  checkForUnfamiliarSkills() {
    if (unfamiliarInfo.get('count') < 10) {
      const unfamiliarList = KeyData.findOne({}).skills.filter(skill => skill.familiar === false);
      unfamiliarInfo.set('count', unfamiliarList.length); 
      if (unfamiliarInfo.get('count') < 10) {
        addUnfamiliarSkillsToUser(unfamiliarInfo.get('count'), unfamiliarInfo);
        createTheListToDisplay(unfamiliarList, KeyData.findOne({}).skills);
        unfamiliarInfo.set('count', 10);
      }
    }
  },
  unfamiliarList() {
    return  KeyData.findOne({}).skills.filter(skill => skill.familiar === false);
  },
  createId(name) {
    const n = name.hash.name;
    return n.replace(/\s+/g, '-').toLowerCase();
  }
});

Template.tsq_familiarVsUnfamiliar.events({
  'click .unfamiliar-item-checkbox': function(event, instance) {
    const skillId = $(event.target).data('id');
    const familiarValue = $(event.target).is(':checked');
    const userKey = KeyData.findOne({}).key;
    updateSkillFamiliarSetting(userKey, skillId, familiarValue);
  },
  'click #continue': function(event, instance) {
    FlowRouter.go(
      '/technicalSkillsQuestionaire/confidenceQuestionaire/' + KeyData.findOne({}).key + '?p=1'
    );
  },
  'click #previous': function(event, instance) {
    FlowRouter.go(
      '/technicalSkillsQuestionaire/userLanguageList'
    );
  }
});
