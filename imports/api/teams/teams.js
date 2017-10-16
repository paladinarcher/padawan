import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { User } from '../users/users.js';

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
            type: [User],
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
        addUsersToTeams(users, teams) {
            if (typeof teams === 'string') {
                teams = [teams];
            }
            if (typeof users === 'string') {
                users = [users];
            }

            for (let j = 0; j < teams.length; j++) {
                let team = Team.findOne({Name:teams[j]});
                team.Members = team.Members.concat(u);
                team.save();
                //todo: add no-permissions role
            }
        },
        removeUsersFromTeams(users, teams) {
            if (typeof teams === 'string') {
                teams = [teams];
            }
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
    }
});

const DefaultTeam = new Team({
    Name: 'No Team',
    Public: true,
    Members: [],
    Active: true
});

export { Team, DefaultTeam };
