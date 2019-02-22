import { Qnaire, QQuestion } from './qnaire.js';

Meteor.methods({
    'qnaire.createNewQnaire'(newQnaire) {
        /*if ( !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP) ) {
            throw new Meteor.Error(403, "You are not authorized");
        }*/

        //newQnaire.CreatedBy = Meteor.userId();
        let q = new Qnaire(newQnaire);
        return q.save();
    },
    'qnaire.DeleteQuestion'(qnaireId, label) {
        let q = Qnaire.findOne({ _id: qnaireId })
        q.deleteQuestion(qnaireId, label)
    },
    'qnaire.checkEditDisabled' (qnrid, label) {
        console.log('im running checkEditDisabled')
        console.log(qnrid)
        console.log(label)
        let q = Qnaire.findOne({ _id: qnrid })
        q.disableQuestionEdit(label)
    },
    'qnaire.deleteQnaire' (qnaireId) {
        let q = Qnaire.findOne({ _id: qnaireId })
        q.deleteQnaire( qnaireId )
    }, 
    'qnaire.deactivateQuestion' (qnrid, label, checkedStatus) {
        let q = Qnaire.findOne({ _id: qnrid })
        q.deactivateQuestion(qnrid, label, checkedStatus)
    }
});