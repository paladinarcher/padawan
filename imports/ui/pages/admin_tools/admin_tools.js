import './admin_tools.html';

Template.admin_tools.onCreated(function () {
    this.autorun( () => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
    });
});

Template.admin_tools.events({
    'click button.add_questions'(event, instance) {
        FlowRouter.go('/addQuestions/IE');
    },
    'click button.reports'(event, instance) {
        FlowRouter.go('/tools/reports');
    },
    'click button.add_descriptions'(event, instance) {
        FlowRouter.go('/addTraitDescriptions');
    },
    'click button.user_management' (event, instance) {
        FlowRouter.go('/tools/userManagement')
    }
    
});
