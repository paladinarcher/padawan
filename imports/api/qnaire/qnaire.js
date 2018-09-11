import { Class,Enum } from 'meteor/jagi:astronomy';

const QuestionType = Enum.create({
    name: "QuestionType",
    identifiers: ["openend","numeric","single","multi","display","nested"]
});

const QQuestion = Class.create({
    name: 'QQuestion',
    fields: {
        label: {
            type: String
        },
        text: {
            type: String,
            default: ""
        },
        template: {
            type: String,
            default: "default"
        },
        qtype: {
            type: QuestionType,
            default: "openend"
        },
        list: {
            type: [String],
            default: function () { return []; }
        },
        condition: {
            type: String,
            default: ""
        }
    }
});

const Qnaire = Class.create({
    name: 'Qnaire',
    collection: new Mongo.Collection('qnaire'),
    fields: {
        title: {
            type: String,
            default: "Questionnaire Title"
        },
        description: {
            type: String,
            default: "Questionnaire description"
        },
        questions: {
            type: [QQuestion],
            default: function () { return []; }
        }
    },
    meteorMethods: {
        addQuestion(newQ) {
            this.questions.push(new QQuestion(newQ));
            this.save();
        }
    }
});

export { Qnaire, QQuestion, QuestionType };
