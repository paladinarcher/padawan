import "./user_management.html";
import { User } from "../../../api/users/users.js";


const labelColorSelection = [
    'primary', 'info', 'warning', 'default',
]

const testRoles = [
    'admin', 'manager'
]

const helpers = {
    allUsers(){
        console.log(this.allUsers)
    },
    currentlyAssignedRoles(){},
    pickRandomRoleColor(colors, userCurrentRoles){
        // ref: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
        // var item = items[Math.floor(Math.random()*items.length)];
    }
    // addRoleToUser(){}, 
    // removeRoleFromUser(){},
}

const events = {
    'click .um-add-role': function addRoleToUser(event, instance) {
        // add role function 
    },
    'click .um-remove-role': function removeRoleFromUser(event, instance) {

        // get role from dataset 
        let selectedRole = event.target.dataset.role
        console.log(selectedRole)
        
        // get label 
        let selectedLabel = event.target.parentNode
        console.log(selectedLabel)

        // remove from DOM
        selectedLabel.style.display = 'none'

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