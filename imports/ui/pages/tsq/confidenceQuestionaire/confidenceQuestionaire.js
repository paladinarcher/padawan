import './confidenceQuestionaire.html'; 
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'
import { callWithPromise } from '/imports/client/callWithPromise';


let userData = new ReactiveDict();
userData.set('keyObtained', false);

async function getUserKey (key) {
    return callWithPromise('tsq.getKeyData', key)
}

async function updateConfidenceLevel (skill, confidenceLevel, key) {
    return callWithPromise('tsq.updateConfidenceLevel', skill, confidenceLevel, key);
}


Template.tsq_confidenceQuestionaire.onCreated(function () {
    this.autorun(async () => {
        
        Template.instance().userKey = FlowRouter.getParam('key')
        keyInfo = await getUserKey(Template.instance().userKey);
        
        userData.set('keyInfo', keyInfo.data.data.payload);
        userData.set('index', 0)
        userData.set('keyObtained', true)
        userData.set('confidenceInfoExists', false)
        userData.set('newSkills', [])
        userData.set('newQuestionsOnly', false)

        userData.get('keyInfo').skills.forEach((skill, index, array) => {
            if (skill.confidenceLevel === 0) {
                let array = userData.get('newSkills')
                array.push(index)
                userData.set('newSkills', array)
            }
        })

        if (userData.get('newSkills').length < userData.get('keyInfo').skills.length) {
            userData.set('confidenceInfoExists', true)
        } 
        
    });
})

Template.tsq_confidenceQuestionaire.helpers({
    keyObtained () {
        return userData.get('keyObtained');
    },
    getLanguageFromList(){
        if (userData.get('newQuestionsOnly') === true) {
            let newItemIndex = userData.get('newSkills')[userData.get('index')]
            return userData.get('keyInfo').skills[newItemIndex].name.name
        }
        return userData.get('keyInfo').skills[userData.get('index')].name.name
    },
    checkForRadioSelected () {
        return userData.get('selected');
    },
    allAnswered(){
        let currentIndex = userData.get('index');
        let skillsLength;
        if (userData.get('newQuestionsOnly') === true) {
            skillsLength = userData.get('newSkills').length;
        } else {
            skillsLength = userData.get('keyInfo').skills.length;
        }
        let radioCheck = userData.get('selected');
        
        if ((currentIndex === skillsLength-1) && (radioCheck === true)) {
            return true;
        } else {
            return false;
        }
    },
    confidenceInfoExists(){
        return userData.get('confidenceInfoExists');
    },
    itemsMissingConfidenceInfo(){
        if (userData.get('newSkills').length > 0)
            return true;
        return false;
    }
});

Template.tsq_confidenceQuestionaire.events({
    'change .tsq_confidenceRadios' (event, instance) {
        let currentLang;
        if (userData.get('newQuestionsOnly')) {
            let newItemIndex = userData.get('newSkills')[userData.get('index')]
            currentLang = userData.get('keyInfo').skills[newItemIndex].name;
        } else {
            currentLang = userData.get('keyInfo').skills[userData.get('index')].name;
        }
        let confidenceValue = event.target.dataset.value;
        userData.set('selected', true);
        updateConfidenceLevel(currentLang, confidenceValue, userData.get('keyInfo').key);
  
    },
    'click .nextLanguage' (event, instance) {
        if (userData.get('newQuestionsOnly') === false) {
            let currentIndex = userData.get('index');
            let skillsLength = userData.get('keyInfo').skills.length;
            if (currentIndex < skillsLength-1) {
                currentIndex++
                userData.set('index', currentIndex);
                $('.tsq_confidenceRadios').each((index, value) => {
                    userData.set('selected', false)
                    $(value).prop('checked', false);
                })
            }
        } else {
            let currentIndex = userData.get('index');
            let skillsLength = userData.get('newSkills').length;
            if (currentIndex < skillsLength-1) {
                currentIndex++
                userData.set('index', currentIndex);
                
                $('.tsq_confidenceRadios').each((index, value) => {
                    userData.set('selected', false)
                    $(value).prop('checked', false);
                })
            }
        }
    },
    'click #showResults': function (event, instance) {
        FlowRouter.go('/tsq/results/' + instance.userKey) 
    },
    'click #allQuestions': function (event, instance) {
        userData.set('confidenceInfoExists', false)
    },
    'click #newQuestionsOnly': function (event, instance) {
        userData.set('newQuestionsOnly', true)
        userData.set('confidenceInfoExists', false)
    }
});