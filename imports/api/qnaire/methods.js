import { Qnaire } from './qnaire.js';

Meteor.methods({
    'qnaire.createNewQnaire'(newQnaire) {
        /*if ( !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP) ) {
            throw new Meteor.Error(403, "You are not authorized");
        }*/

        //newQnaire.CreatedBy = Meteor.userId();
        let q = new Qnaire(newQnaire);
        return q.save();
    }
});
