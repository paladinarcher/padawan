// All type-reading-related publications

import { Meteor } from 'meteor/meteor';
import { TypeReading, ReadingRange } from '../type_readings.js';
import { User, MyersBriggs, Answer, UserType, Profile } from '../../users/users.js';
import { MyersBriggsCategory } from "../../questions/questions.js"
Meteor.publishComposite('typereadings.allReadings', function (category) {
    if(!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    console.log("Publication 'typereadings.allReadings': ", category, this.userId);
    return {
        find() { 
            return TypeReading.find({
                MyersBriggsCategory:category
            }, {
                defaults: true,
                sort: { "Range.Delta": -1 }
            });
        },
        children: [{
            find(typereading) {
                return User.find({ _id: typereading.CreatedBy }, { limit: 1 });
            }
        }]
    };
});
Meteor.publish('typereadings.myReadings', function (userId, refresh) {
    //console.log(userId, this.userId);
    //if(this.userId !== userId && !Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    console.log("Publication 'typereadings.myReadings': ", this.userId, userId);
    let self = this;
    let user = User.findOne({_id:userId});
    
    //console.log(self, user);
    let observe = {
        added: function(id, fields) {
            self.added('type_readings', id, fields);
        },
        changed: function(id, fields) {
            self.removed("type_readings", id);
        },
        removed: function(id) {
            self.removed('type_readings', id);
        }
    };
    let userType = user.MyProfile.UserType.Personality;
    let ids = ['IE','NS','TF','JP'];
    handles = [null, null, null, null];
    for(let i = 0; i < ids.length; i++) {
        handles[i] = TypeReading.find({ 
            'MyersBriggsCategory':i, 
            'Range.low': { $lte: userType[ids[i]].Value }, 
            'Range.high': { $gte: userType[ids[i]].Value },
            'Categories.Categories': { $elemMatch: { $in: user.MyProfile.Categories.Categories } }
        },{
            defaults: true,
            sort: { 'ReadingRange.Delta': -1 }
        }).observeChanges(observe);
        console.log(i, ids[i], userType[ids[i]].Value, user.MyProfile.Categories.Categories);
    }
    
    self.ready();
    self.onStop(function() {
        for(let i = 0; i < ids.length; i++) {
            handles[i].stop();
        }
    });
});