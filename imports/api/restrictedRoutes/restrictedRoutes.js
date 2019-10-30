import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const RestrictedRoutes = Class.create({
    name: "RestrictedRoutes",
    collection: new Mongo.Collection('restrictedRoutes'),
    fields: {
        routeName: {
            type: String,
            default: ''
        },
        teamNames: {
            type: [String],
            default: ['Developer']
        },
    },
    indexes: {
        nameIndex: {
            fields: {
                routeName: 1
            },
            options: {
                unique: true
            },
        }
    },
    meteorMethods: {

    },
    helpers: {
        addTeams(teams) {
            if (typeof teams === 'string') {
                teams = [teams];
            }
            for (let i = 0; i < teams.length; i++) {
                if (this.teamNames.indexOf(teams[i]) === -1) {
                    this.teamNames.push( teams[i] );
                }
            }
            this.save();
        },
        removeTeams(teams) {
            if (typeof teams === 'string') {
                teams = [teams];
            }
            for (let i = 0; i < teams.length; i++) {
                let idx = this.teamNames.indexOf(teams[i]);
                if (idx !== -1) {
                    this.teamNames.splice( idx, 1 );
                }
            }
            this.save();
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
            //
        }
    }
});

export { RestrictedRoutes };