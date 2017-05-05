import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './personality.html';

Template.personality.onCreated(function () {
    this.autorun( () => { console.log("autorunning...");
        this.subscription = this.subscribe('userData', Meteor.userId(), {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
    });
});

Template.personality.helpers({
    user() {
        return User.findOne({_id:Meteor.userId()});
    },
    opacityByCategory(category, userObj) {
        //console.log(category, userObj); //return;
        var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
        //console.log(value);
        return (Math.abs(value.Value) + 10) / 100;
    },
    letterByCategory(category, userObj) {
        //console.log(category, userObj); //return;
        var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
        var value = userObj.MyProfile.UserType.Personality[identifier].Value;
        console.log(category, value, identifier);
        return (value === 0 ? "?" : (value < 0 ? identifier.slice(0,1) : identifier.slice(1,2)));
    }
});