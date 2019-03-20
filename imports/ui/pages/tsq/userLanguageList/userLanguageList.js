import './userLanguageList.html'
import { Template } from 'meteor/templating'
import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor'

/**
 * Variables/Constants
 */

// variable to hold the current user data
let user;

// this is the users key data 
let keyData = new ReactiveVar();

// skills data entered by user in the textarea 
let userSkillsEntered = new ReactiveVar()

// this is an array of skill entries to add to a user key in the api  
let userSkillUpdateArray = new ReactiveVar([])

// boolean value that changes if the user has skills 
// ready to add, or already in their key 
let userAlreadyHasSkills = new ReactiveVar(false)

// skills we already have for the user or skills that are queued to update 
let currentSkills = new ReactiveVar('')

/**
 * Functions
 */

function alreadyHasSkills () {
	return userAlreadyHasSkills.get()
}

function updateCSVString(stringValue, stringToUpdate) {
	if (stringToUpdate.search(stringValue) > -1) {
		return stringToUpdate
	} else {
		stringToUpdate += stringValue + ', '
		return stringToUpdate
	}
}


function setCurrentSkills(source) {
	source.forEach(obj => {
		currentSkills.set(updateCSVString(obj.name, currentSkills.get()))
	})
	return currentSkills.get()
}

function buildUserSkillObject (skill) {
	// store {name, familiar} values 
	let userSkillEntry = {
		name: skill,
		familiar: true
	}

	// store the found skill in a skills array of objects 
	userSkillUpdateArray.get().push(userSkillEntry)
}

//
// Functions with Meteor Calls to the API 
// 

/**
 * @name checkForKeyAndGetData
 * @description checks user for a technicalSkillsData key, 
 * 				assigns the key, stores the data in a reactive 
 * 				var named keyData 
 * @param {Object} user	User from the  db
 */
function checkForKeyAndGetData (user) {
	if(user.MyProfile.technicalSkillsData === undefined){
		console.log('INFO: geting key for user here: ', user)
		Meteor.call('tsq.registerKeyToUser', (error, result) => {
			if (error) {
				console.log(error)
			} else {
				let key = result.data.data.key
				keyData.set(result.data.data)
				console.log('INFO: KeyData Value line 86:  ', keyData.get())
				user.registerTechnicalSkillsDataKey(key);
			}
		})
	}else{		
		Meteor.call('tsq.getKeyData', user.MyProfile.technicalSkillsData, (error, result) => {
			console.log('INFO: geting key for user here who already has a key: ', user.MyProfile.technicalSkillsData)
			if (error) {
				console.log(error)
			} else {
				// flip the already has skills boolean to true if the user has some skills listed 
				if (result.data.data.payload.skills.length !== 0) {
					userAlreadyHasSkills.set(true)	
				}
				keyData.set(result.data.data.payload)
				console.log('INFO: Setting keydata line 101:  ', keyData.get())
			}
			
		});
	};
}

/**
 * @name addSkillToUser
 * @description	takes in a formatted array of skill objects to update the users tsq key with, and their key, 
 * 				and updates the users tsq key 
 * @param 	{Array<Object>} 	arrayOfSkillInformation 	formatted array of objects containing at least a 'name' parameter
 * @param 	{String} 			userKey 					users key 
 * @returns {*} 				Returns a console log with either the result or the error if there is an error 
 */
function addSkillsToUser(arrayOfSkillInformation, userKey) {
	Meteor.call('tsq.addSkillToUser', arrayOfSkillInformation, userKey, (error, result) => {
		if (error) {
			console.log(error)
		} else {
			console.log(result)
		}
	})
}

function addSkillToDb (skill) {
	
	// check for empty string 
	if (skill.length <= 0) {
		return 
	}
	// run meteor call to tsq api 
	Meteor.call('tsq.addSkill', skill.toUpperCase().trim(), (error, result) => {
		if (error) {
			console.log(error)
		} else {
			console.log(result)
		}
	})
}

/**
 * @name checkMasterListForSkill
 * @description takes in a string that represents the name of a skill and checks the tsq db for existence of this skill
 * 				if the skill exists, it adds the skill to the queue of skills to update for the user, else it adds the 
 * 				skill to the no-match list for the no-match alert 
 * @param {String} skill 	string describing the name of a skill.  (API Search is case-sensitive) 
 */
function checkMasterListForSkill(skill) {

	// check for empty string 
	if (skill.length <= 0) {
		return 
	}

	// Meteor method to test api 
	Meteor.call('tsq.skillLookup', skill, (error, response) => {
		if (error) { 
			console.log('no match found in skill db, adding to db', skill)
			addSkillToDb(skill)
			buildUserSkillObject(skill)
			userAlreadyHasSkills.set(true)

		} else {
			// the skill was found do things here
			console.log(response)
			if (response.statusCode === 200) {
				let skillTags = response.data.data.payload.tags
				buildUserSkillObject (skill)
				userAlreadyHasSkills.set(true)

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



// global template helpers 
Template.registerHelper('alreadyHasSkills', alreadyHasSkills)

//
// USER LANGUAGE LIST TEMP
//

Template.tsq_userLanguageList.helpers({
	userDataRetrieved() {
		return keyData.get()
	}
})

//
// USER SKILLS LIST TEMP
//

Template.tsq_userSkillsList.helpers({
	showSkills() {
		if (userSkillUpdateArray.get().length > 0) {

			return setCurrentSkills(userSkillUpdateArray.get())

		} else if ( keyData.get().skills.length > 0) {

			return setCurrentSkills(keyData.get().skills)
		
		}
	},
});

//
// PASTE PROFILE TEMP
//

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
		let userEnteredText = $('#tsq-enterSkillsTextarea').val().toString().trim().split(',')
		
		userSkillsEntered.set(userEnteredText)
		userSkillsEntered.get().forEach(skill => {
			checkMasterListForSkill(skill.trim().toUpperCase())
		})

		return
	},
	'click .tsq-addSkillsToUser': function (event, instance) {
		
		addSkillsToUser(userSkillUpdateArray.get(), keyData.get().key) 
		FlowRouter.go('/tsq/familiarVsUnfamiliar/' + keyData.get().key) 
	}
});

