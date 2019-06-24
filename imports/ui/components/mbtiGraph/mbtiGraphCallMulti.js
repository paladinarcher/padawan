import "./mbtiGraphRenderMulti.html";
import { User } from "/imports/api/users/users.js";
import { mbtiGraphMulti } from "./mbtiGraphMulti.js";
import { Template } from "meteor/templating";
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

const data = new ReactiveVar([]);

Template.mbtiGraphRenderMulti.onCreated(function() {
  this.autorun(() => {
    this.subscription2 = this.subscribe("userList", this.userId, {
      onStop: function() {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function() {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
  });
});

Template.mbtiGraphRenderMulti.helpers({
  graphData() {
      return Session.get('GraphData');
  },
  round(num) {
    return num.toFixed(1);
  }
});  

Template.mbtiGraphRenderMulti.onRendered(function() {
  //canvas.set($("#canvas").get(0));
 // toolTip.set($("#toolTip").get(0));
  // let records = Session.get('records');
  // console.log("records",records);
  // if(records) {
  //   data.set(records);
  // } else {
  //   let userId = Meteor.userId();
  //   let user = User.findOne({ _id: userId });
  //   let personality = user.MyProfile.UserType.Personality

  //   data.set([{IE: personality.IE.Value, NS: personality.NS.Value, TF: personality.TF.VAlue, JP: personality.JP.Value, intensity: false}]);
  // }
  //   let canvas = $("#canvas").get(0);
  //   let curData = data.get();
  //   curData.forEach(d => {
  //     mbtiGraph(canvas, d.IE, d.NS, d.TF, d.JP, d.intensity);
  //   })
    
    // mbtiGraph(canvas, -50, 50, 20, -20);
});

Template.mbtiGraphRenderMulti.events({
  'click .find-name': function(event, instance) {
    let records = Session.get("records");
    let allEl = $('.find-name');
    let curNames = [];
    allEl.each(function() {
      let el = $(this);
      let curName = el.val();
      if(el.is(':checked')) {
        curNames.push(curName);
      }
    });
    if(curNames.length >= 1) {
      mbtiGraphMulti('canvas', records, curNames);
    } else {
      mbtiGraphMulti('canvas', records);
    }
  }
});

Tracker.autorun(function() {
  var records = Session.get("records");
  console.log("Records",records);
  if(records) {
    mbtiGraphMulti('canvas', records);
  }
});