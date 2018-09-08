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
    var defaultUserId;
    if(Meteor.users.find().count() < 1) {
        defaultUserId = Accounts.createUser({
            username: Defaults.user.username,
            email: Defaults.user.email,
            password: SrvDefaults.user.password,
            isAdmin: Defaults.user.isAdmin,
            profile: Defaults.user.profile,
            teams: [Team.Default.Name]
        });
        let t = Team.findOne( {Name: Team.Default.Name} );
        t.CreatedBy = userId;
        t.save();
    }

    //add all existing members to the default team
    let teamUserIdList = [];
    User.find( {} ).forEach( (u) => {
        teamUserIdList.push(u._id);
        Roles.addUsersToRoles(u._id, 'member', Team.Default.Name);
        if (Roles.userIsInRole(u._id, 'admin', Roles.GLOBAL_GROUP)) {
            Roles.addUsersToRoles(u._id, 'admin', Team.Default.Name);
        } else {
            Roles.addUsersToRoles(u._id, Defaults.role.name, Team.Default.Name);
        }
    });
    //Team.Default.Members = Team.Default.Members.concat(teamUserIdList);
    Team.Default.Members = teamUserIdList;
    Team.Default.save();

    let existingRoleNames = [];
    Roles.getAllRoles().forEach(function (r) {
        existingRoleNames.push(r.name);
    });
    let possibleRoles = ["admin","view-goals","view-members","member","mentor","assigned","manage-users","learn-share-host","developer"];
    for (let i in possibleRoles) {
        if (existingRoleNames.indexOf(possibleRoles[i]) === -1) {
            Roles.createRole(possibleRoles[i]);
        }
    }

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

    //convert questions with single category to array of categories
    let qs = Question.find( {Categories: {$exists: false}} );
    if (qs) {
        qs.forEach(function (q) {
            q.Categories = [q.Category];
            q.save();
        });
    }

    var fs = Npm.require('fs');
    var uploadPath = SrvDefaults.uploadPath;
    try {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
    } catch (e) {
        console.log(e);
    }
  	WebApp.connectHandlers.use('/learnShareRecording', (req, res, next) => {
    		let fileName = req.url.split('/')[1];

            if (fs.existsSync(uploadPath+fileName)) {
        		res.writeHead(200, { 'Content-Type': 'video/mp4' });

                fs.readFile(uploadPath+fileName, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.write(data);
                        res.end();
                    }
                });

            } else {
                console.log("file does not exist");
                res.writeHead(404);
                res.write('404 not found');
                res.end();
            }
  	});
/////////////////////////////////////BELOW IS FOR SAMPLE DATA////////////////////////////////////////
    if (!Meteor.users.findOne({username: "FlyingCockroach"})) {
        Accounts.createUser({
            username: "FlyingCockroach",
            email: "FlyingCockroach@mydomain.com",
            password: "password",
            profile: {
                first_name: "Bob",
                last_name: "Thompson",
                gender: "male"
            }
        });
    }
    if (!Meteor.users.findOne({username: "NapkinRescuer"})) {
        Accounts.createUser({
            username: "NapkinRescuer",
            email: "NapkinRescuer@mydomain.com",
            password: "password",
            profile: {
                //publicly visible fields like firstname goes here
                first_name: "Lisa",
                last_name: "Flingy",
                gender: "female"
            }
        });
    }
    if (!Meteor.users.findOne({username: "AprilMay"})) {
        Accounts.createUser({
            username: "AprilMay",
            email: "AprilMay@mydomain.com",
            password: "password",
            profile: {
                //publicly visible fields like firstname goes here
                first_name: "April",
                last_name: "May",
                gender: "female"
            }
        });
    }
    if (!Meteor.users.findOne({username: "TimothyTime"})) {
        Accounts.createUser({
            username: "TimothyTime",
            email: "TimothyTime@mydomain.com",
            password: "password",
            profile: {
                //publicly visible fields like firstname goes here
                first_name: "Timy",
                last_name: "Tim",
                gender: "male"
            }
        });
    }
    if (!Meteor.users.findOne({username: "YellowMouse"})) {
        Accounts.createUser({
            username: "YellowMouse",
            email: "YellowMouse@mydomain.com",
            password: "password",
            profile: {
                //publicly visible fields like firstname goes here
                first_name: "Mo",
                last_name: "Moose",
                gender: "male"
            }
        });
    }
});
