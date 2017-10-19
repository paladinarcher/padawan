import { Team } from '/imports/api/teams/teams.js';
import { User } from '/imports/api/users/users.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import './admin_teams.html';

Template.admin_teams.onCreated(function () {
    this.autorun( () => {
        console.log("autorunning admin_teams...");
        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
        /*
        this.subscription2 = this.subscribe('teamMemberList', Meteor.userId(), {
            onStop: function () {
                console.log("Team Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Member subscription ready! ", arguments, this);
            }
        });
        */
        console.log(this.subscription2);
        this.subscription3 = this.subscribe('oooteamMemberList', Meteor.userId(), {
            onStop: function () {
                console.log("oooTeam Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("oooTeam Member subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });
});

Template.admin_teams.helpers({
    teams() {
        if (typeof Team === 'undefined') {
            return false;
        }
        let t = Team.find(  ).fetch();
        return t;
    },
    teamMembers(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "member";
        let u = User.find( teamRole );
        if (typeof u === "undefined") {
            return false;
        } else {
            console.log(u.fetch());
        }
        let memberList = [];
        u.forEach((m) => {
            memberList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: m.roles[teamName]
            });
        });
        //if (teamName === "Team 2") {
            console.log("TEAM MEMBER LIST", teamName, memberList);
        //}
        return memberList;
    },
    teamRequests(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "user-join-request";
        let u = User.find( teamRole );

        if (!u) {
            return [];
        }

        let requestList = [];
        u.forEach((m) => {
            requestList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: "user-join-request"
            })
        });
        console.log("teamRequests", requestList);
        return requestList;
    },
    users() {
        return User.find().fetch();
    },
    userAddList(teamName) {
        let u = User.find({teams: {'$ne': teamName}}).fetch();
        let addList = [];
        u.forEach((m) => {
            addList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName
            });
        });
        return addList;
    },
});

Template.admin_teams.events({
    'click button.btn-add-users'(event, instance) {
        //show add-user widget
    },
    'click button.btn-accept-join'(event, instance) {
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        console.log("confirm join team", t);
        t.userAcceptJoin();
    },
    'click button.btn-decline-join'(event, instance) {
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        t.userDeclineJoin();
    },
    'click a.btn-admin-request-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).closest("[data-user-id]").data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne({_id: teamId});
        t.adminRequestUserJoin(userId);
    },
    'click button.btn-user-request-join'(event, instance) {
        event.preventDefault();
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        console.log("Join request for team ", t.Name);
        t.userRequestJoin();
    },
    'click a.btn-approve-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne( {_id: teamId} );
        console.log("yyyyyyyyyyyyyyyy", userId, teamId);
        t.adminAcceptJoin(userId);
    },
    'click button.btn-remove-user-role'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).closest("[data-user-id]").data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let role = $(event.target).closest("[data-role]").data("role");
        console.log("user:" + userId + ", team:" + teamId + ", role:" + role);
    }
});
