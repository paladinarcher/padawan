import "./user_management.html";
import { User } from "../../../api/users/users.js";


const colors = [
    'primary', 'info', 'warning', 'default',
]

const helpers = {
    allUsers(){
        console.log(this.allUsers)
    },
    currentlyAssignedRoles(){},
    pickRandomRoleColor(colors, userCurrentRoles){}
    // addRoleToUser(){}, 
    // removeRoleFromUser(){},
}

const events = {
    'click .um-add-role': function addRoleToUser(event, instance) {
        // add role function 
    },
    'click .um-remove-role': function removeRoleFromUser(event, instance) {
        // remove role function 
    }
}


// Functions
function subOnReady() {
    console.log('Subscription is ready!')
}

function subOnStop() {
    console.log('Subscription Stopped!')
}

function subscribeToUsers(self) {
    self.subscription = self.subscribe('users', {
        onReady: subOnReady(),
        onStop: subOnStop()
    })
    console.log('subscribed to users DB')
    return false
}


// main
Template.user_management.onCreated(function () {
    this.autorun(() => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        subscribeToUsers(this)
        this.allUsers = User.find({}).fetch();
        console.log(this.allUsers)
    });

});

Template.user_management.helpers(helpers);
Template.user_management.events(events);