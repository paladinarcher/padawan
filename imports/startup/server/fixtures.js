// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Question, MyersBriggsCategory } from '../../api/questions/questions.js';
import { User } from '../../api/users/users.js';
import { Team } from '../../api/teams/teams.js';
import { Mongo } from 'meteor/mongo';
import { Defaults } from '../both/defaults.js';
import { SrvDefaults } from './defaults.js';
import { TypeReading, ReadingRange, TypeReadingCategory } from '../../api/type_readings/type_readings.js';
import { LearnShareSession } from '../../api/learn_share/learn_share.js';


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

    // if del is 1, remove previously added data
    let delPrevious = 1;
    if (delPrevious == 1) {
        // delete users
        let usrList = Meteor.users.find().fetch();
        usrList.forEach((thisUsr) => {
            // delet all users except the admin
            if (thisUsr.username != "admin") {
                Meteor.users.remove(thisUsr._id);
            }
        });

        // delete questions
        Question.remove({});

        // delete teams
        let tmList = Team.find().fetch();
        tmList.forEach((thisTm) => {
            // delet all users except the admin
            if (thisTm.Name != "No Team") {
                Team.remove(thisTm._id);
            }
        });

        // delete LearnShareSession's
        let lsList = LearnShareSession.find().fetch();
        lsList.forEach((thisLS) => {
            if (thisLS.notes != "duly noted") {
                LearnShareSession.remove(thisLS._id);
            }
        });
    }

    // the samples won't be added if addSamples is not 1
    const usrNames = ["FlyingCockroach", "NapkinRescuer", "AprilMay", "TimothyTime", "YellowMouse"];
    let theAdmin = Meteor.users.findOne({ username: "admin" });
    let addSamples = 1;
    if (addSamples == 1) {
        // add users
        if (!Meteor.users.findOne({username: usrNames[0]})) {
            Accounts.createUser({
                username: usrNames[0],
                email: "FlyingCockroach@mydomain.com",
                password: "password",
                profile: {
                    first_name: "Bob",
                    last_name: "Thompson",
                    gender: "male"
                }
            });
        }
        if (!Meteor.users.findOne({username: usrNames[1]})) {
            Accounts.createUser({
                username: usrNames[1],
                email: "NapkinRescuer@mydomain.com",
                password: "password",
                profile: {
                    first_name: "Lisa",
                    last_name: "Flingy",
                    gender: "female"
                }
            });
        }
        if (!Meteor.users.findOne({username: usrNames[2]})) {
            Accounts.createUser({
                username: usrNames[2],
                email: "AprilMay@mydomain.com",
                password: "password",
                profile: {
                    first_name: "April",
                    last_name: "May",
                    gender: "female"
                }
            });
        }
        if (!Meteor.users.findOne({username: usrNames[3]})) {
            Accounts.createUser({
                username: usrNames[3],
                email: "TimothyTime@mydomain.com",
                password: "password",
                profile: {
                    first_name: "Timy",
                    last_name: "Tim",
                    gender: "male"
                }
            });
            console.log("this: ", this);
        }
        if (!Meteor.users.findOne({username: usrNames[4]})) {
            Accounts.createUser({
                username: usrNames[4],
                email: "YellowMouse@mydomain.com",
                password: "password",
                profile: {
                    first_name: "Mo",
                    last_name: "Moose",
                    gender: "male"
                }
            });
        }

        // creates totalQ questions if there are less then addQ Questions
        const addQ = 6
        const totalQ = 10
        if(Question.find().count() < addQ) {
            for (let i = 1; i <= totalQ; i++) {
                let str = i.toString();
                let qText = "question" + str;
                Question.insert({
                    CreatedBy: theAdmin._id,
                    Category: 0,
                    Text: qText
                });
                //Question.save();
            }
        }

        // creates totalTm teams if there are less then addTm Questions
        const addTm = 5;
        const totalTm = 5;
        if(Team.find().count() < addTm) {
            //console.log("about to add teams");
            for (let i = 1; i <= totalTm; i++) {
                let str = i.toString();
                let tmName = "team" + str;
                Team.insert({
                    CreatedBy: theAdmin._id,
                    Name: tmName,
                    Active: true
                });
                //console.log("A team was inserted");
                let tm = Team.findOne({Name: tmName});
                for (let j = 0; j <= (i % usrNames.length); j++) {
                    //console.log("i = %s\nj = %s", i, j);
                    let usr = Meteor.users.findOne({username: usrNames[j]});
                    //console.log("cursor1");
                    Meteor.users.update(usr._id, {$push: {teams: tmName}});
                    //console.log("cursor2");
                    Team.update(tm._id, {$push: {Members: usr._id}});
                    //console.log("Made it to the end");
                }
            }
        }

        ///*
        // add learn/Shares
        // creates totalLS LearnShareSession s if there are less then addLS Questions
        const addLS = 7
        const totalLS = 10
        console.log("Going into learnshare: ", LearnShareSession.find().count());
        if(LearnShareSession.find().count() < addLS) {
            console.log("entered lernshare");
            for (let i = 1; i <= totalLS; i++) {
                let str = i.toString();
                let lsTitle = "LearnShare" + str;
                let lsNote = "Note" + str;
                LearnShareSession.insert({
                    title: lsTitle,
                    notes: lsNote
                });
                console.log("learnshare inserted");
                let ls = LearnShareSession.findOne({title: lsTitle});
                console.log("cursor1");
                // add LSUsers based on the usrNames array
                for (let m = 0; m < usrNames.length; m++) {
                    let myUsr = Meteor.users.findOne({username: usrNames[m]});
                    let muName = myUsr.MyProfile.firstName + " " + myUsr.MyProfile.lastName;
                    console.log("cursor1.5, muName: %s myUsr._id: %s", muName, myUsr._id);
                    LSUser.insert({
                        //CreatedBy: theAdmin._id,
                        id: myUsr._id,
                        name: muName
                    });
                    console.log("cursor1.6");
                }
                for (let j = 0; j <= ((i + 1) % usrNames.length); j++) {
                    console.log("cursor2");
                    //let usr = Meteor.users.findOne({username: usrNames[j]});
                    let lsUsr = LSUser.findOne({username: usrNames[j]});
                    console.log("cursor3, usr._id: ", usr._id);
                    LearnShareSession.update(ls._id, {$push: {participants: lsUsr}, $push: {presenters: lsUsr}});
                    console.log("cursor4");
                }
                console.log("end of learnShare");
            }
        }
        //*/

    }// if addSamples = 1


});
