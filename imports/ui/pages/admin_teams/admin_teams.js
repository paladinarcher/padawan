import { Team } from '/imports/api/teams/teams.js';
import { TeamGoal } from '/imports/api/team_goals/team_goals.js';
import { User } from '/imports/api/users/users.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import './admin_teams.html';
import '../team_goals/team_goals.js';
import '/imports/ui/components/select_autocomplete/select_autocomplete.js';

Template.admin_teams.onCreated(function () {
    this.autorun( () => {
        console.log("autorunning admin_teams...");
        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
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
            }
        });
        console.log(this.subscription3);
    });
});

Template.admin_teams.onRendered(function () {
    Meteor.setTimeout( function () {
        $("table.table select.selectized").each(function (s) {
            this.selectize.on('item_add', function(val, $item) {
                let userId = $item.closest("[data-user-id]").data("user-id");
                let teamName = $item.closest("[data-team-name]").data("team-name");

                let t = Team.findOne( {Name: teamName} );
                t.addRole(userId, val);
            });
            this.selectize.on('item_remove', function(val, $item) {
                let userId = this.$control.closest("[data-user-id]").data("user-id");
                let teamName = this.$control.closest("[data-team-name]").data("team-name");

                let t = Team.findOne( {Name: teamName} );
                t.removeRole(userId, val);
            });
        });
    }, 1000);
});

Template.admin_teams.helpers({
    teams() {
        if (typeof Team === 'undefined') {
            return false;
        }
        let t = Team.find(  );//.fetch();
        let t_invited = [], t_member = [], t_else = [];
        t.forEach( (team)=> {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {
                t_invited.push(team);
            } else if (team.Members.includes(Meteor.userId()) ) {
                t_member.push(team);
            } else {
                t_else.push(team);
            }
        });
        console.log(t_invited, t_member, t_else);
        return t_invited.concat(t_member, t_else);
    },
    teamsMemberOf() {
        if (typeof Team === 'undefined') {
            return false;
        }
        let t = Team.find(  );//.fetch();
        let t_invited = [], t_member = [], t_else = [];
        t.forEach( (team)=> {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {
                t_invited.push(team);
            } else if (team.Members.includes(Meteor.userId()) ) {
                t_member.push(team);
            } else {
                //t_else.push(team);
            }
        });
        if (t_member.length > 1 && !Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            //if regular user is a member of a team other than "No Team", hide "No Team" from this view
            console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            t_member = t_member.filter( (tm) => {
                console.log(tm.Name, Team.Default.Name);
                return tm.Name !== Team.Default.Name;
            } );
        } else {
            console.log("rrrrrrrrrrrrrrr",t_member.length);
        }
        console.log(t_invited, t_member, t_else);
        return t_invited.concat(t_member, t_else);
    },
    teamsOther() {
        if (typeof Team === 'undefined') {
            return false;
        }
        let t = Team.find(  );//.fetch();
        let t_invited = [], t_member = [], t_else = [];
        t.forEach( (team)=> {
            if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {
                //t_invited.push(team);
            } else if (team.Members.includes(Meteor.userId()) ) {
                //t_member.push(team);
            } else {
                t_else.push(team);
            }
        });
        console.log(t_invited, t_member, t_else);
        return t_invited.concat(t_member, t_else);
    },
    teamMembers(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "member";
        let u = User.find( teamRole );
        if (typeof u === "undefined") {
            return false;
        }
        let memberList = [];
        u.forEach((m) => {
            memberList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: m.roles[teamName]
            });
        });
        return memberList;
    },
    uniqueId() {
        var text = "";
        var idLength = 10;
        var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < idLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },
    teamRequests(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "user-join-request";
        let u = User.find( teamRole );

        if (!u) {
            return [];
        }

        let requestList = [];
        u.forEach((m) => {
            requestList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: "user-join-request"
            })
        });
        return requestList;
    },
    rolesList() {
        let roles = [];
        Roles.getAllRoles().forEach(function (r) {
            roles.push( {
                text: r.name,
                value: r.name
            } );
        });
        return roles;
    },
    users() {
        return User.find().fetch();
    },
    userAddList(teamName) {
        let t = Team.findOne( {Name: teamName} );
        let memberList = [];
        if (t) {
            memberList = t.Members;
        }
        let u = User.find({_id: {'$nin': memberList}});
        let addList = [];
        u.forEach((m) => {
            addList.push( {
                value: m._id,
                text: m.MyProfile.firstName + " " + m.MyProfile.lastName
            });
        });
        return addList;
    },
});

function teamChanged($g) {
    $g.find(".btn-save").prop("disabled",false);
    $g.find(".btn-cancel").prop("disabled",false);
}
function teamUnchanged($g) {
    $g.find(".btn-save").prop("disabled",true);
    $g.find(".btn-cancel").prop("disabled",true);
    $g.find(".changed").removeClass("changed");
}
function saveTeam(teamId) {
    let saveObj = {
        Name: $("#team-title-"+teamId).val(),
        Description: $("#team-description-"+teamId).val()
    };
    let t = Team.findOne( {_id:teamId} );
    if (t) {
        t.updateFromObj(saveObj);
    }
}

Template.admin_teams.events({
    'change input.flat,textarea.flat'(event, instance) {
        $(event.target).addClass('changed');
        let $team = $(event.target).closest("[data-team-id]");
    },
    'change input,textarea,select'(event, instance) {
        let $t = $(event.target);
        let $team = $(event.target).closest("[data-team-id]");
        teamChanged($team);
    },
    'keyup input,textarea'(event, instance) {
        let $t = $(event.target);
        let $team = $(event.target).closest("[data-team-id]");
        teamChanged($team);
    },
    'click button.btn-save'(event, instance) {
        let $t = $(event.target);
        let teamId = $t.closest("[data-team-id]").data("team-id");
        saveTeam(teamId);
        teamUnchanged($("#div-team-"+teamId));
    },
    'click button#btn-create-team'(event, instance) {
        let newTeamName = $("#input-new-team-name").val();
        if ("" === newTeamName) {
            $("#msg-create").removeClass("alert-success").addClass("alert-danger").html("Team name required").css("display","inline-block");
            return;
        }
        let newTeamDescription = $("#input-new-team-description").val();
        let newTeam = { Name: newTeamName, Description: newTeamDescription };
        Meteor.call('team.createNewTeam', newTeam, function (err, rslt) {
            if (!err) {
                $("#div-new-team-details").slideUp();
                $("#input-new-team-name").val("");
                $("#msg-create").removeClass("alert-danger").addClass("alert-success").html("Team created!").css("display","inline-block");
                $("#input-new-team-name").closest(".input-group").removeClass("has-error").removeClass("has-feedback");
            } else {
                console.log(err);
                $("#input-new-team-name").closest(".input-group").addClass("has-error").addClass("has-feedback");
                $("#msg-create").removeClass("alert-success").addClass("alert-danger").html("Duplicate team name").css("display","inline-block");
                if (err.error === 409) {
                    console.log("duplicate");
                }
            }
            Meteor.setTimeout(function () {
                $("#msg-create").fadeOut();
            }, 5000);
        });
    },
    'focus #form-new-team'(event, instance) {
        $("#div-new-team-details").slideDown();
    },
    'blur #form-new-team'(event, instance) {
        console.log("triggered div blur");
    },
    'click .dropdown-menu.add-users'(event, instance) {
        event.stopPropagation();
    },
    'click button.btn-add-users-save'(event, instance) {
        let $select = $(event.target).closest(".dropdown-menu").find(".selectized");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne({_id: teamId});
        let userList = $select[0].selectize.items;

        t.adminRequestUserJoin(userList);

        $select[0].selectize.clear(true);
        $(event.target).closest(".dropdown").toggleClass('open');
    },
    'click button.btn-add-users-cancel'(event, instance) {
        let $select = $(event.target).closest(".dropdown-menu").find(".selectized");
        $select[0].selectize.clear(true);
        $(event.target).closest(".dropdown").toggleClass('open');
    },
    'click button.btn-add-users'(event, instance) {
        //show add-user widget
    },
    'click button.btn-accept-join'(event, instance) {
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        t.userAcceptJoin();
    },
    'click button.btn-decline-join'(event, instance) {
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        t.userDeclineJoin();
    },
    'click a.btn-admin-request-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).closest("[data-user-id]").data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne({_id: teamId});
        t.adminRequestUserJoin(userId);
    },
    'click button.btn-user-request-join'(event, instance) {
        event.preventDefault();
        let teamId = $(event.target).data("team-id");
        let t = Team.findOne({_id: teamId});
        t.userRequestJoin();
    },
    'click a.btn-approve-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne( {_id: teamId} );
        t.adminAcceptJoin(userId);
    },
    'click a.btn-decline-join'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let t = Team.findOne( {_id: teamId} );
        t.adminRejectJoin(userId);
    },
    'click button.btn-remove-user-role'(event, instance) {
        event.preventDefault();
        let userId = $(event.target).closest("[data-user-id]").data("user-id");
        let teamId = $(event.target).closest("[data-team-id]").data("team-id");
        let role = $(event.target).closest("[data-role]").data("role");
    },
    'click div.team-goal-quick-list'(event, instance) {
        let teamName = $(event.target).closest("[data-team-name]").data("team-name");
        if (teamName) {
            FlowRouter.go("/teamGoals/"+teamName.split(" ").join("-"));
        }
    },
    'click button.btn-expand,div.collapsed-summary'(event, instance) {
        let $target = $(event.target);
        let $teamContainer = $target.closest("[data-team-id]");
        let $targetExpandBtn = $teamContainer.find(".btn-expand.glyphicon");

        $targetExpandBtn.removeClass("glyphicon-chevron-up")
            .addClass("glyphicon-chevron-down");

        if ($teamContainer.hasClass("collapsed")) {
            $(".team-view[data-team-id]:not(.collapsed)").slideUp(function() {
                $(this).addClass("collapsed").css("display","block");
            });
            $teamContainer.css("display","none").removeClass("collapsed").slideDown(function () {
                $('html, body').animate({
                    scrollTop: ($teamContainer.offset().top)
                },500);
            });
            $targetExpandBtn.removeClass("glyphicon-chevron-down");
            $targetExpandBtn.addClass("glyphicon-chevron-up");
        } else {
            $teamContainer.slideUp(function() {
                $teamContainer.addClass("collapsed").css("display","block");
            });
            $targetExpandBtn.removeClass("glyphicon-chevron-up");
            $targetExpandBtn.addClass("glyphicon-chevron-down");
        }
    },
    'click tr[data-user-id]'(event, instance) {
        if (!$(event.target).closest(".selectize-control").length) {
            let $target = $(event.target).closest("[data-user-id]");
            let uid = $target.data("user-id");
            FlowRouter.go("/profile/"+uid);
        }
    }
});

Template.team_view.helpers ({
    fldEnabled(fld) {
        let team = Template.instance().data.team;
        //let t = TeamGoal.findOne( {_id: team._id} );

        //if (!t) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', team.Name)) {
                return "";
            } else {
                return "disabled";
            }
        //}

        if (g.hasModifyPerm(fld)) {
            return "";
        } else {
            return "disabled";
        }
    },
    teamMembers(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "member";
        let u = User.find( teamRole );
        if (typeof u === "undefined") {
            return false;
        }
        let memberList = [];
        u.forEach((m) => {
            memberList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: m.roles[teamName]
            });
        });
        return memberList;
    },
    hasTeamRequests(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "user-join-request";
        let u = User.find( teamRole );

        if (!u || u.count() == 0) {
            return false;
        } else {
            return true;
        }
    },
    teamRequests(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "user-join-request";
        let u = User.find( teamRole );

        if (!u) {
            return [];
        }

        let requestList = [];
        u.forEach((m) => {
            requestList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: "user-join-request"
            })
        });
        return requestList;
    },
    hasTeamInvites(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "admin-join-request"
        let u = User.find( teamRole );

        if (!u || u.count() == 0) {
            return false;
        } else {
            return true;
        }
    },
    teamInvites(teamName) {
        let teamRole = {};
        teamRole["roles."+teamName] = "admin-join-request"
        let u = User.find( teamRole );

        if (!u) {
            return [];
        }

        let inviteList = [];
        u.forEach((m) => {
            inviteList.push( {
                _id: m._id,
                firstName: m.MyProfile.firstName,
                lastName: m.MyProfile.lastName,
                roles: "admin-join-request"
            })
        });
        return inviteList;
    },
    rolesList() {
        let roles = [];
        Roles.getAllRoles().forEach(function (r) {
            roles.push( {
                text: r.name,
                value: r.name
            } );
        });
        return roles;
    },
    uniqueId() {
        var text = "";
        var idLength = 10;
        var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < idLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },
    userAddList(teamName) {
        let t = Team.findOne( {Name: teamName} );
        let memberList = [];
        if (t) {
            memberList = t.Members;
        }
        let u = User.find({_id: {'$nin': memberList}});
        let addList = [];
        u.forEach((m) => {
            addList.push( {
                value: m._id,
                text: m.MyProfile.firstName + " " + m.MyProfile.lastName
            });
        });
        return addList;
    },

});
