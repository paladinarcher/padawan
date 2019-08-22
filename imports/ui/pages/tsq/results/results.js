import './results.html';
import { Template } from 'meteor/templating';
import { User } from '/imports/api/users/users.js';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';
import TSQ_DATA from '/imports/api/tsq/TSQData';

const perPage = 10;
const TSQ = require("/imports/api/tsq/tsq.js");

let user;
let allSkillsFromDB = new ReactiveVar(); // all the skills from the skill database - array of objs

function confidenceClick() {
  if (Session.get('confidenceClick') !== true) {
    Session.set('confidenceClick', true);
  } else {
    Session.set('confidenceClick', false);
  }
}

async function getAllSkillsFromDB(list) {
    list.set(SkillsData.find().fetch());
    console.log('All Skills List: ', list);
    return list;
}

Template.tsq_results.onCreated(function(){
    this.autorun(async () => {
        console.log("We are not using key param");
        let cur = this;
        cur.subscription1 = await cur.subscribe('tsqUserList', cur.userId, {
            onStop: function() {
                console.log('tsq user List subscription stopped! ', arguments, cur);
            },
            onReady: async function() {
                console.log('tsq user List subscription ready! ', arguments, cur);
                let userId;
                if(FlowRouter.getParam('key')) {
                    console.log("We are using key param");
                    userId = FlowRouter.getParam('key');
                } else {
                    console.log("We are not using key param");
                    userId = Meteor.userId();
                }
                user = User.findOne({ _id: userId });
                if (user.MyProfile.technicalSkillsData === undefined || !user.MyProfile.technicalSkillsData) {
                    await TSQ.registerUser(user);
                }
        
                cur.tsqSkillSub = cur.subscribe('tsq.allSkills', {
                onReady: () => {
                    // Load in the TSQ Test DATA
                    if (SkillsData.find().fetch().length < 1) {
                    for (skills of TSQ_DATA) {
                        let key = Object.keys(skills);
                        for (k of key) {
                        for (skill of skills[key]) {
                            Meteor.call('tsq.addSkill', skill.name);
                        }
                        }
                    }
                    }
                }
                });
        
                cur.keyDataSub = cur.subscribe('tsq.keyData', User.findOne({_id: userId}).MyProfile.technicalSkillsData, {
                onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: cur}) : null,
                onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: cur}) : null,
                onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: cur}) : null,
                });
                //console.log("The Key is: "+keyInfo.get().key);
                getAllSkillsFromDB(allSkillsFromDB);
            }
        });
    });
});

Template.tsq_results.helpers({
    skillList() {
        return TSQ.totalSkills(KeyData.findOne());
    },
    isFinished() {
        let skills = TSQ.totalSkills(KeyData.findOne());
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
        return TSQ.confidenceRubric()[level.hash.level.toString()].prompt;
    },
    totalCount() {
        all = 0;
        TSQ.totalSkills(KeyData.findOne()).forEach((value, index) => {
            all++;
        });
        return all;
    },
    unfinishedCount() {
        unfinished = 0;
        let kd = KeyData.findOne();
        let skills = TSQ.totalSkills(kd);
        if(skills.length < 1) {
            return 2;
        }
        skills.forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.confidenceLevel === 0) {
                unfinished += 1;
            }
        });
        return unfinished;
    },
    unfinishedPercent() {
        let kd = KeyData.findOne();
        return TSQ.unansweredPercent(kd);
    },
    finishedPercent() {
        let unfinishedPercent = Template.tsq_results.__helpers.get('unfinishedPercent').call();
        return 100 - unfinishedPercent;
    },
    familiarCount() {
        familiar = 0;
        TSQ.totalSkills(KeyData.findOne()).forEach((value, index) => {
            // console.log("value, index: ", value, index);
            if (value.familiar === true) {
                familiar += 1;
            }
        });
        return familiar;
    },
    unfamiliarCount() {
        let kd = KeyData.findOne();
        let un = TSQ.unfamiliarSkills(kd);
        console.log("unfamiliars", un);
        return un.length
    },
    familiarAverage() {
        familiar = 0;
        confidenceSum = 0
        TSQ.totalSkills(KeyData.findOne()).forEach((value, index) => {
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
        TSQ.totalSkills(KeyData.findOne()).forEach((value, index) => {
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
        confidenceClick();
        FlowRouter.go(
            '/technicalSkillsQuestionaire/userLanguageList'
        );
        return;
    },
    'click #continue': function(event, instance) {
        let kd = KeyData.findOne();
        let unfamiliarCount = Template.tsq_results.__helpers.get('unfamiliarCount').call();
        let skills = TSQ.totalSkills(kd);
        let firstUnfamiliar = skills.findIndex(skill => {
            return skill.confidenceLevel === 0;
        })
        if (firstUnfamiliar === -1) {
            firstUnfamiliar = 0;
        }
        let p = Math.ceil((firstUnfamiliar + 1) / perPage);
        confidenceClick();
        if( unfamiliarCount ) {
            FlowRouter.go(
                '/technicalSkillsQuestionaire/confidenceQuestionaire/' + kd.key + '?new=1&p='+p
            );
        } else {
            FlowRouter.go(
                '/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + kd.key
            );
        }
      return;
    }
  });
