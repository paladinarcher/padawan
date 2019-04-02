import './familiarVsUnfamiliar.html'; 
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor';
import { callWithPromise } from '/imports/client/callWithPromise';

// /* 
// Variables
// */

let usersKeyData = new ReactiveVar();
let userHasUnfamilarSkills = new ReactiveVar(false);
let unfamiliarList = new ReactiveVar([]);

// /*
// Functions
// */

// TODO: Populate the unfamiliarList array with skillEntries and display
function createTheListToDisplay (unfamiliarList, usersSkillsArray) {
    usersSkillsArray.forEach(skillEntry => {
        if (skillEntry.familiar === false) {   
            if (unfamiliarList.findIndex(updateObj => skillEntry.name === updateObj.name) < 0) {
                unfamiliarList.push(buildUpdateObjects(skillEntry)) 
            }
        }
    })
    return unfamiliarList
}

// unfamiliar skills on the frontend 
function checkForUnfamiliarSkillsExist (skillsArray) {
    skillsArray.forEach(skillEntry => {
        if (skillEntry.familiar === false) { 
            userHasUnfamilarSkills.set(true) 
        }
    })
    return userHasUnfamilarSkills.get()
}

function buildUpdateObjects (skill) {
    return { name: skill.name }
    return { id: skill._id, name: skill.name }
}

async function updateUser(updateObject, key) {
    // send the updated list 
    let result = await callWithPromise('tsq.addSkillToUser', updateObject, key)
    return result;
} 

async function addUnfamiliarSkillsToUser (counter, unfamiliarList) {
    if (counter < 10) {
        let result = await callWithPromise('tsq.getRandomSkills', (10-counter))
            if (error) {
        let updateArray = []
        result.data.data.payload.forEach(skill => {
            updateArray.push(buildUpdateObjects(skill))
        })
        const updatedUnfamiliarList = unfamiliarList.get().concat(updateArray)
        unfamiliarList.set(updatedUnfamiliarList)
        
        return await updateUser(updateArray, usersKeyData.get().key)
    }
}

function updateSkillFamiliarSetting (key, name, familiar) {
    Meteor.call('tsq.updateFamiliarInformation', key, name, familiar, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
        }
    })
}

// /*
// Templates
// */

Template.tsq_familiarVsUnfamiliar.onCreated(function (){
    this.autorun(() => {
        Template.instance().userKey = FlowRouter.getParam('key') // add key to template from route params 
        Meteor.call('tsq.getKeyData', Template.instance().userKey, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                usersKeyData.set(result.data.data.payload) // set users key data to reactive var 
            }
        })
    });
});

Template.tsq_familiarVsUnfamiliar.helpers({
    checkForSkillsExist () {
        return usersKeyData.get() // get keydata 
    },
    checkForUnfamiliarSkills () {
        if (usersKeyData.get().skills) {
            checkForUnfamiliarSkillsExist(usersKeyData.get().skills) 
            createTheListToDisplay(unfamiliarList.get(), usersKeyData.get().skills)
            addUnfamiliarSkillsToUser(unfamiliarList.get().length, unfamiliarList)
            createTheListToDisplay(unfamiliarList.get(), usersKeyData.get().skills)
        }
    },
    unfamiliarList () {
        return unfamiliarList.get()
    },
    createId (name) {
        const n = name.hash.name
        return n.replace(/\s+/g, '-').toLowerCase()
    }
});

Template.tsq_familiarVsUnfamiliar.events({
    'change .unfamiliar-item-checkbox': function (event, instance) {
        const labelData = $(event.target).next(0).text()
        const familiarValue = event.target.checked
        const userKey = usersKeyData.get().key
        if (familiarValue) {
            updateSkillFamiliarSetting(userKey, labelData, true)
        } 
        else {
            updateSkillFamiliarSetting(userKey, labelData, false)
        }
    },
    'click #confidenceQnaireStart': function (event, instance) {
        console.log('clicked: ', event.target)
        FlowRouter.go('/tsq/confidenceQuestionaire/' + usersKeyData.get().key) 
    }
})