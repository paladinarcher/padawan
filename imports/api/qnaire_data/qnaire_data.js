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
        recordResponse(qqlabel, val) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(qqlabel, val);

            if (Meteor.isServer) {
                let qnr = Qnaire.findOne( {_id:this.qnrid} );
                let qq = qnr.getQuestion(qqlabel);
                let dbVal;
				//console.log(qq.qtype);
				//console.log(QuestionType);

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
				case QuestionType.multi:
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
        },
		deleteQRespondent() {
            let myRsp = _.find(myRsp.responses, function(x){return x.qqLabel===qqlbl});
			let userid = Meteor.userId();
			if (myRsp && userid) {
            	//let u = Meteor.users.findOne({_id:userId});
				//Meteor.users.update({_id: userid}, {$pull: {u.MyProfile.QnaireResponses: }});
				QRespondent.remove({_id: this._id});
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
