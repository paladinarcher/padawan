import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js'; 
import { QRespondent, QQuestionData, QQMixedType } from '/imports/api/qnaire_data/qnaire_data.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const QRID1 =  "bWDydJmJRcexvratk";
const QNAIREID1 = "WD3EKxRgK96Twov9Z";
const MBTIID = "5c9544d9baef97574";
const QRMBTIID = "asdf6789asdf6789";

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

FactoryBoy.define("mbtiQresp", QRespondent, {
    "_id": QRMBTIID,
    "qnrid": MBTIID,
    "responses": []
});

FactoryBoy.define("qresp1", QRespondent, {
    "_id": QRID1,
    "qnrid": QNAIREID1,
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
    "_id":QNAIREID1, // same as qnrid for QRespondent qresp1
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

FactoryBoy.define("myMbti", Qnaire, {
  "_id": MBTIID,
  "title": "mbti",
  "description": "Myers-Briggs Trait Inventory",
  "onAnswered": "\nif (qq.label[0] == 'q') {\n    let categories = qq.list[2].split('|');\n\n    let catLetters = [\"IE\", \"NS\", \"TF\", \"JP\"];\n\n    for (let i = 0; i < categories.length; i++) {\n        let totLbl = '_'+catLetters[categories[i]];\n        //console.log(\"typeof $a\",typeof $a(totLbl));\n        //console.log(\"totLbl\", totLbl);\n        if (\"undefined\" === typeof $a(totLbl)) {\n\t\t\t//console.log('onanswered undefined 1')\n            $set(totLbl, 0);\n        }\n        if (\"undefined\" === typeof $a(totLbl+'_count')) {\n\t\t\t//console.log('onanswered undefined 2')\n            $set(totLbl+'_count', 0);\n        }\n\n\t\t// if the response has already been answered, take into account the previous answer\n\t\tlet previousCount = 0;\n\t\tlet previousResponse = 0;\n\t\tif (duplicateResp !== undefined) {\n\t\t\tpreviousCount = -1;\n\t\t\tpreviousResponse = ~duplicateResp.qqData + 1; // negative of the duplicate qqData\n\t\t} \t\t\n\t\t//console.log('previousCount: ', previousCount);\n\t\t//console.log('previousResponse: ', previousResponse);\n\n        $set(totLbl+'_count', $a(totLbl+'_count')+1+previousCount);\n\t\t//console.log('onanswered defined 1, totLbl+\"_count\", $a(totLbl+\"_count\")+1+previousCount', totLbl+'_count', $a(totLbl+'_count')+1+previousCount)\n        $set(totLbl, $a(totLbl)+dbVal+previousResponse);\n\t\t//console.log('onanswered defined 2 totLbl, $a(totLbl)+dbVal+previousResponse', totLbl, $a(totLbl)+dbVal+previousResponse)\n    }\n}\n",
  "questions": [
    {
      "label": "_IE",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "_NS",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "_TF",
      "qtype": 1,
      "dactivated": true
    },
    {
      "label": "_JP",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "_IE_count",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "_NS_count",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "_TF_count",
      "qtype": 1,
      "dactivated": true
    },
    {
      "label": "_JP_count",
      "qtype": 1,
      "deactivated": true
    },
    {
      "label": "q1",
      "text": "",
      "template": "qqslider",
      "qtype": 1,
      "list": [
        "-50|You view facts as relative and open to interpretation",
        "50|You view facts as concrete and unchanging",
        "1",
        "-50|You will ALWAYS Do this. Doing otherwise is inconceivable to you.",
        "-49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "-40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "-30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "-20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "-10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "50|You will ALWAYS Do this. Doing otherwise is inconceivable to you."
      ],
      "condition": "",
      "onAnswered": "",
      "createdAt": new Date(2010),
      "updatedAt": new Date(2010)
    },
    {
      "label": "q2",
      "text": "",
      "template": "qqslider",
      "qtype": 1,
      "list": [
        "-50|You feel no loyalty to a group simply because you are part of it",
        "50|You feel loyalty to a group simply because you are part of it",
        "2",
        "-50|You will ALWAYS Do this. Doing otherwise is inconceivable to you.",
        "-49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "-40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "-30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "-20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "-10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "50|You will ALWAYS Do this. Doing otherwise is inconceivable to you."
      ],
      "condition": "",
      "onAnswered": "",
      "createdAt": new Date(2010),
      "updatedAt": new Date(2010)
    },
    {
      "label": "q3",
      "text": "",
      "template": "qqslider",
      "qtype": 1,
      "list": [
        "-50|You fail to take advantage of opportunities to learn practical skills",
        "50|You take advantage of opportunities to learn practical skills",
        "1",
        "-50|You will ALWAYS Do this. Doing otherwise is inconceivable to you.",
        "-49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "-40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "-30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "-20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "-10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "50|You will ALWAYS Do this. Doing otherwise is inconceivable to you."
      ],
      "condition": "",
      "onAnswered": "",
      "createdAt": new Date(2010),
      "updatedAt": new Date(2010)
    },
    {
      "label": "q4",
      "text": "",
      "template": "qqslider",
      "qtype": 1,
      "list": [
        "-50|You struggle to find the right words and need time to rehearse.",
        "50|You easily find the right words and do not need time to rehearse.",
        "0",
        "-50|You will ALWAYS Do this. Doing otherwise is inconceivable to you.",
        "-49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "-40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "-30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "-20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "-10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "10|You don't have much of a preference either way, but this side sounds a bit more likely.",
        "20|This is a good default choice for you, but time and circumstance could easily find you doing the other.",
        "30|This is your most common behavior, but there are definitely times you've done the opposite.",
        "40|You can think of cases where you have done things the other way, but not under normal circumstances. ",
        "49|There may be a possible scenerio where the reverse may apply, but it would be really rare.",
        "50|You will ALWAYS Do this. Doing otherwise is inconceivable to you."
      ],
      "condition": "",
      "onAnswered": "",
      "createdAt": new Date(2010),
      "updatedAt": new Date(2010)
    }
  ],
  "qqPerPage": 4
});

describe('Qnaire_data', function () {
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
        let findQR1 = QRespondent.findOne({ _id: QRID1 });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, QNAIREID1, 'QRespondent qnrid does not match');
    });
    it('QRespondent getResponse helper', function () {
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: QRID1 });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, QNAIREID1, 'qnrid of findQR1 should match QNAIREID1');
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
        let findQR1 = QRespondent.findOne({ _id: QRID1 });
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
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: QRID1 });
        let qnaire1 = FactoryBoy.create('qnaire1');
        let findQnaire1 = Qnaire.findOne({ _id: QNAIREID1 });
        FactoryBoy.create('myMbti');
        let mbtiQnaire = Qnaire.findOne({ _id: MBTIID });
        FactoryBoy.create('mbtiQresp');
        let mbtiQresp = QRespondent.findOne({ _id: QRMBTIID });

        // console.log('findQnaire1.title: ', findQnaire1.title);
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, QNAIREID1, 'The findQR1 qnrid should match QNAIREID1');


        // pass0: test qtype 0 openend (string)
        let pass0Ans = 'May all your tests sleep well at night';
        let saveSuccess0 = findQR1.recordResponse('qq0', pass0Ans);
        chai.assert.strictEqual(saveSuccess0, 1, 'pass0 findQR1.recordResponse should have returned 1')
        let pass0 = QRespondent.findOne({ _id: QRID1 })
        let qq0Index = pass0.responses.findIndex((element)=>{return element.qqLabel == 'qq0';});
        chai.assert.strictEqual(pass0.responses[qq0Index].qqData, pass0Ans, 'pass0 openend recordResponse did not save correctly');

        // pass1: test qtype 1 numeric (number)
        let pass1Ans = -88;
        let saveSuccess1 = findQR1.recordResponse('qq1', pass1Ans);
        chai.assert.strictEqual(saveSuccess1, 1, 'pass1 findQR1.recordResponse should have returned 1')
        let pass1 = QRespondent.findOne({ _id: QRID1 })
        let qq1Index = pass1.responses.findIndex((element)=>{return element.qqLabel == 'qq1';});
        chai.assert.strictEqual(pass1.responses[qq1Index].qqData, pass1Ans, 'pass1 numeric recordResponse did not save correctly');

        // pass2: test qtype 2 single (number)
        let pass2Ans = 3;
        let saveSuccess2 = findQR1.recordResponse('qq2', pass2Ans);
        chai.assert.strictEqual(saveSuccess2, 1, 'pass2 findQR1.recordResponse should have returned 1')
        let pass2 = QRespondent.findOne({ _id: QRID1 })
        let qq2Index = pass2.responses.findIndex((element)=>{return element.qqLabel == 'qq2';});
        chai.assert.strictEqual(pass2.responses[qq2Index].qqData, pass2Ans, 'pass2 single recordResponse did not save correctly');

        // pass3: test qtype 3 multi (number)
        let pass3Ans = 4;
        let saveSuccess3 = findQR1.recordResponse('qq3', pass3Ans);
        // console.log('saveSuccess3: ', saveSuccess3);
        chai.assert.strictEqual(saveSuccess3, 1, 'pass3 findQR1.recordResponse should have returned 1')
        let pass3 = QRespondent.findOne({ _id: QRID1 })
        // console.log('pass3', pass3);
        // console.log('findQR1: ', findQR1);
        // console.log('pass3 index: ', pass3.responses.findIndex((element)=>{return element.qqLabel == 'qq3';}));
        let qq3Index = pass3.responses.findIndex((element)=>{return element.qqLabel == 'qq3';});
        chai.assert.strictEqual(pass3.responses[qq3Index].qqData, pass3Ans, 'pass3 multi recordResponse did not save correctly');

        // pass4: test when qqtype is default (qqtype of 4 or 5; display or nested) 
        let pass4Ans = "2 + h";
        let saveSuccess4 = findQR1.recordResponse('qq4', pass4Ans);
        chai.assert.strictEqual(saveSuccess4, 1, 'pass4 findQR1.recordResponse should have returned 1')
        let pass4 = QRespondent.findOne({ _id: QRID1 });
        let qq4Index = pass4.responses.findIndex((element)=>{return element.qqLabel == 'qq4';});
        chai.assert.strictEqual(pass4.responses[qq4Index].qqData, pass4Ans, 'pass4 (display type) recordResponse did not save correctly');

        // pass5: test when label is not part of qnaire questions an error is thrown
        function responseError() {
            findQR1.recordResponse('labelDoesNotExist', 3);
        }
        assert.throws(responseError, Error);

        // pass6 (mbtiQresp): meyers brigs onAnswered eval statements work
        let pass6Ans = 33;
        let saveSuccess6 = mbtiQresp.recordResponse('q1', pass6Ans);
        chai.assert.strictEqual(saveSuccess6, 1, 'pass6 mbtiQnaire.recordResponse should have returned 1')
        mbtiQresp = QRespondent.findOne({ _id: QRMBTIID });
        // console.log('mbtiQresp: ', mbtiQresp);
        saveSuccess6 = mbtiQresp.recordResponse('q2', pass6Ans);
        chai.assert.strictEqual(saveSuccess6, 1, 'mbtiQresp mbtiQnaire.recordResponse should have returned 1')
        mbtiQresp = QRespondent.findOne({ _id: QRMBTIID });
        // console.log('mbtiQresp 2: ', mbtiQresp);
        saveSuccess6 = mbtiQresp.recordResponse('q3', pass6Ans);
        chai.assert.strictEqual(saveSuccess6, 1, 'mbtiQresp mbtiQnaire.recordResponse should have returned 1')
        mbtiQresp = QRespondent.findOne({ _id: QRMBTIID });
        // console.log('mbtiQresp 3: ', mbtiQresp);
        let qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == 'q1';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, pass6Ans, 'mbtiQresp (mbti q1) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == 'q2';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, pass6Ans, 'mbtiQresp (mbti q2) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == 'q3';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, pass6Ans, 'mbtiQresp (mbti q3) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == '_NS';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, pass6Ans * 2, 'mbtiQresp (mbti _NS) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == '_NS_count';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, 2, 'mbtiQresp (mbti _NS_count) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == '_TF';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, pass6Ans, 'mbtiQresp (mbti _TF) recordResponse did not save correctly');
        qq6Index = mbtiQresp.responses.findIndex((element)=>{return element.qqLabel == '_TF_count';});
        chai.assert.strictEqual(mbtiQresp.responses[qq6Index].qqData, 1, 'mbtiQresp (mbti _TF_count) recordResponse did not save correctly');

    });
    it('Create deleteQRespondent', function () {
        let qresp1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: QRID1 });
        chai.assert.notStrictEqual(undefined, findQR1, 'QRespondent should have been defined');
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, QNAIREID1, 'The findQR1 qnrid should match QNAIREID1');
        let noUID = findQR1.deleteQRespondent();
        // console.log('noUID: ', noUID);
        let pass1 = QRespondent.findOne({ _id: QRID1 });
        chai.assert.notStrictEqual(undefined, pass1, 'QRespondent should have not been deleted');
        // chai undefined

        let myStub = sinon.stub(Meteor, 'userId').returns(true);
        let deleteQR = findQR1.deleteQRespondent();
        myStub.restore();
        // console.log('deleteQR: ', deleteQR);
        let pass2 = QRespondent.findOne({ _id: QRID1 });
        chai.assert.strictEqual(undefined, pass2, 'QRespondent should have been deleted');
    });
});
