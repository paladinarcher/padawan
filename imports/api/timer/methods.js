import { Meteor } from 'meteor/meteor';
import { Timer } from './timer.js';

let intervalObjects = {};
Meteor.methods({
    'timer.create'(lssid, presenterId) {
        if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        
        let timer = new Timer({
            learnShareSessionId: lssid,
            presenterId: presenterId
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
            },1000);

            intervalObjects[lssid] = presentingTimerInterval;
        }
    }
});
