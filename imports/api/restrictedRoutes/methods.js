import { Meteor } from 'meteor/meteor';
import { User } from '../users/users.js';
import { RestrictedRoutes } from './restrictedRoutes.js';

Meteor.methods({
    'restricted.routes'() {
        let routes = RestrictedRoutes.find().fetch();
        if (routes === undefined || routes === false || routes.length == 0) {
            let r = [
                {
                    "routeName":"tsq.results",
                    "teamNames":["Developer"]
                },
                {
                    "routeName":"tsq.userLanguageList",
                    "teamNames":["Developer"]
                },
                {
                    "routeName":"tsq.familiarVsUnfamiliar",
                    "teamNames":["Developer"]
                },
                {
                    "routeName":"tsq.confidenceQuestionarie",
                    "teamNames":["Developer"]
                },
                {
                    "routeName":"tsq",
                    "teamNames":["Developer"]
                }
            ];
            let save = [];
            for(let i = 0; i < r.length; i++) {
                let nrr = new RestrictedRoutes(r[i]);
                let s = nrr.save();
            }
            routes = RestrictedRoutes.find().fetch();
        }
        return routes;
    },
    'restricted.hasPermission'(route) {
        let rr = Meteor.call('restricted.routes');
        //return rr;
        let r = rr.find(cur => {
           return cur.routeName === route
        })
        //return [route, r]
        if(r) {
            let userId = Meteor.userId();
            let user = User.findOne({ _id: userId });
            let roles = user.roles;
            //return roles;
            for(let i = 0; i < r.teamNames.length; i++) {
                let tn = r.teamNames[i];
                //return tn;
                if(roles[tn] != undefined) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
});