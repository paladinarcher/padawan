import './mbti_roles.html';
import { Template } from 'meteor/templating';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

let data = new ReactiveVar([]);
let selected = new ReactiveVar({});
let curActivities = new ReactiveVar([]);
let dataRetrieved = new ReactiveVar(false);

async function callResult() {
    dataRetrieved.set(false);
    Session.set('records', undefined);
    let tr = await callWithPromise('at.TeamRoles');
    let dr = await callWithPromise('at.DeveloperRoles');
    let a = await callWithPromise('at.Activities');
    let drar = await callWithPromise('at.DevRoleActivityRating');
    let trar = await callWithPromise('at.TeamRoleActivityRating');
    console.log('dev role activity rating',a,drar);
    data.set({"team_roles" : tr, 'dev_roles' : dr, 'activities' : a, 'dev_role_activity_rating' : drar, 'team_role_activity_rating' : trar});
    selected.set(dr[0]);
    await findDevActivities(dr[0].rating);
    let act = await plotActivities();
    Session.set('records', act);
    dataRetrieved.set(true);
}

function findDevActivities(ids) {
    let activities = data.get().activities;
    let dev_activity_rating = data.get().dev_role_activity_rating;
    let actData = [];
    ids.forEach(id => {
        let rating = dev_activity_rating.find(dar => {
            return dar.id === id;
        });
        if(rating) {
            let activity = activities.find(act => {
                return act.id === rating.activity[0];
            });
            if(activity) {
                let ratingCalc = (rating.k_rating + rating.m_rating) / 2;
                activity.rating = ratingCalc;
                activity.delta = rating.mk_delta;
                actData.push(activity);
            }
        }
    });
    curActivities.set(actData);
}

function plotActivities() { 
    let ids = selected.get().rating;
    findDevActivities(ids);
    let activities = curActivities.get();
    let plot = [];
    activities.forEach(act => {
        plot.push({name: act.name, IE: act.ie, NS: act.sn, TF: act.tf, JP: act.jp, intensity: act.rating, delta: act.delta})
    });
    console.log('Plot Data',plot);
    return plot;
}

Template.mbti_roles.onCreated(function() {
    this.autorun(() => {
        this.subscription2 = this.subscribe("userList", this.userId, {
            onStop: function() {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function() {
                console.log("User List subscription ready! ", arguments, this);
                callResult();
            }
        });
        //callResult();
    });
});

Template.mbti_roles.onRendered(function() {
    let s = Session.get('records');
    if(!s) {
        Session.set('records', plotActivities());
    }
});

Template.mbti_roles.helpers({
    equals(a,b) {
        return a === b;
    },
    results() {
        let records = data.get();
        return records.dev_roles;
    },
    selected() {
        return selected.get().id;
    },
    curRole() {
        return selected.get();
    },
    plotActivities() {
        return Session.get('records');
    },
    getActivities() {
        let ids = selected.get().rating;
        findDevActivities(ids);
        return curActivities.get();
    },
    dataRetrieved() {
        return dataRetrieved.get();
    }
});
Template.mbti_roles.events({
    'change #role': function(event, instance) {
        let val = $(event.target).val();
        let newRole = data.get().dev_roles.find(role => {
            return role.id === val;
        });
        selected.set(newRole);
        Session.set('records', plotActivities());
    }
});