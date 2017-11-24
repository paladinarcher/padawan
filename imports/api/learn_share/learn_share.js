import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from '/imports/api/users/users.js';

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
        },
        removeParticipant: function (userId) {
            this.participants = _.filter(this.participants, function (o) {return o.id!==userId});
            return this.save();
        },
        addParticipantSelf: function () {
            if (Meteor.userId()) {
                //check for duplicate
                if (typeof _.find(this.participants, function(o) {return o.id===Meteor.userId();}) === "undefined") {
                    let u = User.findOne( {_id: Meteor.userId()} );
                    if (!u) {
                        throw new Meteor.Error(403, "You are not authorized");
                    } else {
                        let lsu = new LSUser({
                            id: Meteor.userId(),
                            name: u.MyProfile.firstName + " " + u.MyProfile.lastName
                        })
                        this.participants.push(lsu);
                        this.save();
                    }
                }
            } else {
                throw new Meteor.Error(403, "You are not authorized");
            }
        },
        saveText: function (title, notes) {
            if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                this.title = title;
                this.notes = notes;
                this.save();
            } else {
                throw new Meteor.Error(403, "You are not authorized");
            }
        }
    }
});

export { LearnShareSession };
