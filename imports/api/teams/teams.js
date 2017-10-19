import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { User } from '../users/users.js';
import { Defaults } from '/imports/startup/both/defaults.js';
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
                this.addUsers(Meteor.userId());
            }
        },
        userDeclineJoin() {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
                Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
            }
        },
        adminAcceptJoin(userId) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
                Roles.removeUsersFromRoles(userId, 'user-join-request', this.Name);
                Roles.addUsersToRoles(userId, 'member', this.Name);
                this.addUsers(userId);
            }
        }
    },
    helpers: {
        addUsers(users) {
            if (typeof users === 'string') {
                users = [users];
            }

            this.Members = this.Members.concat( users );
            for (let i = 0; i < users.length; i++) {
                Roles.addUsersToRoles(users[i], 'member', this.Name);

                //if team doesn't have an admin, the first user added becomes admin
                if (i == 0 && Roles.getUsersInRole('admin', this.Name).count() == 0) {
                    Roles.addUsersToRoles(users[i], 'admin', this.Name);
                } else {
                    Roles.addUsersToRoles(users[i], Defaults.role.name, this.Name);
                }
                let u = User.findOne( {_id: users[i]} );
                if (u && u.teams.indexOf(this.Name) === -1) {
                    u.teams.push(this.Name);
                    u.save();
                }
            }
            this.save();
        },
        removeUsers(users, teams) {
            if (typeof users === 'string') {
                users = [users];
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
            console.log("before save Team", e.currentTarget.Name, e.currentTarget.Members);
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
        Team.Default.CreatedBy = 'kkcDYH3ix4f4Lb5qk';
        console.log(Team.Default);
        Team.Default.save();
    }
}

export { Team };
