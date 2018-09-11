import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import './qnaire.html';
Template.qnaire.onCreated(function () {
    if (FlowRouter.getParam('qnaireId')) {
        this.qid = FlowRouter.getParam('qnaireId');
        console.log("{}{}{}",this.qid);
    }
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
    }
});
