import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { Team } from '/imports/api/teams/teams.js';
import { User } from '/imports/api/users/users.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

var fs = {};
if (Meteor.isServer) {
  fs = Npm.require('fs');
}

const LSUser = Class.create({
  name: 'LSUser',
  fields: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'John Doe'
    }
  }
});

const LSNote = Class.create({
  name: 'LSNotes',
  fields: {
    user: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      default: ''
    }
  }
});


var intervalObjects = {};
const LearnShareSession = Class.create({
  name: 'LearnShareSession',
  collection: new Mongo.Collection('learn_share'),
  fields: {
    title: {
      type: String,
      default: 'unnamed Learn/Share session'
    },
    notes: {
      type: [LSNote],
      default: []
    },
    sessionWideNotesEnabled: {
      type: Boolean,
      default: false
    },
    participants: {
      type: [LSUser],
      default: []
    },
    guests: {
      type: [LSUser],
      default: []
    },
    presenters: {
      type: [LSUser],
      default: []
    },
    state: {
      type: String,
      default: 'active'
    },
    skypeUrl: {
      type: String,
      default: ''
    },
    teamId: {
      type: String,
      default: ''
    },
    nextParticipant: {
      type: String,
      default: ''
    }
  },
  behaviors: {
    timestamp: {}
  },
  meteorMethods: {
    addPresenter: function(user) {
      if ('locked' === this.state) {
        return;
      }
      var lsUser = new LSUser(user);
      // console.log("in addPresenter, lsUser: %s, user: %s", (lsUser.id + " " + lsUser.name), (user.id + " " + user.name));

      //check for duplicate
      if (
        typeof _.find(this.presenters, function(o) {
          return o.id === lsUser.id;
        }) !== 'undefined'
      ) {
        return false;
      }
      this.presenters.push(lsUser);

      return this.save();
    },
    addParticipant: function(user) {
      // console.log("first, this.title: %s, this.participants: %o", this.title, this.participants);

      if ('locked' === this.state) {
        return;
      }
      var lsUser = new LSUser(user);
      // console.log("in addParticipant, lsUser: %s, user: %o", (lsUser.id + " " + lsUser.name), (user.id + " " + user.name));

      //check for duplicate
      if (
        typeof _.find(this.participants, function(o) {
          return o.id === lsUser.id;
        }) !== 'undefined'
      ) {
        return false;
      }
      // console.log("before push, this.title: %s, this.participants: %o", this.title, this.participants);
      this.participants.push(lsUser);
      // console.log("after push, this.title: %s, this.participants: %o", this.title, this.participants);
      UserNotify.add({
        userId: lsUser.id,
        title: 'Learn/Share',
        body: 'You have been added to a Learn/Share session',
        // click: 'click',
        // follow: 'app.developerlevel.com/learnshare/' +this._id,
        // link: this.click.link(this.follow),
        link: 'http://stage.developerlevel.com/learnshare/' + this._id,
        action: 'learnshare:' + this._id
      });
      // console.log("after UserNotify, this.title: %s, this.participants: %o", this.title, this.participants);
      return this.save();
    },
    incrementLastPresenterSelecedAt: function() {
      this.lastPresenterSelectedAt++;
      return this.save();
    },
    removeParticipant: function(userId) {
      if ('locked' === this.state) {
        return;
      }
      this.participants = _.filter(this.participants, function(o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removeGuest: function(userId) {
      if ('locked' === this.state) {
        return;
      }
      this.guests = _.filter(this.guests, function(o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removePresenter: function(userId) {
      if ('locked' === this.state) {
        return;
      }
      this.presenters = _.filter(this.presenters, function(o) {
        return o.id !== userId;
      });
      return this.save();
    },
    setNextParticipant: function(userId) {
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        this.nextParticipant = userId;
        this.save();
      }
    },
    addParticipantSelf: function() {
      if ('locked' === this.state) {
        return;
      }
      if (Meteor.userId()) {
        //check for duplicate
        if (
          typeof _.find(this.participants, function(o) {
            return o.id === Meteor.userId();
          }) === 'undefined'
        ) {
          let u = User.findOne({ _id: Meteor.userId() });
          if (!u) {
            throw new Meteor.Error(403, 'You are not authorized');
          } else {
            let lsu = new LSUser({
              id: Meteor.userId(),
              name: u.MyProfile.firstName + ' ' + u.MyProfile.lastName
            });
            this.participants.push(lsu);
            this.save();
          }
        }
      } else {
        throw new Meteor.Error(403, 'You are not authorized');
      }
    },

    saveGuest: function(user) {
      if ('locked' === this.state) {
        return;
      }
      var lsUser = new LSUser(user);

      //check for duplicate
      if (
        typeof _.find(this.guests, function(o) {
          return o.id === lsUser.id;
        }) !== 'undefined'
      ) {
        let i = this.guests.findIndex(guest => guest.id == user.id);

        if (this.guests[i].name !== user.name) {
          this.guests[i].name = user.name;
          this.save();
        }

        return false;
      }
      this.guests.push(lsUser);
      UserNotify.add({
        userId: lsUser.id,
        title: 'Learn/Share',
        body: 'You have been added to a Learn/Share session edit this',
        link: 'app.developerlevel.com/learnshare/' + this._id,
        action: 'learnshare:' + this._id
      });
      return this.save();
    },
    enableNotes: function(enable) {
      this.sessionWideNotesEnabled = enable;
      this.save();
    },
    notesEnabled: function() {
      return this.sessionWideNotesEnabled;
    },
    createNote: function(note) {
      const { user, details } = note;
      const n = new LSNote({ user, details });
      this.notes = [n, ...this.notes];
      this.save();
    },
    saveText: function(title, notes) {
      let team = Team.findOne({ _id: this.teamId });

      if ('locked' === this.state) {
        return;
      }
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        ) ||
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          team.Name
        ) ||
        this.notesEnabled()
      ) {
        this.title = title;
        this.notes = notes;
        this.save();
      } else {
        throw new Meteor.Error(403, 'You are not authorized');
      }
    },
    lockSession: function(title, notes) {
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        this.state = 'locked';
        this.save();
      } else {
        throw new Meteor.Error(403, 'You are not authorized');
      }
    },
    unlockSession: function(title, notes) {
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        this.state = 'active';
        this.save();
      } else {
        throw new Meteor.Error(403, 'You are not authorized');
      }
    },
    setSkypeUrl: function(url) {
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        this.skypeUrl = url;
        this.save();
      }
    },
    setTeam: function(teamId) {
      if (
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        this.teamId = teamId;
        this.save();
      }
    },
    uploadRecording(fileInfo, fileData) {
      if (
        Meteor.isServer &&
        Roles.userIsInRole(
          Meteor.userId(),
          ['admin', 'learn-share-host'],
          Roles.GLOBAL_GROUP
        )
      ) {
        let uploadPath = '/uploads/';
        fs.writeFile(
          uploadPath + this._id + '.mp4',
          fileData,
          'binary',
          err => {
            console.log('File written.', err);
          }
        );
      }
    },
    uniqueParticipants(uid) {
      // check to make sure there are no duplicate guests and participants and remove extra guests
      for (let i = 0; i < this.guests.length; i++) {
        for (let j = 0; j < this.participants.length; j++) {
          if (this.guests[i].name == this.participants[j].name) {
            this.removeGuest(this.guests[i].id);
          }
        }
      }
    }
  }
});

export { LearnShareSession };