Meteor.subscribe('userData');
global.Buffer = global.Buffer || require("buffer").Buffer;
/*Meteor.subscribe('teamsData', Meteor.userId(), {
    onReady: function() {
        console.log("teamsData subscription ready");
    }
}); */

// Accounts.onEmailVerificationLink((token, done) => {
//     console.log("token: ", token);
//     Accounts.verifyEmail(token, (error) => {
//         if (error) {
//             console.log("Error: ", error);
//         } else {
//             console.log("Email is verified");
//
//
//
//             // FlowRouter.redirect('/profile', {
//             // 	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
//             //     name: 'profile',
//             //     action(params, queryParams) {
//             //         BlazeLayout.render('App_body', { top: 'header', main: 'user_profile' });
//             //     }
//             // });
//
//             done();
//         }
//     });
// });
