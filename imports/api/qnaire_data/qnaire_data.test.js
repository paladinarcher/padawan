import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js'; // eventually delete this line
import { QRespondent, QQuestionData, QQMixedType } from '/imports/api/qnaire_data/qnaire_data.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

var is_date = function (input) {
    if (Object.prototype.toString.call(input) === "[object Date]") {
        return true;
    } else {
        return false;
    }
};

FactoryBoy.define("qqdata1", QQuestionData, {
    "when": "2019-03-26T21:44:00.065Z",
    "qqLabel": "qq1",
    "qqData": 0
});

FactoryBoy.define("qrespNoResponse", QRespondent, {
    "_id": "uiuiuiuiiui",
    "qnrid": "jkkjkjkjkjkjkj"
});

FactoryBoy.define("qrespDefaultDate", QRespondent, {
    "_id": "poaisjdpoasidj",
    "qnrid": "qwerqwerqrqwer",
    "responses": [ // responses are the QQuestionData
        { "qqLabel": "qq1", "qqData": 0 },
        { "qqLabel": "qq2", "qqData": 1 },
        { "qqLabel": "qq3", "qqData": -21 }
        // "responses": [ // responses are the QQuestionData
        //     { "when": "2019-03-26T21:44:00.065Z", "qqLabel": "qq1", "qqData": 0 },
        //     { "when": "2019-03-26T21:44:02.774Z", "qqLabel": "qq2", "qqData": 1 },
        //     { "when": "2019-03-26T21:44:05.824Z", "qqLabel": "qq3", "qqData": -21 }
    ]
});

FactoryBoy.define("qresp1", QRespondent, {
    "_id": "bWDydJmJRcexvratk",
    "qnrid": "WD3EKxRgK96Twov9Z",
    "responses": [
        { "when": new Date(2011), "qqLabel": "qq1", "qqData": 0 },
        { "when": new Date(2012), "qqLabel": "qq2", "qqData": 1 },
        { "when": new Date(2013), "qqLabel": "qq3", "qqData": -21 }
        // "responses": [ // responses are the QQuestionData
        //     { "when": "2019-03-26T21:44:00.065Z", "qqLabel": "qq1", "qqData": 0 },
        //     { "when": "2019-03-26T21:44:02.774Z", "qqLabel": "qq2", "qqData": 1 },
        //     { "when": "2019-03-26T21:44:05.824Z", "qqLabel": "qq3", "qqData": -21 }
    ]
});

describe('Qnaire_data', function () {
    beforeEach(function () {
        resetDatabase();
    });
    it('Create QQuestionData default date', function () {
        let qr1 = FactoryBoy.create('qrespDefaultDate');
        let findQDD = QRespondent.findOne({ _id: "poaisjdpoasidj" });
        // console.log('findQDD: ', findQDD);
        // console.log('findQDD.responses[0].when: ', findQDD.responses[0].when);
        // console.log('isDate?: ', is_date(findQDD.responses[0].when));
        chai.assert.isTrue(is_date(findQDD.responses[0].when), 'QQuestionData does not create a default date');
    });
    it('Create QRespondent', function () {
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, 'WD3EKxRgK96Twov9Z', 'QRespondent qnrid does not match');
    });
    it('QRespondent getResponse helper', function () {
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, 'WD3EKxRgK96Twov9Z', 'todo');
        let nothing = findQR1.getResponse('nothing');
        // console.log('nothing: ', nothing);
        chai.assert.strictEqual(nothing, undefined, 'getResponse should have returned undefined')
        let q1 = findQR1.getResponse('qq1');
        // console.log('q1: ', q1);
        chai.assert.strictEqual(q1, 0, 'getResponse should have returned 0')
        let q2 = findQR1.getResponse('qq2');
        // console.log('q2: ', q2);
        chai.assert.strictEqual(q2, 1, 'getResponse should have returned 1')
    });
    it('QRespondent hasNoResponse helper', function () {
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        // console.log('findQQD: ', findQR1);
        let q1 = findQR1.hasNoResponse('qq1');
        // console.log('q1: ', q1);
        chai.assert.strictEqual(q1, false, 'hasNoResponse should return false (through else)')

        let nothing = findQR1.hasNoResponse('nothing');
        // console.log('nothing: ', nothing);
        chai.assert.strictEqual(nothing, true, 'hasNoResponse should return true (through else if)')

        let qr2 = FactoryBoy.create('qrespNoResponse');
        let findQR2 = QRespondent.findOne({ _id: "uiuiuiuiiui" });
        let q2 = findQR2.hasNoResponse('qq1');
        // console.log('q2: ', q2);
        chai.assert.strictEqual(q2, true, 'hasNoResponse should return true (through if)')

    });
    it('Create recordResponse', function () {
        console.log('todo recordResponse');
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, 'WD3EKxRgK96Twov9Z', 'todo');
        let oo = findQR1.recordResponse();
        console.log('oo: ', oo);
        let o = findQR1.recordResponse('qq1', '42 is the answer', false);
        console.log('o: ', o);
    });
    it('Create deleteQRespondent', function () {
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        chai.assert.notStrictEqual(undefined, findQR1, 'QRespondent should have been defined');
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, 'WD3EKxRgK96Twov9Z', 'todo');
        let noUID = findQR1.deleteQRespondent();
        // console.log('noUID: ', noUID);
        let pass1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        chai.assert.notStrictEqual(undefined, pass1, 'QRespondent should have not been deleted');
        // chai undefined

        let myStub = sinon.stub(Meteor, 'userId').returns(true);
        let deleteQR = findQR1.deleteQRespondent();
        myStub.restore();
        // console.log('deleteQR: ', deleteQR);
        let pass2 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        chai.assert.strictEqual(undefined, pass2, 'QRespondent should have been deleted');
    });
});


// QQuestionData (return new Date())

//   Qrespondent 
//  helpers:
// getResponse
// hasNoResponse
//  meteorMethods:
// recordResponse (huge method all needs testing)
// deleteQRespondent