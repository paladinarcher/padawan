import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const LSUser = Class.create({
    name: 'LSUser',
    fields: {
        id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'John Doe'
        }
    }
});

const LearnShareSession = Class.create({
    name: "LearnShareSession",
    collection: new Mongo.Collection('learn_share'),
    fields: {
        title: {
            type: String,
            default: "unnamed Learn/Share session"
        },
        notes: {
            type: String,
            default: "duly noted"
        },
        participants: {
            type: [LSUser],
            default: []
        },
        presenters: {
            type: [LSUser],
            default: []
        }
    },
    behaviors: {
        timestamp: {}
    },
    meteorMethods: {
        addPresenter: function (user) {
            var lsUser = new LSUser(user);

            //check for duplicate
            if (typeof _.find(this.presenters, function(o) {return o.id===lsUser.id;}) !== "undefined") {
                return false;
            }
            this.presenters.push(lsUser);
            return this.save();
        },
        addParticipant: function (user) {
            var lsUser = new LSUser(user);

            //check for duplicate
            if (typeof _.find(this.participants, function(o) {return o.id===lsUser.id;}) !== "undefined") {
                return false;
            }
            this.participants.push(lsUser);
            return this.save();
        }
    }
});

export { LearnShareSession };
