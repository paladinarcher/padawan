import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { User } from '/imports/api/users/users.js';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';

const TSQ = require("/imports/api/tsq/tsq.js");
let user;

Template.tsq_char_report.onCreated(function () {
  Session.set("otherUser", undefined);
  this.autorun(() => {
    // otherUser = undefined;
    if (Template.tsq_char_report.__helpers.get('urlIdMatch').call()) {
      Meteor.call(
        'tsq.getOtherUserKeyData',
        FlowRouter.getParam('userId'),
        async (error, result) => {
          if (error) {
            console.log('tsq.getOtherUserKeyData Error: ', error);
          } else {
            console.log('tsq.getOtherUserKeyData Result: ', result);
            // console.log('payload: ', result.data.data.payload);
            let kd = result.data.data.payload;
            Session.set("otherUser", kd)
            // console.log('kd: ', kd);
            if (isUndefined(kd) || isUndefined(kd.skills) || kd.skills.length < 1) {
              // alert('false');
              return false;
            } else {
              // alert('true');
              return true;
            }
          }
        }
      );
    }
    this.subscription1 = this.subscribe('tsqUserList', this.userId, {
      onStop: function () {
        console.log('tsq user List subscription stopped! ', arguments, this);
      },
      onReady: async () => {
        console.log({ subName: 'tsqUserList', readyStatus: true, arguments, self: this });
        let userId = Meteor.userId();
        user = User.findOne({ _id: userId });
        // let userId = 'eLPokHT7zRJE3dEhg';
        // user = User.findOne({ _id: userId });

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

        this.keyDataSub = this.subscribe('tsq.keyData', User.findOne({ _id: userId }).MyProfile.technicalSkillsData, {
          onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: this }) : null,
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this }) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this }) : null,
        });
      }
    });
  });
});

Template.tsq_char_report.helpers({
  otherUndefined() {
    if (Session.get("otherUser") == undefined) {
      return true;
    } else {
      return false;
    }
  },
  skillList() {
    return TSQ.totalSkillsSorted(Session.get('otherUser'));
  },
  returnConfidenceStatement(level) {
    let opt = TSQ.confidenceRubric()[level.hash.level.toString()];
    if (typeof opt != "undefined") { return opt.prompt; }
    return "";
  },
  returnConfidenceClass(level) {
    let opt = TSQ.confidenceRubric()[level.hash.level.toString()];
    if (typeof opt != "undefined") { return opt.cssClass; }
    return "";
  },
  familiarCount() {
    familiar = 0;
    TSQ.totalSkills(Session.get('otherUser')).forEach((value, index) => {
      // console.log("value, index: ", value, index);
      if (value.familiar === true) {
        familiar += 1;
      }
    });
    return familiar;
  },
  unfamiliarCount() {
    let kd = Session.get('otherUser');
    let un = TSQ.unfamiliarSkills(kd);
    console.log("unfamiliars", un);
    return un.length
  },
  familiarAverage() {
    familiar = 0;
    confidenceSum = 0
    TSQ.totalSkills(Session.get('otherUser')).forEach((value, index) => {
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
  familiarAverageRounded() {
    return Math.round(Template.tsq_results.__helpers.get('familiarAverage').call());
  },
  unfamiliarAverage() {
    unfamiliar = 0;
    confidenceSum = 0
    TSQ.totalSkills(Session.get('otherUser')).forEach((value, index) => {
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
  },
  unfamiliarAverageRounded() {
    return Math.round(Template.tsq_results.__helpers.get('unfamiliarAverage').call());
  },
  isFinished() {
    let skills = TSQ.totalSkills(Session.get('otherUser'));
    if (skills.length < 1) { return false; }
    if (skills) {
      let hasUnfinished = skills.findIndex(element => {
        return element.confidenceLevel === 0;
      });
      if (hasUnfinished > -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  urlUserId() {
    let retVal = FlowRouter.getParam('userId').trim().replace(/^\s+|\s+$/g, '');
    return retVal;
  },
  urlIdMatch() {
    // console.log('in urlIdMatch');
    let urlId = FlowRouter.getParam('userId');
    // console.log('urlId: ', urlId);
    let myId = Meteor.userId();
    // console.log('myId: ', myId);
    let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
    // console.log('urlIdMatch isAdmin: ', isAdmin);
    if ([myId, "", undefined].includes(urlId) || !isAdmin) {
      return false;
    } else {
      return true
    }
  },
  tsqStarted() {
    let kd = KeyData.findOne();
    if (Template.tsq_char_report.__helpers.get('urlIdMatch').call()) {
      let otherUser = Session.get('otherUser');
      if (otherUser !== undefined) {
        kd = otherUser;
      }
    }
    if (isUndefined(kd) || isUndefined(kd.skills) || kd.skills.length < 1) {
      return false;
    } else {
      return true;
    }
  }
});

Template.tsq_char_report.events({
  'click .btn.startTsq'(events, instance) {
    event.preventDefault();
    FlowRouter.go('/technicalSkillsQuestionaire/userLanguageList');
  }
});
