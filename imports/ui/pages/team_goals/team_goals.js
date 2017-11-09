import { Meteor } from 'meteor/meteor';
import { User } from '/imports/api/users/users.js';
import { TeamGoal } from '/imports/api/team_goals/team_goals.js';
import './team_goals.html';
import '/imports/ui/components/select_autocomplete/select_autocomplete.js';

var BLANK_GOAL = {
    _id: "new",
    title: "",
    description: ""
};

Template.team_goals.onCreated(function () {
    if (this.data.teamName) {
        this.teamName = this.data.teamName;
    } else {
        this.teamName = FlowRouter.getParam('teamName').split('-').join(' ');
    }
    Session.set("goalReload",false);

    this.userSubscriptionReady = new ReactiveVar( false );
    this.autorun( () => {
        console.log("autorunning team_goals...");
        this.subscription = this.subscribe('teamGoalsData', this.teamName, {
            onStop: function () {
                console.log("Team Goals subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Goals subscription ready! ", arguments, this);
                console.log(TeamGoal.find().fetch());
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

    let saveObj = {
        teamName: Template.instance().teamName,
        title: $("#goal-title-"+goalId).val(),
        description: $("#goal-description-"+goalId).val(),
        assignedTo: assignList,
        mentors: mentorList,
        admins: adminList
    };
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
        if ("" === parentId) {
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
                $("#btn-add-goal").prop("disabled",false);
            }
        }
        if ($(event.target).attr('id').slice(0,22) === 'input-date-reviewed-on') {
            $goal.find(".review-comments").show();
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

        if (goalId == BLANK_GOAL._id) {
            resetNewGoalForm();
            $modalParent = $t.closest(".modal");
            if ($modalParent.length) {
                $modalParent.modal('hide');
                $newgoal = $("#div-goal-new").detach();
                $newgoal.data("parent-id","");
                $("#blank-goal").find("col-sm-12").html($newgoal);
            } else {
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
        $("#goal-modal").find(".modal-body").append($newgoal);
        $("#goal-modal").modal("show");
    },
    'click button.btn-cancel'(event, instance) {
        let $t = $(event.target);
        let goalId = $t.closest("[data-goal-id]").data("goal-id");

        if (goalId == BLANK_GOAL._id) {
            resetNewGoalForm();
            $modalParent = $t.closest(".modal");
            if ($modalParent.length) {
                $modalParent.modal('hide');
                $newgoal = $("#div-goal-new").detach();
                $newgoal.data("parent-id","");
                $("#blank-goal").find("col-sm-12").html($newgoal);
            } else {
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
        let txtAdd = $btnAdd.data("txt-add");
        let txtSave = $btnAdd.data("txt-save");
        $goal = $btnAdd.closest("[data-goal-id]")
        let goalId = $goal.data("goal-id");

        $(".goal-controls").hide();
        let $btnCancel = $("#blank-goal").find(".btn-cancel")
        $btnCancel.prop("disabled",false);
        $btnAdd.html(txtSave)
            .prop("disabled",true);
        $(".team-goal[data-goal-id="+goalId+"]").removeClass("collapsed");
        $("#blank-goal").slideDown();
        $("#btn-add-cancel").fadeIn();
    },
    'click button#btn-add-cancel'(event, instance) {
        let $btnAdd = $("#btn-add-goal");
        let txtAdd = $btnAdd.data("txt-add");
        let txtSave = $btnAdd.data("txt-save");
        $("#blank-goal").slideUp(400, function() {
            $btnAdd.html(txtAdd)
                .prop("disabled",false);
        });
        $("#btn-add-cancel").fadeOut();
    },
    'click button.btn-expand'(event, instance) {
        let $target = $(event.target);
        let $goalContainer = $target.closest("[data-goal-id]");
        $('html, body').animate({
            scrollTop: ($goalContainer.offset().top)
        },500);
        if ($goalContainer.hasClass("collapsed")) {
            $(".team-goal[data-goal-id]:not(.collapsed)").addClass("collapsed");
            $goalContainer.css("display","none").removeClass("collapsed").slideDown();
            $target.removeClass("glyphicon-chevron-down");
            $target.addClass("glyphicon-chevron-up");
        } else {
            $goalContainer.slideUp(function() {
                $goalContainer.addClass("collapsed").css("display","block");
            });
            $target.removeClass("glyphicon-chevron-up");
            $target.addClass("glyphicon-chevron-down");
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
        let g = TeamGoal.find( {teamName: teamName, parentId: ''} ).fetch();
        return g.length > 0;
    },
    teamGoals() {
        let teamName = getTeamName();
        let g = TeamGoal.find( {teamName: teamName, parentId: ''} ).fetch();
        console.log("goal list", g);
        return g;
    },
    blankGoal() {
        return BLANK_GOAL;
    },
    team() {
        return getTeamName();
    },
    goalComments(goalId) {
        let c = TeamGoal.findOne( {_id: goalId} ).goalComments;
        return c;
    },
    reviewComments(goalId) {
        let c = TeamGoal.findOne( {_id: goalId} ).revuewComments;
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
    if (typeof this.data.goal.reviewedOnDate === "undefined" || this.data.goal.reviewedOnDate === "") {
        $("#div-goal-"+this.data.goal._id).find(".review-comments").hide();
    }
});

Template.goal_view.helpers({
    childGoals(goalId) {
        let children = TeamGoal.find( {parentId: goalId} ).fetch();
        return children;
    },
    hasChildren(goalId) {
        let doesHave = TeamGoal.find( {parentId: goalId} ).fetch().length > 0;
        return doesHave;
    },
    goalComments(goalId) {
        if (goalId === BLANK_GOAL._id) {
            return;
        }
        let c = TeamGoal.findOne( {_id: goalId} ).goalComments;
        return c;
    },
    reviewComments(goalId) {
        if (goalId === BLANK_GOAL._id) {
            return;
        }
        let c = TeamGoal.findOne( {_id: goalId} ).reviewComments;
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
        let list = [
            {value: 1, text: "George"},
            {value: 2, text: "Frank"}
        ];
        let userList = [];
        User.find( {} ).forEach( (user) => {
            userList.push({
                text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
                value: user._id
            })
        });
        return userList;
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
    }
})
Template.child_goal_view.helpers({
    childGoals(goalId) {
        let children = TeamGoal.find( {parentId: goalId} ).fetch();
        return children;
    },
    hasChildren(goalId) {
        let doesHave = TeamGoal.count( {parentId: goalId} ) > 0;
        return doesHave;
    }
});
