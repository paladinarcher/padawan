import './team_dashboard.html';
import { User } from '/imports/api/users/users.js';
import { Team,TeamIcon } from '/imports/api/teams/teams.js';
import { isUndefined } from 'util';
import { callWithPromise } from '/imports/client/callWithPromise';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import { mbtiGraph } from "/imports/ui/components/mbtiGraph/mbtiGraph.js";

const team = new ReactiveVar();
const userAlreadyHasSkills = new ReactiveVar(false);
const keyInfo = new ReactiveVar();

async function getUserData(users) {
    let returnVal = [];
    let records = await callWithPromise('tsq.getAllKeyData');
    let allSkills = Session.get('allSkills').curValue;
    console.log("Getting User Data", allSkills);
    users.forEach(user => {
        if (user.MyProfile.technicalSkillsData === undefined) {
            returnVal.push([{name:'No Skills Data Available!'}]);
        } else {
            let key = user.MyProfile.technicalSkillsData;
            let results = records.data.data.payload;
            let skills = [{name:'No Skills Data Available!'}];
            results.forEach(result => {
                if(result.key === key) {
                    result.skills.forEach(s => {
                        let curSkill = allSkills.find(ask => {
                            return ask.value === s._id;
                        });
                        s.name = curSkill.text;
                    })
                    skills = result.skills;
                }
            });
            skills.sort( compare );
            returnVal.push(skills);
        }
    });
    Session.set('skills', returnVal);
    return returnVal;
}
async function registerUser() {
    return await callWithPromise('tsq.registerKeyToUser');
}

function compare( a, b ) {
    if ( a.confidenceLevel > b.confidenceLevel ){
      return -1;
    }
    if ( a.confidenceLevel < b.confidenceLevel ){
      return 1;
    }
    return 0;
}

Template.team_dashboard.onCreated(function() {
    this.getTeamId = () => FlowRouter.getParam('teamId');
    Session.set('teamId',this.getTeamId());
    this.autorun(async () => {
        this.subscription1 = this.subscribe('teamsData', Meteor.userId(), {
            onStop: function () {
                console.log("Team subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team subscription ready! ", arguments, this);
            }
        });
        this.subscription2 = this.subscribe('teamsMemberOfList', Meteor.userId(), {
            onStop: function () {
                console.log("Team subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team subscription ready! ", arguments, this);
            }
        });
        this.subscription1 = await this.subscribe('tsqUserList', this.userId, {
            onStop: function() {
             // console.log('tsq user List subscription stopped! ', arguments, this);
            },
            onReady: function() {
             // console.log('tsq user List subscription ready! ', arguments, this);
            }
        });
    });
});

Template.team_dashboard.helpers({
    theTeam() {
        return team.get();
    },
    theUsers() {
        let theTeam = team.get();
        return User.find({_id: {$in: theTeam.Members}});
    },
    userSkills() {
        let users = Template.team_dashboard.__helpers.get('theUsers').call();
        let skills = getUserData(users);
        console.log("Skills",skills);
        Session.set('skills', skills);
    },
    topSkills() {
        let topSkills = Session.get('skills');
        let ct = 0;
        let common = [];
        topSkills.forEach(top => {
            if(top[0].name !== 'No Skills Data Available!') {
                if(ct === 0) {
                    console.log("Fist is", top);
                    common = top;
                } else {

                    let temp = top.filter(topItem => {
                        let idx = common.findIndex(com => {
                            com.confidenceLevel = Math.round((com.confidenceLevel+topItem.confidenceLevel)/2);
                            return com._id === topItem._id;
                        });
                        return idx > -1;
                    });
                    common = temp;
                }
                ct++;
            }
        });
        return common.slice(0,10);
    },
    skillList(key) {
        let rtn;
        let sk = Session.get('skills');
        let ct = 0;
        if(Array.isArray(sk)) {
            sk.forEach(s => {
                if(ct === key) {
                    rtn = s;
                }
                ct++;
            });
        }
        console.log("KeyInfo Skills", sk[key], key);
        return sk[key];
    },
    badgeColor(int) {
        let colors = ['default','danger','warning','inverse','info','primary','success'];
        return colors[int];
    },
    graph(personality, id) {
        console.log("graph",personality,id);
        let valueIE = personality.IE.Value
        let valueNS = personality.NS.Value
        let valueTF = personality.TF.Value
        let valueJP = personality.JP.Value
        console.log($("#img-trait-"+id) , " (((((((((((())))))))))))")
        Meteor.setTimeout(function() {
            mbtiGraph(valueIE, valueNS, valueTF, valueJP, $("#img-trait-"+id), false);
        }, 500);
    }
});

Tracker.autorun(function() {
    var theid = FlowRouter.getParam('teamId');
    if(theid) {
        team.set(Team.findOne({ _id: theid }));
        Template.team_dashboard.__helpers.get('userSkills').call();
    }
});