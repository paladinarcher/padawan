import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/add_questions/add_questions.js';
import '../../ui/pages/add_readings/add_readings.js';
import '../../ui/pages/admin_teams/admin_teams.js';
import '../../ui/pages/learn_share/learn_share.js';
import '../../ui/pages/learn_share_list/learn_share_list.js';
import '../../ui/pages/team_goals/team_goals.js';
import '../../ui/pages/user_dashboard/user_dashboard.js';
import '../../ui/pages/user_profile/user_profile.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/layouts/login/login.js';

// Set up all routes in the app
FlowRouter.route('/', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'App.home',
    action() {
      BlazeLayout.render('App_body', { top: 'header', main: 'App_home' });
    },
});
FlowRouter.route('/signin', {
    name: 'signin',
    action() {
        BlazeLayout.render('Auth_page', { });
    }
});
FlowRouter.route('/addQuestions/:category', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'addQuestions',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'add_questions' });
    }
});
FlowRouter.route('/addTraitDescriptions', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'addTraitDescriptions',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'add_readings' });
    }
});
FlowRouter.route('/adminTeams', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'adminTeams',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'admin_teams' });
    }
});
FlowRouter.route('/learnShareList', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'learnShareList',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'learn_share_list' });
    }
});
FlowRouter.route('/learnShare/:lssid', {
    //triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'learnShare',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'learn_share' });
    }
});
FlowRouter.route('/teamGoals/:teamName', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'teamGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'team_goals' });
    }
});
FlowRouter.route('/teamGoals/:teamName/:goalId', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'teamGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'team_goals' });
    }
});
FlowRouter.route('/profile', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'profile',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'user_profile' });
    }
});
FlowRouter.route('/profile/:userId', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'profile',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'user_profile' });
    }
});
FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};
FlowRouter.route('/dashboard', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'dashboard',
    action() {
      BlazeLayout.render('App_body', { top: 'header', main: 'user_dashboard' });
    },
});
