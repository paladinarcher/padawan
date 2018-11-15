import { Class, Enum } from 'meteor/jagi:astronomy';
import { Qnaire, QQuestion, QuestionType } from '../qnaire/qnaire.js';

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
            type: Object
        }
    }
});

const QRespondent = Class.create({
    name: "QRespondent",
    fields: {
        responses: {
            type: [QQuestionData],
            default: []
        }
    },
});

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

export { QnaireData, QRespondent, QQuestionData };
