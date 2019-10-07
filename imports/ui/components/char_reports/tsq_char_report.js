import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { User } from '/imports/api/users/users.js';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';

const TSQ = require("/imports/api/tsq/tsq.js");
let user;

Template.tsq_char_report.onCreated(function() {
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
            await TSQ.registerUser(user);
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

Template.tsq_char_report.helpers({
    tsqStarted() {
        let kd = KeyData.findOne();
        if(isUndefined(kd) || isUndefined(kd.skills) || kd.skills.length < 1 ) {
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
