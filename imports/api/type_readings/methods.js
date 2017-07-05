import { Meteor } from 'meteor/meteor';
import { TypeReading, ReadingRange } from './type_readings.js';
import { User, MyersBriggs, Answer, UserType, Profile } from '../users/users.js';
import { MyersBriggsCategory } from "../questions/questions.js";

Meteor.methods({
    'typereadings.insert'(category, header, body, low, high) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let newReading = new TypeReading({ MyersBriggsCategory: parseInt(category), Range: { high:parseInt(high), low:parseInt(low) }, Header:header, Body:body, CreatedBy:Meteor.userId() });
        console.log(category, header, body, low, high, newReading);
        newReading.validate({
            cast: true
        });

        return newReading.save();
    },
    'typereadings.delete'(readingId) {
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }
        let reading = TypeReading.findOne({_id:readingId});
        reading.remove();
    },
});