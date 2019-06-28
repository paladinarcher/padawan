import { Meteor } from 'meteor/meteor';
import { Qnaire,QuestionType,QQuestion } from '/imports/api/qnaire/qnaire.js';
import { User } from '/imports/api/users/users.js';

Meteor.methods({
    'tmp_pp'(v) {
        function hashCode (t){
            var hash = 0;
            if (t.length === 0) return hash;
            for (i = 0; i < t.length; i++) {
                char = t.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }

        vp = v.split('@');

        let pp = hashCode('T3mpP@$$'+v);
        let val = '';

        if(Array.isArray(vp)) {
            val = vp[0]+Math.abs(pp);
        } else {
            val = Math.abs(pp);
        }

        let exists = false;
        let u = User.find({"emails.address": v}).fetch();
        if(u.length < 1) {
            Accounts.createUser({
                username: v,
                email: v,
                password: val,
                profile: {
                    first_name: 'Temp',
                    last_name: 'User',
                    gender: 'unknown'
                }
            });
        } else {
            exists = true;
        }

        return [val,exists];
    },
    'find_trait_spectrum'() {
        let q = Qnaire.findOne({ title: 'Trait Spectrum' });

        return q;
    }
});