import { Meteor } from 'meteor/meteor';
import { User } from '../users/users.js';
import { RestrictedRoutes } from './restrictedRoutes.js';
import { Team } from '/imports/api/teams/teams.js';

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
        console.log('in hasPermission');
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

            // let Paladin & Archer team members access tsq
            let paTeam = Team.findOne({ Name: "Paladin & Archer" });
            // console.log('paTeam Members: ', paTeam.Members);
            let tsqRoutes = ['tsq.results', 'tsq.userLanguageList', 
                'tsq.familiarVsUnfamiliar', 'tsq.confidenceQuestionarie', 'tsq'];
            if (tsqRoutes.includes(r.routeName)) {
                if (paTeam.Members.includes(userId)) {
                    return true;
                }
            }

            if(roles['__global_roles__'] != undefined) {
                let overide_roles = ['admin','developer']
                for(let i = 0; i < overide_roles.length; i++) {
                    return roles['__global_roles__'].includes(overide_roles[i]);
                }
            }

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