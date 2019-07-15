import './confidenceQuestionaire.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { User } from '/imports/api/users/users.js';
import { KeyData } from '/imports/client/clientSideDbs';
import { callWithPromise } from '/imports/client/callWithPromise';

let userData = new ReactiveDict({
  index: 0,
  selected: false,
});

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
    this.subscriptionsReady()
  });
});

Template.tsq_confidenceQuestionaire.helpers({
  userSkills: () =>  (totalSkills().length > 0) 
    ? totalSkills() 
    : false,
  unansweredPercent: () => (zeroConfidenceSkills().length === 0) 
    ? 0  
    : (zeroConfidenceSkills().length / (totalSkills().length + 2)) * 100,
  answeredPercent: () => 100 - Template.tsq_confidenceQuestionaire.__helpers.get('unansweredPercent').call(),
  questionAnswered() {
    const skills = (newQuestionsOnly()) 
      ? zeroConfidenceSkills() 
      : totalSkills()

    return ( skills[userData.get('index')].confidenceLevel > 0 ) ? true : false 
  },
  getLanguageFromList: () => (newQuestionsOnly()) 
    ? zeroConfidenceSkills()[userData.get('index')].name.name
    : totalSkills()[userData.get('index')].name.name,
  checkForRadioSelected: () => userData.get('selected'),
  allAnswered() {
    return zeroConfidenceSkills().length == 0;
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
    const $button = $(event.target);
    const confidenceValue = $button.data('value');
    const curSkills = totalSkills();
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
    let index = userData.get('index');
    const skillsLength = (newQuestionsOnly()) 
      ? zeroConfidenceSkills().length
      : totalSkills().length
    
    const currentSkill = (newQuestionsOnly()) 
      ? zeroConfidenceSkills()[index]
      : totalSkills()[index]
      
    if (index < skillsLength - 1) {
      index++;
      userData.set('index', index);
      userData.set('selected', false);
      $('.tsq_confidenceRadios').each((index, value) => ($(value).data('value') === currentSkill.confidenceLevel) 
        ? $(value).prop('checked', true) && userData.set('selected', true)
        : $(value).prop('checked', false));
    }
    
    $('.descriptions').attr('tabindex', '0');
    $('.descriptions').focus();
  },
  'click .previousLanguage'(event, instance) {
    let index = userData.get('index');
    const currentSkill = (newQuestionsOnly()) 
      ? zeroConfidenceSkills()[index]
      : totalSkills()[index]
      
    userData.set('selected', true);

    if (index > 0) {
      index--;
      userData.set('index', index);
      $('.tsq_confidenceRadios').each((index, value) => ($(value).data('value') === currentSkill.confidenceLevel) 
        ? $(value).prop('checked', true) 
        : $(value).prop('checked', false));
      
      $('.descriptions').attr('tabindex', '0');
      $('.descriptions').focus();
    } else {
      FlowRouter.go('/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + KeyData.findOne().key );
    }
  },
  'click #showResults': function(event, instance) {
    FlowRouter.go('/technicalSkillsQuestionaire/results');
  },
});
