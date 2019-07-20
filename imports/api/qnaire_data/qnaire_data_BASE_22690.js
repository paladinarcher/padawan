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
        },
        completed: {
            type: Boolean,
            default: false
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
        recordResponse(qqlabel, val, finish) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(qqlabel, val);

            if (Meteor.isServer) {
                if (finish) {
                    this.completed = true;
                }
                // delete duplicate qqlabels
                this.responses = this.responses.filter(l => l.qqLabel != qqlabel);

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
                    // dbVal = parseFloat(val);
                    let multiString = "";
                    val.forEach(function(element, index, array) {
                        multiString += element;
                        if (index !== array.length - 1) {
                            multiString += ", ";
                        }
                    });
                    dbVal = multiString;
                    console.log("numeric multi",val,dbVal);
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
                console.log("saving qnaire data: ", this);
                return this.save();
            }
        },
		deleteQRespondent() {
            // let myRsp = QRespondent.findOne({_id: this._id});
            // console.log("myRsp: ", myRsp);
            // let myRsp2 = _.find(myRsp.responses, function(x){return x.qqLabel===qqlbl});
            // console.log("myRsp2: ", myRsp2);
			// let userid = Meteor.userId();
			if (Meteor.isServer) {
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
