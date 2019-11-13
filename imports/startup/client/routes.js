import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { UserNotify } from '/imports/api/user_notify/user_notify.js';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/header/header.js';
import '../../ui/components/dl_footer/dl_footer.js';
import '../../ui/components/loading/loading.html';
import '../../ui/components/select_feedback/select_feedback.js';
import '../../ui/components/team_icon/team_icon.html';
import '../../ui/components/timer/timer.js';
import '../../ui/components/video_embed/video_embed.js';
import '../../ui/components/begin/begin.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/admin_tools/admin_tools.js';
import '../../ui/pages/add_questions/add_questions.js';
import '../../ui/pages/question_responses/question_responses.js';
import '../../ui/pages/add_readings/add_readings.js';
import '../../ui/pages/admin_teams/admin_teams.js';
import '../../ui/pages/learn_share/learn_share.js';
import '../../ui/pages/learn_share_list/learn_share_list.js';
import '../../ui/pages/mbti_results/mbti_results.js';
import '../../ui/pages/user_dashboard/user_dashboard.js';
import '../../ui/pages/ask_questions/ask_questions.js';
import '../../ui/pages/dash_min/dash_min.js';
import '../../ui/pages/qnaire_build/qnaire_build.js';
import '../../ui/pages/qnaire_list/qnaire_list.js';
import '../../ui/pages/qnaire/qnaire.js';
import '../../ui/pages/user_profile/user_profile.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/verify/verify.js';
import '../../ui/pages/user_segments/user_segments.js';
import '../../ui/layouts/login/login.js';
import '../../ui/pages/qnaire_results/qnaire_results.js';
import '../../ui/pages/results/results.js';
import '../../ui/pages/results_descriptions/results_descriptions.js';
import '../../ui/pages/verify/verify.html';
import '../../ui/pages/verify/verify.js';
import '../../ui/pages/admin_reports/admin_reports.html';
import '../../ui/pages/admin_reports/admin_reports.js';
import '../../ui/pages/admin_reports/opposites_report/opposites.html';
import '../../ui/pages/admin_reports/opposites_report/opposites.js';
import '../../ui/pages/admin_reports/report_default/report_default.html';
import '../../ui/pages/admin_reports/report_default/report_default.js';
import '../../ui/pages/admin_reports/mbti_report/mbti_report.html';
import '../../ui/pages/admin_reports/mbti_report/mbti_report.js';
import '../../ui/pages/admin_reports/qnaire_mbti_report/qnaire_mbti_report.html';
import '../../ui/pages/admin_reports/qnaire_mbti_report/qnaire_mbti_report.js';
import '../../ui/pages/admin_reports/custom_report_triage/custom_report_triage.html';
import '../../ui/pages/admin_reports/custom_report_triage/custom_report_triage.js';
import '../../ui/pages/comment_report/comment_report.js';
import '../../ui/pages/user_management/user_management.html';
import '../../ui/pages/user_management/user_management.js';
import '../../ui/components/mbtiGraph/mbtiGraphRender.html';
import '../../ui/components/mbtiGraph/mbtiGraphCall.js';
import '../../ui/components/behavior_pattern_area/behavior_pattern_area_render.html';
import '../../ui/components/behavior_pattern_area/behavior_pattern_area_call.js';
import '../../ui/pages/char_sheet/char_sheet.html';
import '../../ui/pages/char_sheet/char_sheet.js';
import '../../ui/pages/tsq/userLanguageList/userLanguageList.html';
import '../../ui/pages/tsq/userLanguageList/userLanguageList.js';
import '../../ui/pages/tsq/confidenceQuestionaire/confidenceQuestionaire.html';
import '../../ui/pages/tsq/confidenceQuestionaire/confidenceQuestionaire.js';
import '../../ui/pages/tsq/familiarVsUnfamiliar/familiarVsUnfamiliar.html';
import '../../ui/pages/tsq/familiarVsUnfamiliar/familiarVsUnfamiliar.js';
import '../../ui/pages/tsq/results/results.html';
import '../../ui/pages/tsq/results/results.js';
import '../../ui/pages/mbti_roles/mbti_roles.html';
import '../../ui/pages/mbti_roles/mbti_roles.js';
import '../../ui/components/mbtiGraph/mbtiGraphRenderMulti.html';
import '../../ui/components/mbtiGraph/mbtiGraphCallMulti.js';
import '../../ui/components/context_menu/context_menu.html';
import '../../ui/components/context_menu/context_menu.js';
import '../../ui/components/char_reports/mbti_char_report.html';
import '../../ui/components/char_reports/mbti_char_report.js';
import '../../ui/components/char_reports/tsq_char_report.html';
import '../../ui/components/char_reports/tsq_char_report.js';
import '../../ui/components/char_reports/tsqByTeam_char_report.js';
import '../../ui/pages/mvp/mvp.html';
import '../../ui/pages/mvp/mvp.js';
import '../../ui/pages/tsq/widget/widget.html';
import '../../ui/pages/tsq/widget/widget.js';
import '../../ui/pages/team_dashboard/team_dashboard.html';
import '../../ui/pages/team_dashboard/team_dashboard.js';
import '../../ui/pages/admin_reports/team_member_tsq/team_member_tsq.html';
import '../../ui/pages/admin_reports/team_member_tsq/team_member_tsq.js';

import { resolveSoa } from 'dns';

// Weak Questions Component
import '../../ui/pages/weak_questions/weak_questions.js';

// returns true if there is a verified email
let checkVerified = function() {
		let isVerified = false;
		Meteor.user().emails.forEach((email) => {
				if (email.verified == true) {
						isVerified = true;
				}
		});
		return isVerified;
}

let ensureEmailVerified = function() {
	/*
	Meteor.setTimeout(() => {
		if ((typeof Meteor.user().username === "undefined" || Meteor.user().username !== "admin") && !Meteor.user().emails[0].verified) {
			FlowRouter.redirect("/verify/notverified");
		}
	},500);
	*/
}

FlowRouter.triggers.enter([function(context, redirect){
  let blaze = context.route.options.blaze;
  BlazeLayout.render('App_body', { top: 'header', main: 'loading', bottom: 'dl_footer' });
  Meteor.call('restricted.hasPermission', context.route.name, (error,result) => {
    if(error) {
      console.log("ERROR", error);
    } else {
      console.log("Restricted Result", result);
      if(result) {
        if(blaze) {
          BlazeLayout.render('App_body', { top: 'header', main: blaze, bottom: 'dl_footer' });
        }
      } else {
        BlazeLayout.render('App_notFound');
      }
    }
  });
}]);

// Weak answered questions
FlowRouter.route('/reports/weakResponses', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'Weak Responses',
    blaze: 'weak_questions',
    action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'weak_questions', bottom: 'dl_footer' });
    },
})

// Opposite answered questions
FlowRouter.route('/reports/oppositeResponses', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'Opposite Responses',
  blaze: 'weak_questions',
  action() {
    // BlazeLayout.render('App_body', {
    //   top: 'header',
    //   main: 'weak_questions',
    //   bottom: 'dl_footer'
    // });
  }
});

// Set up all routes in the app
FlowRouter.route('/verify/notverified', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'Verify',
    blaze: 'verify',
    action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'verify', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'App.home',
  blaze: '',
  action() {
    FlowRouter.redirect('/char_sheet/');
  }
});
FlowRouter.route('/dashboard', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'dashboard',
  blaze: 'dash_min',
  action() {
    // BlazeLayout.render('App_body', {
    //   top: 'header',
    //   main: 'dash_min',
    //   bottom: 'dl_footer'
    // });
  }
});

FlowRouter.route('/loading', {
  name: 'loading',
  blaze: 'loading',
  action() {
    // BlazeLayout.render('App_body', {
    //   top: 'header',
    //   main: 'loading',
    //   bottom: 'dl_footer'
    // });
  }
});

FlowRouter.route('/technicalSkillsQuestionaire/results', {
  name: 'tsq.results',
  blaze: 'tsq_results',
  action() {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'tsq_results'
    });
  }
});

FlowRouter.route('/technicalSkillsQuestionaire/userLanguageList', {
  name: 'tsq.userLanguageList',
  blaze: 'tsq_userLanguageList',
  action() {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'tsq_userLanguageList'
    });
  }
});
FlowRouter.route('/technicalSkillsQuestionaire/familiarVsUnfamiliar/:key', {
  name: 'tsq.familiarVsUnfamiliar',
  blaze: 'tsq_familiarVsUnfamiliar',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'tsq_familiarVsUnfamiliar'
    });
  }
});
FlowRouter.route('/technicalSkillsQuestionaire/confidenceQuestionaire/:key', {
  name: 'tsq.confidenceQuestionarie',
  blaze: 'tsq_confidenceQuestionaire',
  action() {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'tsq_confidenceQuestionaire'
    });
  }
});
FlowRouter.route('/technicalSkillsQuestionaire/results/:key', {
  name: 'tsq',
  blaze: 'tsq_results',
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'tsq_results' });
  }
});

FlowRouter.route('/graphRoles', {
    name: 'mbti_roles',
    blaze: 'mbti_roles',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'mbti_roles', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/mvp', {
  name: 'mvp',
  blaze: 'mvp_register',
  action() {
      //BlazeLayout.render('App_body', { top: '', main: 'mvp_register', bottom: 'dl_footer' });
  },
});
FlowRouter.route('/tools', {
	triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
    name: 'tools',
    blaze: 'admin_tools',
    action() {
        // if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            //BlazeLayout.render('App_body', { top: 'header', main: 'admin_tools', bottom: 'dl_footer' });
        // } else {
        //     BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound', bottom: 'dl_footer' });
        // }
    }
});
FlowRouter.route('/tools/reports', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'admin_reports',
    blaze: 'admin_reports',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'admin_reports', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/tools/reports/:_id', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'reports.show.id',
    blaze: 'report_default',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'report_default', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/tools/reports/custom/:title', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'reports.show.custom',
  blaze: 'custom_report_triage',
  action(params, queryParams) {
    // BlazeLayout.render('App_body', {
    //   top: 'header',
    //   main: 'custom_report_triage',
    //   bottom: 'dl_footer'
    // });
  }
});
FlowRouter.route('/tools/userManagement', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'user_management',
    blaze: 'user_management',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'user_management', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/teamMemberTSQ/:userId', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'TeamMemberTSQ',
  blaze: 'team_member_tsq',
  action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'user_management', bottom: 'dl_footer' });
  }
});
FlowRouter.route('/controlcenter', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'controlcenter',
    blaze: 'user_dashboard',
    action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'user_dashboard', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/questions', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'ask_questions',
    blaze: 'ask_questions',
    action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'ask_questions', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/commentReport', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'comment_report',
    blaze: 'comment_report',
    action() {
      //BlazeLayout.render('App_body', { top: 'header', main: 'comment_report', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/qnaireResults/:qnaireId', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'qnaire_results',
    blaze: 'qnaire_results',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'qnaire_results', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/results', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'results',
    blaze: 'results',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'results', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/resultsDescriptions', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'results_descriptions',
    blaze: 'results_descriptions',
    action() {
        //BlazeLayout.render('App_body', { top: 'header', main: 'results_descriptions', bottom: 'dl_footer' });
    },
});
FlowRouter.route('/signin', {
    name: 'signin',
    blaze: '',
    action() {
        BlazeLayout.render('Auth_page', { });
    }
});
FlowRouter.route('/addQuestions/:category', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'addQuestions',
    blaze: 'add_questions',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'add_questions', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/questionResponses', {
    triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'questionResponses',
    blaze: 'question_responses',
    action(params, queryParams) {
      //BlazeLayout.render('App_body', { top: 'header', main: 'question_responses', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/addTraitDescriptions', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
  name: 'addTraitDescriptions',
  blaze: 'add_readings',
  action(params, queryParams) {
      // the add_readings template checks to see if the user is an admin
      //BlazeLayout.render('App_body', { top: 'header', main: 'add_readings', bottom: 'dl_footer' });
  }
});
FlowRouter.route('/adminTeams', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'adminTeams',
    blaze: 'admin_teams',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'admin_teams', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/qnaire', {
    name: 'qnaire',
    blaze: 'qnaire',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'qnaire', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/qnaire/:qnaireId', {
    name: 'qnaire',
    blaze: 'qnaire',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'qnaire', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/qnaireBuild/:qnaireId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'qnaireBuild',
    blaze: 'qnaire_build',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'qnaire_build', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/qnaireList', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'qnaireList',
    blaze: 'qnaire_list',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'qnaire_list', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/adminTeams/:teamName', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'adminTeams',
    blaze: 'admin_teams',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'admin_teams', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/learnShareList', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'learnShareList',
    blaze: 'learn_share_list',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'learn_share_list', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/learnShare/:lssid', {
    //triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'learnShare',
    blaze: 'learn_share',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'learn_share', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/learnShare', {
    //triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'learnShare',
    blaze: '',
    action(params, queryParams) {
      if (sessionStorage.lastLearnShareId) {
        FlowRouter.go('/learnShare/'+sessionStorage.lastLearnShareId+location.hash);
      } else {
        BlazeLayout.render('App_body', { main: 'App_notFound', bottom: 'dl_footer' });
      }
    }
});
FlowRouter.route('/mbtiResults', {
	triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'mbtiResults',
    blaze: 'mbti_results',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'mbti_results', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/userSegments', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'userSegments',
    blaze: 'user_segments',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'user_segments', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/profile', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'profile',
    blaze: 'user_profile',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'user_profile', bottom: 'dl_footer'});
    }
});
FlowRouter.route('/profile/:userId', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'profile',
  blaze: 'user_profile',
  action(params, queryParams) {
    // BlazeLayout.render('App_body', {
    //   top: 'header',
    //   main: 'user_profile',
    //   bottom: 'dl_footer'
    // });
  }
});
FlowRouter.route('/char_sheet', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'char-sheet',
    blaze: 'char_sheet',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'char_sheet', bottom: 'dl_footer' });
    }
});
FlowRouter.route('/char_sheet/:userId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'char-sheet',
    blaze: 'char_sheet',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'char_sheet', bottom: 'dl_footer' });
    }
});

FlowRouter.route('/teamDashboard/:teamId', {
	triggersEnter: [AccountsTemplates.ensureSignedIn,ensureEmailVerified],
    name: 'team_dashboard',
    blaze: 'team_dashboard',
    action(params, queryParams) {
        //BlazeLayout.render('App_body', { top: 'header', main: 'team_dashboard', bottom: 'dl_footer' });
    }
});

FlowRouter.route('/verify-email/:token', {
  name: 'verify-email',
  blaze: '',
  action(params) {
    Accounts.verifyEmail(params.token, error => {
      if (error) {
        UserNotify.add({
          userId: Meteor.userId(),
          title: 'Verification Error',
          body: 'Error: email address not verified',
          action: 'verify:error'
        });
        FlowRouter.go('/verify/error');
      } else {
        UserNotify.add({
          userId: Meteor.userId(),
          title: 'Verification Success',
          body: 'Success: your email address has been verified',
          action: 'verify:success'
        });
        FlowRouter.go('/');
      }
    });
  }
});
FlowRouter.route('/verify/:vparam', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  blaze: '',
	action(params, queryParams) {
		BlazeLayout.render('verify');
	}
});
FlowRouter.route('/healthcheck', {
  // triggersEnter: [AccountsTemplates.ensureSignedIn],
  // blaze: '',
	action() {
    // BlazeLayout.render('verify');
    // console.log('out');
    // this.render('notFound');
    // ReactLayout.render(App);
	}
});
FlowRouter.notFound = {
  blaze: '',
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound', bottom: 'dl_footer' });
    },
};

// import { WebApp } from 'meteor/webapp';

// import fs from 'fs';
// import path from 'path';
// import url from 'url';

// send 404 
if (Meteor.isServer) {
  WebApp.connectHandlers.use("/healthcheck", function(req, res, next) {
    // var isValidRoute = false;
    // for(var i=0; i<FlowRouter._routes.length; i++){
    //   if (req.url == FlowRouter._routes[i].path) {
    //     isValidRoute = true;
    //     break;
    //   }
    // }
    // if(isValidRoute) {
    //   next();
    // } else {
      // console.log('req: ', req);
      // console.log('res: ', res);
      // console.log('next: ', next);
      // res.writeHead(404);
      // res.end("Not Found");
    // }
    res.statusCode = 404;
    res.statusMessage = 'Not found';
    res.end();
  });
}