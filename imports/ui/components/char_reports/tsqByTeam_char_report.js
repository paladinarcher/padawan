import "./tsqByTeam_char_report.html";
import { User } from '../../../api/users/users.js';
import { Team } from '../../../api/teams/teams.js';

let teamClicked = "team2";
let teamMembers = [];

Template.tsqByTeam_char_report.onCreated(function (){

    this.autorun(() => {

        this.subscription2 = this.subscribe('teamMemberList', Meteor.userId(), {
            onStop: function () {
                console.log("Team Member subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Member subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);

        this.subscription3 = this.subscribe('teamsData', Meteor.userId(), {
            onStop: function () {
                console.log("teamsData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("teamsData subscription ready! ", arguments, this);

                let allTeams = Team.find().fetch();
                let teamMemberId = [];

                allTeams.forEach(team => {
                    if(team.Name === teamClicked){
                        teamMemberId = team.Members;
                    }
                });

                teamMemberId.forEach(memberId => {
                    let member = User.findOne({ _id:memberId });
                    teamMembers.push(member);
                })

                console.log("teamMembers array right here: ", teamMembers);

            }
        });
        console.log(this.subscription3);
    })

});

Template.tsqByTeam_char_report.helpers({

});

Template.tsqByTeam_char_report.events({

});

// grab the team thats clicked in the "my teams" dropdown
// pass into function, compare that to list of all teams and grab the matching team
// iterate through members of matching team and grab each of their tsq data
// display that in html
// display the page if "tsq" is true && "team" is true