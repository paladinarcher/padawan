import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from '/imports/api/users/users.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

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
        },
        state: {
            type: String,
            default: "active"
        }
    },
    behaviors: {
        timestamp: {}
    },
    meteorMethods: {
        addPresenter: function (user) {
            if ("locked" === this.state) {
                return;
            }
            var lsUser = new LSUser(user);

            //check for duplicate
            if (typeof _.find(this.presenters, function(o) {return o.id===lsUser.id;}) !== "undefined") {
                return false;
            }
            this.presenters.push(lsUser);
            return this.save();
        },
        addParticipant: function (user) {
            if ("locked" === this.state) {
                return;
            }
            var lsUser = new LSUser(user);

            //check for duplicate
            if (typeof _.find(this.participants, function(o) {return o.id===lsUser.id;}) !== "undefined") {
                return false;
            }
            this.participants.push(lsUser);
            UserNotify.add({
                userId: lsUser.id,
                title: 'Learn/Share',
                body: 'You have been added to a Learn/Share session',
                action: 'learnshare:'+this._id
            });
            return this.save();
        },
        removeParticipant: function (userId) {
            if ("locked" === this.state) {
                return;
            }
            this.participants = _.filter(this.participants, function (o) {return o.id!==userId});
            return this.save();
        },
        removePresenter: function (userId) {
            if ("locked" === this.state) {
                return;
            }
            this.presenters = _.filter(this.presenters, function (o) {return o.id!==userId});
            return this.save();
        },
        addParticipantSelf: function () {
            if ("locked" === this.state) {
                return;
            }
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
        saveGuest: function(guestId, guestName) {
            if ("locked" === this.state) {
                return;
            }
            let guestObj = _.find(this.participants, function(o) {return o.id===guestId;});
            if ("undefined" !== typeof guestObj) {
                this.participants = _.filter(this.participants, function(o) {return o.id!==guestId});
                guestObj.name = guestName;
            } else {
                guestObj = new LSUser({id: guestId, name: guestName});
            }
            this.participants.push(guestObj);
            this.save();
        },
        saveText: function (title, notes) {
            if ("locked" === this.state) {
                return;
            }
            if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                this.title = title;
                this.notes = notes;
                this.save();
            } else {
                throw new Meteor.Error(403, "You are not authorized");
            }
        },
        lockSession: function (title, notes) {
            if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                this.state = "locked";
                this.save();
            } else {
                throw new Meteor.Error(403, "You are not authorized");
            }
        },
        unlockSession: function (title, notes) {
            if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                this.state = "active";
                this.save();
            } else {
                throw new Meteor.Error(403, "You are not authorized");
            }
        },
    }
});

export { LearnShareSession };
