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
                return {};
            }
        },
        hasNoResponse(qqlbl){
            let rsp = _.find(this.responses, function(o){return o.qqLabel===qqlbl && o.qqData == false });
            // let matchRsp = _.find(this.responses, function(o){return o.qqLabel===qqlbl});
            let noRsp = (this.responses == false);

            console.log('my new hasNoResponse: ', rsp);
            console.log('hasNoRespose this.reponses: ', this.responses);

            if(!rsp || noRsp){
                return true;
            } else {
                return false;
            }
        },
        hasResponse(qqlbl) {
            // let rsp = _.find(this.responses, function(o){return o.qqLabel===qqlbl});
            let rsp = _.find(this.responses, function(o){return o.qqLabel===qqlbl && o.qqData == false});
            console.log('has response this.responses: ', this.responses);
            console.log('has response qqlbl: ', qqlbl);
            console.log('has response: ', rsp);
            // let rsp2 = _.find(this.responses, function(x){return x.qqData===""});
            // console.log('has response rsp2: ', rsp2);
            // console.log('my final rsp2 test: ', rsp2 === undefined);
            if (rsp) {
                return true;
            } else {
                return false;
            }
        }
    },
    meteorMethods: {
        recordResponse(qqlabel, val) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(qqlabel, val);

            if (Meteor.isServer) {
                let qnr = Qnaire.findOne( {_id:this.qnrid} );
                let qq = qnr.getQuestion(qqlabel);
                let dbVal;

                switch (qq.qtype) {
                case QuestionType.openend:
                    dbVal = val;
                    console.log("openend",val,dbVal);
                    break;
                case QuestionType.numeric:
                case QuestionType.single:
                    dbVal = parseFloat(val);
                    console.log("numeric",val,dbVal);
                    break;
                default:
                    dbVal = new Object(val);
                    console.log("other",val,dbVal);
                    break;
                }

                this.responses.push(new QQuestionData({
                    when: new Date(),
                    qqLabel: ''+qqlabel,
                    qqData: dbVal
                }));
                return this.save();
            }
        }
    }
});
/*
const QnaireData = Class.create({
    name: "QnaireData",
    collection: new Mongo.Collection('qnaire_data'),
    fields: {
        qnrid: {
            type: String,
            default: 'orphan'
        },
        respondents: {
            type: [QRespondent],
            default: []
        }
    },
    meteorMethods: {
        addRespondent(resp) {
            this.respondents.push(resp);
            return this.save();
        },
        recordResponse(rid, qqlabel, val) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(rid,qqlabel, val);
            let resp = _.find(this.respondents, function(o) { return o._id===rid});
            resp.responses.push(new QQuestionData({
                when: new Date(),
                qqLabel: qqlabel,
                qqData: val
            }));
            return this.save();
        }
    }
});
*/
export { QRespondent, QQuestionData };
