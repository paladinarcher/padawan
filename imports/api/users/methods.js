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

        /*
        let userId = Meteor.userId();
        if (userId) {
            console.log("entered user.setEmail if userId");
            let me = User.findOne({_id:uid});
            console.log("user on server", me);
            console.log("old user email: ", me.emails[0].address);
            me.setEmail(newEmail);
            me.emails[0].address = newEmail;
            me.emails[0].verified = false;
            //user.emails[0].address = newEmail;
            console.log("new user email: ", me.emails[0].address);
        }
        */
    },
    'user.deleteEmail'(unwantedEmail) {
        console.log("Entered deleteEmail");
        Accounts.removeEmail(Meteor.userId(), unwantedEmail);
    }
})
