import { Qnaire } from '../qnaire.js';

Meteor.publish('qnaireData', function (qid) {
    if ("undefined" !== typeof qid && "" !== qid && null !== qid) {
        console.log("findone", qid);
        return Qnaire.find( {_id:qid} );
    } else {
        console.log("findall");
        return Qnaire.find();
    }
});
