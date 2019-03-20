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

// /*
// Functions
// */

function checkForUnfamiliarSkillsExist (skillsArray) {
    skillsArray.forEach(skillEntry => {
        if (skillEntry.familiar === false) { 
            userHasUnfamilarSkills.set(true) 
            unfamiliarSkillsCounter.set(unfamiliarSkillsCounter.get() + 1) 
        }
    })
    return userHasUnfamilarSkills.get()
}

function buildUpdateObjects (skill) {
    let skillObject = {
        name: skill.name
    }
    return skillObject
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
            console.log(unfamiliarSkillsCounter.get()) // LOG: checking on counter here 
            checkForUnfamiliarSkillsExist(usersKeyData.get().skills) 
            addUnfamiliarSkillsToUser(unfamiliarSkillsCounter.get(), usersKeyData.get().skills)
        }
    }
});