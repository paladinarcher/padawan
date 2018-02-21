import { Meteor } from 'meteor/meteor';
import { LearnShareSession } from './learn_share.js';

var formattedDate = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return (year +"-"+ ("00"+month).slice(-2) +"-"+ ("00"+day).slice(-2));
}

var randomChars = () => {
    var text = "";
    var idLength = 2;
    var possible = "acdeghijklmnopqrstuvwxyz";

    for (var i = 0; i < idLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

var lssidGenerate = () => {
    return (formattedDate() + "-" + randomChars());
}
Meteor.methods({
    'learnshare.createNewSession'(sessTitle) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            throw new Meteor.Error(403, "You are not authorized");
        }

        let lssid = lssidGenerate();

        let newSession = new LearnShareSession({
            _id: lssid,
            title: sessTitle
        });
        newSession.save();
        return lssid;
    }
})
