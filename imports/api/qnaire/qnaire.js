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
        },
        onAnswered: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: function () { return new Date(); }
        },
        updatedAt: {
            type: Date,
            default: function () { return new Date(); }
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
        },
        qqPerPage: {
            type: Number,
            default: 1
        },
        shuffle: {
            type: Boolean,
            default: false
        },
        minumum: {
            type: Number,
            default: 1
        },
    },
    meteorMethods: {
        setShuffle(isShuffle) {
            this.shuffle = !!isShuffle;
            this.save();
        },
        setPerPage(numPerPage) {
            this.qqPerPage = numPerPage;
            this.save();
        },
        addQuestion(newQ) {
            this.questions.push(new QQuestion(newQ));
            this.save();
        },
        addListItem(qlbl, itemVal) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].list.push(itemVal);
                    this.save();
                    return;
                }
            }
        },
        setQtype(qlbl, qtype) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].qtype = qtype;
                    this.save();
                    return;
                }
            }
        },
        updateText(qlbl, text) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].text = text;
                    this.save();
                    return;
                }
            }
        },
        updateLabel(qlbl, newlbl) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].label = newlbl;
                    this.save();
                    return;
                }
            }
        },
        // update qnaires branch
        updateTitle(oldTitle, newTitle){
            if(oldTitle === this.title){
                this.title = newTitle;
                this.save();
                return;
            }
        },
        updateDesc(oldDesc, newDesc){
            if(oldDesc === this.description){
                this.description = newDesc;
                this.save();
                return;
            }
        },
        updateQPP(oldNum, newNum){
            let convertNum = parseInt(newNum);

            if(oldNum === this.qqPerPage){
                this.qqPerPage = convertNum;
                this.save();
                return;
            }
        },
        updateShuffle(oldBool, newBool){
            let convertBool;
            if (newBool == "on" && this.shuffle == true) {
                convertBool = false;
            } else { 
                convertBool = true;
            }

            if(oldBool === this.shuffle){
                this.shuffle = convertBool;
                this.save();
                return;
            }
        },
        // update qnaires branch
        updateListItem(qlbl, newtxt, itemidx) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].list[itemidx] = newtxt;
                    this.save();
                    return;
                }
            }
        },
        updateCondition(qlbl, condition) {
            for (let i = 0; i < this.questions.length; i++) {
                if (qlbl === this.questions[i].label) {
                    this.questions[i].condition = condition;
                    this.save();
                    return;
                }
            }
        }
    }
});

export { Qnaire, QQuestion, QuestionType };
