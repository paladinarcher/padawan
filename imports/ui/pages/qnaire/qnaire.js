import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { parseRange } from '/imports/api/parse_range/parse_range.js';
import './qnaire.html';
import './slider.js';

//function $a(qqlbl) {
//}

var _resp_, qnrid;
function $q(qqlbl) {
    console.log( '$q(',qqlbl,')' );
    let qnr = Qnaire.findOne( {_id:Template.instance().qnrid()} );
    let qq = qnr.getQuestion(qqlbl);
    console.log(qq);
    return qq;
}
function $a(qqlbl) {
    let ans = _resp_.getResponse(qqlbl);
    let qq = $q(qqlbl);
    console.log( '$a(',qqlbl,') == ',ans.toString(), qq );
    switch (qq.qtype) {
    case QuestionType.openend:
        return ans.toString();
        break;
    case QuestionType.numeric:
    case QuestionType.single:
        console.log("parseFloat", parseFloat(ans[0].toString()));
        return parseFloat(ans[0].toString());
        break;
    default:
        return ans;
    }
}

Template.qnaire.onCreated(function () {
    this._qnrid = new ReactiveVar(FlowRouter.getParam('qnaireId'));
    this.qnrid = () => this._qnrid.get();
    this._qnrpage = new ReactiveVar((parseInt(FlowRouter.getQueryParam('p')) ? FlowRouter.getQueryParam('p') : 1));
    this.qnrpage = () => this._qnrpage.get();
    qnrid = this.qnrid();

    //console.log(",,,,,,,,,,,,,,,,,,,,,,,,",parseRange("1-5"));
    this.autorun( () => {
        this.subscription = this.subscribe('qnaire', this.qnrid(), {
            onStop: function () {
                console.log("Qnaire subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Qnaire subscription ready! ", arguments, this);
            }
        });
        let that = this;
        this.subscription2 = this.subscribe('qnaireData', this.qnrid(), {
            onStop: function () {
                console.log("QnaireData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("QnaireData subscription ready! ", arguments, this);
                var qnr;
                if (that.qnrid()) {
                    let rid = Session.get("rid"+that.qnrid());
                    if (!rid) {
                        Meteor.call('qnaire.createNewQnaireData', that.qnrid(), function (err, res) {
                            _resp_ = QRespondent.findOne({_id:res});
                            rid = _resp_._id;
                            Session.setPersistent("rid"+that.qnrid(),rid);
                            console.log("respondent created", _resp_);
                            console.log('getResponse',_resp_.getResponse('q8'));
                        });
                    } else {
                        _resp_ = QRespondent.findOne({_id:rid});
                        console.log("respondent exists:", _resp_);
                        Session.setPersistent("rid"+that.qnrid(),rid);
                        console.log('getResponse',_resp_.getResponse('q8'));
                    }
                } else {
                    console.log("^^^^^^^^^^^^^^^^^^^^^^^", that);
                }
            }
        });
    });
});
Template.qnaire.helpers({
    qnrid() {
        return Template.instance().qnrid();
        /*
        Template.instance().qnrid = FlowRouter.getParam('qnaireId');
        if (null === Template.instance().qnrid || "undefined" === Template.instance().qnrid || "" === Template.instance().qnrid) {
            return;
        }
        return Template.instance().qnrid;
        */
    },
    title() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return "";
        return q.title;
    },
    description() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return "";
        return q.description;
    },
    questions() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return [];
        let pg = Template.instance().qnrpage();
        let start = ((pg-1)*q.qqPerPage);
        let rtn = [];
        let qqList;
        if (q.shuffle) {
            qqList = _.shuffle(q.questions);
            start = 0;
        } else {
            qqList = q.questions;
        }
        for (let i = start; i < qqList.length && rtn.length < q.qqPerPage; i++) {
            qqList[i].qnrid = Template.instance().qnrid();
            if (!_resp_.hasResponse(qqList[i].label) && ("" === qqList[i].condition || !!eval(qqList[i].condition)) ) {
                rtn.push(qqList[i]);
            }
        }
        return rtn;
    },
    questionnaires() {
        let q = Qnaire.find( );
        if (!q) {
            return [];
        }
        return q.fetch();
    },
    isDefault(question) {
        return (question.template === 'default');
    },
    dynHelp(q) {
        return {q: q};
    },
    condition(q) {
        if ("" === q.condition) {
            return true;
        } else {
            console.log( "eval(",q.condition,")", !!(eval(q.condition)) )
            return !!(eval(q.condition));
        }
    },
    next() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return true;
        let pg = Template.instance().qnrpage();
        let start = ((pg-1)*q.qqPerPage);
        if (start + q.qqPerPage >= q.questions.length) {
            return false;
        }
        return true;
    }
});
Template.qnaire.events({
    'click a.a-qnr-select'(event, instance) {
        let qnrid = $(event.target).data("qnrid");
        instance._qnrid.set(qnrid);
    },
    'click button#continue'(event, instance) {
        let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",instance.qnrid(),resp);
        $(".qq-val").each(function(idx, elem) {
            let $elem = $(elem);
            console.log(idx,$elem.closest("[data-qqlabel]"),$elem.closest("[data-qqlabel]").attr("data-qqlabel"));
            let qqlbl = $elem.closest("[data-qqlabel]").data("qqlabel");
            let val = "";
            if ($elem.is(":radio") || $elem.is(":checkbox")) {
                if ($elem.is(":checked")) {
                    console.log("checked", new Number($elem.val()));
                    resp.recordResponse( qqlbl, $elem.val() );
                }
            } else if ($elem.is("textarea")) {
                console.log("tttttttttt",$elem.text(),$elem.val());
                resp.recordResponse(qqlbl, new String($elem.val()));
            } else {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            }
        });
        instance._qnrpage.set(parseInt(instance.qnrpage())+1);
        FlowRouter.go("/qnaire/"+instance.qnrid()+"?p="+instance.qnrpage());
    }
});

Template.qquestion.helpers({
    isOpenend() {
        console.log("1111111111111");
        let qtype;
        console.log("2222222222222");
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        console.log("3333333333333");
        console.log("ghghghghghghghg",qtype, this, this.q);
        return (QuestionType.openend === qtype);
    },
    isSingle() {
        let qtype;
        console.log("=================================================");
        console.log(this, Template.instance());
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
    getqq(qnrid, qqlabel) {
        console.log(qnrid, qqlabel);
        let q = Qnaire.findOne( {_id:qnrid} );
        console.log("CCC",q);
        if (!q) return;
        for (let i = 0; i < q.questions.length; i++) {
            if (q.questions[i].label === qqlabel) {
                return q.questions[i];
            }
        }
    }
});
