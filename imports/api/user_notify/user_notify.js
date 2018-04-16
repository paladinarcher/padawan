import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from '../users/users.js';
import { Email } from 'meteor/email';

let UserNotify = Class.create({
    name: "UserNotify",
    collection: new Mongo.Collection('user_notify'),
    fields: {
        userId: {
            type: String,
            default: ''
        },
        isRead: {
            type: Boolean,
            default: false
        },
        isPushed: {
            type: Boolean,
            default: false
        },
        isEmailed: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        body: {
            type: String,
            default: ''
        },
        action: {
            type: String,
            default: ''
        },
        createdDate: {
            type: Date,
            default: function () { return new Date(); }
        }
    },
    meteorMethods: {
        markRead() {
            this.isRead = true;
            this.save();
        },
        markNotified() {
            this.isPushed = true;
            this.save();
        }
    },
    helpers: {
        test() {
            console.log("123");
        },
        pushNotify(opts) {
            let noteOpts = {
                body: this.body,
                icon: '/img/panda.png',
                data: this._id
            }
            let browserNote;

            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                browserNote = new Notification(this.title, noteOpts);
            }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== "denied") {
                Notification.requestPermission(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        browserNote = new Notification(this.title, noteOpts);
                    }
                });
            }
            if (Notification.permission === "granted" && typeof opts.onclick !== 'undefined') {
                browserNote.onclick = opts.onclick;
            }
        }
    },
    events: {
        beforeSave(e) {
            console.log("save notification");
            if (Meteor.isServer) {
                let note = e.currentTarget;
                if (!note.isEmailed) {
                    let u = User.findOne( {_id:note.userId} );
                    if (u) {
                        console.log(u,note.userId);
                        let addr = u.emails[0].address;
                        console.log("send email", addr, Email);
                        Email.send({
                            to: addr,
                            from: "wayne@paladinarcher.com",
                            subject: "Developer Level Notification - "+note.title,
                            text: note.body
                        });
                        console.log("sent");
                    }
                }
            }
        }
    }
});

if (Meteor.isClient) {
    //
}

UserNotify.add = function(opts) {
    let notify = new UserNotify(opts);
    notify.save();
}

export { UserNotify };
