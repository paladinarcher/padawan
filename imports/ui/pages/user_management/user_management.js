import "./user_management.html";
import { User } from "../../../api/users/users.js";
import { ReactiveVar } from "meteor/reactive-var";
// import { Roles } from "../../../api/roles/";

const labelColorSelection = [
    'primary', 'info', 'warning', 'default', 'danger',
]

const testRoles = [
    'admin', 'manager'
]


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

// function subscribeToUsers(self) {
//     self.rolesubscription = self.subscribe('roles', {
//         onReady: subOnReady(),
//         onStop: subOnStop()
//     })
//     console.log('subscribed to roles DB')
//     return false
// }

const removeRoleFromDOM = function (event) {
    // get role from dataset 
    let selectedRole = event.target.dataset.role
    console.log(selectedRole)

    // get label 
    let selectedLabel = event.target.parentNode
    console.log(selectedLabel)

    // remove from DOM
    selectedLabel.style.display = 'none'

    // return 
    return false
}

const helpers = {
    users() {
        let u = User.find().fetch();
        userData = [];
        u.forEach((m) => {
            userData.push({
                _id: m._id,
                name: m.MyProfile.firstName + ' ' + m.MyProfile.lastName,
                roles: m.roles.__global_roles__
            });
            console.log(m.roles.__global_roles__)
        });

        return userData;
    },
    availRoles() {
        let r = Meteor.roles.find().fetch()
        return r 
    },
    selectedUser() {
        return Template.instance().selUser.get()
    },
    pickRandomRoleColor() {
        // ref: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
        let randColor = labelColorSelection[Math.floor(Math.random()*labelColorSelection.length)];
        return randColor
    }
    // addRoleToUser(){}, 
    // removeRoleFromUser(){},
}

const events = {
    'click .um-add-role': function addRoleToUser(event, instance) {
        // add role function 
        // alert('TODO: add roles functionality')
        // $('#role-modal').modal({show:true,focus:true})
        Template.instance().selUser.set(event.target.dataset.user)
        // return selUser
    },
    'click .um-remove-role': function removeRoleFromUser(event, instance) {
        // remove the role from the dom 
        removeRoleFromDOM(event)
        return
    }
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
        // subscribeToRoles(this)
        console.log(User.find({}))
        this.allUsers = User.find().fetch();
        console.log(this.allUsers)
        this.selUser = new ReactiveVar(false)
        this.allRoles = Meteor.roles.find().fetch()
        console.log(this.allRoles)
    });

});

Template.user_management.helpers(helpers);
Template.user_management.events(events);


// users() {
//     let u = User.find().fetch();
//     userData = [];
//     u.forEach((m) => {
//         userData.push({
//             _id: m._id,
//             name: m.MyProfile.firstName + ' ' + m.MyProfile.lastName,
//             pTypes: Object.keys(m.MyProfile.UserType.Personality),
//             personality: m.MyProfile.UserType.Personality,
//         });
//     });

//     return userData;
// }