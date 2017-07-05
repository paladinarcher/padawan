import { Class } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { MyersBriggsCategory } from '../questions/questions.js';
import { Category, CategoryManager } from '../categories/categories.js';

const ReadingRange = Class.create({
    name: "ReadingRange",
    fields: {
        high: {
            type: Number,
            default: 50
        },
        low: {
            type: Number,
            default: 0
        },
        Delta: {
            type: Number,
            default: 50
        }
    },
    helpers: {
        in(val) {
            return this.low <= val && val <= this.high;
        },
        setDelta() {
            this.Delta = this.high - this.low;
            return this;
        }
    }
});
ReadingRange.Create = function(high, low) {
    let m = new ReadingRange();
    m.high = high;
    m.low = low;
    return m.setDelta();
}
ReadingRange.FullHigh = function () {
    return ReadingRange.Create(50, 0);
}
ReadingRange.FullLow = function () {
    return ReadingRange.Create(0, -50);
}
const TypeReading = Class.create({
    name: "TypeReading",
    collection: new Mongo.Collection('type_readings'),
    fields: {
        MyersBriggsCategory: {
            type: MyersBriggsCategory
        },
        Categories: {
            type: CategoryManager,
            default: function () {
                return CategoryManager.OfType("TypeReading");
            }
        },
        Range: {
            type: ReadingRange,
            default: function () {
                return ReadingRange.FullHigh;
            }
        },
        Header: {
            type: String,
            default: ""
        },
        Body: {
            type: String,
            default: ""
        },
        CreatedBy: {
            type: String,
            default: function() { return Meteor.userId(); }
        }
    },
    helpers: {
        
    },
    events: {
        beforeSave(e) {
            console.log(arguments);
            e.target.Range.setDelta();
            if(e.target.Categories.length() < 1) {
                console.log("Categories there be none, adding default");
                e.target.Categories.addCategory(Category.Default);
            } else { 
                console.log("Categories there be "+e.target.Categories.length()+", adding none.");
            }
        }
    }
});

export { TypeReading, ReadingRange };