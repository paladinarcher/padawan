import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { Team } from '/imports/api/teams/teams.js';
import './learn_share_list.html';

Template.learn_share_list.onCreated( function () {
    this.autorun( () => {
        console.log("autorunning learn_share_list...");
        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);

        this.subscription2 = this.subscribe('learnShareList', Meteor.userId(), {
            onStop: function () {
                console.log("LearnShare List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("LearnShare List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);

        this.subscription3 = this.subscribe('teamsMemberOfList', Meteor.userId(), {
            onStop: function () {
                console.log("Team Member Of List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Member Of List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });
});

Template.learn_share_list.helpers({
    lsSessList(teamId) {
        let lst = [];
        let filter = {};
        if (typeof teamId === "string" && teamId != "") {
            filter.teamId = teamId;
        } else {
            filter.teamId = {'$in': [null,'']};
        }
        LearnShareSession.find( filter ).forEach(function (sess) {
            //sorting with { sort: {createdAt:-1} } had no effect, so unshift used to reverse order instead
            lst.unshift(sess);
        });
        return lst;
    },
    hasSessions(teamId) {
        let ls = LearnShareSession.find( {teamId: teamId} );

        if (!ls || ls.count() == 0) {
            return false;
        } else {
            return true;
        }
    },
    teamList() {
        //list of teams the user is a member of
        let t = Team.find( {Members: Meteor.userId()} );
        if (!t) {
            return [];
        }
        let lst = t.fetch();
        return lst;
    },
    hasNoTeam(tList) {
        noTeamBool = false;
        tList.forEach((t) => {
            if (t.Name === 'No Team') {
                noTeamBool = true;
            }
        });
        if (!noTeamBool) {
            return 'selected';
        }
    },
    isNoTeam(tName) {
        if (tName === 'No Team') {
            return 'selected'
        }
    }
});

Template.learn_share_list.events({
    'click button#btn-create-new'(event, instance) {
        let lsTitle = $("#sess-title").val();
        if (lsTitle == "") {
            alert("The LearnShare title is required.");
        } else {
            Meteor.call('learnshare.createNewSession', lsTitle, $("#select-team").val(), (error, result) => {
                if (error) {
                    console.log("can't create new Learn/Share session", error);
                } else {
                    FlowRouter.go("/learnShare/"+result);
                }
            });
        }   


        // Meteor.call('learnshare.createNewSession', $("#sess-title").val(), $("#select-team").val(), (error, result) => {
        //     if (error) {
        //         console.log("can't create new Learn/Share session", error);
        //     } else {
        //         FlowRouter.go("/learnShare/"+result);
        //     }
        // });
    }
});
