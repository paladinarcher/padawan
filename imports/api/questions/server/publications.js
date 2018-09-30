// All questions-related publications

import { Meteor } from 'meteor/meteor';
import { Question, Reading, MyersBriggsCategory } from '../questions.js';
import { User, MyersBriggs, Answer, UserType, Profile } from '../../users/users.js';

Meteor.publishComposite('questions.bycategory', function (category) {
    if(!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    console.log("Publication 'questions.bycategory': ", category, this.userId);
    return {
        find() {
            return Question.find({
                Categories:category
            }, {
                defaults: true,
                sort: {createdAt: -1}
            });
        },
        children: [{
            find(question) {
                return User.find({ _id: question.CreatedBy }, { limit: 1 });
            }
        }]
    };
});

Meteor.publish('questions.toanswer', function (userId, refresh) {
    //console.log(userId, this.userId);
    //if(this.userId !== userId && !Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    console.log("Publication 'questions.toanswer': ", this.userId, userId);
    let self = this;
    let user = User.findOne({_id:userId});
    let qids = user.MyProfile.UserType.getAnsweredQuestionsIDs();
    //console.log(self, user, qids);
    let observe = {
        added: function(id, fields) {
            self.added('questions', id, fields);
        },
        changed: function(id, fields) {
            self.removed("questions", id);
        },
        removed: function(id) {
            self.removed('questions', id);
        }
    };
    let ids = [0,1,2,3];
    ids.sort(function (a, b) {
        let ar = Math.random();
        let br = Math.random();
        if(ar === br) { return 0; }
        return ar > br ? -1 : 1;
    });
    handles = [null, null, null, null];
    let conditions;
    for(let i = 0; i < ids.length; i++) {
        conditions = {
            Categories:ids[i],
            _id: { $nin: qids },
            Active: true,
            $or: [
                {segments: {$exists:false}},
                {segments: {$eq:[]}},
                {segments: {$in:user.MyProfile.segments}}
            ]
        };

        handles[ids[i]] = Question.find( conditions, { limit: 1}).observeChanges(observe);
    }

    self.ready();
    self.onStop(function() {
        for(let i = 0; i < ids.length; i++) {
            handles[i].stop();
        }
    });
});
