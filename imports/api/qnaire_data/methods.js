import { QRespondent } from './qnaire_data.js';

Meteor.methods({
    'qnaire.createNewQnaireData'(qid) {
        console.log("createNewQnaireData ------------------------------");
        let qd = new QRespondent({
            qnrid: qid
        });
        return qd.save();
    },
    'qnaireData.recordResponse'(qqlabel, val, finish, qid) {
        resp = QRespondent.findOne( {_id:qid} );
        resp.recordResponse(qqlabel, val, finish);
    }
});
