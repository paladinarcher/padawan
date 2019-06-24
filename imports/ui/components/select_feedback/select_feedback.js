import { Meteor } from 'meteor/meteor';
import { UserFeedback } from '/imports/api/user_feedback/user_feedback.js';
import './select_feedback.html';

var selectedText;
function selectionHandler(event) {
    if ($(event.target).closest(".feedback-box").length) {
        //click happened inside feedback box, ignore
        return;
    }
    let $box = $(".feedback-box:visible");
    selectedText = window.getSelection().toString();
    $box.find(".sf-feedback-context-active").html(selectedText);
    if (selectedText === "") {
        $box.find(".sf-instruction-selected").hide();
        $box.find(".sf-instruction-begin").show();
        if ($box.hasClass("got-it")) {
            $box.addClass("minimized");
        }
    } else {
        $box.find(".sf-instruction-selected").show();
        $box.find(".sf-instruction-begin").hide();
        $box.removeClass("minimized");
    }
}

Template.select_feedback.onCreated(function () {
    $(document).on('mouseup', selectionHandler);
    this.autorun( () => {
        console.log("autorun", this);
        this.subscription = this.subscribe('feedback.userComments', {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            }
        });
    });
});

Template.select_feedback.onDestroyed(function () {
    $(document).off('mouseup', selectionHandler);
});

Template.select_feedback.helpers({
    commentsMade() {
        let uf = UserFeedback.find({userId:Meteor.userId(),source:Template.instance().data.source}).fetch();
        return uf;
    },
    hasComments() {
        let uf = UserFeedback.find({userId:Meteor.userId(),source:Template.instance().data.source}).fetch();
        return (uf.length > 0);
    },
    paTeam() {
        // Roles.addUsersToRoles(Meteor.userId(), 'P&A team', Roles.GLOBAL_GROUP);
        if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP) || Roles.userIsInRole(Meteor.userId(), ['member'], 'Paladin & Archer')) {
            return true;
        }
        else {
            return false;
        }
    },
    contextMenuGone(){
        event.preventDefault();
        let menu = $('#context-menu-div');
        if (menu.css('display') == 'block') {
            return 'none';
        } else {
            return 'block';
        }
    }
});

Template.select_feedback.events({
    'keyup .mytextarea'(event, instance) {
        let $box = $(".feedback-box:visible");
        $box.find(".feedback-save").prop("disabled",false);
    },
    'click button.feedback-cancel'(event, instance) {
        let $box = $(".feedback-box:visible");
        $box.find(".sf-instruction-selected").hide();
        $box.find(".sf-instruction-begin").show();
    },
    'click button.feedback-save'(event, instance) {
        let $box = $(".feedback-box:visible");
        let fbk = {
            source: Template.instance().data.source,
            context: selectedText,
            comment: $box.find(".mytextarea").val()
        };
        Meteor.call('feedback.createNewFeedback', fbk, (err,rslt) => {
            console.log(err,rslt);
        });
        // around here is where we need to have the text from the feedback text box go away
        //$box.find(".mytextarea").val() = "";
        $box.find(".mytextarea").val("");
        $box.find(".sf-instruction-selected").hide();
        $box.find(".sf-instruction-begin").show();
    },
    'click button#btn-got-it'(event, instance) {
        console.log("got it!");
        let $box = $(event.target).closest(".feedback-box");
        $box.addClass("minimized");
        $box.addClass("got-it");
    },
    'click button.btn-fullsize'(event, instance) {
        let $box = $(event.target).closest(".feedback-box");
        $box.removeClass("minimized");
        $box.removeClass("got-it");
    }
});
