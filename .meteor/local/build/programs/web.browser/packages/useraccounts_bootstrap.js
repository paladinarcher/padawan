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
var Template = Package['templating-runtime'].Template;
var _ = Package.underscore._;
var AccountsTemplates = Package['useraccounts:core'].AccountsTemplates;
var Accounts = Package['accounts-base'].Accounts;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_error.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atError");
Template["atError"] = new Template("Template.atError", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-error alert alert-danger"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("error"));
  }, function() {
    return [ "\n      ", HTML.P(Blaze.View("lookup:errorText", function() {
      return Spacebars.mustache(view.lookup("errorText"));
    })), "\n    " ];
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_error.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atError.helpers(AccountsTemplates.atErrorHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_form.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atForm");
Template["atForm"] = new Template("Template.atForm", (function() {
  var view = this;
  return Blaze.Unless(function() {
    return Spacebars.call(view.lookup("hide"));
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "at-form"
    }, "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showTitle"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atTitle")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showOauthServices"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atOauth")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showServicesSeparator"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atSep")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showError"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atError")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showResult"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atResult")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showMessage"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atMessage")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showPwdForm"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atPwdForm")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showTermsLink"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atTermsLink")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showSignInLink"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atSigninLink")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showSignUpLink"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atSignupLink")), "\n      " ];
    }), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("showResendVerificationEmailLink"));
    }, function() {
      return [ "\n        ", Spacebars.include(view.lookupTemplate("atResendVerificationEmailLink")), "\n      " ];
    }), "\n    "), "\n  " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_form.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atForm.helpers(AccountsTemplates.atFormHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_input.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atInput");
Template["atInput"] = new Template("Template.atInput", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      template: Spacebars.call(view.lookup("templateName"))
    };
  }, function() {
    return Spacebars.include(function() {
      return Spacebars.call(Template.__dynamic);
    });
  });
}));

Template.__checkName("atTextInput");
Template["atTextInput"] = new Template("Template.atTextInput", (function() {
  var view = this;
  return HTML.DIV({
    class: function() {
      return [ "at-input form-group ", Blaze.If(function() {
        return Spacebars.call(view.lookup("isValidating"));
      }, function() {
        return "validating";
      }), " ", Blaze.If(function() {
        return Spacebars.call(view.lookup("hasError"));
      }, function() {
        return "has-error";
      }), " ", Blaze.If(function() {
        return Spacebars.call(view.lookup("hasSuccess"));
      }, function() {
        return "has-success";
      }), " ", Blaze.If(function() {
        return Spacebars.call(view.lookup("feedback"));
      }, function() {
        return "has-feedback";
      }) ];
    }
  }, "\n    ", HTML.LABEL({
    class: function() {
      return [ "control-label ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("showLabels"));
      }, function() {
        return "sr-only";
      }) ];
    },
    for: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n      ", Blaze.View("lookup:displayName", function() {
    return Spacebars.mustache(view.lookup("displayName"));
  }), " ", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("required"));
  }, function() {
    return Blaze.View("lookup:optionalText", function() {
      return Spacebars.mustache(view.lookup("optionalText"));
    });
  }), "\n    "), "\n    ", HTML.INPUT({
    type: function() {
      return Spacebars.mustache(view.lookup("type"));
    },
    class: "form-control",
    id: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    },
    name: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    },
    placeholder: function() {
      return Spacebars.mustache(view.lookup("placeholder"));
    },
    autocapitalize: "none",
    autocorrect: "off"
  }), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasIcon"));
  }, function() {
    return [ "\n      ", HTML.SPAN({
      class: function() {
        return [ Spacebars.mustache(view.lookup("iconClass")), " form-control-feedback" ];
      }
    }), "\n    " ];
  }), "\n    ", HTML.SPAN({
    class: function() {
      return [ "help-block ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("hasError"));
      }, function() {
        return "hide";
      }) ];
    }
  }, Blaze.View("lookup:errorText", function() {
    return Spacebars.mustache(view.lookup("errorText"));
  })), "\n  ");
}));

Template.__checkName("atCheckboxInput");
Template["atCheckboxInput"] = new Template("Template.atCheckboxInput", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-input checkbox"
  }, "\n    ", HTML.LABEL({
    for: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n      ", HTML.INPUT(HTML.Attrs({
    type: function() {
      return Spacebars.mustache(view.lookup("type"));
    },
    id: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    },
    name: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("disabled"));
  })), "\n      ", Blaze.View("lookup:displayName", function() {
    return Spacebars.mustache(view.lookup("displayName"));
  }), "\n    "), "\n  ");
}));

Template.__checkName("atSelectInput");
Template["atSelectInput"] = new Template("Template.atSelectInput", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-input field"
  }, "\n    ", HTML.LABEL(Blaze.View("lookup:displayName", function() {
    return Spacebars.mustache(view.lookup("displayName"));
  })), "\n    ", HTML.SELECT({
    class: "form-control",
    id: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    },
    name: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("values"));
  }, function() {
    return [ "\n        ", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(view.lookup("value"));
      }
    }, Blaze.View("lookup:text", function() {
      return Spacebars.mustache(view.lookup("text"));
    })), "\n      " ];
  }), "\n    "), "\n  ");
}));

Template.__checkName("atRadioInput");
Template["atRadioInput"] = new Template("Template.atRadioInput", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-input form-group"
  }, "\n    ", HTML.LABEL(Blaze.View("lookup:displayName", function() {
    return Spacebars.mustache(view.lookup("displayName"));
  })), "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("values"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      class: "at-input radio"
    }, "\n        ", HTML.LABEL({
      for: function() {
        return [ "at-field-", Spacebars.mustache(view.lookup("id")), "-choice-", Spacebars.mustache(view.lookup("value")) ];
      }
    }, "\n          ", HTML.INPUT({
      id: function() {
        return [ "at-field-", Spacebars.mustache(view.lookup("id")), "-choice-", Spacebars.mustache(view.lookup("value")) ];
      },
      type: "radio",
      name: function() {
        return [ "at-field-", Spacebars.mustache(view.lookup("id")) ];
      },
      value: function() {
        return Spacebars.mustache(view.lookup("value"));
      }
    }), "\n          ", Blaze.View("lookup:text", function() {
      return Spacebars.mustache(view.lookup("text"));
    }), "\n        "), "\n      "), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("atHiddenInput");
Template["atHiddenInput"] = new Template("Template.atHiddenInput", (function() {
  var view = this;
  return HTML.INPUT({
    type: "hidden",
    id: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    },
    name: function() {
      return [ "at-field-", Spacebars.mustache(view.lookup("_id")) ];
    }
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_input.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
_.each(AccountsTemplates.atInputRendered, function(callback){
  Template.atInput.onRendered(callback);
  Template.atHiddenInput.onRendered(callback);
});

// Simply 'inherites' helpers from AccountsTemplates
Template.atInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atInput.events(AccountsTemplates.atInputEvents);

// Simply 'inherites' helpers from AccountsTemplates
Template.atTextInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atCheckboxInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atSelectInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atRadioInput.helpers(AccountsTemplates.atInputHelpers);

// Simply 'inherites' helpers from AccountsTemplates
Template.atHiddenInput.helpers(AccountsTemplates.atInputHelpers);


// Sets up default Bootstrap icon classes for social button icons
AccountsTemplates.configure({
    texts: {
        inputIcons: {
            isValidating: "glyphicon glyphicon-refresh",
            hasError: "glyphicon glyphicon-remove",
            hasSuccess: "glyphicon glyphicon-ok",
        }
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_message.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atMessage");
Template["atMessage"] = new Template("Template.atMessage", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-message alert alert-info"
  }, "\n    ", Blaze.View("lookup:message", function() {
    return Spacebars.mustache(view.lookup("message"));
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_message.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atMessage.helpers(AccountsTemplates.atMessageHelpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_nav_button.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atNavButton");
Template["atNavButton"] = new Template("Template.atNavButton", (function() {
  var view = this;
  return HTML.BUTTON({
    type: "button",
    id: "at-nav-button",
    class: "btn btn-default navbar-btn"
  }, Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  }));
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_nav_button.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atNavButton.helpers(AccountsTemplates.atNavButtonHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atNavButton.events(AccountsTemplates.atNavButtonEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_oauth.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atOauth");
Template["atOauth"] = new Template("Template.atOauth", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-oauth"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("oauthService"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("atSocial")), "\n    " ];
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_oauth.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atOauth.helpers(AccountsTemplates.atOauthHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_pwd_form.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atPwdForm");
Template["atPwdForm"] = new Template("Template.atPwdForm", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-pwd-form"
  }, "\n    ", HTML.FORM({
    role: "form",
    id: "at-pwd-form",
    novalidate: "",
    action: "#",
    method: "POST"
  }, "\n      ", HTML.FIELDSET(HTML.Attrs(function() {
    return Spacebars.attrMustache(view.lookup("disabled"));
  }), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("fields"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("atInput")), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("showReCaptcha"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("atReCaptcha")), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("showForgotPasswordLink"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("atPwdLink")), "\n        " ];
  }), "\n        ", Spacebars.include(view.lookupTemplate("atPwdFormBtn")), "\n      "), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_pwd_form.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherits' helpers from AccountsTemplates
Template.atPwdForm.helpers(AccountsTemplates.atPwdFormHelpers);

// Simply 'inherits' events from AccountsTemplates
Template.atPwdForm.events(AccountsTemplates.atPwdFormEvents);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_pwd_form_btn.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atPwdFormBtn");
Template["atPwdFormBtn"] = new Template("Template.atPwdFormBtn", (function() {
  var view = this;
  return HTML.BUTTON({
    type: "submit",
    class: function() {
      return [ "at-btn submit btn btn-lg btn-block btn-default ", Spacebars.mustache(view.lookup("submitDisabled")) ];
    },
    id: "at-btn"
  }, "\n    ", Blaze.View("lookup:buttonText", function() {
    return Spacebars.mustache(view.lookup("buttonText"));
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_pwd_form_btn.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atPwdFormBtn.helpers(AccountsTemplates.atPwdFormBtnHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_pwd_link.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atPwdLink");
Template["atPwdLink"] = new Template("Template.atPwdLink", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-pwd-link"
  }, "\n    ", HTML.P("\n      ", Blaze.View("lookup:preText", function() {
    return Spacebars.mustache(view.lookup("preText"));
  }), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("forgotPwdLink"));
    },
    id: "at-forgotPwd",
    class: function() {
      return [ "at-link at-pwd ", Spacebars.mustache(view.lookup("disabled")) ];
    }
  }, Blaze.View("lookup:linkText", function() {
    return Spacebars.mustache(view.lookup("linkText"));
  })), "\n      ", Blaze.View("lookup:suffText", function() {
    return Spacebars.mustache(view.lookup("suffText"));
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_pwd_link.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atPwdLink.helpers(AccountsTemplates.atPwdLinkHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atPwdLink.events(AccountsTemplates.atPwdLinkEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_reCaptcha.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atReCaptcha");
Template["atReCaptcha"] = new Template("Template.atReCaptcha", (function() {
  var view = this;
  return HTML.DIV({
    class: "g-recaptcha",
    "data-sitekey": function() {
      return Spacebars.mustache(view.lookup("key"));
    },
    "data-theme": function() {
      return Spacebars.mustache(view.lookup("theme"));
    },
    "data-type": function() {
      return Spacebars.mustache(view.lookup("data_type"));
    }
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_reCaptcha.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' rendered callback from AccountsTemplates
Template.atReCaptcha.rendered = AccountsTemplates.atReCaptchaRendered;

// Simply 'inherites' helpers from AccountsTemplates
Template.atReCaptcha.helpers(AccountsTemplates.atReCaptchaHelpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_result.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atResult");
Template["atResult"] = new Template("Template.atResult", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-result alert alert-success"
  }, "\n    ", Blaze.View("lookup:result", function() {
    return Spacebars.mustache(view.lookup("result"));
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_result.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atResult.helpers(AccountsTemplates.atResultHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_sep.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atSep");
Template["atSep"] = new Template("Template.atSep", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-sep"
  }, "\n    ", HTML.STRONG(Blaze.View("lookup:sepText", function() {
    return Spacebars.mustache(view.lookup("sepText"));
  })), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_sep.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atSep.helpers(AccountsTemplates.atSepHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_signin_link.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atSigninLink");
Template["atSigninLink"] = new Template("Template.atSigninLink", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-signin-link"
  }, "\n    ", HTML.P("\n      ", Blaze.View("lookup:preText", function() {
    return Spacebars.mustache(view.lookup("preText"));
  }), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("signInLink"));
    },
    id: "at-signIn",
    class: function() {
      return [ "at-link at-signin ", Spacebars.mustache(view.lookup("disabled")) ];
    }
  }, Blaze.View("lookup:linkText", function() {
    return Spacebars.mustache(view.lookup("linkText"));
  })), "\n      ", Blaze.View("lookup:suffText", function() {
    return Spacebars.mustache(view.lookup("suffText"));
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_signin_link.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atSigninLink.helpers(AccountsTemplates.atSigninLinkHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atSigninLink.events(AccountsTemplates.atSigninLinkEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_signup_link.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atSignupLink");
Template["atSignupLink"] = new Template("Template.atSignupLink", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-signup-link"
  }, "\n    ", HTML.P("\n      ", Blaze.View("lookup:preText", function() {
    return Spacebars.mustache(view.lookup("preText"));
  }), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("signUpLink"));
    },
    id: "at-signUp",
    class: function() {
      return [ "at-link at-signup ", Spacebars.mustache(view.lookup("disabled")) ];
    }
  }, Blaze.View("lookup:linkText", function() {
    return Spacebars.mustache(view.lookup("linkText"));
  })), "\n      ", Blaze.View("lookup:suffText", function() {
    return Spacebars.mustache(view.lookup("suffText"));
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_signup_link.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atSignupLink.helpers(AccountsTemplates.atSignupLinkHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atSignupLink.events(AccountsTemplates.atSignupLinkEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_social.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atSocial");
Template["atSocial"] = new Template("Template.atSocial", (function() {
  var view = this;
  return HTML.BUTTON({
    class: function() {
      return [ "btn at-social-btn ", Spacebars.mustache(view.lookup("disabled")) ];
    },
    id: function() {
      return [ "at-", Spacebars.mustache(view.lookup("name")) ];
    },
    name: function() {
      return Spacebars.mustache(view.lookup("name"));
    }
  }, "\n    ", HTML.I({
    class: function() {
      return Spacebars.mustache(view.lookup("iconClass"));
    }
  }), " ", Blaze.View("lookup:buttonText", function() {
    return Spacebars.mustache(view.lookup("buttonText"));
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_social.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atSocial.helpers(AccountsTemplates.atSocialHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atSocial.events(AccountsTemplates.atSocialEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_terms_link.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atTermsLink");
Template["atTermsLink"] = new Template("Template.atTermsLink", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-terms-link at-wrap"
  }, "\n    ", HTML.P("\n      ", Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("privacyUrl"));
  }, function() {
    return [ "\n        ", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("privacyUrl"));
      },
      class: function() {
        return Spacebars.mustache(view.lookup("disabled"));
      }
    }, Blaze.View("lookup:privacyLinkText", function() {
      return Spacebars.mustache(view.lookup("privacyLinkText"));
    })), "\n      " ];
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("showTermsAnd"));
  }, function() {
    return [ "\n        ", Blaze.View("lookup:and", function() {
      return Spacebars.mustache(view.lookup("and"));
    }), "\n      " ];
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("termsUrl"));
  }, function() {
    return [ "\n        ", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("termsUrl"));
      },
      class: function() {
        return Spacebars.mustache(view.lookup("disabled"));
      }
    }, Blaze.View("lookup:termsLinkText", function() {
      return Spacebars.mustache(view.lookup("termsLinkText"));
    })), "\n      " ];
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_terms_link.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atTermsLink.helpers(AccountsTemplates.atTermsLinkHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atTermsLink.events(AccountsTemplates.atTermsLinkEvents);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_resend_verification_email_link.js                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atResendVerificationEmailLink");
Template["atResendVerificationEmailLink"] = new Template("Template.atResendVerificationEmailLink", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-resend-verification-email-link at-wrap"
  }, "\n    ", HTML.P("\n      ", Blaze.View("lookup:preText", function() {
    return Spacebars.mustache(view.lookup("preText"));
  }), "\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("resendVerificationEmailLink"));
    },
    id: "at-resend-verification-email",
    class: function() {
      return [ "at-link at-resend-verification-email ", Spacebars.mustache(view.lookup("disabled")) ];
    }
  }, Blaze.View("lookup:linkText", function() {
    return Spacebars.mustache(view.lookup("linkText"));
  })), "\n      ", Blaze.View("lookup:suffText", function() {
    return Spacebars.mustache(view.lookup("suffText"));
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_resend_verification_email_link.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atResendVerificationEmailLink.helpers(AccountsTemplates.atResendVerificationEmailLinkHelpers);

// Simply 'inherites' events from AccountsTemplates
Template.atResendVerificationEmailLink.events(AccountsTemplates.atResendVerificationEmailLinkEvents);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.at_title.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("atTitle");
Template["atTitle"] = new Template("Template.atTitle", (function() {
  var view = this;
  return HTML.DIV({
    class: "at-title"
  }, "\n    ", HTML.H3(Blaze.View("lookup:title", function() {
    return Spacebars.mustache(view.lookup("title"));
  })), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/at_title.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Simply 'inherites' helpers from AccountsTemplates
Template.atTitle.helpers(AccountsTemplates.atTitleHelpers);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/useraccounts_bootstrap/lib/template.full_page_at_form.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("fullPageAtForm");
Template["fullPageAtForm"] = new Template("Template.fullPageAtForm", (function() {
  var view = this;
  return HTML.DIV({
    class: "container"
  }, "\n    ", HTML.DIV({
    class: "row"
  }, "\n      ", HTML.DIV({
    class: "col-md-6 col-md-offset-3"
  }, "\n        ", Spacebars.include(view.lookupTemplate("atForm")), "\n      "), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("useraccounts:bootstrap");

})();
