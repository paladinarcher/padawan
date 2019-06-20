import { Meteor } from 'meteor/meteor';

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
        
        if(Array.isArray(vp)) {
            let val = vp[0]+Math.abs(pp);
            return val;
        } else {
            return Math.abs(pp);
        }
    }
});