import './confidenceQuestionaire.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { User } from '/imports/api/users/users.js';
import { KeyData } from '/imports/client/clientSideDbs';
import { callWithPromise } from '/imports/client/callWithPromise';

let userData = new ReactiveDict({
  page: 1,
  finished: false,
});
const perPage = 10;

const zeroConfidenceSkills = () => (KeyData.findOne({})) ? KeyData.findOne({}).skills.filter(skill => skill.confidenceLevel === 0) : [] 
const totalSkills = () => (KeyData.findOne({})) ? KeyData.findOne({}).skills : []
const updateConfidenceLevel = async (skill, confidenceLevel, key) => callWithPromise('tsq.updateConfidenceLevel', skill._id, confidenceLevel, key);
const newQuestionsOnly = () => (FlowRouter.current().queryParams.new) ? true : false 

console.log("Total Skills", totalSkills());
/**
 * Templates
 */
Template.tsq_confidenceQuestionaire.onCreated(function() {
  this.autorun(() => {
    this.userId = Meteor.userId();
    this.key = FlowRouter.getParam('key');
    this.userDataSub = this.subscribe('tsqUserList', {
      onReady: () => this.tsqKeySub = this.subscribe('tsq.keyData', User.findOne({ _id: this.userId }).MyProfile.technicalSkillsData)
    })
    console.log("Total Skills", totalSkills())
    let pg = FlowRouter.getQueryParam('p');
    (pg) ? userData.set('page', pg) : //do nothing
    this.subscriptionsReady()
  });
});

Template.tsq_confidenceQuestionaire.helpers({
  userAllSkills: () =>  {
    let skills = totalSkills();
    return (skills) ? skills : []
  },
  userSkills: () =>  {
    let skills = totalSkills();
    let page = userData.get('page');
    let start = (perPage * page) - perPage;
    let end = perPage * page;
    return skills.slice(start, end);
  },
  unansweredPercent: () => (zeroConfidenceSkills().length === 0) 
    ? 0  
    : (zeroConfidenceSkills().length / (totalSkills().length + 2)) * 100,
  answeredPercent: () => 100 - Template.tsq_confidenceQuestionaire.__helpers.get('unansweredPercent').call(),
  questionAnswered() {
    const skills = totalSkills();

    return ( skills[perPage-1].confidenceLevel > 0 ) ? true : false 
  },
  getLanguageFromList: () => (newQuestionsOnly()) 
    ? zeroConfidenceSkills()[userData.get('index')].name.name
    : totalSkills()[userData.get('index')].name.name,
  checkForRadioSelected: () => userData.get('selected'),
  allAnswered() {
    let unanswered = zeroConfidenceSkills().length;
    let length = totalSkills().length;
    let currentPage = userData.get('page');

    if(currentPage >= length / perPage && unanswered < 1) {
      return true;
    }
    return false;

    //const currentIndex = userData.get('index');
    //const radioCheck = userData.get('selected');
    
    //const skillsLength = (newQuestionsOnly()) 
    //  ? zeroConfidenceSkills().length
    //  : totalSkills().length
      
    return (currentIndex === skillsLength - 1 && radioCheck) 
      ? true 
      : false 
  },
  itemsMissingConfidenceInfo: () => (zeroConfidenceSkills().length > 0) 
    ? true 
    : false,
  equals: (a, b) => {
    let val = (a === b) ? true : false;
    return val;
  }
});

Template.tsq_confidenceQuestionaire.events({
  'change .tsq_confidenceRadios'(event, instance) {
    event.preventDefault();
    const $radio = $(event.target); 
    const confidenceValue = $radio.data('value')
    const currentLang = (newQuestionsOnly()) 
      ? zeroConfidenceSkills()[userData.get('index')].name 
      : totalSkills()[userData.get('index')].name
      
    userData.set('selected', true)
    
    updateConfidenceLevel(
      currentLang,
      confidenceValue,
      KeyData.findOne({}).key
    );
  },
  'click .select-confidence'(event, instance) {
    event.preventDefault();
    const $button = $(event.target);
    const confidenceValue = $button.data('value');
    const curSkills = Template.tsq_confidenceQuestionaire.__helpers.get('userSkills').call();
    const currentLang = curSkills[$button.data('index')].name;

    $button.removeClass('btn-secondary');
    $button.addClass('btn-success');
    $button.siblings('button').removeClass('btn-success');
    $button.siblings('button').addClass('btn-secondary');

    updateConfidenceLevel(
      currentLang,
      confidenceValue,
      KeyData.findOne({}).key
    );
  },
  'click .nextLanguage'(event, instance) {
    event.preventDefault();
    let currentPage = userData.get('page');
    const skillsLength = totalSkills().length;
      
    if (currentPage < skillsLength / perPage) {
      currentPage++;
      userData.set('page', currentPage);
      FlowRouter.go('/technicalSkillsQuestionaire/confidenceQuestionaire/' + KeyData.findOne().key + '?p=' + userData.get('page'));
    }
  },
  'click .previousLanguage'(event, instance) {
    event.preventDefault();
    let index = userData.get('page');
    let previous = index - 1;
    if(previous < 1) {
      FlowRouter.go('/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + KeyData.findOne().key );
      return;
    } else {
      userData.set('page', index-1);
      FlowRouter.go('/technicalSkillsQuestionaire/confidenceQuestionaire/' + KeyData.findOne().key + '?p=' + userData.get('page'));
    }
  },
  'click #showResults': function(event, instance) {
    event.preventDefault();
    FlowRouter.go('/technicalSkillsQuestionaire/results');
  },
});
