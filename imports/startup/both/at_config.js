import { User } from '/imports/api/users/users.js';
import { Team } from '/imports/api/teams/teams.js';
import { Defaults } from '/imports/startup/both/defaults.js';

const myPostLogout = function(){
    //example redirect after logout
    FlowRouter.go('/signin');
};
const mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
};
function myPreSubmitFunc()  { console.log("Pre:  ", arguments); }

function myPostSubmitFunc(userId, info) {
    Accounts.emailTemplates.siteName = "DeveloperLevel";
    Accounts.emailTemplates.from     = "DeveloperLevel <"+Defaults.supportEmail+">";

    Accounts.emailTemplates.verifyEmail = {
        subject() {
            return "[DeveloperLevel] Verify your email address";
        },
        text( user, url ) {
            let emailAddress   = user.emails[0].address,
                urlWithoutHash = url.replace( '#/', '' ),
                supportEmail   = "support@developerlevel.com",
                emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.`;

            return emailBody;
        }
    };
    Accounts.sendVerificationEmail( userId );
    console.log("Post: ", arguments);
}

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: true,

    // Client-side Validation

    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,


    // Privacy Policy and Terms of Use
    // privacyUrl: 'privacy',
    // termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Routing

    defaultTemplate: 'Auth_page',
    defaultLayout: 'App_body',
    defaultContentRegion: 'main',
    defaultLayoutRegions: {},

    // Hooks
    onLogoutHook: myPostLogout,
    onSubmitHook: mySubmitFunc,
    preSignUpHook: myPreSubmitFunc,
    postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
      inputIcons: {
          isValidating: "fa fa-spinner fa-spin",
          hasSuccess: "fa fa-check",
          hasError: "fa fa-times",
      }
    },
});

// Define these routes in a file loaded on both client and server
AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin'
});
AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join'
});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});

AccountsTemplates.addFields([{
    _id: "first_name",
    class: "names",
    type: "text",
    required: true,
    displayName: "First Name",
    // options: {
    //     startRow: true
    // },
    // autoform: {
    //     afFieldInput: {
    //       class: 'custom'
    //     },
    // },
    func: function(value) {
        //if(Meteor.isClient) {
            console.log("Firstname validation: ", value);

        //}
        return false;
    }},{
    _id: "last_name",
    type: "text",
    required: true,
    displayName: "Last Name",
    // options: {
    //     endRow: true,
    //     afFieldInput: {
    //         class: 'custom'
    //       },
    // },
    // autoform: {
    //     afFieldInput: {
    //       class: 'custom'
    //     },
    // },
    func: function(value) {
        //if(Meteor.isClient) {
            console.log("Lastname validation: ", value);

        //}
        return false;
    }},
    {
     _id: "access_code",
    type: "text",
    required: true,
    displayName: "Access Code",
    func: function(value) {
        let padl = /PADL/;
        isPadl = value.search(padl);
        if (Meteor.isClient){
            if (isPadl !== -1) {
                return false;
            }
            return true;
        }
    },
    errStr: 'Incorrect Access Code',
    negativeValidation: true,
    negativeFeedback: true,
    },
    {
    _id: "gender",
    type: "select",
    required: true,
    displayName: "Gender",
    select: [
        {
            text: "Male",
            value: "male",
        },
        {
            text: "Female",
            value: "female",
        },
    ],
}]);


AccountsTemplates.removeField('gender');

if(Meteor.isServer) {
    Accounts.onCreateUser((options, user) => {
        user.slug = options.email;
        user.updateAt = user.createdAt;
        user.MyProfile = {
            firstName: options.profile.first_name,
            lastName: options.profile.last_name,
            gender: (options.profile.gender === "female"),
            UserType: {
                Personality: {
                    IE: {},
                    NS: {},
                    TF: {},
                    JP: {}
                },
                AnsweredQuestions: [],
				AnsweredQnaireQuestions: []
            },
            birthDate: undefined,
            age: undefined
        };
        user.teams = [ Team.Default.Name ];
        user.roles = {};
        user.profile = options.profile;
        if(options.isAdmin && options.username === 'admin') {
            user.roles[Roles.GLOBAL_GROUP] = ['admin'];
            Roles.addUsersToRoles(user._id, 'admin', Roles.GLOBAL_GROUP);
        } else {
            let t = Team.findOne( {Name: Team.Default.Name} );
            user.roles[Team.Default.Name] = ['member', Defaults.role.name];
            t.addUsers( user._id );
		}
        return user;
    });
    Accounts.validateNewUser(function (user) {
        var loggedInUser;
        try { loggedInUser = Meteor.user(); }
        catch(ex) {
            console.log(ex);
        }

        if (!loggedInUser || Roles.userIsInRole(loggedInUser, ['admin','manage-users'], Roles.GLOBAL_GROUP)) {
          // NOTE: This example assumes the user is not using groups.
          return true;
        }

        throw new Meteor.Error(403, "Not authorized to create new users");
    });
	Accounts.validateLoginAttempt(function(attempt) {
		if (!attempt.allowed) {
			return false;
		}

		// search through the emails, and see if it matches the email loging in with
		//let loginEmail = attempt.user.emails.find( (element) => {
		//	return element.address.toLowerCase() === attempt.methodArguments[0].user.email.toLowerCase();
		//});
        //if (loginEmail) {
        //    return true;
        //} else {
        //    throw new Meteor.Error('Email not found', 'Please enter a valid email');
        //}
        return true;
	});


}
