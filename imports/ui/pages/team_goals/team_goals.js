import { Meteor } from 'meteor/meteor';
import { User } from '/imports/api/users/users.js';
import { TeamGoal } from '/imports/api/team_goals/team_goals.js';
import './team_goals.html';
import '/imports/ui/components/select_autocomplete/select_autocomplete.js';

const BLANK_GOAL = {
    _id: "new",
    title: "",
    description: ""
};

let _hasSubgoalView = new ReactiveVar(false);
let _subgoalId = new ReactiveVar("");
Template.team_goals.onCreated(function () {
    if (this.data.teamName) {
        this.teamName = this.data.teamName;
    } else {
        this.teamName = FlowRouter.getParam('teamName').split('-').join(' ');
    }

    Session.set("goalReload",false);
    Session.set("saving",true);

    this.userSubscriptionReady = new ReactiveVar( false );
    this.autorun( () => {
        this.modalGoalId = FlowRouter.getParam('goalId');
        if ("undefined" !== typeof this.modalGoalId && "" !== this.modalGoalId) {
            _hasSubgoalView.set(true);
            _subgoalId.set(FlowRouter.getParam('goalId'));
            $("body").on("hidden.bs.modal", "#goal-modal-sub", function () {
                _hasSubgoalView.set(false);
                _subgoalId.set("");
                FlowRouter.go("/teamGoals/"+FlowRouter.getParam('teamName'));
            });
            Meteor.setTimeout(function () {
                $("#goal-modal-sub").modal("show");
                $("#goal-modal-sub").find("div.team-goal").removeClass("collapsed");
            }, 1000);
        }
        this.subscription = this.subscribe('teamGoalsData', this.teamName, {
            onStop: function () {
                console.log("Team Goals subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Goals subscription ready! ", arguments, this);
            }
        });
        this.subscription2 = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
    });
    Meteor.setTimeout(function () {
        Session.set("saving",false);
    }, 2000);
});
Template.team_goals.onRendered(function () {
    Meteor.setTimeout(function() {
        $("input.date").datetimepicker({
            format:'YYYY-MM-DD',
            useCurrent:false,
            showClear:true,
            showClose:true
        });
    }, 1000);
    $("body").on("hidden.bs.modal", "#goal-modal-new", function () {
        $newgoal = $("#div-goal-new").detach();
        $newgoal.data("parent-id","");
        $("#blank-goal").find(".col-sm-12").append($newgoal);
    });
});

var resetNewGoalForm = () => {
    let valInputs = [
        "goal-title-new",
        "goal-description-new",
        "input-date-due-new",
        "input-date-review-new",
        "input-date-reached-new",
    ];
    for (let i = 0; i < valInputs.length; i++) {
        $("#"+valInputs[i]).val("");
    }

    let slzInputs = [
        "select-assigned-to-new",
        "select-mentors-new",
        "select-admins-new"
    ];
    for (let i = 0; i < valInputs.length; i++) {
        $("#"+valInputs[i]).val("");
    }
};

function saveGoal(goalId) {
    let slAssigned = $("#select-assigned-to-"+goalId)[0].selectize;
    let slMentors = $("#select-mentors-"+goalId)[0].selectize;
    let slAdmins = $("#select-admins-"+goalId)[0].selectize;
    let assignList = slAssigned.getValue();
    let mentorList = slMentors.getValue();
    let adminList = slAdmins.getValue();
    let tplTeamName = $("[data-team-name]").data("team-name");

    Session.set("saving",true);
    let saveObj = {
        teamName: tplTeamName,
        title: $("#goal-title-"+goalId).val(),
        description: $("#goal-description-"+goalId).val(),
        assignedTo: assignList,
        mentors: mentorList,
        admins: adminList
    };
    let startDate = $("#input-start-date-"+goalId).val();
    if ("" !== startDate) {
        saveObj.startDate = new Date(startDate);
    }
    let dueDate = $("#input-date-due-"+goalId).val();
    if ("" !== dueDate) {
        saveObj.dueDate = new Date(dueDate);
    }
    let rvwDate = $("#input-date-review-"+goalId).val();
    if ("" !== rvwDate) {
        saveObj.reviewDate = new Date(rvwDate);
    }

    if (goalId === BLANK_GOAL._id) {
        let parentId = $("#div-goal-new").data("parent-id");
        if ("" !== parentId) {
            saveObj.parentId = parentId;
        }
        Meteor.call('teamgoals.createNewGoal', saveObj, function (err, rslt) {
            console.log(err, rslt);
        });
    } else {
        let g = TeamGoal.findOne( {_id: goalId} );
        let reviewedOnDate = $("#input-date-reviewed-on-"+goalId).val();
        if ("" !== reviewedOnDate) {
            saveObj.reviewedOnDate = new Date(reviewedOnDate);
        }
        let reachedDate = $("#input-date-reached-"+goalId).val();
        if ("" !== reachedDate) {
            saveObj.reachedDate = new Date(reachedDate);
        }

        g.updateFromObj(saveObj);
    }
    Meteor.setTimeout(function () {
        Session.set("saving",false);
    }, 10000);
}

function goalChanged($g) {
    $g.find(".btn-save").prop("disabled",false);
    $g.find(".btn-cancel").prop("disabled",false);
}
function goalUnchanged($g) {
    $g.find(".btn-save").prop("disabled",true);
    $g.find(".btn-cancel").prop("disabled",true);
    $g.find(".changed").removeClass("changed");
}

Template.team_goals.events({
    'change input.flat,textarea.flat'(event, instance) {
        $(event.target).addClass('changed');
        let $goal = $(event.target).closest("[data-goal-id]");
        if ($goal) {
            if ($("#goal-title-"+$goal.data("goal-id")).val() != "") {
                //
            }
        }
    },
    'change input,textarea,select'(event, instance) {
        let $t = $(event.target);
        let $goal = $(event.target).closest("[data-goal-id]");
        goalChanged($goal);
    },
    'keyup input,textarea'(event, instance) {
        let $t = $(event.target);
        let $goal = $(event.target).closest("[data-goal-id]");
        goalChanged($goal);
    },
    'click button.btn-save'(event, instance) {
        let $t = $(event.target);
        let goalId = $t.closest("[data-goal-id]").data("goal-id");
        saveGoal(goalId);
        goalUnchanged($("#div-goal-"+goalId));

        $modalParent = $t.closest(".modal");
        if ($modalParent.length) {
            $modalParent.modal('hide');
            $newgoal = $("#div-goal-new").detach();
            $newgoal.data("parent-id","");
            $("#blank-goal").find(".col-sm-12").html($newgoal);
        }
        if (goalId == BLANK_GOAL._id) {
            resetNewGoalForm();
            if ( ! $modalParent.length ) {
                $(".goal-controls").show();
                $("#blank-goal").slideUp();
            }
        }
    },
    'click button.btn-add-subgoal'(event, instance) {
        let parentId = $(event.target).closest("[data-goal-id]").data("goal-id");
        $newgoal = $("#div-goal-new").detach();
        $newgoal.data("parent-id",parentId);
        $newgoal.find(".btn-cancel").attr("disabled",false);
        $("#goal-modal-new").find(".modal-body").append($newgoal);
        $("#goal-modal-new").modal("show");
        $("#goal-modal-new").find("div.team-goal").removeClass("collapsed");
    },
    'click button.btn-cancel'(event, instance) {
        let $t = $(event.target);
        let goalId = $t.closest("[data-goal-id]").data("goal-id");

        $modalParent = $t.closest(".modal");
        if ($modalParent.length) {
            $modalParent.modal('hide');
            $newgoal = $("#div-goal-new").detach();
            $newgoal.data("parent-id","");
            $("#blank-goal").find(".col-sm-12").append($newgoal);
        }

        if (goalId == BLANK_GOAL._id) {
            resetNewGoalForm();
            if ( ! $modalParent.length ) {
                $(".goal-controls").show();
                $("#blank-goal").slideUp();
            }
        } else {
            //forces a reload from the database
            Session.set("goalReload",true);
            Meteor.setTimeout(function () {
                Session.set("goalReload",false);
            }, 100);
        }
    },
    'click button.btn-comment-add'(event, instance) {
        $btnAdd = $(event.target);

        let goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
        let $comment = $("#new-comment-"+goalId);
        let newComment = $comment.val();
        let g = TeamGoal.findOne( {_id: goalId} );
        g.addComment(newComment);
        $comment.val("");
    },
    'click button.btn-review-comment-add'(event, instance) {
        $btnAdd = $(event.target);

        let goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
        let $comment = $("#new-review-comment-"+goalId);
        let newComment = $comment.val();
        let g = TeamGoal.findOne( {_id: goalId} );
        g.addReviewComment(newComment);
        $comment.val("");
    },
    'click button#btn-add-goal'(event, instance) {
        let $btnAdd = $(event.target);
        $goal = $btnAdd.closest("[data-goal-id]")
        let goalId = $goal.data("goal-id");

        $(".goal-controls").hide();
        let $btnCancel = $("#blank-goal").find(".btn-cancel")
        $btnCancel.prop("disabled",false);
        $(".team-goal[data-goal-id="+goalId+"]").removeClass("collapsed");
        $("#blank-goal").slideDown();
        $("#btn-add-cancel").fadeIn();
    },
    'click button#btn-add-cancel'(event, instance) {
        $("#blank-goal").slideUp();
        $("#btn-add-cancel").fadeOut();
    },
    'click button.btn-expand,div.collapsed-summary'(event, instance) {
        let $target = $(event.target);
        let $goalContainer = $target.closest("[data-goal-id]");
        let $targetExpandBtn = $goalContainer.find(".btn-expand.glyphicon");

        $targetExpandBtn.removeClass("glyphicon-chevron-up")
            .addClass("glyphicon-chevron-down");

        if ($goalContainer.hasClass("collapsed")) {
            $(".team-goal[data-goal-id]:not(.collapsed)").slideUp(function() {
                $(this).addClass("collapsed").css("display","block");
            });
            $goalContainer.css("display","none").removeClass("collapsed").slideDown(function () {
                $('html, body').animate({
                    scrollTop: ($goalContainer.offset().top)
                },500);
            });
            $targetExpandBtn.removeClass("glyphicon-chevron-down");
            $targetExpandBtn.addClass("glyphicon-chevron-up");
        } else {
            $goalContainer.slideUp(function() {
                $goalContainer.addClass("collapsed").css("display","block");
            });
            $targetExpandBtn.removeClass("glyphicon-chevron-up");
            $targetExpandBtn.addClass("glyphicon-chevron-down");
        }
    },
    'keyup textarea.goal-description,input.goal-title':_.debounce(function (event, instance) {
        let goalId = $(event.target).closest("[data-goal-id]").data("goal-id");
        console.log("keyup event");
        saveGoal(goalId);
        goalUnchanged($("#div-goal-"+goalId));
    }, 2000),
    'change input,select':_.debounce(function (event, instance) {
        if (!Session.get("saving")) {
            let goalId = $(event.target).closest("[data-goal-id]").data("goal-id");
            console.log("change event",event);
            saveGoal(goalId);
            goalUnchanged($("#div-goal-"+goalId));
        }
    }, 2000),
    'dp.change':_.debounce(function (event, instance) {
        if (!Session.get("saving")) {
            let goalId = $(event.target).closest("[data-goal-id]").data("goal-id");
            console.log("change event",event);
            saveGoal(goalId);
            goalUnchanged($("#div-goal-"+goalId));
        }
    }, 2000),
    'click div.team-goal-title[data-id]'(event, instance) {
        if (!Session.get("saving")) {
            _hasSubgoalView.set(true);
            let gid = $(event.target).data("id");
            _subgoalId.set(gid);
            FlowRouter.go("/teamGoals/"+FlowRouter.getParam('teamName')+"/"+gid);
            $("#goal-modal-sub").prop("disabled",false).modal("show");
        }
    }
});

function getTeamName() {
    let teamName = Template.instance().teamName;
    return teamName;
}
Template.team_goals.helpers({
    goalReload() {
        return Session.get("goalReload");
    },
    hasGoals() {
        let teamName = getTeamName();
        let g = TeamGoal.find( {teamName: teamName, parentId: '', reachedDate: null} ).fetch();
        return g.length > 0;
    },
    hasReachedGoals() {
        let teamName = getTeamName();
        let g = TeamGoal.find( {teamName: teamName, parentId: '', reachedDate: {$ne:null}} ).fetch();
        return g.length > 0;
    },
    teamGoals() {
        let teamName = getTeamName();
        let g = TeamGoal.find( {teamName: teamName, parentId: '', reachedDate: null} ).fetch();
        return g;
    },
    teamReachedGoals() {
        let teamName = getTeamName();
        let g = TeamGoal.find( {teamName: teamName, parentId: '', reachedDate: {$ne:null}} ).fetch();
        return g;
    },
    blankGoal() {
        return Object.assign({teamName: Template.instance().teamName}, BLANK_GOAL);
    },
    hasSubgoalView() {
        let hasView = _hasSubgoalView.get();
        let gid = _subgoalId.get();
        if (hasView) {
            return true;
        } else {
            return false;
        }
    },
    subgoal() {
        let hasView = _hasSubgoalView.get();
        let subgoalId = Template.instance().modalGoalId;
        subgoalId = _subgoalId.get();
        let g = TeamGoal.findOne( {_id: subgoalId} );
        if (g) {
            return g;
        } else {
            return {};
        }
    },
    team() {
        return getTeamName();
    },
    teamSlug() {
        return getTeamName().split(" ").join("-");
    },
    goalComments(goalId) {
        let g = TeamGoal.findOne( {_id: goalId} );
        if (!g) {
            return;
        }
        let c = g.goalComments;
        return c;
    },
    reviewComments(goalId) {
        let g = TeamGoal.findOne( {_id: goalId} );
        if (!g) {
            return;
        }
        let c = g.reviewComments;
        return c;
    },
    formatDate(dateObj) {
        return dateObj.toLocaleDateString();
    },
    getUserName(userId) {
        let u = User.findOne( {_id: userId} );
        if (!u) return "";
        let fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
        return fullName;
    },
    userList() {
        let list = [
            {id: 1, name: "George"},
            {id: 2, name: "Frank"}
        ];
        return list;
    }
});

Template.goal_view.onRendered(function () {
});

Template.goal_view.helpers({
    childGoals() {
        let goalId = Template.instance().data.goal._id;
        let children = TeamGoal.find( {parentId: goalId} ).fetch();
        return children;
    },
    hasChildren() {
        let goalId = Template.instance().data.goal._id;
        let doesHave = TeamGoal.find( {parentId: goalId} ).fetch().length > 0;
        return doesHave;
    },
    goalComments(goalId) {
        if (goalId === BLANK_GOAL._id) {
            return;
        }
        let g = TeamGoal.findOne( {_id: goalId} );
        if (!g) {
            return;
        }
        let c = g.goalComments;
        return c;
    },
    reviewComments(goalId) {
        if (goalId === BLANK_GOAL._id) {
            return;
        }
        let g = TeamGoal.findOne( {_id: goalId} );
        if (!g) {
            return;
        }
        let c = g.reviewComments;
        return c;
    },
    formatDate(dateObj) {
        return dateObj.toLocaleDateString();
    },
    dateField(fld) {
        let goal = Template.instance().data.goal;
        if (goal._id == BLANK_GOAL._id) {
            return "";
        }
        let d = goal[fld];
        if ( !(d instanceof Date) ) {
            return "";
        }
        let dateText = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,-1);
        return dateText;
    },
    getUserName(userId) {
        let u = User.findOne( {_id: userId} );
        if (!u) return "";
        let fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
        return fullName;
    },
    userList() {
        let userList = [];
        User.find( {} ).forEach( (user) => {
            userList.push({
                text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
                value: user._id
            })
        });
        return userList;
    },
    progressPct() {
        let goal = Template.instance().data.goal;
        let g = TeamGoal.findOne( {_id: goal._id} );
        if (!g) return 0;

        console.log("88888888888888888888888888",g);
        if (!g.dueDate || !g.startDate || "undefined" === typeof g.dueDate || "undefined" === typeof g.startDate) {
            return 0;
        }
        let currDt = new Date().getTime();
        console.log(currDt,g.dueDate,g.startDate);
        let totalDuration = g.dueDate.getTime() - g.startDate.getTime();
        console.log(totalDuration);
        let timeSinceStart = currDt - g.startDate.getTime();
        console.log(timeSinceStart);
        let pct = (timeSinceStart / totalDuration);
        console.log(pct,"%%%%%%%%%%");
        return Math.min(parseInt(pct*100),100);
    },
    userHasModifyPerm(fld) {
        let goal = Template.instance().data.goal;
        let g = TeamGoal.findOne( {_id: goal._id} );
        if (!g) return true;
        return g.hasModifyPerm(fld);
    },
    fldEnabled(fld) {
        let goal = Template.instance().data.goal;
        let g = TeamGoal.findOne( {_id: goal._id} );

        if (!g) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', goal.teamName)) {
                return "";
            } else {
                return "disabled";
            }
        }

        if (g.hasModifyPerm(fld)) {
            return "";
        } else {
            return "disabled";
        }
    },
    commaListUsers(lst) {
        var nameList = [];

        let goal = Template.instance().data.goal;
        let g = TeamGoal.findOne( {_id: goal._id} );

        for (let i = 0; i < lst.length; i++) {
            let u = User.findOne( {_id: lst[i]} );
            nameList.push(u.MyProfile.firstName + " " + u.MyProfile.lastName);
        }
        return nameList.join(', ');
    },
    isNew(id) {
        return BLANK_GOAL._id === id;
    },
    collapsed(pid) {
        //if this goal has a parent it is being displayed in a modal and should not be collapsed
        if ("" !== pid) {
            return "";
        } else {
            return "collapsed";
        }
    }
})
Template.child_goal_view.helpers({
    childGoals() {
        let goalId = Template.instance().data.goal._id;
        let children = TeamGoal.find( {parentId: goalId} ).fetch();
        return children;
    },
    hasChildren(goalId) {
        goalId = Template.instance().data.goal._id;
        let doesHave = TeamGoal.find( {parentId: goalId} ).count() > 0;
        return doesHave;
    }
});
