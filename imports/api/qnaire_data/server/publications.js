import { QnaireData } from '../qnaire_data.js';

Meteor.publish('qnaireData', function (qid) {
    if ("undefined" !== typeof qid && "" !== qid && null !== qid) {
        console.log("findone", qid);
        return QnaireData.find( {qnrid:qid} );
    } else {
        console.log("findall");
        return QnaireData.find();
    }
});
