import "./user_management.html";
import { User } from "../../../api/users/users.js";
import { ReactiveVar } from "meteor/reactive-var";

// constants 

const labelColorSelection = [
    'primary', 'info', 'warning', 'default', 'danger',
]

// array to hold selected roles
let selectedRoles = []

// reactive vars 
let selUser = new ReactiveVar(false)
let selUserId = new ReactiveVar(false)
let addedRoles = new ReactiveVar(false)

// fn's for subs 
function subOnReady() {
    console.log('Subscription is ready!')
}

function subOnStop() {
    console.log('Subscription Stopped!')
}

function subscribeToUsers(self) {
    self.subscription = self.subscribe('userList', {
        onReady: subOnReady(),
        onStop: subOnStop()
    })
    console.log('subscribed to users DB')
    return false
}

// fn's on the DOM 
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

const addRolesToDOM = function (param) {
    console.log('addRoleToDOM is not built yet!')
}


// fn's to add/remove roles from user on the db 
const addRolesToUserDB = function (userIdentifier, roleType='__global_roles__', arrayOfSelectedRoles) {  
    Meteor.call('user.addRoles', [userIdentifier, roleType, arrayOfSelectedRoles]) 
}

const removeRoleFromUserDB = function (userIdentifier, roleType='__global_roles__', arrayOfSelectedRoles) {
    // console.log('removeRolesFromUserDB is not built yet') 
    Meteor.call('user.removeRoles', [userIdentifier, roleType, arrayOfSelectedRoles]) 
}


// helpers and events 
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
        return selUser.get()
    },
    selectedId() {
        return selUserId.get()
    },
    pickRandomRoleColor() {
        // ref: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
        let randColor = labelColorSelection[Math.floor(Math.random()*labelColorSelection.length)];
        return randColor
    }
}

const events = {
    'click .um-add-role': function showListRolesModal(event, instance) {
        const selectedUser = event.target.dataset.user
        const selectedUserId = event.target.dataset.id
        // set reactive vars 
        selUser.set(selectedUser)
        selUserId.set(selectedUserId)
        
        return 
    },

    'change .roles-checkbox': function createRolesArray(event, instance) {
        let checkedStatus = event.target.checked
        let checkboxValue = event.target.value

        // fn's for the selected roles array 
        const addToRoleArray = (value) => selectedRoles.push(value)

        const removeFromRoleArray = (value) => {
            selectedRoles = selectedRoles.filter(addedRole => addedRole !== value)
            return selectedRoles
        }
        
        (checkedStatus) ? addToRoleArray(checkboxValue) : removeFromRoleArray(checkboxValue) 
    
        return
    },

    'click .role-modal-done': function addRolesToUser(event, instance) {
        const userIdentifier = event.target.dataset.uid
        const roleType = '__global_roles__'
        
        if (selectedRoles.length === 0) return 

        addRolesToUserDB(userIdentifier, roleType, selectedRoles)
        
        // TODO:  add role to user in DOM 
        // addRolesToDOM()

        return 
    },

    'click .um-remove-role': function removeRoleFromUser(event, instance) {
        const userIdentifier = event.target.dataset.id
        const roleToRemove = event.target.dataset.role
        const roleType = '__global_roles__'

        // TODO: remove from the user in db 
        removeRoleFromUserDB(userIdentifier, roleType, roleToRemove)

        removeRoleFromDOM(event)
        return
    }
}


// main temp fns 
Template.user_management.onCreated(function () {
    this.autorun(() => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        subscribeToUsers(this)
        this.allUsers = User.find().fetch();
        this.allRoles = Meteor.roles.find().fetch()
    });

});

Template.user_management.helpers(helpers);
Template.user_management.events(events);
