import { Qnaire,QuestionType } from '/imports/api/qnaire/qnaire.js';
import { parseRange } from '/imports/api/parse_range/parse_range.js';
import './qnaire.html';
import './slider.js';

Template.qnaire.onCreated(function () {
    if (FlowRouter.getParam('qnaireId')) {
        this.qid = FlowRouter.getParam('qnaireId');
        console.log("{}{}{}",this.qid);
    }
    console.log(",,,,,,,,,,,,,,,,,,,,,,,,",parseRange("1-5"));
    this.autorun( () => {
        this.subscription = this.subscribe('qnaireData', this.qid, {
            onStop: function () {
                console.log("QnaireData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("QnaireData subscription ready! ", arguments, this);
            }
        });
    });
});
Template.qnaire.helpers({
    qid() {
        Template.instance().qid = FlowRouter.getParam('qnaireId');
        if (null === Template.instance().qid || "undefined" === Template.instance().qid || "" === Template.instance().qid) {
            return;
        }
        return Template.instance().qid;
    },
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
        for (let i = 0; i < q.questions.length; i++) {
            q.questions[i].qid = Template.instance().qid;
        }
        return q.questions;
    },
    questionnaires() {
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        let q = Qnaire.find( );
        if (!q) {
            return [];
        }
        console.log("lplplp",q.fetch());
        return q.fetch();
    },
    isDefault(question) {
        return (question.template === 'default');
    },
    dynHelp(q) {
        return {q: q};
    }
});
Template.qquestion.helpers({
    isOpenend() {
        let qtype;
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        console.log("ghghghghghghghg",qtype, this, this.q);
        return (QuestionType.openend === qtype);
    },
    isSingle() {
        let qtype;
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        return (QuestionType.single === qtype);
    },
    isNumeric() {
        let qtype;
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        return (QuestionType.numeric === qtype);
    },
    isNested() {
        let qtype;
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        return (QuestionType.nested === qtype);
    },
    isMulti() {
        let qtype;
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        return (QuestionType.multi === qtype);
    },
    numTxt(itm) {
        let splt = itm.split(';');
        if (splt.length == 1) return "";
        return splt[splt.length-1];
    },
    getqq(qid, qqlabel) {
        console.log(qid, qqlabel);
        let q = Qnaire.findOne( {_id:qid} );
        console.log("CCC",q);
        if (!q) return;
        for (let i = 0; i < q.questions.length; i++) {
            if (q.questions[i].label === qqlabel) {
                return q.questions[i];
            }
        }
    }
});
