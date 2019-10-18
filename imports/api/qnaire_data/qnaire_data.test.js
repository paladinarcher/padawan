
import { QRespondent, QQuestionData, QQMixedType } from '/imports/api/qnaire_data/qnaire_data.js';

FactoryBoy.define("qqdata1", QQuestionData, { 
    "when": "2019-03-26T21:44:00.065Z", 
    "qqLabel": "qq1", 
    "qqData": 0 
});

FactoryBoy.define("qresp1", QRespondent, {
    "_id": "bWDydJmJRcexvratk",
    "qnrid": "WD3EKxRgK96Twov9Z",
    "responses": [ // responses are the QQuestionData
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
    it('Create QQuestionData', function () {
        // console.log('todo QQuestionData');
        // let qr1 = FactoryBoy.create('qqdata1');
        // let findQQD = QRespondent.findOne({ qqLabel: "qq1" });
        // console.log('findQQD: ', findQQD);
    });
    it('Create QRespondent', function () {
        let qr1 = FactoryBoy.create('qresp1');
        let findQR1 = QRespondent.findOne({ _id: "bWDydJmJRcexvratk" });
        // console.log('findQQD: ', findQR1);
        chai.assert.strictEqual(findQR1.qnrid, 'WD3EKxRgK96Twov9Z', 'QRespondent qnrid does not match');
    });
    it('Create getResponse', function () {
        console.log('todo getResponse');
    });
    it('Create hasNoResponse', function () {
        console.log('todo hasNoResponse');
    });
    it('Create recordResponse', function () {
        console.log('todo recordResponse');
    });
    it('Create deletQRespondent', function () {
        console.log('todo deletQRespondent');
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