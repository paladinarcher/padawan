import { Class, Enum } from 'meteor/jagi:astronomy';
import { QRespondent } from '../qnaire_data/qnaire_data.js';

const QuestionType = Enum.create({
  name: 'QuestionType',
  identifiers: ['openend', 'numeric', 'single', 'multi', 'display', 'nested']
});

const QQuestion = Class.create({
  name: 'QQuestion',
  fields: {
    label: {
      type: String
    },
    text: {
      //text is the question
      type: String,
      default: ''
    },
    template: {
      type: String,
      default: 'default'
    },
    qtype: {
      type: QuestionType,
      default: 'openend'
    },
    list: {
      type: [String],
      default: function() {
        return [];
      }
    },
    condition: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    deactivated: {
      type: Boolean,
      default: false
    },
    onAnswered: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: function() {
        return new Date();
      }
    },
    updatedAt: {
      type: Date,
      default: function() {
        return new Date();
      }
    }
  }
});

const Qnaire = Class.create({
  name: 'Qnaire',
  collection: new Mongo.Collection('qnaire'),
  fields: {
    title: {
      type: String,
      default: 'Questionnaire Title'
    },
    description: {
      type: String,
      default: 'Questionnaire description'
    },
    questions: {
      type: [QQuestion],
      default: function() {
        return [];
      }
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
    onAnswered: {
      type: String,
      default: ""
    },
    qheader: {
        type: String,
        default: ""
    }
  },
  helpers: {
    getQuestion(qqlbl) {
      return _.find(this.questions, function(o) {
        return o.label == qqlbl;
      });
    }
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
    deleteQuestion(qnrid, label) {
      let qnaire = Qnaire.findOne({ _id: qnrid });
      const index = qnaire.questions.findIndex(
        question => question.label === label
      );
      if (index !== -1) {
        qnaire.questions.splice(index, 1);
      }
      let updatedQnaire = qnaire;
      Qnaire.update(
        { _id: qnrid },
        { $set: { questions: updatedQnaire.questions } }
      );
      return;
    },
    addListItem(qlbl, itemVal) {
      for (let i = 0; i < this.questions.length; i++) {
        if (!(typeof qlbl === 'string' || qlbl instanceof String)) {
          qlbl = qlbl.toString();
        }
        if (qlbl === this.questions[i].label) {
          this.questions[i].list.push(itemVal);
          this.save();
          return;
        }
      }
    },
    removeListItem(qlbl, itemIndex) {
      for (let i = 0; i < this.questions.length; i++) {
        if (qlbl == this.questions[i].label) {
          if (this.questions[i].list.length > itemIndex) {
            this.questions[i].list.splice(itemIndex, 1);
            this.save();
            return;
          } else {
            return;
          }
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
    updateTitle(oldTitle, newTitle) {
      if (oldTitle === this.title) {
        this.title = newTitle;
        this.save();
        return;
      }
    },
    updateDesc(oldDesc, newDesc) {
      if (oldDesc === this.description) {
        this.description = newDesc;
        this.save();
        return;
      }
    },
    updateQPP(oldNum, newNum) {
      let convertNum = parseInt(newNum);

      if (oldNum === this.qqPerPage) {
        this.qqPerPage = convertNum;
        this.save();
        return;
      }
    },
    updateShuffle(oldBool, newBool) {
      let convertBool;
      if (newBool == 'on' && this.shuffle == true) {
        convertBool = false;
      } else {
        convertBool = true;
      }

      if (oldBool === this.shuffle) {
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
    },
    updateWidget(qlbl, widgetType) {
      const index = this.questions.findIndex(
        question => question.label === qlbl
      );
      this.questions[index].template = widgetType;
      this.save();
    },
    disableQuestionEdit(label) {
      const index = this.questions.findIndex(
        question => question.label === label
      );
      if (index !== -1) {
        let flagStatus = this.questions[index].canEdit;
        if (flagStatus) {
          this.questions[index].canEdit = false;
          this.save();
        }
      }
    },
    deleteQnaire(qnrid) {
      let query = { _id: qnrid };
      Qnaire.remove(query);

      // Get rid of qnaire data of the qnaire
      // console.log("qqqqqRrrrrrrrrrespondent: ", QRespondent.find({qnrid:qnrid}));
      QRespondent.remove( {qnrid:qnrid} );
    },
    deactivateQuestion(qnrid, label, checkedStatus) {
      let query = { _id: qnrid };
      const index = this.questions.findIndex(
        question => question.label === label
      );
      this.questions[index].deactivated = checkedStatus;
      this.save();
    }
  }
});

export { Qnaire, QQuestion, QuestionType };
