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
    },
    familiarCount() {
        familiar = 0;
        keyInfo.get().skills.forEach((value, index) => {
            console.log("value, index: ", value, index);
            if (value.familiar === true) {
                familiar += 1;
            }
        });
        return familiar;
    },
    unfamiliarCount() {
        unfamiliar = 0;
        keyInfo.get().skills.forEach((value, index) => {
            console.log("value, index: ", value.familiar, index);
            if (value.familiar === false) {
                unfamiliar += 1;
            }
        });
        return unfamiliar;
    },
    familiarAverage() {
        familiar = 0;
        confidenceSum = 0
        keyInfo.get().skills.forEach((value, index) => {
            console.log("value, index: ", value, index);
            if (value.familiar === true) {
                familiar += 1;
                confidenceSum += value.confidenceLevel;
            }
        });
        if (familiar > 0) {
            return confidenceSum / familiar;
        } else {
            return "No Familiar Technology"
        }
    },
    unfamiliarAverage() {
        unfamiliar = 0;
        confidenceSum = 0
        keyInfo.get().skills.forEach((value, index) => {
            console.log("value, index: ", value, index);
            if (value.familiar === false) {
                unfamiliar += 1;
                confidenceSum += value.confidenceLevel;
            }
        });
        if (unfamiliar > 0) {
            return confidenceSum / unfamiliar;
        } else {
            return "No Unfamiliar Technology"
        }
    }
})