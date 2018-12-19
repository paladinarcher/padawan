import { Qnaire,QuestionType } from '/imports/api/qnaire/qnaire.js';
import './qnaire_build.html';
import '../qnaire/slider.js';
import '../qnaire/slider.js';

const BLANK_Q = {
    _id: "new",
    label: "new",
    text: "",
    qtype: 0
};

Template.qnaire_build.onCreated(function () {
    Session.set("newqList",[]);
    this.qnrid = FlowRouter.getParam('qnaireId');
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", this.qnrid);
    this.autorun( () => {
        this.subscription = this.subscribe('qnaire', this.qnrid, {
            onStop: function () {
                console.log("Qnaire subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Qnaire subscription ready! ", arguments, this);
            }
        });
    });
});
Template.qnaire_build.helpers({
    title() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return "";
        return q.title;
    },
    description() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return "";
        return q.description;
    },
    questions() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return [];
        for (let i = 0; i < q.questions.length; i++) {
            q.questions[i].qnrid = Template.instance().qnrid;
        }
        return q.questions;
    },
    perpage() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return 0;
        return q.qqPerPage;
    },
    isDefault(question) {
        return (question.template === 'default');
    },
    dynHelp(question) {
        return {q: question};
    },
    shuffleChecked() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return "";
        return (q.shuffle ? "checked" : "");
    },
    blankQuestion() {
        return BLANK_Q;
    }
});

Template.qnaire_build.events({
    'click button#create-question'(event, instance) {
        let tval = QuestionType[$("#q-"+BLANK_Q.label+"-type").val()];
        console.log(tval,$("#q-"+BLANK_Q.label+"-type").val());
        let respList = [];
        $(".q[data-label="+BLANK_Q.label+"]").find(".response-list-item").each(function(idx, elem) {
            console.log(idx, $(elem).val());
            respList.push($(elem).val());
        });
        let newQ = {
            label: $("#q-"+BLANK_Q.label+"-label").val(),
            text: $("#q-"+BLANK_Q.label+"-text").val(),
            qtype: tval,
            template: $("#q-"+BLANK_Q.label+"-tpl").val(),
            list: respList,
            condition: ""
        };
        let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
        if (!q) return [];
        q.addQuestion(newQ);
        $("#q-"+BLANK_Q.label+"-label").val('');
        $("#q-"+BLANK_Q.label+"-text").val('');
        $("#q-"+BLANK_Q.label+"-type").val(QuestionType.getIdentifier(0));
        Session.set("newqList",[]);
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
        let $qcontainer = $(event.target).closest("[data-label]");
        let qlbl = $qcontainer.data("label");
        if (qlbl !== BLANK_Q.label) {
            let q = Qnaire.findOne( {_id:Template.instance().qnrid} );
            if (!q) return [];
            q.setQtype(qlbl, QuestionType[$seltype.val()]);
        }
    },
    'click button.btn-add-item'(event, instance) {
        let $qcontainer = $(event.target).closest("[data-label]");
        let qlbl = $qcontainer.data("label");
        let $valInput = $qcontainer.find(".add-list-item-label");
        let itemVal = $valInput.val();
        if (qlbl === BLANK_Q._id) {
            let newqList = Session.get("newqList");
            newqList.push(itemVal);
            Session.set("newqList", newqList);
            console.log(Session.get("newqList"));
        } else {
            let qnr = Qnaire.findOne( {_id:instance.qnrid} );
            if (!qnr) return [];
            qnr.addListItem(qlbl, itemVal);
        }
        $valInput.val("");
        console.log(qlbl, itemVal);
    },
    'keyup textarea.input-qqtext':_.debounce(function (event, instance) {
        console.log("debounced", instance);
        //if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            let qlabel = $(event.target).closest("[data-label]").data("label");
            let qnr = Qnaire.findOne( {_id:instance.qnrid} );
            if (!qnr) return [];
            qnr.updateText(qlabel, $(event.target).val());
        //}
    }, 2000),
    'keyup input.input-qqlabel':_.debounce(function (event, instance) {
        //if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            let qlabel = $(event.target).closest("[data-label]").data("label");
            let qnr = Qnaire.findOne( {_id:instance.qnrid} );
            if (!qnr) return [];
            qnr.updateLabel(qlabel, $(event.target).val());
        //}
    }, 2000),
    'keyup input.input-qqcondition':_.debounce(function (event, instance) {
        //if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            let qlabel = $(event.target).closest("[data-label]").data("label");
            let qnr = Qnaire.findOne( {_id:instance.qnrid} );
            if (!qnr) return [];
            qnr.updateCondition(qlabel, $(event.target).val());
        //}
    }, 2000),
    'keyup input.input-numpp':_.debounce(function (event, instance) {
        //if (Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
            let qlabel = $(event.target).closest("[data-label]").data("label");
            let qnr = Qnaire.findOne( {_id:instance.qnrid} );
            if (!qnr) return [];
            qnr.setPerPage( $(event.target).val() );
        //}
    }, 2000)
});

Template.qinput.helpers({
    respList() {
        if (Template.instance().data.question.label === BLANK_Q._id) {
            return Session.get("newqList");
        } else {
            return Template.instance().data.question.list;
        }
    },
    types() {
        return QuestionType.getIdentifiers();
    },
    templates() {
        let names = ['default'];
        for (name of Object.keys(Template)) {
            if (Template[name] instanceof Template && name.slice(0,2) === "qq") {
                names.push(name);
            }
        }
        return names;
    },
    selectedType(ntype) {
        console.log("((",ntype, this.question.qtype,"))");
        if (ntype === this.question.qtype) {
            return "selected";
        }
        return "";
    },
    selectedTpl(ntpl) {
        console.log("((",ntpl, this.question.template,"))");
        if (ntpl === this.question.template) {
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
