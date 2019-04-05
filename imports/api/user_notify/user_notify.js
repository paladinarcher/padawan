import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from '../users/users.js';
import { Email } from 'meteor/email';
import { Defaults } from '/imports/startup/both/defaults.js';

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
        // link had to be added here in order for it to work
        link: {
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
            if (Meteor.isServer) {
                let note = e.currentTarget;
                if (!note.isEmailed) {
                    let u = User.findOne( {_id:note.userId} );
                    if (u) {
                        let addr = u.emails[0].address;
                        if(u.MyProfile.emailNotifications){
                            // SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));
                            //     let emailData = {
                            //         text: note.body,
                            //         link: note.link,
                            //     };

                            Email.send({
                                to: addr,
                                from: Defaults.supportEmail,
                                subject: "Developer Level Notification - "+note.title,
                                //html: SSR.render('htmlEmail', emailData),
                                text: note.body + '\n\n'+note.link+'\n\n'
                                //html: '<a href="google.com">Link to Page</a>'

                            });
                        }
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
