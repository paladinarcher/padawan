import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import './learn_share_list.html';

Template.learn_share_list.onCreated( function () {
    this.autorun( () => {
        console.log("autorunning learn_share_list...");
        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);

        this.subscription2 = this.subscribe('learnShareList', Meteor.userId(), {
            onStop: function () {
                console.log("LearnShare List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("LearnShare List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
    });
});

Template.learn_share_list.helpers({
    lsSessList() {
        let lst = LearnShareSession.find().fetch();
        return lst;
    }
});

Template.learn_share_list.events({
    'click button#btn-create-new'(event, instance) {
        Meteor.call('learnshare.createNewSession', $("#sess-title").val(), (error, result) => {
            if (error) {
                console.log("can't create new Learn/Share session", error);
            } else {
                FlowRouter.go("/learnShare/"+result);
            }
        });
    }
});
