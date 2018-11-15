import { QnaireData } from './qnaire_data.js';

Meteor.methods({
    'qnaire.createNewQnaireData'(qid) {
        console.log("createNewQnaireData ------------------------------");
        let qd = new QnaireData({
            qnrid: qid
        });
        return qd.save();
    }
});
