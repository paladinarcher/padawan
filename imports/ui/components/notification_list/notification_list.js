import { UserNotify } from '/imports/api/user_notify/user_notify.js';
import './notification_list.html';

function notificationClickAct(action) {
    console.log(action);
    switch (action[0]) {
    case "learnshare":
        FlowRouter.go('/learnShare/'+action[1]);
        break;
    case "teams":
        FlowRouter.go('/adminTeams');
        break;
    }
}

Template.notification_list.onCreated(function () {
    this.autorun( () => {
        console.log("autorunning notification_list...");
        this.subscription = this.subscribe('notificationList', Meteor.userId(), {
            onStop: function () {
                console.log("Notification List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Notification List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
    });
});

Template.notification_list.helpers({
    notifications() {
        let MAX_NOTIFICATIONS = 6;
        let n = UserNotify.find(
            {userId: Meteor.userId()},
            {sort: {createdDate: -1} }
        );
        if (n) {
            let noteList = [];
            n.forEach(function (note) {
                if (noteList.length < MAX_NOTIFICATIONS) {
                    noteList.push(note);
                } else if (noteList.length === MAX_NOTIFICATIONS) {
                    noteList.push({
                        title: "",
                        body: "See all notifications...",
                        isRead: true,
                        action: "notifications:all"
                    })
                }
                if (!note.isPushed) {
                    if ( (new Date()) - note.createdDate > 1000*60) {
                        //too old, don't send push notification
                        note.markNotified();
                    } else {
                        note.pushNotify({onclick: function(event) {
                            let nid = event.target.data;
                            console.log("rrrr",nid);
                            let un = UserNotify.findOne( {_id:nid} );
                            un.markRead();
                            event.target.close();
                            console.log(un.action);
                            notificationClickAct(un.action.split(":"));
                        }});
                        note.markNotified();
                    }
                }
            });
            return noteList;
        } else {
            return [];
        }
    },
    when(note) {
        let secondsAgo = ( (new Date()) - note.createdDate ) / 1000;
        if (secondsAgo < 2) {
            return "Just now";
        } else if (secondsAgo < 60) {
            return "s";
        } else if (secondsAgo < 60*60) {
            return parseInt(secondsAgo/60) + "m";
        } else if (secondsAgo < 60*60*24) {
            return parseInt(secondsAgo/(60*60)) + "h";
        } else if (typeof note.createdDate !== 'undefined'){
            return note.createdDate.toLocaleDateString("en-US");
        } else {
            return "";
        }
    },
    read(is) {
        if (is) {
            //return "list-group-item-secondary";
            return "";
        } else {
            return "list-group-item-info";
        }
    },
    hasUnread() {
        let n = UserNotify.find( {userId: Meteor.userId(), isRead: false} );
        if (n && n.fetch().length) {
            return "unread";
        } else {
            return "";
        }
    }
});

Template.notification_list.events({
    'click a.notification'(event, instance) {
        event.preventDefault();
        let $target = $(event.target);
        let $li = $target.closest("[data-action]");
        let noteActionStr = $li.data("action");
        let nid = $li.data("nid");
        let noteAction = noteActionStr.split(":");

        let un = UserNotify.findOne( {_id:nid} );
        un.markRead();

        notificationClickAct(noteAction);
    }
});
