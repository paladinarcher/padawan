var require = meteorInstall({"imports":{"api":{"individual_goals":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/individual_goals/server/publications.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let IndividualGoal;
module.watch(require("../individual_goals.js"), {
  IndividualGoal(v) {
    IndividualGoal = v;
  }

}, 1);
let User;
module.watch(require("../../users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
Meteor.publish('individualGoalsData', function (userId) {
  if (Meteor.userId() === userId) {
    return IndividualGoal.find({
      userId: userId
    });
  } else if (Roles.userIsInRole(Meteor.userId(), ['admin', 'view-goals'], Roles.GLOBAL_GROUP)) {
    return IndividualGoal.find({
      userId: userId,
      privacy: {
        "$in": ["team", "public"]
      }
    });
  } else {
    this.stop();
    return;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"individual_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/individual_goals/individual_goals.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  IndividualGoal: () => IndividualGoal
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let User;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 3);
let UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 4);
let GoalComment;
module.watch(require("/imports/api/team_goals/team_goals.js"), {
  GoalComment(v) {
    GoalComment = v;
  }

}, 5);
const IndividualGoal = Class.create({
  name: 'IndividualGoal',
  collection: new Mongo.Collection('individual_goal'),
  fields: {
    userId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    },
    assignedToStr: {
      type: String,
      transient: true
    },
    reachedDate: {
      type: Date,
      optional: true
    },
    startDate: {
      type: Date,
      optional: true
    },
    dueDate: {
      type: Date,
      optional: true
    },
    reviewDate: {
      type: Date,
      optional: true
    },
    reviewedOnDate: {
      type: Date,
      optional: true
    },
    goalComments: {
      type: [GoalComment],
      default: []
    },
    reviewComments: {
      type: [GoalComment],
      default: []
    },
    teamId: {
      type: String,
      default: ""
    },
    privacy: {
      type: String,
      default: 'private'
    },
    createdBy: {
      type: String,
      default: ''
    }
  },
  behaviors: {
    timestamp: {}
  },
  helpers: {
    getGoalRoleGroup() {
      return this.teamName + '+' + this._id;
    },

    userIsAdmin() {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.teamName) || Roles.userIsInRole(Meteor.userId(), 'admin', this.getGoalRoleGroup())) {
        //user is either a global admin, a team admin, or a goal admin
        return true;
      } else {
        return false;
      }
    },

    userIsMentor() {
      if (Roles.userIsInRole(Meteor.userId(), 'mentor', this.getGoalRoleGroup())) {
        //user is a mentor for this goal
        return true;
      } else {
        return false;
      }
    },

    userIsAssigned() {
      if (Roles.userIsInRole(Meteor.userId(), 'assigned', this.getGoalRoleGroup())) {
        //user is assigned to this goal
        return true;
      } else {
        return false;
      }
    },

    setDateField(fieldName, rdate) {
      if (typeof rdate === "undefined") {
        rdate = new Date();
      } else if (!(rdate instanceof Date)) {
        return false;
      }

      this[fieldName] = rdate;
      return true;
    },

    getUserFullNameX(userId) {
      let u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      let name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },

    hasModifyPerm(fieldName) {
      switch (fieldName) {
        //admins-only fields
        case 'dueDate':
        case 'startDate':
        case 'reachedDate':
        case 'reviewDate':
        case 'title':
        case 'description':
        case 'assignedTo':
        case 'mentors':
        case 'admins':
        case 'subgoals':
          return this.userIsAdmin();
          break;
        //admins and mentors

        case 'reviewedOnDate':
        case 'reviewComments':
          return this.userIsAdmin() || this.userIsMentor();
          break;
        //anyone assigned to the goal

        case 'goalComments':
          return this.userIsAdmin() || this.userIsMentor() || this.userIsAssigned();
          break;

        case 'teamId':
        case 'privacy':
          return true;
          break;

        default:
          return false;
          break;
      }
    },

    notifyNew(oldList, newList) {
      let diffList = _.difference(newList, oldList);

      for (let i = 0; i < diffList.length; i++) {
        UserNotify.add({
          userId: diffList[i],
          title: 'Goals',
          body: 'You have been added to goal ' + this.title,
          action: 'teamgoals:' + this.teamName
        });
      }
    }

  },
  events: {
    beforeSave(e) {
      /*
      let egoal = e.currentTarget;
       //any user added to a goal is automatically added to the 'view-goals' role for the team
      //if they are already in that role, this should just ignore the redundant addUser
      let flds = ["assignedTo","mentors","admins"];
      for (let i in flds) {
          if (Array.isArray(egoal[flds[i]]) && egoal[flds[i]].length > 0) {
              Roles.addUsersToRoles(egoal[flds[i]], 'view-goals', egoal.teamName);
          }
      }
      */
    }

  },
  meteorMethods: {
    setDueDate(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("dueDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setGoalReached(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reachedDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setReviewDate(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setGoalReviewedOn(rdate) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewedOnDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    addComment(commentTxt) {
      //mentors, admins, and assignees
      if (!this.userIsAdmin() && !this.userIsMentor() && !this.userIsAssigned()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.goalComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },

    addReviewComment(commentTxt) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.reviewComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },

    createNewGoal() {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      } //

    },

    setTitle(title) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.title = title;
      this.save();
    },

    setDescription(descr) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.description = descr;
      this.save();
    },

    setAssignedTo(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.assignedTo, ulist);
      this.assignedTo = ulist;
      this.save();
    },

    setMentors(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.mentors, ulist);
      this.mentors = ulist;
      this.save();
    },

    setAdmins(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.admins, ulist);
      this.admins = ulist;
      this.save();
    },

    getUserFullName(userId) {
      const invocation = DDP._CurrentInvocation.get();

      if (invocation.isSimulation) {
        return "George";
      }

      let u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      let name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },

    updateFromObj(updObj) {
      let permError = false;

      for (let fld in updObj) {
        if (this[fld] !== updObj[fld] || Array.isArray(updObj[fld]) && _.isEqual(this[fld], updObj[fld])) {
          if (this.hasModifyPerm(fld)) {
            if (fld === "assignedTo" || fld === "mentors" || fld === "admins") {
              this.notifyNew(this[fld], updObj[fld]);
            }

            this[fld] = updObj[fld];
          } else {
            permError = true;
          }
        }
      }

      this.save();

      if (permError) {
        throw new Meteor.Error(403, "You are not authorized");
      }
    }

  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/individual_goals/methods.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let IndividualGoal;
module.watch(require("./individual_goals.js"), {
  IndividualGoal(v) {
    IndividualGoal = v;
  }

}, 0);
Meteor.methods({
  'individualgoals.createNewGoal'(goal) {
    if (goal.userId !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin'], goal.teamName)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    goal.createdBy = Meteor.userId();
    let g = new IndividualGoal(goal);
    return g.save();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"learn_share":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/learn_share/server/publications.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let LearnShareSession;
module.watch(require("../learn_share.js"), {
  LearnShareSession(v) {
    LearnShareSession = v;
  }

}, 1);
Meteor.publish('learnShareList', function () {
  if (this.userId) {
    return LearnShareSession.find({}, {
      fields: {
        title: 1,
        teamId: 1
      }
    });
  } else {
    return [];
  }
});
Meteor.publish('learnShareDetails', function (lssid) {
  //if (this.userId) {
  return LearnShareSession.find({
    _id: lssid
  }); //} else {
  //    return [ ];
  //}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"learn_share.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/learn_share/learn_share.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  LearnShareSession: () => LearnShareSession
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
let User;
module.watch(require("/imports/api/users/users.js"), {
  User(v) {
    User = v;
  }

}, 3);
let UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 4);
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
const LearnShareSession = Class.create({
  name: "LearnShareSession",
  collection: new Mongo.Collection('learn_share'),
  fields: {
    title: {
      type: String,
      default: "unnamed Learn/Share session"
    },
    notes: {
      type: String,
      default: "duly noted"
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
      default: "active"
    },
    skypeUrl: {
      type: String,
      default: ""
    },
    teamId: {
      type: String,
      default: ""
    }
  },
  behaviors: {
    timestamp: {}
  },
  meteorMethods: {
    addPresenter: function (user) {
      if ("locked" === this.state) {
        return;
      }

      var lsUser = new LSUser(user); //check for duplicate

      if (typeof _.find(this.presenters, function (o) {
        return o.id === lsUser.id;
      }) !== "undefined") {
        return false;
      }

      this.presenters.push(lsUser);
      return this.save();
    },
    addParticipant: function (user) {
      if ("locked" === this.state) {
        return;
      }

      var lsUser = new LSUser(user); //check for duplicate

      if (typeof _.find(this.participants, function (o) {
        return o.id === lsUser.id;
      }) !== "undefined") {
        return false;
      }

      this.participants.push(lsUser);
      UserNotify.add({
        userId: lsUser.id,
        title: 'Learn/Share',
        body: 'You have been added to a Learn/Share session',
        action: 'learnshare:' + this._id
      });
      return this.save();
    },
    removeParticipant: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.participants = _.filter(this.participants, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removeGuest: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.guests = _.filter(this.guests, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removePresenter: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.presenters = _.filter(this.presenters, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    addParticipantSelf: function () {
      if ("locked" === this.state) {
        return;
      }

      if (Meteor.userId()) {
        //check for duplicate
        if (typeof _.find(this.participants, function (o) {
          return o.id === Meteor.userId();
        }) === "undefined") {
          let u = User.findOne({
            _id: Meteor.userId()
          });

          if (!u) {
            throw new Meteor.Error(403, "You are not authorized");
          } else {
            let lsu = new LSUser({
              id: Meteor.userId(),
              name: u.MyProfile.firstName + " " + u.MyProfile.lastName
            });
            this.participants.push(lsu);
            this.save();
          }
        }
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    saveGuest: function (guestId, guestName) {
      if ("locked" === this.state) {
        return;
      }

      let guestObj = _.find(this.guests, function (o) {
        return o.id === guestId;
      });

      if ("undefined" !== typeof guestObj) {
        console.log("already a guest");
        this.guests = _.filter(this.guests, function (o) {
          return o.id !== guestId;
        });
        guestObj.name = guestName;
      } else {
        console.log("not a guest");
        guestObj = new LSUser({
          id: guestId,
          name: guestName
        });
      }

      this.guests.push(guestObj);
      this.save();
    },
    saveText: function (title, notes) {
      if ("locked" === this.state) {
        return;
      }

      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.title = title;
        this.notes = notes;
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    lockSession: function (title, notes) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.state = "locked";
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    unlockSession: function (title, notes) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.state = "active";
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    setSkypeUrl: function (url) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.skypeUrl = url;
        this.save();
      }
    },

    uploadRecording(fileInfo, fileData) {
      if (Meteor.isServer && Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        let uploadPath = '/uploads/';
        fs.writeFile(uploadPath + this._id + ".mp4", fileData, 'binary', err => {
          console.log("File written.", err);
        });
      }
    }

  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/learn_share/methods.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let LearnShareSession;
module.watch(require("./learn_share.js"), {
  LearnShareSession(v) {
    LearnShareSession = v;
  }

}, 1);

var formattedDate = () => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + day).slice(-2);
};

var randomChars = () => {
  var text = "";
  var idLength = 2;
  var possible = "acdeghijklmnopqrstuvwxyz";

  for (var i = 0; i < idLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var lssidGenerate = () => {
  return formattedDate() + "-" + randomChars();
};

Meteor.methods({
  'learnshare.createNewSession'(sessTitle, teamId) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let lssid = lssidGenerate();
    let newSession = new LearnShareSession({
      _id: lssid,
      title: sessTitle,
      teamId: teamId
    });
    newSession.save();
    return lssid;
  },

  'learnshare.recordingExists'(fname) {
    let fs = Npm.require('fs');

    let uploadPath = '/uploads/';
    console.log("exist", uploadPath + fname + ".mp4");

    if (fs.existsSync(uploadPath + fname + ".mp4")) {
      console.log("yes");
      return true;
    } else {
      console.log("no");
      return false;
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"questions":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/questions/server/publications.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Question, Reading, MyersBriggsCategory;
module.watch(require("../questions.js"), {
  Question(v) {
    Question = v;
  },

  Reading(v) {
    Reading = v;
  },

  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 1);
let User, MyersBriggs, Answer, UserType, Profile;
module.watch(require("../../users/users.js"), {
  User(v) {
    User = v;
  },

  MyersBriggs(v) {
    MyersBriggs = v;
  },

  Answer(v) {
    Answer = v;
  },

  UserType(v) {
    UserType = v;
  },

  Profile(v) {
    Profile = v;
  }

}, 2);
Meteor.publishComposite('questions.bycategory', function (category) {
  if (!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) {
    return this.ready();
  }

  console.log("Publication 'questions.bycategory': ", category, this.userId);
  return {
    find() {
      return Question.find({
        Categories: category
      }, {
        defaults: true,
        sort: {
          createdAt: -1
        }
      });
    },

    children: [{
      find(question) {
        return User.find({
          _id: question.CreatedBy
        }, {
          limit: 1
        });
      }

    }]
  };
});
Meteor.publish('questions.toanswer', function (userId, refresh) {
  //console.log(userId, this.userId);
  //if(this.userId !== userId && !Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
  console.log("Publication 'questions.toanswer': ", this.userId, userId);
  let self = this;
  let user = User.findOne({
    _id: userId
  });
  let qids = user.MyProfile.UserType.getAnsweredQuestionsIDs(); //console.log(self, user, qids);

  let observe = {
    added: function (id, fields) {
      self.added('questions', id, fields);
    },
    changed: function (id, fields) {
      self.removed("questions", id);
    },
    removed: function (id) {
      self.removed('questions', id);
    }
  };
  let ids = [0, 1, 2, 3];
  ids.sort(function (a, b) {
    let ar = Math.random();
    let br = Math.random();

    if (ar === br) {
      return 0;
    }

    return ar > br ? -1 : 1;
  });
  handles = [null, null, null, null];

  for (let i = 0; i < ids.length; i++) {
    handles[ids[i]] = Question.find({
      Categories: ids[i],
      _id: {
        $nin: qids
      },
      Active: true
    }, {
      limit: 1
    }).observeChanges(observe);
  }

  self.ready();
  self.onStop(function () {
    for (let i = 0; i < ids.length; i++) {
      handles[i].stop();
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/questions/methods.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let Question, MyersBriggsCategory;
module.watch(require("./questions.js"), {
  Question(v) {
    Question = v;
  },

  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 2);
let User, Answer;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  },

  Answer(v) {
    Answer = v;
  }

}, 3);
Meteor.methods({
  'question.insert'(category, text, left, right, seg) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    console.log(category);
    let newQuestion = new Question({
      Category: parseInt(category[0]),
      Categories: category.map(a => {
        return parseInt(a);
      }),
      Text: text,
      LeftText: left,
      RightText: right,
      segments: seg,
      CreatedBy: Meteor.userId()
    });
    console.log(category, text, newQuestion);
    newQuestion.validate({
      cast: true
    });
    return newQuestion.save();
  },

  'question.answer'(questionId, value, isReversed) {
    let question = Question.findOne({
      _id: questionId
    });
    let me = User.findOne({
      _id: Meteor.userId()
    });
    value = parseFloat(value);

    if (!!isReversed) {
      value = ~value + 1;
    }

    console.log(questionId, value, !!isReversed);
    let answer = new Answer({
      Categories: question.Categories,
      QuestionID: questionId,
      Reversed: !!isReversed,
      Value: value
    });
    question.addAnswer(answer);
    me.MyProfile.UserType.answerQuestion(answer);
    console.log(me.MyProfile);
    me.save();
  },

  'question.unanswer'(questionId) {
    let me = User.findOne({
      _id: Meteor.userId()
    });
    let answer = me.MyProfile.UserType.getAnswerForQuestion(questionId);

    if (answer == null) {
      throw new Meteor.Error(403, 'You can\'t unanwer a question you haven\'t answered.');
    }

    me.MyProfile.UserType.unAnswerQuestion(answer);
    me.save();
  },

  'question.unanswerAll'(questionIds) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    if (!questionIds instanceof Array) {
      questionIds = [questionIds];
    }

    let questions = Question.find({
      _id: {
        $in: questionIds
      }
    });
    questions.forEach(function (question) {
      question.unanswerAll();
    });
  },

  'question.delete'(questionId) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let me = User.findOne({
      _id: Meteor.userId()
    });
    let question = Question.findOne({
      _id: questionId
    });
    question.remove();
  },

  'question.resetUsers'(userIds) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    if (!userIds instanceof Array) {
      userIds = [userIds];
    }

    let us = User.find({
      _id: {
        $in: userIds
      }
    });

    if (!us) {
      throw new Meteor.Error(404, "User is not found.");
    }

    us.forEach(function (u) {
      u.MyProfile.UserType.reset();
      u.save();
    });
  },

  'question.resetAll'() {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let qs = Question.find({});
    qs.forEach(function (q) {
      q.unanswerAll();
    });
    let us = User.find({});
    us.forEach(function (u) {
      u.MyProfile.UserType.reset();
      u.save();
    });
  },

  'question.countQuestions'(myUserId) {
    //console.log("happy1");
    let me = User.findOne({
      _id: myUserId
    }); //console.log("UserID", me);

    let totalQuestions = Question.find().count(); //console.log("happy3", totalQuestions);

    me.MyProfile.UserType.setTotalQuestions(totalQuestions); //console.log("happy4", me.MyProfile.UserType.getTotalQuestions());

    return totalQuestions;
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"questions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/questions/questions.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Question: () => Question,
  Reading: () => Reading,
  MyersBriggsCategory: () => MyersBriggsCategory
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 3);
let User;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  }

}, 4);
let Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults(v) {
    Defaults = v;
  }

}, 5);
let UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 6);
const MyersBriggsCategory = Enum.create({
  name: 'MyersBriggsCategory',
  identifiers: ['IE', 'NS', 'TF', 'JP']
});
const Reading = Class.create({
  name: 'Reading',
  fields: {
    Rank: {
      type: Number,
      default: 0,
      validators: [{
        type: 'lte',
        resolveParam: function () {
          return 50;
        }
      }, {
        type: 'gte',
        resolveParam: function () {
          return -50;
        }
      }]
    },
    Text: {
      type: String,
      default: 'Well, you feel...'
    }
  }
});
const PolarStats = Class.create({
  name: 'PolarStats',
  fields: {
    LeftSum: {
      type: Number,
      default: 0
    },
    RightSum: {
      type: Number,
      default: 0
    }
  },
  helpers: {
    reset() {
      this.LeftSum = 0;
      this.RightSum = 0;
    }

  }
});
const Question = Class.create({
  name: "Question",
  collection: new Mongo.Collection('questions'),
  fields: {
    Category: {
      type: MyersBriggsCategory,
      default: 'IE'
    },
    Categories: {
      type: [MyersBriggsCategory],
      default: []
    },
    Text: {
      type: String,
      default: 'Whoa! What we askin\' here?'
    },
    LeftText: {
      type: String,
      default: 'Whoa! What we askin\' here?'
    },
    RightText: {
      type: String,
      default: 'Whoa! What we askin\' here?'
    },
    Readings: {
      type: [Reading],
      default: function () {
        return [{
          Rank: -50,
          Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."
        }, {
          Rank: -49,
          Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."
        }, {
          Rank: -40,
          Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "
        }, {
          Rank: -30,
          Text: "This is your most common behavior, but there are definitely times you've done the opposite."
        }, {
          Rank: -20,
          Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."
        }, {
          Rank: -10,
          Text: "You don't have much of a preference either way, but this side sounds a bit more likely."
        }, {
          Rank: 10,
          Text: "You don't have much of a preference either way, but this side sounds a bit more likely."
        }, {
          Rank: 20,
          Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."
        }, {
          Rank: 30,
          Text: "This is your most common behavior, but there are definitely times you've done the opposite."
        }, {
          Rank: 40,
          Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "
        }, {
          Rank: 49,
          Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."
        }, {
          Rank: 50,
          Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."
        }];
      }
    },
    segments: {
      type: [String],
      default: []
    },
    Active: {
      type: Boolean,
      default: false
    },
    CreatedBy: {
      type: String,
      default: function () {
        return Meteor.userId();
      }
    },
    TimesAnswered: {
      type: PolarStats,
      default: function () {
        return new PolarStats();
      }
    },
    SumOfAnswers: {
      type: PolarStats,
      default: function () {
        return new PolarStats();
      }
    }
  },
  meteorMethods: {
    getUser() {
      let u = User.findOne({
        _id: this.CreatedBy
      });
      return u;
    }

  },
  helpers: {
    addAnswer(answer) {
      if (answer.Value < 0) {
        this.TimesAnswered.LeftSum++;
        this.SumOfAnswers.LeftSum += answer.Value;
      } else {
        this.TimesAnswered.RightSum++;
        this.SumOfAnswers.RightSum += answer.Value;
      }

      this.save();
    },

    removeAnswer(answer) {
      if (answer.Value < 0) {
        this.TimesAnswered.LeftSum--;

        if (this.TimesAnswered.LeftSum <= 0) {
          this.TimesAnswered.LeftSum = 0;
          this.SumOfAnswers.LeftSum = 0;
        } else {
          this.SumOfAnswers.LeftSum -= answer.Value;
        }
      } else {
        this.TimesAnswered.RightSum--;

        if (this.TimesAnswered.RightSum <= 0) {
          this.TimesAnswered.RightSum = 0;
          this.SumOfAnswers.RightSum = 0;
        } else {
          this.SumOfAnswers.RightSum -= answer.Value;
        }
      }

      this.save();
    },

    allAnsweredUsers() {
      return User.find({
        'MyProfile.UserType.AnsweredQuestions.QuestionID': {
          $eq: this._id
        }
      });
    },

    unanswerAll(noSave) {
      let self = this;
      self.allAnsweredUsers().forEach(function (user) {
        let b = user.MyProfile.UserType.AnsweredQuestions.length;
        user.MyProfile.UserType.unAnswerQuestion(user.MyProfile.UserType.getAnswerForQuestion(self._id), false);

        if (!noSave) {
          user.save();
        }
      });
      this.reset();
    },

    reset() {
      this.TimesAnswered.reset();
      this.SumOfAnswers.reset();
      this.save();
    }

  },
  behaviors: {
    timestamp: {},
    softremove: {}
  },
  secured: {
    update: false
  },
  events: {
    beforeInsert(e) {
      let u = User.findOne({
        username: Defaults.user.username
      });
      UserNotify.add({
        userId: u._id,
        title: 'Questions',
        body: 'New question added',
        action: 'questions:' + e.currentTarget._id
      });
    },

    beforeUpdate(e) {
      const allowed = ['updatedAt', 'TimesAnswered', 'TimesAnswered.LeftSum', 'SumOfAnswers', 'SumOfAnswers.LeftSum', 'TimesAnswered.RightSum', 'SumOfAnswers.RightSum'];
      const doc = e.currentTarget;
      const fieldNames = doc.getModified();

      _.each(fieldNames, function (fieldName) {
        if (!Meteor.isServer && allowed.indexOf(fieldName) < 0 && !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
          throw new Meteor.Error(403, "You are not authorized");
        }
      });
    }

  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"roles":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/roles/server/publications.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
Meteor.publish(null, function () {
  return Meteor.roles.find({});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"team_goals":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/team_goals/server/publications.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let TeamGoal;
module.watch(require("../team_goals.js"), {
  TeamGoal(v) {
    TeamGoal = v;
  }

}, 1);
let User;
module.watch(require("../../users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
Meteor.publish('teamGoalsData', function (teamName) {
  if (Roles.userIsInRole(Meteor.userId(), ['admin', 'view-goals'], teamName)) {
    return TeamGoal.find({
      teamName: teamName
    });
  } else {
    this.stop();
    return;
  }
});
Meteor.publishComposite('teamGoalsUsers', function (teamName) {
  if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'view-goals'], teamName)) {
    return this.ready();
  }

  return {
    find() {
      return TeamGoal.find({
        teamName: teamName
      });
    },

    children: [{
      find(teamGoal) {
        let userList = teamGoal.assignedTo.concat(teamGoal.mentors).concat(teamGoal.admins);
        let fieldsObj = {};
        fieldsObj["MyProfile.firstName"] = 1;
        fieldsObj["MyProfile.lastName"] = 1;
        return User.find({
          _id: userList
        }, {
          fields: fieldsObj
        });
      }

    }]
  };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/team_goals/methods.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let TeamGoal;
module.watch(require("./team_goals.js"), {
  TeamGoal(v) {
    TeamGoal = v;
  }

}, 0);
Meteor.methods({
  'teamgoals.createNewGoal'(goal) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], goal.teamName)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let g = new TeamGoal(goal);
    return g.save();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"team_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/team_goals/team_goals.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  TeamGoal: () => TeamGoal,
  GoalComment: () => GoalComment
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let User;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 3);
let UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 4);
const GoalComment = Class.create({
  name: 'GoalComment',
  fields: {
    userId: {
      type: String,
      default: function () {
        return Meteor.userId();
      }
    },
    date: {
      type: Date,
      default: function () {
        return new Date();
      }
    },
    text: {
      type: String,
      default: ''
    }
  }
});
const TeamGoal = Class.create({
  name: 'TeamGoal',
  collection: new Mongo.Collection('team_goal'),
  fields: {
    teamName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    },
    assignedTo: {
      type: [String],
      default: []
    },
    mentors: {
      type: [String],
      default: []
    },
    assignedToStr: {
      type: String,
      transient: true
    },
    mentorsStr: {
      type: String,
      transient: true
    },
    adminsStr: {
      type: String,
      transient: true
    },
    admins: {
      type: [String],
      default: []
    },
    reachedDate: {
      type: Date,
      optional: true
    },
    startDate: {
      type: Date,
      optional: true
    },
    dueDate: {
      type: Date,
      optional: true
    },
    reviewDate: {
      type: Date,
      optional: true
    },
    reviewedOnDate: {
      type: Date,
      optional: true
    },
    goalComments: {
      type: [GoalComment],
      default: []
    },
    reviewComments: {
      type: [GoalComment],
      default: []
    }
  },
  behaviors: {
    timestamp: {}
  },
  helpers: {
    getGoalRoleGroup() {
      return this.teamName + '+' + this._id;
    },

    userIsAdmin() {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.teamName) || Roles.userIsInRole(Meteor.userId(), 'admin', this.getGoalRoleGroup())) {
        //user is either a global admin, a team admin, or a goal admin
        return true;
      } else {
        return false;
      }
    },

    userIsMentor() {
      if (Roles.userIsInRole(Meteor.userId(), 'mentor', this.getGoalRoleGroup())) {
        //user is a mentor for this goal
        return true;
      } else {
        return false;
      }
    },

    userIsAssigned() {
      if (Roles.userIsInRole(Meteor.userId(), 'assigned', this.getGoalRoleGroup())) {
        //user is assigned to this goal
        return true;
      } else {
        return false;
      }
    },

    setDateField(fieldName, rdate) {
      if (typeof rdate === "undefined") {
        rdate = new Date();
      } else if (!(rdate instanceof Date)) {
        return false;
      }

      this[fieldName] = rdate;
      return true;
    },

    getUserFullNameX(userId) {
      let u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      let name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },

    hasModifyPerm(fieldName) {
      switch (fieldName) {
        //admins-only fields
        case 'dueDate':
        case 'startDate':
        case 'reachedDate':
        case 'reviewDate':
        case 'title':
        case 'description':
        case 'assignedTo':
        case 'mentors':
        case 'admins':
        case 'subgoals':
          return this.userIsAdmin();
          break;
        //admins and mentors

        case 'reviewedOnDate':
        case 'reviewComments':
          return this.userIsAdmin() || this.userIsMentor();
          break;
        //anyone assigned to the goal

        case 'goalComments':
          return this.userIsAdmin() || this.userIsMentor() || this.userIsAssigned();
          break;

        default:
          return false;
          break;
      }
    },

    notifyNew(oldList, newList) {
      let diffList = _.difference(newList, oldList);

      for (let i = 0; i < diffList.length; i++) {
        UserNotify.add({
          userId: diffList[i],
          title: 'Team Goals',
          body: 'You have been added to goal ' + this.title,
          action: 'teamgoals:' + this.teamName
        });
      }
    }

  },
  events: {
    beforeSave(e) {
      let egoal = e.currentTarget; //any user added to a goal is automatically added to the 'view-goals' role for the team
      //if they are already in that role, this should just ignore the redundant addUser

      let flds = ["assignedTo", "mentors", "admins"];

      for (let i in flds) {
        if (Array.isArray(egoal[flds[i]]) && egoal[flds[i]].length > 0) {
          Roles.addUsersToRoles(egoal[flds[i]], 'view-goals', egoal.teamName);
        }
      }
    }

  },
  meteorMethods: {
    setDueDate(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("dueDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setGoalReached(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reachedDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setReviewDate(rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    setGoalReviewedOn(rdate) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewedOnDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },

    addComment(commentTxt) {
      //mentors, admins, and assignees
      if (!this.userIsAdmin() && !this.userIsMentor() && !this.userIsAssigned()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.goalComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },

    addReviewComment(commentTxt) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.reviewComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },

    createNewGoal() {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      } //

    },

    setTitle(title) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.title = title;
      this.save();
    },

    setDescription(descr) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.description = descr;
      this.save();
    },

    setAssignedTo(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.assignedTo, ulist);
      this.assignedTo = ulist;
      this.save();
    },

    setMentors(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.mentors, ulist);
      this.mentors = ulist;
      this.save();
    },

    setAdmins(ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.admins, ulist);
      this.admins = ulist;
      this.save();
    },

    getUserFullName(userId) {
      const invocation = DDP._CurrentInvocation.get();

      if (invocation.isSimulation) {
        return "George";
      }

      let u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      let name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },

    updateFromObj(updObj) {
      let permError = false;

      for (let fld in updObj) {
        if (this[fld] !== updObj[fld] || Array.isArray(updObj[fld]) && _.isEqual(this[fld], updObj[fld])) {
          if (this.hasModifyPerm(fld)) {
            if (fld === "assignedTo" || fld === "mentors" || fld === "admins") {
              this.notifyNew(this[fld], updObj[fld]);
            }

            this[fld] = updObj[fld];
          } else {
            permError = true;
          }
        }
      }

      this.save();

      if (permError) {
        throw new Meteor.Error(403, "You are not authorized");
      }
    }

  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"teams":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/teams/server/publications.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Team;
module.watch(require("../teams.js"), {
  Team(v) {
    Team = v;
  }

}, 1);
let User;
module.watch(require("../../users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
Meteor.publish('teamsData', function () {
  if (this.userId) {
    return Team.find({
      $or: [{
        Public: true
      }, {
        Members: Meteor.userId()
      }]
    }, {
      fields: {
        Name: 1,
        Description: 1,
        CreatedBy: 1,
        Icon: 1,
        Icon64: 1,
        IconType: 1
      }
    });
  } else {
    return [];
  }
});
Meteor.publish('teamsMemberOfList', userId => {
  // if (userId == Meteor.userId() || Roles.userIsInRole(Meteor.userId(),'admin', Roles.GLOBAL_GROUP)) {
  return Team.find({
    Members: userId
  }); // } else {
  //    return [];
  // }
});
Meteor.publishComposite('teamMemberList', userId => {
  return {
    find() {
      let u = User.findOne({
        _id: Meteor.userId()
      });

      if (typeof u === "undefined") {
        return; // [];
      }

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
        CreatedBy: 1,
        Icon: 1,
        Icon64: 1,
        IconType: 1
      };
      return Team.find({
        Name: {
          '$in': teamsList
        }
      }, {
        fields: fieldsObj
      });
    },

    children: [{
      find(team) {
        if (Roles.userIsInRole(userId, ['admin', 'view-members'], team.Name) || Roles.userIsInRole(userId, 'admin', Roles.GLOBAL_GROUP)) {
          let memberList = team.Members;
          let reqQuery = {};
          let fieldsObj = {};
          fieldsObj["MyProfile.firstName"] = 1;
          fieldsObj["MyProfile.lastName"] = 1;
          fieldsObj["roles." + team.Name] = 1;
          fieldsObj["teams"] = 1;
          reqQuery['roles.' + team.Name] = "user-join-request";
          let u = User.find({
            $or: [{
              _id: {
                '$in': memberList
              }
            }, reqQuery]
          }, {
            fields: fieldsObj
          });
          return u;
        } else {
          return this.ready();
        }
      }

    }]
  };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/teams/methods.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Team;
module.watch(require("./teams.js"), {
  Team(v) {
    Team = v;
  }

}, 0);
Meteor.methods({
  'team.createNewTeam'(newTeam) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    newTeam.CreatedBy = Meteor.userId();
    let t = new Team(newTeam);
    return t.save();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"teams.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/teams/teams.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Team: () => Team,
  TeamIcon: () => TeamIcon
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 3);
let User;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  }

}, 4);
let Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults(v) {
    Defaults = v;
  }

}, 5);
let UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 6);
const DefaultTeamID = "NCuypCXN47KrSTeXh";
const TeamIcon = Class.create({
  name: "TeamIcon",
  fields: {
    data: {
      type: String,
      default: ''
    },
    contentType: {
      type: String,
      default: 'image/png'
    }
  }
});
const Team = Class.create({
  name: "Team",
  collection: new Mongo.Collection('teams'),
  fields: {
    Name: {
      type: String,
      default: 'Whoa! The no-name team?'
    },
    Description: {
      type: String,
      default: 'This team is nondescript.'
    },
    Icon64: {
      type: String,
      default: ''
    },
    IconType: {
      type: String,
      defaut: 'image/png',
      optional: true
    },
    Icon: {
      type: TeamIcon,
      default: function () {
        return new TeamIcon();
      }
    },
    Public: {
      type: Boolean,
      default: true
    },
    Members: {
      type: [String],
      default: []
    },
    Active: {
      type: Boolean,
      default: false
    },
    CreatedBy: {
      type: String,
      default: function () {
        return this.userId;
      }
    }
  },
  indexes: {
    nameIndex: {
      fields: {
        Name: 1
      },
      options: {
        unique: true
      }
    }
  },
  meteorMethods: {
    userRequestJoin() {
      Roles.addUsersToRoles(Meteor.userId(), 'user-join-request', this.Name);
    },

    adminRequestUserJoin(user) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name) && !Roles.userIsInRole(user, 'member', this.Name)) {
        Roles.addUsersToRoles(user, 'admin-join-request', this.Name);

        for (let i = 0; i < user.length; i++) {
          UserNotify.add({
            userId: user[i],
            title: 'Teams',
            body: 'Received join request for team ' + this.Name,
            action: 'teams:' + this.Name.split(' ').join('-')
          });
        }
      }
    },

    userAcceptJoin() {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
        Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
        this.addUsers(Meteor.userId());
      }
    },

    userDeclineJoin() {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
        Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
      }
    },

    adminAcceptJoin(userId) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, 'user-join-request', this.Name); //Roles.addUsersToRoles(userId, 'member', this.Name);

        this.addUsers(userId);
      }
    },

    adminRejectJoin(userId) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, 'user-join-request', this.Name);
      }
    },

    addRole(userId, role) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.addUsersToRoles(userId, role, this.Name);
      }
    },

    removeRole(userId, role) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, role, this.Name);
      }
    },

    updateFromObj(updObj) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        for (let fld in updObj) {
          if ("Icon64" !== fld && "IconType" !== fld && "Icon" !== fld) {
            this[fld] = updObj[fld];
          }
        }

        this.save();
      }
    },

    uploadIcon(fileInfo, fileData) {
      if (Meteor.isServer) {
        var base64Image = new Buffer(fileData, 'binary').toString('base64');
        this.Icon64 = base64Image;
        this.IconType = 'image/png';
        this.save();
      }
    }

  },
  helpers: {
    addUsers(users) {
      if (typeof users === 'string') {
        users = [users];
      } //admin list has to be filtered because getUsersInRole includes admin in GLOBAL_GROUP


      let groupAdminList = Roles.getUsersInRole('admin', this.Name).fetch().filter(user => {
        return "undefined" !== typeof user.roles && "undefined" !== typeof user.roles[this.Name] && user.roles[this.Name].indexOf('admin') > -1;
      });

      for (let i = 0; i < users.length; i++) {
        if (this.Members.indexOf(users[i]) === -1) {
          this.Members.push(users[i]);
        }

        let currUserRoles = ['member']; //Roles.addUsersToRoles(users[i], 'member', this.Name);
        //if team doesn't have an admin, the first user added becomes admin

        if (i == 0 && groupAdminList.length == 0) {
          //Roles.addUsersToRoles(users[i], 'admin', this.Name);
          currUserRoles.push('admin');
        } else {
          //Roles.addUsersToRoles(users[i], Defaults.role.name, this.Name);
          currUserRoles.push(Defaults.role.name);
        }

        Roles.addUsersToRoles(users[i], currUserRoles, this.Name);
        /*
        let u = User.findOne( {_id: users[i]} );
        if (u && u.teams.indexOf(this.Name) === -1) {
            u.teams.push(this.Name);
            u.save();
        }
        */
      }

      this.save();
    },

    removeUsers(users) {
      if (typeof users === 'string') {
        users = [users];
      }

      for (let i = 0; i < users.length; i++) {}
    },

    removeUsersFromTeamRoles(users, roles) {
      if (typeof users === 'string') {
        users = [users];
      }

      if (typeof roles === 'string') {
        roles = [roles];
      } //if removing the 'member' role from users, completely remove them from all roles and from the group


      if (roles.indexOf('member') !== -1) {
        this.removeUsers(users);
      }

      for (let i = 0; i < users.length; i++) {}
    }

  },
  behaviors: {
    timestamp: {},
    softremove: {}
  },
  secured: {},
  events: {
    afterInit(e) {//
    },

    beforeSave(e) {
      console.log("before save Team", e.currentTarget.Name, e.currentTarget.Members);
    }

  }
});
Team.Default = Team.findOne({
  _id: DefaultTeamID
});

if (typeof Team.Default === "undefined") {
  Team.Default = new Team({
    _id: DefaultTeamID,
    Name: 'No Team',
    Active: true
  });

  if (Meteor.isServer) {
    Team.Default.CreatedBy = 'kkcDYH3ix4f4Lb5qk'; //console.log(Team.Default);
    //Team.Default.save();
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"type_readings":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/type_readings/server/publications.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let TypeReading, ReadingRange;
module.watch(require("../type_readings.js"), {
  TypeReading(v) {
    TypeReading = v;
  },

  ReadingRange(v) {
    ReadingRange = v;
  }

}, 1);
let User, MyersBriggs, Answer, UserType, Profile;
module.watch(require("../../users/users.js"), {
  User(v) {
    User = v;
  },

  MyersBriggs(v) {
    MyersBriggs = v;
  },

  Answer(v) {
    Answer = v;
  },

  UserType(v) {
    UserType = v;
  },

  Profile(v) {
    Profile = v;
  }

}, 2);
let MyersBriggsCategory;
module.watch(require("../../questions/questions.js"), {
  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 3);
Meteor.publishComposite('typereadings.getAll', function () {
  if (!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) {
    return this.ready();
  }

  var qry = {};
  console.log("Publication 'typereadings.getAll': ", this.userId, qry);
  return {
    find() {
      return TypeReading.find(qry, {
        defaults: true,
        sort: {
          "TypeReadingCategories.Range.low": 1,
          "TypeReadingCategories.Range.Delta": -1
        }
      });
    },

    children: [{
      find(typereading) {
        return User.find({
          _id: typereading.CreatedBy
        }, {
          limit: 1
        });
      }

    }]
  };
});
Meteor.publishComposite('typereadings.byCategory', function (category) {
  if (!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) {
    return this.ready();
  }

  var qry = {};
  qry["TypeReadingCategories." + category + ".Range.low"] = {
    $gte: -100
  };
  console.log("Publication 'typereadings.byCategory': ", category, this.userId, qry);
  return {
    find() {
      return TypeReading.find(qry, {
        defaults: true,
        sort: {
          "TypeReadingCategories.Range.low": 1,
          "TypeReadingCategories.Range.Delta": -1
        }
      });
    },

    children: [{
      find(typereading) {
        return User.find({
          _id: typereading.CreatedBy
        }, {
          limit: 1
        });
      }

    }]
  };
});
Meteor.publish('typereadings.myReadings', function (userId, refresh) {
  //console.log(userId, this.userId);
  //if(this.userId !== userId && !Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
  if (typeof userId === "undefined") {
    return this.ready();
  }

  console.log("Publication 'typereadings.myReadings': ", this.userId, userId);
  let self = this;
  let user = User.findOne({
    _id: userId
  });

  if (!user) {
    return;
  } //console.log(self, user);


  let observe = {
    added: function (id, fields) {
      self.added('type_readings', id, fields);
    },
    changed: function (id, fields) {
      self.removed("type_readings", id);
    },
    removed: function (id) {
      self.removed('type_readings', id);
    }
  };
  let userType = user.MyProfile.UserType.Personality;
  let handle = TypeReading.find({
    $and: [{
      $or: [{
        $or: [{
          "TypeReadingCategories.0": {
            $type: 10
          }
        }, {
          "TypeReadingCategories.0": {
            $exists: false
          }
        }]
      }, {
        $and: [{
          'TypeReadingCategories.0.Range.low': {
            $lte: userType['IE'].Value
          }
        }, {
          'TypeReadingCategories.0.Range.high': {
            $gte: userType['IE'].Value
          }
        }]
      }]
    }, {
      $or: [{
        $or: [{
          "TypeReadingCategories.1": {
            $type: 10
          }
        }, {
          "TypeReadingCategories.1": {
            $exists: false
          }
        }]
      }, {
        $and: [{
          'TypeReadingCategories.1.Range.low': {
            $lte: userType['NS'].Value
          }
        }, {
          'TypeReadingCategories.1.Range.high': {
            $gte: userType['NS'].Value
          }
        }]
      }]
    }, {
      $or: [{
        $or: [{
          "TypeReadingCategories.2": {
            $type: 10
          }
        }, {
          "TypeReadingCategories.2": {
            $exists: false
          }
        }]
      }, {
        $and: [{
          'TypeReadingCategories.2.Range.low': {
            $lte: userType['TF'].Value
          }
        }, {
          'TypeReadingCategories.2.Range.high': {
            $gte: userType['TF'].Value
          }
        }]
      }]
    }, {
      $or: [{
        $or: [{
          "TypeReadingCategories.3": {
            $type: 10
          }
        }, {
          "TypeReadingCategories.3": {
            $exists: false
          }
        }]
      }, {
        $and: [{
          'TypeReadingCategories.3.Range.low': {
            $lte: userType['JP'].Value
          }
        }, {
          'TypeReadingCategories.3.Range.high': {
            $gte: userType['JP'].Value
          }
        }]
      }]
    }, {
      'Categories.Categories': {
        $elemMatch: {
          $in: user.MyProfile.Categories.Categories
        }
      }
    }, {
      'Enabled': true
    }]
  }, {
    defaults: true,
    sort: {
      'TypeReadingCategories.MyersBriggsCategory': 1,
      'TypeReadingCategories.Range.Delta': -1
    }
  }).observeChanges(observe);
  self.ready();
  self.onStop(function () {
    handle.stop();
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/type_readings/methods.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let TypeReading, ReadingRange, TypeReadingCategory, TypeReadingCategories;
module.watch(require("./type_readings.js"), {
  TypeReading(v) {
    TypeReading = v;
  },

  ReadingRange(v) {
    ReadingRange = v;
  },

  TypeReadingCategory(v) {
    TypeReadingCategory = v;
  },

  TypeReadingCategories(v) {
    TypeReadingCategories = v;
  }

}, 1);
let User, MyersBriggs, Answer, UserType, Profile;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  },

  MyersBriggs(v) {
    MyersBriggs = v;
  },

  Answer(v) {
    Answer = v;
  },

  UserType(v) {
    UserType = v;
  },

  Profile(v) {
    Profile = v;
  }

}, 2);
let MyersBriggsCategory;
module.watch(require("../questions/questions.js"), {
  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 3);
Meteor.methods({
  'typereadings.insert'(header, body) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let newReading = new TypeReading({
      Header: header,
      Body: body,
      CreatedBy: Meteor.userId()
    });
    console.log(header, body, newReading);
    newReading.validate({
      cast: true
    });
    return newReading.save();
  },

  'typereadings.addCategoryToReading'(readingId, category, high, low) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let reading = TypeReading.findOne({
      _id: readingId
    });
    let catReading = new TypeReadingCategory();
    catReading.MyersBriggsCategory = parseInt(category);
    catReading.Range = new ReadingRange();
    catReading.Range.high = parseInt(high);
    catReading.Range.low = parseInt(low);
    console.log(catReading);
    reading.addTypeCategory(catReading);
    reading.save();
  },

  'typereadings.delete'(readingId) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let reading = TypeReading.findOne({
      _id: readingId
    });
    reading.remove();
  },

  'typereadings.toggle'(readingId) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    let reading = TypeReading.findOne({
      _id: readingId
    });
    reading.toggle();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"type_readings.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/type_readings/type_readings.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  TypeReading: () => TypeReading,
  ReadingRange: () => ReadingRange,
  TypeReadingCategory: () => TypeReadingCategory,
  TypeReadingCategories: () => TypeReadingCategories
});
let Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let MyersBriggsCategory;
module.watch(require("../questions/questions.js"), {
  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 3);
let Category, CategoryManager;
module.watch(require("../categories/categories.js"), {
  Category(v) {
    Category = v;
  },

  CategoryManager(v) {
    CategoryManager = v;
  }

}, 4);
const ReadingRange = Class.create({
  name: "ReadingRange",
  fields: {
    high: {
      type: Number,
      default: 50
    },
    low: {
      type: Number,
      default: 0
    },
    Delta: {
      type: Number,
      default: 50
    }
  },
  helpers: {
    in(val) {
      return this.low <= val && val <= this.high;
    },

    setDelta() {
      this.Delta = this.high - this.low;
      return this;
    }

  }
});

ReadingRange.Create = function (high, low) {
  let m = new ReadingRange();
  m.high = high;
  m.low = low;
  return m.setDelta();
};

ReadingRange.FullHigh = function () {
  return ReadingRange.Create(50, 0);
};

ReadingRange.FullLow = function () {
  return ReadingRange.Create(0, -50);
};

const TypeReadingCategory = Class.create({
  name: "TypeReadingCategory",
  fields: {
    MyersBriggsCategory: {
      type: MyersBriggsCategory
    },
    Range: {
      type: ReadingRange,
      default: function () {
        return ReadingRange.FullHigh;
      }
    }
  }
});
const TypeReadingCategories = Class.create({
  name: "TypeReadingCategories",
  fields: {
    0: {
      type: TypeReadingCategory,
      optional: true
    },
    1: {
      type: TypeReadingCategory,
      optional: true
    },
    2: {
      type: TypeReadingCategory,
      optional: true
    },
    3: {
      type: TypeReadingCategory,
      optional: true
    }
  }
});
const TypeReading = Class.create({
  name: "TypeReading",
  collection: new Mongo.Collection('type_readings'),
  fields: {
    TypeReadingCategories: {
      type: TypeReadingCategories,
      default: {}
    },
    Categories: {
      type: CategoryManager,
      default: function () {
        return CategoryManager.OfType("TypeReading");
      }
    },
    Header: {
      type: String,
      default: ""
    },
    Body: {
      type: String,
      default: ""
    },
    CreatedBy: {
      type: String,
      default: function () {
        return Meteor.userId();
      }
    },
    Enabled: {
      type: Boolean,
      default: false
    }
  },
  helpers: {
    toggle() {
      this.Enabled = !this.Enabled;
      this.save();
    },

    addTypeCategory(cat) {
      this.TypeReadingCategories[cat.MyersBriggsCategory] = cat;
    }

  },
  events: {
    beforeSave(e) {
      _.forEach(e.target.TypeReadingCategories, reading => {
        if (reading == null) {
          return;
        }

        reading.Range.setDelta();
      });

      if (e.target.Categories.length() < 1) {
        e.target.Categories.addCategory(Category.Default);
      }
    }

  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_feedback":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_feedback/server/publications.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let UserFeedback;
module.watch(require("../user_feedback.js"), {
  UserFeedback(v) {
    UserFeedback = v;
  }

}, 1);
Meteor.publish('feedback.userComments', function () {
  if (this.userId) {
    return UserFeedback.find({
      userId: Meteor.userId()
    });
  } else {
    return [];
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_feedback/methods.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let UserFeedback;
module.watch(require("./user_feedback.js"), {
  UserFeedback(v) {
    UserFeedback = v;
  }

}, 0);
Meteor.methods({
  'feedback.createNewFeedback'(newFeedback) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(403, "You are not authorized");
    }

    newFeedback.userId = Meteor.userId();
    let f = new UserFeedback(newFeedback);
    return f.save();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_feedback.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_feedback/user_feedback.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserFeedback: () => UserFeedback
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
const UserFeedback = Class.create({
  name: 'UserFeedback',
  collection: new Mongo.Collection('user_feedback'),
  fields: {
    userId: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    },
    context: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      default: ''
    },
    dateCreated: {
      type: Date,
      default: function () {
        return new Date();
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_notify":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_notify/server/publications.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let UserNotify;
module.watch(require("../user_notify.js"), {
  UserNotify(v) {
    UserNotify = v;
  }

}, 1);
Meteor.publish('notificationList', function (userId) {
  if (this.userId == userId) {
    let un = UserNotify.find({
      userId: this.userId
    });
    return un;
  } else {
    return [];
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_notify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_notify/user_notify.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserNotify: () => UserNotify
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
let User;
module.watch(require("../users/users.js"), {
  User(v) {
    User = v;
  }

}, 3);
let Email;
module.watch(require("meteor/email"), {
  Email(v) {
    Email = v;
  }

}, 4);
let UserNotify = Class.create({
  name: "UserNotify",
  collection: new Mongo.Collection('user_notify'),
  fields: {
    userId: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isPushed: {
      type: Boolean,
      default: false
    },
    isEmailed: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    body: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: ''
    },
    createdDate: {
      type: Date,
      default: function () {
        return new Date();
      }
    }
  },
  meteorMethods: {
    markRead() {
      this.isRead = true;
      this.save();
    },

    markNotified() {
      this.isPushed = true;
      this.save();
    }

  },
  helpers: {
    test() {
      console.log("123");
    },

    pushNotify(opts) {
      let noteOpts = {
        body: this.body,
        icon: '/img/panda.png',
        data: this._id
      };
      let browserNote;

      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          browserNote = new Notification(this.title, noteOpts);
        } // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
              // If the user accepts, let's create a notification
              if (permission === "granted") {
                browserNote = new Notification(this.title, noteOpts);
              }
            });
          }

      if (Notification.permission === "granted" && typeof opts.onclick !== 'undefined') {
        browserNote.onclick = opts.onclick;
      }
    }

  },
  events: {
    beforeSave(e) {
      if (Meteor.isServer) {
        let note = e.currentTarget;

        if (!note.isEmailed) {
          let u = User.findOne({
            _id: note.userId
          });

          if (u) {
            let addr = u.emails[0].address;
            Email.send({
              to: addr,
              from: "wayne@paladinarcher.com",
              subject: "Developer Level Notification - " + note.title,
              text: note.body
            });
          }
        }
      }
    }

  }
});

if (Meteor.isClient) {//
}

UserNotify.add = function (opts) {
  let notify = new UserNotify(opts);
  notify.save();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_segments":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_segments/server/publications.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let UserSegment;
module.watch(require("../user_segments.js"), {
  UserSegment(v) {
    UserSegment = v;
  }

}, 1);
Meteor.publish('segmentList', function () {
  //if (Meteor.userId()) {
  return UserSegment.find(); //} else {
  //    this.stop();
  //    return;
  //}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_segments/methods.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let UserSegment;
module.watch(require("./user_segments.js"), {
  UserSegment(v) {
    UserSegment = v;
  }

}, 0);
Meteor.methods({
  'segment.createNewSegment'(name, dscr) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error(403, "You are not authorized");
    } else {
      let s = new UserSegment({
        name: name,
        description: dscr
      });
      return s.save();
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_segments.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_segments/user_segments.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserSegment: () => UserSegment
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  },

  Enum(v) {
    Enum = v;
  }

}, 2);
const UserSegment = Class.create({
  name: 'UserSegment',
  collection: new Mongo.Collection('user_segments'),
  fields: {
    name: {
      type: String,
      default: 'Default user segment'
    },
    description: {
      type: String,
      default: 'The default user segment for relevant content'
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"users":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/users/server/publications.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let User;
module.watch(require("../users.js"), {
  User(v) {
    User = v;
  }

}, 1);
Meteor.publish('userData', function () {
  if (this.userId) {
    return User.find({
      _id: this.userId
    }, {
      fields: {
        roles: 1,
        MyProfile: 1
      }
    });
  } else {
    return this.ready();
  }
});
Meteor.publish('userList', function () {
  if (Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) {
    return User.find({});
  } else {
    return User.find({}, {
      fields: {
        roles: 1,
        username: 1,
        MyProfile: 1
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/users/methods.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({
  'user.sendVerificationEmail'() {
    let userId = Meteor.userId();

    if (userId) {
      Accounts.emailTemplates.siteName = "DeveloperLevel";
      Accounts.emailTemplates.from = "DeveloperLevel <wayne@paladinarcher.com>";
      Accounts.emailTemplates.verifyEmail = {
        subject() {
          return "[DeveloperLevel] Verify your email address";
        },

        text(user, url) {
          let emailAddress = user.emails[0].address,
              urlWithoutHash = url.replace('#/', ''),
              supportEmail = "support@developerlevel.com",
              emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;
          return emailBody;
        }

      };
      return Accounts.sendVerificationEmail(userId);
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/users/users.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  User: () => User,
  Profile: () => Profile,
  UserType: () => UserType,
  MyersBriggs: () => MyersBriggs,
  Answer: () => Answer
});
let Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
let MyersBriggsCategory, Question;
module.watch(require("../questions/questions.js"), {
  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  },

  Question(v) {
    Question = v;
  }

}, 2);
let Category, CategoryManager;
module.watch(require("../categories/categories.js"), {
  Category(v) {
    Category = v;
  },

  CategoryManager(v) {
    CategoryManager = v;
  }

}, 3);
let Defaults;
module.watch(require("../../startup/both/defaults.js"), {
  Defaults(v) {
    Defaults = v;
  }

}, 4);
let Team;
module.watch(require("../teams/teams.js"), {
  Team(v) {
    Team = v;
  }

}, 5);
let UserSegment;
module.watch(require("../user_segments/user_segments.js"), {
  UserSegment(v) {
    UserSegment = v;
  }

}, 6);
const MyersBriggsBit = Class.create({
  name: 'MyersBriggsBit',
  fields: {
    Value: {
      type: Number,
      default: 0
    },
    Totals: {
      type: Number,
      default: 0
    },
    QuestionCount: {
      type: Number,
      default: 0
    }
  },
  helpers: {
    addValue(value) {
      this.Totals += value;
      this.QuestionCount++;
      this.Value = this.QuestionCount == 0 ? 0 : this.Totals / this.QuestionCount;
    },

    removeValue(value) {
      this.QuestionCount--;

      if (this.QuestionCount < 0) {
        this.QuestionCount = 0;
      }

      if (this.QuestionCount == 0) {
        this.Totals = this.Value = 0;
        return;
      }

      this.Totals -= value;
      this.Value = this.Totals / this.QuestionCount;
    },

    reset() {
      this.Totals = 0;
      this.QuestionCount = 0;
      this.Value = 0;
    }

  }
});
const MyersBriggs = Class.create({
  name: 'MyersBriggs',
  fields: {
    IE: {
      type: MyersBriggsBit,
      default: function () {
        return new MyersBriggsBit();
      }
    },
    NS: {
      type: MyersBriggsBit,
      default: function () {
        return new MyersBriggsBit();
      }
    },
    TF: {
      type: MyersBriggsBit,
      default: function () {
        return new MyersBriggsBit();
      }
    },
    JP: {
      type: MyersBriggsBit,
      default: function () {
        return new MyersBriggsBit();
      }
    }
  },
  helpers: {
    addByCategory(category, value) {
      console.log(category, value);
      let name = this.getIdentifierById(category);
      this[name].addValue(value);
    },

    removeByCategory(category, value) {
      let name = this.getIdentifierById(category);
      this[name].removeValue(value);
    },

    getIdentifierById(categoryId) {
      if (categoryId === 0) {
        return 'IE';
      }

      if (categoryId === 1) {
        return 'NS';
      }

      if (categoryId === 2) {
        return 'TF';
      }

      return 'JP';
    },

    getFourLetter() {
      let IEL = this.IE.Value === 0 ? '_' : this.IE.Value < 0 ? 'I' : 'E';
      let NSL = this.NS.Value === 0 ? '_' : this.NS.Value < 0 ? 'N' : 'S';
      let TFL = this.TF.Value === 0 ? '_' : this.TF.Value < 0 ? 'T' : 'F';
      let JPL = this.JP.Value === 0 ? '_' : this.JP.Value < 0 ? 'J' : 'P';
      return `${IEL}${NSL}${TFL}${JPL}`;
    },

    reset() {
      for (let i = 0; i < 4; i++) {
        this[this.getIdentifierById(i)].reset();
      }
    }

  }
});
const Answer = Class.create({
  name: 'Answer',
  fields: {
    Category: {
      type: MyersBriggsCategory,
      default: 0
    },
    Categories: {
      type: [MyersBriggsCategory],
      default: []
    },
    QuestionID: {
      type: String,
      default: ''
    },
    Reversed: {
      type: Boolean,
      default: false
    },
    Value: {
      type: Number,
      default: 0
    },
    AnsweredAt: {
      type: Date,
      default: function () {
        return new Date();
      }
    }
  },
  helpers: {
    getQuestion() {
      let q = Question.findOne({
        _id: this.QuestionID
      });
      return q;
    },

    unanswer() {
      this.getQuestion().removeAnswer(this);
    }

  }
});
const UserType = Class.create({
  name: 'UserType',
  fields: {
    Personality: {
      type: MyersBriggs,
      default: function () {
        return new MyersBriggs();
      }
    },
    AnsweredQuestions: {
      type: [Answer],
      default: function () {
        return [];
      }
    },
    TotalQuestions: {
      type: Number,
      default: 0
    }
  },
  helpers: {
    getAnsweredQuestionsIDs() {
      let qids = [];

      _.each(this.AnsweredQuestions, function (ans) {
        qids.push(ans.QuestionID);
      });

      return qids;
    },

    setTotalQuestions(totalQuestions) {
      //console.log("user.js totalQuestions", totalQuestions);
      this.TotalQuestions = totalQuestions; //console.log("user.js totalQuestions2", this.TotalQuestions);
    },

    getTotalQuestions() {
      return this.TotalQuestions;
    },

    answerQuestion(answer) {
      this.AnsweredQuestions.push(answer);
      console.log(this.AnsweredQuestions);
      console.log(answer.Categories);
      let contextThis = this;

      _.each(answer.Categories, function (cat) {
        contextThis.Personality.addByCategory(cat, answer.Value);
      }); //this.Personality.addByCategory(answer.Category, answer.Value);

    },

    unAnswerQuestion(answer, skipSlice) {
      let index = this.getAnswerIndexForQuestionID(answer.QuestionID);
      let before = this.AnsweredQuestions.length;

      if (index < 0) {
        return;
      }

      console.log(index);

      if (!skipSlice) {
        if (index == 0) {
          this.AnsweredQuestions.shift();
        } else if (index == this.AnsweredQuestions.length - 1) {
          this.AnsweredQuestions.pop();
        } else {
          this.AnsweredQuestions = this.AnsweredQuestions.slice(0, index).concat(this.AnsweredQuestions.slice(index + 1));
        }
      }

      answer.unanswer();

      _.each(answer.Categories, function (cat) {
        this.Personality.removeByCategory(cat, answer.Value);
      }); //this.Personality.removeByCategory(answer.Category, answer.Value);


      console.log("User Answer Count: " + before + " => " + this.AnsweredQuestions.length);
    },

    getAnswerIndexForQuestionID(questionId) {
      for (let i = 0; i < this.AnsweredQuestions.length; i++) {
        if (this.AnsweredQuestions[i].QuestionID == questionId) {
          return i;
        }
      }

      return -1;
    },

    getAnswerForQuestion(questionId) {
      return _.find(this.AnsweredQuestions, function (ans, i) {
        return ans.QuestionID == questionId;
      });
    },

    reset() {
      let self = this;

      _.each(this.AnsweredQuestions, function (ans) {
        self.unAnswerQuestion(ans, true);
      });

      this.Personality.reset();
      this.AnsweredQuestions = [];
    }

  }
});
const DashboardPane = Class.create({
  name: 'DashboardPane',
  fields: {
    size: {
      type: Number,
      default: 4
    },
    name: {
      type: String,
      default: 'App_home'
    },
    title: {
      type: String,
      default: 'Personality Questions'
    },
    route: {
      type: String,
      default: '/'
    }
  }
});
const Profile = Class.create({
  name: 'Profile',
  fields: {
    firstName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2
      }]
    },
    lastName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2
      }]
    },
    UserType: {
      type: UserType,
      default: function () {
        return new UserType();
      }
    },
    gender: {
      type: Boolean,
      default: false
    },
    birthDate: {
      type: Date,
      optional: true
    },
    Categories: {
      type: CategoryManager,
      default: function () {
        return CategoryManager.OfType("User");
      }
    },
    dashboardPanes: {
      type: [DashboardPane],
      default: []
    },
    segments: {
      type: [String],
      default: []
    }
  },
  helpers: {
    calculateAge() {
      if (this.birthDate) {
        const diff = Date.now() - this.birthDate.getTime();
        this.age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
      }
    },

    fullName(param) {
      var fullName = this.firstName + ' ' + this.lastName;

      if (param === 'lower') {
        return fullName.toLowerCase();
      } else if (param === 'upper') {
        return fullName.toUpperCase();
      }

      return fullName;
    }

  }
});
const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    emails: {
      type: [Object],
      default: function () {
        return [];
      }
    },
    MyProfile: {
      type: Profile,
      default: function () {
        return new Profile();
      }
    },
    teams: {
      type: [String],
      default: function () {
        return [Team.Default.Name];
      }
    },
    roles: {
      type: Object
    }
  },

  resolveError({
    nestedName,
    validator
  }) {
    console.log(nestedName, validator);
  },

  events: {
    afterInit(e) {
      e.target.MyProfile.calculateAge();
    },

    beforeSave(e) {
      if (e.currentTarget.MyProfile.Categories.length() === 0) {
        e.currentTarget.MyProfile.Categories.addCategory(Category.Default);
      }

      if (e.currentTarget.teams.length === 0) {
        e.currentTarget.addTeam(Team.Default.Name);
      }
    }

  },
  meteorMethods: {
    create() {
      return this.save();
    },

    changeName(firstName, lastName) {
      check(firstName, String);
      check(lastName, String);
      this.MyProfile.firstName = firstName;
      this.MyProfile.lastName = lastName;
      return this.save();
    },

    fullName(param) {
      return this.MyProfile.fullName(param);
    },

    addTeam(teamName) {
      let teamDoc = Team.findOne({
        "Name": teamName
      });

      if (typeof teamDoc !== "undefined") {
        teamDoc.addUsers(this._id);
      } else {
        return false;
      }
    },

    profileUpdate(uprofile) {
      check(uprofile.firstName, String);
      check(uprofile.lastName, String);
      check(uprofile.gender, Boolean);
      this.MyProfile.firstName = uprofile.firstName;
      this.MyProfile.lastName = uprofile.lastName;
      this.MyProfile.gender = uprofile.gender;
      this.MyProfile.segments = uprofile.segments;

      if ("" !== uprofile.birthDate) {
        this.MyProfile.birthDate = new Date(uprofile.birthDate);
      }

      return this.save();
    }

  },
  indexes: {},
  behaviors: {
    slug: {
      fieldName: 'email'
    },
    timestamp: {}
  }
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: Object
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"categories":{"categories.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/categories/categories.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Category: () => Category,
  CategoryManager: () => CategoryManager
});
let Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    Class = v;
  }

}, 0);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 1);
const DefaultCategoryID = "xhKdwhacaWTcBTGPn";
const TypeStats = Class.create({
  name: 'TypeStats',
  fields: {
    num: {
      type: Number,
      default: 0
    }
  }
});
const Category = Class.create({
  name: 'Category',
  collection: new Mongo.Collection('categories'),
  fields: {
    name: {
      type: String,
      default: "the Unnamed Category"
    },
    description: {
      type: String,
      default: "this is the default stuff for a Category"
    },
    stats: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  helpers: {
    addByType(type) {
      if (!this.getStatsByType(type)) {
        this.stats[type] = new TypeStats();
      }

      this.getStatsByType(type).num++;
      this.save();
    },

    removeByType(type) {
      if (!this.getStatsByType(type)) {
        return false;
      }

      this.getStatsByType(type).num--;
      this.save();
    },

    getStatsByType(type) {
      return this.stats[type];
    }

  },
  meteorMethods: {
    update(name, dscr) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
        this.name = name;
        this.description = dscr;
        console.log(this.save());
      }
    }

  }
});
Category.Default = Category.findOne({
  _id: DefaultCategoryID
});

if (typeof Category.Default === "undefined") {
  Category.Default = new Category({
    _id: DefaultCategoryID
  });

  if (Meteor.isServer) {
    Category.Default.save();
  }
}

const CategoryManager = Class.create({
  name: 'CategoryManager',
  fields: {
    Categories: {
      type: [String],
      default: function () {
        return [];
      }
    },
    Type: {
      type: String,
      default: "um... what!?"
    }
  },
  helpers: {
    length() {
      return this.Categories.length;
    },

    areIntersected(categoryManager) {
      for (let i = 0; i < this.Categories.length; i++) {
        for (let j = 0; j < categoryManager.Categories.length; i++) {
          if (this.Categories[i] == categoryManager.Categories[j]) {
            return true;
          }
        }
      }

      return false;
    },

    addCategory(category, type) {
      if (!type) {
        type = this.Type;
      }

      this.Categories.push(category._id);
      category.addByType(type);
    },

    hasCategory(category) {
      if (this.Categories.length == 0) {
        this.addCategory(Category.Default, this.Type);
      }

      return _.find(this.Categories, function (catId) {
        return category._id == catId;
      });
    },

    removeCategory(category, type, skipSlice) {
      let index = -1;

      _.each(this.Categories, function (catId, i) {
        if (catId == category._id) {
          index = i;
        }
      });

      if (index < 0) {
        return false;
      }

      if (!skipSlice) {
        if (index == 0) {
          this.Categories.shift();
        } else if (index == this.Categories.length - 1) {
          this.Categories.pop();
        } else {
          this.Categories = this.Categories.slice(0, index).concat(this.Categories.slice(index + 1));
        }
      }

      category.removeByType(type);
    }

  }
});

CategoryManager.OfType = function (type) {
  let c = new CategoryManager();
  c.Type = type;
  return c;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"both":{"at_config.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/at_config.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let User;
module.watch(require("/imports/api/users/users.js"), {
  User(v) {
    User = v;
  }

}, 0);
let Team;
module.watch(require("/imports/api/teams/teams.js"), {
  Team(v) {
    Team = v;
  }

}, 1);
let Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults(v) {
    Defaults = v;
  }

}, 2);

const myPostLogout = function () {
  //example redirect after logout
  FlowRouter.go('/signin');
};

const mySubmitFunc = function (error, state) {
  if (!error) {
    if (state === "signIn") {// Successfully logged in
      // ...
    }

    if (state === "signUp") {// Successfully registered
      // ...
    }
  }
};

function myPreSubmitFunc() {
  console.log("Pre:  ", arguments);
}

function myPostSubmitFunc(userId, info) {
  Accounts.emailTemplates.siteName = "DeveloperLevel";
  Accounts.emailTemplates.from = "DeveloperLevel <wayne@paladinarcher.com>";
  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "[DeveloperLevel] Verify your email address";
    },

    text(user, url) {
      let emailAddress = user.emails[0].address,
          urlWithoutHash = url.replace('#/', ''),
          supportEmail = "support@developerlevel.com",
          emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;
      return emailBody;
    }

  };
  Accounts.sendVerificationEmail(userId);
  console.log("Post: ", arguments);
}

AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  lowercaseUsername: false,
  focusFirstInput: true,
  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,
  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,
  // Privacy Policy and Terms of Use
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',
  // Redirects
  homeRoutePath: '/',
  redirectTimeout: 4000,
  // Routing
  defaultTemplate: 'Auth_page',
  defaultLayout: 'App_body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  // Hooks
  onLogoutHook: myPostLogout,
  onSubmitHook: mySubmitFunc,
  preSignUpHook: myPreSubmitFunc,
  postSignUpHook: myPostSubmitFunc,
  // Texts
  texts: {
    button: {
      signUp: "Register Now!"
    },
    socialSignUp: "Register",
    socialIcons: {
      "meteor-developer": "fa fa-rocket"
    },
    title: {
      forgotPwd: "Recover Your Password"
    },
    inputIcons: {
      isValidating: "fa fa-spinner fa-spin",
      hasSuccess: "fa fa-check",
      hasError: "fa fa-times"
    }
  }
}); // Define these routes in a file loaded on both client and server

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin'
});
AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join'
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});
AccountsTemplates.addFields([{
  _id: "first_name",
  type: "text",
  required: true,
  displayName: "First Name",
  func: function (value) {
    //if(Meteor.isClient) {
    console.log("Firstname validation: ", value); //}

    return false;
  }
}, {
  _id: "last_name",
  type: "text",
  required: true,
  displayName: "Last Name",
  func: function (value) {
    //if(Meteor.isClient) {
    console.log("Lastname validation: ", value); //}

    return false;
  }
}, {
  _id: "gender",
  type: "select",
  required: true,
  displayName: "Gender",
  select: [{
    text: "Male",
    value: "male"
  }, {
    text: "Female",
    value: "female"
  }]
}]);

if (Meteor.isServer) {
  Accounts.onCreateUser((options, user) => {
    user.slug = options.email;
    user.updateAt = user.createdAt;
    user.MyProfile = {
      firstName: options.profile.first_name,
      lastName: options.profile.last_name,
      gender: options.profile.gender === "female",
      UserType: {
        Personality: {
          IE: {},
          NS: {},
          TF: {},
          JP: {}
        },
        AnsweredQuestions: []
      },
      birthDate: undefined,
      age: undefined
    };
    user.teams = [Team.Default.Name];
    user.roles = {};
    user.profile = options.profile;

    if (options.isAdmin && options.username === 'admin') {
      user.roles[Roles.GLOBAL_GROUP] = ['admin'];
      Roles.addUsersToRoles(user._id, 'admin', Roles.GLOBAL_GROUP);
    } else {
      let t = Team.findOne({
        Name: Team.Default.Name
      });
      user.roles[Team.Default.Name] = ['member', Defaults.role.name];
      t.addUsers(user._id);
    }

    return user;
  });
  Accounts.validateNewUser(function (user) {
    var loggedInUser;

    try {
      loggedInUser = Meteor.user();
    } catch (ex) {
      console.log(ex);
    }

    if (!loggedInUser || Roles.userIsInRole(loggedInUser, ['admin', 'manage-users'], Roles.GLOBAL_GROUP)) {
      // NOTE: This example assumes the user is not using groups.
      return true;
    }

    throw new Meteor.Error(403, "Not authorized to create new users");
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/defaults.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Defaults: () => Defaults
});
const Defaults = {
  'user': {
    'username': 'admin',
    'email': 'admin@mydomain.com',
    'isAdmin': true,
    'profile': {
      'first_name': 'Admin',
      'last_name': 'Admin',
      'gender': 'female'
    }
  },
  'team': {
    'Name': "No Team",
    'Public': true,
    'Members': [],
    'Active': true
  },
  'role': {
    'name': 'No-Permissions'
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/index.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./at_config.js"));

// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
if (Meteor.isClient) {
  Session.setDefault('refreshQuestions', Math.random());
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"defaults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/defaults.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  SrvDefaults: () => SrvDefaults
});
const SrvDefaults = {
  'user': {
    'password': 'admin'
  },
  'uploadPath': '/uploads/'
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fixtures.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/fixtures.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Question, MyersBriggsCategory;
module.watch(require("../../api/questions/questions.js"), {
  Question(v) {
    Question = v;
  },

  MyersBriggsCategory(v) {
    MyersBriggsCategory = v;
  }

}, 1);
let User;
module.watch(require("../../api/users/users.js"), {
  User(v) {
    User = v;
  }

}, 2);
let Team;
module.watch(require("../../api/teams/teams.js"), {
  Team(v) {
    Team = v;
  }

}, 3);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 4);
let Defaults;
module.watch(require("../both/defaults.js"), {
  Defaults(v) {
    Defaults = v;
  }

}, 5);
let SrvDefaults;
module.watch(require("./defaults.js"), {
  SrvDefaults(v) {
    SrvDefaults = v;
  }

}, 6);
let TypeReading, ReadingRange, TypeReadingCategory;
module.watch(require("../../api/type_readings/type_readings.js"), {
  TypeReading(v) {
    TypeReading = v;
  },

  ReadingRange(v) {
    ReadingRange = v;
  },

  TypeReadingCategory(v) {
    TypeReadingCategory = v;
  }

}, 7);
Meteor.startup(() => {
  var defaultUserId;

  if (Meteor.users.find().count() < 1) {
    defaultUserId = Accounts.createUser({
      username: Defaults.user.username,
      email: Defaults.user.email,
      password: SrvDefaults.user.password,
      isAdmin: Defaults.user.isAdmin,
      profile: Defaults.user.profile,
      teams: [Team.Default.Name]
    });
    let t = Team.findOne({
      Name: Team.Default.Name
    });
    t.CreatedBy = userId;
    t.save();
  } //add all existing members to the default team


  let teamUserIdList = [];
  User.find({}).forEach(u => {
    teamUserIdList.push(u._id);
    Roles.addUsersToRoles(u._id, 'member', Team.Default.Name);

    if (Roles.userIsInRole(u._id, 'admin', Roles.GLOBAL_GROUP)) {
      Roles.addUsersToRoles(u._id, 'admin', Team.Default.Name);
    } else {
      Roles.addUsersToRoles(u._id, Defaults.role.name, Team.Default.Name);
    }
  }); //Team.Default.Members = Team.Default.Members.concat(teamUserIdList);

  Team.Default.Members = teamUserIdList;
  Team.Default.save();
  let existingRoleNames = [];
  Roles.getAllRoles().forEach(function (r) {
    existingRoleNames.push(r.name);
  });
  let possibleRoles = ["admin", "view-goals", "view-members", "member", "mentor", "assigned", "manage-users", "learn-share-host", "developer"];

  for (let i in possibleRoles) {
    if (existingRoleNames.indexOf(possibleRoles[i]) === -1) {
      Roles.createRole(possibleRoles[i]);
    }
  } // Adding this so that it will auto fix type readings inserted the wrong way. We can remove this once no one has them.


  const RawReadings = TypeReading.getCollection();
  var wrongReadings = RawReadings.find({
    "MyersBriggsCategory": {
      $exists: true
    }
  });
  wrongReadings.forEach(reading => {
    var newType = new TypeReadingCategory({
      MyersBriggsCategory: reading.MyersBriggsCategory,
      Range: reading.Range
    });
    delete reading.MyersBriggsCategory;
    delete reading.Range;
    delete reading.TypeReadingCategories;
    RawReadings.update({
      _id: reading._id
    }, {
      $unset: {
        MyersBriggsCategory: "",
        Range: ""
      }
    });
    var newReading = new TypeReading(reading);
    newReading._isNew = false;
    newReading.addTypeCategory(newType);
    console.log(newReading);
    newReading.getModified();
    newReading.save();
  }); //convert questions with single category to array of categories

  let qs = Question.find({
    Categories: {
      $exists: false
    }
  });

  if (qs) {
    qs.forEach(function (q) {
      q.Categories = [q.Category];
      q.save();
    });
  }

  var fs = Npm.require('fs');

  var uploadPath = SrvDefaults.uploadPath;

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
  } catch (e) {
    console.log(e);
  }

  WebApp.connectHandlers.use('/learnShareRecording', (req, res, next) => {
    let fileName = req.url.split('/')[1];

    if (fs.existsSync(uploadPath + fileName)) {
      res.writeHead(200, {
        'Content-Type': 'video/mp4'
      });
      fs.readFile(uploadPath + fileName, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.write(data);
          res.end();
        }
      });
    } else {
      console.log("file does not exist");
      res.writeHead(404);
      res.write('404 not found');
      res.end();
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/index.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("../both/defaults.js"));
module.watch(require("./defaults.js"));
module.watch(require("./fixtures.js"));
module.watch(require("./register-api.js"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/register-api.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("../../api/questions/methods.js"));
module.watch(require("../../api/questions/server/publications.js"));
module.watch(require("../../api/users/methods.js"));
module.watch(require("../../api/users/server/publications.js"));
module.watch(require("../../api/type_readings/methods.js"));
module.watch(require("../../api/type_readings/server/publications.js"));
module.watch(require("../../api/teams/methods.js"));
module.watch(require("../../api/teams/server/publications.js"));
module.watch(require("../../api/team_goals/server/publications.js"));
module.watch(require("../../api/team_goals/methods.js"));
module.watch(require("../../api/individual_goals/server/publications.js"));
module.watch(require("../../api/individual_goals/methods.js"));
module.watch(require("../../api/learn_share/server/publications.js"));
module.watch(require("../../api/learn_share/methods.js"));
module.watch(require("../../api/roles/server/publications.js"));
module.watch(require("../../api/user_segments/server/publications.js"));
module.watch(require("../../api/user_segments/methods.js"));
module.watch(require("../../api/user_feedback/server/publications.js"));
module.watch(require("../../api/user_feedback/methods.js"));
module.watch(require("../../api/user_notify/server/publications.js"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("/imports/startup/both"));
module.watch(require("/imports/startup/server"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvaW5kaXZpZHVhbF9nb2Fscy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9pbmRpdmlkdWFsX2dvYWxzL2luZGl2aWR1YWxfZ29hbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2luZGl2aWR1YWxfZ29hbHMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGVhcm5fc2hhcmUvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGVhcm5fc2hhcmUvbGVhcm5fc2hhcmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xlYXJuX3NoYXJlL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3F1ZXN0aW9ucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9xdWVzdGlvbnMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcXVlc3Rpb25zL3F1ZXN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcm9sZXMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGVhbV9nb2Fscy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS90ZWFtX2dvYWxzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3RlYW1fZ29hbHMvdGVhbV9nb2Fscy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGVhbXMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGVhbXMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGVhbXMvdGVhbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3R5cGVfcmVhZGluZ3Mvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdHlwZV9yZWFkaW5ncy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS90eXBlX3JlYWRpbmdzL3R5cGVfcmVhZGluZ3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXJfZmVlZGJhY2svc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdXNlcl9mZWVkYmFjay9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2VyX2ZlZWRiYWNrL3VzZXJfZmVlZGJhY2suanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXJfbm90aWZ5L3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXJfbm90aWZ5L3VzZXJfbm90aWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2VyX3NlZ21lbnRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXJfc2VnbWVudHMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdXNlcl9zZWdtZW50cy91c2VyX3NlZ21lbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2Vycy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2Vycy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2Vycy91c2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvY2F0ZWdvcmllcy9jYXRlZ29yaWVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvYm90aC9hdF9jb25maWcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9ib3RoL2RlZmF1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvYm90aC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9maXh0dXJlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJJbmRpdmlkdWFsR29hbCIsIlVzZXIiLCJwdWJsaXNoIiwidXNlcklkIiwiZmluZCIsIlJvbGVzIiwidXNlcklzSW5Sb2xlIiwiR0xPQkFMX0dST1VQIiwicHJpdmFjeSIsInN0b3AiLCJleHBvcnQiLCJNb25nbyIsIkNsYXNzIiwiRW51bSIsIlVzZXJOb3RpZnkiLCJHb2FsQ29tbWVudCIsImNyZWF0ZSIsIm5hbWUiLCJjb2xsZWN0aW9uIiwiQ29sbGVjdGlvbiIsImZpZWxkcyIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsInBhcmVudElkIiwiYXNzaWduZWRUb1N0ciIsInRyYW5zaWVudCIsInJlYWNoZWREYXRlIiwiRGF0ZSIsIm9wdGlvbmFsIiwic3RhcnREYXRlIiwiZHVlRGF0ZSIsInJldmlld0RhdGUiLCJyZXZpZXdlZE9uRGF0ZSIsImdvYWxDb21tZW50cyIsInJldmlld0NvbW1lbnRzIiwidGVhbUlkIiwiY3JlYXRlZEJ5IiwiYmVoYXZpb3JzIiwidGltZXN0YW1wIiwiaGVscGVycyIsImdldEdvYWxSb2xlR3JvdXAiLCJ0ZWFtTmFtZSIsIl9pZCIsInVzZXJJc0FkbWluIiwidXNlcklzTWVudG9yIiwidXNlcklzQXNzaWduZWQiLCJzZXREYXRlRmllbGQiLCJmaWVsZE5hbWUiLCJyZGF0ZSIsImdldFVzZXJGdWxsTmFtZVgiLCJ1IiwiZmluZE9uZSIsIk15UHJvZmlsZSIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiaGFzTW9kaWZ5UGVybSIsIm5vdGlmeU5ldyIsIm9sZExpc3QiLCJuZXdMaXN0IiwiZGlmZkxpc3QiLCJfIiwiZGlmZmVyZW5jZSIsImkiLCJsZW5ndGgiLCJhZGQiLCJib2R5IiwiYWN0aW9uIiwiZXZlbnRzIiwiYmVmb3JlU2F2ZSIsImUiLCJtZXRlb3JNZXRob2RzIiwic2V0RHVlRGF0ZSIsIkVycm9yIiwic2F2ZSIsInNldEdvYWxSZWFjaGVkIiwic2V0UmV2aWV3RGF0ZSIsInNldEdvYWxSZXZpZXdlZE9uIiwiYWRkQ29tbWVudCIsImNvbW1lbnRUeHQiLCJwdXNoIiwiZGF0ZSIsInRleHQiLCJhZGRSZXZpZXdDb21tZW50IiwiY3JlYXRlTmV3R29hbCIsInNldFRpdGxlIiwic2V0RGVzY3JpcHRpb24iLCJkZXNjciIsInNldEFzc2lnbmVkVG8iLCJ1bGlzdCIsImFzc2lnbmVkVG8iLCJzZXRNZW50b3JzIiwibWVudG9ycyIsInNldEFkbWlucyIsImFkbWlucyIsImdldFVzZXJGdWxsTmFtZSIsImludm9jYXRpb24iLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJnZXQiLCJpc1NpbXVsYXRpb24iLCJ1cGRhdGVGcm9tT2JqIiwidXBkT2JqIiwicGVybUVycm9yIiwiZmxkIiwiQXJyYXkiLCJpc0FycmF5IiwiaXNFcXVhbCIsIm1ldGhvZHMiLCJnb2FsIiwiZyIsIkxlYXJuU2hhcmVTZXNzaW9uIiwibHNzaWQiLCJmcyIsImlzU2VydmVyIiwiTnBtIiwiTFNVc2VyIiwiaWQiLCJub3RlcyIsInBhcnRpY2lwYW50cyIsImd1ZXN0cyIsInByZXNlbnRlcnMiLCJzdGF0ZSIsInNreXBlVXJsIiwiYWRkUHJlc2VudGVyIiwidXNlciIsImxzVXNlciIsIm8iLCJhZGRQYXJ0aWNpcGFudCIsInJlbW92ZVBhcnRpY2lwYW50IiwiZmlsdGVyIiwicmVtb3ZlR3Vlc3QiLCJyZW1vdmVQcmVzZW50ZXIiLCJhZGRQYXJ0aWNpcGFudFNlbGYiLCJsc3UiLCJzYXZlR3Vlc3QiLCJndWVzdElkIiwiZ3Vlc3ROYW1lIiwiZ3Vlc3RPYmoiLCJjb25zb2xlIiwibG9nIiwic2F2ZVRleHQiLCJsb2NrU2Vzc2lvbiIsInVubG9ja1Nlc3Npb24iLCJzZXRTa3lwZVVybCIsInVybCIsInVwbG9hZFJlY29yZGluZyIsImZpbGVJbmZvIiwiZmlsZURhdGEiLCJ1cGxvYWRQYXRoIiwid3JpdGVGaWxlIiwiZXJyIiwiZm9ybWF0dGVkRGF0ZSIsImQiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF0ZSIsInNsaWNlIiwicmFuZG9tQ2hhcnMiLCJpZExlbmd0aCIsInBvc3NpYmxlIiwiY2hhckF0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibHNzaWRHZW5lcmF0ZSIsInNlc3NUaXRsZSIsIm5ld1Nlc3Npb24iLCJmbmFtZSIsImV4aXN0c1N5bmMiLCJRdWVzdGlvbiIsIlJlYWRpbmciLCJNeWVyc0JyaWdnc0NhdGVnb3J5IiwiTXllcnNCcmlnZ3MiLCJBbnN3ZXIiLCJVc2VyVHlwZSIsIlByb2ZpbGUiLCJwdWJsaXNoQ29tcG9zaXRlIiwiY2F0ZWdvcnkiLCJyZWFkeSIsIkNhdGVnb3JpZXMiLCJkZWZhdWx0cyIsInNvcnQiLCJjcmVhdGVkQXQiLCJjaGlsZHJlbiIsInF1ZXN0aW9uIiwiQ3JlYXRlZEJ5IiwibGltaXQiLCJyZWZyZXNoIiwic2VsZiIsInFpZHMiLCJnZXRBbnN3ZXJlZFF1ZXN0aW9uc0lEcyIsIm9ic2VydmUiLCJhZGRlZCIsImNoYW5nZWQiLCJyZW1vdmVkIiwiaWRzIiwiYSIsImIiLCJhciIsImJyIiwiaGFuZGxlcyIsIiRuaW4iLCJBY3RpdmUiLCJvYnNlcnZlQ2hhbmdlcyIsIm9uU3RvcCIsImNoZWNrIiwibGVmdCIsInJpZ2h0Iiwic2VnIiwibmV3UXVlc3Rpb24iLCJDYXRlZ29yeSIsInBhcnNlSW50IiwibWFwIiwiVGV4dCIsIkxlZnRUZXh0IiwiUmlnaHRUZXh0Iiwic2VnbWVudHMiLCJ2YWxpZGF0ZSIsImNhc3QiLCJxdWVzdGlvbklkIiwidmFsdWUiLCJpc1JldmVyc2VkIiwibWUiLCJwYXJzZUZsb2F0IiwiYW5zd2VyIiwiUXVlc3Rpb25JRCIsIlJldmVyc2VkIiwiVmFsdWUiLCJhZGRBbnN3ZXIiLCJhbnN3ZXJRdWVzdGlvbiIsImdldEFuc3dlckZvclF1ZXN0aW9uIiwidW5BbnN3ZXJRdWVzdGlvbiIsInF1ZXN0aW9uSWRzIiwicXVlc3Rpb25zIiwiJGluIiwiZm9yRWFjaCIsInVuYW5zd2VyQWxsIiwicmVtb3ZlIiwidXNlcklkcyIsInVzIiwicmVzZXQiLCJxcyIsInEiLCJteVVzZXJJZCIsInRvdGFsUXVlc3Rpb25zIiwiY291bnQiLCJzZXRUb3RhbFF1ZXN0aW9ucyIsIkRlZmF1bHRzIiwiaWRlbnRpZmllcnMiLCJSYW5rIiwiTnVtYmVyIiwidmFsaWRhdG9ycyIsInJlc29sdmVQYXJhbSIsIlBvbGFyU3RhdHMiLCJMZWZ0U3VtIiwiUmlnaHRTdW0iLCJSZWFkaW5ncyIsIkJvb2xlYW4iLCJUaW1lc0Fuc3dlcmVkIiwiU3VtT2ZBbnN3ZXJzIiwiZ2V0VXNlciIsInJlbW92ZUFuc3dlciIsImFsbEFuc3dlcmVkVXNlcnMiLCIkZXEiLCJub1NhdmUiLCJBbnN3ZXJlZFF1ZXN0aW9ucyIsInNvZnRyZW1vdmUiLCJzZWN1cmVkIiwidXBkYXRlIiwiYmVmb3JlSW5zZXJ0IiwidXNlcm5hbWUiLCJjdXJyZW50VGFyZ2V0IiwiYmVmb3JlVXBkYXRlIiwiYWxsb3dlZCIsImRvYyIsImZpZWxkTmFtZXMiLCJnZXRNb2RpZmllZCIsImVhY2giLCJpbmRleE9mIiwicm9sZXMiLCJUZWFtR29hbCIsInRlYW1Hb2FsIiwidXNlckxpc3QiLCJjb25jYXQiLCJmaWVsZHNPYmoiLCJtZW50b3JzU3RyIiwiYWRtaW5zU3RyIiwiZWdvYWwiLCJmbGRzIiwiYWRkVXNlcnNUb1JvbGVzIiwiVGVhbSIsIiRvciIsIlB1YmxpYyIsIk1lbWJlcnMiLCJOYW1lIiwiRGVzY3JpcHRpb24iLCJJY29uIiwiSWNvbjY0IiwiSWNvblR5cGUiLCJ0ZWFtc0xpc3QiLCJ0ZWFtIiwibWVtYmVyTGlzdCIsInJlcVF1ZXJ5IiwibmV3VGVhbSIsInQiLCJUZWFtSWNvbiIsIkRlZmF1bHRUZWFtSUQiLCJkYXRhIiwiY29udGVudFR5cGUiLCJkZWZhdXQiLCJpbmRleGVzIiwibmFtZUluZGV4Iiwib3B0aW9ucyIsInVuaXF1ZSIsInVzZXJSZXF1ZXN0Sm9pbiIsImFkbWluUmVxdWVzdFVzZXJKb2luIiwic3BsaXQiLCJqb2luIiwidXNlckFjY2VwdEpvaW4iLCJyZW1vdmVVc2Vyc0Zyb21Sb2xlcyIsImFkZFVzZXJzIiwidXNlckRlY2xpbmVKb2luIiwiYWRtaW5BY2NlcHRKb2luIiwiYWRtaW5SZWplY3RKb2luIiwiYWRkUm9sZSIsInJvbGUiLCJyZW1vdmVSb2xlIiwidXBsb2FkSWNvbiIsImJhc2U2NEltYWdlIiwiQnVmZmVyIiwidG9TdHJpbmciLCJ1c2VycyIsImdyb3VwQWRtaW5MaXN0IiwiZ2V0VXNlcnNJblJvbGUiLCJmZXRjaCIsImN1cnJVc2VyUm9sZXMiLCJyZW1vdmVVc2VycyIsInJlbW92ZVVzZXJzRnJvbVRlYW1Sb2xlcyIsImFmdGVySW5pdCIsIkRlZmF1bHQiLCJUeXBlUmVhZGluZyIsIlJlYWRpbmdSYW5nZSIsInFyeSIsInR5cGVyZWFkaW5nIiwiJGd0ZSIsInVzZXJUeXBlIiwiUGVyc29uYWxpdHkiLCJoYW5kbGUiLCIkYW5kIiwiJHR5cGUiLCIkZXhpc3RzIiwiJGx0ZSIsIiRlbGVtTWF0Y2giLCJUeXBlUmVhZGluZ0NhdGVnb3J5IiwiVHlwZVJlYWRpbmdDYXRlZ29yaWVzIiwiaGVhZGVyIiwibmV3UmVhZGluZyIsIkhlYWRlciIsIkJvZHkiLCJyZWFkaW5nSWQiLCJoaWdoIiwibG93IiwicmVhZGluZyIsImNhdFJlYWRpbmciLCJSYW5nZSIsImFkZFR5cGVDYXRlZ29yeSIsInRvZ2dsZSIsIkNhdGVnb3J5TWFuYWdlciIsIkRlbHRhIiwiaW4iLCJ2YWwiLCJzZXREZWx0YSIsIkNyZWF0ZSIsIm0iLCJGdWxsSGlnaCIsIkZ1bGxMb3ciLCJPZlR5cGUiLCJFbmFibGVkIiwiY2F0IiwidGFyZ2V0IiwiYWRkQ2F0ZWdvcnkiLCJVc2VyRmVlZGJhY2siLCJuZXdGZWVkYmFjayIsImYiLCJzb3VyY2UiLCJjb250ZXh0IiwiY29tbWVudCIsImRhdGVDcmVhdGVkIiwidW4iLCJFbWFpbCIsImlzUmVhZCIsImlzUHVzaGVkIiwiaXNFbWFpbGVkIiwiY3JlYXRlZERhdGUiLCJtYXJrUmVhZCIsIm1hcmtOb3RpZmllZCIsInRlc3QiLCJwdXNoTm90aWZ5Iiwib3B0cyIsIm5vdGVPcHRzIiwiaWNvbiIsImJyb3dzZXJOb3RlIiwid2luZG93IiwiYWxlcnQiLCJOb3RpZmljYXRpb24iLCJwZXJtaXNzaW9uIiwicmVxdWVzdFBlcm1pc3Npb24iLCJvbmNsaWNrIiwibm90ZSIsImFkZHIiLCJlbWFpbHMiLCJhZGRyZXNzIiwic2VuZCIsInRvIiwiZnJvbSIsInN1YmplY3QiLCJpc0NsaWVudCIsIm5vdGlmeSIsIlVzZXJTZWdtZW50IiwiZHNjciIsInMiLCJBY2NvdW50cyIsImVtYWlsVGVtcGxhdGVzIiwic2l0ZU5hbWUiLCJ2ZXJpZnlFbWFpbCIsImVtYWlsQWRkcmVzcyIsInVybFdpdGhvdXRIYXNoIiwicmVwbGFjZSIsInN1cHBvcnRFbWFpbCIsImVtYWlsQm9keSIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsIk15ZXJzQnJpZ2dzQml0IiwiVG90YWxzIiwiUXVlc3Rpb25Db3VudCIsImFkZFZhbHVlIiwicmVtb3ZlVmFsdWUiLCJJRSIsIk5TIiwiVEYiLCJKUCIsImFkZEJ5Q2F0ZWdvcnkiLCJnZXRJZGVudGlmaWVyQnlJZCIsInJlbW92ZUJ5Q2F0ZWdvcnkiLCJjYXRlZ29yeUlkIiwiZ2V0Rm91ckxldHRlciIsIklFTCIsIk5TTCIsIlRGTCIsIkpQTCIsIkFuc3dlcmVkQXQiLCJnZXRRdWVzdGlvbiIsInVuYW5zd2VyIiwiVG90YWxRdWVzdGlvbnMiLCJhbnMiLCJnZXRUb3RhbFF1ZXN0aW9ucyIsImNvbnRleHRUaGlzIiwic2tpcFNsaWNlIiwiaW5kZXgiLCJnZXRBbnN3ZXJJbmRleEZvclF1ZXN0aW9uSUQiLCJiZWZvcmUiLCJzaGlmdCIsInBvcCIsIkRhc2hib2FyZFBhbmUiLCJzaXplIiwicm91dGUiLCJwYXJhbSIsImdlbmRlciIsImJpcnRoRGF0ZSIsImRhc2hib2FyZFBhbmVzIiwiY2FsY3VsYXRlQWdlIiwiZGlmZiIsIm5vdyIsImdldFRpbWUiLCJhZ2UiLCJhYnMiLCJnZXRVVENGdWxsWWVhciIsImZ1bGxOYW1lIiwidG9Mb3dlckNhc2UiLCJ0b1VwcGVyQ2FzZSIsIk9iamVjdCIsInRlYW1zIiwicmVzb2x2ZUVycm9yIiwibmVzdGVkTmFtZSIsInZhbGlkYXRvciIsImFkZFRlYW0iLCJjaGFuZ2VOYW1lIiwidGVhbURvYyIsInByb2ZpbGVVcGRhdGUiLCJ1cHJvZmlsZSIsInNsdWciLCJleHRlbmQiLCJzZXJ2aWNlcyIsIkRlZmF1bHRDYXRlZ29yeUlEIiwiVHlwZVN0YXRzIiwibnVtIiwic3RhdHMiLCJhZGRCeVR5cGUiLCJnZXRTdGF0c0J5VHlwZSIsInJlbW92ZUJ5VHlwZSIsIlR5cGUiLCJhcmVJbnRlcnNlY3RlZCIsImNhdGVnb3J5TWFuYWdlciIsImoiLCJoYXNDYXRlZ29yeSIsImNhdElkIiwicmVtb3ZlQ2F0ZWdvcnkiLCJjIiwibXlQb3N0TG9nb3V0IiwiRmxvd1JvdXRlciIsImdvIiwibXlTdWJtaXRGdW5jIiwiZXJyb3IiLCJteVByZVN1Ym1pdEZ1bmMiLCJhcmd1bWVudHMiLCJteVBvc3RTdWJtaXRGdW5jIiwiaW5mbyIsIkFjY291bnRzVGVtcGxhdGVzIiwiY29uZmlndXJlIiwiY29uZmlybVBhc3N3b3JkIiwiZW5hYmxlUGFzc3dvcmRDaGFuZ2UiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJvdmVycmlkZUxvZ2luRXJyb3JzIiwibG93ZXJjYXNlVXNlcm5hbWUiLCJmb2N1c0ZpcnN0SW5wdXQiLCJzaG93QWRkUmVtb3ZlU2VydmljZXMiLCJzaG93Rm9yZ290UGFzc3dvcmRMaW5rIiwic2hvd0xhYmVscyIsInNob3dQbGFjZWhvbGRlcnMiLCJzaG93UmVzZW5kVmVyaWZpY2F0aW9uRW1haWxMaW5rIiwiY29udGludW91c1ZhbGlkYXRpb24iLCJuZWdhdGl2ZUZlZWRiYWNrIiwibmVnYXRpdmVWYWxpZGF0aW9uIiwicG9zaXRpdmVWYWxpZGF0aW9uIiwicG9zaXRpdmVGZWVkYmFjayIsInNob3dWYWxpZGF0aW5nIiwicHJpdmFjeVVybCIsInRlcm1zVXJsIiwiaG9tZVJvdXRlUGF0aCIsInJlZGlyZWN0VGltZW91dCIsImRlZmF1bHRUZW1wbGF0ZSIsImRlZmF1bHRMYXlvdXQiLCJkZWZhdWx0Q29udGVudFJlZ2lvbiIsImRlZmF1bHRMYXlvdXRSZWdpb25zIiwib25Mb2dvdXRIb29rIiwib25TdWJtaXRIb29rIiwicHJlU2lnblVwSG9vayIsInBvc3RTaWduVXBIb29rIiwidGV4dHMiLCJidXR0b24iLCJzaWduVXAiLCJzb2NpYWxTaWduVXAiLCJzb2NpYWxJY29ucyIsImZvcmdvdFB3ZCIsImlucHV0SWNvbnMiLCJpc1ZhbGlkYXRpbmciLCJoYXNTdWNjZXNzIiwiaGFzRXJyb3IiLCJjb25maWd1cmVSb3V0ZSIsInBhdGgiLCJhZGRGaWVsZHMiLCJyZXF1aXJlZCIsImRpc3BsYXlOYW1lIiwiZnVuYyIsInNlbGVjdCIsIm9uQ3JlYXRlVXNlciIsImVtYWlsIiwidXBkYXRlQXQiLCJwcm9maWxlIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsInVuZGVmaW5lZCIsImlzQWRtaW4iLCJ2YWxpZGF0ZU5ld1VzZXIiLCJsb2dnZWRJblVzZXIiLCJleCIsIlNlc3Npb24iLCJzZXREZWZhdWx0IiwiU3J2RGVmYXVsdHMiLCJzdGFydHVwIiwiZGVmYXVsdFVzZXJJZCIsImNyZWF0ZVVzZXIiLCJwYXNzd29yZCIsInRlYW1Vc2VySWRMaXN0IiwiZXhpc3RpbmdSb2xlTmFtZXMiLCJnZXRBbGxSb2xlcyIsInIiLCJwb3NzaWJsZVJvbGVzIiwiY3JlYXRlUm9sZSIsIlJhd1JlYWRpbmdzIiwiZ2V0Q29sbGVjdGlvbiIsIndyb25nUmVhZGluZ3MiLCJuZXdUeXBlIiwiJHVuc2V0IiwiX2lzTmV3IiwibWtkaXJTeW5jIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVOYW1lIiwid3JpdGVIZWFkIiwicmVhZEZpbGUiLCJ3cml0ZSIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFKO0FBQVdDLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxlQUFSLENBQWIsRUFBc0M7QUFBQ0gsU0FBT0ksQ0FBUCxFQUFTO0FBQUNKLGFBQU9JLENBQVA7QUFBUzs7QUFBcEIsQ0FBdEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSUMsY0FBSjtBQUFtQkosT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHdCQUFSLENBQWIsRUFBK0M7QUFBQ0UsaUJBQWVELENBQWYsRUFBaUI7QUFBQ0MscUJBQWVELENBQWY7QUFBaUI7O0FBQXBDLENBQS9DLEVBQXFGLENBQXJGO0FBQXdGLElBQUlFLElBQUo7QUFBU0wsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHNCQUFSLENBQWIsRUFBNkM7QUFBQ0csT0FBS0YsQ0FBTCxFQUFPO0FBQUNFLFdBQUtGLENBQUw7QUFBTzs7QUFBaEIsQ0FBN0MsRUFBK0QsQ0FBL0Q7QUFJOUxKLE9BQU9PLE9BQVAsQ0FBZSxxQkFBZixFQUFzQyxVQUFVQyxNQUFWLEVBQWtCO0FBQ3BELE1BQUlSLE9BQU9RLE1B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Q0FBYjtBQUFxRUYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGlDQUFSLENBQWI7QUFBeURGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxtREFBUixDQUFiO0FBQTJFRixPQUFPQyxLQUFQLENBQWFDLFFBQVEsdUNBQVIsQ0FBYjtBQUErREYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDhDQUFSLENBQWI7QUFBc0VGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxrQ0FBUixDQUFiO0FBQTBERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsd0NBQVIsQ0FBYjtBQUFnRUYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGdEQUFSLENBQWI7QUFBd0VGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxvQ0FBUixDQUFiO0FBQTRERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZ0RBQVIsQ0FBYjtBQUF3RUYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG9DQUFSLENBQWI7QUFBNERGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSw4Q0FBUixDQUFiLEU7Ozs7Ozs7Ozs7O0FDQXhyQ0YsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHVCQUFSLENBQWI7QUFBK0NGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSx5QkFBUixDQUFiLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSW5kaXZpZHVhbEdvYWwgfSBmcm9tICcuLi9pbmRpdmlkdWFsX2dvYWxzLmpzJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi8uLi91c2Vycy91c2Vycy5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCdpbmRpdmlkdWFsR29hbHNEYXRhJywgZnVuY3Rpb24gKHVzZXJJZCkge1xuICAgIGlmIChNZXRlb3IudXNlcklkKCkgPT09IHVzZXJJZCkge1xuICAgICAgICByZXR1cm4gSW5kaXZpZHVhbEdvYWwuZmluZCgge3VzZXJJZDogdXNlcklkfSApO1xuICAgIH0gZWxzZSBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ3ZpZXctZ29hbHMnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICByZXR1cm4gSW5kaXZpZHVhbEdvYWwuZmluZCgge1xuICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICBwcml2YWN5OiB7XCIkaW5cIjpbXCJ0ZWFtXCIsXCJwdWJsaWNcIl19XG4gICAgICAgIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuaW1wb3J0IHsgVXNlck5vdGlmeSB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2VyX25vdGlmeS91c2VyX25vdGlmeS5qcyc7XG5pbXBvcnQgeyBHb2FsQ29tbWVudCB9IGZyb20gJy9pbXBvcnRzL2FwaS90ZWFtX2dvYWxzL3RlYW1fZ29hbHMuanMnO1xuXG5jb25zdCBJbmRpdmlkdWFsR29hbCA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ0luZGl2aWR1YWxHb2FsJyxcbiAgICBjb2xsZWN0aW9uOiBuZXcgTW9uZ28uQ29sbGVjdGlvbignaW5kaXZpZHVhbF9nb2FsJyksXG4gICAgZmllbGRzOiB7XG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBwYXJlbnRJZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfSxcbiAgICAgICAgYXNzaWduZWRUb1N0cjoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdHJhbnNpZW50OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlYWNoZWREYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZHVlRGF0ZToge1xuICAgICAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJldmlld0RhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXZpZXdlZE9uRGF0ZToge1xuICAgICAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGdvYWxDb21tZW50czoge1xuICAgICAgICAgICAgdHlwZTogW0dvYWxDb21tZW50XSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHJldmlld0NvbW1lbnRzOiB7XG4gICAgICAgICAgICB0eXBlOiBbR29hbENvbW1lbnRdLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgdGVhbUlkOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIHByaXZhY3k6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdwcml2YXRlJ1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVkQnk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGJlaGF2aW9yczoge1xuICAgICAgICB0aW1lc3RhbXA6IHt9XG4gICAgfSxcbiAgICBoZWxwZXJzOiB7XG4gICAgICAgIGdldEdvYWxSb2xlR3JvdXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZWFtTmFtZSArICcrJyArIHRoaXMuX2lkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VySXNBZG1pbigpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgJ2FkbWluJywgdGhpcy50ZWFtTmFtZSlcbiAgICAgICAgICAgICB8fFxuICAgICAgICAgICAgICBSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4nLCB0aGlzLmdldEdvYWxSb2xlR3JvdXAoKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vdXNlciBpcyBlaXRoZXIgYSBnbG9iYWwgYWRtaW4sIGEgdGVhbSBhZG1pbiwgb3IgYSBnb2FsIGFkbWluXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdXNlcklzTWVudG9yKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdtZW50b3InLCB0aGlzLmdldEdvYWxSb2xlR3JvdXAoKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vdXNlciBpcyBhIG1lbnRvciBmb3IgdGhpcyBnb2FsXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdXNlcklzQXNzaWduZWQoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgJ2Fzc2lnbmVkJywgdGhpcy5nZXRHb2FsUm9sZUdyb3VwKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvL3VzZXIgaXMgYXNzaWduZWQgdG8gdGhpcyBnb2FsXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0RGF0ZUZpZWxkKGZpZWxkTmFtZSwgcmRhdGUpIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHJkYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcmRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggIShyZGF0ZSBpbnN0YW5jZW9mIERhdGUpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXNbZmllbGROYW1lXSA9IHJkYXRlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVzZXJGdWxsTmFtZVgodXNlcklkKSB7XG4gICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZE9uZSgge19pZDogdXNlcklkfSApO1xuICAgICAgICAgICAgaWYgKCF1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTWljaGFlbFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5hbWUgPSB1Lk15UHJvZmlsZS5maXJzdE5hbWUgKyBcIiBcIiArIHUuTXlQcm9maWxlLmxhc3ROYW1lO1xuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc01vZGlmeVBlcm0oZmllbGROYW1lKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGZpZWxkTmFtZSkge1xuICAgICAgICAgICAgLy9hZG1pbnMtb25seSBmaWVsZHNcbiAgICAgICAgICAgIGNhc2UgJ2R1ZURhdGUnOlxuICAgICAgICAgICAgY2FzZSAnc3RhcnREYXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ3JlYWNoZWREYXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ3Jldmlld0RhdGUnOlxuICAgICAgICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICAgICAgY2FzZSAnZGVzY3JpcHRpb24nOlxuICAgICAgICAgICAgY2FzZSAnYXNzaWduZWRUbyc6XG4gICAgICAgICAgICBjYXNlICdtZW50b3JzJzpcbiAgICAgICAgICAgIGNhc2UgJ2FkbWlucyc6XG4gICAgICAgICAgICBjYXNlICdzdWJnb2Fscyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklzQWRtaW4oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vYWRtaW5zIGFuZCBtZW50b3JzXG4gICAgICAgICAgICBjYXNlICdyZXZpZXdlZE9uRGF0ZSc6XG4gICAgICAgICAgICBjYXNlICdyZXZpZXdDb21tZW50cyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklzQWRtaW4oKSB8fCB0aGlzLnVzZXJJc01lbnRvcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy9hbnlvbmUgYXNzaWduZWQgdG8gdGhlIGdvYWxcbiAgICAgICAgICAgIGNhc2UgJ2dvYWxDb21tZW50cyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklzQWRtaW4oKSB8fCB0aGlzLnVzZXJJc01lbnRvcigpIHx8IHRoaXMudXNlcklzQXNzaWduZWQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RlYW1JZCc6XG4gICAgICAgICAgICBjYXNlICdwcml2YWN5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBub3RpZnlOZXcob2xkTGlzdCxuZXdMaXN0KSB7XG4gICAgICAgICAgICBsZXQgZGlmZkxpc3QgPSBfLmRpZmZlcmVuY2UobmV3TGlzdCxvbGRMaXN0KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBVc2VyTm90aWZ5LmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogZGlmZkxpc3RbaV0sXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR29hbHMnLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiAnWW91IGhhdmUgYmVlbiBhZGRlZCB0byBnb2FsICcrdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndGVhbWdvYWxzOicrdGhpcy50ZWFtTmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgYmVmb3JlU2F2ZShlKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgbGV0IGVnb2FsID0gZS5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgICAgICAvL2FueSB1c2VyIGFkZGVkIHRvIGEgZ29hbCBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSAndmlldy1nb2Fscycgcm9sZSBmb3IgdGhlIHRlYW1cbiAgICAgICAgICAgIC8vaWYgdGhleSBhcmUgYWxyZWFkeSBpbiB0aGF0IHJvbGUsIHRoaXMgc2hvdWxkIGp1c3QgaWdub3JlIHRoZSByZWR1bmRhbnQgYWRkVXNlclxuICAgICAgICAgICAgbGV0IGZsZHMgPSBbXCJhc3NpZ25lZFRvXCIsXCJtZW50b3JzXCIsXCJhZG1pbnNcIl07XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGZsZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlZ29hbFtmbGRzW2ldXSkgJiYgZWdvYWxbZmxkc1tpXV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoZWdvYWxbZmxkc1tpXV0sICd2aWV3LWdvYWxzJywgZWdvYWwudGVhbU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBtZXRlb3JNZXRob2RzOiB7XG4gICAgICAgIHNldER1ZURhdGUocmRhdGUpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMuc2V0RGF0ZUZpZWxkKFwiZHVlRGF0ZVwiLCByZGF0ZSkgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkludmFsaWQgZGF0ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0R29hbFJlYWNoZWQocmRhdGUpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMuc2V0RGF0ZUZpZWxkKFwicmVhY2hlZERhdGVcIiwgcmRhdGUpICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbnZhbGlkIGRhdGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldmlld0RhdGUocmRhdGUpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMuc2V0RGF0ZUZpZWxkKFwicmV2aWV3RGF0ZVwiLCByZGF0ZSkgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkludmFsaWQgZGF0ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0R29hbFJldmlld2VkT24ocmRhdGUpIHtcbiAgICAgICAgICAgIC8vbWVudG9ycyBhbmQgYWRtaW5zXG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgJiYgIXRoaXMudXNlcklzTWVudG9yKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMuc2V0RGF0ZUZpZWxkKFwicmV2aWV3ZWRPbkRhdGVcIiwgcmRhdGUpICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbnZhbGlkIGRhdGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFkZENvbW1lbnQoY29tbWVudFR4dCkge1xuICAgICAgICAgICAgLy9tZW50b3JzLCBhZG1pbnMsIGFuZCBhc3NpZ25lZXNcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSAmJiAhdGhpcy51c2VySXNNZW50b3IoKSAmJiAhdGhpcy51c2VySXNBc3NpZ25lZCgpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ29hbENvbW1lbnRzLnB1c2goXG4gICAgICAgICAgICAgICAgbmV3IEdvYWxDb21tZW50KCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjb21tZW50VHh0LFxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBhZGRSZXZpZXdDb21tZW50KGNvbW1lbnRUeHQpIHtcbiAgICAgICAgICAgIC8vbWVudG9ycyBhbmQgYWRtaW5zXG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgJiYgIXRoaXMudXNlcklzTWVudG9yKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXZpZXdDb21tZW50cy5wdXNoKFxuICAgICAgICAgICAgICAgIG5ldyBHb2FsQ29tbWVudCgge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY29tbWVudFR4dCxcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlTmV3R29hbCgpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL1xuICAgICAgICB9LFxuICAgICAgICBzZXRUaXRsZSh0aXRsZSkge1xuICAgICAgICAgICAgLy9hZG1pbnMgb25seVxuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXREZXNjcmlwdGlvbihkZXNjcikge1xuICAgICAgICAgICAgLy9hZG1pbnMgb25seVxuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcjtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBc3NpZ25lZFRvKHVsaXN0KSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ub3RpZnlOZXcodGhpcy5hc3NpZ25lZFRvLHVsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYXNzaWduZWRUbyA9IHVsaXN0O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldE1lbnRvcnModWxpc3QpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub3RpZnlOZXcodGhpcy5tZW50b3JzLHVsaXN0KTtcbiAgICAgICAgICAgIHRoaXMubWVudG9ycyA9IHVsaXN0O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFkbWlucyh1bGlzdCkge1xuICAgICAgICAgICAgLy9hZG1pbnMgb25seVxuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5TmV3KHRoaXMuYWRtaW5zLHVsaXN0KTtcbiAgICAgICAgICAgIHRoaXMuYWRtaW5zID0gdWxpc3Q7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VXNlckZ1bGxOYW1lKHVzZXJJZCkge1xuICAgICAgICAgICAgY29uc3QgaW52b2NhdGlvbiA9IEREUC5fQ3VycmVudEludm9jYXRpb24uZ2V0KCk7XG4gICAgICAgICAgICBpZiAoaW52b2NhdGlvbi5pc1NpbXVsYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJHZW9yZ2VcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB1ID0gVXNlci5maW5kT25lKCB7X2lkOiB1c2VySWR9ICk7XG4gICAgICAgICAgICBpZiAoIXUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNaWNoYWVsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHUuTXlQcm9maWxlLmZpcnN0TmFtZSArIFwiIFwiICsgdS5NeVByb2ZpbGUubGFzdE5hbWU7XG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlRnJvbU9iaih1cGRPYmopIHtcbiAgICAgICAgICAgIGxldCBwZXJtRXJyb3IgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZmxkIGluIHVwZE9iaikge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIHRoaXNbZmxkXSAhPT0gdXBkT2JqW2ZsZF0gfHxcbiAgICAgICAgICAgICAgICAgIChBcnJheS5pc0FycmF5KHVwZE9ialtmbGRdKSAmJiBfLmlzRXF1YWwodGhpc1tmbGRdLCB1cGRPYmpbZmxkXSkpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc01vZGlmeVBlcm0oZmxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZsZCA9PT0gXCJhc3NpZ25lZFRvXCIgfHwgZmxkID09PSBcIm1lbnRvcnNcIiB8fCBmbGQgPT09IFwiYWRtaW5zXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeU5ldyh0aGlzW2ZsZF0sdXBkT2JqW2ZsZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmbGRdID0gdXBkT2JqW2ZsZF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJtRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICBpZiAocGVybUVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5leHBvcnQgeyBJbmRpdmlkdWFsR29hbCB9O1xuIiwiaW1wb3J0IHsgSW5kaXZpZHVhbEdvYWwgfSBmcm9tICcuL2luZGl2aWR1YWxfZ29hbHMuanMnO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICAgJ2luZGl2aWR1YWxnb2Fscy5jcmVhdGVOZXdHb2FsJyhnb2FsKSB7XG4gICAgICAgIGlmIChnb2FsLnVzZXJJZCAhPT0gTWV0ZW9yLnVzZXJJZCgpICYmICFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIGdvYWwudGVhbU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ29hbC5jcmVhdGVkQnkgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgICAgIGxldCBnID0gbmV3IEluZGl2aWR1YWxHb2FsKGdvYWwpO1xuICAgICAgICByZXR1cm4gZy5zYXZlKCk7XG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IExlYXJuU2hhcmVTZXNzaW9uIH0gZnJvbSAnLi4vbGVhcm5fc2hhcmUuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnbGVhcm5TaGFyZUxpc3QnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIExlYXJuU2hhcmVTZXNzaW9uLmZpbmQoIHt9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHsgdGl0bGU6IDEsIHRlYW1JZDogMSB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbIF07XG4gICAgfVxufSk7XG5cbk1ldGVvci5wdWJsaXNoKCdsZWFyblNoYXJlRGV0YWlscycsIGZ1bmN0aW9uKGxzc2lkKSB7XG4gICAgLy9pZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIExlYXJuU2hhcmVTZXNzaW9uLmZpbmQoIHtfaWQ6bHNzaWR9ICk7XG4gICAgLy99IGVsc2Uge1xuICAgIC8vICAgIHJldHVybiBbIF07XG4gICAgLy99XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2Vycy91c2Vycy5qcyc7XG5pbXBvcnQgeyBVc2VyTm90aWZ5IH0gZnJvbSAnL2ltcG9ydHMvYXBpL3VzZXJfbm90aWZ5L3VzZXJfbm90aWZ5LmpzJztcblxudmFyIGZzID0ge307XG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcbn1cblxuY29uc3QgTFNVc2VyID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnTFNVc2VyJyxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdKb2huIERvZSdcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jb25zdCBMZWFyblNoYXJlU2Vzc2lvbiA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogXCJMZWFyblNoYXJlU2Vzc2lvblwiLFxuICAgIGNvbGxlY3Rpb246IG5ldyBNb25nby5Db2xsZWN0aW9uKCdsZWFybl9zaGFyZScpLFxuICAgIGZpZWxkczoge1xuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogXCJ1bm5hbWVkIExlYXJuL1NoYXJlIHNlc3Npb25cIlxuICAgICAgICB9LFxuICAgICAgICBub3Rlczoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogXCJkdWx5IG5vdGVkXCJcbiAgICAgICAgfSxcbiAgICAgICAgcGFydGljaXBhbnRzOiB7XG4gICAgICAgICAgICB0eXBlOiBbTFNVc2VyXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIGd1ZXN0czoge1xuICAgICAgICAgICAgdHlwZTogW0xTVXNlcl0sXG4gICAgICAgICAgICBkZWZhdWx0OiBbXVxuICAgICAgICB9LFxuICAgICAgICBwcmVzZW50ZXJzOiB7XG4gICAgICAgICAgICB0eXBlOiBbTFNVc2VyXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcImFjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHNreXBlVXJsOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIHRlYW1JZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBiZWhhdmlvcnM6IHtcbiAgICAgICAgdGltZXN0YW1wOiB7fVxuICAgIH0sXG4gICAgbWV0ZW9yTWV0aG9kczoge1xuICAgICAgICBhZGRQcmVzZW50ZXI6IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoXCJsb2NrZWRcIiA9PT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsc1VzZXIgPSBuZXcgTFNVc2VyKHVzZXIpO1xuXG4gICAgICAgICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgXy5maW5kKHRoaXMucHJlc2VudGVycywgZnVuY3Rpb24obykge3JldHVybiBvLmlkPT09bHNVc2VyLmlkO30pICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmVzZW50ZXJzLnB1c2gobHNVc2VyKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkUGFydGljaXBhbnQ6IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICBpZiAoXCJsb2NrZWRcIiA9PT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsc1VzZXIgPSBuZXcgTFNVc2VyKHVzZXIpO1xuXG4gICAgICAgICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgXy5maW5kKHRoaXMucGFydGljaXBhbnRzLCBmdW5jdGlvbihvKSB7cmV0dXJuIG8uaWQ9PT1sc1VzZXIuaWQ7fSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2lwYW50cy5wdXNoKGxzVXNlcik7XG4gICAgICAgICAgICBVc2VyTm90aWZ5LmFkZCh7XG4gICAgICAgICAgICAgICAgdXNlcklkOiBsc1VzZXIuaWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdMZWFybi9TaGFyZScsXG4gICAgICAgICAgICAgICAgYm9keTogJ1lvdSBoYXZlIGJlZW4gYWRkZWQgdG8gYSBMZWFybi9TaGFyZSBzZXNzaW9uJyxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdsZWFybnNoYXJlOicrdGhpcy5faWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVQYXJ0aWNpcGFudDogZnVuY3Rpb24gKHVzZXJJZCkge1xuICAgICAgICAgICAgaWYgKFwibG9ja2VkXCIgPT09IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2lwYW50cyA9IF8uZmlsdGVyKHRoaXMucGFydGljaXBhbnRzLCBmdW5jdGlvbiAobykge3JldHVybiBvLmlkIT09dXNlcklkfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUd1ZXN0OiBmdW5jdGlvbiAodXNlcklkKSB7XG4gICAgICAgICAgICBpZiAoXCJsb2NrZWRcIiA9PT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ3Vlc3RzID0gXy5maWx0ZXIodGhpcy5ndWVzdHMsIGZ1bmN0aW9uIChvKSB7cmV0dXJuIG8uaWQhPT11c2VySWR9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlUHJlc2VudGVyOiBmdW5jdGlvbiAodXNlcklkKSB7XG4gICAgICAgICAgICBpZiAoXCJsb2NrZWRcIiA9PT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlc2VudGVycyA9IF8uZmlsdGVyKHRoaXMucHJlc2VudGVycywgZnVuY3Rpb24gKG8pIHtyZXR1cm4gby5pZCE9PXVzZXJJZH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBhZGRQYXJ0aWNpcGFudFNlbGY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChcImxvY2tlZFwiID09PSB0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1ldGVvci51c2VySWQoKSkge1xuICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgXy5maW5kKHRoaXMucGFydGljaXBhbnRzLCBmdW5jdGlvbihvKSB7cmV0dXJuIG8uaWQ9PT1NZXRlb3IudXNlcklkKCk7fSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHUgPSBVc2VyLmZpbmRPbmUoIHtfaWQ6IE1ldGVvci51c2VySWQoKX0gKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxzdSA9IG5ldyBMU1VzZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdS5NeVByb2ZpbGUuZmlyc3ROYW1lICsgXCIgXCIgKyB1Lk15UHJvZmlsZS5sYXN0TmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFydGljaXBhbnRzLnB1c2gobHN1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzYXZlR3Vlc3Q6IGZ1bmN0aW9uKGd1ZXN0SWQsIGd1ZXN0TmFtZSkge1xuICAgICAgICAgICAgaWYgKFwibG9ja2VkXCIgPT09IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ3Vlc3RPYmogPSBfLmZpbmQodGhpcy5ndWVzdHMsIGZ1bmN0aW9uKG8pIHtyZXR1cm4gby5pZD09PWd1ZXN0SWQ7fSk7XG4gICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGd1ZXN0T2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhbHJlYWR5IGEgZ3Vlc3RcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5ndWVzdHMgPSBfLmZpbHRlcih0aGlzLmd1ZXN0cywgZnVuY3Rpb24obykge3JldHVybiBvLmlkIT09Z3Vlc3RJZH0pO1xuICAgICAgICAgICAgICAgIGd1ZXN0T2JqLm5hbWUgPSBndWVzdE5hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IGEgZ3Vlc3RcIik7XG4gICAgICAgICAgICAgICAgZ3Vlc3RPYmogPSBuZXcgTFNVc2VyKHtpZDogZ3Vlc3RJZCwgbmFtZTogZ3Vlc3ROYW1lfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmd1ZXN0cy5wdXNoKGd1ZXN0T2JqKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzYXZlVGV4dDogZnVuY3Rpb24gKHRpdGxlLCBub3Rlcykge1xuICAgICAgICAgICAgaWYgKFwibG9ja2VkXCIgPT09IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ2xlYXJuLXNoYXJlLWhvc3QnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGVzID0gbm90ZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxvY2tTZXNzaW9uOiBmdW5jdGlvbiAodGl0bGUsIG5vdGVzKSB7XG4gICAgICAgICAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ2xlYXJuLXNoYXJlLWhvc3QnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcImxvY2tlZFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1bmxvY2tTZXNzaW9uOiBmdW5jdGlvbiAodGl0bGUsIG5vdGVzKSB7XG4gICAgICAgICAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ2xlYXJuLXNoYXJlLWhvc3QnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcImFjdGl2ZVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRTa3lwZVVybDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nLCdsZWFybi1zaGFyZS1ob3N0J10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNreXBlVXJsID0gdXJsO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGxvYWRSZWNvcmRpbmcoZmlsZUluZm8sIGZpbGVEYXRhKSB7XG4gICAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nLCdsZWFybi1zaGFyZS1ob3N0J10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXBsb2FkUGF0aCA9ICcvdXBsb2Fkcy8nO1xuICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZSh1cGxvYWRQYXRoK3RoaXMuX2lkK1wiLm1wNFwiLCBmaWxlRGF0YSwgJ2JpbmFyeScsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaWxlIHdyaXR0ZW4uXCIsIGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IHsgTGVhcm5TaGFyZVNlc3Npb24gfTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTGVhcm5TaGFyZVNlc3Npb24gfSBmcm9tICcuL2xlYXJuX3NoYXJlLmpzJztcblxudmFyIGZvcm1hdHRlZERhdGUgPSAoKSA9PiB7XG4gICAgbGV0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCB5ZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgIGxldCBtb250aCA9IGQuZ2V0TW9udGgoKSArIDE7XG4gICAgbGV0IGRheSA9IGQuZ2V0RGF0ZSgpO1xuICAgIHJldHVybiAoeWVhciArXCItXCIrIChcIjAwXCIrbW9udGgpLnNsaWNlKC0yKSArXCItXCIrIChcIjAwXCIrZGF5KS5zbGljZSgtMikpO1xufVxuXG52YXIgcmFuZG9tQ2hhcnMgPSAoKSA9PiB7XG4gICAgdmFyIHRleHQgPSBcIlwiO1xuICAgIHZhciBpZExlbmd0aCA9IDI7XG4gICAgdmFyIHBvc3NpYmxlID0gXCJhY2RlZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWRMZW5ndGg7IGkrKykge1xuICAgICAgICB0ZXh0ICs9IHBvc3NpYmxlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGV4dDtcbn1cblxudmFyIGxzc2lkR2VuZXJhdGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChmb3JtYXR0ZWREYXRlKCkgKyBcIi1cIiArIHJhbmRvbUNoYXJzKCkpO1xufVxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgICdsZWFybnNoYXJlLmNyZWF0ZU5ld1Nlc3Npb24nKHNlc3NUaXRsZSwgdGVhbUlkKSB7XG4gICAgICAgIGlmICghUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ2xlYXJuLXNoYXJlLWhvc3QnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsc3NpZCA9IGxzc2lkR2VuZXJhdGUoKTtcblxuICAgICAgICBsZXQgbmV3U2Vzc2lvbiA9IG5ldyBMZWFyblNoYXJlU2Vzc2lvbih7XG4gICAgICAgICAgICBfaWQ6IGxzc2lkLFxuICAgICAgICAgICAgdGl0bGU6IHNlc3NUaXRsZSxcbiAgICAgICAgICAgIHRlYW1JZDogdGVhbUlkXG4gICAgICAgIH0pO1xuICAgICAgICBuZXdTZXNzaW9uLnNhdmUoKTtcbiAgICAgICAgcmV0dXJuIGxzc2lkO1xuICAgIH0sXG4gICAgJ2xlYXJuc2hhcmUucmVjb3JkaW5nRXhpc3RzJyhmbmFtZSkge1xuICAgICAgICBsZXQgZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcbiAgICAgICAgbGV0IHVwbG9hZFBhdGggPSAnL3VwbG9hZHMvJztcbiAgICAgICAgY29uc29sZS5sb2coXCJleGlzdFwiLHVwbG9hZFBhdGgrZm5hbWUrXCIubXA0XCIpO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyh1cGxvYWRQYXRoK2ZuYW1lK1wiLm1wNFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5ZXNcIik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm9cIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59KVxuIiwiLy8gQWxsIHF1ZXN0aW9ucy1yZWxhdGVkIHB1YmxpY2F0aW9uc1xuXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFF1ZXN0aW9uLCBSZWFkaW5nLCBNeWVyc0JyaWdnc0NhdGVnb3J5IH0gZnJvbSAnLi4vcXVlc3Rpb25zLmpzJztcbmltcG9ydCB7IFVzZXIsIE15ZXJzQnJpZ2dzLCBBbnN3ZXIsIFVzZXJUeXBlLCBQcm9maWxlIH0gZnJvbSAnLi4vLi4vdXNlcnMvdXNlcnMuanMnO1xuXG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSgncXVlc3Rpb25zLmJ5Y2F0ZWdvcnknLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHsgcmV0dXJuIHRoaXMucmVhZHkoKTsgfVxuICAgIGNvbnNvbGUubG9nKFwiUHVibGljYXRpb24gJ3F1ZXN0aW9ucy5ieWNhdGVnb3J5JzogXCIsIGNhdGVnb3J5LCB0aGlzLnVzZXJJZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZCgpIHtcbiAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbi5maW5kKHtcbiAgICAgICAgICAgICAgICBDYXRlZ29yaWVzOmNhdGVnb3J5XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgc29ydDoge2NyZWF0ZWRBdDogLTF9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IFt7XG4gICAgICAgICAgICBmaW5kKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVzZXIuZmluZCh7IF9pZDogcXVlc3Rpb24uQ3JlYXRlZEJ5IH0sIHsgbGltaXQ6IDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaCgncXVlc3Rpb25zLnRvYW5zd2VyJywgZnVuY3Rpb24gKHVzZXJJZCwgcmVmcmVzaCkge1xuICAgIC8vY29uc29sZS5sb2codXNlcklkLCB0aGlzLnVzZXJJZCk7XG4gICAgLy9pZih0aGlzLnVzZXJJZCAhPT0gdXNlcklkICYmICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkgeyByZXR1cm4gdGhpcy5yZWFkeSgpOyB9XG4gICAgY29uc29sZS5sb2coXCJQdWJsaWNhdGlvbiAncXVlc3Rpb25zLnRvYW5zd2VyJzogXCIsIHRoaXMudXNlcklkLCB1c2VySWQpO1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBsZXQgdXNlciA9IFVzZXIuZmluZE9uZSh7X2lkOnVzZXJJZH0pO1xuICAgIGxldCBxaWRzID0gdXNlci5NeVByb2ZpbGUuVXNlclR5cGUuZ2V0QW5zd2VyZWRRdWVzdGlvbnNJRHMoKTtcbiAgICAvL2NvbnNvbGUubG9nKHNlbGYsIHVzZXIsIHFpZHMpO1xuICAgIGxldCBvYnNlcnZlID0ge1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24oaWQsIGZpZWxkcykge1xuICAgICAgICAgICAgc2VsZi5hZGRlZCgncXVlc3Rpb25zJywgaWQsIGZpZWxkcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlZChcInF1ZXN0aW9uc1wiLCBpZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZWQoJ3F1ZXN0aW9ucycsIGlkKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgbGV0IGlkcyA9IFswLDEsMiwzXTtcbiAgICBpZHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBsZXQgYXIgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBsZXQgYnIgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBpZihhciA9PT0gYnIpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIGFyID4gYnIgPyAtMSA6IDE7XG4gICAgfSk7XG4gICAgaGFuZGxlcyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhhbmRsZXNbaWRzW2ldXSA9IFF1ZXN0aW9uLmZpbmQoe0NhdGVnb3JpZXM6aWRzW2ldLCBfaWQ6IHsgJG5pbjogcWlkcyB9LCBBY3RpdmU6IHRydWV9LHsgbGltaXQ6IDF9KS5vYnNlcnZlQ2hhbmdlcyhvYnNlcnZlKTtcbiAgICB9XG5cbiAgICBzZWxmLnJlYWR5KCk7XG4gICAgc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZXNbaV0uc3RvcCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsIi8vIE1ldGhvZHMgcmVsYXRlZCB0byBRdWVzdGlvbnNcblxuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBRdWVzdGlvbiwgTXllcnNCcmlnZ3NDYXRlZ29yeSB9IGZyb20gJy4vcXVlc3Rpb25zLmpzJztcbmltcG9ydCB7IFVzZXIsIEFuc3dlcn0gZnJvbSAnLi4vdXNlcnMvdXNlcnMuanMnO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICAgJ3F1ZXN0aW9uLmluc2VydCcoY2F0ZWdvcnksIHRleHQsIGxlZnQsIHJpZ2h0LCBzZWcpIHtcbiAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhjYXRlZ29yeSk7XG4gICAgICAgIGxldCBuZXdRdWVzdGlvbiA9IG5ldyBRdWVzdGlvbih7IENhdGVnb3J5OiBwYXJzZUludChjYXRlZ29yeVswXSksIENhdGVnb3JpZXM6IGNhdGVnb3J5Lm1hcCgoYSk9PntyZXR1cm4gcGFyc2VJbnQoYSk7fSksIFRleHQ6IHRleHQsIExlZnRUZXh0OmxlZnQsIFJpZ2h0VGV4dDpyaWdodCwgc2VnbWVudHM6c2VnLCBDcmVhdGVkQnk6TWV0ZW9yLnVzZXJJZCgpIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhjYXRlZ29yeSwgdGV4dCwgbmV3UXVlc3Rpb24pO1xuICAgICAgICBuZXdRdWVzdGlvbi52YWxpZGF0ZSh7XG4gICAgICAgICAgICBjYXN0OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXdRdWVzdGlvbi5zYXZlKCk7XG4gICAgfSxcbiAgICAncXVlc3Rpb24uYW5zd2VyJyhxdWVzdGlvbklkLCB2YWx1ZSwgaXNSZXZlcnNlZCkge1xuICAgICAgICBsZXQgcXVlc3Rpb24gPSBRdWVzdGlvbi5maW5kT25lKHtfaWQ6cXVlc3Rpb25JZH0pO1xuICAgICAgICBsZXQgbWUgPSBVc2VyLmZpbmRPbmUoe19pZDpNZXRlb3IudXNlcklkKCl9KTtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgaWYoISFpc1JldmVyc2VkKSB7IHZhbHVlID0gfnZhbHVlICsgMTsgfVxuICAgICAgICBjb25zb2xlLmxvZyhxdWVzdGlvbklkLCB2YWx1ZSwgISFpc1JldmVyc2VkKTtcbiAgICAgICAgbGV0IGFuc3dlciA9IG5ldyBBbnN3ZXIoe1xuICAgICAgICAgICAgQ2F0ZWdvcmllczogcXVlc3Rpb24uQ2F0ZWdvcmllcyxcbiAgICAgICAgICAgIFF1ZXN0aW9uSUQ6IHF1ZXN0aW9uSWQsXG4gICAgICAgICAgICBSZXZlcnNlZDogISFpc1JldmVyc2VkLFxuICAgICAgICAgICAgVmFsdWU6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgICBxdWVzdGlvbi5hZGRBbnN3ZXIoYW5zd2VyKTtcbiAgICAgICAgbWUuTXlQcm9maWxlLlVzZXJUeXBlLmFuc3dlclF1ZXN0aW9uKGFuc3dlcik7XG4gICAgICAgIGNvbnNvbGUubG9nKG1lLk15UHJvZmlsZSk7XG4gICAgICAgIG1lLnNhdmUoKTtcbiAgICB9LFxuICAgICdxdWVzdGlvbi51bmFuc3dlcicocXVlc3Rpb25JZCkge1xuICAgICAgICBsZXQgbWUgPSBVc2VyLmZpbmRPbmUoe19pZDpNZXRlb3IudXNlcklkKCl9KTtcbiAgICAgICAgbGV0IGFuc3dlciA9IG1lLk15UHJvZmlsZS5Vc2VyVHlwZS5nZXRBbnN3ZXJGb3JRdWVzdGlvbihxdWVzdGlvbklkKTtcbiAgICAgICAgaWYoYW5zd2VyID09IG51bGwpIHsgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdZb3UgY2FuXFwndCB1bmFud2VyIGEgcXVlc3Rpb24geW91IGhhdmVuXFwndCBhbnN3ZXJlZC4nKTsgfVxuICAgICAgICBtZS5NeVByb2ZpbGUuVXNlclR5cGUudW5BbnN3ZXJRdWVzdGlvbihhbnN3ZXIpO1xuICAgICAgICBtZS5zYXZlKCk7XG4gICAgfSxcbiAgICAncXVlc3Rpb24udW5hbnN3ZXJBbGwnKHF1ZXN0aW9uSWRzKSB7XG4gICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXF1ZXN0aW9uSWRzIGluc3RhbmNlb2YgQXJyYXkpIHsgcXVlc3Rpb25JZHMgPSBbcXVlc3Rpb25JZHNdOyB9XG4gICAgICAgIGxldCBxdWVzdGlvbnMgPSBRdWVzdGlvbi5maW5kKHtfaWQ6eyAkaW4gOiBxdWVzdGlvbklkc319KTtcbiAgICAgICAgcXVlc3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHF1ZXN0aW9uKSB7IHF1ZXN0aW9uLnVuYW5zd2VyQWxsKCk7IH0pO1xuICAgIH0sXG4gICAgJ3F1ZXN0aW9uLmRlbGV0ZScocXVlc3Rpb25JZCkge1xuICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbiddLCBSb2xlcy5HTE9CQUxfR1JPVVApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZSA9IFVzZXIuZmluZE9uZSh7X2lkOk1ldGVvci51c2VySWQoKX0pO1xuICAgICAgICBsZXQgcXVlc3Rpb24gPSBRdWVzdGlvbi5maW5kT25lKHtfaWQ6cXVlc3Rpb25JZH0pO1xuICAgICAgICBxdWVzdGlvbi5yZW1vdmUoKTtcbiAgICB9LFxuICAgICdxdWVzdGlvbi5yZXNldFVzZXJzJyh1c2VySWRzKSB7XG4gICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXVzZXJJZHMgaW5zdGFuY2VvZiBBcnJheSkgeyB1c2VySWRzID0gW3VzZXJJZHNdOyB9XG4gICAgICAgIGxldCB1cyA9IFVzZXIuZmluZCh7X2lkOnskaW46dXNlcklkc319KTtcbiAgICAgICAgaWYoIXVzKSB7IHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCBcIlVzZXIgaXMgbm90IGZvdW5kLlwiKTsgfVxuICAgICAgICB1cy5mb3JFYWNoKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICB1Lk15UHJvZmlsZS5Vc2VyVHlwZS5yZXNldCgpO1xuICAgICAgICAgICAgdS5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgJ3F1ZXN0aW9uLnJlc2V0QWxsJygpIHtcbiAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcXMgPSBRdWVzdGlvbi5maW5kKHt9KTtcbiAgICAgICAgcXMuZm9yRWFjaChmdW5jdGlvbiAocSkge1xuICAgICAgICAgICAgcS51bmFuc3dlckFsbCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHVzID0gVXNlci5maW5kKHt9KTtcbiAgICAgICAgdXMuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgdS5NeVByb2ZpbGUuVXNlclR5cGUucmVzZXQoKTtcbiAgICAgICAgICAgIHUuc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgICdxdWVzdGlvbi5jb3VudFF1ZXN0aW9ucycobXlVc2VySWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImhhcHB5MVwiKTtcbiAgICAgICAgbGV0IG1lID0gVXNlci5maW5kT25lKHtfaWQ6bXlVc2VySWR9KTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlVzZXJJRFwiLCBtZSk7XG4gICAgICAgIGxldCB0b3RhbFF1ZXN0aW9ucyA9IFF1ZXN0aW9uLmZpbmQoKS5jb3VudCgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiaGFwcHkzXCIsIHRvdGFsUXVlc3Rpb25zKTtcbiAgICAgICAgbWUuTXlQcm9maWxlLlVzZXJUeXBlLnNldFRvdGFsUXVlc3Rpb25zKHRvdGFsUXVlc3Rpb25zKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImhhcHB5NFwiLCBtZS5NeVByb2ZpbGUuVXNlclR5cGUuZ2V0VG90YWxRdWVzdGlvbnMoKSk7XG4gICAgICAgIHJldHVybiB0b3RhbFF1ZXN0aW9ucztcbiAgICB9XG59KTtcbiIsIi8vIERlZmluaXRpb24gb2YgdGhlIHF1ZXN0aW9ucyBjb2xsZWN0aW9uXG5cbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3VzZXJzL3VzZXJzLmpzJztcbmltcG9ydCB7IERlZmF1bHRzIH0gZnJvbSAnL2ltcG9ydHMvc3RhcnR1cC9ib3RoL2RlZmF1bHRzLmpzJztcbmltcG9ydCB7IFVzZXJOb3RpZnkgfSBmcm9tICcvaW1wb3J0cy9hcGkvdXNlcl9ub3RpZnkvdXNlcl9ub3RpZnkuanMnO1xuXG5jb25zdCBNeWVyc0JyaWdnc0NhdGVnb3J5ID0gRW51bS5jcmVhdGUoe1xuICAgIG5hbWU6ICdNeWVyc0JyaWdnc0NhdGVnb3J5JyxcbiAgICBpZGVudGlmaWVyczogWydJRScsJ05TJywnVEYnLCdKUCddXG59KTtcbmNvbnN0IFJlYWRpbmcgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6J1JlYWRpbmcnLFxuICAgIGZpZWxkczoge1xuICAgICAgICBSYW5rOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdmFsaWRhdG9yczogW3tcbiAgICAgICAgICAgICAgICB0eXBlOiAnbHRlJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlUGFyYW06IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDUwOyB9XG4gICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3RlJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlUGFyYW06IGZ1bmN0aW9uICgpIHsgcmV0dXJuIC01MDsgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgVGV4dDoge1xuICAgICAgICAgICAgdHlwZTpTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnV2VsbCwgeW91IGZlZWwuLi4nXG4gICAgICAgIH1cbiAgICB9XG59KTtcbmNvbnN0IFBvbGFyU3RhdHMgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6ICdQb2xhclN0YXRzJyxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgTGVmdFN1bToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9LFxuICAgICAgICBSaWdodFN1bToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9XG4gICAgfSxcbiAgICBoZWxwZXJzOiB7XG4gICAgICAgIHJlc2V0KCkge1xuICAgICAgICAgICAgdGhpcy5MZWZ0U3VtID0gMDtcbiAgICAgICAgICAgIHRoaXMuUmlnaHRTdW0gPSAwO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5jb25zdCBRdWVzdGlvbiA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogXCJRdWVzdGlvblwiLFxuICAgIGNvbGxlY3Rpb246IG5ldyBNb25nby5Db2xsZWN0aW9uKCdxdWVzdGlvbnMnKSxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgQ2F0ZWdvcnk6IHtcbiAgICAgICAgICAgIHR5cGU6IE15ZXJzQnJpZ2dzQ2F0ZWdvcnksXG4gICAgICAgICAgICBkZWZhdWx0OiAnSUUnXG4gICAgICAgIH0sXG4gICAgICAgIENhdGVnb3JpZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtNeWVyc0JyaWdnc0NhdGVnb3J5XSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIFRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdXaG9hISBXaGF0IHdlIGFza2luXFwnIGhlcmU/J1xuICAgICAgICB9LFxuICAgICAgICBMZWZ0VGV4dDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1dob2EhIFdoYXQgd2UgYXNraW5cXCcgaGVyZT8nXG4gICAgICAgIH0sXG4gICAgICAgIFJpZ2h0VGV4dDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1dob2EhIFdoYXQgd2UgYXNraW5cXCcgaGVyZT8nXG4gICAgICAgIH0sXG4gICAgICAgIFJlYWRpbmdzOiB7XG4gICAgICAgICAgICB0eXBlOiBbUmVhZGluZ10sXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgeyBSYW5rOiAtNTAsIFRleHQ6IFwiWW91IHdpbGwgQUxXQVlTIERvIHRoaXMuIERvaW5nIG90aGVyd2lzZSBpcyBpbmNvbmNlaXZhYmxlIHRvIHlvdS5cIn0sXG4gICAgICAgICAgICAgICAgICAgIHsgUmFuazogLTQ5LCBUZXh0OiBcIlRoZXJlIG1heSBiZSBhIHBvc3NpYmxlIHNjZW5lcmlvIHdoZXJlIHRoZSByZXZlcnNlIG1heSBhcHBseSwgYnV0IGl0IHdvdWxkIGJlIHJlYWxseSByYXJlLlwifSxcbiAgICAgICAgICAgICAgICAgICAgeyBSYW5rOiAtNDAsIFRleHQ6IFwiWW91IGNhbiB0aGluayBvZiBjYXNlcyB3aGVyZSB5b3UgaGF2ZSBkb25lIHRoaW5ncyB0aGUgb3RoZXIgd2F5LCBidXQgbm90IHVuZGVyIG5vcm1hbCBjaXJjdW1zdGFuY2VzLiBcIn0sXG4gICAgICAgICAgICAgICAgICAgIHsgUmFuazogLTMwLCBUZXh0OiBcIlRoaXMgaXMgeW91ciBtb3N0IGNvbW1vbiBiZWhhdmlvciwgYnV0IHRoZXJlIGFyZSBkZWZpbml0ZWx5IHRpbWVzIHlvdSd2ZSBkb25lIHRoZSBvcHBvc2l0ZS5cIn0sXG4gICAgICAgICAgICAgICAgICAgIHsgUmFuazogLTIwLCBUZXh0OiBcIlRoaXMgaXMgYSBnb29kIGRlZmF1bHQgY2hvaWNlIGZvciB5b3UsIGJ1dCB0aW1lIGFuZCBjaXJjdW1zdGFuY2UgY291bGQgZWFzaWx5IGZpbmQgeW91IGRvaW5nIHRoZSBvdGhlci5cIn0sXG4gICAgICAgICAgICAgICAgICAgIHsgUmFuazogLTEwLCBUZXh0OiBcIllvdSBkb24ndCBoYXZlIG11Y2ggb2YgYSBwcmVmZXJlbmNlIGVpdGhlciB3YXksIGJ1dCB0aGlzIHNpZGUgc291bmRzIGEgYml0IG1vcmUgbGlrZWx5LlwifSxcbiAgICAgICAgICAgICAgICAgICAgeyBSYW5rOiAxMCwgVGV4dDogXCJZb3UgZG9uJ3QgaGF2ZSBtdWNoIG9mIGEgcHJlZmVyZW5jZSBlaXRoZXIgd2F5LCBidXQgdGhpcyBzaWRlIHNvdW5kcyBhIGJpdCBtb3JlIGxpa2VseS5cIn0sXG4gICAgICAgICAgICAgICAgICAgIHsgUmFuazogMjAsIFRleHQ6IFwiVGhpcyBpcyBhIGdvb2QgZGVmYXVsdCBjaG9pY2UgZm9yIHlvdSwgYnV0IHRpbWUgYW5kIGNpcmN1bXN0YW5jZSBjb3VsZCBlYXNpbHkgZmluZCB5b3UgZG9pbmcgdGhlIG90aGVyLlwifSxcbiAgICAgICAgICAgICAgICAgICAgeyBSYW5rOiAzMCwgVGV4dDogXCJUaGlzIGlzIHlvdXIgbW9zdCBjb21tb24gYmVoYXZpb3IsIGJ1dCB0aGVyZSBhcmUgZGVmaW5pdGVseSB0aW1lcyB5b3UndmUgZG9uZSB0aGUgb3Bwb3NpdGUuXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7IFJhbms6IDQwLCBUZXh0OiBcIllvdSBjYW4gdGhpbmsgb2YgY2FzZXMgd2hlcmUgeW91IGhhdmUgZG9uZSB0aGluZ3MgdGhlIG90aGVyIHdheSwgYnV0IG5vdCB1bmRlciBub3JtYWwgY2lyY3Vtc3RhbmNlcy4gXCJ9LFxuICAgICAgICAgICAgICAgICAgICB7IFJhbms6IDQ5LCBUZXh0OiBcIlRoZXJlIG1heSBiZSBhIHBvc3NpYmxlIHNjZW5lcmlvIHdoZXJlIHRoZSByZXZlcnNlIG1heSBhcHBseSwgYnV0IGl0IHdvdWxkIGJlIHJlYWxseSByYXJlLlwifSxcbiAgICAgICAgICAgICAgICAgICAgeyBSYW5rOiA1MCwgVGV4dDogXCJZb3Ugd2lsbCBBTFdBWVMgRG8gdGhpcy4gRG9pbmcgb3RoZXJ3aXNlIGlzIGluY29uY2VpdmFibGUgdG8geW91LlwifVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNlZ21lbnRzOiB7XG4gICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIEFjdGl2ZToge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIENyZWF0ZWRCeToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24oKSB7IHJldHVybiBNZXRlb3IudXNlcklkKCk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgVGltZXNBbnN3ZXJlZDoge1xuICAgICAgICAgICAgdHlwZTogUG9sYXJTdGF0cyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQb2xhclN0YXRzKCk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgU3VtT2ZBbnN3ZXJzOiB7XG4gICAgICAgICAgICB0eXBlOiBQb2xhclN0YXRzLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBvbGFyU3RhdHMoKTsgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRlb3JNZXRob2RzOiB7XG4gICAgICAgIGdldFVzZXIoKSB7XG4gICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZE9uZSh7X2lkOnRoaXMuQ3JlYXRlZEJ5fSk7XG4gICAgICAgICAgICByZXR1cm4gdTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBhZGRBbnN3ZXIoYW5zd2VyKSB7XG4gICAgICAgICAgICBpZihhbnN3ZXIuVmFsdWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5UaW1lc0Fuc3dlcmVkLkxlZnRTdW0rKztcbiAgICAgICAgICAgICAgICB0aGlzLlN1bU9mQW5zd2Vycy5MZWZ0U3VtICs9IGFuc3dlci5WYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5UaW1lc0Fuc3dlcmVkLlJpZ2h0U3VtKys7XG4gICAgICAgICAgICAgICAgdGhpcy5TdW1PZkFuc3dlcnMuUmlnaHRTdW0gKz0gYW5zd2VyLlZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUFuc3dlcihhbnN3ZXIpIHtcbiAgICAgICAgICAgIGlmKGFuc3dlci5WYWx1ZSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVzQW5zd2VyZWQuTGVmdFN1bS0tO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuVGltZXNBbnN3ZXJlZC5MZWZ0U3VtIDw9IDApIHsgdGhpcy5UaW1lc0Fuc3dlcmVkLkxlZnRTdW0gPSAwOyB0aGlzLlN1bU9mQW5zd2Vycy5MZWZ0U3VtID0gMDsgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyB0aGlzLlN1bU9mQW5zd2Vycy5MZWZ0U3VtIC09IGFuc3dlci5WYWx1ZTsgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVzQW5zd2VyZWQuUmlnaHRTdW0tLTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLlRpbWVzQW5zd2VyZWQuUmlnaHRTdW0gPD0gMCkgeyB0aGlzLlRpbWVzQW5zd2VyZWQuUmlnaHRTdW0gPSAwOyB0aGlzLlN1bU9mQW5zd2Vycy5SaWdodFN1bSA9IDA7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgdGhpcy5TdW1PZkFuc3dlcnMuUmlnaHRTdW0gLT0gYW5zd2VyLlZhbHVlOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWxsQW5zd2VyZWRVc2VycygpIHtcbiAgICAgICAgICAgIHJldHVybiBVc2VyLmZpbmQoeyAnTXlQcm9maWxlLlVzZXJUeXBlLkFuc3dlcmVkUXVlc3Rpb25zLlF1ZXN0aW9uSUQnOnsgJGVxOiB0aGlzLl9pZCB9IH0pO1xuICAgICAgICB9LFxuICAgICAgICB1bmFuc3dlckFsbChub1NhdmUpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuYWxsQW5zd2VyZWRVc2VycygpLmZvckVhY2goZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgYiA9IHVzZXIuTXlQcm9maWxlLlVzZXJUeXBlLkFuc3dlcmVkUXVlc3Rpb25zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB1c2VyLk15UHJvZmlsZS5Vc2VyVHlwZS51bkFuc3dlclF1ZXN0aW9uKHVzZXIuTXlQcm9maWxlLlVzZXJUeXBlLmdldEFuc3dlckZvclF1ZXN0aW9uKHNlbGYuX2lkKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmKCFub1NhdmUpIHsgdXNlci5zYXZlKCk7IH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9LFxuICAgICAgICByZXNldCgpIHtcbiAgICAgICAgICAgIHRoaXMuVGltZXNBbnN3ZXJlZC5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5TdW1PZkFuc3dlcnMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBiZWhhdmlvcnM6IHtcbiAgICAgICAgdGltZXN0YW1wOiB7fSxcbiAgICAgICAgc29mdHJlbW92ZToge31cbiAgICB9LFxuICAgIHNlY3VyZWQ6IHtcbiAgICAgICAgdXBkYXRlOiBmYWxzZVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGJlZm9yZUluc2VydChlKSB7XG4gICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZE9uZSgge3VzZXJuYW1lOkRlZmF1bHRzLnVzZXIudXNlcm5hbWV9ICk7XG4gICAgICAgICAgICBVc2VyTm90aWZ5LmFkZCh7XG4gICAgICAgICAgICAgICAgdXNlcklkOiB1Ll9pZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1F1ZXN0aW9ucycsXG4gICAgICAgICAgICAgICAgYm9keTogJ05ldyBxdWVzdGlvbiBhZGRlZCcsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAncXVlc3Rpb25zOicrZS5jdXJyZW50VGFyZ2V0Ll9pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZVVwZGF0ZShlKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWyAndXBkYXRlZEF0JywgJ1RpbWVzQW5zd2VyZWQnLCAnVGltZXNBbnN3ZXJlZC5MZWZ0U3VtJywgJ1N1bU9mQW5zd2VycycsICdTdW1PZkFuc3dlcnMuTGVmdFN1bScsICdUaW1lc0Fuc3dlcmVkLlJpZ2h0U3VtJywgJ1N1bU9mQW5zd2Vycy5SaWdodFN1bScgXTtcbiAgICAgICAgICAgIGNvbnN0IGRvYyA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkTmFtZXMgPSBkb2MuZ2V0TW9kaWZpZWQoKTtcbiAgICAgICAgICAgIF8uZWFjaChmaWVsZE5hbWVzLCBmdW5jdGlvbiAoZmllbGROYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYoIU1ldGVvci5pc1NlcnZlciAmJiBhbGxvd2VkLmluZGV4T2YoZmllbGROYW1lKSA8IDAgJiYgIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCB7IFF1ZXN0aW9uLCBSZWFkaW5nLCBNeWVyc0JyaWdnc0NhdGVnb3J5IH07XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuTWV0ZW9yLnB1Ymxpc2gobnVsbCwgZnVuY3Rpb24gKCl7XG4gIHJldHVybiBNZXRlb3Iucm9sZXMuZmluZCh7fSlcbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBUZWFtR29hbCB9IGZyb20gJy4uL3RlYW1fZ29hbHMuanMnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uLy4uL3VzZXJzL3VzZXJzLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ3RlYW1Hb2Fsc0RhdGEnLCBmdW5jdGlvbiAodGVhbU5hbWUpIHtcbiAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ3ZpZXctZ29hbHMnXSwgdGVhbU5hbWUpKSB7XG4gICAgICAgIHJldHVybiBUZWFtR29hbC5maW5kKCB7dGVhbU5hbWU6IHRlYW1OYW1lfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufSk7XG5cbk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKCd0ZWFtR29hbHNVc2VycycsIGZ1bmN0aW9uICh0ZWFtTmFtZSkge1xuICAgIGlmICghUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgWydhZG1pbicsJ3ZpZXctZ29hbHMnXSwgdGVhbU5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gVGVhbUdvYWwuZmluZCgge3RlYW1OYW1lOiB0ZWFtTmFtZX0gKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IFt7XG4gICAgICAgICAgICBmaW5kKHRlYW1Hb2FsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJMaXN0ID0gdGVhbUdvYWwuYXNzaWduZWRUby5jb25jYXQodGVhbUdvYWwubWVudG9ycykuY29uY2F0KHRlYW1Hb2FsLmFkbWlucyk7XG4gICAgICAgICAgICAgICAgbGV0IGZpZWxkc09iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGZpZWxkc09ialtcIk15UHJvZmlsZS5maXJzdE5hbWVcIl0gPSAxO1xuICAgICAgICAgICAgICAgIGZpZWxkc09ialtcIk15UHJvZmlsZS5sYXN0TmFtZVwiXSA9IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVzZXIuZmluZCgge19pZDogdXNlckxpc3R9LCB7ZmllbGRzOiBmaWVsZHNPYmp9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfVxufSlcbiIsImltcG9ydCB7IFRlYW1Hb2FsIH0gZnJvbSAnLi90ZWFtX2dvYWxzLmpzJztcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgICd0ZWFtZ29hbHMuY3JlYXRlTmV3R29hbCcoZ29hbCkge1xuICAgICAgICBpZiAoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgZ29hbC50ZWFtTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZyA9IG5ldyBUZWFtR29hbChnb2FsKTtcbiAgICAgICAgcmV0dXJuIGcuc2F2ZSgpO1xuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuaW1wb3J0IHsgVXNlck5vdGlmeSB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2VyX25vdGlmeS91c2VyX25vdGlmeS5qcyc7XG5cbmNvbnN0IEdvYWxDb21tZW50ID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnR29hbENvbW1lbnQnLFxuICAgIGZpZWxkczoge1xuICAgICAgICB1c2VySWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gTWV0ZW9yLnVzZXJJZCgpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jb25zdCBUZWFtR29hbCA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ1RlYW1Hb2FsJyxcbiAgICBjb2xsZWN0aW9uOiBuZXcgTW9uZ28uQ29sbGVjdGlvbigndGVhbV9nb2FsJyksXG4gICAgZmllbGRzOiB7XG4gICAgICAgIHRlYW1OYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmVudElkOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBhc3NpZ25lZFRvOiB7XG4gICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIG1lbnRvcnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgYXNzaWduZWRUb1N0cjoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdHJhbnNpZW50OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG1lbnRvcnNTdHI6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHRyYW5zaWVudDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBhZG1pbnNTdHI6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHRyYW5zaWVudDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgcmVhY2hlZERhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzdGFydERhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBkdWVEYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcmV2aWV3RGF0ZToge1xuICAgICAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJldmlld2VkT25EYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZ29hbENvbW1lbnRzOiB7XG4gICAgICAgICAgICB0eXBlOiBbR29hbENvbW1lbnRdLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgcmV2aWV3Q29tbWVudHM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtHb2FsQ29tbWVudF0sXG4gICAgICAgICAgICBkZWZhdWx0OiBbXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBiZWhhdmlvcnM6IHtcbiAgICAgICAgdGltZXN0YW1wOiB7fVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBnZXRHb2FsUm9sZUdyb3VwKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVhbU5hbWUgKyAnKycgKyB0aGlzLl9pZDtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcklzQWRtaW4oKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdhZG1pbicsIHRoaXMudGVhbU5hbWUpXG4gICAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgJ2FkbWluJywgdGhpcy5nZXRHb2FsUm9sZUdyb3VwKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvL3VzZXIgaXMgZWl0aGVyIGEgZ2xvYmFsIGFkbWluLCBhIHRlYW0gYWRtaW4sIG9yIGEgZ29hbCBhZG1pblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJJc01lbnRvcigpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnbWVudG9yJywgdGhpcy5nZXRHb2FsUm9sZUdyb3VwKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvL3VzZXIgaXMgYSBtZW50b3IgZm9yIHRoaXMgZ29hbFxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJJc0Fzc2lnbmVkKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdhc3NpZ25lZCcsIHRoaXMuZ2V0R29hbFJvbGVHcm91cCgpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy91c2VyIGlzIGFzc2lnbmVkIHRvIHRoaXMgZ29hbFxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldERhdGVGaWVsZChmaWVsZE5hbWUsIHJkYXRlKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiByZGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICEocmRhdGUgaW5zdGFuY2VvZiBEYXRlKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzW2ZpZWxkTmFtZV0gPSByZGF0ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBnZXRVc2VyRnVsbE5hbWVYKHVzZXJJZCkge1xuICAgICAgICAgICAgbGV0IHUgPSBVc2VyLmZpbmRPbmUoIHtfaWQ6IHVzZXJJZH0gKTtcbiAgICAgICAgICAgIGlmICghdSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk1pY2hhZWxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBuYW1lID0gdS5NeVByb2ZpbGUuZmlyc3ROYW1lICsgXCIgXCIgKyB1Lk15UHJvZmlsZS5sYXN0TmFtZTtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICB9LFxuICAgICAgICBoYXNNb2RpZnlQZXJtKGZpZWxkTmFtZSkge1xuICAgICAgICAgICAgc3dpdGNoIChmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zLW9ubHkgZmllbGRzXG4gICAgICAgICAgICBjYXNlICdkdWVEYXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ3N0YXJ0RGF0ZSc6XG4gICAgICAgICAgICBjYXNlICdyZWFjaGVkRGF0ZSc6XG4gICAgICAgICAgICBjYXNlICdyZXZpZXdEYXRlJzpcbiAgICAgICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2NyaXB0aW9uJzpcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbmVkVG8nOlxuICAgICAgICAgICAgY2FzZSAnbWVudG9ycyc6XG4gICAgICAgICAgICBjYXNlICdhZG1pbnMnOlxuICAgICAgICAgICAgY2FzZSAnc3ViZ29hbHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJc0FkbWluKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvL2FkbWlucyBhbmQgbWVudG9yc1xuICAgICAgICAgICAgY2FzZSAncmV2aWV3ZWRPbkRhdGUnOlxuICAgICAgICAgICAgY2FzZSAncmV2aWV3Q29tbWVudHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJc0FkbWluKCkgfHwgdGhpcy51c2VySXNNZW50b3IoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vYW55b25lIGFzc2lnbmVkIHRvIHRoZSBnb2FsXG4gICAgICAgICAgICBjYXNlICdnb2FsQ29tbWVudHMnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJc0FkbWluKCkgfHwgdGhpcy51c2VySXNNZW50b3IoKSB8fCB0aGlzLnVzZXJJc0Fzc2lnbmVkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbm90aWZ5TmV3KG9sZExpc3QsbmV3TGlzdCkge1xuICAgICAgICAgICAgbGV0IGRpZmZMaXN0ID0gXy5kaWZmZXJlbmNlKG5ld0xpc3Qsb2xkTGlzdCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgVXNlck5vdGlmeS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IGRpZmZMaXN0W2ldLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1RlYW0gR29hbHMnLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiAnWW91IGhhdmUgYmVlbiBhZGRlZCB0byBnb2FsICcrdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndGVhbWdvYWxzOicrdGhpcy50ZWFtTmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgYmVmb3JlU2F2ZShlKSB7XG4gICAgICAgICAgICBsZXQgZWdvYWwgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAgICAgICAgIC8vYW55IHVzZXIgYWRkZWQgdG8gYSBnb2FsIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gdGhlICd2aWV3LWdvYWxzJyByb2xlIGZvciB0aGUgdGVhbVxuICAgICAgICAgICAgLy9pZiB0aGV5IGFyZSBhbHJlYWR5IGluIHRoYXQgcm9sZSwgdGhpcyBzaG91bGQganVzdCBpZ25vcmUgdGhlIHJlZHVuZGFudCBhZGRVc2VyXG4gICAgICAgICAgICBsZXQgZmxkcyA9IFtcImFzc2lnbmVkVG9cIixcIm1lbnRvcnNcIixcImFkbWluc1wiXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZmxkcykge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVnb2FsW2ZsZHNbaV1dKSAmJiBlZ29hbFtmbGRzW2ldXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyhlZ29hbFtmbGRzW2ldXSwgJ3ZpZXctZ29hbHMnLCBlZ29hbC50ZWFtTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgbWV0ZW9yTWV0aG9kczoge1xuICAgICAgICBzZXREdWVEYXRlKHJkYXRlKSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLnNldERhdGVGaWVsZChcImR1ZURhdGVcIiwgcmRhdGUpICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbnZhbGlkIGRhdGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldEdvYWxSZWFjaGVkKHJkYXRlKSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLnNldERhdGVGaWVsZChcInJlYWNoZWREYXRlXCIsIHJkYXRlKSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW52YWxpZCBkYXRlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRSZXZpZXdEYXRlKHJkYXRlKSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLnNldERhdGVGaWVsZChcInJldmlld0RhdGVcIiwgcmRhdGUpICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJJbnZhbGlkIGRhdGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldEdvYWxSZXZpZXdlZE9uKHJkYXRlKSB7XG4gICAgICAgICAgICAvL21lbnRvcnMgYW5kIGFkbWluc1xuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICYmICF0aGlzLnVzZXJJc01lbnRvcigpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLnNldERhdGVGaWVsZChcInJldmlld2VkT25EYXRlXCIsIHJkYXRlKSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiSW52YWxpZCBkYXRlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhZGRDb21tZW50KGNvbW1lbnRUeHQpIHtcbiAgICAgICAgICAgIC8vbWVudG9ycywgYWRtaW5zLCBhbmQgYXNzaWduZWVzXG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgJiYgIXRoaXMudXNlcklzTWVudG9yKCkgJiYgIXRoaXMudXNlcklzQXNzaWduZWQoKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdvYWxDb21tZW50cy5wdXNoKFxuICAgICAgICAgICAgICAgIG5ldyBHb2FsQ29tbWVudCgge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY29tbWVudFR4dCxcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkUmV2aWV3Q29tbWVudChjb21tZW50VHh0KSB7XG4gICAgICAgICAgICAvL21lbnRvcnMgYW5kIGFkbWluc1xuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICYmICF0aGlzLnVzZXJJc01lbnRvcigpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmV2aWV3Q29tbWVudHMucHVzaChcbiAgICAgICAgICAgICAgICBuZXcgR29hbENvbW1lbnQoIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNvbW1lbnRUeHQsXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZU5ld0dvYWwoKSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9cbiAgICAgICAgfSxcbiAgICAgICAgc2V0VGl0bGUodGl0bGUpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RGVzY3JpcHRpb24oZGVzY3IpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3I7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0QXNzaWduZWRUbyh1bGlzdCkge1xuICAgICAgICAgICAgLy9hZG1pbnMgb25seVxuICAgICAgICAgICAgaWYgKCAhdGhpcy51c2VySXNBZG1pbigpICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5TmV3KHRoaXMuYXNzaWduZWRUbyx1bGlzdCk7XG4gICAgICAgICAgICB0aGlzLmFzc2lnbmVkVG8gPSB1bGlzdDtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRNZW50b3JzKHVsaXN0KSB7XG4gICAgICAgICAgICAvL2FkbWlucyBvbmx5XG4gICAgICAgICAgICBpZiAoICF0aGlzLnVzZXJJc0FkbWluKCkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm90aWZ5TmV3KHRoaXMubWVudG9ycyx1bGlzdCk7XG4gICAgICAgICAgICB0aGlzLm1lbnRvcnMgPSB1bGlzdDtcbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBZG1pbnModWxpc3QpIHtcbiAgICAgICAgICAgIC8vYWRtaW5zIG9ubHlcbiAgICAgICAgICAgIGlmICggIXRoaXMudXNlcklzQWRtaW4oKSApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm5vdGlmeU5ldyh0aGlzLmFkbWlucyx1bGlzdCk7XG4gICAgICAgICAgICB0aGlzLmFkbWlucyA9IHVsaXN0O1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVzZXJGdWxsTmFtZSh1c2VySWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGludm9jYXRpb24gPSBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLmdldCgpO1xuICAgICAgICAgICAgaWYgKGludm9jYXRpb24uaXNTaW11bGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiR2VvcmdlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZE9uZSgge19pZDogdXNlcklkfSApO1xuICAgICAgICAgICAgaWYgKCF1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTWljaGFlbFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5hbWUgPSB1Lk15UHJvZmlsZS5maXJzdE5hbWUgKyBcIiBcIiArIHUuTXlQcm9maWxlLmxhc3ROYW1lO1xuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZUZyb21PYmoodXBkT2JqKSB7XG4gICAgICAgICAgICBsZXQgcGVybUVycm9yID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGZsZCBpbiB1cGRPYmopIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICB0aGlzW2ZsZF0gIT09IHVwZE9ialtmbGRdIHx8XG4gICAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheSh1cGRPYmpbZmxkXSkgJiYgXy5pc0VxdWFsKHRoaXNbZmxkXSwgdXBkT2JqW2ZsZF0pKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNNb2RpZnlQZXJtKGZsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbGQgPT09IFwiYXNzaWduZWRUb1wiIHx8IGZsZCA9PT0gXCJtZW50b3JzXCIgfHwgZmxkID09PSBcImFkbWluc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlOZXcodGhpc1tmbGRdLHVwZE9ialtmbGRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbZmxkXSA9IHVwZE9ialtmbGRdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVybUVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICAgICAgaWYgKHBlcm1FcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IHsgVGVhbUdvYWwsIEdvYWxDb21tZW50IH07XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFRlYW0gfSBmcm9tICcuLi90ZWFtcy5qcyc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vLi4vdXNlcnMvdXNlcnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgndGVhbXNEYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudXNlcklkKSB7XG4gICAgICAgIHJldHVybiBUZWFtLmZpbmQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgICAgICAgIHtQdWJsaWM6IHRydWV9LFxuICAgICAgICAgICAgICAgICAgICB7TWVtYmVyczogTWV0ZW9yLnVzZXJJZCgpfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7IE5hbWU6IDEsIERlc2NyaXB0aW9uOiAxLCBDcmVhdGVkQnk6IDEsIEljb246IDEsIEljb242NDogMSwgSWNvblR5cGU6IDEgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbIF07XG4gICAgfVxufSk7XG5cbk1ldGVvci5wdWJsaXNoKCd0ZWFtc01lbWJlck9mTGlzdCcsICh1c2VySWQpID0+IHtcbiAgICAvLyBpZiAodXNlcklkID09IE1ldGVvci51c2VySWQoKSB8fCBSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCdhZG1pbicsIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgcmV0dXJuIFRlYW0uZmluZCgge01lbWJlcnM6IHVzZXJJZH0gKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgIHJldHVybiBbXTtcbiAgICAvLyB9XG59KTtcblxuXG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSgndGVhbU1lbWJlckxpc3QnLCAodXNlcklkKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZCgpIHtcbiAgICAgICAgICAgIGxldCB1ID0gVXNlci5maW5kT25lKCB7X2lkOiBNZXRlb3IudXNlcklkKCl9ICk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdGVhbXNMaXN0ID0gW107XG4gICAgICAgICAgICBfLmZvckVhY2godS5yb2xlcywgKHJvbGVzLCB0ZWFtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJvbGVzLmluZGV4T2YoJ2FkbWluJykgPiAtMSB8fCByb2xlcy5pbmRleE9mKCd2aWV3LW1lbWJlcnMnKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZWFtc0xpc3QucHVzaCh0ZWFtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxldCBmaWVsZHNPYmogPSB7XG4gICAgICAgICAgICAgICAgTmFtZTogMSxcbiAgICAgICAgICAgICAgICBEZXNjcmlwdGlvbjogMSxcbiAgICAgICAgICAgICAgICBNZW1iZXJzOiAxLFxuICAgICAgICAgICAgICAgIENyZWF0ZWRCeTogMSxcbiAgICAgICAgICAgICAgICBJY29uOiAxLFxuICAgICAgICAgICAgICAgIEljb242NDogMSxcbiAgICAgICAgICAgICAgICBJY29uVHlwZTogMVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIFRlYW0uZmluZCgge05hbWU6IHsnJGluJzogdGVhbXNMaXN0fX0sIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGZpZWxkc09ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbe1xuICAgICAgICAgICAgZmluZCh0ZWFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBSb2xlcy51c2VySXNJblJvbGUodXNlcklkLCBbJ2FkbWluJywndmlldy1tZW1iZXJzJ10sIHRlYW0uTmFtZSkgfHwgUm9sZXMudXNlcklzSW5Sb2xlKHVzZXJJZCwgJ2FkbWluJywgUm9sZXMuR0xPQkFMX0dST1VQKSApIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtYmVyTGlzdCA9IHRlYW0uTWVtYmVycztcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVxUXVlcnkgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpZWxkc09iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHNPYmpbXCJNeVByb2ZpbGUuZmlyc3ROYW1lXCJdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzT2JqW1wiTXlQcm9maWxlLmxhc3ROYW1lXCJdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzT2JqW1wicm9sZXMuXCIrdGVhbS5OYW1lXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkc09ialtcInRlYW1zXCJdID0gMTtcblxuICAgICAgICAgICAgICAgICAgICByZXFRdWVyeVsncm9sZXMuJyt0ZWFtLk5hbWVdID0gXCJ1c2VyLWpvaW4tcmVxdWVzdFwiO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBfaWQ6IHsgJyRpbic6IG1lbWJlckxpc3QgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcVF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sIHsgZmllbGRzOiBmaWVsZHNPYmogfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHtUZWFtIH0gZnJvbSAnLi90ZWFtcy5qcyc7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgICAndGVhbS5jcmVhdGVOZXdUZWFtJyhuZXdUZWFtKSB7XG4gICAgICAgIGlmICggIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdUZWFtLkNyZWF0ZWRCeSA9IE1ldGVvci51c2VySWQoKTtcbiAgICAgICAgbGV0IHQgPSBuZXcgVGVhbShuZXdUZWFtKTtcbiAgICAgICAgcmV0dXJuIHQuc2F2ZSgpO1xuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBDbGFzcywgRW51bSB9IGZyb20gJ21ldGVvci9qYWdpOmFzdHJvbm9teSc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tICcvaW1wb3J0cy9zdGFydHVwL2JvdGgvZGVmYXVsdHMuanMnO1xuaW1wb3J0IHsgVXNlck5vdGlmeSB9IGZyb20gJy9pbXBvcnRzL2FwaS91c2VyX25vdGlmeS91c2VyX25vdGlmeS5qcyc7XG5jb25zdCBEZWZhdWx0VGVhbUlEID0gXCJOQ3V5cENYTjQ3S3JTVGVYaFwiO1xuXG5jb25zdCBUZWFtSWNvbiA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogXCJUZWFtSWNvblwiLFxuICAgIGZpZWxkczoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ2ltYWdlL3BuZydcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jb25zdCBUZWFtID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiBcIlRlYW1cIixcbiAgICBjb2xsZWN0aW9uOiBuZXcgTW9uZ28uQ29sbGVjdGlvbigndGVhbXMnKSxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1dob2EhIFRoZSBuby1uYW1lIHRlYW0/J1xuICAgICAgICB9LFxuICAgICAgICBEZXNjcmlwdGlvbjoge1xuICAgICAgICBcdHR5cGU6IFN0cmluZyxcbiAgICAgICAgXHRkZWZhdWx0OiAnVGhpcyB0ZWFtIGlzIG5vbmRlc2NyaXB0LidcbiAgICAgICAgfSxcbiAgICAgICAgSWNvbjY0OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBJY29uVHlwZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXV0OiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIEljb246IHtcbiAgICAgICAgICAgIHR5cGU6IFRlYW1JY29uLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgVGVhbUljb24oKTsgfVxuICAgICAgICB9LFxuICAgICAgICBQdWJsaWM6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIE1lbWJlcnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgQWN0aXZlOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgQ3JlYXRlZEJ5OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudXNlcklkOyB9XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBpbmRleGVzOiB7XG4gICAgICAgIG5hbWVJbmRleDoge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgTmFtZTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB1bmlxdWU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGVvck1ldGhvZHM6IHtcbiAgICAgICAgdXNlclJlcXVlc3RKb2luKCkge1xuICAgICAgICAgICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKE1ldGVvci51c2VySWQoKSwgJ3VzZXItam9pbi1yZXF1ZXN0JywgdGhpcy5OYW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5SZXF1ZXN0VXNlckpvaW4odXNlcikge1xuICAgICAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdhZG1pbicsIHRoaXMuTmFtZSkgJiYgIVJvbGVzLnVzZXJJc0luUm9sZSh1c2VyLCAnbWVtYmVyJywgdGhpcy5OYW1lKSkge1xuICAgICAgICAgICAgICAgIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1c2VyLCAnYWRtaW4tam9pbi1yZXF1ZXN0JywgdGhpcy5OYW1lKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgVXNlck5vdGlmeS5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdUZWFtcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiAnUmVjZWl2ZWQgam9pbiByZXF1ZXN0IGZvciB0ZWFtICcgKyB0aGlzLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd0ZWFtczonK3RoaXMuTmFtZS5zcGxpdCgnICcpLmpvaW4oJy0nKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJBY2NlcHRKb2luKCkge1xuICAgICAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdhZG1pbi1qb2luLXJlcXVlc3QnLCB0aGlzLk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgUm9sZXMucmVtb3ZlVXNlcnNGcm9tUm9sZXMoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4tam9pbi1yZXF1ZXN0JywgdGhpcy5OYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFVzZXJzKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJEZWNsaW5lSm9pbigpIHtcbiAgICAgICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4tam9pbi1yZXF1ZXN0JywgdGhpcy5OYW1lKSkge1xuICAgICAgICAgICAgICAgIFJvbGVzLnJlbW92ZVVzZXJzRnJvbVJvbGVzKE1ldGVvci51c2VySWQoKSwgJ2FkbWluLWpvaW4tcmVxdWVzdCcsIHRoaXMuTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluQWNjZXB0Sm9pbih1c2VySWQpIHtcbiAgICAgICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4nLCB0aGlzLk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgUm9sZXMucmVtb3ZlVXNlcnNGcm9tUm9sZXModXNlcklkLCAndXNlci1qb2luLXJlcXVlc3QnLCB0aGlzLk5hbWUpO1xuICAgICAgICAgICAgICAgIC8vUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHVzZXJJZCwgJ21lbWJlcicsIHRoaXMuTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRVc2Vycyh1c2VySWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhZG1pblJlamVjdEpvaW4odXNlcklkKSB7XG4gICAgICAgICAgICBpZiAoUm9sZXMudXNlcklzSW5Sb2xlKE1ldGVvci51c2VySWQoKSwgJ2FkbWluJywgdGhpcy5OYW1lKSkge1xuICAgICAgICAgICAgICAgIFJvbGVzLnJlbW92ZVVzZXJzRnJvbVJvbGVzKHVzZXJJZCwgJ3VzZXItam9pbi1yZXF1ZXN0JywgdGhpcy5OYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWRkUm9sZSh1c2VySWQsIHJvbGUpIHtcbiAgICAgICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4nLCB0aGlzLk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHVzZXJJZCwgcm9sZSwgdGhpcy5OYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlUm9sZSh1c2VySWQsIHJvbGUpIHtcbiAgICAgICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4nLCB0aGlzLk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgUm9sZXMucmVtb3ZlVXNlcnNGcm9tUm9sZXModXNlcklkLCByb2xlLCB0aGlzLk5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVGcm9tT2JqKHVwZE9iaikge1xuICAgICAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdhZG1pbicsIHRoaXMuTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBmbGQgaW4gdXBkT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcIkljb242NFwiICE9PSBmbGQgJiYgXCJJY29uVHlwZVwiICE9PSBmbGQgJiYgXCJJY29uXCIgIT09IGZsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tmbGRdID0gdXBkT2JqW2ZsZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVwbG9hZEljb24oZmlsZUluZm8sIGZpbGVEYXRhKSB7XG4gICAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2U2NEltYWdlID0gbmV3IEJ1ZmZlcihmaWxlRGF0YSwgJ2JpbmFyeScpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLkljb242NCA9IGJhc2U2NEltYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuSWNvblR5cGUgPSAnaW1hZ2UvcG5nJztcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBhZGRVc2Vycyh1c2Vycykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB1c2VycyA9IFt1c2Vyc107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYWRtaW4gbGlzdCBoYXMgdG8gYmUgZmlsdGVyZWQgYmVjYXVzZSBnZXRVc2Vyc0luUm9sZSBpbmNsdWRlcyBhZG1pbiBpbiBHTE9CQUxfR1JPVVBcbiAgICAgICAgICAgIGxldCBncm91cEFkbWluTGlzdCA9IFJvbGVzLmdldFVzZXJzSW5Sb2xlKCdhZG1pbicsIHRoaXMuTmFtZSkuZmV0Y2goKS5maWx0ZXIoICh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHVzZXIucm9sZXMgJiZcbiAgICAgICAgICAgICAgICAgICAgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHVzZXIucm9sZXNbdGhpcy5OYW1lXSAmJlxuICAgICAgICAgICAgICAgICAgICB1c2VyLnJvbGVzW3RoaXMuTmFtZV0uaW5kZXhPZignYWRtaW4nKSA+IC0xXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuTWVtYmVycy5pbmRleE9mKHVzZXJzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZW1iZXJzLnB1c2goIHVzZXJzW2ldICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjdXJyVXNlclJvbGVzID0gWydtZW1iZXInXTtcbiAgICAgICAgICAgICAgICAvL1JvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1c2Vyc1tpXSwgJ21lbWJlcicsIHRoaXMuTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAvL2lmIHRlYW0gZG9lc24ndCBoYXZlIGFuIGFkbWluLCB0aGUgZmlyc3QgdXNlciBhZGRlZCBiZWNvbWVzIGFkbWluXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCAmJiBncm91cEFkbWluTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL1JvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1c2Vyc1tpXSwgJ2FkbWluJywgdGhpcy5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY3VyclVzZXJSb2xlcy5wdXNoKCdhZG1pbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHVzZXJzW2ldLCBEZWZhdWx0cy5yb2xlLm5hbWUsIHRoaXMuTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJVc2VyUm9sZXMucHVzaChEZWZhdWx0cy5yb2xlLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModXNlcnNbaV0sIGN1cnJVc2VyUm9sZXMsIHRoaXMuTmFtZSk7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBsZXQgdSA9IFVzZXIuZmluZE9uZSgge19pZDogdXNlcnNbaV19ICk7XG4gICAgICAgICAgICAgICAgaWYgKHUgJiYgdS50ZWFtcy5pbmRleE9mKHRoaXMuTmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHUudGVhbXMucHVzaCh0aGlzLk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB1LnNhdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVVc2Vycyh1c2Vycykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB1c2VycyA9IFt1c2Vyc107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlVXNlcnNGcm9tVGVhbVJvbGVzKHVzZXJzLCByb2xlcykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1c2VycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB1c2VycyA9IFt1c2Vyc107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvbGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJvbGVzID0gW3JvbGVzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9pZiByZW1vdmluZyB0aGUgJ21lbWJlcicgcm9sZSBmcm9tIHVzZXJzLCBjb21wbGV0ZWx5IHJlbW92ZSB0aGVtIGZyb20gYWxsIHJvbGVzIGFuZCBmcm9tIHRoZSBncm91cFxuICAgICAgICAgICAgaWYgKHJvbGVzLmluZGV4T2YoJ21lbWJlcicpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVXNlcnModXNlcnMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgYmVoYXZpb3JzOiB7XG4gICAgICAgIHRpbWVzdGFtcDoge30sXG4gICAgICAgIHNvZnRyZW1vdmU6IHt9XG4gICAgfSxcbiAgICBzZWN1cmVkOiB7XG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgYWZ0ZXJJbml0KGUpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZVNhdmUoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJiZWZvcmUgc2F2ZSBUZWFtXCIsIGUuY3VycmVudFRhcmdldC5OYW1lLCBlLmN1cnJlbnRUYXJnZXQuTWVtYmVycyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuVGVhbS5EZWZhdWx0ID0gVGVhbS5maW5kT25lKHtfaWQ6RGVmYXVsdFRlYW1JRH0pO1xuaWYgKHR5cGVvZiBUZWFtLkRlZmF1bHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBUZWFtLkRlZmF1bHQgPSBuZXcgVGVhbSh7XG4gICAgICAgIF9pZDpEZWZhdWx0VGVhbUlELFxuICAgICAgICBOYW1lOiAnTm8gVGVhbScsXG4gICAgICAgIEFjdGl2ZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgVGVhbS5EZWZhdWx0LkNyZWF0ZWRCeSA9ICdra2NEWUgzaXg0ZjRMYjVxayc7XG4gICAgICAgIC8vY29uc29sZS5sb2coVGVhbS5EZWZhdWx0KTtcbiAgICAgICAgLy9UZWFtLkRlZmF1bHQuc2F2ZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgVGVhbSxUZWFtSWNvbiB9O1xuIiwiLy8gQWxsIHR5cGUtcmVhZGluZy1yZWxhdGVkIHB1YmxpY2F0aW9uc1xuXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFR5cGVSZWFkaW5nLCBSZWFkaW5nUmFuZ2UgfSBmcm9tICcuLi90eXBlX3JlYWRpbmdzLmpzJztcbmltcG9ydCB7IFVzZXIsIE15ZXJzQnJpZ2dzLCBBbnN3ZXIsIFVzZXJUeXBlLCBQcm9maWxlIH0gZnJvbSAnLi4vLi4vdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgTXllcnNCcmlnZ3NDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi9xdWVzdGlvbnMvcXVlc3Rpb25zLmpzXCI7XG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSgndHlwZXJlYWRpbmdzLmdldEFsbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHsgcmV0dXJuIHRoaXMucmVhZHkoKTsgfVxuICAgIHZhciBxcnkgPSB7fTtcbiAgICBjb25zb2xlLmxvZyhcIlB1YmxpY2F0aW9uICd0eXBlcmVhZGluZ3MuZ2V0QWxsJzogXCIsIHRoaXMudXNlcklkLCBxcnkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gVHlwZVJlYWRpbmcuZmluZChxcnksIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzb3J0OiB7IFwiVHlwZVJlYWRpbmdDYXRlZ29yaWVzLlJhbmdlLmxvd1wiOjEsIFwiVHlwZVJlYWRpbmdDYXRlZ29yaWVzLlJhbmdlLkRlbHRhXCI6IC0xIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgICAgIGZpbmQodHlwZXJlYWRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlci5maW5kKHsgX2lkOiB0eXBlcmVhZGluZy5DcmVhdGVkQnkgfSwgeyBsaW1pdDogMSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9O1xufSk7XG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSgndHlwZXJlYWRpbmdzLmJ5Q2F0ZWdvcnknLCBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHsgcmV0dXJuIHRoaXMucmVhZHkoKTsgfVxuICAgIHZhciBxcnkgPSB7fTtcbiAgICBxcnlbXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuXCIrY2F0ZWdvcnkrXCIuUmFuZ2UubG93XCJdID0geyAkZ3RlOiAtMTAwIH07XG4gICAgY29uc29sZS5sb2coXCJQdWJsaWNhdGlvbiAndHlwZXJlYWRpbmdzLmJ5Q2F0ZWdvcnknOiBcIiwgY2F0ZWdvcnksIHRoaXMudXNlcklkLCBxcnkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmQoKSB7XG4gICAgICAgICAgICByZXR1cm4gVHlwZVJlYWRpbmcuZmluZChxcnksIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzb3J0OiB7IFwiVHlwZVJlYWRpbmdDYXRlZ29yaWVzLlJhbmdlLmxvd1wiOjEsXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuUmFuZ2UuRGVsdGFcIjogLTEgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbe1xuICAgICAgICAgICAgZmluZCh0eXBlcmVhZGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyLmZpbmQoeyBfaWQ6IHR5cGVyZWFkaW5nLkNyZWF0ZWRCeSB9LCB7IGxpbWl0OiAxIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XVxuICAgIH07XG59KTtcbk1ldGVvci5wdWJsaXNoKCd0eXBlcmVhZGluZ3MubXlSZWFkaW5ncycsIGZ1bmN0aW9uICh1c2VySWQsIHJlZnJlc2gpIHtcbiAgICAvL2NvbnNvbGUubG9nKHVzZXJJZCwgdGhpcy51c2VySWQpO1xuICAgIC8vaWYodGhpcy51c2VySWQgIT09IHVzZXJJZCAmJiAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHsgcmV0dXJuIHRoaXMucmVhZHkoKTsgfVxuICAgIGlmICh0eXBlb2YgdXNlcklkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiUHVibGljYXRpb24gJ3R5cGVyZWFkaW5ncy5teVJlYWRpbmdzJzogXCIsIHRoaXMudXNlcklkLCB1c2VySWQpO1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBsZXQgdXNlciA9IFVzZXIuZmluZE9uZSh7X2lkOnVzZXJJZH0pO1xuXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhzZWxmLCB1c2VyKTtcbiAgICBsZXQgb2JzZXJ2ZSA9IHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGlkLCBmaWVsZHMpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkZWQoJ3R5cGVfcmVhZGluZ3MnLCBpZCwgZmllbGRzKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24oaWQsIGZpZWxkcykge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVkKFwidHlwZV9yZWFkaW5nc1wiLCBpZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZWQoJ3R5cGVfcmVhZGluZ3MnLCBpZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGxldCB1c2VyVHlwZSA9IHVzZXIuTXlQcm9maWxlLlVzZXJUeXBlLlBlcnNvbmFsaXR5O1xuICAgIGxldCBoYW5kbGUgPSBUeXBlUmVhZGluZy5maW5kKHtcbiAgICAgICAgJGFuZCA6IFtcbiAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgeyAkb3IgOiBbIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMFwiOiB7ICR0eXBlOiAxMCB9IH0sIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMFwiIDogeyRleGlzdHM6IGZhbHNlfX0gXSB9LFxuICAgICAgICAgICAgICAgIHsgJGFuZCA6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAnVHlwZVJlYWRpbmdDYXRlZ29yaWVzLjAuUmFuZ2UubG93JyA6IHsgJGx0ZTogdXNlclR5cGVbJ0lFJ10uVmFsdWUgfX0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ1R5cGVSZWFkaW5nQ2F0ZWdvcmllcy4wLlJhbmdlLmhpZ2gnIDogeyAkZ3RlOiB1c2VyVHlwZVsnSUUnXS5WYWx1ZSB9fVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfSxcbiAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgeyAkb3IgOiBbIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMVwiOiB7ICR0eXBlOiAxMCB9IH0sIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMVwiIDogeyRleGlzdHM6IGZhbHNlfX0gXSB9LFxuICAgICAgICAgICAgICAgIHsgJGFuZCA6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAnVHlwZVJlYWRpbmdDYXRlZ29yaWVzLjEuUmFuZ2UubG93JyA6IHsgJGx0ZTogdXNlclR5cGVbJ05TJ10uVmFsdWUgfX0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ1R5cGVSZWFkaW5nQ2F0ZWdvcmllcy4xLlJhbmdlLmhpZ2gnIDogeyAkZ3RlOiB1c2VyVHlwZVsnTlMnXS5WYWx1ZSB9fVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfSxcbiAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgeyAkb3IgOiBbIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMlwiOiB7ICR0eXBlOiAxMCB9IH0sIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuMlwiIDogeyRleGlzdHM6IGZhbHNlfX0gXSB9LFxuICAgICAgICAgICAgICAgIHsgJGFuZCA6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAnVHlwZVJlYWRpbmdDYXRlZ29yaWVzLjIuUmFuZ2UubG93JyA6IHsgJGx0ZTogdXNlclR5cGVbJ1RGJ10uVmFsdWUgfX0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ1R5cGVSZWFkaW5nQ2F0ZWdvcmllcy4yLlJhbmdlLmhpZ2gnIDogeyAkZ3RlOiB1c2VyVHlwZVsnVEYnXS5WYWx1ZSB9fVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfSxcbiAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgeyAkb3IgOiBbIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuM1wiOiB7ICR0eXBlOiAxMCB9IH0sIHsgXCJUeXBlUmVhZGluZ0NhdGVnb3JpZXMuM1wiIDogeyRleGlzdHM6IGZhbHNlfX0gXSB9LFxuICAgICAgICAgICAgICAgIHsgJGFuZCA6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAnVHlwZVJlYWRpbmdDYXRlZ29yaWVzLjMuUmFuZ2UubG93JyA6IHsgJGx0ZTogdXNlclR5cGVbJ0pQJ10uVmFsdWUgfX0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ1R5cGVSZWFkaW5nQ2F0ZWdvcmllcy4zLlJhbmdlLmhpZ2gnIDogeyAkZ3RlOiB1c2VyVHlwZVsnSlAnXS5WYWx1ZSB9fVxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICBdfSxcbiAgICAgICAgICAgIHsgJ0NhdGVnb3JpZXMuQ2F0ZWdvcmllcyc6IHsgJGVsZW1NYXRjaDogeyAkaW46IHVzZXIuTXlQcm9maWxlLkNhdGVnb3JpZXMuQ2F0ZWdvcmllcyB9IH0gfSxcbiAgICAgICAgICAgIHsgJ0VuYWJsZWQnOiB0cnVlIH1cbiAgICAgICAgXVxuICAgIH0se1xuICAgICAgICBkZWZhdWx0czogdHJ1ZSxcbiAgICAgICAgc29ydDogeyAnVHlwZVJlYWRpbmdDYXRlZ29yaWVzLk15ZXJzQnJpZ2dzQ2F0ZWdvcnknOjEsICdUeXBlUmVhZGluZ0NhdGVnb3JpZXMuUmFuZ2UuRGVsdGEnOiAtMSB9XG4gICAgfSkub2JzZXJ2ZUNoYW5nZXMob2JzZXJ2ZSk7XG5cbiAgICBzZWxmLnJlYWR5KCk7XG4gICAgc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgVHlwZVJlYWRpbmcsIFJlYWRpbmdSYW5nZSwgVHlwZVJlYWRpbmdDYXRlZ29yeSwgVHlwZVJlYWRpbmdDYXRlZ29yaWVzIH0gZnJvbSAnLi90eXBlX3JlYWRpbmdzLmpzJztcbmltcG9ydCB7IFVzZXIsIE15ZXJzQnJpZ2dzLCBBbnN3ZXIsIFVzZXJUeXBlLCBQcm9maWxlIH0gZnJvbSAnLi4vdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgTXllcnNCcmlnZ3NDYXRlZ29yeSB9IGZyb20gXCIuLi9xdWVzdGlvbnMvcXVlc3Rpb25zLmpzXCI7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgICAndHlwZXJlYWRpbmdzLmluc2VydCcoaGVhZGVyLCBib2R5KSB7XG4gICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5ld1JlYWRpbmcgPSBuZXcgVHlwZVJlYWRpbmcoeyBIZWFkZXI6aGVhZGVyLCBCb2R5OmJvZHksIENyZWF0ZWRCeTpNZXRlb3IudXNlcklkKCkgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGhlYWRlciwgYm9keSwgbmV3UmVhZGluZyk7XG4gICAgICAgIG5ld1JlYWRpbmcudmFsaWRhdGUoe1xuICAgICAgICAgICAgY2FzdDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3UmVhZGluZy5zYXZlKCk7XG4gICAgfSxcbiAgICAndHlwZXJlYWRpbmdzLmFkZENhdGVnb3J5VG9SZWFkaW5nJyhyZWFkaW5nSWQsIGNhdGVnb3J5LCBoaWdoLCBsb3cpIHtcbiAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVhZGluZyA9IFR5cGVSZWFkaW5nLmZpbmRPbmUoe19pZDpyZWFkaW5nSWR9KTtcbiAgICAgICAgbGV0IGNhdFJlYWRpbmcgPSBuZXcgVHlwZVJlYWRpbmdDYXRlZ29yeSgpO1xuICAgICAgICBjYXRSZWFkaW5nLk15ZXJzQnJpZ2dzQ2F0ZWdvcnkgPSBwYXJzZUludChjYXRlZ29yeSk7XG4gICAgICAgIGNhdFJlYWRpbmcuUmFuZ2UgPSBuZXcgUmVhZGluZ1JhbmdlKCk7XG4gICAgICAgIGNhdFJlYWRpbmcuUmFuZ2UuaGlnaCA9IHBhcnNlSW50KGhpZ2gpO1xuICAgICAgICBjYXRSZWFkaW5nLlJhbmdlLmxvdyA9IHBhcnNlSW50KGxvdyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGNhdFJlYWRpbmcpO1xuICAgICAgICByZWFkaW5nLmFkZFR5cGVDYXRlZ29yeShjYXRSZWFkaW5nKTtcbiAgICAgICAgcmVhZGluZy5zYXZlKCk7XG4gICAgfSxcbiAgICAndHlwZXJlYWRpbmdzLmRlbGV0ZScocmVhZGluZ0lkKSB7XG4gICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlYWRpbmcgPSBUeXBlUmVhZGluZy5maW5kT25lKHtfaWQ6cmVhZGluZ0lkfSk7XG4gICAgICAgIHJlYWRpbmcucmVtb3ZlKCk7XG4gICAgfSxcbiAgICAndHlwZXJlYWRpbmdzLnRvZ2dsZScocmVhZGluZ0lkKSB7XG4gICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCBbJ2FkbWluJ10sIFJvbGVzLkdMT0JBTF9HUk9VUCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlYWRpbmcgPSBUeXBlUmVhZGluZy5maW5kT25lKHtfaWQ6cmVhZGluZ0lkfSk7XG4gICAgICAgIHJlYWRpbmcudG9nZ2xlKCk7XG4gICAgfSxcbn0pOyIsImltcG9ydCB7IENsYXNzIH0gZnJvbSAnbWV0ZW9yL2phZ2k6YXN0cm9ub215JztcbmltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IE15ZXJzQnJpZ2dzQ2F0ZWdvcnkgfSBmcm9tICcuLi9xdWVzdGlvbnMvcXVlc3Rpb25zLmpzJztcbmltcG9ydCB7IENhdGVnb3J5LCBDYXRlZ29yeU1hbmFnZXIgfSBmcm9tICcuLi9jYXRlZ29yaWVzL2NhdGVnb3JpZXMuanMnO1xuXG5jb25zdCBSZWFkaW5nUmFuZ2UgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6IFwiUmVhZGluZ1JhbmdlXCIsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIGhpZ2g6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDUwXG4gICAgICAgIH0sXG4gICAgICAgIGxvdzoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9LFxuICAgICAgICBEZWx0YToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogNTBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBpbih2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvdyA8PSB2YWwgJiYgdmFsIDw9IHRoaXMuaGlnaDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RGVsdGEoKSB7XG4gICAgICAgICAgICB0aGlzLkRlbHRhID0gdGhpcy5oaWdoIC0gdGhpcy5sb3c7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuUmVhZGluZ1JhbmdlLkNyZWF0ZSA9IGZ1bmN0aW9uKGhpZ2gsIGxvdykge1xuICAgIGxldCBtID0gbmV3IFJlYWRpbmdSYW5nZSgpO1xuICAgIG0uaGlnaCA9IGhpZ2g7XG4gICAgbS5sb3cgPSBsb3c7XG4gICAgcmV0dXJuIG0uc2V0RGVsdGEoKTtcbn1cblJlYWRpbmdSYW5nZS5GdWxsSGlnaCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhZGluZ1JhbmdlLkNyZWF0ZSg1MCwgMCk7XG59XG5SZWFkaW5nUmFuZ2UuRnVsbExvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhZGluZ1JhbmdlLkNyZWF0ZSgwLCAtNTApO1xufVxuY29uc3QgVHlwZVJlYWRpbmdDYXRlZ29yeSA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogXCJUeXBlUmVhZGluZ0NhdGVnb3J5XCIsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIE15ZXJzQnJpZ2dzQ2F0ZWdvcnk6IHtcbiAgICAgICAgICAgIHR5cGU6IE15ZXJzQnJpZ2dzQ2F0ZWdvcnlcbiAgICAgICAgfSxcbiAgICAgICAgUmFuZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IFJlYWRpbmdSYW5nZSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhZGluZ1JhbmdlLkZ1bGxIaWdoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5jb25zdCBUeXBlUmVhZGluZ0NhdGVnb3JpZXMgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6IFwiVHlwZVJlYWRpbmdDYXRlZ29yaWVzXCIsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIDA6IHtcbiAgICAgICAgICAgIHR5cGU6VHlwZVJlYWRpbmdDYXRlZ29yeSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIDE6IHtcbiAgICAgICAgICAgIHR5cGU6VHlwZVJlYWRpbmdDYXRlZ29yeSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIDI6IHtcbiAgICAgICAgICAgIHR5cGU6VHlwZVJlYWRpbmdDYXRlZ29yeSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIDM6IHtcbiAgICAgICAgICAgIHR5cGU6VHlwZVJlYWRpbmdDYXRlZ29yeSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG59KTtcbmNvbnN0IFR5cGVSZWFkaW5nID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiBcIlR5cGVSZWFkaW5nXCIsXG4gICAgY29sbGVjdGlvbjogbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3R5cGVfcmVhZGluZ3MnKSxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgVHlwZVJlYWRpbmdDYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBUeXBlUmVhZGluZ0NhdGVnb3JpZXMsXG4gICAgICAgICAgICBkZWZhdWx0OiB7fVxuICAgICAgICB9LFxuICAgICAgICBDYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBDYXRlZ29yeU1hbmFnZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TWFuYWdlci5PZlR5cGUoXCJUeXBlUmVhZGluZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgSGVhZGVyOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIEJvZHk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgQ3JlYXRlZEJ5OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHsgcmV0dXJuIE1ldGVvci51c2VySWQoKTsgfVxuICAgICAgICB9LFxuICAgICAgICBFbmFibGVkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICB0b2dnbGUoKSB7XG4gICAgICAgICAgICB0aGlzLkVuYWJsZWQgPSAhdGhpcy5FbmFibGVkO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZFR5cGVDYXRlZ29yeShjYXQpIHtcbiAgICAgICAgICAgIHRoaXMuVHlwZVJlYWRpbmdDYXRlZ29yaWVzW2NhdC5NeWVyc0JyaWdnc0NhdGVnb3J5XSA9IGNhdDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGJlZm9yZVNhdmUoZSkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKGUudGFyZ2V0LlR5cGVSZWFkaW5nQ2F0ZWdvcmllcywgKHJlYWRpbmcpID0+IHsgXG4gICAgICAgICAgICAgICAgaWYocmVhZGluZyA9PSBudWxsKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIHJlYWRpbmcuUmFuZ2Uuc2V0RGVsdGEoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYoZS50YXJnZXQuQ2F0ZWdvcmllcy5sZW5ndGgoKSA8IDEpIHtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5DYXRlZ29yaWVzLmFkZENhdGVnb3J5KENhdGVnb3J5LkRlZmF1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCB7IFR5cGVSZWFkaW5nLCBSZWFkaW5nUmFuZ2UsIFR5cGVSZWFkaW5nQ2F0ZWdvcnksIFR5cGVSZWFkaW5nQ2F0ZWdvcmllcyB9OyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgVXNlckZlZWRiYWNrIH0gZnJvbSAnLi4vdXNlcl9mZWVkYmFjay5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCdmZWVkYmFjay51c2VyQ29tbWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIFVzZXJGZWVkYmFjay5maW5kKHt1c2VySWQ6IE1ldGVvci51c2VySWQoKX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IFVzZXJGZWVkYmFjayB9IGZyb20gJy4vdXNlcl9mZWVkYmFjay5qcyc7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgICAnZmVlZGJhY2suY3JlYXRlTmV3RmVlZGJhY2snKG5ld0ZlZWRiYWNrKSB7XG4gICAgICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJZb3UgYXJlIG5vdCBhdXRob3JpemVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3RmVlZGJhY2sudXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgICAgICBsZXQgZiA9IG5ldyBVc2VyRmVlZGJhY2sobmV3RmVlZGJhY2spO1xuICAgICAgICByZXR1cm4gZi5zYXZlKCk7XG4gICAgfVxufSlcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuXG5jb25zdCBVc2VyRmVlZGJhY2sgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6ICdVc2VyRmVlZGJhY2snLFxuICAgIGNvbGxlY3Rpb246IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyX2ZlZWRiYWNrJyksXG4gICAgZmllbGRzOiB7XG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBjb21tZW50OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBkYXRlQ3JlYXRlZDoge1xuICAgICAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKTsgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCB7IFVzZXJGZWVkYmFjayB9O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBVc2VyTm90aWZ5IH0gZnJvbSAnLi4vdXNlcl9ub3RpZnkuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnbm90aWZpY2F0aW9uTGlzdCcsIGZ1bmN0aW9uICh1c2VySWQpIHtcbiAgICBpZiAodGhpcy51c2VySWQgPT0gdXNlcklkKSB7XG4gICAgICAgIGxldCB1biA9IFVzZXJOb3RpZnkuZmluZCgge3VzZXJJZDp0aGlzLnVzZXJJZH0gKTtcbiAgICAgICAgcmV0dXJuIHVuO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ2xhc3MsIEVudW0gfSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3VzZXJzL3VzZXJzLmpzJztcbmltcG9ydCB7IEVtYWlsIH0gZnJvbSAnbWV0ZW9yL2VtYWlsJztcblxubGV0IFVzZXJOb3RpZnkgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6IFwiVXNlck5vdGlmeVwiLFxuICAgIGNvbGxlY3Rpb246IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyX25vdGlmeScpLFxuICAgIGZpZWxkczoge1xuICAgICAgICB1c2VySWQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGlzUmVhZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGlzUHVzaGVkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaXNFbWFpbGVkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlZERhdGU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRGF0ZSgpOyB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGVvck1ldGhvZHM6IHtcbiAgICAgICAgbWFya1JlYWQoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUmVhZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFya05vdGlmaWVkKCkge1xuICAgICAgICAgICAgdGhpcy5pc1B1c2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICB0ZXN0KCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIxMjNcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHB1c2hOb3RpZnkob3B0cykge1xuICAgICAgICAgICAgbGV0IG5vdGVPcHRzID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IHRoaXMuYm9keSxcbiAgICAgICAgICAgICAgICBpY29uOiAnL2ltZy9wYW5kYS5wbmcnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuX2lkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYnJvd3Nlck5vdGU7XG5cbiAgICAgICAgICAgIGlmICghKFwiTm90aWZpY2F0aW9uXCIgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgZGVza3RvcCBub3RpZmljYXRpb25cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExldCdzIGNoZWNrIHdoZXRoZXIgbm90aWZpY2F0aW9uIHBlcm1pc3Npb25zIGhhdmUgYWxyZWFkeSBiZWVuIGdyYW50ZWRcbiAgICAgICAgICAgIGVsc2UgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIGl0J3Mgb2theSBsZXQncyBjcmVhdGUgYSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICBicm93c2VyTm90ZSA9IG5ldyBOb3RpZmljYXRpb24odGhpcy50aXRsZSwgbm90ZU9wdHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIG5lZWQgdG8gYXNrIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uXG4gICAgICAgICAgICBlbHNlIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gXCJkZW5pZWRcIikge1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbihmdW5jdGlvbiAocGVybWlzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBhY2NlcHRzLCBsZXQncyBjcmVhdGUgYSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcm1pc3Npb24gPT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicm93c2VyTm90ZSA9IG5ldyBOb3RpZmljYXRpb24odGhpcy50aXRsZSwgbm90ZU9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gPT09IFwiZ3JhbnRlZFwiICYmIHR5cGVvZiBvcHRzLm9uY2xpY2sgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgYnJvd3Nlck5vdGUub25jbGljayA9IG9wdHMub25jbGljaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGJlZm9yZVNhdmUoZSkge1xuICAgICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgICAgIGxldCBub3RlID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICAgICAgICAgIGlmICghbm90ZS5pc0VtYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHUgPSBVc2VyLmZpbmRPbmUoIHtfaWQ6bm90ZS51c2VySWR9ICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRkciA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBFbWFpbC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogYWRkcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBcIndheW5lQHBhbGFkaW5hcmNoZXIuY29tXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdDogXCJEZXZlbG9wZXIgTGV2ZWwgTm90aWZpY2F0aW9uIC0gXCIrbm90ZS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBub3RlLmJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAvL1xufVxuXG5Vc2VyTm90aWZ5LmFkZCA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICBsZXQgbm90aWZ5ID0gbmV3IFVzZXJOb3RpZnkob3B0cyk7XG4gICAgbm90aWZ5LnNhdmUoKTtcbn1cblxuZXhwb3J0IHsgVXNlck5vdGlmeSB9O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBVc2VyU2VnbWVudCB9IGZyb20gJy4uL3VzZXJfc2VnbWVudHMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnc2VnbWVudExpc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy9pZiAoTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICAgIHJldHVybiBVc2VyU2VnbWVudC5maW5kKCk7XG4gICAgLy99IGVsc2Uge1xuICAgIC8vICAgIHRoaXMuc3RvcCgpO1xuICAgIC8vICAgIHJldHVybjtcbiAgICAvL31cbn0pO1xuIiwiaW1wb3J0IHsgVXNlclNlZ21lbnQgfSBmcm9tICcuL3VzZXJfc2VnbWVudHMuanMnO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICAgJ3NlZ21lbnQuY3JlYXRlTmV3U2VnbWVudCcobmFtZSwgZHNjcikge1xuICAgICAgICBpZiAoIVJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksIFsnYWRtaW4nXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiWW91IGFyZSBub3QgYXV0aG9yaXplZFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzID0gbmV3IFVzZXJTZWdtZW50KHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkc2NyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBDbGFzcywgRW51bSB9IGZyb20gJ21ldGVvci9qYWdpOmFzdHJvbm9teSc7XG5cbmNvbnN0IFVzZXJTZWdtZW50ID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnVXNlclNlZ21lbnQnLFxuICAgIGNvbGxlY3Rpb246IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyX3NlZ21lbnRzJyksXG4gICAgZmllbGRzOiB7XG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdEZWZhdWx0IHVzZXIgc2VnbWVudCdcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdUaGUgZGVmYXVsdCB1c2VyIHNlZ21lbnQgZm9yIHJlbGV2YW50IGNvbnRlbnQnXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IHsgVXNlclNlZ21lbnQgfTtcbiIsIi8vIEFsbCB1c2Vycy1yZWxhdGVkIHB1YmxpY2F0aW9uc1xuXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2Vycy5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCd1c2VyRGF0YScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnVzZXJJZCkge1xuICAgICAgICByZXR1cm4gVXNlci5maW5kKHsgX2lkOiB0aGlzLnVzZXJJZCB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHsgcm9sZXM6IDEsIE15UHJvZmlsZTogMSB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxufSk7XG5cbk1ldGVvci5wdWJsaXNoKCd1c2VyTGlzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddLCBSb2xlcy5HTE9CQUxfR1JPVVAgKSApIHtcbiAgICAgICAgcmV0dXJuIFVzZXIuZmluZCgge30gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVXNlci5maW5kKCB7fSwge1xuICAgICAgICAgICAgZmllbGRzOiB7IHJvbGVzOiAxLCB1c2VybmFtZTogMSwgTXlQcm9maWxlOiAxIH1cbiAgICAgICAgfSApO1xuICAgIH1cbn0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICAgJ3VzZXIuc2VuZFZlcmlmaWNhdGlvbkVtYWlsJygpIHtcbiAgICAgICAgbGV0IHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgICAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWUgPSBcIkRldmVsb3BlckxldmVsXCI7XG4gICAgICAgICAgICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tICAgICA9IFwiRGV2ZWxvcGVyTGV2ZWwgPHdheW5lQHBhbGFkaW5hcmNoZXIuY29tPlwiO1xuXG4gICAgICAgICAgICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy52ZXJpZnlFbWFpbCA9IHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0KCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJbRGV2ZWxvcGVyTGV2ZWxdIFZlcmlmeSB5b3VyIGVtYWlsIGFkZHJlc3NcIjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRleHQoIHVzZXIsIHVybCApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsQWRkcmVzcyAgID0gdXNlci5lbWFpbHNbMF0uYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybFdpdGhvdXRIYXNoID0gdXJsLnJlcGxhY2UoICcjLycsICcnICksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwb3J0RW1haWwgICA9IFwic3VwcG9ydEBkZXZlbG9wZXJsZXZlbC5jb21cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsQm9keSAgICAgID0gYFRvIHZlcmlmeSB5b3VyIGVtYWlsIGFkZHJlc3MgKCR7ZW1haWxBZGRyZXNzfSkgdmlzaXQgdGhlIGZvbGxvd2luZyBsaW5rOlxcblxcbiR7dXJsV2l0aG91dEhhc2h9XFxuXFxuIElmIHlvdSBkaWQgbm90IHJlcXVlc3QgdGhpcyB2ZXJpZmljYXRpb24sIHBsZWFzZSBpZ25vcmUgdGhpcyBlbWFpbC5gO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbWFpbEJvZHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodXNlcklkKTtcbiAgICAgICAgfVxuICAgIH1cbn0pXG4iLCJpbXBvcnQgeyBDbGFzcyB9IGZyb20gJ21ldGVvci9qYWdpOmFzdHJvbm9teSc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBNeWVyc0JyaWdnc0NhdGVnb3J5LCBRdWVzdGlvbiB9IGZyb20gJy4uL3F1ZXN0aW9ucy9xdWVzdGlvbnMuanMnO1xuaW1wb3J0IHsgQ2F0ZWdvcnksIENhdGVnb3J5TWFuYWdlciB9IGZyb20gJy4uL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy5qcyc7XG5pbXBvcnQgeyBEZWZhdWx0cyB9IGZyb20gJy4uLy4uL3N0YXJ0dXAvYm90aC9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBUZWFtIH0gZnJvbSAnLi4vdGVhbXMvdGVhbXMuanMnO1xuaW1wb3J0IHsgVXNlclNlZ21lbnQgfSBmcm9tICcuLi91c2VyX3NlZ21lbnRzL3VzZXJfc2VnbWVudHMuanMnO1xuXG5jb25zdCBNeWVyc0JyaWdnc0JpdCA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ015ZXJzQnJpZ2dzQml0JyxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICAgICAgVG90YWxzOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OiAwXG4gICAgICAgIH0sXG4gICAgICAgIFF1ZXN0aW9uQ291bnQ6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBhZGRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5Ub3RhbHMgKz0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLlF1ZXN0aW9uQ291bnQgKys7XG4gICAgICAgICAgICB0aGlzLlZhbHVlID0gKHRoaXMuUXVlc3Rpb25Db3VudCA9PSAwID8gMCA6dGhpcy5Ub3RhbHMgLyB0aGlzLlF1ZXN0aW9uQ291bnQpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5RdWVzdGlvbkNvdW50IC0tO1xuICAgICAgICAgICAgaWYodGhpcy5RdWVzdGlvbkNvdW50IDwgMCkgeyB0aGlzLlF1ZXN0aW9uQ291bnQgPSAwOyB9XG4gICAgICAgICAgICBpZih0aGlzLlF1ZXN0aW9uQ291bnQgPT0gMCkgeyB0aGlzLlRvdGFscyA9IHRoaXMuVmFsdWUgPSAwOyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuVG90YWxzIC09IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5WYWx1ZSA9IHRoaXMuVG90YWxzIC8gdGhpcy5RdWVzdGlvbkNvdW50O1xuICAgICAgICB9LFxuICAgICAgICByZXNldCgpIHtcbiAgICAgICAgICAgIHRoaXMuVG90YWxzID0gMDtcbiAgICAgICAgICAgIHRoaXMuUXVlc3Rpb25Db3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLlZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuY29uc3QgTXllcnNCcmlnZ3MgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6ICdNeWVyc0JyaWdncycsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIElFOiB7XG4gICAgICAgICAgICB0eXBlOiBNeWVyc0JyaWdnc0JpdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNeWVyc0JyaWdnc0JpdCgpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIE5TOiB7XG4gICAgICAgICAgICB0eXBlOiBNeWVyc0JyaWdnc0JpdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNeWVyc0JyaWdnc0JpdCgpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIFRGOiB7XG4gICAgICAgICAgICB0eXBlOiBNeWVyc0JyaWdnc0JpdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNeWVyc0JyaWdnc0JpdCgpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIEpQOiB7XG4gICAgICAgICAgICB0eXBlOiBNeWVyc0JyaWdnc0JpdCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNeWVyc0JyaWdnc0JpdCgpOyB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhlbHBlcnM6IHtcbiAgICAgICAgYWRkQnlDYXRlZ29yeShjYXRlZ29yeSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhdGVnb3J5LCB2YWx1ZSk7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0SWRlbnRpZmllckJ5SWQoY2F0ZWdvcnkpO1xuICAgICAgICAgICAgdGhpc1tuYW1lXS5hZGRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUJ5Q2F0ZWdvcnkoY2F0ZWdvcnksIHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0SWRlbnRpZmllckJ5SWQoY2F0ZWdvcnkpO1xuICAgICAgICAgICAgdGhpc1tuYW1lXS5yZW1vdmVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldElkZW50aWZpZXJCeUlkKGNhdGVnb3J5SWQpIHtcbiAgICAgICAgICAgIGlmKGNhdGVnb3J5SWQgPT09IDApIHsgcmV0dXJuICdJRSc7IH1cbiAgICAgICAgICAgIGlmKGNhdGVnb3J5SWQgPT09IDEpIHsgcmV0dXJuICdOUyc7IH1cbiAgICAgICAgICAgIGlmKGNhdGVnb3J5SWQgPT09IDIpIHsgcmV0dXJuICdURic7IH1cbiAgICAgICAgICAgIHJldHVybiAnSlAnO1xuICAgICAgICB9LFxuICAgICAgICBnZXRGb3VyTGV0dGVyKCkge1xuICAgICAgICAgICAgbGV0IElFTCA9ICh0aGlzLklFLlZhbHVlID09PSAwID8gJ18nIDogKHRoaXMuSUUuVmFsdWUgPCAwID8gJ0knIDogJ0UnKSk7XG4gICAgICAgICAgICBsZXQgTlNMID0gKHRoaXMuTlMuVmFsdWUgPT09IDAgPyAnXycgOiAodGhpcy5OUy5WYWx1ZSA8IDAgPyAnTicgOiAnUycpKTtcbiAgICAgICAgICAgIGxldCBURkwgPSAodGhpcy5URi5WYWx1ZSA9PT0gMCA/ICdfJyA6ICh0aGlzLlRGLlZhbHVlIDwgMCA/ICdUJyA6ICdGJykpO1xuICAgICAgICAgICAgbGV0IEpQTCA9ICh0aGlzLkpQLlZhbHVlID09PSAwID8gJ18nIDogKHRoaXMuSlAuVmFsdWUgPCAwID8gJ0onIDogJ1AnKSk7XG4gICAgICAgICAgICByZXR1cm4gYCR7SUVMfSR7TlNMfSR7VEZMfSR7SlBMfWA7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0KCkge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy5nZXRJZGVudGlmaWVyQnlJZChpKV0ucmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuY29uc3QgQW5zd2VyID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnQW5zd2VyJyxcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgQ2F0ZWdvcnk6IHtcbiAgICAgICAgICAgIHR5cGU6TXllcnNCcmlnZ3NDYXRlZ29yeSxcbiAgICAgICAgICAgIGRlZmF1bHQ6MFxuICAgICAgICB9LFxuICAgICAgICBDYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBbTXllcnNCcmlnZ3NDYXRlZ29yeV0sXG4gICAgICAgICAgICBkZWZhdWx0OiBbXVxuICAgICAgICB9LFxuICAgICAgICBRdWVzdGlvbklEOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OicnXG4gICAgICAgIH0sXG4gICAgICAgIFJldmVyc2VkOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDowXG4gICAgICAgIH0sXG4gICAgICAgIEFuc3dlcmVkQXQ6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRGF0ZSgpOyB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGhlbHBlcnM6IHtcbiAgICAgICAgZ2V0UXVlc3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcSA9IFF1ZXN0aW9uLmZpbmRPbmUoe19pZDp0aGlzLlF1ZXN0aW9uSUR9KTtcbiAgICAgICAgICAgIHJldHVybiBxO1xuICAgICAgICB9LFxuICAgICAgICB1bmFuc3dlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UXVlc3Rpb24oKS5yZW1vdmVBbnN3ZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbmNvbnN0IFVzZXJUeXBlID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnVXNlclR5cGUnLFxuICAgIGZpZWxkczoge1xuICAgICAgICBQZXJzb25hbGl0eToge1xuICAgICAgICAgICAgdHlwZTogTXllcnNCcmlnZ3MsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXllcnNCcmlnZ3MoKTsgfVxuICAgICAgICB9LFxuICAgICAgICBBbnN3ZXJlZFF1ZXN0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogW0Fuc3dlcl0sXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9XG4gICAgICAgIH0sXG4gICAgICAgIFRvdGFsUXVlc3Rpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBkZWZhdWx0OjBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBnZXRBbnN3ZXJlZFF1ZXN0aW9uc0lEcygpIHtcbiAgICAgICAgICAgIGxldCBxaWRzID0gW107XG4gICAgICAgICAgICBfLmVhY2godGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucywgZnVuY3Rpb24gKGFucykge1xuICAgICAgICAgICAgICAgIHFpZHMucHVzaChhbnMuUXVlc3Rpb25JRCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBxaWRzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRUb3RhbFF1ZXN0aW9ucyh0b3RhbFF1ZXN0aW9ucykge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVzZXIuanMgdG90YWxRdWVzdGlvbnNcIiwgdG90YWxRdWVzdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5Ub3RhbFF1ZXN0aW9ucyA9IHRvdGFsUXVlc3Rpb25zO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInVzZXIuanMgdG90YWxRdWVzdGlvbnMyXCIsIHRoaXMuVG90YWxRdWVzdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRUb3RhbFF1ZXN0aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5Ub3RhbFF1ZXN0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgYW5zd2VyUXVlc3Rpb24oYW5zd2VyKSB7XG4gICAgICAgICAgICB0aGlzLkFuc3dlcmVkUXVlc3Rpb25zLnB1c2goYW5zd2VyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuQW5zd2VyZWRRdWVzdGlvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYW5zd2VyLkNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgbGV0IGNvbnRleHRUaGlzID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaChhbnN3ZXIuQ2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRUaGlzLlBlcnNvbmFsaXR5LmFkZEJ5Q2F0ZWdvcnkoY2F0LCBhbnN3ZXIuVmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3RoaXMuUGVyc29uYWxpdHkuYWRkQnlDYXRlZ29yeShhbnN3ZXIuQ2F0ZWdvcnksIGFuc3dlci5WYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVuQW5zd2VyUXVlc3Rpb24oYW5zd2VyLCBza2lwU2xpY2UpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0QW5zd2VySW5kZXhGb3JRdWVzdGlvbklEKGFuc3dlci5RdWVzdGlvbklEKTtcbiAgICAgICAgICAgIGxldCBiZWZvcmUgPSB0aGlzLkFuc3dlcmVkUXVlc3Rpb25zLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYoaW5kZXggPCAwKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgaWYoIXNraXBTbGljZSkge1xuICAgICAgICAgICAgICAgIGlmKGluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA9PSB0aGlzLkFuc3dlcmVkUXVlc3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkFuc3dlcmVkUXVlc3Rpb25zID0gdGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucy5zbGljZSgwLGluZGV4KS5jb25jYXQodGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucy5zbGljZShpbmRleCsxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5zd2VyLnVuYW5zd2VyKCk7XG4gICAgICAgICAgICBfLmVhY2goYW5zd2VyLkNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBlcnNvbmFsaXR5LnJlbW92ZUJ5Q2F0ZWdvcnkoY2F0LCBhbnN3ZXIuVmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3RoaXMuUGVyc29uYWxpdHkucmVtb3ZlQnlDYXRlZ29yeShhbnN3ZXIuQ2F0ZWdvcnksIGFuc3dlci5WYWx1ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgQW5zd2VyIENvdW50OiBcIitiZWZvcmUrXCIgPT4gXCIrdGhpcy5BbnN3ZXJlZFF1ZXN0aW9ucy5sZW5ndGgpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRBbnN3ZXJJbmRleEZvclF1ZXN0aW9uSUQocXVlc3Rpb25JZCkge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuQW5zd2VyZWRRdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLkFuc3dlcmVkUXVlc3Rpb25zW2ldLlF1ZXN0aW9uSUQgPT0gcXVlc3Rpb25JZCkgeyByZXR1cm4gaTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuICAgICAgICBnZXRBbnN3ZXJGb3JRdWVzdGlvbihxdWVzdGlvbklkKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuQW5zd2VyZWRRdWVzdGlvbnMsIGZ1bmN0aW9uIChhbnMsIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5zLlF1ZXN0aW9uSUQgPT0gcXVlc3Rpb25JZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByZXNldCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLkFuc3dlcmVkUXVlc3Rpb25zLCBmdW5jdGlvbiAoYW5zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51bkFuc3dlclF1ZXN0aW9uKGFucywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuUGVyc29uYWxpdHkucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuQW5zd2VyZWRRdWVzdGlvbnMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jb25zdCBEYXNoYm9hcmRQYW5lID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnRGFzaGJvYXJkUGFuZScsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ0FwcF9ob21lJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZGVmYXVsdDogJ1BlcnNvbmFsaXR5IFF1ZXN0aW9ucydcbiAgICAgICAgfSxcbiAgICAgICAgcm91dGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcvJ1xuICAgICAgICB9XG4gICAgfVxufSlcblxuY29uc3QgUHJvZmlsZSA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ1Byb2ZpbGUnLFxuICAgIGZpZWxkczoge1xuICAgICAgICBmaXJzdE5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbGlkYXRvcnM6IFt7XG4gICAgICAgICAgICAgIHR5cGU6ICdtaW5MZW5ndGgnLFxuICAgICAgICAgICAgICBwYXJhbTogMlxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgbGFzdE5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbGlkYXRvcnM6IFt7XG4gICAgICAgICAgICAgIHR5cGU6ICdtaW5MZW5ndGgnLFxuICAgICAgICAgICAgICBwYXJhbTogMlxuICAgICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgVXNlclR5cGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFVzZXJUeXBlLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFVzZXJUeXBlKCk7IH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyOiB7XG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgYmlydGhEYXRlOiB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgQ2F0ZWdvcmllczoge1xuICAgICAgICAgICAgdHlwZTogQ2F0ZWdvcnlNYW5hZ2VyLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENhdGVnb3J5TWFuYWdlci5PZlR5cGUoXCJVc2VyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXNoYm9hcmRQYW5lczoge1xuICAgICAgICAgICAgdHlwZTogW0Rhc2hib2FyZFBhbmVdLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfSxcbiAgICAgICAgc2VnbWVudHM6IHtcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgZGVmYXVsdDogW11cbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBjYWxjdWxhdGVBZ2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iaXJ0aERhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIHRoaXMuYmlydGhEYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFnZSA9IE1hdGguYWJzKChuZXcgRGF0ZShkaWZmKSkuZ2V0VVRDRnVsbFllYXIoKSAtIDE5NzApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmdWxsTmFtZShwYXJhbSkge1xuICAgICAgICAgICAgdmFyIGZ1bGxOYW1lID0gdGhpcy5maXJzdE5hbWUgKyAnICcgKyB0aGlzLmxhc3ROYW1lO1xuICAgICAgICAgICAgaWYgKHBhcmFtID09PSAnbG93ZXInKSB7IHJldHVybiBmdWxsTmFtZS50b0xvd2VyQ2FzZSgpOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChwYXJhbSA9PT0gJ3VwcGVyJykgeyByZXR1cm4gZnVsbE5hbWUudG9VcHBlckNhc2UoKTsgfVxuICAgICAgICAgICAgcmV0dXJuIGZ1bGxOYW1lO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5jb25zdCBVc2VyID0gQ2xhc3MuY3JlYXRlKHtcbiAgICBuYW1lOiAnVXNlcicsXG4gICAgY29sbGVjdGlvbjogTWV0ZW9yLnVzZXJzLFxuICAgIGZpZWxkczp7XG4gICAgICAgIGNyZWF0ZWRBdDogRGF0ZSxcbiAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICB0eXBlOiBbT2JqZWN0XSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH1cbiAgICAgICAgfSxcbiAgICAgICAgTXlQcm9maWxlOiB7XG4gICAgICAgICAgICB0eXBlOiBQcm9maWxlLFxuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgUHJvZmlsZSgpOyB9XG4gICAgICAgIH0sXG4gICAgICAgIHRlYW1zOiB7XG4gICAgICAgIFx0dHlwZTogW1N0cmluZ10sXG4gICAgICAgIFx0ZGVmYXVsdDogZnVuY3Rpb24oKSB7IHJldHVybiBbIFRlYW0uRGVmYXVsdC5OYW1lIF07IH1cbiAgICAgICAgfSxcbiAgICAgICAgcm9sZXM6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXNvbHZlRXJyb3IoeyBuZXN0ZWROYW1lLCB2YWxpZGF0b3IgfSkge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXN0ZWROYW1lLCB2YWxpZGF0b3IpO1xuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGFmdGVySW5pdChlKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5NeVByb2ZpbGUuY2FsY3VsYXRlQWdlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZVNhdmUoZSkge1xuICAgICAgICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5NeVByb2ZpbGUuQ2F0ZWdvcmllcy5sZW5ndGgoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5NeVByb2ZpbGUuQ2F0ZWdvcmllcy5hZGRDYXRlZ29yeShDYXRlZ29yeS5EZWZhdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQudGVhbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBcdGUuY3VycmVudFRhcmdldC5hZGRUZWFtKCBUZWFtLkRlZmF1bHQuTmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRlb3JNZXRob2RzOiB7XG4gICAgICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlTmFtZShmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgICAgICAgICBjaGVjayhmaXJzdE5hbWUsIFN0cmluZyk7XG4gICAgICAgICAgICBjaGVjayhsYXN0TmFtZSwgU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMuTXlQcm9maWxlLmZpcnN0TmFtZSA9IGZpcnN0TmFtZTtcbiAgICAgICAgICAgIHRoaXMuTXlQcm9maWxlLmxhc3ROYW1lID0gbGFzdE5hbWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bGxOYW1lKHBhcmFtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5NeVByb2ZpbGUuZnVsbE5hbWUocGFyYW0pO1xuICAgICAgICB9LFxuICAgICAgICBhZGRUZWFtKHRlYW1OYW1lKSB7XG4gICAgICAgIFx0bGV0IHRlYW1Eb2MgPSBUZWFtLmZpbmRPbmUoeyBcIk5hbWVcIiA6IHRlYW1OYW1lfSk7XG4gICAgICAgIFx0aWYgKHR5cGVvZiB0ZWFtRG9jICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGVhbURvYy5hZGRVc2Vycyh0aGlzLl9pZCk7XG4gICAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHByb2ZpbGVVcGRhdGUodXByb2ZpbGUpIHtcbiAgICAgICAgICAgIGNoZWNrKHVwcm9maWxlLmZpcnN0TmFtZSwgU3RyaW5nKTtcbiAgICAgICAgICAgIGNoZWNrKHVwcm9maWxlLmxhc3ROYW1lLCBTdHJpbmcpO1xuICAgICAgICAgICAgY2hlY2sodXByb2ZpbGUuZ2VuZGVyLCBCb29sZWFuKTtcblxuICAgICAgICAgICAgdGhpcy5NeVByb2ZpbGUuZmlyc3ROYW1lID0gdXByb2ZpbGUuZmlyc3ROYW1lO1xuICAgICAgICAgICAgdGhpcy5NeVByb2ZpbGUubGFzdE5hbWUgPSB1cHJvZmlsZS5sYXN0TmFtZTtcbiAgICAgICAgICAgIHRoaXMuTXlQcm9maWxlLmdlbmRlciA9IHVwcm9maWxlLmdlbmRlcjtcbiAgICAgICAgICAgIHRoaXMuTXlQcm9maWxlLnNlZ21lbnRzID0gdXByb2ZpbGUuc2VnbWVudHM7XG4gICAgICAgICAgICBpZiAoXCJcIiAhPT0gdXByb2ZpbGUuYmlydGhEYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5NeVByb2ZpbGUuYmlydGhEYXRlID0gbmV3IERhdGUodXByb2ZpbGUuYmlydGhEYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5kZXhlczoge1xuICAgIH0sXG4gICAgYmVoYXZpb3JzOiB7XG4gICAgICAgIHNsdWc6IHtcbiAgICAgICAgICAgIGZpZWxkTmFtZTogJ2VtYWlsJ1xuICAgICAgICB9LFxuICAgICAgICB0aW1lc3RhbXA6IHt9XG4gICAgfVxufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgVXNlci5leHRlbmQoe1xuICAgIGZpZWxkczoge1xuICAgICAgc2VydmljZXM6IE9iamVjdFxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IFVzZXIsIFByb2ZpbGUsIFVzZXJUeXBlLCBNeWVyc0JyaWdncywgQW5zd2VyIH07XG4iLCJpbXBvcnQgeyBDbGFzcyB9IGZyb20gJ21ldGVvci9qYWdpOmFzdHJvbm9teSc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5jb25zdCBEZWZhdWx0Q2F0ZWdvcnlJRCA9IFwieGhLZHdoYWNhV1RjQlRHUG5cIjtcbmNvbnN0IFR5cGVTdGF0cyA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ1R5cGVTdGF0cycsXG4gICAgZmllbGRzOiB7XG4gICAgICAgIG51bToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9XG4gICAgfVxufSk7XG5jb25zdCBDYXRlZ29yeSA9IENsYXNzLmNyZWF0ZSh7XG4gICAgbmFtZTogJ0NhdGVnb3J5JyxcbiAgICBjb2xsZWN0aW9uOiBuZXcgTW9uZ28uQ29sbGVjdGlvbignY2F0ZWdvcmllcycpLFxuICAgIGZpZWxkczoge1xuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0OiBcInRoZSBVbm5hbWVkIENhdGVnb3J5XCJcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwidGhpcyBpcyB0aGUgZGVmYXVsdCBzdHVmZiBmb3IgYSBDYXRlZ29yeVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRzOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB7fTsgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBoZWxwZXJzOiB7XG4gICAgICAgIGFkZEJ5VHlwZSh0eXBlKSB7XG4gICAgICAgICAgICBpZighdGhpcy5nZXRTdGF0c0J5VHlwZSh0eXBlKSkgeyB0aGlzLnN0YXRzW3R5cGVdID0gbmV3IFR5cGVTdGF0cygpOyB9XG4gICAgICAgICAgICB0aGlzLmdldFN0YXRzQnlUeXBlKHR5cGUpLm51bSsrO1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUJ5VHlwZSh0eXBlKSB7XG4gICAgICAgICAgICBpZighdGhpcy5nZXRTdGF0c0J5VHlwZSh0eXBlKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICAgIHRoaXMuZ2V0U3RhdHNCeVR5cGUodHlwZSkubnVtLS07XG4gICAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U3RhdHNCeVR5cGUodHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHNbdHlwZV07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGVvck1ldGhvZHM6IHtcbiAgICAgICAgdXBkYXRlKG5hbWUsIGRzY3IpIHtcbiAgICAgICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnYWRtaW4nLCBSb2xlcy5HTE9CQUxfR1JPVVApKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZHNjcjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNhdmUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbkNhdGVnb3J5LkRlZmF1bHQgPSBDYXRlZ29yeS5maW5kT25lKHtfaWQ6RGVmYXVsdENhdGVnb3J5SUR9KTtcbmlmICh0eXBlb2YgQ2F0ZWdvcnkuRGVmYXVsdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIENhdGVnb3J5LkRlZmF1bHQgPSBuZXcgQ2F0ZWdvcnkoe19pZDpEZWZhdWx0Q2F0ZWdvcnlJRH0pO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgQ2F0ZWdvcnkuRGVmYXVsdC5zYXZlKCk7XG4gICAgfVxufVxuXG5jb25zdCBDYXRlZ29yeU1hbmFnZXIgPSBDbGFzcy5jcmVhdGUoe1xuICAgIG5hbWU6ICdDYXRlZ29yeU1hbmFnZXInLFxuICAgIGZpZWxkczoge1xuICAgICAgICBDYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwidW0uLi4gd2hhdCE/XCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgICBsZW5ndGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5DYXRlZ29yaWVzLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgYXJlSW50ZXJzZWN0ZWQoY2F0ZWdvcnlNYW5hZ2VyKSB7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5DYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGNhdGVnb3J5TWFuYWdlci5DYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuQ2F0ZWdvcmllc1tpXSA9PSBjYXRlZ29yeU1hbmFnZXIuQ2F0ZWdvcmllc1tqXSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkQ2F0ZWdvcnkoY2F0ZWdvcnksIHR5cGUpIHtcbiAgICAgICAgICAgIGlmKCF0eXBlKSB7IHR5cGUgPSB0aGlzLlR5cGU7IH1cbiAgICAgICAgICAgIHRoaXMuQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5Ll9pZCk7XG4gICAgICAgICAgICBjYXRlZ29yeS5hZGRCeVR5cGUodHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0NhdGVnb3J5KGNhdGVnb3J5KSB7XG4gICAgICAgICAgICBpZih0aGlzLkNhdGVnb3JpZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENhdGVnb3J5KENhdGVnb3J5LkRlZmF1bHQsIHRoaXMuVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuQ2F0ZWdvcmllcywgZnVuY3Rpb24gKGNhdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3J5Ll9pZCA9PSBjYXRJZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVDYXRlZ29yeShjYXRlZ29yeSwgdHlwZSwgc2tpcFNsaWNlKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLkNhdGVnb3JpZXMsIGZ1bmN0aW9uIChjYXRJZCwgaSkge1xuICAgICAgICAgICAgICAgIGlmKGNhdElkID09IGNhdGVnb3J5Ll9pZCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZihpbmRleCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgICBpZighc2tpcFNsaWNlKSB7XG4gICAgICAgICAgICAgICAgaWYoaW5kZXggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNhdGVnb3JpZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaW5kZXggPT0gdGhpcy5DYXRlZ29yaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5DYXRlZ29yaWVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ2F0ZWdvcmllcyA9IHRoaXMuQ2F0ZWdvcmllcy5zbGljZSgwLGluZGV4KS5jb25jYXQodGhpcy5DYXRlZ29yaWVzLnNsaWNlKGluZGV4KzEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRlZ29yeS5yZW1vdmVCeVR5cGUodHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbkNhdGVnb3J5TWFuYWdlci5PZlR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIGxldCBjID0gbmV3IENhdGVnb3J5TWFuYWdlcigpO1xuICAgIGMuVHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIGM7XG59XG5cbmV4cG9ydCB7IENhdGVnb3J5LCBDYXRlZ29yeU1hbmFnZXIgfTtcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcvaW1wb3J0cy9hcGkvdXNlcnMvdXNlcnMuanMnO1xuaW1wb3J0IHsgVGVhbSB9IGZyb20gJy9pbXBvcnRzL2FwaS90ZWFtcy90ZWFtcy5qcyc7XG5pbXBvcnQgeyBEZWZhdWx0cyB9IGZyb20gJy9pbXBvcnRzL3N0YXJ0dXAvYm90aC9kZWZhdWx0cy5qcyc7XG5cbmNvbnN0IG15UG9zdExvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgLy9leGFtcGxlIHJlZGlyZWN0IGFmdGVyIGxvZ291dFxuICAgIEZsb3dSb3V0ZXIuZ28oJy9zaWduaW4nKTtcbn07XG5jb25zdCBteVN1Ym1pdEZ1bmMgPSBmdW5jdGlvbihlcnJvciwgc3RhdGUpe1xuICBpZiAoIWVycm9yKSB7XG4gICAgaWYgKHN0YXRlID09PSBcInNpZ25JblwiKSB7XG4gICAgICAvLyBTdWNjZXNzZnVsbHkgbG9nZ2VkIGluXG4gICAgICAvLyAuLi5cbiAgICB9XG4gICAgaWYgKHN0YXRlID09PSBcInNpZ25VcFwiKSB7XG4gICAgICAvLyBTdWNjZXNzZnVsbHkgcmVnaXN0ZXJlZFxuICAgICAgLy8gLi4uXG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gbXlQcmVTdWJtaXRGdW5jKCkgIHsgY29uc29sZS5sb2coXCJQcmU6ICBcIiwgYXJndW1lbnRzKTsgfVxuXG5mdW5jdGlvbiBteVBvc3RTdWJtaXRGdW5jKHVzZXJJZCwgaW5mbykge1xuICAgIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLnNpdGVOYW1lID0gXCJEZXZlbG9wZXJMZXZlbFwiO1xuICAgIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb20gICAgID0gXCJEZXZlbG9wZXJMZXZlbCA8d2F5bmVAcGFsYWRpbmFyY2hlci5jb20+XCI7XG5cbiAgICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy52ZXJpZnlFbWFpbCA9IHtcbiAgICAgICAgc3ViamVjdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIltEZXZlbG9wZXJMZXZlbF0gVmVyaWZ5IHlvdXIgZW1haWwgYWRkcmVzc1wiO1xuICAgICAgICB9LFxuICAgICAgICB0ZXh0KCB1c2VyLCB1cmwgKSB7XG4gICAgICAgICAgICBsZXQgZW1haWxBZGRyZXNzICAgPSB1c2VyLmVtYWlsc1swXS5hZGRyZXNzLFxuICAgICAgICAgICAgICAgIHVybFdpdGhvdXRIYXNoID0gdXJsLnJlcGxhY2UoICcjLycsICcnICksXG4gICAgICAgICAgICAgICAgc3VwcG9ydEVtYWlsICAgPSBcInN1cHBvcnRAZGV2ZWxvcGVybGV2ZWwuY29tXCIsXG4gICAgICAgICAgICAgICAgZW1haWxCb2R5ICAgICAgPSBgVG8gdmVyaWZ5IHlvdXIgZW1haWwgYWRkcmVzcyAoJHtlbWFpbEFkZHJlc3N9KSB2aXNpdCB0aGUgZm9sbG93aW5nIGxpbms6XFxuXFxuJHt1cmxXaXRob3V0SGFzaH1cXG5cXG4gSWYgeW91IGRpZCBub3QgcmVxdWVzdCB0aGlzIHZlcmlmaWNhdGlvbiwgcGxlYXNlIGlnbm9yZSB0aGlzIGVtYWlsLmA7XG5cbiAgICAgICAgICAgIHJldHVybiBlbWFpbEJvZHk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCggdXNlcklkICk7XG4gICAgY29uc29sZS5sb2coXCJQb3N0OiBcIiwgYXJndW1lbnRzKTtcbn1cblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlKHtcbiAgICAvLyBCZWhhdmlvclxuICAgIGNvbmZpcm1QYXNzd29yZDogdHJ1ZSxcbiAgICBlbmFibGVQYXNzd29yZENoYW5nZTogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IGZhbHNlLFxuICAgIG92ZXJyaWRlTG9naW5FcnJvcnM6IHRydWUsXG4gICAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsOiBmYWxzZSxcbiAgICBsb3dlcmNhc2VVc2VybmFtZTogZmFsc2UsXG4gICAgZm9jdXNGaXJzdElucHV0OiB0cnVlLFxuXG4gICAgLy8gQXBwZWFyYW5jZVxuICAgIHNob3dBZGRSZW1vdmVTZXJ2aWNlczogZmFsc2UsXG4gICAgc2hvd0ZvcmdvdFBhc3N3b3JkTGluazogdHJ1ZSxcbiAgICBzaG93TGFiZWxzOiB0cnVlLFxuICAgIHNob3dQbGFjZWhvbGRlcnM6IHRydWUsXG4gICAgc2hvd1Jlc2VuZFZlcmlmaWNhdGlvbkVtYWlsTGluazogZmFsc2UsXG5cbiAgICAvLyBDbGllbnQtc2lkZSBWYWxpZGF0aW9uXG5cbiAgICBjb250aW51b3VzVmFsaWRhdGlvbjogZmFsc2UsXG4gICAgbmVnYXRpdmVGZWVkYmFjazogZmFsc2UsXG4gICAgbmVnYXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuICAgIHBvc2l0aXZlVmFsaWRhdGlvbjogdHJ1ZSxcbiAgICBwb3NpdGl2ZUZlZWRiYWNrOiB0cnVlLFxuICAgIHNob3dWYWxpZGF0aW5nOiB0cnVlLFxuXG5cbiAgICAvLyBQcml2YWN5IFBvbGljeSBhbmQgVGVybXMgb2YgVXNlXG4gICAgcHJpdmFjeVVybDogJ3ByaXZhY3knLFxuICAgIHRlcm1zVXJsOiAndGVybXMtb2YtdXNlJyxcblxuICAgIC8vIFJlZGlyZWN0c1xuICAgIGhvbWVSb3V0ZVBhdGg6ICcvJyxcbiAgICByZWRpcmVjdFRpbWVvdXQ6IDQwMDAsXG5cbiAgICAvLyBSb3V0aW5nXG5cbiAgICBkZWZhdWx0VGVtcGxhdGU6ICdBdXRoX3BhZ2UnLFxuICAgIGRlZmF1bHRMYXlvdXQ6ICdBcHBfYm9keScsXG4gICAgZGVmYXVsdENvbnRlbnRSZWdpb246ICdtYWluJyxcbiAgICBkZWZhdWx0TGF5b3V0UmVnaW9uczoge30sXG5cbiAgICAvLyBIb29rc1xuICAgIG9uTG9nb3V0SG9vazogbXlQb3N0TG9nb3V0LFxuICAgIG9uU3VibWl0SG9vazogbXlTdWJtaXRGdW5jLFxuICAgIHByZVNpZ25VcEhvb2s6IG15UHJlU3VibWl0RnVuYyxcbiAgICBwb3N0U2lnblVwSG9vazogbXlQb3N0U3VibWl0RnVuYyxcblxuICAgIC8vIFRleHRzXG4gICAgdGV4dHM6IHtcbiAgICAgIGJ1dHRvbjoge1xuICAgICAgICAgIHNpZ25VcDogXCJSZWdpc3RlciBOb3chXCJcbiAgICAgIH0sXG4gICAgICBzb2NpYWxTaWduVXA6IFwiUmVnaXN0ZXJcIixcbiAgICAgIHNvY2lhbEljb25zOiB7XG4gICAgICAgICAgXCJtZXRlb3ItZGV2ZWxvcGVyXCI6IFwiZmEgZmEtcm9ja2V0XCJcbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICAgIGZvcmdvdFB3ZDogXCJSZWNvdmVyIFlvdXIgUGFzc3dvcmRcIlxuICAgICAgfSxcbiAgICAgIGlucHV0SWNvbnM6IHtcbiAgICAgICAgICBpc1ZhbGlkYXRpbmc6IFwiZmEgZmEtc3Bpbm5lciBmYS1zcGluXCIsXG4gICAgICAgICAgaGFzU3VjY2VzczogXCJmYSBmYS1jaGVja1wiLFxuICAgICAgICAgIGhhc0Vycm9yOiBcImZhIGZhLXRpbWVzXCIsXG4gICAgICB9XG4gICAgfSxcbn0pO1xuXG4vLyBEZWZpbmUgdGhlc2Ugcm91dGVzIGluIGEgZmlsZSBsb2FkZWQgb24gYm90aCBjbGllbnQgYW5kIHNlcnZlclxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ3NpZ25JbicsIHtcbiAgbmFtZTogJ3NpZ25pbicsXG4gIHBhdGg6ICcvc2lnbmluJ1xufSk7XG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgnc2lnblVwJywge1xuICBuYW1lOiAnam9pbicsXG4gIHBhdGg6ICcvam9pbidcbn0pO1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ2ZvcmdvdFB3ZCcpO1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ3Jlc2V0UHdkJywge1xuICBuYW1lOiAncmVzZXRQd2QnLFxuICBwYXRoOiAnL3Jlc2V0LXBhc3N3b3JkJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmFkZEZpZWxkcyhbe1xuICAgIF9pZDogXCJmaXJzdF9uYW1lXCIsXG4gICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IFwiRmlyc3QgTmFtZVwiLFxuICAgIGZ1bmM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vaWYoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpcnN0bmFtZSB2YWxpZGF0aW9uOiBcIiwgdmFsdWUpO1xuXG4gICAgICAgIC8vfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfX0se1xuICAgIF9pZDogXCJsYXN0X25hbWVcIixcbiAgICB0eXBlOiBcInRleHRcIixcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogXCJMYXN0IE5hbWVcIixcbiAgICBmdW5jOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAvL2lmKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMYXN0bmFtZSB2YWxpZGF0aW9uOiBcIiwgdmFsdWUpO1xuXG4gICAgICAgIC8vfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfX0se1xuICAgIF9pZDogXCJnZW5kZXJcIixcbiAgICB0eXBlOiBcInNlbGVjdFwiLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiBcIkdlbmRlclwiLFxuICAgIHNlbGVjdDogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hbGVcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIm1hbGVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJGZW1hbGVcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImZlbWFsZVwiLFxuICAgICAgICB9LFxuICAgIF0sXG59XSk7XG5pZihNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBBY2NvdW50cy5vbkNyZWF0ZVVzZXIoKG9wdGlvbnMsIHVzZXIpID0+IHtcbiAgICAgICAgdXNlci5zbHVnID0gb3B0aW9ucy5lbWFpbDtcbiAgICAgICAgdXNlci51cGRhdGVBdCA9IHVzZXIuY3JlYXRlZEF0O1xuICAgICAgICB1c2VyLk15UHJvZmlsZSA9IHtcbiAgICAgICAgICAgIGZpcnN0TmFtZTogb3B0aW9ucy5wcm9maWxlLmZpcnN0X25hbWUsXG4gICAgICAgICAgICBsYXN0TmFtZTogb3B0aW9ucy5wcm9maWxlLmxhc3RfbmFtZSxcbiAgICAgICAgICAgIGdlbmRlcjogKG9wdGlvbnMucHJvZmlsZS5nZW5kZXIgPT09IFwiZmVtYWxlXCIpLFxuICAgICAgICAgICAgVXNlclR5cGU6IHtcbiAgICAgICAgICAgICAgICBQZXJzb25hbGl0eToge1xuICAgICAgICAgICAgICAgICAgICBJRToge30sXG4gICAgICAgICAgICAgICAgICAgIE5TOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgVEY6IHt9LFxuICAgICAgICAgICAgICAgICAgICBKUDoge31cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFuc3dlcmVkUXVlc3Rpb25zOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpcnRoRGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYWdlOiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgdXNlci50ZWFtcyA9IFsgVGVhbS5EZWZhdWx0Lk5hbWUgXTtcbiAgICAgICAgdXNlci5yb2xlcyA9IHt9O1xuICAgICAgICB1c2VyLnByb2ZpbGUgPSBvcHRpb25zLnByb2ZpbGU7XG4gICAgICAgIGlmKG9wdGlvbnMuaXNBZG1pbiAmJiBvcHRpb25zLnVzZXJuYW1lID09PSAnYWRtaW4nKSB7XG4gICAgICAgICAgICB1c2VyLnJvbGVzW1JvbGVzLkdMT0JBTF9HUk9VUF0gPSBbJ2FkbWluJ107XG4gICAgICAgICAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModXNlci5faWQsICdhZG1pbicsIFJvbGVzLkdMT0JBTF9HUk9VUCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdCA9IFRlYW0uZmluZE9uZSgge05hbWU6IFRlYW0uRGVmYXVsdC5OYW1lfSApO1xuICAgICAgICAgICAgdXNlci5yb2xlc1tUZWFtLkRlZmF1bHQuTmFtZV0gPSBbJ21lbWJlcicsIERlZmF1bHRzLnJvbGUubmFtZV07XG4gICAgICAgICAgICB0LmFkZFVzZXJzKCB1c2VyLl9pZCApO1xuXHRcdH1cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfSk7XG4gICAgQWNjb3VudHMudmFsaWRhdGVOZXdVc2VyKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHZhciBsb2dnZWRJblVzZXI7XG4gICAgICAgIHRyeSB7IGxvZ2dlZEluVXNlciA9IE1ldGVvci51c2VyKCk7IH1cbiAgICAgICAgY2F0Y2goZXgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbG9nZ2VkSW5Vc2VyIHx8IFJvbGVzLnVzZXJJc0luUm9sZShsb2dnZWRJblVzZXIsIFsnYWRtaW4nLCdtYW5hZ2UtdXNlcnMnXSwgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgIC8vIE5PVEU6IFRoaXMgZXhhbXBsZSBhc3N1bWVzIHRoZSB1c2VyIGlzIG5vdCB1c2luZyBncm91cHMuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJOb3QgYXV0aG9yaXplZCB0byBjcmVhdGUgbmV3IHVzZXJzXCIpO1xuICAgIH0pO1xufVxuIiwiY29uc3QgRGVmYXVsdHMgPSB7XG5cdCd1c2VyJzoge1xuXHRcdCd1c2VybmFtZSc6ICdhZG1pbicsXG5cdFx0J2VtYWlsJzogJ2FkbWluQG15ZG9tYWluLmNvbScsXG5cdFx0J2lzQWRtaW4nOiB0cnVlLFxuXHRcdCdwcm9maWxlJzoge1xuXHRcdFx0J2ZpcnN0X25hbWUnOiAnQWRtaW4nLFxuXHRcdFx0J2xhc3RfbmFtZSc6ICdBZG1pbicsXG5cdFx0XHQnZ2VuZGVyJzogJ2ZlbWFsZSdcblx0XHR9XG5cdH0sXG5cdCd0ZWFtJzoge1xuXHRcdCdOYW1lJzogXCJObyBUZWFtXCIsXG5cdFx0J1B1YmxpYyc6IHRydWUsXG5cdFx0J01lbWJlcnMnOiBbXSxcblx0XHQnQWN0aXZlJzogdHJ1ZSxcblx0fSxcblx0J3JvbGUnOiB7XG5cdFx0J25hbWUnOiAnTm8tUGVybWlzc2lvbnMnXG5cdH1cbn1cblxuZXhwb3J0IHsgRGVmYXVsdHMgfTsiLCIvLyBJbXBvcnQgbW9kdWxlcyB1c2VkIGJ5IGJvdGggY2xpZW50IGFuZCBzZXJ2ZXIgdGhyb3VnaCBhIHNpbmdsZSBpbmRleCBlbnRyeSBwb2ludFxuLy8gZS5nLiB1c2VyYWNjb3VudHMgY29uZmlndXJhdGlvbiBmaWxlLlxuaWYoTWV0ZW9yLmlzQ2xpZW50KSB7IFNlc3Npb24uc2V0RGVmYXVsdCgncmVmcmVzaFF1ZXN0aW9ucycsIE1hdGgucmFuZG9tKCkpOyB9XG5pbXBvcnQgJy4vYXRfY29uZmlnLmpzJzsiLCJjb25zdCBTcnZEZWZhdWx0cyA9IHtcbiAgICAndXNlcic6IHtcbiAgICAgICAgJ3Bhc3N3b3JkJzogJ2FkbWluJ1xuICAgIH0sXG4gICAgJ3VwbG9hZFBhdGgnOiAnL3VwbG9hZHMvJ1xufVxuXG5leHBvcnQgeyBTcnZEZWZhdWx0cyB9O1xuIiwiLy8gRmlsbCB0aGUgREIgd2l0aCBleGFtcGxlIGRhdGEgb24gc3RhcnR1cFxuXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFF1ZXN0aW9uLCBNeWVyc0JyaWdnc0NhdGVnb3J5IH0gZnJvbSAnLi4vLi4vYXBpL3F1ZXN0aW9ucy9xdWVzdGlvbnMuanMnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uLy4uL2FwaS91c2Vycy91c2Vycy5qcyc7XG5pbXBvcnQgeyBUZWFtIH0gZnJvbSAnLi4vLi4vYXBpL3RlYW1zL3RlYW1zLmpzJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IERlZmF1bHRzIH0gZnJvbSAnLi4vYm90aC9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBTcnZEZWZhdWx0cyB9IGZyb20gJy4vZGVmYXVsdHMuanMnO1xuaW1wb3J0IHsgVHlwZVJlYWRpbmcsIFJlYWRpbmdSYW5nZSwgVHlwZVJlYWRpbmdDYXRlZ29yeSB9IGZyb20gJy4uLy4uL2FwaS90eXBlX3JlYWRpbmdzL3R5cGVfcmVhZGluZ3MuanMnO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICAgdmFyIGRlZmF1bHRVc2VySWQ7XG4gICAgaWYoTWV0ZW9yLnVzZXJzLmZpbmQoKS5jb3VudCgpIDwgMSkge1xuICAgICAgICBkZWZhdWx0VXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7XG4gICAgICAgICAgICB1c2VybmFtZTogRGVmYXVsdHMudXNlci51c2VybmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiBEZWZhdWx0cy51c2VyLmVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IFNydkRlZmF1bHRzLnVzZXIucGFzc3dvcmQsXG4gICAgICAgICAgICBpc0FkbWluOiBEZWZhdWx0cy51c2VyLmlzQWRtaW4sXG4gICAgICAgICAgICBwcm9maWxlOiBEZWZhdWx0cy51c2VyLnByb2ZpbGUsXG4gICAgICAgICAgICB0ZWFtczogW1RlYW0uRGVmYXVsdC5OYW1lXVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHQgPSBUZWFtLmZpbmRPbmUoIHtOYW1lOiBUZWFtLkRlZmF1bHQuTmFtZX0gKTtcbiAgICAgICAgdC5DcmVhdGVkQnkgPSB1c2VySWQ7XG4gICAgICAgIHQuc2F2ZSgpO1xuICAgIH1cblxuICAgIC8vYWRkIGFsbCBleGlzdGluZyBtZW1iZXJzIHRvIHRoZSBkZWZhdWx0IHRlYW1cbiAgICBsZXQgdGVhbVVzZXJJZExpc3QgPSBbXTtcbiAgICBVc2VyLmZpbmQoIHt9ICkuZm9yRWFjaCggKHUpID0+IHtcbiAgICAgICAgdGVhbVVzZXJJZExpc3QucHVzaCh1Ll9pZCk7XG4gICAgICAgIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyh1Ll9pZCwgJ21lbWJlcicsIFRlYW0uRGVmYXVsdC5OYW1lKTtcbiAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh1Ll9pZCwgJ2FkbWluJywgUm9sZXMuR0xPQkFMX0dST1VQKSkge1xuICAgICAgICAgICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHUuX2lkLCAnYWRtaW4nLCBUZWFtLkRlZmF1bHQuTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModS5faWQsIERlZmF1bHRzLnJvbGUubmFtZSwgVGVhbS5EZWZhdWx0Lk5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy9UZWFtLkRlZmF1bHQuTWVtYmVycyA9IFRlYW0uRGVmYXVsdC5NZW1iZXJzLmNvbmNhdCh0ZWFtVXNlcklkTGlzdCk7XG4gICAgVGVhbS5EZWZhdWx0Lk1lbWJlcnMgPSB0ZWFtVXNlcklkTGlzdDtcbiAgICBUZWFtLkRlZmF1bHQuc2F2ZSgpO1xuXG4gICAgbGV0IGV4aXN0aW5nUm9sZU5hbWVzID0gW107XG4gICAgUm9sZXMuZ2V0QWxsUm9sZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGV4aXN0aW5nUm9sZU5hbWVzLnB1c2goci5uYW1lKTtcbiAgICB9KTtcbiAgICBsZXQgcG9zc2libGVSb2xlcyA9IFtcImFkbWluXCIsXCJ2aWV3LWdvYWxzXCIsXCJ2aWV3LW1lbWJlcnNcIixcIm1lbWJlclwiLFwibWVudG9yXCIsXCJhc3NpZ25lZFwiLFwibWFuYWdlLXVzZXJzXCIsXCJsZWFybi1zaGFyZS1ob3N0XCIsXCJkZXZlbG9wZXJcIl07XG4gICAgZm9yIChsZXQgaSBpbiBwb3NzaWJsZVJvbGVzKSB7XG4gICAgICAgIGlmIChleGlzdGluZ1JvbGVOYW1lcy5pbmRleE9mKHBvc3NpYmxlUm9sZXNbaV0pID09PSAtMSkge1xuICAgICAgICAgICAgUm9sZXMuY3JlYXRlUm9sZShwb3NzaWJsZVJvbGVzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZGluZyB0aGlzIHNvIHRoYXQgaXQgd2lsbCBhdXRvIGZpeCB0eXBlIHJlYWRpbmdzIGluc2VydGVkIHRoZSB3cm9uZyB3YXkuIFdlIGNhbiByZW1vdmUgdGhpcyBvbmNlIG5vIG9uZSBoYXMgdGhlbS5cbiAgICBjb25zdCBSYXdSZWFkaW5ncyA9IFR5cGVSZWFkaW5nLmdldENvbGxlY3Rpb24oKTtcbiAgICB2YXIgd3JvbmdSZWFkaW5ncyA9IFJhd1JlYWRpbmdzLmZpbmQoeyBcIk15ZXJzQnJpZ2dzQ2F0ZWdvcnlcIiA6IHsgJGV4aXN0cyA6IHRydWUgfSB9KTtcbiAgICB3cm9uZ1JlYWRpbmdzLmZvckVhY2goKHJlYWRpbmcpID0+IHtcbiAgICAgICAgdmFyIG5ld1R5cGUgPSBuZXcgVHlwZVJlYWRpbmdDYXRlZ29yeSh7IE15ZXJzQnJpZ2dzQ2F0ZWdvcnk6IHJlYWRpbmcuTXllcnNCcmlnZ3NDYXRlZ29yeSwgUmFuZ2U6IHJlYWRpbmcuUmFuZ2UgfSk7XG4gICAgICAgIGRlbGV0ZSByZWFkaW5nLk15ZXJzQnJpZ2dzQ2F0ZWdvcnk7XG4gICAgICAgIGRlbGV0ZSByZWFkaW5nLlJhbmdlO1xuICAgICAgICBkZWxldGUgcmVhZGluZy5UeXBlUmVhZGluZ0NhdGVnb3JpZXM7XG4gICAgICAgIFJhd1JlYWRpbmdzLnVwZGF0ZSh7IF9pZDogcmVhZGluZy5faWQgfSwgeyAkdW5zZXQ6IHsgTXllcnNCcmlnZ3NDYXRlZ29yeTogXCJcIiwgUmFuZ2U6IFwiXCIgfSB9KTtcbiAgICAgICAgdmFyIG5ld1JlYWRpbmcgPSBuZXcgVHlwZVJlYWRpbmcocmVhZGluZyk7XG4gICAgICAgIG5ld1JlYWRpbmcuX2lzTmV3ID0gZmFsc2U7XG4gICAgICAgIG5ld1JlYWRpbmcuYWRkVHlwZUNhdGVnb3J5KG5ld1R5cGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdSZWFkaW5nKTtcbiAgICAgICAgbmV3UmVhZGluZy5nZXRNb2RpZmllZCgpO1xuICAgICAgICBuZXdSZWFkaW5nLnNhdmUoKTtcbiAgICB9KTtcblxuICAgIC8vY29udmVydCBxdWVzdGlvbnMgd2l0aCBzaW5nbGUgY2F0ZWdvcnkgdG8gYXJyYXkgb2YgY2F0ZWdvcmllc1xuICAgIGxldCBxcyA9IFF1ZXN0aW9uLmZpbmQoIHtDYXRlZ29yaWVzOiB7JGV4aXN0czogZmFsc2V9fSApO1xuICAgIGlmIChxcykge1xuICAgICAgICBxcy5mb3JFYWNoKGZ1bmN0aW9uIChxKSB7XG4gICAgICAgICAgICBxLkNhdGVnb3JpZXMgPSBbcS5DYXRlZ29yeV07XG4gICAgICAgICAgICBxLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGZzID0gTnBtLnJlcXVpcmUoJ2ZzJyk7XG4gICAgdmFyIHVwbG9hZFBhdGggPSBTcnZEZWZhdWx0cy51cGxvYWRQYXRoO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICghZnMuZXhpc3RzU3luYyh1cGxvYWRQYXRoKSkge1xuICAgICAgICAgICAgZnMubWtkaXJTeW5jKHVwbG9hZFBhdGgpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKCcvbGVhcm5TaGFyZVJlY29yZGluZycsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuXHRcdGxldCBmaWxlTmFtZSA9IHJlcS51cmwuc3BsaXQoJy8nKVsxXTtcblxuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyh1cGxvYWRQYXRoK2ZpbGVOYW1lKSkge1xuICAgIFx0XHRyZXMud3JpdGVIZWFkKDIwMCwgeyAnQ29udGVudC1UeXBlJzogJ3ZpZGVvL21wNCcgfSk7XG5cbiAgICAgICAgICAgIGZzLnJlYWRGaWxlKHVwbG9hZFBhdGgrZmlsZU5hbWUsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmlsZSBkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDA0KTtcbiAgICAgICAgICAgIHJlcy53cml0ZSgnNDA0IG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICB9XG5cdH0pO1xufSk7XG4iLCIvLyBJbXBvcnQgc2VydmVyIHN0YXJ0dXAgdGhyb3VnaCBhIHNpbmdsZSBpbmRleCBlbnRyeSBwb2ludFxuXG5pbXBvcnQgJy4uL2JvdGgvZGVmYXVsdHMuanMnO1xuaW1wb3J0ICcuL2RlZmF1bHRzLmpzJztcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XG5pbXBvcnQgJy4vcmVnaXN0ZXItYXBpLmpzJztcbiIsIi8vIFJlZ2lzdGVyIHlvdXIgYXBpcyBoZXJlXG5cbmltcG9ydCAnLi4vLi4vYXBpL3F1ZXN0aW9ucy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3F1ZXN0aW9ucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3VzZXJzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdXNlcnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS90eXBlX3JlYWRpbmdzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdHlwZV9yZWFkaW5ncy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3RlYW1zL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdGVhbXMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS90ZWFtX2dvYWxzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdGVhbV9nb2Fscy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL2luZGl2aWR1YWxfZ29hbHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9pbmRpdmlkdWFsX2dvYWxzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvbGVhcm5fc2hhcmUvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9sZWFybl9zaGFyZS9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3JvbGVzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdXNlcl9zZWdtZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3VzZXJfc2VnbWVudHMvbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS91c2VyX2ZlZWRiYWNrL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdXNlcl9mZWVkYmFjay9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3VzZXJfbm90aWZ5L3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuIiwiLy8gU2VydmVyIGVudHJ5IHBvaW50LCBpbXBvcnRzIGFsbCBzZXJ2ZXIgY29kZVxuXG5pbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvYm90aCc7XG5pbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJztcbiJdfQ==
