import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { parseRange } from '/imports/api/parse_range/parse_range.js';
import './qnaire.html';
import './slider.js';
import { maxHeaderSize } from 'http';
import { User } from '/imports/api/users/users.js';

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

function recordResponses(finish, instance) {
    let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
    let checkBoxArr = [];
    let checkBoxLabel = "";
    $(".qq-val").each(function(idx, elem) {
        let $elem = $(elem);
        console.log(idx,$elem.closest("[data-qqlabel]"),$elem.closest("[data-qqlabel]").attr("data-qqlabel"));
        let qqlbl = $elem.closest("[data-qqlabel]").data("qqlabel");
        let qqlblArr = $('.panel-body');
        console.log("$elem: ", $elem);
        console.log("qqlblArr: ", qqlblArr);
        let val = "";
        if ($elem.is(":radio") || $elem.is(":checkbox")) {
            if ($elem.is(":checked")) {
                console.log("checked", new Number($elem.val()));
                console.log("checked values: ", $elem.val());
                checkBoxLabel = qqlbl;
                checkBoxArr.push(parseInt($elem.val()));
            }
        } else if ($elem.is("textarea")) {
            console.log("tttttttttt",$elem.text(),$elem.val());
            if ($elem.val() != "") // was the question answered
            {
                // resp.recordResponse(qqlbl, $elem.val(), finish);
                Meteor.call('qnaireData.recordResponse', qqlbl, $elem.val(), finish, Session.get("rid"+instance.qnrid()), function (err, rslt) {
                    console.log(err, rslt);
                })
                resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
                console.log("resp.recordResponse(", qqlbl, ",", new String($elem.val()), ",", finish, ")" );
            } else {
                console.log("Answer was left blank. Not saving.");
            }
        } else if ($elem.is("input[type=number]")) {
            val = $elem.val();
            if ($elem.val() != 0) { // was the response changed from 0
                // resp.recordResponse(qqlbl, val, finish);
                Meteor.call('qnaireData.recordResponse', qqlbl, val, finish, Session.get("rid"+instance.qnrid()), function (err, rslt) {
                    console.log(err, rslt);
                })
                resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
                console.log("resp.recordResponse(", qqlbl, ",", val, ",", finish, ")" );
            } else {
                console.log("Aswer was left at 0. Not saving.")
            }
        } else {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        }
    });
    if (checkBoxArr.length > 0) {
        // resp.recordResponse( checkBoxLabel, checkBoxArr, finish );
        Meteor.call('qnaireData.recordResponse', checkBoxLabel, checkBoxArr, finish, Session.get("rid"+instance.qnrid()), function (err, rslt) {
            console.log(err, rslt);
        })
        resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
        console.log("resp.recordResponse(", checkBoxLabel, ",", checkBoxArr, ",", finish, ")" );
    }
    // 5c9544d9baef97574 is the qnaire id of the imported mbti qnaire
    if (resp.qnrid === '5c9544d9baef97574') {
        updateMbtiQnaire(instance);
    }
}

function updateMbtiQnaire(instance) {
    console.log('hello updateMbtiQnaire');
    let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
    let qnr = Qnaire.findOne( {_id:Template.instance().qnrid()} );
    qnr.questions.forEach((q) => {
        console.log('q: ', q);
        console.log('q.list[2]: ', q.list[2]);
    });
    console.log('qnr: ', qnr);
    resp.responses.forEach(function(element) {
        console.log('element: ', element);
    });
    // list 3rd line and _IE _IEcount responses
    //Meteor.call('qnaireData.recordResponse', qqlbl, val, finish, Session.get("rid"+instance.qnrid()), function (err, rslt) {
    //    console.log(err, rslt);
    //});
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

							// add users MyProfile.QnaireResponses to the new QRespondent's id
							
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
        this.subscription3 = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
    });
});


Template.qnaire.onCreated(function () {
    Meteor.setTimeout(function() {
		let userid = Meteor.userId();
		let user = User.findOne({_id: userid});
		// set the user QuestionaireRespondents if it isn't already set
		if (userid) {
			let qRespIds = user.MyProfile.QnaireResponses;
			let ridExists = false;
			// check to see if QRespondent _id is already in users
			qRespIds.forEach(function(curRid, index) {
				if (curRid == _resp_._id) {
					ridExists = true;
				}
			});
			//alert(ridExists);
			if (!ridExists) {
				// add QRespondent _id to users QnaireResponses array
				user.MyProfile.addQnaireResponse(_resp_._id);
			}
		}
    }, 1);
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
		// mbti qnaire starts with 8 personality questions that should be skipped
		if (q._id === '5c9544d9baef97574') {
			let mbtiLabels = ['_IE', '_NS', '_TF', '_JP', '_IE_count', '_NS_count', '_TF_count', '_JP_count'];
			mbtiLabels.forEach((mbtiLabel) => {
				let index = q.questions.map((e) => { return e.label; }).indexOf(mbtiLabel);
				if (index > -1) {
					q.questions.splice(index, 1);
				}
			})
			console.log('q.questions: ', q.questions);
		}

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
        console.log('rtn: ', rtn);
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
    },
    isAnswered(questionList) {
        Session.set('isAnswered', 'unknown'); // make questionIsAnswered reactive
        let resp = QRespondent.findOne( {_id:Session.get("rid"+Template.instance().qnrid())} );
        if (resp !== undefined) {
            Session.set('isAnswered', true);
            let isAnswered = true;
            let q = Qnaire.findOne( {_id:Template.instance().qnrid()} );
            questionList.forEach(function(thisQuestion) {
                let answered = resp.responses.map(r => r.qqLabel);
                if (!answered.includes(thisQuestion.label)) {
                    Session.set('isAnswered', false);
                }
            })
            if (Session.get('isAnswered')) {
                return "Question already answered";
            } else {
                return "Question not answered";
            }
        }
    },
    shouldDisable() {
        if (Template.instance().qnrpage() > 1) {
            return "";
        } else {
            return "disabled";
        }
    }
});
Template.qnaire.events({
    'click a.a-qnr-select'(event, instance) {
        let qnrid = $(event.target).data("qnrid");
        instance._qnrid.set(qnrid);
    },
    'click button#finish'(event, instance) {
		// get qnaire information from web page
		let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
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
				}
			} else if ($elem.is("textarea")) {
				console.log("tttttttttt",$elem.text(),$elem.val());
				resp.recordResponse(qqlbl, $elem.val());
				console.log("resp.recordResponse(", qqlbl, ",", new String($elem.val()), ")" );
			} else if ($elem.is("input[type=number]")) {
				val = $elem.val();
				resp.recordResponse(qqlbl, val);
				console.log("resp.recordResponse(", qqlbl, ",", val, ")" );
			} else {
				console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
			}
		});
		resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
		console.log("resp2: ", resp);
		let userid = Meteor.userId();
		let user = User.findOne({_id: userid});
		//console.log(user);
		//alert("resp2");

        let label = Qnaire.findOne({ "_id": instance.qnrid() }).questions[instance.qnrpage() - 1].label;
        let qnaireId = instance.qnrid();
        // Meteor.call('qnaire.checkEditDisabled', qnaireId, label);

		readyRender.set(false);
		Meteor.setTimeout(function() {
			readyRender.set(true);
		},300);
		instance._qnrpage.set(parseInt(instance.qnrpage())+1);
		FlowRouter.go("/dashboard");
	},
    'click button#continue'(event, instance) {
		// get qnaire information from web page
		let resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
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
				}
			} else if ($elem.is("textarea")) {
				console.log("tttttttttt",$elem.text(),$elem.val());
				resp.recordResponse(qqlbl, $elem.val());
				console.log("resp.recordResponse(", qqlbl, ",", new String($elem.val()), ")" );
			} else if ($elem.is("input[type=number]")) {
				val = $elem.val();
				resp.recordResponse(qqlbl, val);
				console.log("resp.recordResponse(", qqlbl, ",", val, ")" );
			} else {
				console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
			}
		});
		resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
		console.log("resp2: ", resp);
		let userid = Meteor.userId();
		let user = User.findOne({_id: userid});
		//console.log(user);
		//alert("resp2");

        let label = Qnaire.findOne({ "_id": instance.qnrid() }).questions[instance.qnrpage() - 1].label;
        let qnaireId = instance.qnrid();
        // Meteor.call('qnaire.checkEditDisabled', qnaireId, label);

		readyRender.set(false);
		Meteor.setTimeout(function() {
			readyRender.set(true);
		},300);
		instance._qnrpage.set(parseInt(instance.qnrpage())+1);
		FlowRouter.go("/qnaire/"+instance.qnrid()+"?p="+instance.qnrpage());
    },
    'click button#previous'(event, instance) {
        // get qnaire information from web page
        let finish = false;
        recordResponses(finish, instance);
        
        resp = QRespondent.findOne( {_id:Session.get("rid"+instance.qnrid())} );
        console.log("resp2: ", resp);
        let userid = Meteor.userId();
        let user = User.findOne({_id: userid});

        let label = Qnaire.findOne({ "_id": instance.qnrid() }).questions[instance.qnrpage() - 1].label;
        let qnaireId = instance.qnrid();
        // Meteor.call('qnaire.checkEditDisabled', qnaireId, label);

        readyRender.set(false);
        Meteor.setTimeout(function() {
            readyRender.set(true);
        },300);
        if (instance.qnrpage() != 1) {
            instance._qnrpage.set(parseInt(instance.qnrpage())-1);
        }
        FlowRouter.go("/qnaire/"+instance.qnrid()+"?p="+instance.qnrpage());
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
        console.log("QuestionType.multi: ", QuestionType.multi);
        console.log("qtype: ", qtype);
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
