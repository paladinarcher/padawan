// Client entry point, imports all client code

import '/imports/startup/both';
import '/imports/startup/client';

// Accounts.onEmailVerificationLink((token, done) => {
//     console.log("token: ", token);
//     Accounts.verifyEmail(token, (error) => {
//         if (error) {
//             console.log("Error: ", error);
//         } else {
//             console.log("Email is verified");
//             done();
//         }
//     });
// });
