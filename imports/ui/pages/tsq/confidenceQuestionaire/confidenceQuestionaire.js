import './confidenceQuestionaire.html';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { callWithPromise } from '/imports/client/callWithPromise';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

let userData = new ReactiveDict();
userData.set('keyObtained', false);

async function getUserKey(key) {
  return callWithPromise('tsq.getKeyData', key);
}

async function updateConfidenceLevel(skill, confidenceLevel, key) {
  return callWithPromise(
    'tsq.updateConfidenceLevel',
    skill._id,
    confidenceLevel,
    key
  );
}

async function updateUserData() {
  Template.instance().userKey = FlowRouter.getParam('key');
  keyInfo = await getUserKey(Template.instance().userKey);
  userData.set('keyInfo', keyInfo.data.data.payload);
  console.log('Reset userData: ',userData.get('keyInfo').skills);
  await updateNewSkills();
}

async function updateNewSkills() {
  let theArray = [];
  userData.get('keyInfo').skills.forEach((skill, index, array) => {
    if (skill.confidenceLevel === 0) {
      theArray.push(index);
    }
  });
  userData.set('newSkills', theArray);
}

async function selectCurrent() {
  let curSkills = [];
    if (userData.get('newQuestionsOnly') === true) {
      curSkills = userData.get('newSkills');
    } else {
      curSkills = userData.get('keyInfo').skills;
    }
    let curConfidence = curSkills[userData.get('index')].confidenceLevel;
    console.log('Current Confidence: ',curConfidence);
    $('.tsq_confidenceRadios').each( function() {
      console.log("data value: ",$(this).data('value'));
      let curRad = $(this);
      if(curRad.data('value') == curConfidence) {
        curRad.prop('checked', true);
        userData.set('selected', true);
      }
    });
}

Template.tsq_confidenceQuestionaire.onCreated(function() {
  this.autorun(async () => {
    Template.instance().userKey = FlowRouter.getParam('key');
    keyInfo = await getUserKey(Template.instance().userKey);

    userData.set('keyInfo', keyInfo.data.data.payload);
    userData.set('index', 0);
    userData.set('keyObtained', true);
    userData.set('confidenceInfoExists', false);
    userData.set('questionAnswered', false);
    userData.set('newSkills', []);
    userData.set('newQuestionsOnly', false);

    userData.get('keyInfo').skills.forEach((skill, index, array) => {
      if (skill.confidenceLevel === 0) {
        let array = userData.get('newSkills');
        array.push(index);
        userData.set('newSkills', array);
      }
    });

    selectCurrent();

    //if (
    //  userData.get('newSkills').length < userData.get('keyInfo').skills.length
    //) {
    //  userData.set('questionAnswered', true);
    //}

    if(FlowRouter.current().queryParams.new) {
      userData.set('newQuestionsOnly', true);
      userData.set('confidenceInfoExists', false);
    }
  });
});

Template.tsq_confidenceQuestionaire.helpers({
  userSkills() {
    return userData.get('keyInfo').skills;
  },
  unansweredPercent() {
    if(userData.get('newSkills').length === 0) {
      return 0;
    };
    console.log("unanswered Percent calc: ",userData.get('newSkills').length, userData.get('keyInfo').skills.length);
    return (userData.get('newSkills').length / (userData.get('keyInfo').skills.length + 2)) * 100;
  },
  answeredPercent() {
    return 100 - Template.tsq_confidenceQuestionaire.__helpers.get('unansweredPercent').call();
  },
  questionAnswered() {
    let theSkills = [];
    if (userData.get('newQuestionsOnly') === true) {
      theSkills = userData.get('newSkills');
    } else {
      theSkills = userData.get('keyInfo').skills;
    }
    if(theSkills[userData.get('index')].confidenceLevel > 0) {
      return true;
    }
    return false;
  },
  keyObtained() {
    return userData.get('keyObtained');
  },
  getLanguageFromList() {
    if (userData.get('newQuestionsOnly') === true) {
      let newItemIndex = userData.get('newSkills')[userData.get('index')];
      return userData.get('keyInfo').skills[newItemIndex].name.name;
    }
    return userData.get('keyInfo').skills[userData.get('index')].name.name;
  },
  checkForRadioSelected() {
    return userData.get('selected');
  },
  allAnswered() {
    let currentIndex = userData.get('index');
    let skillsLength;
    if (userData.get('newQuestionsOnly') === true) {
      skillsLength = userData.get('newSkills').length;
    } else {
      skillsLength = userData.get('keyInfo').skills.length;
    }
    let radioCheck = userData.get('selected');

    if (currentIndex === skillsLength - 1 && radioCheck === true) {
      return true;
    } else {
      return false;
    }
  },
  confidenceInfoExists() {
    return userData.get('confidenceInfoExists');
  },
  itemsMissingConfidenceInfo() {
    if (userData.get('newSkills').length > 0) return true;
    return false;
  }
});

Template.tsq_confidenceQuestionaire.events({
  'change .tsq_confidenceRadios'(event, instance) {
    let currentLang;
    if (userData.get('newQuestionsOnly')) {
      let newItemIndex = userData.get('newSkills')[userData.get('index')];
      currentLang = userData.get('keyInfo').skills[newItemIndex].name;
    } else {
      currentLang = userData.get('keyInfo').skills[userData.get('index')].name;
    }
    let confidenceValue = event.target.dataset.value;
    userData.set('selected', true);
    updateConfidenceLevel(
      currentLang,
      confidenceValue,
      userData.get('keyInfo').key
    );
    updateUserData();
  },
  'click .nextLanguage'(event, instance) {
    let skillsLength = 0;
    if (userData.get('newQuestionsOnly') === false) {
      skillsLength = userData.get('keyInfo').skills.length;
    } else {
      skillsLength = userData.get('newSkills').length;
    }
    let currentIndex = userData.get('index');
    if (currentIndex < skillsLength - 1) {
      currentIndex++;
      userData.set('index', currentIndex);
      $('.tsq_confidenceRadios').each((index, value) => {
        userData.set('selected', false);
        $(value).prop('checked', false);
      });
    }
    selectCurrent();
  },
  'click .previousLanguage'(event, instance) {
    let skillsLength = 0;
    let currentIndex = 0;
    if (userData.get('newQuestionsOnly') === false) {
      skillsLength = userData.get('keyInfo').skills.length;
      currentIndex = userData.get('index');
    } else {
      console.log('the Name: ',userData.get('newSkills')[userData.get('index')]);
      currentIndex = userData.get('newSkills')[userData.get('index')];
      skillsLength = userData.get('keyInfo').skills.length;
      userData.set('newQuestionsOnly', false);
    }
    if (currentIndex > 0) {
      currentIndex--;
      userData.set('index', currentIndex);
      $('.tsq_confidenceRadios').each((index, value) => {
        userData.set('selected', false);
        $(value).prop('checked', false);
      });
      selectCurrent();
    } else {
      FlowRouter.go('/technicalSkillsQuestionaire/familiarVsUnfamiliar/' + userData.get('keyInfo').key );
    }
  },
  'click #showResults': function(event, instance) {
    FlowRouter.go('/technicalSkillsQuestionaire/results');
  },
  'click #allQuestions': function(event, instance) {
    userData.set('confidenceInfoExists', false);
  },
  'click #newQuestionsOnly': function(event, instance) {
    userData.set('newQuestionsOnly', true);
    userData.set('confidenceInfoExists', false);
  }
});
