import './tsq.html'
import { Template } from 'meteor/templating'
import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { ConfidenceRubric } from '/imports/api/tsq/tsq'
import { Meteor } from 'meteor/meteor'

/**
 * Variables/Constants
 */
// skills data entered by user in the textarea 
let userSkillsEntered = new ReactiveVar()

// variable to hold the current user data
let user;

// this is the users key data 
let keyData = new ReactiveVar();

// this is an array of skills to add to a user key in the api  
let userSkillUpdateArray = ReactiveVar([])

/**
 * Functions
 */

/**
 * @description checks user for a technicalSkillsData key, 
 * 				assigns the key, stores the data in a reactive 
 * 				var named keyData 
 * @param {Object} user	User from the  db
 */
function checkForKeyAndGetData (user) {
	if(user.MyProfile.technicalSkillsData === undefined){
		console.log('this user does not have a key, registering now..')
		Meteor.call('tsq.registerKeyToUser', (error, result) => {
			if (error) {
				console.log(error)
			}
			let key = result.data.data.key
			keyData.set(result.data.data)
			user.registerTechnicalSkillsDataKey(key);
		})
	}else{
		console.log("user already has key stored!", user.MyProfile.technicalSkillsData);
		Meteor.call('tsq.getKeyData', user.MyProfile.technicalSkillsData, (error, result) => {
			if (error) {
				console.log(error)
			}
			console.log("getKeyData result: ", result)
			keyData.set(result.data.data.payload)
		});
	};
}

// function addSkillsToUser(skill, key) {
// 	Meteor.call('tsq.addSkillToUser')
// }

function checkMasterListForSkill(skill) {
	// Meteor method to test api 
	console.log('Looking for this skill in the db: ' + skill)
	Meteor.call('tsq.skillLookup', skill, (error, response) => {
		if (error) {
			console.log(error)
			// if the skill is not found do stuff here 
		} else {
			// the skill was found do things here
			console.log(response)
			if (response.statusCode === 200) {
				let skillTags = response.data.data.payload.tags
				console.log(skill) 
				
				// store {name, familiar} values 
				let userSkillEntry = {
					name: skill,
					familiar: true
				}

				// store the found skill in a skills array of objects 
				userSkillUpdateArray.get().push(userSkillEntry)

				// check the tags for matches? 
				if (skillTags !== undefined) {
					skillTags.forEach(tag => checkMasterListForSkill(tag)) 
				}
			}
		}
	})
}

/**
 * Templates
 */

// main temp
Template.tsq_userLanguageList.onCreated(function () {
	this.autorun(() => {
		this.subscription1 = this.subscribe('tsqUserList', this.userId, {
			onStop: function () {
				console.log("tsq user List subscription stopped! ", arguments, this);
			},
			onReady: function () {
				console.log("tsq user List subscription ready! ", arguments, this);
				let userId = Meteor.userId();
				user = User.findOne({_id:userId});
				checkForKeyAndGetData(user)
			}
		});
	})
});


// main temp helpers
Template.tsq_userLanguageList.helpers({
	testHelper() {
		console.log(keyData.get())
	}
})

Template.tsq_userLanguageList.rendered = function(){
	console.log("keyData get: ", keyData.get())
}

// Template.tsq_userSkillsList.helpers({
// 	showSkills() {
// 		if (userSkillsEntered.get() !== undefined) {
// 			return userSkillsEntered.get().join(',')
// 		}
// 		return 
// 	}
// });

// Template.tsq_pasteProfile.helpers({
// 	alreadyHasSkills () {
// 		if (keyData.get() == undefined || keyData.get().skills.length <= 0) {
// 			console.log('this user has no skills set')
// 			return false 
// 		} else if () {

// 		} else {
// 			console.log('this user does have skills')
// 			return true 
// 		}
// 	},
// })

// enter skill textarea and next button
Template.tsq_pasteProfile.rendered = function () {
	if (keyData.get() !== undefined) {
		$('#tsq-enterSkillsTextarea').val(keyData.get().skills)
	}
};

Template.tsq_pasteProfile.events({
	'click .tsq-enterSkillsContinue': function (event, instance) {
		// users current skills 
		let userEnteredText = $('#tsq-enterSkillsTextarea').val().toString().trim()
		// set reactive var to comma sep array 
		userSkillsEntered.set(userEnteredText.split(','))
		// console 
		console.log('USER Skills Entered: ' + userSkillsEntered.get())
		
		// TODO: Search tsq skills db for items in the userSkillsEntered array
		userSkillsEntered.get().forEach(skill => {
			// Compare the skill in the api 
			checkMasterListForSkill(skill)
			// TODO: if not exist in skills db add to skills db 
		})
		
		// TODO: if not already added to user, add to user 
		return
	}
});


// Template.tsq_addLanguage.helpers({
// 	showLang() {
// 		// static test data for adding more languages
// 		let rl = { //rl = random language
// 		lang: [
// 				'css', 'java', 'php', 'c++', '.net',
// 				'angular', 'vue', 'swift', 'node', 'react'
// 			]
// 		}
// 		console.log(rl.lang[2]);
// 		return rl.lang;
// 	}
// });

