import { QRespondent } from './qnaire_data.js';

Meteor.methods({
    'qnaire.createNewQnaireData'(qid) {
        console.log("createNewQnaireData ------------------------------");
        let qd = new QRespondent({
            qnrid: qid
        });
        return qd.save();
    }
});
