import { Qnaire,QuestionType } from '/imports/api/qnaire/qnaire.js';
import './qnaire_build.html';

const BLANK_Q = {
    _id: "new",
    label: "new",
    text: ""
};

Template.qnaire_build.onCreated(function () {
    //
    this.qid = FlowRouter.getParam('qnaireId');
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", this.qid);
    this.autorun( () => {
        this.subscription = this.subscribe('qnaireData', this.qid, {
            onStop: function () {
                console.log("Team Goals subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Team Goals subscription ready! ", arguments, this);
            }
        });
    });
});
Template.qnaire_build.helpers({
    title() {
        let q = Qnaire.findOne( {_id:Template.instance().qid} );
        if (!q) return "";
        return q.title;
    },
    description() {
        let q = Qnaire.findOne( {_id:Template.instance().qid} );
        if (!q) return "";
        return q.description;
    },
    questions() {
        let q = Qnaire.findOne( {_id:Template.instance().qid} );
        if (!q) return [];
        return q.questions;
    },
    blankQuestion() {
        return BLANK_Q;
    }
});

Template.qnaire_build.events({
    'click button#create-question'(event, instance) {
        let tval = QuestionType[$("#q-"+BLANK_Q.label+"-type").val()];
        console.log(tval,$("#q-"+BLANK_Q.label+"-type").val());
        let newQ = {
            label: $("#q-"+BLANK_Q.label+"-label").val(),
            text: $("#q-"+BLANK_Q.label+"-text").val(),
            qtype: tval,
            template: "default",
            condition: "test"
        };
        let q = Qnaire.findOne( {_id:Template.instance().qid} );
        if (!q) return [];
        q.addQuestion(newQ);
        $("#q-"+BLANK_Q.label+"-label").val('');
        $("#q-"+BLANK_Q.label+"-text").val('');
        $("#q-"+BLANK_Q.label+"-type").val(QuestionType.getIdentifier(0));
    },
    'change select.q-type'(event, instance) {
        let $seltype = $(event.target);
        console.log("changed",$seltype.val());
        switch ($seltype.val()) {
        case "openend":
        case "display":
            $seltype.closest("div.q").find(".item-list").hide();
            break;
        case "numeric":
        case "single":
        case "multi":
        case "nested":
        default:
            $seltype.closest("div.q").find(".item-list").show();
            break;
        }
    }
});

Template.qinput.helpers({
    respList() {
        return Template.instance().data.question.list;
    },
    types() {
        return QuestionType.getIdentifiers();
    },
    selected(ntype) {
        console.log("((",ntype, this.question.qtype,"))");
        if (ntype === this.question.qtype) {
            return "selected";
        }
        return "";
    },
    hideList() {
        console.log("hide list",this.question,QuestionType);
        switch (this.question.qtype) {
        case QuestionType.openend:
        case QuestionType.display:
            return "display:none;";
            break;/*
        case QuestionType.numeric:
        case QuestionType.single:
        case QuestionType.multi:
        case QuestionType.nested:
            return "";
            break;
        default:
            return "style='display:none;'";
            break;*/
        }
    }
});
