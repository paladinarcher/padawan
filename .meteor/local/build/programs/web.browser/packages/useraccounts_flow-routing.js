//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var _ = Package.underscore._;
var AccountsTemplates = Package['useraccounts:core'].AccountsTemplates;
var Accounts = Package['accounts-base'].Accounts;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var Template = Package['templating-runtime'].Template;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/useraccounts_flow-routing/lib/core.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* global
  AccountsTemplates: false,
  BlazeLayout: false,
  FlowRouter: false
*/
'use strict';

// ---------------------------------------------------------------------------------

// Patterns for methods" parameters

// ---------------------------------------------------------------------------------

// Add new configuration options
_.extend(AccountsTemplates.CONFIG_PAT, {
  defaultLayoutType: Match.Optional(String),
  defaultLayout: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),
  defaultTemplate: Match.Optional(String),
  defaultLayoutRegions: Match.Optional(Object),
  defaultContentRegion: Match.Optional(String),
  renderLayout: Match.Optional(Object),
  contentRange: Match.Optional(String),
});

// Route configuration pattern to be checked with check
var ROUTE_PAT = {
  name: Match.Optional(String),
  path: Match.Optional(String),
  template: Match.Optional(String),
  layoutTemplate: Match.Optional(String),
  renderLayout: Match.Optional(Object),
  contentRange: Match.Optional(String),
  redirect: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),
};

/*
  Routes configuration can be done by calling AccountsTemplates.configureRoute with the route name and the
  following options in a separate object. E.g. AccountsTemplates.configureRoute("gingIn", option);
    name:           String (optional). A unique route"s name to be passed to iron-router
    path:           String (optional). A unique route"s path to be passed to iron-router
    template:       String (optional). The name of the template to be rendered
    layoutTemplate: String (optional). The name of the layout to be used
    redirect:       String (optional). The name of the route (or its path) where to redirect after form submit
*/


// Allowed routes along with theirs default configuration values
AccountsTemplates.ROUTE_DEFAULT = {
  changePwd:      { name: "atChangePwd",      path: "/change-password"},
  enrollAccount:  { name: "atEnrollAccount",  path: "/enroll-account"},
  ensureSignedIn: { name: "atEnsureSignedIn", path: null},
  forgotPwd:      { name: "atForgotPwd",      path: "/forgot-password"},
  resetPwd:       { name: "atResetPwd",       path: "/reset-password"},
  signIn:         { name: "atSignIn",         path: "/sign-in"},
  signUp:         { name: "atSignUp",         path: "/sign-up"},
  verifyEmail:    { name: "atVerifyEmail",    path: "/verify-email"},
  resendVerificationEmail: { name: "atResendVerificationEmail", path: "/send-again"}
};

// Current configuration values
AccountsTemplates.options.defaultLayoutRegions = {};
// Redirects
AccountsTemplates.options.homeRoutePath = "/";
AccountsTemplates.options.redirectTimeout = 2000; // 2 seconds

// Known routes used to filter out previous path for redirects...
AccountsTemplates.knownRoutes = [];

// Configured routes
AccountsTemplates.routes = {};

AccountsTemplates.configureRoute = function(route, options) {
  check(route, String);
  check(options, Match.OneOf(undefined, Match.ObjectIncluding(ROUTE_PAT)));
  options = _.clone(options);
  // Route Configuration can be done only before initialization
  if (this._initialized) {
    throw new Error("Route Configuration can be done only before AccountsTemplates.init!");
  }
  // Only allowed routes can be configured
  if (!(route in this.ROUTE_DEFAULT)) {
    throw new Error("Unknown Route!");
  }
  // Allow route configuration only once
  if (route in this.routes) {
    throw new Error("Route already configured!");
  }

  // Possibly adds a initial / to the provided path
  if (options && options.path && options.path[0] !== "/") {
    options.path = "/" + options.path;
  }

  // Updates the current configuration
  options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);

  // Store route options
  this.routes[route] = options;

  // Known routes are used to filter out previous path for redirects...
  AccountsTemplates.knownRoutes.push(options.name);

  if (Meteor.isServer) {
    // Configures "reset password" email link
    if (route === "resetPwd") {
      var resetPwdPath = options.path.substr(1);
      Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl(resetPwdPath + "/" + token);
      };
    }
    // Configures "enroll account" email link
    if (route === "enrollAccount") {
      var enrollAccountPath = options.path.substr(1);
      Accounts.urls.enrollAccount = function(token) {
        return Meteor.absoluteUrl(enrollAccountPath + "/" + token);
      };
    }
    // Configures "verify email" email link
    if (route === "verifyEmail") {
      var verifyEmailPath = options.path.substr(1);
      Accounts.urls.verifyEmail = function(token) {
        return Meteor.absoluteUrl(verifyEmailPath + "/" + token);
      };
    }
  }

  if (route === "ensureSignedIn") {
    return;
  }
  if (route === "changePwd" && !AccountsTemplates.options.enablePasswordChange) {
    throw new Error("changePwd route configured but enablePasswordChange set to false!");
  }
  if (route === "forgotPwd" && !AccountsTemplates.options.showForgotPasswordLink) {
    throw new Error("forgotPwd route configured but showForgotPasswordLink set to false!");
  }
  if (route === "signUp" && AccountsTemplates.options.forbidClientAccountCreation) {
    throw new Error("signUp route configured but forbidClientAccountCreation set to true!");
  }

  // Use BlazeLayout by default
  var defaultLayoutType = AccountsTemplates.options.defaultLayoutType || 'blaze';
  // fullPageAtForm template unless user specified a different site-wide default
  var defaultTemplate = AccountsTemplates.options.defaultTemplate || "fullPageAtForm";
  // Determines the default layout to be used in case no specific one is
  // specified for single routes
  var defaultLayout = AccountsTemplates.options.defaultLayout;
  var defaultLayoutRegions = AccountsTemplates.options.defaultLayoutRegions;
  var defaultContentRegion = AccountsTemplates.options.defaultContentRegion;

  var name = options.name; // Default provided...
  var path = options.path; // Default provided...
  var layoutType = options.layoutType || defaultLayoutType;
  var template = options.template || defaultTemplate;
  var layoutTemplate = options.layoutTemplate || defaultLayout;
  var contentRegion = options.contentRegion || defaultContentRegion;
  var layoutRegions = _.clone(options.layoutRegions || defaultLayoutRegions || {});

  if (layoutType === "blaze") {

    // Ensure that we have the required packages to render Blaze templates

    if (Package['kadira:blaze-layout']) {
      var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes kadira:blaze-layout package.");
    }

    // Strings are assumed to be Blaze template names
    layoutRegions[contentRegion] = template;
  }

  if (layoutType === "blaze-to-react") {

    // Ensure that we have the required packages to render Blaze templates
    //
    // For now we need to render the main template using BlazeToReact

    if (Package['react-runtime']) {
      var React = Package['react-runtime'].React;
    } else {
      throw new Error("layoutTemplate is a React element but React runtime package is not found");
    }

    if (Package['kadira:react-layout']) {
      var ReactLayout = Package['kadira:react-layout'].ReactLayout;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes kadira:react-layout package.");
    }

    if (Package['gwendall:blaze-to-react']) {
      var BlazeToReact = Package['gwendall:blaze-to-react'].BlazeToReact;
    } else {
      throw new Error("useraccounts:flow-routing requires that your project includes the gwendall:blaze-to-react package.");
    }

    layoutRegions[contentRegion] = React.createElement(BlazeToReact, { blazeTemplate: template });
  }

  function doLayout() {
    if (layoutType === "blaze-to-react") {

      // The layout template is a React Class.
      // We need to render using ReactLayout and BlazeToReact

      ReactLayout.render(layoutTemplate, layoutRegions);
    } else {
      // Render using BlazeLayout
      BlazeLayout.render(layoutTemplate, layoutRegions);
    }
  }

  // Possibly adds token parameter
  if (_.contains(["enrollAccount", "resetPwd", "verifyEmail"], route)) {
    path += "/:paramToken";
    if (route === "verifyEmail") {
      FlowRouter.route(path, {
        name: name,
        triggersEnter: [
          function() {
            AccountsTemplates.setState(route);
            AccountsTemplates.setDisabled(true);
          }
        ],
        action: function(params) {
          doLayout();

          var token = params.paramToken;
          if (Meteor.isClient) {
             Accounts.verifyEmail(token, function(error) {
               AccountsTemplates.setDisabled(false);
               AccountsTemplates.submitCallback(error, route, function() {
                 AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.emailVerified);
               });
             });
          }
        }
      });
    } else {
      FlowRouter.route(path, {
        name: name,
        triggersEnter: [
          function() {
            AccountsTemplates.setState(route);
          }
        ],
        action: function(params) {
          doLayout();
        }
      });
    }
  } else {
    FlowRouter.route(path, {
      name: name,
      triggersEnter: [
        function() {
          var redirect = false;
          if (route === 'changePwd') {
            if (!Meteor.loggingIn() && !Meteor.userId()) {
              redirect = true;
            }
          } else if (Meteor.userId()) {
            redirect = true;
          }
          if (redirect) {
            AccountsTemplates.postSubmitRedirect(route);
          } else {
            AccountsTemplates.setState(route);
          }
        }
      ],
      action: function() {
        doLayout();
      }
    });
  }
};


AccountsTemplates.getRouteName = function(route) {
  if (route in this.routes) {
    return this.routes[route].name;
  }
  return null;
};

AccountsTemplates.getRoutePath = function(route) {
  if (route in this.routes) {
    return this.routes[route].path;
  }
  return "#";
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/useraccounts_flow-routing/lib/client/client.js                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* global
  AccountsTemplates: false,
  BlazeLayout: false,
  grecaptcha: false,
  FlowRouter: false,
  $: false
*/
'use strict';


// Previous path used for redirect after form submit
AccountsTemplates._prevPath = null;

// Possibly keeps reference to the handle for the timed out redirect
// set on some routes
AccountsTemplates.timedOutRedirect = null;


AccountsTemplates.clearState = function() {
  _.each(this._fields, function(field) {
    field.clearStatus();
  });
  var form = this.state.form;
  form.set('error', null);
  form.set('result', null);
  form.set('message', null);

  AccountsTemplates.setDisabled(false);

  // Possibly clears timed out redirects
  if (AccountsTemplates.timedOutRedirect !== null) {
    Meteor.clearTimeout(AccountsTemplates.timedOutRedirect);
    AccountsTemplates.timedOutRedirect = null;
  }
};

AccountsTemplates.getparamToken = function() {
  return FlowRouter.getParam('paramToken');
};

// Getter for previous route's path
AccountsTemplates.getPrevPath = function() {
  return this._prevPath;
};

// Setter for previous route's path
AccountsTemplates.setPrevPath = function(newPath) {
  check(newPath, String);
  this._prevPath = newPath;
};

AccountsTemplates.ensureSignedIn = function(context, redirect) {
  if (!Meteor.userId()) {
    // if we're not already on an AT route
    if (!_.contains(AccountsTemplates.knownRoutes, context.route.name)) {

      AccountsTemplates.setState(AccountsTemplates.options.defaultState, function() {
        var err = AccountsTemplates.texts.errors.mustBeLoggedIn;
        AccountsTemplates.state.form.set("error", [err]);
      });

      // redirect settings
      AccountsTemplates.avoidRedirect = true;
      AccountsTemplates.avoidClearError = true;
      AccountsTemplates.redirectToPrevPath = true;

      // redirect to defined sign-in route and then redirect back
      // to original route after successful sign in
      var signInRouteName = AccountsTemplates.getRouteName('signIn');
      if (signInRouteName) {
        redirect(signInRouteName);
      }
      else {
        throw Error('[ensureSignedIn] no signIn route configured!');
      }
    }
  }
};

// Stores previous path on path change...
FlowRouter.triggers.exit([
  function(context) {
    var routeName = context.route.name;
    var knownRoute = _.contains(AccountsTemplates.knownRoutes, routeName);
    if (!knownRoute) {
      AccountsTemplates.setPrevPath(context.path);
    }
  }
]);

AccountsTemplates.linkClick = function(route) {
  if (AccountsTemplates.disabled()) {
    return;
  }
  var path = AccountsTemplates.getRoutePath(route);
  if (path === '#' || AccountsTemplates.avoidRedirect || path === FlowRouter.current().path) {
    AccountsTemplates.setState(route);
  } else {
    Meteor.defer(function() {
      FlowRouter.go(path);
    });
  }

  if (AccountsTemplates.options.focusFirstInput) {
    var firstVisibleInput = _.find(this.getFields(), function(f) {
      return _.contains(f.visible, route);
    });
    if (firstVisibleInput) {
      $('input#at-field-' + firstVisibleInput._id).focus();
    }
  }
};

AccountsTemplates.logout = function() {
  var onLogoutHook = AccountsTemplates.options.onLogoutHook;
  var homeRoutePath = AccountsTemplates.options.homeRoutePath;
  Meteor.logout(function() {
    if (onLogoutHook) {
      onLogoutHook();
    } else if (homeRoutePath) {
      FlowRouter.redirect(homeRoutePath);
    }
  });
};

AccountsTemplates.postSubmitRedirect = function(route) {
  if (AccountsTemplates.avoidRedirect) {
    AccountsTemplates.avoidRedirect = false;
    if (AccountsTemplates.redirectToPrevPath) {
      FlowRouter.redirect(AccountsTemplates.getPrevPath());
    }
  } else {
    var nextPath = AccountsTemplates.routes[route] && AccountsTemplates.routes[route].redirect;
    if (nextPath) {
      if (_.isFunction(nextPath)) {
        nextPath();
      } else {
        FlowRouter.go(nextPath);
      }
    } else {
      var previousPath = AccountsTemplates.getPrevPath();
      if (previousPath && FlowRouter.current().path !== previousPath) {
        FlowRouter.go(previousPath);
      } else {
        var homeRoutePath = AccountsTemplates.options.homeRoutePath;
        if (homeRoutePath) {
          FlowRouter.go(homeRoutePath);
        }
      }
    }
  }
};

AccountsTemplates.submitCallback = function(error, state, onSuccess) {

  var onSubmitHook = AccountsTemplates.options.onSubmitHook;
  if (onSubmitHook) {
    onSubmitHook(error, state);
  }

  if (error) {
    if (_.isObject(error.details)) {
      if (error.error === 'validation-error') {
        // This error is a ValidationError from the mdg:validation-error package.
        // It has a well-defined error format

        // Record errors that don't correspond to fields in the form
        var errorsWithoutField = [];

        _.each(error.details, function(fieldError) {
          var field = AccountsTemplates.getField(fieldError.name);

          if (field) {
            // XXX in the future, this should have a way to do i18n
            field.setError(fieldError.type);
          } else {
            errorsWithoutField.push(fieldError.type);
          }
        });

        if (errorsWithoutField) {
          AccountsTemplates.state.form.set('error', errorsWithoutField);
        }
      } else {
        // If error.details is an object, we may try to set fields errors from it
        _.each(error.details, function(error, fieldId) {
          AccountsTemplates.getField(fieldId).setError(error);
        });
      }
    } else {
      var err = 'error.accounts.Unknown error';
      if (error.reason) {
        err = error.reason;
      }
      if (err.substring(0, 15) !== 'error.accounts.') {
        err = 'error.accounts.' + err;
      }
      AccountsTemplates.state.form.set('error', [err]);
    }
    AccountsTemplates.setDisabled(false);
    // Possibly resets reCaptcha form
    if (state === 'signUp' && AccountsTemplates.options.showReCaptcha) {
      grecaptcha.reset();
    }
  } else {
    if (onSuccess) {
      onSuccess();
    }

    if (_.contains(['enrollAccount', 'forgotPwd', 'resetPwd', 'verifyEmail'], state)) {
      var redirectTimeout = AccountsTemplates.options.redirectTimeout;
      if (redirectTimeout > 0) {
        AccountsTemplates.timedOutRedirect = Meteor.setTimeout(function() {
          AccountsTemplates.timedOutRedirect = null;
          AccountsTemplates.setDisabled(false);
          AccountsTemplates.postSubmitRedirect(state);
        }, redirectTimeout);
      }
    } else if (state) {
      AccountsTemplates.setDisabled(false);
      AccountsTemplates.postSubmitRedirect(state);
    }
  }
};

// Initialization
if (FlowRouter && FlowRouter.initialize) {
  // In order for ensureSignIn triggers to work,
  // AccountsTemplates must be initialized before FlowRouter
  // (this is now true since useraccounts:core is being executed first...)
  var oldInitialize = FlowRouter.initialize;
  FlowRouter.initialize = function() {
    AccountsTemplates._init();
    oldInitialize.apply(this, arguments);
  };
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/useraccounts_flow-routing/lib/client/templates_helpers/at_input.js                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* global
  AccountsTemplates: false,
  FlowRouter: false
*/
'use strict';

AccountsTemplates.atInputRendered.push(function(){
  var fieldId = this.data._id;
  var queryKey = this.data.options && this.data.options.queryKey || fieldId;
  var inputQueryVal = FlowRouter.getQueryParam(queryKey);
  if (inputQueryVal) {
    this.$("input#at-field-" + fieldId).val(inputQueryVal);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("useraccounts:flow-routing");

})();
