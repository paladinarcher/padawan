import { Meteor } from 'meteor/meteor';
import { Qnaire, QQuestion, QuestionType } from './qnaire.js'
import { resetDatabase } from 'meteor/xolvio:cleaner';

FactoryBoy.define("testQnaire", Qnaire, {
    title: "Test Qnaire",
    description: "This is a test qnaire for mocha testing",
    questions: [],
    qqPerPage: 1,
    shuffle: false,
    minumum: 1,
    onAnswered: "",
    qheader: "",
})

let testQQuestion = new QQuestion({
    _id: "1234567899912777",
    label: "Test QQuestion",
    text: "This is a test QQuestion for mocha testing",
    qtype: 0
})

let testQQuestionWithListItem = new QQuestion({
    _id: "1234567899912777",
    label: "Test QQuestion",
    text: "This is a test QQuestion for mocha testing",
    qtype: 0,
    list: ["This is a test list item"]
})

FactoryBoy.define("testQnaireWithQuestion", Qnaire, {
    title: "Test Qnaire",
    description: "This is a test qnaire for mocha testing",
    questions: [testQQuestion],
    qqPerPage: 1,
    shuffle: false,
    minumum: 1,
    onAnswered: "",
    qheader: "",
})

FactoryBoy.define("testQnaireWithListItem", Qnaire, {
    title: "Test Qnaire",
    description: "This is a test qnaire for mocha testing",
    questions: [testQQuestionWithListItem],
    qqPerPage: 1,
    shuffle: false,
    minumum: 1,
    onAnswered: "",
    qheader: "",
})

if(Meteor.isServer) {
    describe("Qnaire", function() {
        
        it('can set qnaire shuffle', function testSetShuffle(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.setShuffle(true);
            testQnaire = findQnaireInDb();

            let result = testQnaire.shuffle === true ? true : false;
            chai.assert(result === true, "Qnaire shuffle was not set to the value of 'true'");

            done()
        })
        
        it('can set number of questions per page', function testSetPerPage(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.setPerPage(4);
            testQnaire = findQnaireInDb();

            let result = testQnaire.qqPerPage === 4 ? true : false;
            chai.assert(result === true, "Qnaire qqPerPage was not set to the value of '4'");

            done()
        })

        it('can add a new question', function testAddQuestion(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            let testQQuestion = {
                _id: "1234567899912777",
                label: "Test QQuestion",
                text: "This is a test QQuestion for mocha testing",
                qtype: 0
            }

            testQnaire.addQuestion(testQQuestion);
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions !== [] ? true : false;
            chai.assert(result === true, "Failed to add test question to qnaire");

            done()
        })

        it('can delete a question', function testDeleteQuestion(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.deleteQuestion(testQnaire._id, "Test QQuestion");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions == "" ? true : false;
            chai.assert(result === true, "Failed to delete test question from qnaire");

            done()
        })
        
        it('can add a list item', function testAddListItem(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.addListItem("Test QQuestion", "Test List Item");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].list !== "" ? true : false;
            chai.assert(result === true, "Failed to add list item to 'Test QQuestion'");

            done()
        })

        it('can remove a list item', function testRemoveListItem(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithListItem", { _id: "12345678999123721" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "12345678999123721" })
            let testQnaire = findQnaireInDb();

            testQnaire.removeListItem("Test QQuestion", 0);
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].list == "" ? true : false;
            chai.assert(result === true, "Failed to remove list item from 'Test QQuestion'");

            done()
        })

        it('can set question type', function testSetQType(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.setQtype("Test QQuestion", 3);
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].qtype === 3 ? true : false;
            chai.assert(result === true, "Failed to set qtype to the value of '3'");

            done()
        })

        it('can update question text', function testUpdateText(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateText("Test QQuestion", "This is a test QQuestion that now has updated text");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].text === "This is a test QQuestion that now has updated text" ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' text value to 'This is a test QQuestion that now has updated text'");

            done()
        })

        it('can update question label', function testUpdateLabel(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateLabel("Test QQuestion", "Updated Test QQuestion Label");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].label === "Updated Test QQuestion Label" ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' label value to 'Updated Test QQuestion Label'");

            done()
        })

        it('can update qnaire title', function testUpdateTitle(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateTitle(testQnaire.title, "Test Qnaire New Title");
            testQnaire = findQnaireInDb();

            let result = testQnaire.title === "Test Qnaire New Title" ? true : false;
            chai.assert(result === true, "Qnaire title was not updated to the value of 'Test Qnaire New Title'");

            done()
        })
        
        it('can update qnaire description', function testUpdateDesc(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateDesc(testQnaire.description, "This is the updated description for test qnaire");
            testQnaire = findQnaireInDb();

            let result = testQnaire.description === "This is the updated description for test qnaire" ? true : false;
            chai.assert(result === true, "Qnaire description was not updated to the value of 'This is the updated description for test qnaire'");

            done()
        })

        it('can update qnaire questions per page', function testUpdateQPP(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateQPP(testQnaire.qqPerPage, 3);
            testQnaire = findQnaireInDb();

            let result = testQnaire.qqPerPage === 3 ? true : false;
            chai.assert(result === true, "Qnaire qqPerPage was not updated to the value of '3'");

            done()
        })

        it('can update qnaire shuffle', function testUpdateShuffle(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateShuffle(testQnaire.shuffle, "on");
            testQnaire = findQnaireInDb();

            let result = testQnaire.shuffle === true ? true : false;
            chai.assert(result === true, "Qnaire shuffle was not updated to the value of 'true'");

            done()
        })

        it('can update qnaire list item', function testUpdateListItem(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithListItem", { _id: "12345678999123721" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "12345678999123721" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateListItem("Test QQuestion", "This is the updated list item", 0);
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].list[0] === "This is the updated list item" ? true : false;
            chai.assert(result === true, "Failed to update the value of the first list item to 'This is the updated list item'");

            done()
        })

        it('can update qnaire question condition', function testUpdateCondition(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateCondition("Test QQuestion", "Updated Condition");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].condition === "Updated Condition" ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' condition value to 'Updated Condition'");

            done()
        })

        it('can update qnaire question template', function testUpdateWidget(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.updateWidget("Test QQuestion", "Test Template");
            testQnaire = findQnaireInDb();
            
            let result = testQnaire.questions[0].template === "Test Template" ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' template value to 'Test Template'");

            done()
        })

        it('can disable question edit', function testDisableQuestionEdit(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.disableQuestionEdit("Test QQuestion");
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].canEdit === false ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' canEdit value to 'false'");

            done()
        })

        it('can delete qnaire', function testDeleteQnaire(done) {
            resetDatabase()

            FactoryBoy.create("testQnaire", { _id: "1234567899912839" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912839" })
            let testQnaire = findQnaireInDb();

            testQnaire.deleteQnaire(testQnaire._id);
            testQnaire = findQnaireInDb();

            let result = testQnaire === undefined ? true : false;
            chai.assert(result === true, "The test qnaire was not deleted from the database");

            done()
        })

        it('can deactivate qnaire question', function testDeactivateQuestion(done) {
            resetDatabase()

            FactoryBoy.create("testQnaireWithQuestion", { _id: "1234567899912323" })
            let findQnaireInDb = () => Qnaire.findOne({ _id: "1234567899912323" })
            let testQnaire = findQnaireInDb();

            testQnaire.deactivateQuestion(testQnaire._id, "Test QQuestion", true);
            testQnaire = findQnaireInDb();

            let result = testQnaire.questions[0].deactivated === true ? true : false;
            chai.assert(result === true, "Failed to update 'Test QQuestion' deactivated value to 'true'");

            done()
        })

    })
}