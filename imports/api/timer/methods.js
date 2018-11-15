import { Meteor } from 'meteor/meteor';
import { Timer } from './timer.js';
//import { Session } from './session_timer.js';

let intervalObjects = {};
let intervalObjectsCd = {};

Meteor.methods({
    'timer.create'(lssid, presenterId, duration) {
        if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        
        let timer = new Timer({
            learnShareSessionId: lssid,
            presenterId: presenterId,
            duration: duration
        });
        timer.save();

        // Start timer
        if (Meteor.isServer) {
            if (intervalObjects.hasOwnProperty(lssid)) {
                Meteor.clearInterval(intervalObjects[lssid]);
                delete intervalObjects[lssid];
            }

            let presentingTimerInterval = Meteor.setInterval(() => {
                timer.time++;
                timer.save();

                if (timer.time === duration) {
                    Meteor.clearInterval(presentingTimerInterval);
                    if (intervalObjects.hasOwnProperty(lssid)) {
                        delete intervalObjects[lssid];
                    }
                }
            },1000);

            intervalObjects[lssid] = presentingTimerInterval;
        }
    },
    'timer.stop'(lssid) {
        if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        if (intervalObjects.hasOwnProperty(lssid)) {
            Meteor.clearInterval(intervalObjects[lssid]);
            delete intervalObjects[lssid];
        }
    },

    'timer.countdown'(lssid, duration) {
        if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        
        let timer = new Timer({
            learnShareSessionId: lssid,
            presenterId: "countdown",
            duration: duration,
            time: duration
        });
        timer.save();

        // Start timer
        if (Meteor.isServer) {
            let presentingTimerInterval = Meteor.setInterval(() => {
                timer.time--;
                timer.save();

                if (timer.time === 0) {
                    Meteor.clearInterval(presentingTimerInterval);
                }
            },1000);

            intervalObjectsCd[lssid] = presentingTimerInterval;
        }
    },

    'timer.cdstop'(lssid) {
        if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        if (intervalObjectsCd.hasOwnProperty(lssid)) {
            Meteor.clearInterval(intervalObjectsCd[lssid]);
            delete intervalObjectsCd[lssid];
        }
    },
});

