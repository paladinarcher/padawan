import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Team } from "./teams.js";
import { User } from "../users/users.js";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { sinon } from "meteor/practicalmeteor:sinon";

FactoryBoy.define("user", User, {
  _id: "1234567899912839",
  services: {
    password: {}
  },
  username: "bestTestUser",
  emails: [],
  slug: "testUser@domain.com",
  MyProfile: {
    firstName: "testUser",
    lastName: "test",
    gender: true,
    UserType: {
      Personality: {},
      AnsweredQuestions: []
    },
    birthDate: new Date("December 17, 1995 03:24:00")
  },
  teams: [],
  roles: {},
  profile: {
    first_name: "testUser",
    last_name: "test",
    gender: "male"
  }
});

FactoryBoy.define("adminUser", User, {
  _id: "999",
  services: {
    password: {}
  },
  MyProfile: {
    firstName: "adminUser",
    lastName: "admin",
    gender: true
  },
  roles: {
    __global_roles__: ["admin"]
  }
});

FactoryBoy.define("Team", Team, {
  Name: "theRealTestTeam",
  Description: "team description",
  CreatedBy: "The Man, The Myth, The Legend.",
  Members: ["coolest member"]
});

if (Meteor.isServer) {
  describe("Team", function () {
    this.timeout(15000);

    it("user can ask to join a team", function () {
      resetDatabase();
      let userAskJoin = FactoryBoy.create("user", {
        _id: "121212121212"
      });
      let testTeam = FactoryBoy.create("Team");

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(userAskJoin);

      testTeam.userRequestJoin();

      myStub.restore();

      const test = Roles.userIsInRole(
        userAskJoin._id,
        "user-join-request",
        "theRealTestTeam"
      );

      chai.assert(test === true, "User does not contain 'user-join-request'");
    });

    it("admin can ask user to join a team", function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", {
        _id: "9923",
        roles: {
          testTeam99: ["member", "admin"]
        }
      });
      let testUser = FactoryBoy.create("user", {
        _id: "4",
        emails: [
          {
            address: "myTest@domain.com",
            verified: false
          }
        ]
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam99",
        Members: [adminUser._id]
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(adminUser);

      testTeam.adminRequestUserJoin(testUser._id);

      myStub.restore();

      const test = Roles.userIsInRole(
        testUser._id,
        "admin-join-request",
        "testTeam99"
      );

      chai.assert(test === true, "Admin was unable to invite user to team");
    });

    it("user can accept team invite", function () {
      resetDatabase();
      let testUser = FactoryBoy.create("user", {
        _id: "48932749081324802395223",
        roles: {
          testTeam9: ["admin-join-request"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam9"
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(testUser._id);

      testTeam.userAcceptJoin();

      myStub.restore();

      const test =
        Roles.userIsInRole(testUser._id, "member", "testTeam9") &&
          Team.findOne({ Members: testUser._id })
          ? true
          : false;

      chai.assert(test === true, "User was unable to join team");
    });

    it("user can decline team invite", function () {
      resetDatabase();
      let userDecline = FactoryBoy.create("user", {
        roles: {
          testTeam: ["admin-join-request"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam"
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(userDecline);

      testTeam.userDeclineJoin();

      myStub.restore();

      const test = !Roles.userIsInRole(
        userDecline._id,
        "admin-join-request",
        "testTeam"
      );

      chai.assert(test === true, "User still contains 'admin-join-request'");
    });

    it("admin can accept user join request", function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", {
        _id: "9976",
        roles: {
          testTeam88: ["member", "admin"]
        }
      });
      let testUser = FactoryBoy.create("user", {
        _id: "4837219407980312",
        roles: {
          testTeam88: ["user-join-request"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam88",
        Members: [adminUser._id]
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(adminUser);

      testTeam.adminAcceptJoin(testUser._id);

      myStub.restore();

      const test =
        Roles.userIsInRole(testUser._id, "member", "testTeam88") &&
          Team.findOne({ Members: testUser._id })
          ? true
          : false;

      chai.assert(test === true, "User was unable to join team");
    });

    it("admin can reject user join request", function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser");
      let testUser = FactoryBoy.create("user", {
        _id: "7849237094",
        roles: {
          testTeam2: ["user-join-request"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam2"
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(adminUser);

      testTeam.adminRejectJoin(testUser);

      myStub.restore();

      const test = !Roles.userIsInRole(
        testUser._id,
        "user-join-request",
        "testTeam2"
      );

      chai.assert(
        test === true,
        "Admin not signed in, or user still contains 'user-join-request'"
      );
    });

    it("admin can add team role to team member", function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", {
        _id: "9998"
      });
      let testUser = FactoryBoy.create("user", {
        _id: "1092834774930189734",
        roles: {
          testTeam3: ["member"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam3"
      });
      const newRole = "developer";

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(adminUser);

      testTeam.addRole(testUser, newRole);

      myStub.restore();

      const test = Roles.userIsInRole(testUser._id, newRole, "testTeam3");

      chai.assert(
        test === true,
        "Admin not signed in, or user does not contain new role"
      );
    });

    it("admin can remove team role from team member", function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", {
        _id: "9997"
      });
      let testUser = FactoryBoy.create("user", {
        _id: "4320918423109432",
        roles: {
          testTeam4: ["member", "admin"]
        }
      });
      let testTeam = FactoryBoy.create("Team", {
        Name: "testTeam4"
      });

      let myStub = sinon.stub(Meteor, "userId");
      myStub.returns(adminUser);

      testTeam.removeRole(testUser, "admin");

      myStub.restore();

      const test = !Roles.userIsInRole(testUser._id, "admin", "testTeam4");

      chai.assert(
        test === true,
        "Admin not signed in, or user role was not removed"
      );
    });
    // Team -> meteorMethods -> updateFromObj
    it('updateFromObj updates Team information based on object', function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", { _id: "9997" });
      let testUser = FactoryBoy.create("user", { _id: "4320918423109432", roles: { testTeam4: ["member", "admin"] } });
      let testTeamAdmin = FactoryBoy.create("Team", { Name: "testTeamAdmin" });
      let testTeamNonAdmin = FactoryBoy.create("Team", { Name: "testTeamNonAdmin" });
      let saveObjAdmin = { Name: "#team-title-42", Description: "#team-description-42" };
      let saveObjNonAdmin = { Name: "#team-title-33", Description: "#team-description-33" };

      let myStub = sinon.stub(Meteor, "userId");
      // console.log('testTeamAdmin: ', testTeamAdmin);
      myStub.returns(adminUser._id);
      testTeamAdmin.updateFromObj(saveObjAdmin);
      myStub.restore();
      let tta = Team.find({ Name: "#team-title-42" }).fetch()[0];
      chai.assert.strictEqual(testTeamAdmin._id, tta._id, 'tta and testTeamAdmin should have the same _id');
      chai.assert.strictEqual('#team-description-42', tta.Description, 'tta Description should be #team-description-42');
      chai.assert.strictEqual('The Man, The Myth, The Legend.', tta.CreatedBy, 'tta should be CreatedBy the legend');


      myStub.returns('4222224242423333333');
      testTeamNonAdmin.updateFromObj(saveObjNonAdmin);
      myStub.restore();
      let ttnaAttempt = Team.find({ Name: "#team-title-33" }).fetch();
      let ttnaOld = Team.find({ Name: "testTeamNonAdmin" }).fetch()[0];
      chai.assert.isTrue(Array.isArray(ttnaAttempt), 'ttnaAttempt should be an empty array');
      chai.assert.strictEqual('team description', ttnaOld.Description, 'ttnaOld Description should be team description');
      chai.assert.strictEqual('The Man, The Myth, The Legend.', ttnaOld.CreatedBy, 'ttnaOld should be CreatedBy the legend');

    });
    // Team -> meteorMethods -> uploadIcon
    it('uploadIcon uploads a file that can later be decoded', function () {
      resetDatabase();
      let adminUser = FactoryBoy.create("adminUser", { _id: "9997" });
      let testUser = FactoryBoy.create("user", { _id: "4320918423109432", roles: { testTeam4: ["member", "admin"] } });
      let testTeamAdmin = FactoryBoy.create("Team", { Name: "testTeamAdmin" });
      let testTeamNonAdmin = FactoryBoy.create("Team", { Name: "testTeamNonAdmin" });
      let saveObjAdmin = { Name: "#team-title-42", Description: "#team-description-42" };
      let saveObjNonAdmin = { Name: "#team-title-33", Description: "#team-description-33" };

      let txt = 'this is the decoded text for a file';
      testTeamAdmin.uploadIcon({}, txt);
      let updatedTta = Team.find({ _id: testTeamAdmin._id }).fetch()[0];
      chai.assert.strictEqual(txt, Buffer.from(updatedTta.Icon64, 'base64').toString(), 'updatedTta did not decode Icon64 correctly');
    });
    // Team -> helpers -> removeUsers (needs to be updated)
    // Team -> helpers -> removeUsersFromTeamRoles (needs to be updated)
  });
}
