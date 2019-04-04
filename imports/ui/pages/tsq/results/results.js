import './results.html'; 
import { Template } from 'meteor/templating';
import { callWithPromise } from '/imports/client/callWithPromise';

let keyInfo = new ReactiveVar();
let confidenceStatments = {
    '0': 'No confidence information',
    '1': 'a month or more',
    '2': 'a week or two',
    '3': 'a couple of days',
    '4': '8 to 10 hours',
    '5': 'a couple of hours',
    '6': 'I could architect and give detailed technical leadership to a team today'
}

Template.tsq_results.onCreated(function(){
    this.autorun(async () => {
        const getUserKey = await callWithPromise('tsq.getKeyData', FlowRouter.getParam('key'));
        let info = getUserKey.data.data.payload;
        keyInfo.set(info);
    })
})

Template.tsq_results.helpers({
    skillList() {
        return keyInfo.get().skills
    },
    returnConfidenceStatement(level) {
        return confidenceStatments[level.hash.level.toString()]
    }
})