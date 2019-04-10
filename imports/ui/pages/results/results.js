import { Meteor } from "meteor/meteor";
import { User } from "../../../api/users/users.js";
import "./results.html";

Template.results.onCreated(function() {
  if (this.data.userId) {
    this.userId = this.data.userId;
  } else {
    this.userId = Meteor.userId();
  }
});

Template.results.helpers({
  user() {
    let user = User.findOne({ _id: Template.instance().userId });
    return user;
  },

  results(category, userObj, mbtiNumber) {
    let identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(
      category
    );

    let identifierValue =
      userObj.MyProfile.UserType.Personality[identifier].Value;

    let percentageValue =
      userObj.MyProfile.UserType.Personality[
        userObj.MyProfile.UserType.Personality.getIdentifierById(category)
      ];

    let percentage = Math.ceil(Math.abs(percentageValue.Value));

    //checking if INTJ on screen and if user personality is INT or J
    if (mbtiNumber === 6 && identifierValue < 0) {
      return 50 + percentage;
      //checking if INTJ on screen and if user personality is ESF or P
    } else if (mbtiNumber === 6 && identifierValue > 0) {
      return 50 - percentage;
    }

    //checking if ESFP on screen and if user personality is ESF or P
    if (mbtiNumber === 7 && identifierValue > 0) {
      return 50 + percentage;
      //checking if ESFP on screen and if user personality is INT or J
    } else if (mbtiNumber === 7 && identifierValue < 0) {
      return 50 - percentage;
    }
  }
});

Template.results.events({
  "click a#results_descriptions"(event, instance) {
    event.preventDefault();
    FlowRouter.go("/resultsDescriptions");
  }
});
