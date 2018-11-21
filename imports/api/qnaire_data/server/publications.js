import { QRespondent } from '../qnaire_data.js';

Meteor.publish('qnaireData', function (qid) {
    if ("undefined" !== typeof qid && "" !== qid && null !== qid) {
        console.log("findone", qid);
        return QRespondent.find( {qnrid:qid} );
    } else {
        console.log("findall");
        return QRespondent.find();
    }
});
