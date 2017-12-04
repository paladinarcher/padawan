import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { User } from '../users/users.js';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

const GoalComment = Class.create({
    name: 'GoalComment',
    fields: {
        userId: {
            type: String,
            default: function() { return Meteor.userId(); }
        },
        date: {
            type: Date,
            default: function() { return new Date(); }
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
            if (
              Roles.userIsInRole(Meteor.userId(), 'admin', this.teamName)
             ||
              Roles.userIsInRole(Meteor.userId(), 'admin', this.getGoalRoleGroup())
            ) {
                //user is either a global admin, a team admin, or a goal admin
                return true;
            } else {
                return false;
            }
        },
        userIsMentor() {
            if (
                Roles.userIsInRole(Meteor.userId(), 'mentor', this.getGoalRoleGroup())
            ) {
                //user is a mentor for this goal
                return true;
            } else {
                return false;
            }
        },
        userIsAssigned() {
            if (
                Roles.userIsInRole(Meteor.userId(), 'assigned', this.getGoalRoleGroup())
            ) {
                //user is assigned to this goal
                return true;
            } else {
                return false;
            }
        },
        setDateField(fieldName, rdate) {
            if ( typeof rdate === "undefined") {
                rdate = new Date();
            } else if ( !(rdate instanceof Date) ) {
                return false;
            }
            this[fieldName] = rdate;
            return true;
        },
        getUserFullNameX(userId) {
            let u = User.findOne( {_id: userId} );
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
        notifyNew(oldList,newList) {
            let diffList = _.difference(newList,oldList);
            console.log("pppp",diffList);
            for (let i = 0; i < diffList.length; i++) {
                UserNotify.add({
                    userId: diffList[i],
                    title: 'Team Goals',
                    body: 'You have been added to goal '+this.title,
                    action: 'teamgoals:'+this.teamName
                });
            }
        }
    },
    events: {
        beforeSave(e) {
            let egoal = e.currentTarget;

            //any user added to a goal is automatically added to the 'view-goals' role for the team
            //if they are already in that role, this should just ignore the redundant addUser
            let flds = ["assignedTo","mentors","admins"];
            for (let i in flds) {
                if (Array.isArray(egoal[flds[i]]) && egoal[flds[i]].length > 0) {
                    Roles.addUsersToRoles(egoal[flds[i]], 'view-goals', egoal.teamName);
                }
            }
        },
    },
    meteorMethods: {
        setDueDate(rdate) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            if ( this.setDateField("dueDate", rdate) ) {
                this.save();
            } else {
                throw new Meteor.Error(403, "Invalid date");
            }
        },
        setGoalReached(rdate) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            if ( this.setDateField("reachedDate", rdate) ) {
                this.save();
            } else {
                throw new Meteor.Error(403, "Invalid date");
            }
        },
        setReviewDate(rdate) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            if ( this.setDateField("reviewDate", rdate) ) {
                this.save();
            } else {
                throw new Meteor.Error(403, "Invalid date");
            }
        },
        setGoalReviewedOn(rdate) {
            //mentors and admins
            if ( !this.userIsAdmin() && !this.userIsMentor()) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            if ( this.setDateField("reviewedOnDate", rdate) ) {
                this.save();
            } else {
                throw new Meteor.Error(403, "Invalid date");
            }
        },
        addComment(commentTxt) {
            //mentors, admins, and assignees
            if ( !this.userIsAdmin() && !this.userIsMentor() && !this.userIsAssigned() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.goalComments.push(
                new GoalComment( {
                    userId: Meteor.userId(),
                    date: new Date(),
                    text: commentTxt,
                } )
            );
            this.save();
        },
        addReviewComment(commentTxt) {
            //mentors and admins
            if ( !this.userIsAdmin() && !this.userIsMentor() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.reviewComments.push(
                new GoalComment( {
                    userId: Meteor.userId(),
                    date: new Date(),
                    text: commentTxt,
                } )
            );
            this.save();
        },
        createNewGoal() {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            //
        },
        setTitle(title) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.title = title;
            this.save();
        },
        setDescription(descr) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.description = descr;
            this.save();
        },
        setAssignedTo(ulist) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.notifyNew(this.assignedTo,ulist);
            this.assignedTo = ulist;
            this.save();
        },
        setMentors(ulist) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }
            this.notifyNew(this.mentors,ulist);
            this.mentors = ulist;
            this.save();
        },
        setAdmins(ulist) {
            //admins only
            if ( !this.userIsAdmin() ) {
                throw new Meteor.Error(403, "You are not authorized");
            }

            this.notifyNew(this.admins,ulist);
            this.admins = ulist;
            this.save();
        },
        getUserFullName(userId) {
            const invocation = DDP._CurrentInvocation.get();
            if (invocation.isSimulation) {
                return "George";
            }
            let u = User.findOne( {_id: userId} );
            if (!u) {
                return "Michael";
            }
            let name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
            return name;
        },
        updateFromObj(updObj) {
            let permError = false;

            for (let fld in updObj) {
                if (
                  this[fld] !== updObj[fld] ||
                  (Array.isArray(updObj[fld]) && _.isEqual(this[fld], updObj[fld]))
                ) {
                    if (this.hasModifyPerm(fld)) {
                        if (fld === "assignedTo" || fld === "mentors" || fld === "admins") {
                            this.notifyNew(this[fld],updObj[fld]);
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

export { TeamGoal };
