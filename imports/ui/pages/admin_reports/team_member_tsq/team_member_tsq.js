import "./team_member_tsq.html";
import { User } from '/imports/api/users/users.js';

let currentUserDisplayed = new ReactiveVar();

Template.team_member_tsq.onCreated(function () {
    this.autorun(() => {
        this.subscription = this.subscribe('userData', {
            onStop: function () {
                // console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                // console.log("User profile subscription ready! ", arguments, this);
                let userId = FlowRouter.getParam('userId');
                let currentUser = User.findOne({ _id:userId })
                currentUserDisplayed.set(currentUser);
            }
        });
    });
});

Template.team_member_tsq.helpers({
    getCurrentUserDisplayed(){
        let currentUser = currentUserDisplayed.get();
        let result = `Currently viewing ${currentUser.MyProfile.firstName} ${currentUser.MyProfile.lastName}'s TSQ results`;
        return result;
    },
    isAdmin(){
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', '__global_roles__');
        return isAdmin ? true : false;
    }
});
