import './userLanguageList.html'
import { Template } from 'meteor/templating'
import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor'

/**
 * Variables/Constants
 */

let user;
let keyData = new ReactiveVar();
let userSkillsEntered = new ReactiveVar()
let userSkillUpdateArray = new ReactiveVar([])
let userAlreadyHasSkills = new ReactiveVar(false)
// let currentSkills = new ReactiveVar('')
let allSkillsFromDB = new ReactiveVar();
let flag = new ReactiveVar();

/**
 * Functions
 */

function getSelections(selections) {
	let r = []
	selections.forEach(sel => {
		let entry = {
			value: sel.name._id,
			text: sel.name.name
		}
		r.push(entry)
	})
	return r;
}

function alreadyHasSkills () {
	return userAlreadyHasSkills.get()
}

// function updateCSVString(stringValue, stringToUpdate) {
// 	if (stringToUpdate.search(stringValue) > -1) {
// 		return stringToUpdate
// 	} else {
// 		stringToUpdate += stringValue + ', '
// 		return stringToUpdate
// 	}
// }


// function setCurrentSkills(source) {
// 	source.forEach(obj => {
// 		currentSkills.set(updateCSVString(obj.name, currentSkills.get()))
// 	})
// 	return currentSkills.get()
// }

function buildUserSkillObject (skill) {
	let userSkillEntry = {
		name: skill,
		familiar: true
	}
	userSkillUpdateArray.get().push(userSkillEntry)
}

//
// Functions with Meteor Calls to the API
//

function checkUserForSkill (skill, key) {
	console.log(skill, key);

	Meteor.call('tsq.checkUserForSkill', skill, key, (error, result) => {
		if (error) {
			console.log('this item was not found', skill)
			flag.set(false)
		} else {
			console.log(result, skill)
			flag.set(true)
		}
	})

	return flag.get()
}


function removeSkillFromUser (SkillEntryarray, key) {
	Meteor.call('tsq.removeSkillFromUser', SkillEntryarray, key, (error, result) => {
		if (error) {
			console.log(error)
		} else {
			console.log(result)
		}
	})
}


function getAllSkillsFromDB (list) {
	Meteor.call('tsq.getAllSkills', (error, result) => {
		if (error) {
			console.log('METEOR CALL ERROR: ', error)
		} else {
			console.log('METEOR CALL RESULT: ', result)
			let array = []
			result.data.data.payload.forEach(element => {
				array.push({
					value: element._id,
					text: element.name
				})
			});
			list.set(array);
		}
	})
	console.log('All Skills List: ', list)
	return list;
}


/**
 * @name checkForKeyAndGetData
 * @description checks user for a technicalSkillsData key,
 * 				assigns the key, stores the data in a reactive
 * 				var named keyData
 * @param {Object} user	User from the  db
 */
function checkForKeyAndGetData (user) {
	if(user.MyProfile.technicalSkillsData === undefined){
		Meteor.call('tsq.registerKeyToUser', (error, result) => {
			if (error) {
				console.log('METEOR CALL ERROR: ', error)
			} else {
				let key = result.data.data.key
				keyData.set(result.data.data);
				console.log("tsq.registerKeyToUser set keyData", keyData);
				user.registerTechnicalSkillsDataKey(key);
			}
		})
	}else{
		Meteor.call('tsq.getKeyData', user.MyProfile.technicalSkillsData, (error, result) => {
			if (error) {
				console.log('METEOR CALL ERROR: ', error)
			} else {
				console.log("tsq.getKeyData result", result);
				if (result.data.data.payload.skills.length !== 0) {
					userAlreadyHasSkills.set(true)
				}
				keyData.set(result.data.data.payload)
				console.log("tsq.getKeyData set keyData", keyData);
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
	arrayOfSkillInformation.forEach(skillEntry => {
		let existsAlready = checkUserForSkill(skillEntry.name, userKey) // returns true/false
		if (!existsAlready) {
			Meteor.call('tsq.addSkillToUser', arrayOfSkillInformation, userKey, (error, result) => {
				if (error) {
					console.log('METEOR CALL ERROR: ', error)
				} else {
					console.log('METEOR CALL RESULT: ', result)
				}
			});
			/*let x = keyData.get()
			x.skills.push(skillEntry);
			keyData.set(x);*/
		}
	})
}

/**
 * @name addSkillToDb
 * @description 			add a skill into the microservice db
 * @param {String} skill 	name of the skill to add
 * @returns void
 */
function addSkillToDb (skill) {
	// check for empty string
	if (skill.length <= 0) {
		return
	}
	// run meteor call to tsq api
	Meteor.call('tsq.addSkill', skill.toUpperCase().trim(), (error, result) => {
		if (error) {
			console.log('METEOR CALL ERROR: ', error)
		} else {
			console.log('METEOR CALL RESULT: ', result)
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
			buildUserSkillObject(skill)
			if (userAlreadyHasSkills.get() === true) {
				addSkillToDb(skill)
			} else {
				userAlreadyHasSkills.set(true)
			}

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
				getAllSkillsFromDB(allSkillsFromDB);
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
// PASTE PROFILE TEMP
//

// enter skill textarea and next button
Template.tsq_pasteProfile.rendered = function () {
	if (keyData.get() !== undefined) {
		str = ''
		keyData.get().skills.forEach(obj => {
			str += obj.name.name + ', '
		})
		$('#tsq-enterSkillsTextarea').val(str)
	}
};

Template.tsq_pasteProfile.helpers({
	onItemAdd () {
		return (value, $item) => {
			// create skill entry obj
			let skillEntry = {
				id: value,
				name: $($item).text().substring(0, $($item).text().length - 1),
				familiar: true
			};
			// add the item to the user skills
			addSkillsToUser([skillEntry], keyData.get().key);
			/*let x = allSkillsFromDB.get();
			x.push(skillEntry);
			allSkillsFromDB.set(x);*/
        }
	},
	onItemRemove () {
		return (value, $item) => {
			// create skill entry obj
			let skillEntry = {
				name: $($item).text().substring(0, $($item).text().length - 1)
			};

			// remove the skill from the user
			removeSkillFromUser([skillEntry], keyData.get().key)
		}
	},
	itemSelectHandler () {
		let selections = getSelections(keyData.get().skills)
		return selections
	},
	itemListHandler () {
		return allSkillsFromDB.get()
	}
})

Template.tsq_pasteProfile.events({
	'click .tsq-enterSkillsContinue': function (event, instance) {
		let userEnteredText = $('#tsq-enterSkillsTextarea').val().toString().trim().split(',')

		userSkillsEntered.set(userEnteredText)
		userSkillsEntered.get().forEach(skill => {
			checkMasterListForSkill(skill.trim().toUpperCase(), false)
		})

		return
	},
	'click .tsq-updateAndContinue': function (event, instance) {
		let skills = [];
		$('SPAN[class="label label-primary"]').each( function (index, element) {
			let skill = $(element).data('name')
			console.log('Data attr value: ', $(element).data('name'))
			skills.push(skill)
		})
		skills.forEach(skill => {
			checkMasterListForSkill(skill.trim().toUpperCase(), true)
		})
		addSkillsToUser(userSkillUpdateArray.get(), keyData.get().key)
		FlowRouter.go('/tsq/familiarVsUnfamiliar/' + keyData.get().key)
		return
	},
});
