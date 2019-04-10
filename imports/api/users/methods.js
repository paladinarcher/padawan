import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { User } from '../users/users.js';
import { Accounts } from 'meteor/accounts-base'
import { Defaults } from '/imports/startup/both/defaults.js';

Meteor.methods({
    'user.sendVerificationEmail'() {
        // throw new Meteor.Error(); // for testing
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = Defaults.supportEmail;
            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                        let emailAddress   = user.emails[0].address,
                        //urlWithoutHash = url.replace( '#/', '' ),
                        urlWithoutHash = url,
                        //urlWithoutHash = 'ls.com',
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;
                        console.log(urlWithoutHash);
                    return emailBody;
                }

            };
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.setEmailNotifications'(notificationBool) {
        // throw new Meteor.error(); // for testing
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId}); // change to Meteor.users.find...
            console.log("email Notifications changed from", u.MyProfile.emailNotifications);
            u.MyProfile.emailNotifications = notificationBool;
            u.save();
            console.log("email Notifications changed to", u.MyProfile.emailNotifications);
        }
    },

    // this function is unessesary as of 11/6/2018
    'user.getEmailNotifications'() {
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId}); // change to Meteor.users.find...
            let notificationBool = u.MyProfile.emailNotifications;
            console.log("returning emailNotifications: ", notificationBool);
            return notificationBool;
        }
        else {
            console.log("error returning emailNotifications");
            return null;
        }
    },
    'user.toSetEmail'(newEmail) {
        // throw new Meteor.Error(); // for testing
        let userId = Meteor.userId();
        if (userId) {
            let u = Meteor.users.findOne({_id:userId});
            let oldEmail = u.emails[0].address
            // console.log("u.emails[0].verified: ", u.emails[0].verified);
            if (newEmail == oldEmail && u.emails[0].verified == true) {
                throw new Meteor.Error('Email already verified', "The email is already verified");
            }
            else {
                // get the new email to emails[0]
                let newEmailArray = [newEmail];
                u.emails.forEach((thisEmail) => {
                    let address = thisEmail.address;
                    // console.log("address: ", address);
                    // console.log("newAddress: ", newEmail);
                    if (address != newEmail) {
                        newEmailArray.push(address);
                    }
                    Accounts.removeEmail(Meteor.userId(), address);
                });
                newEmailArray.forEach((address) => {
                    Accounts.addEmail(Meteor.userId(), address);
                });
                //
                // console.log("Meteor.users.findOne({_id:userId}).emails[0].address: ", Meteor.users.findOne({_id:userId}).emails[0].address);
            }
        }
    },
    'user.deleteEmail'(unwantedEmail) {
        console.log("Entered deleteEmail");
        let emailUser = User.findOne( {_id: Meteor.userId()} );
        console
        if (unwantedEmail != emailUser.emails[0].address)
        {
            Accounts.removeEmail(Meteor.userId(), unwantedEmail);
        }

    },
    'user.unverifyEmails'() {
        console.log("in unverifyEmails");
        // delete emails that aren't the main email
        let unverified = Meteor.users.findOne({_id: Meteor.userId()}).emails;
        unverified.forEach(function(e,i,a){a[i].verified=false});
        Meteor.users.update({ _id: Meteor.userId() },
            { $set: { 'emails': unverified }});
    },
	'user.addQnaireQuestion'(qnaireId, label, question, answers) {
		console.log("Entered addQnaireQuestion");
		console.log("qnaireId: ", qnaireId);
		console.log("label: ", label);
		console.log("answers: ", answers);
        let userId = Meteor.userId();
		if(userId){
            let u = Meteor.users.findOne({_id:userId});
			console.log("u._id: ", u._id);
			console.log("u.MyProfile.UserType.AnsweredQnaireQuestions: ", u.MyProfile.UserType.AnsweredQnaireQuestions);
			if (u.MyProfile.UserType.AnsweredQnaireQuestions == undefined){
				console.log("resetting AnsweredQnaireQuestions");
				Meteor.users.update({_id: userId}, {$set: {"MyProfile.UserType.AnsweredQnaireQuestions": []}});
            	u = Meteor.users.findOne({_id:userId});
			}
			//Meteor.users.update({_id: userId}, {$push: {"MyProfile.UserType.AnsweredQnaireQuestions": {"QnaireId": qnaireId, 'QnaireAnswers': label}}});
			aqqExists = false;
			labelExists = false;
			u.MyProfile.UserType.AnsweredQnaireQuestions.forEach(function(element) {
				if (element.QnaireId == qnaireId) {
					aqqExists = true;
					element.QnaireAnswers.forEach(function(thisQnaireAnswers) {
						//console.log("label match: ", thisQnaireAnswers.label, label);
						if (thisQnaireAnswers.label == label) {
							labelExists = true;
						}
					});
				}
			});
			// aqq is short for AnsweredQnaireQuestions
			console.log("aqqExists: ", aqqExists);
			if (!aqqExists) {
				Meteor.users.update({_id: userId}, {$push: {"MyProfile.UserType.AnsweredQnaireQuestions": {"QnaireId": qnaireId, 'QnaireAnswers': [{"label": label, "question": question, "answers": answers}]}}});

			}
			else {
				if (!labelExists) {
					u.MyProfile.UserType.AnsweredQnaireQuestions.forEach(function(aqq, thisIndex) {
						if (aqq.QnaireId == qnaireId) {
							u.MyProfile.UserType.AnsweredQnaireQuestions[thisIndex].QnaireAnswers.push({"label": label, "question": question, "answers": answers});
							Meteor.users.update({_id: userId}, {$set: {"MyProfile.UserType.AnsweredQnaireQuestions": u.MyProfile.UserType.AnsweredQnaireQuestions}});
						}
					});
				}
			}


		}

	},
	'user.removeQnaire'(qnaireId) {
        let userId = Meteor.userId();
		if(userId){
            let u = Meteor.users.findOne({_id:userId});
			console.log("qqqqqqqqqqqqnaireId: ", qnaireId);
			Meteor.users.update({_id: userId}, {$pull: {'MyProfile.UserType.AnsweredQnaireQuestions': {QnaireId: qnaireId}}});
		}
    },
    'user.addRoles'(params) {

        // Start Error Handling
        if (params.length < 3) {
            console.log('ERROR:  missing parameters')
            console.log('ERROR:  user.addRoles requires 3 parameters, a user identifier, a type of role, and an array of roles to add to the user');
            return
        }

        if (typeof(params[0]) !== 'string') {
            console.log('ERROR: Type Error')
            console.log('ERROR: user id must be a string')
            return
        }


        if (typeof (params[1]) !== 'string') {
            console.log('ERROR: Type Error')
            console.log('ERROR: role type must be a string')
            return
        }


        if (!(Array.isArray(params[2]))) {
            console.log('ERROR: Type Error')
            console.log('ERROR: roles selected must be an array')
            return
        }
        // End Error Handling

        // Set up params and other variables
        const userId = params[0]
        const roleType = params[1]
        const rolesToAdd = params[2]
        let setRolesObjectPlaceholder = {};

        // fn to filter out dupes
        const filterDuplicateRoles = (allCombinedRolesForUser) => allCombinedRolesForUser.filter((role, index) => allCombinedRolesForUser.indexOf(role) === index)

        // get user and their current roles
        let selectedUser = Meteor.users.findOne({_id:userId})
        let userCurrentRoles = selectedUser.roles[roleType]

        // if the user doesn't have any roles yet
        if (!userCurrentRoles || userCurrentRoles == undefined) {

            userCurrentRoles = []
            let updatedRoles = userCurrentRoles.concat(rolesToAdd)
            setRolesObjectPlaceholder['roles.' + roleType] = updatedRoles
            Meteor.users.update({ _id: userId }, { $set: setRolesObjectPlaceholder })

        // the user currently has roles for this role type
        } else {

            let updatedRoles = userCurrentRoles.concat(rolesToAdd)
            let uniqueUpdatedRoles = filterDuplicateRoles(updatedRoles)
            setRolesObjectPlaceholder['roles.' + roleType] = uniqueUpdatedRoles
            Meteor.users.update({ _id: userId }, { $set: setRolesObjectPlaceholder })

        }
    },
    'user.removeRoles'(params) {
        console.log('testing this function ');
        console.log(params)

        // Start Error Handling
        if (params.length < 3) {
            console.log('ERROR:  missing parameters')
            console.log('ERROR:  user.addRoles requires 3 parameters, a user identifier, a type of role, and a role to be removed');
            return
        }

        if (typeof (params[0]) !== 'string') {
            console.log('ERROR: Type Error')
            console.log('ERROR: user id must be a string')
            return
        }


        if (typeof (params[1]) !== 'string') {
            console.log('ERROR: Type Error')
            console.log('ERROR: role type must be a string')
            return
        }


        if (typeof (params[2]) !== 'string') {
            console.log('ERROR: Type Error')
            console.log('ERROR: role to remove must be a string')
            return
        }
        // End Error Handling

        // set parameter variables
        const userId = params[0]
        const roleType = params[1]
        const roleToRemoveFromUser = params[2]
        let setRolesObjectPlaceholder = {}

        let selectedUser = Meteor.users.findOne({ _id: userId })
        let userCurrentRoles = selectedUser.roles[roleType]

        console.log(userCurrentRoles)

        let filterOutOldRole = (userCurrentRoles) => userCurrentRoles.filter( (value, index) => value != roleToRemoveFromUser )

        // roles exist for the user
        if (userCurrentRoles.length !== 0) {

            let updatedCurrentRoles = filterOutOldRole(userCurrentRoles)
            console.log(updatedCurrentRoles);
            setRolesObjectPlaceholder['roles.' + roleType] = updatedCurrentRoles
            Meteor.users.update({ _id: userId }, { $set: setRolesObjectPlaceholder })

        // something has gone wrong
        } else {

            console.log('ERROR:  This user does not have any roles. Exiting');
            return

        }
    },

//	'user.addAnsweredQnaire'() {
//		console.log("Entered addQnaireQuestion");
//		console.log("qnaireId: ", qnaireId);
//		console.log("label: ", label);
//        let userId = Meteor.userId();
//		if(userId){
//            let u = Meteor.users.findOne({_id:userId});
//			console.log("u._id: ", u._id);
//			console.log("u.MyProfile.UserType.AnsweredQnaireQuestions: ", u.MyProfile.UserType.AnsweredQnaireQuestions);
//			if (u.MyProfile.UserType.AnsweredQnaireQuestions == undefined){
//				console.log("resetting AnsweredQnaireQuestions");
//				Meteor.users.update({_id: userId}, {$set: {"MyProfile.UserType.AnsweredQnaireQuestions": []}});
//			}
//		}
//	},
})
