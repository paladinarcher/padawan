import "./user_management.html";


const colors = [
    'primary', 'info', 'warning', 'default',
]


const helpers = {}

const events = {}


Template.user_management.onCreated(function () {
    this.autorun(() => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
    });
});

Template.user_management.helpers(helpers);
Template.user_management.events(events);