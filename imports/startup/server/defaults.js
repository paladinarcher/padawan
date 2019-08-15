import { Team } from '../../api/teams/teams.js';
import { Meteor } from 'meteor/meteor';

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

if (typeof Meteor.settings.private == "undefined") {
  Meteor.settings.private = { };
}
if (typeof Meteor.settings.private.GRF_URL == "undefined") {
  Meteor.settings.private.GRF_URL = "http://giraffe:3100/grf/";
}
if (typeof Meteor.settings.private.TSQ_URL == "undefined") {
  Meteor.settings.private.TSQ_URL = "http://tsqapp:4000/tsq/";
}
if (typeof Meteor.settings.private.Pages == "undefined") {
  Meteor.settings.private.Pages = {};
}
if (typeof Meteor.settings.private.Pages.TSQ == "undefined") {
  Meteor.settings.private.Pages.TSQ = {
    Slug: {
      Intro : "technical-skills-questionnaire-introduction",
      Instructions : "technical-skills-questionnaire-instructions"
    }
  };
}
if (typeof Meteor.settings.private.Pages.TraitSpectrum == "undefined") {
  Meteor.settings.private.Pages.TraitSpectrum = {
    Slug: {
      Intro : "trait-spectrum-introduction",
      Instructions : "trait-spectrum-instructions"
    }
  }
}
if (typeof Meteor.settings.private.Queue) {
  Meteor.settings.private.Queue = {
    "Redis": {
      "server": "redis",
      "port": 6379
    }
  };
}

export { SrvDefaults };
