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
import { IndividualGoal } from '../../api/individual_goals/individual_goals.js';
import { Category, CategoryManager } from '../../api/categories/categories.js';
import { Report, Reports } from "../../api/reports/reports.js";
import { addMBTIReport } from '../../api/reports/customReports.js';


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
        t.CreatedBy = defaultUserId;
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
    const delPrevious = 0;
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

        // delete individualGoals
        IndividualGoal.remove({});

        // delete type_readings
        TypeReading.remove({});

        // delete categorys
        let cgList = Category.find().fetch();
        cgList.forEach((thisCG) => {
            if(thisCG.name != "the Unnamed Category") {
                Category.remove(thisCG._id);
            }
        })
    }

    // the samples won't be added if addSamples is not 1
    const usrNames = ["FlyingCockroach", "NapkinRescuer", "AprilMay", "TimothyTime", "YellowMouse"];
    const addSamples = 1;
    let theAdmin = Meteor.users.findOne({ username: "admin" });
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
        const addQ = 122;
        const totalQ = 30;
        if(Question.find().count() < addQ) {
            for (let i = 1; i <= totalQ; i++) {
                let str = i.toString();
                let qText = "question" + str;
                let lText = "leftText" + str;
                let rText = "rightText" + str;
                let q = new Question({
                    CreatedBy: theAdmin._id,
                    Category: 0,
                    Text: qText,
                    Categories: [0],
                    LeftText: lText,
                    RightText: rText,
                    Active: true
                });
                q.save();
            }
        }

        // creates totalTm teams if there are less then addTm teams
        const addTm = 5;
        const totalTm = 5;
        if(Team.find().count() < addTm) {
            //console.log("about to add teams");
            for (let i = 1; i <= totalTm; i++) {
                let str = i.toString();
                let tmName = "team" + str;
                tm = new Team({
                    CreatedBy: theAdmin._id,
                    Name: tmName,
                    Active: true
                });

                // Team.insert({
                //     CreatedBy: theAdmin._id,
                //     Name: tmName,
                //     Active: true
                // });
                // //console.log("A team was inserted");
                // let tm = Team.findOne({Name: tmName});

                console.log("got to teamusrs");
                let usrs = [];
                for (let j = 0; j <= (i % usrNames.length); j++) {
                    //console.log("i = %s\nj = %s", i, j);
                    let usr = Meteor.users.findOne({username: usrNames[j]});
                    usrs.push(usr._id);

                    /*
                    //console.log("cursor1");
                    Meteor.users.update(usr._id, {$push: {teams: tmName}});
                    //console.log("cursor2");
                    Team.update(tm._id, {$push: {Members: usr._id}});
                    //console.log("Made it to the end");
                    */
                }
                tm.addUsers(usrs);
            }
        }

        // creates totalLS LearnShareSession's if there are less then addLS LearnShareSession's
        const addLS = 7;
        const totalLS = 10;
        // console.log("Going into learnshare: ", LearnShareSession.find().count());
        if(LearnShareSession.find().count() < addLS) {
            // console.log("entered lernshare");
            for (let i = 1; i <= totalLS; i++) {
                let str = i.toString();
                let lsTitle = "LearnShare" + str;
                let lsNote = "Note" + str;
                // let lsId = "Id" + str;
                let ls = new LearnShareSession({
                    // teamId: lsId,
                    title: lsTitle,
                    notes: lsNote
                });
                ls.save();
                // add LSUsers based on the usrNames array
                // console.log("ls.participants: %o ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", ls.participants);
                // console.log("usrNames.length", usrNames.length);
                for (let m = 0; m < usrNames.length; m++) {
                    // console.log("ls._id", ls._id);
                    let findLs = LearnShareSession.findOne(ls._id);
                    // console.log("found findLs");
                    let myUsr = Meteor.users.findOne({username: usrNames[m]});
                    let muName = myUsr.MyProfile.firstName + " " + myUsr.MyProfile.lastName;
                    usrData = {id: myUsr._id, name: muName};
                    // console.log("cursor1.5, muName: %s myUsr._id: %s", muName, myUsr._id);
                    let rand = Math.floor(Math.random() * 2);
                    if ((m % 2) == rand) {
                        // console.log("entered % = 0, findLs.participants: %o ===========================================================", findLs.participants);
                        findLs.addParticipant(usrData);
                        // console.log("entered % = 0 part 2, findLs.participants: %o  ##########################################################", findLs.participants);
                        findLs.addPresenter(usrData);
                    }
                    else {
                        // console.log("entered % = 1, findLs.participants: %o  ======================================", findLs.participants);
                        findLs.addParticipant(usrData);
                        // console.log("entered % = 1 part 2, findLs.participants: %o  ############################################################", findLs.participants);
                    }
                    // console.log("findLs.participants: %o", findLs.participants);
                    // console.log("cursor1.6");
                }
            }
            // console.log("end of learnShare");
        }

        // creates totalIG IndividualGoal's if there are less then addIG IndividualGoal's
        const addIG = 7;
        const totalIG = 10;
        // console.log("Going into IndividualGoal: ", IndividualGoal.find().count());
        if(IndividualGoal.find().count() < addIG) {
            // console.log("entered IndividualGoal");
            for (let i = 1; i <= totalIG; i++) {
                let str = i.toString();
                let igTitle = "Title" + str;
                let igDesc = "Description" + str;
                let myUsr;
                if (i == 1 || i == 2) {
                    myUsr = Meteor.users.findOne({username: "admin"});
                }
                else {
                    myUsr = Meteor.users.findOne({username: usrNames[(i % usrNames.length)]});
                }
                // console.log("myUsr is defined", myUsr.username);
                let ig = new IndividualGoal({
                    userId: myUsr._id,
                    createdBy: myUsr._id,
                    title: igTitle,
                    description: igDesc
                });
                // console.log("ig is defined");
                ig.save();
            }
            // console.log("end of IndividualGoal");
        }

        // creates totalTR TypeReading's if there are less then addTR TypeReading's
        const addTR = 7;
        const totalTR = 15;
        // console.log("Going into TypeReading console.log()");
        // console.log("Going into TypeReading: ", TypeReading.find().count());
        if(TypeReading.find().count() < addTR) {
            // console.log("entered TypeReading");
            for (let i = 1; i <= totalTR; i++) {
                let str = i.toString();
                let trHeader = "Header" + str;
                let trBody = "Body" + str;
                let myUsr;
                if (i == 1 || i == 2) {
                    myUsr = Meteor.users.findOne({username: "admin"});
                }
                else {
                    myUsr = Meteor.users.findOne({username: usrNames[(i % usrNames.length)]});
                }
                // console.log("myUsr is defined", myUsr.username);
                let tr = new TypeReading({
                    CreatedBy: myUsr._id,
                    Header: trHeader,
                    Body: trBody,
                    Enabled: true
                });
                // console.log("new TypeReading object created");
                tr.save();
            }
            // console.log("Made it to the end of TypeReading");
        }

        // creates totalCG Category's if there are less then addCG Category's
        const addCG = 7;
        const totalCG = 10;
        // console.log("Going into Category console.log()");
        // console.log("Going into Category: ", Category.find().count());
        if(Category.find().count() < addCG) {
            // console.log("entered Category");
            for (let i = 1; i <= totalCG; i++) {
                let str = i.toString();
                let cgName = "Category" + str;
                let cgDesc = "Description" + str;
                let cg = new Category({
                    name: cgName,
                    description: cgDesc
                });
            }
        }

        // count the reports 
        console.log(Reports.find().count())
        
        // test for mbti report existence and add it if it doesn't exist 
        if ( Reports.findOne({ title: 'mbti' }) ) {
            console.log('the mbti report exists')
        } else {
            addMBTIReport()
        }

        // populate sample reports
        if (Reports.find().count() < 4) {

            let sampReport = new Reports({
                title: 'Test Report 1',
                description: 'this is a sample report',
                url: 'testreport',
                dateCreated: new Date(),
                data: new Report({
                    reportData: {
                        data1: 'some data here',
                        data2: 'some more data here',
                        data3: 'even more data here',
                    }
                })
            })
            console.log(sampReport)
            sampReport.save()

            let sampReport2 = new Reports({
                title: 'Test Report 2',
                description: 'this is a sample report',
                url: 'testreport',
                dateCreated: new Date(),
                data: new Report({
                    reportData: {
                        data1: 'some data here',
                        data2: 'some more data here',
                        data3: 'even more data here',
                    }
                })
            })
            console.log(sampReport2)
            sampReport2.save()

            let sampReport3 = new Reports({
                title: 'Test Report 3',
                description: 'this is a sample report',
                url: 'testreport',
                dateCreated: new Date(),
                data: new Report({
                    reportData: {
                        data1: 'some data here',
                        data2: 'some more data here',
                        data3: 'even more data here',
                    }
                })
            })
            console.log(sampReport3)
            sampReport3.save()

            let sampReport4 = new Reports({
                title: 'Test Report 4',
                description: 'this is a sample report',
                url: 'testreport',
                dateCreated: new Date(),
                data: new Report({
                    reportData: {
                        data1: 'some data here',
                        data2: 'some more data here',
                        data3: 'even more data here',
                        data4: {
                            data: 'some objecty stuff',
                            data2: 'some more objecty stuff',
                            data3: {
                                title: 'a title of another object'
                            }
                        }
                    }
                })
            })
            console.log(sampReport4)
            sampReport4.save()
        }

    }// end of if(addSamples == 1)

});