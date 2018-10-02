import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

const Timers = new Mongo.Collection('timers');
const Timer = Class.create({
    name: 'Timer',
    collection:Timers,
    fields: {
        learnShareSessionId: {
            type: String
        },
        presenterId: {
            type: String
        },
        time: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number
        }
    }
});

export { Timer };
