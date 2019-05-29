import "./mbtiGraphRenderRole.html";
import { User } from "/imports/api/users/users.js";
import { mbtiGraph } from "./mbtiGraph.js";
import { Template } from "meteor/templating";
import { ReactiveVar } from 'meteor/reactive-var';

const data = new ReactiveVar([]);

Template.mbtiGraphRenderRole.onCreated(function() {
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
  let vars = Template.currentData();
  if(vars && vars.data) {
    data.set(JSON.parse(vars.data));
  } else {
    let userId = Meteor.userId();
    let user = User.findOne({ _id: userId });
    let personality = user.MyProfile.UserType.Personality

    data.set([{IE: personality.IE.Value, NS: personality.NS.Value, TF: personality.TF.VAlue, JP: personality.JP.Value, intensity: false}]);
  }
});

Template.mbtiGraphRenderRole.onRendered(function() {
    let canvas = $("#canvas").get(0);
    let curData = data.get();
    curData.forEach(d => {
      mbtiGraph(canvas, d.IE, d.NS, d.TF, d.JP, d.intensity);
    })
    
    // mbtiGraph(canvas, -50, 50, 20, -20);
});