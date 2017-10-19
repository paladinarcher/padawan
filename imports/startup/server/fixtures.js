// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Question, MyersBriggsCategory } from '../../api/questions/questions.js';
import { User } from '../../api/users/users.js';
import { Team } from '../../api/teams/teams.js';
import { Mongo } from 'meteor/mongo';
import { Defaults } from '../both/defaults.js';
import { SrvDefaults } from './defaults.js';
import { TypeReading, ReadingRange, TypeReadingCategory } from '../../api/type_readings/type_readings.js';

Meteor.startup(() => {
    if(Meteor.users.find().count() < 1) {
        let userId = Accounts.createUser({
            username: Defaults.user.username,
            email: Defaults.user.email,
            password: SrvDefaults.user.password,
            isAdmin: Defaults.user.isAdmin,
            profile: Defaults.user.profile,
            teams: [Team.Default.Name]
        });
    }

    /*
    let t = new Team({
        Name: 'Team 3',
        Active: true,
        Description: "Charming",
        CreatedBy: "XRxXSqkiNaiefmb6k"
    });
    t.save();
    */

    // Adding this so that it will auto fix type readings inserted the wrong way. We can remove this once no one has them.
    const RawReadings = TypeReading.getCollection();
    var wrongReadings = RawReadings.find({ "MyersBriggsCategory" : { $exists : true } });
    wrongReadings.forEach((reading) => {
        var newType = new TypeReadingCategory({ MyersBriggsCategory: reading.MyersBriggsCategory, Range: reading.Range });
        delete reading.MyersBriggsCategory;
        delete reading.Range;
        delete reading.TypeReadingCategories;
        RawReadings.update({ _id: reading._id }, { $unset: { MyersBriggsCategory: "", Range: "" } });
        var newReading = new TypeReading(reading);
        newReading._isNew = false;
        newReading.addTypeCategory(newType);
        console.log(newReading);
        newReading.getModified();
        newReading.save();
    });

});
