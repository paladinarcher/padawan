import './tsq.html'
import { Template } from 'meteor/templating'
import { User } from '/imports/api/users/users.js'
import { ReactiveVar } from 'meteor/reactive-var'
import { ConfidenceRubric } from '/imports/api/tsq/tsq'
import { Meteor } from 'meteor/meteor'

/**
 * Variables/Constants
 */

// static test data
let testData = {
	skillList: 'python, mongo, sql, javascript, c#'
}

// TODO: change to config file
const USER_URL = 'http://localhost:4000/tsq/skills/users/'

// return false if the user does not have any skills data
// let alreadyHasSkills = new ReactiveVar(checkUserSkills())
let userSkillsEntered = new ReactiveVar()

// variable to hold the current user data
let user;

// var to hold user technicalSkillsData
// let userKey;
// let skills;

/**
 * Functions
 */

/**
 * @desc
 * registers a technical skills key to a user
 * @param  {[type]} url  	TSQ API URL
 * @param  {[type]} user 	The user to be registered
 * @return {*}      			No return data
 */
async function registerKey (url, user) {
	let options = { method: "POST" };
	let response = await fetch(url + '/register', options);
	console.log('response: ', response);
	let json = await response.json();
	console.log('json here: ', json);
	let key = json.data.key;
	console.log("key:", key)

	// user meteor method
	await user.registerTechnicalSkillsDataKey(key);
	return
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
				console.log('user id: ', userId);
				user = User.findOne({_id:userId});
				console.log('user: ', user);
				// userkey = user.MyProfile.technicalSkillsData
				// console.log('this.userkey(154): ' + userkey)

				if(user.MyProfile.technicalSkillsData === undefined){
					registerKey(USER_URL, user);
				}else{
					console.log("user already has key stored!", user.MyProfile.technicalSkillsData);
				};

				Meteor.call('tsq.getKeyData', user.MyProfile.technicalSkillsData, (error, result) => {
					console.log(result)
				});
			}
		});
	})
});


// main temp helpers
Template.tsq_userLanguageList.helpers({
})

Template.tsq_userLanguageList.rendered = function(){
	// console.log('does it make it here: ', myData);
}

// enter skill textarea and next button
Template.tsq_pasteProfile.rendered = function () {
	$('#tsq-enterSkillsTextarea').val(testData.skillList)
};


Template.tsq_pasteProfile.helpers({
	alreadyHasSkills () {
		// return alreadyHasSkills.get()
		return false 
	},
})


Template.tsq_pasteProfile.events({
	'click .tsq-enterSkillsContinue': function (event, instance) {
		let userEnteredText = $('#tsq-enterSkillsTextarea').val().toString().trim()
		userSkillsEntered.set(userEnteredText.split(','))
		console.log('USER Skills Entered: ' + userSkillsEntered.get())
		// TODO: Search tsq skills db for items in the userSkillsEntered array
		// TODO: if not exist in skills db add to skills db 
		// TODO: if not already added to user, add to user 
		return
	}
});


Template.tsq_userSkillsList.helpers({
	showSkills() {
		// return userSkillsEntered.get().join(',')
		return 'Show the users skilldata here'
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

