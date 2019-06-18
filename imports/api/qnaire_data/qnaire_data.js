import { Meteor } from 'meteor/meteor';
import { Class, Enum, Union } from 'meteor/jagi:astronomy';
import { Qnaire, QQuestion, QuestionType } from '../qnaire/qnaire.js';

const QQMixedType = Union.create({
    name: 'QQMixedType',
    types: [String, Number]
})
const QQuestionData = Class.create({
    name: "QquestionData",
    fields: {
        when: {
            type: Date,
            default: function() { return new Date(); }
        },
        qqLabel: {
            type: String,
            default: ''
        },
        qqData: {
            type: QQMixedType
        }
    }
});

const QRespondent = Class.create({
    name: "QRespondent",
    collection: new Mongo.Collection('qnaire_data'),
    fields: {
        qnrid: {
            type: String,
            default: ''
        },
        responses: {
            type: [QQuestionData],
            default: []
        }
    },
    helpers: {
        getResponse(qqlbl) {
            let rsp = _.find(this.responses, function(o){return o.qqLabel===qqlbl});
            if (rsp) {
                return rsp.qqData;
            } else {
                return undefined;
            }
        },
        hasNoResponse(qqlbl){
            let myRsp = QRespondent.findOne({});
            let myRsp2 = _.find(myRsp.responses, function(x){return x.qqLabel===qqlbl});
            let noRsp = (myRsp.responses == false);

            if(noRsp){
                return true;
            } else if(!myRsp2){
                return true;
            } else {
                return false;
            }
        }
    },
    meteorMethods: {
        recordResponse(arg1, arg2, finish) {
            qqlabel = arg1;
            val = arg2;
            let responseList = [];
            if (!Array.isArray(arg1)) {
                responseList[0] = [arg1, arg2];
            } else {
                responseList = arg1;
            }

            for (let i = 0; i < responseList.length; i++) {
                let qqlabel = responseList[i][0];
                let val = responseList[i][1];
                if (Meteor.isServer) {
                if (finish) {
                    this.completed = true;
                }
                // get duplicate qnaire value before deleting it
                let duplicateResp = this.responses.find((l) => {return l.qqLabel === qqlabel;}); // used in eval code
                // delete duplicate qqlabels
                let firstResponses = this.responses;
                this.responses = this.responses.filter(function(l) {
                    console.log("l.qqLabel: ", l.qqLabel); 
                    return l.qqLabel != qqlabel;
                });
                let qnr = Qnaire.findOne( {_id:this.qnrid} );
                let qq = qnr.getQuestion(qqlabel);
                let dbVal;

                switch (qq.qtype) {
                case QuestionType.openend:
                    dbVal = val;
                    console.log("openend",val,dbVal);
                    break;
                case QuestionType.numeric:
                    dbVal = val;
                case QuestionType.single:
                    dbVal = parseFloat(val);
                    console.log("numeric",val,dbVal);
                    break;
				case QuestionType.multi:
                    dbVal = parseFloat(val);
                    console.log("numeric",val,dbVal);
                    break;
                default:
                    dbVal = new Object(val);
                    console.log("other",val,dbVal);
                    break;
                }

                    let thisresp = this;
                    let $q = function (qqlbl) {
                        //console.log( 'onAnswered $q(',qqlbl,')' );
                        let getqq = qnr.getQuestion(qqlbl);
                        //console.log(getqq);
                        return getqq;
                    }
                    let $a = function (qqlbl) {
                        let ans = thisresp.getResponse(qqlbl);
                        let qq = $q(qqlbl);
                        if ("undefined" === typeof ans) {
                            return ans;
                        }
                        //console.log( '$a(',qqlbl,') == ',ans.toString() );
                        switch (qq.qtype) {
                        case QuestionType.openend:
                            return ans.toString();
                            break;
                        case QuestionType.numeric:
                        case QuestionType.single:
                            return parseFloat(ans.toString());
                            break;
                        default:
                            return ans;
                        }
                    }

                    let $set = function(setLbl, setVal) {
                        let qrespIdx = thisresp.responses.findIndex(elem => elem.qqLabel === ''+setLbl);
                        console.log('qrespIdx: ', qrespIdx);
                        console.log('setLbl: ', setLbl);
                        console.log('setVal: ', setVal);
                        if (qrespIdx > -1) {
                            thisresp.responses[qrespIdx].when = new Date();
                            thisresp.responses[qrespIdx].qqData = setVal;
                        } else {
                            thisresp.responses.push(new QQuestionData({
                                when: new Date(),
                                qqLabel: ''+setLbl,
                                qqData: setVal
                            }));
                        }
                    }

                    if ("" !== qnr.onAnswered) {
                        console.log(qnr.onAnswered);
                        console.log("qnr onAnswered", eval(qnr.onAnswered));
                    }
                    if ("" !== qq.onAnswered) {
                        console.log(qq.onAnswered);
                        console.log("qq onAnswered", eval(qq.onAnswered));
                    }

                    thisresp.responses.push(new QQuestionData({
                        when: new Date(),
                        qqLabel: ''+qqlabel,
                        qqData: dbVal
                    }));
                }
            }
            let saveRslt;
            try {
                saveRslt = this.save();
            } catch (err) {
                console.log(err);
            }
            return saveRslt;
        },
		deleteQRespondent() {
			let userid = Meteor.userId();
			if (Meteor.isServer && userid) {
				QRespondent.remove({_id: this._id});
			}
		}
    }
});
export { QRespondent, QQuestionData };
