import { Team } from '../../api/teams/teams.js';

const SrvDefaults = {
    'user': {
        'password': 'admin'
    },
    'uploadPath': '/uploads/'
}

Meteor.methods({
    insertTeams: function () {
      Team.insert({
          Name: "TeamDev",
          Description: "Team of developers"
      });
    },
})

export { SrvDefaults };
