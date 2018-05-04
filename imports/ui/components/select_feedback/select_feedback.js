import { Meteor } from 'meteor/meteor';
import './select_feedback.html';

function clicky(event) {
    if ($(event.target).closest("#feedback-box").length) {
        return;
    }
    let selectedText = window.getSelection().toString();
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
    $(document).on('mouseup', clicky);
    this.autorun( () => {
        console.log("autorun");
    });
});

Template.select_feedback.onDestroyed(function () {
    $(document).off('mouseup', clicky);
});

Template.select_feedback.helpers({
    asdf() {
        console.log("blah");
    }
})

Template.body.events({
    'mouseup #feedback-box'(event, instance) {
        console.log("oooooooo");
        event.preventDefault();
        event.stopPropagation();
    },
    'keypress'(event, instance) {
        console.log("blah blah blah");
    },
    'click h1'(event, instance) {
        console.log("h1n1 clicky");
    },
    'click .modal'(event, instance) {
        console.log("fewqfeqwfewqfqwefewqfeqwfewq");
    }
});
