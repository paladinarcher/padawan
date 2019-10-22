import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js'; 
import { QRespondent, QQuestionData, QQMixedType } from '/imports/api/qnaire_data/qnaire_data.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const qrid1 =  "bWDydJmJRcexvratk";
const qnaireId1 = "WD3EKxRgK96Twov9Z";

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
    "_id": qrid1,
    "qnrid": qnaireId1,
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

FactoryBoy.define("qnaire1", Qnaire, {
    "_id":qnaireId1, // same as qnrid for QRespondent qresp1
    "title":"fiddleSticks",
    "description":"fiddleSticks test of the tests",
    "questions":[
        {
            "label":"qq0",
            "text":"fiddlesticks and stickfiddles halow fiddle 1",
            "template":"qquestion1",
            "qtype":0,
            "list":["asdf","hgls",""],
            "condition":"",
            "onAnswered":"",
            "createdAt":new Date(2011),
            "updatedAt":new Date(2012),
            "canEdit":false,
            "deactivated":false
        },
        {
            "label":"qq1",
            "text":"fiddlesticks and stickfiddles halow fiddle 1",
            "template":"qquestion1",
            "qtype":1,
            "list":["asdf","hgls",""],
            "condition":"",
            "onAnswered":"",
            "createdAt":new Date(2011),
            "updatedAt":new Date(2012),
            "canEdit":false,
            "deactivated":false
        },
        {
            "label":"qq2",
            "text":"fiddlesticks and stickfiddles halow fiddle 1",
            "template":"qquestion1",
            "qtype":2,
            "list":["asdf","hgls",""],
            "condition":"",
            "onAnswered":"",
            "createdAt":new Date(2011),
            "updatedAt":new Date(2012),
            "canEdit":false,
            "deactivated":false
        },
        {
            "label":"qq3",
            "text":"fiddlesticks and stickfiddles halow fiddle 1",
            "template":"qquestion1",
            "qtype":3,
            "list":["asdf","hgls",""],
            "condition":"",
            "onAnswered":"",
            "createdAt":new Date(2011),
            "updatedAt":new Date(2012),
            "canEdit":false,
            "deactivated":false
        },
        {
            "label":"qq4",
            "text":"fiddlesticks and stickfiddles halow fiddle 1",
            "template":"qquestion1",
            "qtype":4,
            "list":["asdf","hgls",""],
            "condition":"",
            "onAnswered":"",
            "createdAt":new Date(2011),
            "updatedAt":new Date(2012),
            "canEdit":false,
            "deactivated":false
        }
    ],
    "qqPerPage":1,
    "shuffle":false,
    "minumum":1,
    "instructionCache":"",
    "instructionSlug":"fiddlesticks-instructions",
    "introCache":"",
    "introSlug":"fiddlesticks-introduction",
    "lastCheckedInstruction":new Date(2013),
    "lastCheckedIntro": new Date(2014),
    "onAnswered":"",
    "qheader":""
});

describe.only('Qnaire_data', function () {
    beforeEach(function () {
        resetDatabase();
    });
    it('Create QQuestionData default date', function () {
        let qresp1 = FactoryBoy.create('qrespDefaultDate');
        let findQDD = QRespondent.findOne({ _id: "poaisjdpoasidj" });
        // console.log('findQDD: ', findQDD);
        // console.log('findQDD.responses[0].when: ', findQDD.responses[0].when);
        // console.log('isDate?: ', is_date(findQDD.responses[0].when));
        chai.assert.isTrue(is_date(findQDD.responses[0].when), 'QQuestionData does not create a default date');
    });
    it('Create QRespondent', function () {
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: qrid1 });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, qnaireId1, 'QRespondent qnrid does not match');
    });
    it('QRespondent getResponse helper', function () {
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: qrid1 });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, qnaireId1, 'qnrid of findQR1 should match qnaireId1');
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
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: qrid1 });
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
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: qrid1 });
        let qnaire1 = FactoryBoy.create('qnaire1');
        let findQnaire1 = Qnaire.findOne({ _id: qnaireId1 });
        // console.log('findQnaire1.title: ', findQnaire1.title);
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, qnaireId1, 'The findQR1 qnrid should match qnaireId1');


        // pass0: test qtype 0 openend (string)
        let pass0Ans = 'May all your tests sleep well at night';
        let saveSuccess0 = findQR1.recordResponse('qq0', pass0Ans);
        chai.assert.strictEqual(saveSuccess0, 1, 'pass0 findQR1.recordResponse should have returned 1')
        let pass0 = QRespondent.findOne({ _id: qrid1 })
        let qq0Index = pass0.responses.findIndex((element)=>{return element.qqLabel == 'qq0';});
        chai.assert.strictEqual(pass0.responses[qq0Index].qqData, pass0Ans, 'pass0 openend recordResponse did not save correctly');

        // pass1: test qtype 1 numeric (number)
        let pass1Ans = -88;
        let saveSuccess1 = findQR1.recordResponse('qq1', pass1Ans);
        chai.assert.strictEqual(saveSuccess1, 1, 'pass1 findQR1.recordResponse should have returned 1')
        let pass1 = QRespondent.findOne({ _id: qrid1 })
        let qq1Index = pass1.responses.findIndex((element)=>{return element.qqLabel == 'qq1';});
        chai.assert.strictEqual(pass1.responses[qq1Index].qqData, pass1Ans, 'pass1 numeric recordResponse did not save correctly');

        // pass2: test qtype 2 single (number)
        let pass2Ans = 3;
        let saveSuccess2 = findQR1.recordResponse('qq2', pass2Ans);
        chai.assert.strictEqual(saveSuccess2, 1, 'pass2 findQR1.recordResponse should have returned 1')
        let pass2 = QRespondent.findOne({ _id: qrid1 })
        let qq2Index = pass2.responses.findIndex((element)=>{return element.qqLabel == 'qq2';});
        chai.assert.strictEqual(pass2.responses[qq2Index].qqData, pass2Ans, 'pass2 single recordResponse did not save correctly');

        // pass3: test qtype 3 multi (number)
        let pass3Ans = 4;
        let saveSuccess3 = findQR1.recordResponse('qq3', pass3Ans);
        // console.log('saveSuccess3: ', saveSuccess3);
        chai.assert.strictEqual(saveSuccess3, 1, 'pass3 findQR1.recordResponse should have returned 1')
        let pass3 = QRespondent.findOne({ _id: qrid1 })
        // console.log('pass3', pass3);
        // console.log('findQR1: ', findQR1);
        // console.log('pass3 index: ', pass3.responses.findIndex((element)=>{return element.qqLabel == 'qq3';}));
        let qq3Index = pass3.responses.findIndex((element)=>{return element.qqLabel == 'qq3';});
        chai.assert.strictEqual(pass3.responses[qq3Index].qqData, pass3Ans, 'pass3 multi recordResponse did not save correctly');

        // pass4: test when qqtype is default (qqtype of 4 or 5; display or nested) 
        let pass4Ans = 2;
        let saveSuccess4 = findQR1.recordResponse('qq4', pass4Ans);
        // chai.assert.strictEqual(saveSuccess4, 1, 'pass4 findQR1.recordResponse should have returned 1')
        let pass4 = QRespondent.findOne({ _id: qrid1 })
        let qq4Index = pass4.responses.findIndex((element)=>{return element.qqLabel == 'qq4';});
        chai.assert.strictEqual(pass4.responses[qq4Index].qqData, pass4Ans, 'pass4 (display type) recordResponse did not save correctly');



        // pass5: test when label is not part of qnaire questions an error is thrown
        function responseError() {
            findQR1.recordResponse('labelDoesNotExist', 3);
        }
        assert.throws(responseError, Error);

    });
    it('Create deleteQRespondent', function () {
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: qrid1 });
        chai.assert.notStrictEqual(undefined, findQR1, 'QRespondent should have been defined');
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, qnaireId1, 'The findQR1 qnrid should match qnaireId1');
        let noUID = findQR1.deleteQRespondent();
        // console.log('noUID: ', noUID);
        let pass1 = QRespondent.findOne({ _id: qrid1 });
        chai.assert.notStrictEqual(undefined, pass1, 'QRespondent should have not been deleted');
        // chai undefined

        let myStub = sinon.stub(Meteor, 'userId').returns(true);
        let deleteQR = findQR1.deleteQRespondent();
        myStub.restore();
        // console.log('deleteQR: ', deleteQR);
        let pass2 = QRespondent.findOne({ _id: qrid1 });
        chai.assert.strictEqual(undefined, pass2, 'QRespondent should have been deleted');
    });
});
