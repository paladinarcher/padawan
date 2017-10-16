import { Meteor } from 'meteor/meteor';
import { Team } from '../teams.js';
import { User } from '../../users/users.js';

/*
Meteor.publish('teamsData', () => {

    return Team.find( {Public: true}, {
        fields: { Name: 1, Description: 1 }
    });
});
*/

Meteor.publishComposite('teamMemberList', (userId) => {
    return {
        find() {
            return Team.find( {Public: true}, {
                fields: { Name: 1, Description: 1 }
            });
        },
        children: [{
            find(team) {
                if( Roles.userIsInRole(userId, ['admin','view-members'], team.Name) ) {

                    let u = User.find( {teams: team.Name}, {
                        fields: {
                            "MyProfile.firstName": 1,
                            "MyProfile.lastName": 1
                        }
                    });
                    return u;
                } else {
                    return this.ready();
                }
            }
        }]
    }
});
