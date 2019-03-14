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

// boolean value that changes if the user has skills 
// ready to add, or already in their key 
let userHasSkills = ReactiveVar(false)

// these skills the user entered did not match 
let noMatchesInSkillDb = ReactiveVar([])
// there are no matches from the user 
let noMatchesExistinSkillDb = ReactiveVar(false)

/**
 * Functions
 */

function alreadyHasSkills () {
	console.log('userhasskills' + userHasSkills.get())
	return userHasSkills.get()
}

function noMatchesExist () {
	return noMatchesExistinSkillDb.get()
}

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
			
			// TODO: flip the already has skills boolean to true if the user has some skills listed 
			if (result.data.data.payload.skills.length !== 0) {
				userHasSkills.set(true)	
			}

			keyData.set(result.data.data.payload)
		});
	};
}

function addSkillsToUser(arrayOfSkillInformation, userKey) {
	console.log(arrayOfSkillInformation)
	console.log(userKey)
	Meteor.call('tsq.addSkillToUser', arrayOfSkillInformation, userKey, (error, result) => {
		if (error) {
			console.log(error)
		} else {
			console.log(result)
		}
	})
}

function checkMasterListForSkill(skill) {

	// check for empty string 
	if (skill.length <= 0) {
		return 
	}

	// Meteor method to test api 
	console.log('Looking for this skill in the db: ' + skill)
	Meteor.call('tsq.skillLookup', skill, (error, response) => {
		if (error) {
			console.log(error)
			// if the skill is not found do stuff here 
			// add to no matches 
			noMatchesInSkillDb.get().push(skill)
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
				userHasSkills.set(true)

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
// created a global template helper for this so it works in all the templates now
Template.registerHelper('alreadyHasSkills', alreadyHasSkills)
Template.registerHelper('noMatchesExist', noMatchesExist)

Template.tsq_userLanguageList.helpers({
	userDataRetrieved() {
		console.log(keyData)
		return keyData.get()
	}
})

Template.tsq_userLanguageList.rendered = function(){
	console.log("keyData get: ", keyData.get())
}


Template.tsq_userSkillsList.helpers({
	showSkills() {
		if (userSkillUpdateArray.get() !== []) {
			console.log(userSkillUpdateArray.get())
			console.log('skills in array')
			
			let str = '';

			userSkillUpdateArray.get().forEach(obj => {
				console.log(obj)
				console.log(obj.name)
				str += obj.name + ', '
			})

			return str;	
		}
	},
	showNoMatchesList () {
		return noMatchesInSkillDb.get().join(',')
	}
});

Template.tsq_pasteProfile.helpers({
	
})

// enter skill textarea and next button
Template.tsq_pasteProfile.rendered = function () {
	if (keyData.get() !== undefined) {
		str = ''
		keyData.get().skills.forEach(obj => {
			str += obj.name + ', '
		})
		$('#tsq-enterSkillsTextarea').val(str)
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
			checkMasterListForSkill(skill.trim())
			// TODO: if not exist in skills db add to skills db 
		})

		if (userSkillUpdateArray.get().length == 0) {
			noMatchesExistinSkillDb.set(true)
		}
		
		// TODO: if not already added to user, add to user 
		return
	},
	'click .tsq-addSkillsToUser': function (event, instance) {
		console.log('clicked no thats it button')
		// add the skills to the user
		addSkillsToUser(userSkillUpdateArray.get(), keyData.get().key) 
		// route to the second page 
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

