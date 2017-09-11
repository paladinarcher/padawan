import { Meteor } from 'meteor/meteor';
import { TypeReading, ReadingRange, TypeReadingCategory, TypeReadingCategories } from './type_readings.js';
import { User, MyersBriggs, Answer, UserType, Profile } from '../users/users.js';
import { MyersBriggsCategory } from "../questions/questions.js";

Meteor.methods({
    'typereadings.insert'(header, body) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let newReading = new TypeReading({ Header:header, Body:body, CreatedBy:Meteor.userId() });
        console.log(header, body, newReading);
        newReading.validate({
            cast: true
        });

        return newReading.save();
    },
    'typereadings.addCategoryToReading'(readingId, category, high, low) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let reading = TypeReading.findOne({_id:readingId});
        let catReading = new TypeReadingCategory();
        catReading.MyersBriggsCategory = parseInt(category);
        catReading.Range = new ReadingRange();
        catReading.Range.high = parseInt(high);
        catReading.Range.low = parseInt(low);
        console.log(catReading);
        reading.addTypeCategory(catReading);
        reading.save();
    },
    'typereadings.delete'(readingId) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let reading = TypeReading.findOne({_id:readingId});
        reading.remove();
    },
    'typereadings.toggle'(readingId) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let reading = TypeReading.findOne({_id:readingId});
        reading.toggle();
    },
});