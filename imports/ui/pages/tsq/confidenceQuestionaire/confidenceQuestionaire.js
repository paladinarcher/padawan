import './confidenceQuestionaire.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { User } from '/imports/api/users/users.js';
import { KeyData, SkillsData } from '/imports/client/clientSideDbs';

const TSQ = require("/imports/api/tsq/tsq.js");
const userDataRetrieved = new ReactiveVar(KeyData.findOne());
const answeres = new ReactiveVar([]);
const userData = new ReactiveDict({
  page: 1,
  finished: false,
});
const perPage = 10;

const newQuestionsOnly = () => (FlowRouter.current().queryParams.new) ? true : false 
/**
 * Templates
 */

// confidenceClick is used to update the values in the header context menu
function confidenceClick() {
  if (Session.get('confidenceClick') !== true) {
    Session.set('confidenceClick', true);
  } else {
    Session.set('confidenceClick', false);
  }
}

Template.tsq_confidenceQuestionaire.onCreated(function() {
  let foo = Session.get('confidenceClick');
  this.autorun(() => {
    this.userId = Meteor.userId();
    this.key = FlowRouter.getParam('key');
    this.userDataSub = this.subscribe('tsqUserList', {
      onReady: () => {
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
    
        this.keyDataSub = this.subscribe('tsq.keyData', User.findOne({_id: this.userId}).MyProfile.technicalSkillsData, {
          onReady: () =>  {
            (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: true, arguments, THIS: this}) : null
          },
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, error: true, arguments, THIS: this}) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'tsq.keyData', readyStatus: false, arguments, THIS: this}) : null,
        })
      }
    })
    let pg = FlowRouter.getQueryParam('p');
    (pg) ? userData.set('page', pg) : //do nothing
    this.subscriptionsReady()

    if(Template.instance().subscriptionsReady()) {
      let kd = KeyData.findOne();
      userDataRetrieved.set(kd);
      answeres.set(TSQ.totalSkills(kd));

      console.log("HERE IS THE USER DATA", userDataRetrieved.get());
    }
  });
});

Template.tsq_confidenceQuestionaire.helpers({
  userDataRetrieved() {
    return userDataRetrieved.get();
  },
  userAllSkills: () =>  {
    let skills = answeres.get();
    return (skills) ? skills : []
  },
  userSkills: () =>  {
    let skills = answeres.get();
    let page = userData.get('page');
    let start = (perPage * page) - perPage;
    let end = perPage * page;
    return skills.slice(start, end);
  },
  unansweredPercent: () => {
    let kd = userDataRetrieved.get();
    return TSQ.unansweredPercent(kd);
  },
  answeredPercent: () => 100 - Template.tsq_confidenceQuestionaire.__helpers.get('unansweredPercent').call(),
  questionAnswered() {
    const skills = answeres.get();
    let pg = userData.get('page');
    let start = (perPage*pg)-perPage;
    let end = perPage*pg;
    //console.log("Question Answered",start,end);
    let answered = true;
    for(i=start; i < end; i++) {
      if(skills[i] !== undefined) {
        if(skills[i].confidenceLevel === 0) {
          console.log('Skill...',skills[i].confidenceLevel);
          answered = false;
        }
      }
    }

    return answered; 
  },
  getLanguageFromList: () => {
    let kd = userDataRetrieved.get();
    let zeroSkills = TSQ.zeroConfidenceSkills(answeres.get());
    let totSkills = answeres.get();
    return (newQuestionsOnly()) ? zeroSkills[userData.get('index')].name.name : totSkills[userData.get('index')].name.name;
  },
  checkForRadioSelected: () => userData.get('selected'),
  allAnswered() {
    let kd = userDataRetrieved.get();
    let unanswered = TSQ.zeroConfidenceSkills(answeres.get()).length;
    let length = answeres.get().length;
    let currentPage = userData.get('page');

    console.log("IS THE PAGE RIGHT", currentPage >= length / perPage);
    if(currentPage >= length / perPage && unanswered < 1) {
      return true;
    }
    return false;
  },
  realIndex(i) {
    let pg = userData.get('page');
    let start = (perPage*pg)-perPage;
    return i+start;
  },
  itemsMissingConfidenceInfo: () => (TSQ.zeroConfidenceSkills(userDataRetrieved.get()).length > 0) 
    ? true 
    : false,
  equals: (a, b) => {
    let val = (a === b) ? true : false;
    return val;
  }
});

Template.tsq_confidenceQuestionaire.events({
  'click .select-confidence'(event, instance) {
    event.preventDefault();
    const $button = $(event.target);
    const confidenceValue = $button.data('value');
    const curSkills = answeres.get();
    curSkills[$button.data('index')].confidenceLevel = confidenceValue;
    console.log("NEW CONFIDENCE", $button.data('index'))
    answeres.set(curSkills);
    console.log("NEW ANSWERS", answeres.get())

    $button.removeClass('btn-secondary');
    $button.addClass('btn-success');
    $button.siblings('button').removeClass('btn-success');
    $button.siblings('button').addClass('btn-secondary');
    confidenceClick();
  },
  'click .nextLanguage'(event, instance) {
    event.preventDefault();
    let kd = userDataRetrieved.get();
    let currentPage = userData.get('page');
    const skillsLength = answeres.get().length;
    
    confidenceClick();
    TSQ.updateAllConfidenceLevel(answeres.get(), kd.key, function() {
      if (currentPage < skillsLength / perPage) {
        currentPage++;
        userData.set('page', currentPage);
        FlowRouter.go('/technicalSkillsQuestionaire/confidenceQuestionaire/' + kd.key + '?p=' + userData.get('page'));
      }
    });
  },
  'click .previousLanguage'(event, instance) {
    event.preventDefault();
    let kd = userDataRetrieved.get();
    let index = userData.get('page');
    let previous = index - 1;
    if(previous < 1) {
      FlowRouter.go('/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + kd.key );
      return;
    } else {
      userData.set('page', index-1);
      FlowRouter.go('/technicalSkillsQuestionaire/confidenceQuestionaire/' + kd.key + '?p=' + userData.get('page'));
    }
    confidenceClick();
  },
  'click #showResults': function(event, instance) {
    event.preventDefault();
    let kd = userDataRetrieved.get();
    
    confidenceClick();
    TSQ.updateAllConfidenceLevel(answeres.get(), kd.key, function() {
      FlowRouter.go('/technicalSkillsQuestionaire/results');
    });
  },
});
