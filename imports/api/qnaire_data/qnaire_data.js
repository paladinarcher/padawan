import { Class, Enum } from 'meteor/jagi:astronomy';

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
        qqdata: {
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
    }
});

const QnaireData = Class.create({
    name: "QnaireData",
    collection: new Mongo.Collection('qnaire_data'),
    fields: {
        qnaireLabel: {
            type: String,
            default: 'orphan'
        },
        respondents: {
            type: [QRespondent],
            default: []
        }
    }
});
