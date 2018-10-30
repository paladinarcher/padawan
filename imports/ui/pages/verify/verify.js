import { User } from '/imports/api/users/users.js';
import './verify.html';

Template.user_profile.onCreated(function () {
    this.autorun( () => {
        this.subscription = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
    });
});

Template.verify.events({
    'click #resend-verify'(event, instance) {
        event.preventDefault();
        FlowRouter.redirect("/profile");
        // Meteor.call( 'user.sendVerificationEmail', () => {
        //     console.log('resent');
        // });
    }
});
