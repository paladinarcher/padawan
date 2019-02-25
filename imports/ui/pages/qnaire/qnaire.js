import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { parseRange } from '/imports/api/parse_range/parse_range.js';
import './qnaire.html';
import './slider.js';
import { maxHeaderSize } from 'http';

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
function getPageAnswers() {
	alert("hello getPageAnswers");
	console.log($(".qq-val"));
	$(".qq-val").each(function(idx, elem) {
		alert("qq-val");
		let $elem = $(elem);
		console.log(idx,$elem.closest("aaaaaaaaaaaaaaaaaaaaaaaaaaa[data-qqlabel]"),$elem.closest("[data-qqlabel]").attr("data-qqlabel"));
	});
}

function arrayByParamAndCondition(array, param, condition) {
    return array.filter(item => item[`${param}`] !== condition)
}

var readyRender = new ReactiveVar(false);

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
                readyRender.set(true);
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
                    if (rid) {
                        _resp_ = QRespondent.findOne({_id:rid});
                        console.log("My respondent ID is", rid);
                    }
                    if (!rid || !_resp_) {
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
    readyRender() {
        console.log("helper:readyRender",readyRender.get());
        return readyRender.get();
    },
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
        let update = QRespondent.findOne({});
        console.log('update respondent: ', update);
        if (q.shuffle) {
            let notDeactivated = arrayByParamAndCondition(q.questions, 'deactivated', true)
            qqList = _.shuffle(notDeactivated);
            start = 0;
        } else {
            let notDeactivated = arrayByParamAndCondition(q.questions, 'deactivated', true)
            qqList = notDeactivated;
        }
        console.log("questions helper");
        for (let i = start; (i < qqList.length) && (rtn.length < q.qqPerPage); i++) {
            console.log("loop",i);
            qqList[i].qnrid = Template.instance().qnrid();
            if (_resp_.hasNoResponse(qqList[i].label) && ("" === qqList[i].condition || !!eval(qqList[i].condition)) ) {
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
    },
    minQuestionPct() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return 0;
        let pg = Template.instance().qnrpage();
        let start = ((pg-1)*q.qqPerPage);
        let min = q.minumum - start;
        let pct = 0;
        if(min >= 0) {
            pct = (min/q.questions.length)*100;
        }
        return pct;
    },
    currentQuestionPct() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return 0;
        let pg = Template.instance().qnrpage();
        let start = ((pg-1)*q.qqPerPage);
        let pct = (start/q.questions.length)*100;
        return pct;
    },
    eachQuestion() {
        let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
        if (!q) return [];
        let qlen = Array.from(q.questions.keys())
        return qlen;
    }
});
Template.qnaire.events({
    'click a.a-qnr-select'(event, instance) {
        let qnrid = $(event.target).data("qnrid");
        instance._qnrid.set(qnrid);
    },
    'click button#finish'(event, instance) {
		// get qnaire information
		let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
		let qnAnswers = [];
		$(".qq-val").each(function(idx, elem) {
			let $elem = $(elem);
			console.log(idx,$elem.closest("[data-qqlabel]"),$elem.closest("[data-qqlabel]").attr("data-qqlabel"));
			let qqlbl = $elem.closest("[data-qqlabel]").data("qqlabel");
			let val = "";
			if ($elem.is(":radio") || $elem.is(":checkbox")) {
				if ($elem.is(":checked")) {
					console.log("checked", new Number($elem.val()));
					resp.recordResponse( qqlbl, $elem.val() );
					console.log("resp.recordResponse(", qqlbl, ",", $elem.val(), ")" );
					qnAnswers.push($elem.val());

				}
			} else if ($elem.is("textarea")) {
				console.log("tttttttttt",$elem.text(),$elem.val());
				resp.recordResponse(qqlbl, $elem.val());
				console.log("resp.recordResponse(", qqlbl, ",", new String($elem.val()), ")" );
				qnAnswers.push($elem.val());
			} else if ($elem.is("input[type=number]")) {
				val = $elem.val();
				resp.recordResponse(qqlbl, val);
				console.log("resp.recordResponse(", qqlbl, ",", val, ")" );
				qnAnswers.push($elem.val());
			} else {
				console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
			}
		});
		// Send qnaire information to the user class and go to next page
		thisQnaire = Qnaire.findOne({"_id" : instance.qnrid()}).questions[instance.qnrpage() - 1]
		console.log("ffffffffffffffffdddddddddddssssssssssssss", thisQnaire);
		//getPageAnswers();
        Meteor.call('user.addQnaireQuestion', instance.qnrid(), thisQnaire.label, thisQnaire.text, qnAnswers,  (error) => {
            if (error) {
                console.log("EEEEEERRRORRRRR: ", error);
				alert("Something went wrong when submitting");
            } else {
				instance._qnrpage.set(parseInt(instance.qnrpage())+1);
				FlowRouter.go("/dashboard");
            }
        });
        
        let label = Qnaire.findOne({ "_id": instance.qnrid() }).questions[instance.qnrpage() - 1].label;
        let qnaireId = instance.qnrid();
        Meteor.call('qnaire.checkEditDisabled', qnaireId, label);
	},
    'click button#continue'(event, instance) {
		// get qnaire information
		let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
		let qnAnswers = [];
		$(".qq-val").each(function(idx, elem) {
			let $elem = $(elem);
			console.log(idx,$elem.closest("[data-qqlabel]"),$elem.closest("[data-qqlabel]").attr("data-qqlabel"));
			let qqlbl = $elem.closest("[data-qqlabel]").data("qqlabel");
			let val = "";
			if ($elem.is(":radio") || $elem.is(":checkbox")) {
				if ($elem.is(":checked")) {
					console.log("checked", new Number($elem.val()));
					resp.recordResponse( qqlbl, $elem.val() );
					console.log("resp.recordResponse(", qqlbl, ",", $elem.val(), ")" );
					qnAnswers.push($elem.val());

				}
			} else if ($elem.is("textarea")) {
				console.log("tttttttttt",$elem.text(),$elem.val());
				resp.recordResponse(qqlbl, $elem.val());
				console.log("resp.recordResponse(", qqlbl, ",", new String($elem.val()), ")" );
				qnAnswers.push($elem.val());
			} else if ($elem.is("input[type=number]")) {
				val = $elem.val();
				resp.recordResponse(qqlbl, val);
				console.log("resp.recordResponse(", qqlbl, ",", val, ")" );
				qnAnswers.push($elem.val());
			} else {
				console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
			}
		});
		// Send qnaire information to the user class and go to next page
		thisQnaire = Qnaire.findOne({"_id" : instance.qnrid()}).questions[instance.qnrpage() - 1]
		console.log("aaaaaaaaaaaaffffffffffffffffdddddddddddssssssssssssss", thisQnaire);
		//getPageAnswers();
        Meteor.call('user.addQnaireQuestion', instance.qnrid(), thisQnaire.label, thisQnaire.text, qnAnswers,  (error) => {
            if (error) {
                console.log("EEEEEERRRORRRRR: ", error);
				alert("Something went wrong when submitting");
        	} else {
                readyRender.set(false);
                Meteor.setTimeout(function() {
                    readyRender.set(true);
                },300);
                instance._qnrpage.set(parseInt(instance.qnrpage())+1);
                FlowRouter.go("/qnaire/"+instance.qnrid()+"?p="+instance.qnrpage());
        	}

        });

        let label = Qnaire.findOne({ "_id": instance.qnrid() }).questions[instance.qnrpage() - 1].label;
        let qnaireId = instance.qnrid();
        Meteor.call('qnaire.checkEditDisabled', qnaireId, label);
    }
},{}
);

Template.qquestion.helpers({
    isOpenend() {
        //console.log("1111111111111");
        let qtype;
        //console.log("2222222222222");
        if ("undefined" !== typeof this.qtype) {
            qtype = this.qtype;
        } else {
            qtype = this.q.qtype;
        }
        //console.log("3333333333333");
        //console.log("ghghghghghghghg",qtype, this, this.q);
        return (QuestionType.openend === qtype);
    },
    isSingle() {
        let qtype;
        //console.log("=================================================");
        //console.log(this, Template.instance());
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
        //console.log(qnrid, qqlabel);
        let q = Qnaire.findOne( {_id:qnrid} );
        //console.log("CCC",q);
        if (!q) return;
        for (let i = 0; i < q.questions.length; i++) {
            if (q.questions[i].label === qqlabel) {
                return q.questions[i];
            }
        }
    }
});
