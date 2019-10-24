import { User } from '/imports/api/users/users.js';
import { ReactiveVar } from 'meteor/reactive-var';
var minQuestionsAnswered = 72;

Template.char_sheet.onCreated(function () {
    console.log("conmenu right here: ", Session.get('conMenuClick'));
    Session.set("authorizedAccess", true);
    this.autorun(() => {
        if (Session.get("newLogin")) {
            this.userid = Meteor.userId();
            Session.set("newLogin", false);
            FlowRouter.go('/char_sheet/' + Meteor.userId());
        }
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
        // Allow admin to see others characters sheets with the url. 
        // Non admins will be redirected to their character sheet.
        if (!Roles.subscription.ready()) {
            console.log('Roles subscription not ready');
        } else if (this.data.userId) {
            this.userId = this.data.userId;
        } else if (isAdmin && FlowRouter.getParam('userId')) {
            this.userId = FlowRouter.getParam('userId');
        } else if (FlowRouter.getParam('userId')) {
            let nonAdminId = FlowRouter.getParam('userId');
            let realId = Meteor.userId();
            // commented code below used to be used to redirect unauthorized user
            if (nonAdminId == realId || isAdmin) {
                // this.userId = FlowRouter.getParam('userId');
            } else {
                // FlowRouter.go('/char_sheet/' + realId);
                Session.set("authorizedAccess", false);
            }
        }
        this.subscription = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
        this.subscription2 = this.subscribe('userList', this.userId, {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
        this.subscription3 = this.subscribe('segmentList', this.userId, {
            onStop: function () {
                console.log("Segment List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Segment List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });
});

Accounts.onLogin(function() {
    if (Accounts.loggingIn()) {
        Session.set("newLogin", true);
    }
});


Template.char_sheet.helpers({
    authorizedAccess(){
        return Session.get("authorizedAccess");
    },
    tsqTeam(){
        let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', '__global_roles__');
        if(Session.get("teamClicked") !== undefined && Session.get("conMenuClick") === 'tsq' && isAdmin){
            return true;
        } else {
            return false;
        }
    },
    conMenuValue(curComp) {
        // if session variable is undefined, 'overview', or the current component, show it
        if ([undefined, 'overview', curComp].indexOf(Session.get('conMenuClick')) != -1) {
            return true;
        } else {
            return false;
        }
    },
    onPandATeam(){
        if(Roles.userIsInRole(Meteor.userId(), ['member'], 'Paladin & Archer')){
          return true;
        }else{
          return false;
        }
      },
});

