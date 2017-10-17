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
        this.subscription2 = this.subscribe('teamMemberList', Meteor.userId(), {
            onStop: function () {
                console.log("Team Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Member subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
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
        let u = User.find( {teams: teamName} );
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
        if (teamName === "Team 2") {
            console.log(teamName, memberList);
        }
        return memberList;
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
        let teamName = $(event.target).data("team-name");
        let t = Team.findOne({Name: teamName});
        t.userAcceptJoin();
    },
    'click button.btn-decline-join'(event, instance) {
        let teamName = $(event.target).data("team-name");
        let t = Team.findOne({Name: teamName});
        t.userDeclineJoin();
    },
    'click a.btn-admin-request-join'(event, instance) {
        event.preventDefault();
        let user = $(event.target).closest("[data-user-id]").data("user-id");
        let teamName = $(event.target).closest("[data-team-name]").data("team-name");
        let t = Team.findOne({Name: teamName});
        t.adminRequestUserJoin(user);
    }
});
