import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from '/imports/api/users/users.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

var fs = {};
if (Meteor.isServer) {
    fs = Npm.require('fs');
}

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

var intervalObjects = {};
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
        guests: {
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
        },
        skypeUrl: {
            type: String,
            default: ""
        },
        teamId: {
            type: String,
            default: ""
        },
        presentingTimer: {
            type: Number,
            optional: true
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

            //delete duplicate guests
            this.presenters.push(lsUser);

            //Adding Presenter updates the presentingTimer field
            this.presentingTimer = 0;

            if (Meteor.isServer) {
                if (intervalObjects.hasOwnProperty(this._id)) {
                    Meteor.clearInterval(intervalObjects[this._id]);
                    delete intervalObjects[this._id];
                }

                let presentingTimerInterval = Meteor.setInterval(() => {
                    this.presentingTimer++;
                    this.save();
                },1000);

                intervalObjects[this._id] = presentingTimerInterval
            }
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
        removeGuest: function (userId) {
            if ("locked" === this.state) {
                return;
            }
            this.guests = _.filter(this.guests, function (o) {return o.id!==userId});
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

        saveGuest: function (user) {
            if ("locked" === this.state) {
                return;
            }
            var lsUser = new LSUser(user);

            //check for duplicate
            if (typeof _.find(this.guests, function(o) {return o.id===lsUser.id;}) !== "undefined") {
                return false;
            }
            this.guests.push(lsUser);
            UserNotify.add({
                userId: lsUser.id,
                title: 'Learn/Share',
                body: 'You have been added to a Learn/Share session',
                action: 'learnshare:'+this._id
            });
            return this.save();
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
        setSkypeUrl: function (url) {
            if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                this.skypeUrl = url;
                this.save();
            }
        },
        uploadRecording(fileInfo, fileData) {
            if (Meteor.isServer && Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
                let uploadPath = '/uploads/';
                fs.writeFile(uploadPath+this._id+".mp4", fileData, 'binary', (err) => {
                    console.log("File written.", err);
                });
            }
        },
        uniqueParticipants(uid) {
            // check to make sure there are no duplicate guests and participants and remove extra guests
            for (let i = 0; i < this.guests.length; i++) {
                for (let j = 0; j < this.participants.length; j++) {
                    if (this.guests[i].name == this.participants[j].name) {
                        this.removeGuest(this.guests[i].id);


                    }
                }

            }
        },
    }
});

export { LearnShareSession };
