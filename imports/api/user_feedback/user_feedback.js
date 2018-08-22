import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const UserFeedback = Class.create({
    name: 'UserFeedback',
    collection: new Mongo.Collection('user_feedback'),
    fields: {
        userId: {
            type: String,
            default: ''
        },
        source: {
            type: String,
            default: ''
        },
        context: {
            type: String,
            default: ''
        },
        comment: {
            type: String,
            default: ''
        },
        dateCreated: {
            type: Date,
            default: function() { return new Date(); }
        }
    }
});

export { UserFeedback };
