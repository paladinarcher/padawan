import { Meteor } from 'meteor/meteor';
import { UserFeedback } from '/imports/api/user_feedback/user_feedback.js';
import './select_feedback.html';

var selectedText;
function selectionHandler(event) {
    if ($(event.target).closest("#feedback-box").length) {
        return;
    }
    selectedText = window.getSelection().toString();
    console.log(selectedText);
    $("#sf-feedback-context").html(selectedText);
    if (selectedText === "") {
        $("#sf-instruction-selected").hide();
        $("#sf-instruction-begin").show();
    } else {
        $("#sf-instruction-selected").show();
        $("#sf-instruction-begin").hide();
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
    $(document).off('mouseup', clicky);
});

Template.select_feedback.helpers({
    commentsMade() {
        let uf = UserFeedback.find({userId:Meteor.userId(),source:Template.instance().data.source}).fetch();
        console.log(uf);
        return uf;
    }
});

Template.select_feedback.events({
    'keyup #mytextarea'(event, instance) {
        $("#feedback-save").prop("disabled",false);
    },
    'click button#feedback-cancel'(event, instance) {
        console.log("cancel");
        $("#sf-instruction-selected").hide();
        $("#sf-instruction-begin").show();
    },
    'click button#feedback-save'(event, instance) {
        console.log(Template.instance());
        let fbk = {
            source: Template.instance().data.source,
            context: selectedText,
            comment: $("#mytextarea").val()
        };
        Meteor.call('feedback.createNewFeedback', fbk, (err,rslt) => {
            console.log(err,rslt);
        });
        $("#sf-instruction-selected").hide();
        $("#sf-instruction-begin").show();
    }
});
