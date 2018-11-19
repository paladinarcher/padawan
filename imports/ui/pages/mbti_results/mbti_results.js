import './mbti_results.html';
import { User } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';

Template.mbti_results.onCreated(function () {
    this.autorun( () => {
        console.log("autorunning mbti_results...");
        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
    });
});

Template.mbti_results.helpers({
    users() {
        let u = User.find().fetch();
        userData = [];
        u.forEach((m) => {
            userData.push({
                _id: m._id,
                name: m.MyProfile.firstName + ' ' + m.MyProfile.lastName,
                pTypes: Object.keys(m.MyProfile.UserType.Personality),
                personality: m.MyProfile.UserType.Personality,
            });
        });

        return userData;
    }
});