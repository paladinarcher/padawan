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
        },
        remainingTime: {
            type: String,
            default: '',
            resolve(doc) {
                const time = doc.time
                const min = Math.floor(time / 60)
                const aMin = ('0' + min).slice(-2);
                const sec = Math.floor(time - min * 60);
                const aSec = ('0' + sec).slice(-2);
                return `${aMin}:${aSec}`
            }
        }
    },
});

export { Timer };
