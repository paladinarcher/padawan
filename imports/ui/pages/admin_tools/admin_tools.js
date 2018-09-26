import './admin_tools.html';

Template.admin_tools.events({
    'click button.add_questions'(event, instance) {
        FlowRouter.go('/addQuestions/IE');
    },
    'click button.reports'(event, instance) {
        FlowRouter.go('/#');
    },
    'click button.add_descriptions'(event, instance) {
        FlowRouter.go('/addTraitDescriptions');
    }
});