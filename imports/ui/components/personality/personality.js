import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { TypeReading } from '/imports/api/type_readings/type_readings.js';
import { Meteor } from 'meteor/meteor';
import './personality.html';

Template.personality.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else {
        this.userId = Meteor.userId();
    }
    this.autorun( () => { console.log("autorunning...");
        this.subscription = this.subscribe('userData', this.userId, {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
        this.subscription2 = this.subscribe('typereadings.myReadings', this.userId, {
            onStop: function () {
                console.log("Readings subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Readings subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
    });
});

Template.personality.helpers({
    readings() {
        return TypeReading.find({});
    },
    user() {
        return User.findOne({_id:Template.instance().userId});
    },
    opacityByCategory(category, userObj) {
        //console.log(category, userObj); //return;
        if (typeof userObj === "undefined") return false;
        var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
        //console.log(value);
        return (Math.abs(value.Value) * 2) / 100;
    },
    letterByCategory(category, userObj) {
        //console.log(category, userObj); //return;
        let minQuestionsAnswered = 72;
        if (typeof userObj === "undefined") return false;
        var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
        var value = userObj.MyProfile.UserType.Personality[identifier].Value;
        console.log(category, value, identifier);
        if (userObj.MyProfile.AnsweredQuestions.length >= minQuestionsAnswered) {
            return (value === 0 ? "?" : (value < 0 ? identifier.slice(0,1) : identifier.slice(1,2)));
        } else {
            return "?";
        }
    },
    userImageUrl(userObj) {
        if (typeof userObj === "undefined") return false;
        return Gravatar.imageUrl(userObj.emails[0].address, { size: 50, default: 'mm' });
    }
});

Template.personality.events({
    'click div.personality-display'(event, instance) {
        console.log('click div.personality-display =>', event, instance);
        $('#personality-readings').modal('show');
        //$('.Selected-Category').html(newCat);
    }
});

Template.singleReading.helpers({
    getHSize(reading) {
        console.log(reading);
        let count = delta = 0;
        _.forEach(reading.TypeReadingCategories, (cat) => {
            if(cat == null) { return; }
            count++;
            delta += cat.Range.Delta;
        });
        delta /= count;
        if(!reading.Header) { return ""; }
        if(delta >= 50) { return "<h1>"+reading.Header+"</h1>"; }
        if(delta >= 40) { return "<h2>"+reading.Header+"</h2>"; }
        if(delta >= 30) { return "<h3>"+reading.Header+"</h3>"; }
        if(delta >= 20) { return "<h4>"+reading.Header+"</h4>"; }
        if(delta >= 10) { return "<h5>"+reading.Header+"</h5>"; }
        return "<h6>"+reading.Header+"</h6>";
    }
});
