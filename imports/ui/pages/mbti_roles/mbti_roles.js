import './test.html';
import { Template } from 'meteor/templating';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';

let data = new ReactiveVar([]);

async function callResult() {
    let tr = await callWithPromise('at.TeamRoles');
    let dr = await callWithPromise('at.DeveloperRoles');
    let a = await callWithPromise('at.Activities');
    let drar = await callWithPromise('at.DevRoleActivityRating');
    let trar = await callWithPromise('at.TeamRoleActivityRating');
    data.set({"team_roles" : tr, 'dev_roles' : dr, 'activities' : a, 'dev_role_activity_rating' : drar, 'team_role_activity_rating' : trar});
}

Template.my_test.onCreated(function() {
    this.autorun(() => {
        callResult();
    });
});

Template.my_test.helpers({
    results() {
        let records = data.get();
        return records.dev_roles;
    }
});