import { Meteor } from 'meteor/meteor';
import { Team } from '../teams.js';
import { User } from '../../users/users.js';

Meteor.publish('teamsData', () => {
    if (this.userId) {
        return Team.find(
            {
                $or: [
                    {Public: true},
                    {Members: Meteor.userId()}
                ]
            },
            {
                fields: { Name: 1, Description: 1, CreatedBy: 1 }
            }
        );
    } else {
        return [ ];
    }
});


Meteor.publishComposite('teamMemberList', (userId) => {
    return {
        find() {
            return Team.find( {Public: true}, {
                fields: { Name: 1, Description: 1, CreatedBy: 1 }
            });
        },
        children: [{
            find(team) {
                if ( Roles.userIsInRole(userId, ['admin','view-members'], team.Name) || Roles.userIsInRole(userId, 'admin', Roles.GLOBAL_GROUP) ) {

                    let asdf = "roles."+team.Name;
                    let u = User.find( {teams: team.Name}, {
                        fields: {
                            "MyProfile.firstName": 1,
                            "MyProfile.lastName": 1,
                            "roles": 1,
                            "teams": 1
                        }
                    });
                    if (team.Name == "Team 2") console.log("yyyyyyyy",u.fetch());
                    return u;
                } else {
                    console.log("can't view team members");
                    return this.ready();
                }
            }
        }]
    }
});
