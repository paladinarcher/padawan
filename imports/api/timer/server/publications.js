import { Meteor } from 'meteor/meteor';
import { Timer } from '../timer.js';


Meteor.publish('timersData', function ( lssid ) {
    return Timer.find({ learnShareSessionId:lssid });
});