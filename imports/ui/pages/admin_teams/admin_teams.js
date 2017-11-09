import { Team } from '/imports/api/teams/teams.js';
import { TeamGoal } from '/imports/api/team_goals/team_goals.js';
import { User } from '/imports/api/users/users.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import './admin_teams.html';
import '../team_goals/team_goals.js';
import '/imports/ui/components/select_autocomplete/select_autocomplete.js';

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
        this.subscription2 = this.subscribe('teamMemberList', Meteor.userId(), {
            onStop: function () {
                console.log("Team Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Member subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
        this.subscription3 = this.subscribe('teamsData', Meteor.userId(), {
            onStop: function () {
                console.log("teamsData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("teamsData subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });
});

Template.admin_teams.onRendered(function () {
    Meteor.setTimeout( function () {
        $("select.selectized").each(function (s) {
            this.selectize.on('item_add', function(val, $item) {
                let userId = $item.closest("[data-user-id]").data("user-id");
                let teamName = $item.closest("[data-team-name]").data("team-name");

                let t = Team.findOne( {Name: teamName} );
                t.addRole(userId, val);
            });
            this.selectize.on('item_remove', function(val, $item) {
                let userId = this.$control.closest("[data-user-id]").data("user-id");
                let teamName = this.$control.closest("[data-team-name]").data("team-name");

                let t = Team.findOne( {Name: teamName} );
                t.removeRole(userId, val);
            });
        });
    }, 1000);
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
        return memberList;
    },
    uniqueId() {
        var text = "";
        var idLength = 10;
        var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < idLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
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
        return requestList;
    },
    rolesList() {
        let roles = [];
        Roles.getAllRoles().forEach(function (r) {
            roles.push( {
                text: r.name,
                value: r.name
            } );
        });
        return roles;
    },
    users() {
        return User.find().fetch();
    },
    userAddList(teamName) {
        let memberList = Team.findOne( {Name: teamName} ).Members
        let u = User.find({_id: {'$nin': memberList}});
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
        t.userRequestJoin();
    },
    'click a.btn-approve-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne( {_id: teamId} );
        t.adminAcceptJoin(userId);
    },
    'click button.btn-remove-user-role'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).closest("[data-user-id]").data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let role = $(event.target).closest("[data-role]").data("role");
    },
    'click div.team-goal-quick-list'(event, instance) {
        let teamName = $(event.target).closest("[data-team-name]").data("team-name");
        if (teamName) {
            FlowRouter.go("/teamGoals/"+teamName.split(" ").join("-"));
        }
    }
});
