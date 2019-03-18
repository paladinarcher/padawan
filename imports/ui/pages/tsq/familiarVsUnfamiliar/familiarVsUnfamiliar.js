import './familiarVsUnfamiliar.html'; 
// import '../shared/functions.js';
// import { Template } from 'meteor/templating';
// import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor';

// /* 
// Variables
// */

let usersKeyData = new ReactiveVar();
let unfamiliarSkills = new ReactiveVar([]);

// /*
// Functions
// */


// /*
// Templates
// */

Template.tsq_familiarVsUnfamiliar.onCreated(function (){
    this.autorun(() => {
        // set key to template
        Template.instance().userKey = FlowRouter.getParam('key');
        // get key data 
        Meteor.call('tsq.getKeyData', Template.instance().userKey, (error, result) => {
            usersKeyData.set(result.data.data.payload);
        })
    });
});

Template.tsq_familiarVsUnfamiliar.helpers({
    checkForSkillsExist () {
        return usersKeyData.get()
    },
    checkForUnfamiliarSkills () {
        if (usersKeyData.get().skills) {
            usersKeyData.get().skills.forEach(skillEntry => {
                if (skillEntry.familiar === false) {
                    unfamiliarSkills.get().push(skillEntry) 
                }
            })
            console.log(unfamiliarSkills.get())
        }
    }
});