import './familiarVsUnfamiliar.html'; 
// import '../shared/functions.js';
import { Template } from 'meteor/templating';
// import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor';

// /* 
// Variables
// */

let usersKeyData = new ReactiveVar();
let userHasUnfamilarSkills = new ReactiveVar(false);
let unfamiliarSkillsCounter = new ReactiveVar(0)
let unfamiliarList = new ReactiveVar([]);

// /*
// Functions
// */

// TODO: Populate the unfamiliarList array with skillEntries and display
function createTheListToDisplay (unfamiliarList, usersSkillsArray) {
    usersSkillsArray.forEach(skillEntry => {
        if (skillEntry.familiar === false) {   
            unfamiliarList.push(buildUpdateObjects(skillEntry)) 
        }
    })
    return unfamiliarList
}

// unfamiliar skills on the frontend 
function checkForUnfamiliarSkillsExist (skillsArray) {
    skillsArray.forEach(skillEntry => {
        if (skillEntry.familiar === false) { 
            userHasUnfamilarSkills.set(true) 
            // unfamiliarSkillsCounter.set(unfamiliarSkillsCounter.get() + 1) 
        }
    })
    return userHasUnfamilarSkills.get()
}

function buildUpdateObjects (skill) {
    return { name: skill.name }
}

function updateUser(updateObject, key) {
    // send the updated list 
    Meteor.call('tsq.addSkillToUser', updateObject, key, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
        }
    })
} 

function addUnfamiliarSkillsToUser (counter, currentSkillsArray) {
    let curSkills = [];
    let unfamiliars = 10 - counter;
    currentSkillsArray.forEach(skillEntry => curSkills.push(skillEntry.name));
    // if (counter >= 10) {
        Meteor.call('tsq.getRandomSkills', unfamiliars, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log('random results: ', result.data.data.payload)
                let updateObject = []
                result.data.data.payload.forEach(skill => {
                    updateObject.push(buildUpdateObjects(skill))
                    console.log(updateObject)
                })

                
                updateUser(updateObject, usersKeyData.get().key)
            }
        })
    // }
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
            addUnfamiliarSkillsToUser(unfamiliarSkillsCounter.get(), usersKeyData.get().skills)
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
    }
})