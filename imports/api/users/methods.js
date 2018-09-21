import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { User } from '../users/users.js';

Meteor.methods({
    'user.sendVerificationEmail'() {
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";

            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = user.emails[0].address,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

                    return emailBody;
                }
            };
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.setEmailNotifications'(notificationBool) {
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId});
            console.log("email Notifications changed from", u.MyProfile.emailNotifications);
            u.MyProfile.emailNotifications = notificationBool;
            u.save();
            console.log("email Notifications changed to", u.MyProfile.emailNotifications);
        }
    },
    'user.getEmailNotifications'() {
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId});
            let notificationBool = u.MyProfile.emailNotifications;
            console.log("returning emailNotifications: ", notificationBool);
            return notificationBool;
        }
        else {
            console.log("error returning emailNotifications");
            return null;
        }
    },
    'user.sendNewVerificationEmail'(newEmail) {
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";

            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = newEmail,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

                    return emailBody;
                }
            };
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.toSetEmail'(newEmail) {
        console.log("entered user.setEmail");
        Accounts.addEmail(Meteor.userId(), newEmail);
    },
    'user.deleteEmail'(unwantedEmail) {
        console.log("Entered deleteEmail");
        Accounts.removeEmail(Meteor.userId(), unwantedEmail);
    }
})
