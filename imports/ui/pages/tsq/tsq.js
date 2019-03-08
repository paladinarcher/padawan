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
	let json = await response.json();
	let key = json.data.key;
	console.log(key)

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
		this.subscription = this.subscribe('userData', {
      onStop: function () {
          console.log("User profile subscription stopped! ", arguments, this);
      },
      onReady: function () {
          console.log("User profile subscription ready! ", arguments, this);
      }
	  });
		this.subscription2 = this.subscribe('userList', this.userId, {
	      onStop: function () {
	          console.log("User List subscription stopped! ", arguments, this);
	      },
	      onReady: function () {
	          console.log("User List subscription ready! ", arguments, this);
	      }
	  });
	  // set the user
	  let uid = Meteor.userId()
	  user = User.findOne({_id: uid })
	})
});


// main temp helpers
Template.tsq_userLanguageList.helpers({
	// check if the user has technical skills data
	hasTSQData(){
		// if the field is undefined the user does not have any tsq data yet, return false
		(user.MyProfile.technicalSkillsData === undefined) ? false : true
	},
	// register a tsq key to the user
	async registerUserWithKey() {
		await registerKey(USER_URL, user)
		console.log(user)
		return false
	}
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

