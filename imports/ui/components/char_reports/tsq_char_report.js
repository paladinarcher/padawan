import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { User } from '/imports/api/users/users.js';
import { KeyData, SkillsData, HelpText } from '/imports/client/clientSideDbs';

const TSQ = require("/imports/api/tsq/tsq.js");
let user;

Template.tsq_char_report.onCreated(function () {
  this.autorun(() => {
    // otherUser = undefined;
    if (Template.tsq_char_report.__helpers.get('urlIdMatch').call()) {
      Meteor.call(
        'tsq.getOtherUserKeyData',
        // 'eLPokHT7zRJE3dEhg',
        FlowRouter.getParam('userId'),
        // async (error, result) => {
        (error, result) => {
          if (error) {
            console.log('tsq.getOtherUserKeyData Error: ', error);
          } else {
            console.log('tsq.getOtherUserKeyData Result: ', result);
            // console.log('payload: ', result.data.data.payload);
            let kd = otherUser = result.data.data.payload;
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
  urlUserId() {
    return FlowRouter.getParam('userId');
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
    // console.log('kd: ', kd);
    // console.log('KeyData: ', KeyData);
    // console.log('keydata find: ', KeyData.findOne({key: "T3fpMg2cBe433Kmi"}));

    // find the technicalSkillsData (key in MyProfile) of the user then find the tsq data. 
    // make sure only admin can do it. Probably make a server side method instead of a bunch of Meteor.Call methods.

    // if ()
    // console.log('urlIdMatch(): ', Template.tsq_char_report.__helpers.get('urlIdMatch').call());
    if (Template.tsq_char_report.__helpers.get('urlIdMatch').call()) {
      // alert (Session.get('otherUser'));
      console.log('otherUser: ', Session.get('otherUser'));
      return true;
    } else {
      if (isUndefined(kd) || isUndefined(kd.skills) || kd.skills.length < 1) {
        return false;
      } else {
        return true;
      }
    }
  }
});

Template.tsq_char_report.events({
  'click .btn.startTsq'(events, instance) {
    event.preventDefault();
    FlowRouter.go('/technicalSkillsQuestionaire/userLanguageList');
  }
});
