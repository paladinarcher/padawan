import "./comment_report.html";
import { Meteor } from "meteor/meteor";
import { UserFeedback } from "../../../api/user_feedback/user_feedback.js";

Template.comment_report.onCreated(function() {
  this.autorun(() => {
    console.log("autorunning comment_report...");
    this.subscription = this.subscribe("userFeedback", {
      onStop: function() {
        console.log("userFeedback subscription stopped: ", arguments, this);
      },
      onReady: function() {
        console.log("userFeedback subscription ready: ", arguments, this);
      }
    });
    console.log("userFeedback subscription: ", this.subscription);
  });
});

Template.comment_report.helpers({
  getReport() {
    userFeedback = UserFeedback.find().fetch();
    return JSON.stringify(userFeedback).slice(1, -1);
  }
});
