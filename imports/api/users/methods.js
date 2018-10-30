Meteor.methods({
    'user.sendVerificationEmail'() {
        // throw new Meteor.Error(); //DELETE THIS LINE
        console.log("entered send");
        let userId = Meteor.userId();
        console.log("1");
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            // Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";
            Accounts.emailTemplates.from     = "DeveloperLevel <carl@paladinarcher.com>";
            // Accounts.emailTemplates.from     = "carl@paladinarcher.com";
            console.log("2");
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
            console.log("6");
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.setEmailNotifications'(notificationBool) {
        let userId = Meteor.userId();
        if (userId) {
            let u = User.findOne({_id:userId}); // change to Meteor.users.find...
            console.log("email Notifications changed from", u.MyProfile.emailNotifications);
            u.MyProfile.emailNotifications = notificationBool;
            u.save();
            console.log("email Notifications changed to", u.MyProfile.emailNotifications);
        }
    },
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
    'user.sendNewVerificationEmail'(emailIndex) {
        let userId = Meteor.userId();
        if (userId) {
            Accounts.emailTemplates.siteName = "DeveloperLevel";
            // Accounts.emailTemplates.from     = "DeveloperLevel <wayne@paladinarcher.com>";
            Accounts.emailTemplates.from     = "DeveloperLevel <carl@paladinarcher.com>";

            Accounts.emailTemplates.verifyEmail = {
                subject() {
                    return "[DeveloperLevel] Verify your email address";
                },
                text( user, url ) {
                    let emailAddress   = user.emails[emailIndex].address,
                        urlWithoutHash = url.replace( '#/', '' ),
                        supportEmail   = "support@developerlevel.com",
                        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

                    return emailBody;
                }
            };
            console.log("Accounts.emailTemplates.verifyEmail: ", Accounts.emailTemplates.verifyEmail);
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'user.toSetEmail'(newEmail) {
        // throw new Meteor.Error(); //DELETE THIS LINE
        console.log("entered user.setEmail");

        let userId = Meteor.userId();
        console.log("1");
        if (userId) {
            console.log("2");
            let u = Meteor.users.findOne({_id:userId});
            console.log("2.1");
            let oldEmail = u.emails[0].address
            console.log("2.2");
            console.log("u.emails[0].verified: ", u.emails[0].verified);
            if (newEmail == oldEmail && u.emails[0].verified == true) {
                console.log("2.3");
                //do nothing
                console.log("3");
                throw new Meteor.Error('Email already verified', "The email is already verified");
            }
            else {
                // get the new email to emails[0]
                console.log("4");
                let newEmailArray = [newEmail];
                console.log("4.1");
                u.emails.forEach((thisEmail) => {
                    console.log("4.2");
                    let address = thisEmail.address;
                    console.log("address: ", address);
                    console.log("newAddress: ", newEmail);
                    if (address != newEmail) {
                        newEmailArray.push(address);
                        console.log("4.3");
                    }
                    Accounts.removeEmail(Meteor.userId(), address);
                    console.log("4.4");
                });
                newEmailArray.forEach((address) => {
                    console.log("4.5");
                    Accounts.addEmail(Meteor.userId(), address);
                    console.log("address2: ", address);
                });
                //
                // Accounts.removeEmail(Meteor.userId(), newEmail);
                // Meteor.users.update({_id: userId}, {$set: {'emails.0.address': newEmail}});
                // Accounts.addEmail(Meteor.userId(), oldEmail);
                console.log("Meteor.users.findOne({_id:userId}).emails[0].address: ", Meteor.users.findOne({_id:userId}).emails[0].address);
                console.log("4.9");
            }
        }
    },
    'user.deleteEmail'(unwantedEmail) {
        console.log("Entered deleteEmail");
        Accounts.removeEmail(Meteor.userId(), unwantedEmail);
    }
})
