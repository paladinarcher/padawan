import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const UserSegment = Class.create({
    name: 'UserSegment',
    collection: new Mongo.Collection('user_segments'),
    fields: {
        name: {
            type: String,
            default: 'Default user segment'
        },
        description: {
            type: String,
            default: 'The default user segment for relevant content'
        }
    }
});

export { UserSegment };
