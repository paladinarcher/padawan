import "./behavior_pattern_area_render.html";
import { User } from "/imports/api/users/users.js";
import { behavior_pattern_area } from "./behavior_pattern_area.js";
import { Template } from "meteor/templating";

Template.behavior_pattern_area_render.onCreated(function() {
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

Template.behavior_pattern_area_render.onRendered(function() {
    let canvas = $("#bpaCanvas").get(0);
    let userId = this.data.mbtiUID;
    let user = User.findOne({ _id: userId });
    let personality = user.MyProfile.UserType.Personality

    let valueIE = personality.IE.Value
    let valueNS = personality.NS.Value
    let valueTF = personality.TF.Value
    let valueJP = personality.JP.Value
    behavior_pattern_area(canvas, valueIE, valueNS, valueTF, valueJP, '0.5', '0, 0, 0');
    // behavior_pattern_area(canvas, -50, 50, 20, -20, 0.5, '128, 0, 0');

    // ----uncomment for random personality----
    // function rn() {
    //   return (Math.random() * 100) -50
    // }
    // behavior_pattern_area(canvas, rn(), rn(), rn(), rn(), 0.5, '0, 0, 0');
});
