import "./tsqByTeam_char_report.html";
import { User } from '../../../api/users/users.js';
import { Team } from '../../../api/teams/teams.js';

// let teamClicked = Session.get('teamClicked');
// console.log("teamClicked", teamClicked);
let teamMembers = [];
let teamMemberTsqData = [];
let reactiveTeamMemberTsqData = new ReactiveVar();
let teamMemberId = [];
let allMembersReady = new ReactiveVar(false);
let confidenceStatements = {
    '0': 'No confidence information',
    '1': 'a month or more',
    '2': 'a week or two',
    '3': 'a couple of days',
    '4': '8 to 10 hours',
    '5': 'a couple of hours',
    '6': 'I could architect and give detailed technical leadership to a team today'
}

getTeamMembers = (teamClicked) => {
    let allTeams = Team.find().fetch();

    allTeams.forEach(team => {
        if(team.Name === teamClicked){
            teamMemberId = team.Members;
        }
    });

    teamMemberId.forEach(memberId => {
        let member = User.findOne({ _id:memberId });
        teamMembers.push(member);
    })

    getTeamMembersTsqData();
}

getTeamMembersTsqData = () => {
    let membersProcessed = 0;

    teamMembers.forEach((member, index, array) => {
        Meteor.call("tsq.getKeyData", member.MyProfile.technicalSkillsData, (error, result) => {
            if(error){
                console.log("error here: ", error);
            } else {
                membersProcessed++;

                if(result.data.data !== null){
                    familiarCount(result);
                    unfamiliarCount(result);
                    familiarAverage(result);
                    unfamiliarAverage(result);

                    teamMemberTsqData.push({
                        "userName": `${member.MyProfile.firstName} ${member.MyProfile.lastName}`,
                        "userId": member._id,
                        "familiarCount": familiarCount(result),
                        "unfamiliarCount": unfamiliarCount(result),
                        "familiarAverage": familiarAverage(result),
                        "unfamiliarAverage": unfamiliarAverage(result),
                        "skills": result.data.data.payload.skills
                    })
                    reactiveTeamMemberTsqData.set(teamMemberTsqData);
                    console.log("team member tsq right after: ", reactiveTeamMemberTsqData.get());
                }

                if(membersProcessed === array.length){
                    allMembersReady.set(true);
                }

            }
            // console.log(teamMemberTsqData);
        });
    })
}

familiarCount = (result) => {
    let familiar = 0;
    let skills = result.data.data.payload.skills;

    skills.forEach((value, index) => {
        if (value.familiar === true) {
            familiar += 1;
        }
    });
    return familiar;
}

unfamiliarCount = (result) => {
    let unfamiliar = 0;
    let skills = result.data.data.payload.skills;

    skills.forEach((value, index) => {
        if (value.familiar === false) {
            unfamiliar += 1;
        }
    });
    return unfamiliar;
}

familiarAverage = (result) => {
    let familiar = 0;
    let confidenceSum = 0;
    let skills = result.data.data.payload.skills;

    skills.forEach((value, index) => {
        if (value.familiar === true) {
            familiar += 1;
            confidenceSum += value.confidenceLevel;
        }
    });
    if (familiar > 0) {
        let ave = confidenceSum / familiar;
        if (ave % 1 !== 0) {
            return ave.toFixed(2);
        } else {
            return ave;
        }
    } else {
        return "No Familiar Technology";
    }
}

unfamiliarAverage = (result) => {
    let unfamiliar = 0;
    let confidenceSum = 0
    let skills = result.data.data.payload.skills;

    skills.forEach((value, index) => {
        if (value.familiar === false) {
            unfamiliar += 1;
            confidenceSum += value.confidenceLevel;
        }
    });
    if (unfamiliar > 0) {
        let ave = confidenceSum / unfamiliar
        if (ave % 1 !== 0) {
            return ave.toFixed(2);
        } else {
            return ave;
        }
    } else {
        return 0
    }
}

Template.tsqByTeam_char_report.onCreated(function (){
    this.autorun(() => {
        this.subscription1 = this.subscribe('teamMemberList', Meteor.userId(), {
            onStop: function () {
                // console.log("Team Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                // console.log("Team Member subscription ready! ", arguments, this);
                // getTeamMembers();
            }
        });
        this.subscription2 = this.subscribe('teamsData', Meteor.userId(), {
            onStop: function () {
                // console.log("teamsData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                // console.log("teamsData subscription ready! ", arguments, this);
            }
        });

    })
});

Tracker.autorun(() => {
    let teamClicked = Session.get("teamClicked");
    // let teamClicked = "coolKidTeam";
    console.log("has been updated", teamClicked);
    teamMembers = [];
    teamMemberTsqData = [];
    teamMemberId = [];
    getTeamMembers(teamClicked);
});

Template.tsqByTeam_char_report.helpers({
    teamMemberTsqData(){
        if(allMembersReady.get() === true){
            console.log("does the dataArray make it cheerio: ", teamMemberTsqData);
            // return teamMemberTsqData;     
            return reactiveTeamMemberTsqData.get();   
        }
    },
    returnConfidenceStatement(level) {
        return confidenceStatements[level.hash.level.toString()]
    },
});

// grab the team thats clicked in the "my teams" dropdown √√√
// pass into function, compare that to list of all teams and grab the matching team √√√
// iterate through members of matching team and grab each of their tsq data √√√
// display that in html √√√
// display the page if "tsq" is true && "team" is true