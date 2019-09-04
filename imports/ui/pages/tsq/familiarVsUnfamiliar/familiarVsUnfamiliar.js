import './familiarVsUnfamiliar.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { User } from '/imports/api/users/users.js';
import { callWithPromise } from '/imports/client/callWithPromise';
import { KeyData, SkillsData } from '/imports/client/clientSideDbs';
import TSQ_DATA from '/imports/api/tsq/TSQData';

// /*
// Variables
// */
const unfamiliarCount = 10;
const TSQ = require("/imports/api/tsq/tsq.js");
const userDataRetrieved = new ReactiveVar(KeyData.findOne());
let familiarSkills = new ReactiveVar([]);
let unfamiliarInfo = new ReactiveDict();
unfamiliarInfo.set({
  unfamiliars: [],
  count: 0
});


// /*
// Functions
// */


function confidenceClick() {
  if (Session.get('confidenceClick') !== true) {
    Session.set('confidenceClick', true);
  } else {
    Session.set('confidenceClick', false);
  }
}

function getNewUnfamiliarSkillsToAdd () {
  let addedSkills = [];
  let allUserSkills = [];

  const usersSkills = userDataRetrieved.get().skills.map(skill => {
    const { _id, familiar, confidenceLevel } = skill;
    const { name } = skill.name
    return { id: _id, name, familiar, confidenceLevel }
  });
  let userUnfam = [];
  let userFam = [];
  if(usersSkills) {
    usersSkills.forEach(skill => { 
      if (skill.familiar === false) {
        userUnfam.push(skill);
      } else {
        userFam.push(skill);
      }
    });
    familiarSkills.set(userFam);
  }
  const counter = userUnfam.length;
  const allSkills = SkillsData.find().fetch();
  const usersSkillsById = userDataRetrieved.get().skills.map(skill => skill._id);
  const array = allSkills.filter(skill => !usersSkillsById.includes(skill._id));
  while (addedSkills.length < (unfamiliarCount-counter)) {
    const randomSkill = array[Math.floor(Math.random()*array.length)]
    const ids = addedSkills.map(skill => skill._id)
    if (!ids.includes(randomSkill._id)) {
      addedSkills.push(randomSkill)
    } else {
      continue
    }
  }
  const updateArray = addedSkills.map(skill => { return { id: skill._id, name: skill.name, familiar: false } });
  if(counter > 0) {
    allUserSkills = userUnfam.concat(updateArray);
  } else {
    allUserSkills = updateArray;
  }

  unfamiliarInfo.set({
    unfamiliars: allUserSkills,
    count: allUserSkills.length
  });

  return allUserSkills;
}

// /*
// Templates
// */

Template.tsq_familiarVsUnfamiliar.onCreated(function() {
  let foo = Session.get('confidenceClick');
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

    if(Template.instance().subscriptionsReady()) {
      let kd = KeyData.findOne();
      userDataRetrieved.set(kd);
      const unfamiliar = getNewUnfamiliarSkillsToAdd();
      unfamiliarInfo.set({
        unfamiliars: unfamiliar,
        count: unfamiliar.length
      });
    }

    });
});

Template.tsq_familiarVsUnfamiliar.helpers({
  hasUnfamiliarSkills() {
    let unfamiliarList = unfamiliarInfo.get('count');
    return (unfamiliarList >= 10) ? true : false
  },
  checkForUnfamiliarSkills() {
    if (unfamiliarInfo.get('count') < 10) {
      
      getNewUnfamiliarSkillsToAdd();

    }
  },
  userSkills() {
    return TSQ.totalSkills(userDataRetrieved.get());
  },
  isFinished() {
    let skills = userDataRetrieved.get().skills;
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
    let kd = userDataRetrieved.get();
    return TSQ.unansweredPercent(kd);
  },
  answeredPercent() {
    return 100 - Template.tsq_familiarVsUnfamiliar.__helpers.get('unansweredPercent').call();
  },
  unfamiliarList() {
    return  unfamiliarInfo.get('unfamiliars');
  },
  createId(name) {
    const n = name.hash.name;
    return n.replace(/\s+/g, '-').toLowerCase();
  }
});

Template.tsq_familiarVsUnfamiliar.events({
  'click .unfamiliar-item-checkbox': function(event, instance) {
    confidenceClick();
  },
  'click #continue': function(event, instance) {
    confidenceClick();
    let prevItems = familiarSkills.get();
    let items = [];
    $(".unfamiliar-item-checkbox").each(function() {
      let cur = $(this);
      console.log("CURRENT ITEM", cur.data('confidence'));
      let item = {
        id: cur.data('id'),
        familiar: cur.is(':checked'),
        confidenceLevel: cur.data('confidence'),
        name: cur.data('name')
      };
      items.push(item);
    });

    let key = userDataRetrieved.get().key;
    let allItems = prevItems.concat(items);
    console.log("ALL ITEMS", allItems);

    TSQ.addSkillsToUser(allItems, key, function() {
      let unfam =  allItems.filter(skill => { return skill.familiar === false });
      unfamiliarInfo.set({
        unfamiliars: unfam,
        count: unfam.length
      });
      FlowRouter.go(
        '/technicalSkillsQuestionaire/confidenceQuestionaire/' + key + '?p=1'
      );
    });
  },
  'click #previous': function(event, instance) {
    confidenceClick();
    var lvl = 0;
    FlowRouter.go(`/technicalSkillsQuestionaire/userLanguageList?h=${lvl}`);
  }
});
