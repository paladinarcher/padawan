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
            let fieldsObj = {
                Name: 1,
                Description: 1,
                CreatedBy: 1
            };

            return Team.find( {Public: true}, {
                fields: fieldsObj
            });
        },
        children: [{
            find(team) {
                if ( Roles.userIsInRole(userId, ['admin','view-members'], team.Name) || Roles.userIsInRole(userId, 'admin', Roles.GLOBAL_GROUP) ) {

                    let memberList = team.Members;

                    let reqQuery = {};
                    let fieldsObj = {};
                    fieldsObj["MyProfile.firstName"] = 1;
                    fieldsObj["MyProfile.lastName"] = 1;
                    fieldsObj["roles."+team.Name] = 1;
                    fieldsObj["teams"] = 1;

                    reqQuery['roles.'+team.Name] = "user-join-request";
                    let u = User.find(
                    {
                        $or: [
                            { _id: { '$in': memberList } },
                            reqQuery
                        ]
                    }, { fields: fieldsObj });
                    console.log(memberList, team.Name, u.fetch());
                    return u;
                } else {
                    return this.ready();
                }
            }
        }]
    }
});

Meteor.publishComposite('oooteamMemberList', (userId) => {
    return {
        find() {
            let u = User.findOne( {_id: userId} );

            let teamsList = [];
            _.forEach(u.roles, (roles, team) => {
                if (roles.indexOf('admin') > -1 || roles.indexOf('view-members')) {
                    teamsList.push(team);
                }
            });
            let fieldsObj = {
                Name: 1,
                Description: 1,
                Members: 1,
                CreatedBy: 1
            };

            return Team.find( {Name: {'$in': teamsList}}, {
                fields: fieldsObj
            });
        },
        children: [{
            find(team) {
                if ( Roles.userIsInRole(userId, ['admin','view-members'], team.Name) || Roles.userIsInRole(userId, 'admin', Roles.GLOBAL_GROUP) ) {

                    let memberList = team.Members;

                    let reqQuery = {};
                    let fieldsObj = {};
                    fieldsObj["MyProfile.firstName"] = 1;
                    fieldsObj["MyProfile.lastName"] = 1;
                    fieldsObj["roles."+team.Name] = 1;
                    fieldsObj["teams"] = 1;

                    reqQuery['roles.'+team.Name] = "user-join-request";
                    let u = User.find(
                    {
                        $or: [
                            { _id: { '$in': memberList } },
                            reqQuery
                        ]
                    }, { fields: fieldsObj });
                    console.log(memberList, team.Name, u.fetch());
                    return u;
                } else {
                    return this.ready();
                }
            }
        }]
    }
});
