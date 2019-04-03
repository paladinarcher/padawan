import './confidenceQuestionaire.html'; 
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'
import { Meteor } from 'meteor/meteor';
import { callWithPromise } from '/imports/client/callWithPromise';

let userData = new ReactiveDict();

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

    });
})

Template.tsq_confidenceQuestionaire.helpers({
    getLanguageFromList(){
        return userData.get('keyInfo').skills[userData.get('index')].name.name
    },
    checkForRadioSelected () {
        return userData.get('selected');
    },
    allAnswered(){
        let currentIndex = userData.get('index');
        let skillsLength = userData.get('keyInfo').skills.length;
        let radioCheck = userData.get('selected');

        if ((currentIndex === skillsLength-1) && (radioCheck === true)) {
            return true;
        } else {
            return false;
        }
    },
    confidenceInfoExists(){
        return false;
    },
    itemsMissingConfidenceInfo(){
        return false;
    }
});

Template.tsq_confidenceQuestionaire.events({
    'change .tsq_confidenceRadios' (event, instance) {
        let currentLang = userData.get('keyInfo').skills[userData.get('index')].name;
        let confidenceValue = event.target.dataset.value;
        userData.set('selected', true);
        updateConfidenceLevel(currentLang, confidenceValue, userData.get('keyInfo').key);
  
    },
    'click .nextLanguage' (event, instance) {
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
    },
    'click #showResults': function (event, instance) {
        FlowRouter.go('/tsq/results/') 
    }
});