import { Meteor } from 'meteor/meteor';
import { RestrictedRoutes } from '../restrictedRoutes.js';
 
Meteor.publish('restrictedRouteData', function() {
    return RestrictedRoutes.find({}, { fields: { roleName:1, teamNames:1 } });
});