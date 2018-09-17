import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/components/loading/loading.html';
import '../../ui/components/select_feedback/select_feedback.js';
import '../../ui/components/team_icon/team_icon.html';
import '../../ui/components/video_embed/video_embed.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/add_questions/add_questions.js';
import '../../ui/pages/add_readings/add_readings.js';
import '../../ui/pages/admin_teams/admin_teams.js';
import '../../ui/pages/learn_share/learn_share.js';
import '../../ui/pages/learn_share_list/learn_share_list.js';
import '../../ui/pages/team_goals/team_goals.js';
import '../../ui/pages/individual_goals/individual_goals.js';
import '../../ui/pages/user_dashboard/user_dashboard.js';
import '../../ui/pages/ask_questions/ask_questions.js';
import '../../ui/pages/dash_min/dash_min.js';
import '../../ui/pages/user_profile/user_profile.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/verify/verify.js';
import '../../ui/pages/user_segments/user_segments.js';
import '../../ui/layouts/login/login.js';

let ensureEmailVerified = function() {
	/*
	Meteor.setTimeout(() => {
		if ((typeof Meteor.user().username === "undefined" || Meteor.user().username !== "admin") && !Meteor.user().emails[0].verified) {
			FlowRouter.redirect("/verify/notverified");
		}
	},500);
	*/
}

// Set up all routes in the app
FlowRouter.route('/', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'App.home',
    action() {
      FlowRouter.redirect("/dashboard");
    },
});
FlowRouter.route('/dashboard', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'dashboard',
    action() {
      BlazeLayout.render('App_body', { top: 'header', main: 'dash_min' });
    },
});
FlowRouter.route('/controlcenter', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'controlcenter',
    action() {
      BlazeLayout.render('App_body', { top: 'header', main: 'user_dashboard' });
    },
});
FlowRouter.route('/questions', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'ask_questions',
    action() {
      BlazeLayout.render('App_body', { top: 'header', main: 'ask_questions' });
    },
});
FlowRouter.route('/signin', {
    name: 'signin',
    action() {
        BlazeLayout.render('Auth_page', { });
    }
});
FlowRouter.route('/addQuestions/:category', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'addQuestions',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'add_questions' });
    }
});
FlowRouter.route('/addTraitDescriptions', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'addTraitDescriptions',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'add_readings' });
    }
});
FlowRouter.route('/adminTeams', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'adminTeams',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'admin_teams' });
    }
});
FlowRouter.route('/adminTeams/:teamName', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'adminTeams',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'admin_teams' });
    }
});
FlowRouter.route('/learnShareList', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
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
FlowRouter.route('/learnShare', {
    //triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'learnShare',
    action(params, queryParams) {
		if (sessionStorage.lastLearnShareId) {
			FlowRouter.go('/learnShare/'+sessionStorage.lastLearnShareId+location.hash);
		} else {
			BlazeLayout.render('App_body', { main: 'App_notFound' });
		}
    }
});
FlowRouter.route('/teamGoals/:teamName', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'teamGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'team_goals' });
    }
});
FlowRouter.route('/teamGoals/:teamName/:goalId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'teamGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'team_goals' });
    }
});
FlowRouter.route('/goals', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'individualGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'individual_goals' });
    }
});
FlowRouter.route('/goals/:userId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'individualGoals',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'individual_goals' });
    }
});
FlowRouter.route('/userSegments', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'userSegments',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'user_segments' });
    }
});
FlowRouter.route('/profile', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'profile',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'user_profile' });
    }
});
FlowRouter.route('/profile/:userId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'profile',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { top: 'header', main: 'user_profile' });
    }
});
FlowRouter.route( '/verify-email/:token', {
	name: 'verify-email',
	action( params ) {
		Accounts.verifyEmail( params.token, ( error ) =>{
			if ( error ) {
				UserNotify.add({
					userId: Meteor.userId(),
					title: 'Verification Error',
					body: 'Error: email address not verified',
					action: 'verify:error'
				});
				FlowRouter.go( '/verify/error' );
			} else {
				UserNotify.add({
					userId: Meteor.userId(),
					title: 'Verification Success',
					body: 'Success: your email address has been verified',
					action: 'verify:success'
				});
				FlowRouter.go( '/' );
			}
		});
	}
});
FlowRouter.route('/verify/:vparam', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
	action(params, queryParams) {
		BlazeLayout.render('verify');
	}
});
FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};
