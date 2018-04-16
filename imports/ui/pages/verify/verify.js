import './verify.html';

Template.verify.events({
    'click #resend-verify'(event, instance) {
        event.preventDefault();
        Meteor.call( 'user.sendVerificationEmail', () => {
            console.log('resent');
        });
    }
});
