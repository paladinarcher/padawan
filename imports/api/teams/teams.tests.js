import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Team } from "./teams.js";
import { UserNotify } from "../user_notify/user_notify.js";
import { User } from "../users/users.js";
import { resetDatabase } from "meteor/xolvio:cleaner";

// const teams = require("./teams.js");

// let testData = {
//   team: {
//     Name: "testName",
//     Description: "unit test",
//     Icon64: "test icon"
//   },
//   user: {
//     id: "Xz4XTeeb5YEj5J3f3",
//     name: "Test User"
//   }
// };

// FactoryBoy.define("User", User, {});
// let adminUser = new User({
//   _id: "12345",
//   roles: "admin"
// });

// let myUser = new User({
//   _id: "67891",
//   roles: "member"
// });

// FactoryBoy.define("Team", Team, {
//   Name: "team name",
//   Description: "team description",
//   CreatedBy: adminUser._id
// });

// FactoryBoy.define("UserNotify", UserNotify, {
//   userId: myUser._id,
// });

if (Meteor.isServer) {
  describe("Team", function() {
    this.timeout(15000);
    it("user can ask to join a team", function() {
      // console.log(myUser);
      // let newUserNotify = new UserNotify(FactoryBoy.build("UserNotify"));
      // console.log("UserNotify here: ", newUserNotify);
      // Roles.addUsersToRoles(myUser._id, "user-join-request", "myUser");
      // console.log("The new UserNotify here: ", newUserNotify);
      // let user = FactoryBoy.build("User");
      // let newTeam = new Team(FactoryBoy.build("Team"));
      // newTeam.save();
      // console.log("testUser", myUser);
      // console.log("newTeam", newTeam);
      // newTeam.Members = user.name;
      // console.log("the new newTeam", newTeam);
      // let test = Team.findOne({ Members:'user.name' });
      // console.log("test", test);
      // chai.assert(test, true);
    });
    it("admin can ask user to join a team", function() {
      // console.log("This is the admin: ", adminUser);
      // let user = FactoryBoy.build("user");
      // let newTeam = new Team(FactoryBoy.build("Team"));
      // console.log("newTeam", newTeam);
      // newTeam.adminRequestUserJoin(user);
      // console.log("new usernotify right here: ", newUserNotify);
      // console.log("The new newTeam", newTeam);
      //   let result = teams.adminRequestUserJoin(user);
      //   chai.assert(result, true);
    });
    it("user can accept team invite");
    it("user can decline team invite");
    it("admin can accept user join request");
    it("admin can reject user join request");
    it("admin can add team role to team member");
    it("admin can remove team role from team member");
  });
}
