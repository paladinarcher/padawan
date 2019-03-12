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

// return true if the user has a TSQ Key
let hasTSQData = new ReactiveVar(true)

// return false if the user does not have any skills data
let alreadyHasSkills = new ReactiveVar(false)

// variable to hold the current user data
let user;

// var to hold user technicalSkillsData
let userKey;

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

async function getUsersSkills (url, userKey) {
	let options = { method: "GET" }
	let response = await fetch(url + '/findOne/key/' + userKey, options)
	let json = await response.json()
	console.log(json)
	console.log(json.data.payload.skills)
}

/**
 * Templates
 */

// main temp
Template.tsq_userLanguageList.onCreated(function () {
	this.autorun(() => {
		this.subscription = this.subscribe('tsqUserList', this.userId, {
			onStop: function () {
				console.log("tsq user List subscription stopped! ", arguments, this);
			},
			onReady: function () {
				console.log("tsq user List subscription ready! ", arguments, this);

				let userId = Meteor.userId();
				console.log('user id: ', userId);
				user = User.findOne({_id:userId});
				console.log('user: ', user);
				userKey = user.MyProfile.technicalSkillsData;

				// check if user doesnt have key, register one if not
				if(userKey === undefined){
					registerKey(USER_URL, user);
					getUsersSkills(USER_URL, userKey)
				}else{
					console.log("user already has key stored!", userKey);
					getUsersSkills(USER_URL, userKey)
				};
			}
		});
	})
});


// main temp helpers
Template.tsq_userLanguageList.helpers({
})


// enter skill textarea and next button
Template.tsq_pasteProfile.rendered = function () {
	$('#tsq-enterSkillsTextarea').val(testData.skillList)
};


Template.tsq_pasteProfile.helpers({
	alreadyHasSkills () {
		return alreadyHasSkills.get()
	},
})


Template.tsq_pasteProfile.events({
	'click .tsq-enterSkillsContinue': function (event, instance) {
		let userEnteredText = $('#tsq-enterSkillsTextarea').val().toString().trim()
		userSkillsEntered.set(userEnteredText.split(','))
		console.log(userSkillsEntered)
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

