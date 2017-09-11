// All type-reading-related publications

import { Meteor } from 'meteor/meteor';
import { TypeReading, ReadingRange } from '../type_readings.js';
import { User, MyersBriggs, Answer, UserType, Profile } from '../../users/users.js';
import { MyersBriggsCategory } from "../../questions/questions.js";
Meteor.publishComposite('typereadings.getAll', function () {
    if(!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    var qry = {};
    console.log("Publication 'typereadings.getAll': ", this.userId, qry);
    return {
        find() { 
            return TypeReading.find(qry, {
                defaults: true,
                sort: { "TypeReadingCategories.Range.low":1, "TypeReadingCategories.Range.Delta": -1 }
            });
        },
        children: [{
            find(typereading) {
                return User.find({ _id: typereading.CreatedBy }, { limit: 1 });
            }
        }]
    };
});
Meteor.publishComposite('typereadings.byCategory', function (category) {
    if(!Roles.userIsInRole(this.userId, ['admin'], Roles.GLOBAL_GROUP)) { return this.ready(); }
    var qry = {};
    qry["TypeReadingCategories."+category+".Range.low"] = { $gte: -100 };
    console.log("Publication 'typereadings.byCategory': ", category, this.userId, qry);
    return {
        find() { 
            return TypeReading.find(qry, {
                defaults: true,
                sort: { "TypeReadingCategories.Range.low":1,"TypeReadingCategories.Range.Delta": -1 }
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
    let handle = TypeReading.find({ 
        $and : [
            { $or: [ 
                { $or : [ { "TypeReadingCategories.0": { $type: 10 } }, { "TypeReadingCategories.0" : {$exists: false}} ] }, 
                { $and : [ 
                    { 'TypeReadingCategories.0.Range.low' : { $lte: userType['IE'].Value }}, 
                    { 'TypeReadingCategories.0.Range.high' : { $gte: userType['IE'].Value }}
                ]}
            ]},
            { $or: [ 
                { $or : [ { "TypeReadingCategories.1": { $type: 10 } }, { "TypeReadingCategories.1" : {$exists: false}} ] }, 
                { $and : [ 
                    { 'TypeReadingCategories.1.Range.low' : { $lte: userType['NS'].Value }}, 
                    { 'TypeReadingCategories.1.Range.high' : { $gte: userType['NS'].Value }}
                ]}
            ]},
            { $or: [ 
                { $or : [ { "TypeReadingCategories.2": { $type: 10 } }, { "TypeReadingCategories.2" : {$exists: false}} ] }, 
                { $and : [ 
                    { 'TypeReadingCategories.2.Range.low' : { $lte: userType['TF'].Value }}, 
                    { 'TypeReadingCategories.2.Range.high' : { $gte: userType['TF'].Value }}
                ]}
            ]},
            { $or: [ 
                { $or : [ { "TypeReadingCategories.3": { $type: 10 } }, { "TypeReadingCategories.3" : {$exists: false}} ] }, 
                { $and : [ 
                    { 'TypeReadingCategories.3.Range.low' : { $lte: userType['JP'].Value }}, 
                    { 'TypeReadingCategories.3.Range.high' : { $gte: userType['JP'].Value }}
                ]}
            ]},
            { 'Categories.Categories': { $elemMatch: { $in: user.MyProfile.Categories.Categories } } },
            { 'Enabled': true }
        ]
    },{
        defaults: true,
        sort: { 'TypeReadingCategories.MyersBriggsCategory':1, 'TypeReadingCategories.Range.Delta': -1 }
    }).observeChanges(observe);
    
    self.ready();
    self.onStop(function() {
        handle.stop();
    });
});