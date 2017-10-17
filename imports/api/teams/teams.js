import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { User } from '../users/users.js';
const DefaultTeamID = "NCuypCXN47KrSTeXh";

const Team = Class.create({
    name: "Team",
    collection: new Mongo.Collection('teams'),
    fields: {
        Name: {
            type: String,
            default: 'Whoa! The no-name team?'
        },
        Description: {
        	type: String,
        	default: 'This team is nondescript.'
        },
        Public: {
            type: Boolean,
            default: true
        },
        Members: {
            type: [String],
            default: []
        },
        Active: {
            type: Boolean,
            default: false
        },
        CreatedBy: {
            type: String,
            default: function() { return this.userId; }
        }
    },
    meteorMethods: {
        addUsers(users) {
            if (typeof users === 'string') {
                users = [users];
            }

            this.Members = this.Members.concat( users );
            console.log(this);
            this.save();
            for (let i = 0; i < users.length; i++) {
                Roles.addUsersToRoles(users[i], 'member', this.Name);
            }
        },
        removeUsers(users, teams) {
            if (typeof users === 'string') {
                users = [users];
            }
        },
        userRequestJoin() {
            Roles.addUsersToRoles(Meteor.userId(), 'user-join-request', this.Name);
        },
        adminRequestUserJoin(user) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name) && !Roles.userIsInRole(user, 'member', this.Name)) {
                Roles.addUsersToRoles(user, 'admin-join-request', this.Name);
            }
        },
        userAcceptJoin() {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
                Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
                Roles.addUsersToRoles(Meteor.userId(), 'member', this.Name);
                let u = User.findOne({_id: Meteor.userId()});
                u.teams.push(this.Name);
                u.save();
            }
        },
        userDeclineJoin() {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
                Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
            }
        },
        adminAcceptJoin() {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
                Roles.removeUsersFromRoles(user, 'user-join-request', this.Name);
                Roles.addUsersToRoles(user, 'member', this.Name);
            }
        }
    },
    behaviors: {
        timestamp: {},
        softremove: {}
    },
    secured: {
    },
    events: {
        afterInit(e) {
            //
        },
        beforeSave(e) {
            console.log("before save Team");
        }
    }
});

Team.Default = Team.findOne({_id:DefaultTeamID});
if (typeof Team.Default === "undefined") {
    Team.Default = new Team({
        _id:DefaultTeamID,
        Name: 'No Team',
        Active: true
    });
    if (Meteor.isServer) {
        Team.Default.save();
    }
}

export { Team };
