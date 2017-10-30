import { Meteor } from 'meteor/meteor';
import { LearnShareSession } from '../learn_share.js';

Meteor.publish('learnShareList', function() {
    if (this.userId) {
        return LearnShareSession.find( {}, {
            fields: { title: 1 }
        });
    } else {
        return [ ];
    }
});

Meteor.publish('learnShareDetails', function(lssid) {
    if (this.userId) {
        return LearnShareSession.find( {_id:lssid} );
    } else {
        return [ ];
    }
});
