var require = meteorInstall({"imports":{"ui":{"components":{"header":{"header.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/header/header.html                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.header.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.header.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/header/template.header.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("header");
Template["header"] = new Template("Template.header", (function() {
  var view = this;
  return HTML.NAV({
    class: "navbar navbar-inverse"
  }, "\n        ", HTML.DIV({
    class: "container-fluid"
  }, "\n            ", HTML.Raw("<!-- Brand and toggle get grouped for better mobile display -->"), "\n            ", HTML.Raw('<div class="navbar-header">\n                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\n                    <span class="sr-only">Toggle navigation</span>\n                    <span class="icon-bar"></span>\n                    <span class="icon-bar"></span>\n                    <span class="icon-bar"></span>\n                </button>\n                <a class="navbar-brand" href="#"><img src="/img/DevLevelLogoAndWordsWhite.5.25.png"></a>\n            </div>'), "\n\n            ", HTML.Raw("<!-- Collect the nav links, forms, and other content for toggling -->"), "\n            ", HTML.DIV({
    class: "collapse navbar-collapse",
    id: "bs-example-navbar-collapse-1"
  }, "\n                ", HTML.UL({
    class: "nav navbar-nav"
  }, "\n                    ", HTML.Raw('<li><a href="#" id="nav-answerquestions">Answer Questions</a></li>'), "\n                    ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin,add-questions");
  }, function() {
    return [ "\n                        ", HTML.LI(HTML.A({
      href: "#",
      id: "nav-addquestions"
    }, "Add Questions")), "\n                    " ];
  }), "\n                    ", HTML.Raw('<li><a href="#" id="nav-learnshare">Learn/Share</a></li>'), "\n                    ", HTML.Raw('<li><a href="#" id="nav-traitdesc">Trait Descriptions</a></li>'), "\n                    ", HTML.Raw('<li><a href="#" id="nav-goals">Goals</a></li>'), "\n               "), "\n                ", HTML.UL({
    class: "nav navbar-nav navbar-right"
  }, "\n                    ", HTML.Raw('<li><a href="#" id="nav-teams">Teams</a></li>'), "\n                    ", HTML.LI({
    class: ""
  }, "\n                        ", Spacebars.include(view.lookupTemplate("notification_list")), "\n                    "), "\n                    ", HTML.LI("\n                        ", HTML.A({
    name: "profile"
  }, "\n                            ", Spacebars.include(view.lookupTemplate("personality")), "\n                        "), "\n                    "), "\n                    ", HTML.LI({
    class: "dropdown"
  }, "\n                        ", HTML.Raw('<a href="#" id="last-dropdown" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></a>'), "\n                        ", HTML.UL({
    class: "dropdown-menu"
  }, "\n                            ", HTML.LI({
    class: "dropdown-item"
  }, HTML.H4(Blaze.View("lookup:userName", function() {
    return Spacebars.mustache(view.lookup("userName"));
  }))), "\n                            ", HTML.Raw('<li class="dropdown-item"><a href="#" id="nav-profile" class="nav-link"><span class="glyphicon glyphicon-user"></span> Profile</a></li>'), "\n                            ", HTML.LI({
    class: "li-button"
  }, Spacebars.include(view.lookupTemplate("atNavButton"))), "\n                        "), "\n                    "), "\n               "), "\n            "), "\n            ", HTML.Raw("<!-- /.navbar-collapse -->"), "\n        "), HTML.Raw("\n        <!-- /.container-fluid -->\n    "));
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"header.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/header/header.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./header.html"));
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
module.watch(require("../../components/questions/questions.js"));
module.watch(require("../../components/personality/personality.js"));
module.watch(require("../../components/notification_list/notification_list.js"));
var FlowRouter;
module.watch(require("meteor/kadira:flow-router"), {
  FlowRouter: function (v) {
    FlowRouter = v;
  }
}, 1);
Template.header.onCreated(function () {
  var _this = this;

  this.autorun(function () {
    _this.subscription = _this.subscribe('userData', _this.teamName, {
      onStop: function () {
        console.log("User header subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User header subscription ready! ", arguments, this);
      }
    });
  });
});
Template.header.helpers({
  userName: function () {
    var u = User.findOne({
      _id: Meteor.userId()
    });

    if (u) {
      return u.MyProfile.fullName('');
    } else {
      return "";
    }
  }
});
Template.header.events({
  'click a#nav-answerquestions': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/questions');
  },
  'click a#nav-addquestions': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/addQuestions/IE');
  },
  'click a#nav-learnshare': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/learnShareList');
  },
  'click a#nav-teams': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/adminTeams');
  },
  'click a#nav-goals': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/goals');
  },
  'click a#nav-traitdesc': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/addTraitDescriptions');
  },
  'click a#nav-profile': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/profile');
  },
  'click a.navbar-brand': function (event, instance) {
    event.preventDefault();
    FlowRouter.go('/dashboard');
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"label_list":{"label_list.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/label_list/label_list.html                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.label_list.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.label_list.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/label_list/template.label_list.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("label_list");
Template["label_list"] = new Template("Template.label_list", (function() {
  var view = this;
  return HTML.DIV({
    class: "label-list"
  }, "\n        ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("items")),
      _variable: "item"
    };
  }, function() {
    return [ "\n            ", HTML.DIV({
      class: function() {
        return [ "label ", Spacebars.mustache(view.lookup("labelType")), " ", Spacebars.mustache(view.lookup("customClass"), view.lookup("item")) ];
      },
      "data-value": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("item"), "value"));
      }
    }, Blaze.View("lookup:item.text", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("item"), "text"));
    })), "\n        " ];
  }), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"label_list.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/label_list/label_list.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./label_list.html"));
Template.label_list.onCreated(function () {//
});
Template.label_list.helpers({
  customClass: function (item) {
    if ("guest" === item.value.slice(0, 5)) {
      return "guest";
    } else {
      return "";
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"loading":{"loading.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/loading/loading.html                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.loading.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.loading.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/loading/template.loading.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("loading");
Template["loading"] = new Template("Template.loading", (function() {
  var view = this;
  return HTML.Raw('<span class="loading-animation">\n        <img src="/img/loading.gif">\n    </span>');
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"notification_list":{"notification_list.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/notification_list/notification_list.html                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.notification_list.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.notification_list.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/notification_list/template.notification_list.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("notification_list");
Template["notification_list"] = new Template("Template.notification_list", (function() {
  var view = this;
  return [ HTML.A({
    href: "#",
    id: "nav-notifications",
    class: function() {
      return [ "dropdown-toggle nav-icon ", Spacebars.mustache(view.lookup("hasUnread")) ];
    },
    "data-toggle": "dropdown",
    role: "button",
    "aria-haspopup": "true",
    "aria-expanded": "false"
  }, "\n        ", HTML.Raw('<img src="/img/bell.png" width="25px" height="25px">'), "\n    "), "\n    ", HTML.DIV({
    class: "dropdown-menu list-group bg-secondary"
  }, "\n        ", HTML.Raw('<span class="li-heading"><small>Notifications</small></span>'), "\n        ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("notifications")),
      _variable: "notification"
    };
  }, function() {
    return [ "\n            ", HTML.A({
      href: "#",
      class: function() {
        return [ "notification li-notification list-group-item ", Spacebars.mustache(view.lookup("read"), Spacebars.dot(view.lookup("notification"), "isRead")), " align-items-start" ];
      },
      "data-nid": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("notification"), "_id"));
      },
      "data-action": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("notification"), "action"));
      }
    }, "\n                ", HTML.DIV({
      class: "d-flex w-100 justify-content-between"
    }, "\n                    ", HTML.H5({
      class: "mb-1"
    }, Blaze.View("lookup:notification.title", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("notification"), "title"));
    })), "\n                    ", HTML.SMALL({
      class: "text-muted float-right"
    }, Blaze.View("lookup:when", function() {
      return Spacebars.mustache(view.lookup("when"), view.lookup("notification"));
    })), "\n                "), "\n                ", HTML.P({
      class: "mb-1"
    }, Blaze.View("lookup:notification.body", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("notification"), "body"));
    })), "\n            "), "\n        " ];
  }), "\n    ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"notification_list.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/notification_list/notification_list.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 0);
module.watch(require("./notification_list.html"));

function notificationClickAct(action) {
  console.log(action);

  switch (action[0]) {
    case "learnshare":
      FlowRouter.go('/learnShare/' + action[1]);
      break;

    case "teams":
      if (action.length > 1) {
        FlowRouter.go('/adminTeams/' + action[1]);
      } else {
        FlowRouter.go('/adminTeams');
      }

      break;

    case "teamgoals":
      FlowRouter.go('/teamGoals/' + action[1]);
      break;
  }
}

Template.notification_list.onCreated(function () {
  var _this = this;

  this.autorun(function () {
    console.log("autorunning notification_list...");
    _this.subscription = _this.subscribe('notificationList', Meteor.userId(), {
      onStop: function () {
        console.log("Notification List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Notification List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
  });
});
Template.notification_list.helpers({
  notifications: function () {
    var MAX_NOTIFICATIONS = 6;
    var n = UserNotify.find({
      userId: Meteor.userId()
    }, {
      sort: {
        createdDate: -1
      }
    });

    if (n) {
      var noteList = [];
      n.forEach(function (note) {
        if (noteList.length < MAX_NOTIFICATIONS) {
          noteList.push(note);
        } else if (noteList.length === MAX_NOTIFICATIONS) {
          noteList.push({
            title: "",
            body: "See all notifications...",
            isRead: true,
            action: "notifications:all"
          });
        }

        if (!note.isPushed) {
          if (new Date() - note.createdDate > 1000 * 60) {
            //too old, don't send push notification
            note.markNotified();
          } else {
            note.pushNotify({
              onclick: function (event) {
                var nid = event.target.data;
                var un = UserNotify.findOne({
                  _id: nid
                });
                un.markRead();
                event.target.close();
                notificationClickAct(un.action.split(":"));
              }
            });
            note.markNotified();
          }
        }
      });
      return noteList;
    } else {
      return [];
    }
  },
  when: function (note) {
    var secondsAgo = (new Date() - note.createdDate) / 1000;

    if (secondsAgo < 2) {
      return "Just now";
    } else if (secondsAgo < 60) {
      return "s";
    } else if (secondsAgo < 60 * 60) {
      return parseInt(secondsAgo / 60) + "m";
    } else if (secondsAgo < 60 * 60 * 24) {
      return parseInt(secondsAgo / (60 * 60)) + "h";
    } else if (typeof note.createdDate !== 'undefined') {
      return note.createdDate.toLocaleDateString("en-US");
    } else {
      return "";
    }
  },
  read: function (is) {
    if (is) {
      //return "list-group-item-secondary";
      return "";
    } else {
      return "list-group-item-info";
    }
  },
  hasUnread: function () {
    var n = UserNotify.find({
      userId: Meteor.userId(),
      isRead: false
    });

    if (n && n.fetch().length) {
      return "unread";
    } else {
      return "";
    }
  }
});
Template.notification_list.events({
  'click a.notification': function (event, instance) {
    event.preventDefault();
    var $target = $(event.target);
    var $li = $target.closest("[data-action]");
    var noteActionStr = $li.data("action");
    var nid = $li.data("nid");
    var noteAction = noteActionStr.split(":");
    var un = UserNotify.findOne({
      _id: nid
    });
    un.markRead();
    notificationClickAct(noteAction);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"personality":{"personality.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/personality/personality.html                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.personality.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.personality.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/personality/template.personality.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("personality");
Template["personality"] = new Template("Template.personality", (function() {
  var view = this;
  return [ HTML.SCRIPT("\n        $(document).ready(function(){\n          $('[data-toggle=\"tooltip\"]').tooltip();\n        });\n    "), "\n    ", HTML.DIV({
    class: "personality-display",
    style: "cursor:pointer;color:white;font-weight:bold;display:inline-block;background-color:rgba(255,255,255,0.1)"
  }, "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("isMinMet"));
  }, function() {
    return [ "\n            ", HTML.SPAN({
      class: "cat-letter-rows"
    }, "\n                ", HTML.DIV("\n                    ", HTML.SPAN({
      class: "cat-ie cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 0, view.lookup("user")), ");padding:5px;" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 0, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:letterByCategory", function() {
      return Spacebars.mustache(view.lookup("letterByCategory"), 0, view.lookup("user"));
    })), "\n                    ", HTML.SPAN({
      class: "cat-ns cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 1, view.lookup("user")), ");padding:5px;" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 1, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:letterByCategory", function() {
      return Spacebars.mustache(view.lookup("letterByCategory"), 1, view.lookup("user"));
    })), "\n                    ", HTML.SPAN({
      class: "cat-tf cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 2, view.lookup("user")), ");padding:5px;" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 2, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:letterByCategory", function() {
      return Spacebars.mustache(view.lookup("letterByCategory"), 2, view.lookup("user"));
    })), "\n                    ", HTML.SPAN({
      class: "cat-jp cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 3, view.lookup("user")), ");padding:5px;" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 3, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:letterByCategory", function() {
      return Spacebars.mustache(view.lookup("letterByCategory"), 3, view.lookup("user"));
    })), "\n                "), "\n                ", HTML.DIV("\n                    ", HTML.SPAN({
      class: "cat-ie cat-pct cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 0, view.lookup("user")), ");" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 0, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:percentByCategory", function() {
      return Spacebars.mustache(view.lookup("percentByCategory"), 0, view.lookup("user"));
    }), "%"), "\n                    ", HTML.SPAN({
      class: "cat-ns cat-pct cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 1, view.lookup("user")), ");" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 1, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:percentByCategory", function() {
      return Spacebars.mustache(view.lookup("percentByCategory"), 1, view.lookup("user"));
    }), "%"), "\n                    ", HTML.SPAN({
      class: "cat-tf cat-pct cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 2, view.lookup("user")), ");" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 2, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:percentByCategory", function() {
      return Spacebars.mustache(view.lookup("percentByCategory"), 2, view.lookup("user"));
    }), "%"), "\n                    ", HTML.SPAN({
      class: "cat-jp cat-pct cat-disp",
      style: function() {
        return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 3, view.lookup("user")), ");" ];
      },
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: function() {
        return [ Spacebars.mustache(view.lookup("percentByCategory"), 3, view.lookup("user")), "%" ];
      }
    }, Blaze.View("lookup:percentByCategory", function() {
      return Spacebars.mustache(view.lookup("percentByCategory"), 3, view.lookup("user"));
    }), "%"), "\n                "), "\n            "), "\n        " ];
  }, function() {
    return [ "\n            ", HTML.SPAN({
      "data-toggle": "tooltip",
      "data-placement": "bottom",
      title: "Minimum remaining questions"
    }, Blaze.View("lookup:remainingMinQCount", function() {
      return Spacebars.mustache(view.lookup("remainingMinQCount"));
    })), "\n        " ];
  }), "\n        ", HTML.IMG({
    src: function() {
      return Spacebars.mustache(view.lookup("userImageUrl"), view.lookup("user"));
    },
    class: "img-circle"
  }), "\n    "), "\n    ", HTML.DIV({
    class: "modal fade",
    id: "personality-readings",
    tabindex: "-1",
    role: "dialog"
  }, "\n        ", Blaze._TemplateWith(function() {
    return {
      source: Spacebars.call("personality")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("select_feedback"));
  }), "\n        ", HTML.DIV({
    class: "modal-dialog",
    role: "document",
    style: "margin:auto auto;"
  }, "\n            ", HTML.DIV({
    class: "modal-content"
  }, "\n                ", HTML.DIV({
    class: "modal-header"
  }, "\n                    ", HTML.Raw('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'), "\n                    ", HTML.H4({
    class: "modal-title",
    style: "color:#898;font-weight:bold;background-color:rgba(255,255,255,0.1)"
  }, "\n                      ", HTML.SPAN({
    class: "cat-ie",
    style: function() {
      return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 0, view.lookup("user")), ");padding:5px;" ];
    }
  }, Blaze.View("lookup:letterByCategory", function() {
    return Spacebars.mustache(view.lookup("letterByCategory"), 0, view.lookup("user"));
  })), "\n                      ", HTML.SPAN({
    class: "cat-ns",
    style: function() {
      return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 1, view.lookup("user")), ");padding:5px;" ];
    }
  }, Blaze.View("lookup:letterByCategory", function() {
    return Spacebars.mustache(view.lookup("letterByCategory"), 1, view.lookup("user"));
  })), "\n                      ", HTML.SPAN({
    class: "cat-tf",
    style: function() {
      return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 2, view.lookup("user")), ");padding:5px;" ];
    }
  }, Blaze.View("lookup:letterByCategory", function() {
    return Spacebars.mustache(view.lookup("letterByCategory"), 2, view.lookup("user"));
  })), "\n                      ", HTML.SPAN({
    class: "cat-jp",
    style: function() {
      return [ "background-color:rgba(71, 63, 255, ", Spacebars.mustache(view.lookup("opacityByCategory"), 3, view.lookup("user")), ");padding:5px;" ];
    }
  }, Blaze.View("lookup:letterByCategory", function() {
    return Spacebars.mustache(view.lookup("letterByCategory"), 3, view.lookup("user"));
  })), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "modal-body",
    style: "color:#333;"
  }, "\n                    ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("readings")),
      _variable: "reading"
    };
  }, function() {
    return [ "\n                        ", Blaze._TemplateWith(function() {
      return {
        reading: Spacebars.call(view.lookup("reading"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("singleReading"));
    }), "\n                    " ];
  }), "\n                "), "\n                ", HTML.Raw('<div class="modal-footer">\n                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                </div>'), "\n            "), HTML.Raw("<!-- /.modal-content -->"), "\n        "), HTML.Raw("<!-- /.modal-dialog -->"), "\n    "), HTML.Raw("<!-- /.modal -->") ];
}));

Template.__checkName("singleReading");
Template["singleReading"] = new Template("Template.singleReading", (function() {
  var view = this;
  return [ Blaze.View("lookup:getHSize", function() {
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("getHSize"), view.lookup("reading")));
  }), "\n    ", HTML.P({
    style: "text-align:justify;"
  }, Blaze.View("lookup:reading.Body", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "Body"));
  })) ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"personality.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/personality/personality.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Question;
module.watch(require("/imports/api/questions/questions.js"), {
  Question: function (v) {
    Question = v;
  }
}, 0);
var User, Profile, UserType, MyersBriggs, Answer;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  },
  Profile: function (v) {
    Profile = v;
  },
  UserType: function (v) {
    UserType = v;
  },
  MyersBriggs: function (v) {
    MyersBriggs = v;
  },
  Answer: function (v) {
    Answer = v;
  }
}, 1);
var TypeReading;
module.watch(require("/imports/api/type_readings/type_readings.js"), {
  TypeReading: function (v) {
    TypeReading = v;
  }
}, 2);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 3);
module.watch(require("./personality.html"));
var minQuestionsAnswered = 72;
Template.personality.onCreated(function () {
  var _this = this;

  if (this.data.userId) {
    this.userId = this.data.userId;
  } else {
    this.userId = Meteor.userId();
  }

  this.autorun(function () {
    console.log("autorunning...");
    _this.subscription = _this.subscribe('userData', _this.userId, {
      onStop: function () {
        console.log("Subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
    _this.subscription2 = _this.subscribe('typereadings.myReadings', _this.userId, {
      onStop: function () {
        console.log("Readings subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Readings subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
  });
});
Template.personality.helpers({
  readings: function () {
    var tr = TypeReading.find({});
    console.log("1234", tr.fetch());
    return tr;
  },
  user: function () {
    return User.findOne({
      _id: Template.instance().userId
    });
  },
  isMinMet: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    if (!u) return false;
    console.log(u);

    if (u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
      return true;
    } else {
      return false;
    }

    return false;
  },
  remainingMinQCount: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    console.log(u);
    if (!u) return -1;
    var rmn = Math.max(0, minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length);
    console.log("yyyyy", minQuestionsAnswered, u.MyProfile.UserType.AnsweredQuestions.length, rmn); //let rmn = 0;

    return rmn;
  },
  opacityByCategory: function (category, userObj) {
    //console.log(category, userObj); //return;
    if (typeof userObj === "undefined") return false;
    var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)]; //console.log(value);

    return Math.abs(value.Value) * 2 / 100;
  },
  percentByCategory: function (category, userObj) {
    if (typeof userObj === "undefined") return false;
    var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
    console.log("555555", value);
    return Math.round(Math.abs(value.Value) * 2);
  },
  letterByCategory: function (category, userObj) {
    //console.log(category, userObj); //return;
    if (typeof userObj === "undefined") return false;
    var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
    var value = userObj.MyProfile.UserType.Personality[identifier].Value;
    console.log(category, value, identifier);

    if (userObj.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
      return value === 0 ? "?" : value < 0 ? identifier.slice(0, 1) : identifier.slice(1, 2);
    } else {
      return "?";
    }
  },
  userImageUrl: function (userObj) {
    if (typeof userObj === "undefined") return false;
    return Gravatar.imageUrl(userObj.emails[0].address, {
      size: 50,
      "default": 'mm'
    });
  }
});
Template.personality.events({
  'click div.personality-display': function (event, instance) {
    console.log('click div.personality-display =>', event, instance);
    $('#personality-readings').modal('show'); //$('.Selected-Category').html(newCat);
  }
});
Template.singleReading.helpers({
  getHSize: function (reading) {
    console.log("asdf", reading);
    var count = delta = 0;

    _.forEach(reading.TypeReadingCategories, function (cat) {
      if (cat == null) {
        return;
      }

      count++;
      delta += cat.Range.Delta;
    });

    delta /= count;

    if (!reading.Header) {
      return "";
    }

    if (delta >= 50) {
      return "<h1>" + reading.Header + "</h1>";
    }

    if (delta >= 40) {
      return "<h2>" + reading.Header + "</h2>";
    }

    if (delta >= 30) {
      return "<h3>" + reading.Header + "</h3>";
    }

    if (delta >= 20) {
      return "<h4>" + reading.Header + "</h4>";
    }

    if (delta >= 10) {
      return "<h5>" + reading.Header + "</h5>";
    }

    return "<h6>" + reading.Header + "</h6>";
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"questions":{"questions.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/questions/questions.html                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.questions.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.questions.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/questions/template.questions.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("questions");
Template["questions"] = new Template("Template.questions", (function() {
  var view = this;
  return [ HTML.DIV({
    style: "position:fixed;top:80px;left:10px;background-color:silver;font-size:small;padding:5px;border-radius:3px;max-width:180px;"
  }, "\n        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isRemainingGreaterThan"), 10);
  }, function() {
    return [ "\n            Answer at least ", Blaze.View("lookup:remainingMinQCount", function() {
      return Spacebars.mustache(view.lookup("remainingMinQCount"));
    }), " more to see your personality reading\n        " ];
  }, function() {
    return [ "\n            ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isRemainingGreaterThan"), 0);
    }, function() {
      return [ "\n                You're almost there! Only ", Blaze.View("lookup:remainingMinQCount", function() {
        return Spacebars.mustache(view.lookup("remainingMinQCount"));
      }), " questions remain to see your personality readin\n            " ];
    }, function() {
      return "\n                Congratulations! Your personality reading is ready with the minimum questions answered. As you continue answering questions, the accuracy of your reading will improve.\n            ";
    }), "\n        " ];
  }), "\n    "), "\n    ", HTML.DIV({
    style: "position:fixed;top:80px;left:200px;background-color:silver;font-size:small;padding:5px;border-radius:3px;max-width:180px;"
  }, "\n        ", HTML.DIV("Answered: ", Blaze.View("lookup:answeredQuestionsLength", function() {
    return Spacebars.mustache(view.lookup("answeredQuestionsLength"));
  }), HTML.Raw("<br>")), "\n        ", HTML.DIV({
    id: "allQuestions"
  }, "Total questions: ", Blaze.View("lookup:totalQuestions", function() {
    return Spacebars.mustache(view.lookup("totalQuestions"));
  })), "\n    "), HTML.Raw('\n    <div class="row text-center" style="margin-right:0px;">\n        <div class="col-md-12">\n            <h4>\n                Move each slider towards the side that best describes you.\n                <small></small>\n            </h4>\n        </div>\n    </div>\n    '), HTML.DIV({
    class: "row",
    style: "margin-right:0px;"
  }, "\n        ", HTML.DIV({
    class: "col-md-12"
  }, "\n            ", HTML.DIV({
    class: "well-large"
  }, "\n            ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("questions")),
      _variable: "question"
    };
  }, function() {
    return [ "\n                ", Blaze._TemplateWith(function() {
      return {
        index: Spacebars.call(view.lookup("@index")),
        question: Spacebars.call(view.lookup("question"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("getTemplate"));
    }), "\n            " ];
  }), "\n            "), "\n        "), "\n    "), "\n    ", Spacebars.include(view.lookupTemplate("footer")) ];
}));

Template.__checkName("questionTemplate");
Template["questionTemplate"] = new Template("Template.questionTemplate", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      question: Spacebars.call(view.lookup("question")),
      reversed: Spacebars.call(false),
      rightText: Spacebars.call(Spacebars.dot(view.lookup("question"), "RightText")),
      leftText: Spacebars.call(Spacebars.dot(view.lookup("question"), "LeftText"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("question"));
  });
}));

Template.__checkName("questionTemplateReversed");
Template["questionTemplateReversed"] = new Template("Template.questionTemplateReversed", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      question: Spacebars.call(view.lookup("question")),
      reversed: Spacebars.call(true),
      rightText: Spacebars.call(Spacebars.dot(view.lookup("question"), "LeftText")),
      leftText: Spacebars.call(Spacebars.dot(view.lookup("question"), "RightText"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("question"));
  });
}));

Template.__checkName("question");
Template["question"] = new Template("Template.question", (function() {
  var view = this;
  return HTML.DIV({
    "data-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "_id"));
    },
    "data-reversed": function() {
      return Spacebars.mustache(view.lookup("reversed"));
    },
    class: "answer-question",
    "data-readings": function() {
      return Spacebars.mustache(view.lookup("getReadingsAsJSON"), view.lookup("question"));
    },
    style: "padding: 10px;"
  }, "\n                ", HTML.DIV({
    class: "row",
    style: "text-align: center;"
  }, "\n                    ", HTML.DIV({
    class: "col-md-12"
  }, HTML.EM({
    style: "visibility: hidden"
  }, Blaze.View("lookup:question.Text", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "Text"));
  }))), "\n                "), "\n                ", HTML.DIV({
    class: "row",
    style: "font-weight:bold;text-align: left;"
  }, "\n                    ", HTML.DIV({
    class: "col-md-10 left-option",
    style: "background-color:rgba(78, 100, 142, 1);padding:10px;border-radius: 5px 5px 0px 5px;"
  }, "\n                        ", Blaze.View("lookup:leftText", function() {
    return Spacebars.mustache(view.lookup("leftText"));
  }), "\n                        ", HTML.Raw('<span class="label label-default percent"></span>'), "\n                    "), "\n                    ", HTML.Raw('<div class="col-md-2"></div>'), "\n                "), HTML.Raw('\n                <div class="row">\n                    <!-- <div class=\'col-md-1\'></div> -->\n                    <div class="col-md-12">\n                        <div class="slider" data-value="0" style="z-index: 10;"></div>\n                    </div>\n                    <!-- <div class=\'col-md-1\'></div> -->\n                </div>\n                '), HTML.DIV({
    class: "row",
    style: "font-weight:bold;text-align: right;"
  }, "\n                    ", HTML.Raw('<div class="col-md-2"></div>'), "\n                    ", HTML.DIV({
    class: "col-md-10 right-option",
    style: "background-color:rgba(78, 100, 142, 1);padding:10px;border-radius: 0px 5px 5px 5px;"
  }, "\n                        ", HTML.Raw('<span class="label label-default percent"></span>'), "\n                        ", Blaze.View("lookup:rightText", function() {
    return Spacebars.mustache(view.lookup("rightText"));
  }), "\n                    "), "\n                "), HTML.Raw('\n                <div class="row" style="text-align: center;">\n                    <div class="col-md-12 reading text-primary" style="margin:5px 0;font-weight:bold;">Read each option carefully.</div>\n                </div>\n                <div class="row" style="text-align: center;">\n                    <div class="col-md-12">\n                        <button class="btn btn-large btn-success answer-button">\n                            Answer Now\n                        </button>\n                    </div>\n                </div>\n            '));
}));

Template.__checkName("footer");
Template["footer"] = new Template("Template.footer", (function() {
  var view = this;
  return "";
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"questions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/questions/questions.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Question;
module.watch(require("/imports/api/questions/questions.js"), {
  Question: function (v) {
    Question = v;
  }
}, 0);
var User, Profile, UserType, MyersBriggs, Answer;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  },
  Profile: function (v) {
    Profile = v;
  },
  UserType: function (v) {
    UserType = v;
  },
  MyersBriggs: function (v) {
    MyersBriggs = v;
  },
  Answer: function (v) {
    Answer = v;
  }
}, 1);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
module.watch(require("./questions.html"));
var minQuestionsAnswered = 72;
Template.questions.onCreated(function () {
  var _this = this;

  if (this.data.userId) {
    this.userId = this.data.userId;
  } else {
    this.userId = Meteor.userId();
  }

  this.autorun(function () {
    console.log("autorunning...");
    _this.subscription = _this.subscribe('questions.toanswer', Meteor.userId(), Session.get('refreshQuestions'), {
      onStop: function () {
        console.log("Subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
  });
});
Template.questions.helpers({
  questions: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    var useg = u.MyProfile.segments;
    var conditions = [{
      segments: {
        $exists: false
      }
    }, {
      segments: {
        $eq: []
      }
    }];

    if (useg) {
      conditions.push({
        segments: {
          $in: useg
        }
      });
    }

    if (!u) return [];
    console.log("kkkkkkkkkkkkkkkk", u);
    return Question.find({
      $or: conditions
    });
  },
  reversed: function (index) {
    return index % 2;
  },
  remainingMinQCount: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    console.log(u);
    console.log(Template.instance().userId);
    if (!u) return -1;
    var rmn = Math.max(0, minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length);
    console.log("yyyyy", minQuestionsAnswered, u.MyProfile.UserType.AnsweredQuestions.length, rmn); //let rmn = 0;

    return rmn;
  },
  isRemainingGreaterThan: function (num) {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    if (!u) return true;
    var rmn = Math.max(0, minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length);
    return rmn > num;
  },
  getTemplate: function () {
    //console.log(this.index, arguments, this);
    return this.index % 2 ? Template.questionTemplate : Template.questionTemplateReversed;
  },
  answeredQuestionsLength: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    var length = u.MyProfile.UserType.AnsweredQuestions.length; //console.log("answeredQuestionsLengthhhhhhhhh", length);

    return length;
  },
  totalQuestions: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    }); //console.log("myUserID", u._id);

    var total = u.MyProfile.UserType.getTotalQuestions(); //console.log("preTotalQuestions", total);

    Meteor.call('question.countQuestions', u._id, function (error, result) {
      if (error) {//console.log("EEERRR0r: ", error);
      } else {
        //success
        //console.log("myUserID2", u._id);
        total = u.MyProfile.UserType.getTotalQuestions();
        u.MyProfile.UserType.setTotalQuestions(total); //console.log("uiquestionsjstotal", total);

        document.getElementById("allQuestions").innerHTML = "Total questions: " + result;
      }
    });
    return total;
  }
});
Template.questions.events({
  'click button.answer-button': function (event, instance) {
    event.preventDefault();
    console.log('click button.answer-button => ', event, instance);
    var target = event.target;
    var parent = $(target).closest('div.answer-question');
    var values = {
      'questionId': parent.data('id'),
      'value': parent.data('value'),
      'isReversed': !!parent.data('reversed')
    };
    console.log(values);
    Meteor.call('question.answer', values.questionId, values.value, values.isReversed, function (error) {
      if (error) {
        console.log("EEEEEERRRORRRRR: ", error);
      } else {
        parent.remove();

        if ($('div.answer-question').length < 1) {
          Session.set('refreshQuestions', Math.random());
        }
      }
    });
  }
});
Template.question.helpers({
  getReadingsAsJSON: function (question) {
    return JSON.stringify(question.Readings);
  }
});
Template.question.onRendered(function () {
  console.log("onRendered", this);

  var updateValue = function (elem, value) {
    var parent = $(elem).data('value', value);
    parent.find('div.left-option span.percent').html(Math.abs(Math.round(value) - 50) + "%");
    parent.find('div.right-option span.percent').html(Math.round(value) + 50 + "%");
    updateBGOpacity($(elem).find('.left-option'), 0.5 - value / 100);
    updateBGOpacity($(elem).find('.right-option'), 0.5 + value / 100);
    updateReading(parent, value);
  };

  var updateReading = function (elem, value) {
    var readings = $(elem).data('readings');
    var index = -1;
    var curMax = value < 0 ? -100 : 100;
    $.each(readings, function (i, reading) {
      if (value < 0 && reading.Rank <= value && reading.Rank > curMax || value > 0 && reading.Rank >= value && reading.Rank < curMax) {
        index = i;
        curMax = reading.Rank;
      }
    });

    if (index < 0) {
      return;
    }

    $(elem).find('div.reading').html(readings[index].Text);
  };

  var updateBGOpacity = function (elem, value) {
    var m;
    m = $(elem).css('background-color').replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    var btn = $(elem).parents('div.answer-question').find('button.answer-button');
    var reading = $(elem).parents('div.answer-question').find('div.reading');
    reading.css('visibility', 'visible');
    btn.css('visibility', 'visible');

    if (value > 0.5) {
      $(elem).css('color', 'white');
    } else if (value == 0.5) {
      $(elem).css('color', 'Grey');
      btn.css('visibility', 'hidden');
      reading.css('visibility', 'hidden');
      value = 0.1;
    } else {
      $(elem).css('color', 'black');
    }

    var newRGBA = "rgba(" + m[0] + ", " + m[1] + ", " + m[2] + ", " + value + ")";
    $(elem).css('background-color', newRGBA); //console.log($(elem).css('background-color'), m, newRGBA, value);
  };

  $('.slider', this.firstNode).each(function () {
    $(this).noUiSlider({
      start: $(this).data('value'),
      step: 1,
      range: {
        min: -50,
        max: 50
      }
    }).on('slide', function (event, val) {
      //console.log(arguments);
      updateValue($(event.target).closest('.answer-question'), val);
    }).on('set', function (event, val) {
      updateValue($(event.target).closest('.answer-question'), val);
    });
    updateValue($(this).closest('.answer-question'), $(this).data('value'));
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"select_autocomplete":{"select_autocomplete.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_autocomplete/select_autocomplete.html                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.select_autocomplete.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.select_autocomplete.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_autocomplete/template.select_autocomplete.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("select_autocomplete");
Template["select_autocomplete"] = new Template("Template.select_autocomplete", (function() {
  var view = this;
  return HTML.SPAN({
    class: "select-autocomplete",
    id: function() {
      return [ "selectize-outer-", Spacebars.mustache(view.lookup("id")), Spacebars.mustache(view.lookup("id2")) ];
    }
  }, "\n        ", HTML.SELECT({
    id: function() {
      return [ Spacebars.mustache(view.lookup("id")), Spacebars.mustache(view.lookup("id2")) ];
    },
    name: function() {
      return Spacebars.mustache(view.lookup("name"));
    },
    class: "demo-default",
    multiple: "",
    placeholder: function() {
      return Spacebars.mustache(view.lookup("placeholder"));
    }
  }, "\n        "), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"select_autocomplete.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_autocomplete/select_autocomplete.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./select_autocomplete.html"));
Template.select_autocomplete.onCreated(function () {//
});
Template.select_autocomplete.onRendered(function () {
  var self = this;
  self.autorun(function () {
    console.log("select_autocomplete autorun");
    var dat = Template.currentData();

    if (!dat.list || dat.list.length < 1) {
      return;
    }

    var params = {
      plugins: ['remove_button'],
      options: dat.list
    };

    if (typeof dat.onItemAdd !== "undefined") {
      params.onItemAdd = dat.onItemAdd;
    }

    if (typeof dat.onItemRemove !== "undefined") {
      params.onItemRemove = dat.onItemRemove;
    }

    if (typeof dat.readOnly !== "undefined") {
      params.readOnly = true;
      params.plugins = [];
    }

    if (typeof dat.create !== "undefined") {
      params.create = true;
    }

    var $select = $('#' + dat.id + dat.id2).selectize(params);
    $select[0].selectize.clear(true);
    $select[0].selectize.clearOptions();
    $select[0].selectize.addOption(dat.list);

    if ("undefined" !== typeof dat.selected) {
      var _loop = function (i) {
        var id = dat.selected[i];

        if ("string" !== typeof id) {
          id = id.value;
        }

        if ("undefined" === typeof _.find(dat.list, function (o) {
          return o.value === id;
        })) {
          $select[0].selectize.addOption(dat.selected[i]);
          $select[0].selectize.addItem(id, true);
        } else {
          $select[0].selectize.addItem(id, true);
        }
      };

      for (var i in meteorBabelHelpers.sanitizeForInObject(dat.selected)) {
        _loop(i);
      }
    }

    $select[0].selectize.refreshItems();
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"select_feedback":{"select_feedback.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_feedback/select_feedback.html                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.select_feedback.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.select_feedback.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_feedback/template.select_feedback.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("select_feedback");
Template["select_feedback"] = new Template("Template.select_feedback", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return [ "feedback-box-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "container feedback-box"
  }, "\n        ", HTML.DIV({
    id: function() {
      return [ "sf-instruction-begin-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "sf-instruction-begin"
  }, HTML.Raw("<h3>Select text to leave feedback for a passage</h3>")), "\n        ", HTML.DIV({
    id: function() {
      return [ "sf-instruction-selected-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "sf-instruction-selected",
    style: "display:none;"
  }, "\n            ", HTML.Raw('<div class="row spaced">\n                <div class="col-md-12"><h3>Leaving feedback for this text:</h3></div>\n            </div>'), "\n            ", HTML.DIV({
    class: "row spaced"
  }, "\n                ", HTML.DIV({
    class: "col-md-12"
  }, "\n                    ", HTML.DIV({
    id: function() {
      return [ "sf-feedback-context-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "sf-feedback-context"
  }), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "row spaced sf-textbox",
    id: function() {
      return [ "sf-textbox-", Spacebars.mustache(view.lookup("source")) ];
    }
  }, "\n                ", HTML.DIV({
    class: "col-md-12"
  }, "\n                    My comment:\n                    ", HTML.TEXTAREA({
    id: function() {
      return [ "mytextarea-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "mytextarea"
  }), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "row spaced"
  }, "\n                ", HTML.DIV({
    class: "col-sm-12 text-right btn-group-xs"
  }, "\n                    ", HTML.BUTTON({
    id: function() {
      return [ "feedback-cancel-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "btn btn-danger feedback-cancel btn-cancel glyphicon glyphicon-remove details",
    alt: "Discard changes"
  }), "\n                    ", HTML.BUTTON({
    id: function() {
      return [ "feedback-save-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "btn feedback-save btn-success btn-save glyphicon glyphicon-ok details",
    disabled: "",
    alt: "Save changes"
  }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
    id: function() {
      return [ "sf-list-feedback-", Spacebars.mustache(view.lookup("source")) ];
    },
    class: "sf-list-feedback"
  }, "\n            ", HTML.Raw("<hr>"), "\n            ", HTML.Raw('<div class="row spaced">\n                <div class="col-sm-12">\n                    <h3>Feedback I\'ve left:</h3>\n                </div>\n            </div>'), "\n            ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("commentsMade")),
      _variable: "comment"
    };
  }, function() {
    return [ "\n            ", HTML.DIV({
      class: "row spaced"
    }, "\n                ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                    ", HTML.SPAN({
      style: "background-color:blue;"
    }, Blaze.View("lookup:comment.context", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "context"));
    })), " -\n                    ", Blaze.View("lookup:comment.comment", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "comment"));
    }), "\n                "), "\n            "), "\n            " ];
  }), "\n        "), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"select_feedback.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/select_feedback/select_feedback.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var UserFeedback;
module.watch(require("/imports/api/user_feedback/user_feedback.js"), {
  UserFeedback: function (v) {
    UserFeedback = v;
  }
}, 1);
module.watch(require("./select_feedback.html"));
var selectedText;

function selectionHandler(event) {
  if ($(event.target).closest(".feedback-box").length) {
    //click happened inside feedback box, ignore
    return;
  }

  var $box = $(".feedback-box:visible");
  selectedText = window.getSelection().toString();
  console.log(selectedText);
  $box.find(".sf-feedback-context").html(selectedText);

  if (selectedText === "") {
    $box.find(".sf-instruction-selected").hide();
    $box.find(".sf-instruction-begin").show();
  } else {
    $box.find(".sf-instruction-selected").show();
    $box.find(".sf-instruction-begin").hide();
  }
}

Template.select_feedback.onCreated(function () {
  var _this = this;

  $(document).on('mouseup', selectionHandler);
  this.autorun(function () {
    console.log("autorun", _this);
    _this.subscription = _this.subscribe('feedback.userComments', {
      onStop: function () {
        console.log("Subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Subscription ready! ", arguments, this);
      }
    });
  });
});
Template.select_feedback.onDestroyed(function () {
  $(document).off('mouseup', selectionHandler);
});
Template.select_feedback.helpers({
  commentsMade: function () {
    var uf = UserFeedback.find({
      userId: Meteor.userId(),
      source: Template.instance().data.source
    }).fetch();
    console.log(uf);
    return uf;
  }
});
Template.select_feedback.events({
  'keyup .mytextarea': function (event, instance) {
    var $box = $(".feedback-box:visible");
    console.log($box);
    $box.find(".feedback-save").prop("disabled", false);
  },
  'click button.feedback-cancel': function (event, instance) {
    console.log("cancel");
    var $box = $(".feedback-box:visible");
    $box.find(".sf-instruction-selected").hide();
    $box.find(".sf-instruction-begin").show();
  },
  'click button.feedback-save': function (event, instance) {
    console.log(Template.instance());
    var $box = $(".feedback-box:visible");
    var fbk = {
      source: Template.instance().data.source,
      context: selectedText,
      comment: $box.find(".mytextarea").val()
    };
    Meteor.call('feedback.createNewFeedback', fbk, function (err, rslt) {
      console.log(err, rslt);
    });
    $box.find(".sf-instruction-selected").hide();
    $box.find(".sf-instruction-begin").show();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"team_icon":{"team_icon.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/team_icon/team_icon.html                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.team_icon.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.team_icon.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/team_icon/template.team_icon.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("team_icon");
Template["team_icon"] = new Template("Template.team_icon", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("team"), "Icon64"));
  }, function() {
    return [ "\n        ", HTML.SPAN({
      class: "team-icon"
    }, "\n            ", HTML.IMG({
      src: function() {
        return [ "data:", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "IconType")), ";base64,", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Icon64")) ];
      }
    }), "\n        "), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"video_embed":{"video_embed.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/video_embed/video_embed.html                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.video_embed.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.video_embed.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/video_embed/template.video_embed.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("video_embed");
Template["video_embed"] = new Template("Template.video_embed", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("fileExists"), view.lookup("id"));
  }, function() {
    return [ "\n        ", HTML.SPAN({
      class: "video-embed embed-responsive embed-responsive-16by9"
    }, "\n            ", HTML.VIDEO({
      width: "320",
      height: "240",
      controls: ""
    }, "\n                ", HTML.SOURCE({
      src: function() {
        return [ "/learnShareRecording/", Spacebars.mustache(view.lookup("id")), ".mp4" ];
      },
      type: "video/mp4"
    }), "\n            "), "\n        "), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"video_embed.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/components/video_embed/video_embed.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./video_embed.html"));
Template.video_embed.onCreated(function () {
  var _this = this;

  this._fileExists = new ReactiveVar(false);
  console.log(this.data);
  this.autorun(function () {
    Meteor.call('learnshare.recordingExists', _this.data.id, function (err, rslt) {
      _this._fileExists.set(rslt);
    });
  });
});
Template.video_embed.helpers({
  fileExists: function (fname) {
    return Template.instance()._fileExists.get();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"layouts":{"body":{"body.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/body/body.html                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.body.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.body.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/body/template.body.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("App_body");
Template["App_body"] = new Template("Template.App_body", (function() {
  var view = this;
  return [ Blaze._TemplateWith(function() {
    return {
      template: Spacebars.call(view.lookup("top"))
    };
  }, function() {
    return Spacebars.include(function() {
      return Spacebars.call(Template.__dynamic);
    });
  }), "\n  ", Blaze._TemplateWith(function() {
    return {
      template: Spacebars.call(view.lookup("main"))
    };
  }, function() {
    return Spacebars.include(function() {
      return Spacebars.call(Template.__dynamic);
    });
  }) ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"body.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/body/body.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./body.html"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"login":{"login.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/login/login.html                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.login.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.login.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/login/template.login.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("Auth_page");
Template["Auth_page"] = new Template("Template.Auth_page", (function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("atForm"));
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/layouts/login/login.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./login.html"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"pages":{"add_questions":{"add_questions.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_questions/add_questions.html                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.add_questions.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.add_questions.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_questions/template.add_questions.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("add_questions");
Template["add_questions"] = new Template("Template.add_questions", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container"
    }, "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.H4("Select a category to enter into"), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "btn-group",
      role: "group",
      "aria-label": "..."
    }, "\n                ", HTML.BUTTON({
      type: "button",
      class: function() {
        return [ "btn btn-default quest-cat-select cat-IE ", Blaze.If(function() {
          return Spacebars.call(Spacebars.dot(view.lookup("categoryCheck"), "IE"));
        }, function() {
          return "active";
        }) ];
      },
      "data-category": "IE"
    }, "Introvert/Extrovert"), "\n                ", HTML.BUTTON({
      type: "button",
      class: function() {
        return [ "btn btn-default quest-cat-select cat-NS ", Blaze.If(function() {
          return Spacebars.call(Spacebars.dot(view.lookup("categoryCheck"), "NS"));
        }, function() {
          return "active";
        }) ];
      },
      "data-category": "NS"
    }, "iNtuitive/Sensing"), "\n                ", HTML.BUTTON({
      type: "button",
      class: function() {
        return [ "btn btn-default quest-cat-select cat-TF ", Blaze.If(function() {
          return Spacebars.call(Spacebars.dot(view.lookup("categoryCheck"), "TF"));
        }, function() {
          return "active";
        }) ];
      },
      "data-category": "TF"
    }, "Thinking/Feeling"), "\n                ", HTML.BUTTON({
      type: "button",
      class: function() {
        return [ "btn btn-default quest-cat-select cat-JP ", Blaze.If(function() {
          return Spacebars.call(Spacebars.dot(view.lookup("categoryCheck"), "JP"));
        }, function() {
          return "active";
        }) ];
      },
      "data-category": "JP"
    }, "Judging/Perceiving"), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.TABLE({
      class: "table table-striped table-hover"
    }, "\n                ", HTML.THEAD("\n                ", HTML.TR("\n                    ", HTML.TD("\n                        ", HTML.UL({
      class: "nav nav-tabs",
      role: "tablist",
      style: "margin-bottom:5px;"
    }, "\n                            ", HTML.LI({
      role: "presentation",
      class: "active"
    }, HTML.A({
      href: "#addQuestion",
      "aria-controls": "addQuestion",
      role: "tab",
      "data-toggle": "tab",
      "data-type": "question"
    }, HTML.H4({
      style: "margin:0;"
    }, "Add new question"))), "\n                        "), "\n                        ", HTML.DIV({
      class: "tab-content",
      style: "overflow: inherit"
    }, "\n                            ", HTML.DIV({
      role: "tabpanel",
      class: "tab-pane active",
      id: "addQuestion"
    }, "\n                                ", HTML.FORM({
      id: "newQuestion"
    }, "\n                                    ", HTML.DIV({
      class: "input-group"
    }, "\n                                        ", HTML.INPUT({
      type: "text",
      class: "form-control input-medium",
      name: "Text",
      style: "height:34px;",
      placeholder: "Brief description..."
    }), "\n                                        ", HTML.DIV({
      class: "input-group-btn"
    }, "\n                                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-segments"),
        id2: Spacebars.call(""),
        name: Spacebars.call("segments[]"),
        placeholder: Spacebars.call("User Segments..."),
        list: Spacebars.call(view.lookup("userSegmentList")),
        selected: Spacebars.call(view.lookup("assignedUserSegments")),
        onItemRemove: Spacebars.call(view.lookup("itemRemoveHandler")),
        onItemAdd: Spacebars.call(view.lookup("itemAddHandler"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                                        "), "\n                                    "), "\n                                    ", HTML.DIV({
      class: "input-group"
    }, "\n                                        ", HTML.DIV({
      class: "input-group-btn"
    }, "\n                                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-categories"),
        id2: Spacebars.call(""),
        name: Spacebars.call("Categories"),
        placeholder: Spacebars.call("Categories..."),
        list: Spacebars.call(view.lookup("categoryList"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                                        "), "\n                                        ", HTML.INPUT({
      type: "text",
      class: "form-control input-medium",
      name: "LeftText",
      style: "height:35px;",
      placeholder: "Are you more like this..."
    }), "\n                                        ", HTML.SPAN({
      class: "input-group-addon"
    }, HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), "vs", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    })), "\n                                        ", HTML.INPUT({
      type: "text",
      class: "form-control input-medium",
      name: "RightText",
      style: "height:35px;",
      placeholder: "Or are you more like this?"
    }), "\n                                        ", HTML.SPAN({
      class: "input-group-btn"
    }, "\n                                            ", HTML.BUTTON({
      class: "btn btn-default btn-primary new-question",
      type: "submit"
    }, "Add"), "\n                                        "), "\n                                    "), "\n                                "), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n                "), "\n                ", HTML.TBODY("\n                ", HTML.TR("\n                    ", HTML.TD("\n                        ", HTML.H4("Edit existing questions"), "\n                    "), "\n                "), "\n                "), "\n                ", HTML.TBODY({
      id: "questionTable",
      class: "edit-body"
    }, "\n            ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("questions")),
        _variable: "question"
      };
    }, function() {
      return [ "\n                    ", HTML.TR({
        "data-id": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "_id"));
        },
        id: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "_id"));
        },
        class: "edit-question edit-row"
      }, "\n                        ", HTML.TD("\n                            ", HTML.DIV({
        class: "row"
      }, "\n                                ", HTML.DIV({
        class: "col-md-1"
      }, "\n                                    ", HTML.SPAN({
        class: "label label-default"
      }, Blaze.View("lookup:indexToCategory", function() {
        return Spacebars.mustache(view.lookup("indexToCategory"), Spacebars.dot(view.lookup("question"), "Category"));
      })), HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), HTML.SPAN({
        class: "label label-warning"
      }, Blaze.View("lookup:totalAnswers", function() {
        return Spacebars.mustache(view.lookup("totalAnswers"), Spacebars.dot(view.lookup("question"), "TimesAnswered", "LeftSum"), Spacebars.dot(view.lookup("question"), "TimesAnswered", "RightSum"));
      })), "\n                                    ", HTML.SPAN({
        class: "label label-info"
      }, Blaze.View("lookup:averageAnswer", function() {
        return Spacebars.mustache(view.lookup("averageAnswer"), Spacebars.dot(view.lookup("question"), "TimesAnswered", "LeftSum"), Spacebars.dot(view.lookup("question"), "SumOfAnswers", "LeftSum"));
      }), " vs ", Blaze.View("lookup:averageAnswer", function() {
        return Spacebars.mustache(view.lookup("averageAnswer"), Spacebars.dot(view.lookup("question"), "TimesAnswered", "RightSum"), Spacebars.dot(view.lookup("question"), "SumOfAnswers", "RightSum"));
      })), HTML.BR(), "\n                                    ", HTML.SPAN({
        style: "cursor: pointer;",
        class: function() {
          return [ "label label-", Blaze.If(function() {
            return Spacebars.call(Spacebars.dot(view.lookup("question"), "Active"));
          }, function() {
            return "success";
          }, function() {
            return "danger";
          }), " toggle-enable" ];
        }
      }, Blaze.If(function() {
        return Spacebars.call(Spacebars.dot(view.lookup("question"), "Active"));
      }, function() {
        return "Active";
      }, function() {
        return "Inactive";
      })), "\n                                "), "\n                                ", HTML.DIV({
        class: "col-md-10"
      }, "\n                                    ", HTML.EM(Blaze.View("lookup:question.Text", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "Text"));
      })), "\n                                    ", HTML.SPAN({
        class: "pull-right"
      }, "\n                                        ", HTML.STRONG(Blaze.View("lookup:questionAuthor", function() {
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("questionAuthor"), view.lookup("question")));
      })), "\n                                    "), "\n                                    ", HTML.BR(), "\n                                    ", HTML.SPAN({
        class: "glyphicon glyphicon-arrow-left"
      }), " ", Blaze.View("lookup:question.LeftText", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "LeftText"));
      }), "\n                                    ", HTML.SPAN({
        class: "pull-right"
      }, "\n                                        ", Blaze._TemplateWith(function() {
        return {
          items: Spacebars.call(Spacebars.dataMustache(view.lookup("assignedUserSegments"), view.lookup("question"))),
          labelType: Spacebars.call("label-info")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("label_list"));
      }), "\n                                    "), "\n                                    ", HTML.BR(), "\n                                    ", HTML.SPAN({
        class: "glyphicon glyphicon-arrow-right"
      }), " ", Blaze.View("lookup:question.RightText", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "RightText"));
      }), "\n                                "), "\n                                ", HTML.DIV({
        class: "col-md-1",
        style: "text-align: right;"
      }, "\n                                    ", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("canDelete"), view.lookup("question"));
      }, function() {
        return [ "\n                                    ", HTML.SPAN({
          class: "glyphicon glyphicon-remove delete text-danger",
          "data-qid": function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "_id"));
          },
          style: "cursor: pointer;"
        }), "\n                                    " ];
      }, function() {
        return [ "\n                                    ", HTML.SPAN({
          class: "glyphicon glyphicon-remove text-muted",
          style: "cursor: not-allowed;",
          title: "You can not delete questions that have been answered",
          "data-toggle": "tooltip"
        }), "\n                                    " ];
      }), "\n                                "), "\n                                ", HTML.DIV({
        class: "col-md-10 col-md-offset-1",
        style: "display:none;"
      }, "\n                                    ", HTML.Comment(" additional info here "), "\n                                "), "\n                            "), "\n                        "), "\n                    "), HTML.SCRIPT("\n                    $('#", Blaze.View("lookup:question._id", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("question"), "_id"));
      }), ' [data-toogle="tooltip"]\').tooltip();\n                    '), "\n            " ];
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.Comment(" Modal "), "\n        ", HTML.DIV({
      class: "modal fade",
      id: "tempModal",
      tabindex: "-1",
      role: "dialog",
      "aria-labelledby": "tempModalLabel"
    }, "\n          ", HTML.DIV({
      class: "modal-dialog",
      role: "document",
      style: "margin:0;"
    }, "\n            ", HTML.DIV({
      class: "modal-content"
    }, "\n              ", HTML.DIV({
      class: "modal-header"
    }, "\n                ", HTML.BUTTON({
      type: "button",
      class: "close",
      "data-dismiss": "modal",
      "aria-label": "Close"
    }, HTML.SPAN({
      "aria-hidden": "true"
    }, HTML.CharRef({
      html: "&times;",
      str: "×"
    }))), "\n                ", HTML.H4({
      class: "modal-title"
    }), "\n              "), "\n              ", HTML.DIV({
      class: "modal-body"
    }, "\n\n              "), "\n              ", HTML.DIV({
      class: "modal-footer"
    }, "\n                ", HTML.BUTTON({
      type: "button",
      class: "btn btn-default closebtn",
      "data-dismiss": "modal"
    }), "\n                ", HTML.BUTTON({
      type: "button",
      class: "btn btn-primary savebtn"
    }), "\n              "), "\n            "), "\n          "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_questions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_questions/add_questions.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Question;
module.watch(require("/imports/api/questions/questions.js"), {
  Question: function (v) {
    Question = v;
  }
}, 0);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 1);
var FlowRouter;
module.watch(require("meteor/kadira:flow-router"), {
  FlowRouter: function (v) {
    FlowRouter = v;
  }
}, 2);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 3);
var TypeReading;
module.watch(require("/imports/api/type_readings/type_readings.js"), {
  TypeReading: function (v) {
    TypeReading = v;
  }
}, 4);
var UserSegment;
module.watch(require("/imports/api/user_segments/user_segments.js"), {
  UserSegment: function (v) {
    UserSegment = v;
  }
}, 5);
module.watch(require("./add_questions.html"));
Template.add_questions.onCreated(function () {
  function add_questionsOnCreated() {
    var _this = this;

    this._category = new ReactiveVar(FlowRouter.getParam('category'));

    this.category = function () {
      return _this._category.get();
    };

    this.convertCategory = function (cat) {
      if (cat === 'IE') {
        return 0;
      }

      if (cat === 'NS') {
        return 1;
      }

      if (cat === 'TF') {
        return 2;
      }

      if (cat === 'JP') {
        return 3;
      }

      return -1;
    };

    this.categoryToIndex = new ReactiveVar(this.convertCategory(this._category.get()));

    this.categoryCheck = function () {
      return {
        IE: _this.category() === 'IE',
        NS: _this.category() === 'NS',
        TF: _this.category() === 'TF',
        JP: _this.category() === 'JP'
      };
    };

    this.showModal = function (stuff) {
      var m = $('#tempModal');
      m.find('h4.modal-title').html(stuff.Title);
      m.find('div.modal-body').html(stuff.Body);
      m.find('div.modal-footer button.closebtn').html(stuff.CloseText);
      m.find('div.modal-footer button.savebtn').html(stuff.SaveText).click(stuff.SaveFunction);

      _.each(stuff.data, function (name, val) {
        m.data(name, val);
      });

      m.modal('show');
    };

    this.fixTabs = function () {
      var active = $('li[role=presentation].active a').data('type');
      console.log(active);
      $('tbody.edit-body').hide();
      $('#' + active + "Table").show();
    };

    this.makeModalStuff = function (title, body, closeText, saveText, saveFunction, data) {
      return {
        Title: title,
        Body: body,
        CloseText: closeText,
        SaveText: saveText,
        SaveFunction: saveFunction,
        data: data
      };
    };

    this.autorun(function () {
      console.log("autorunning...", _this.categoryToIndex.get());
      _this.subscription = _this.subscribe('questions.bycategory', _this.categoryToIndex.get(), {
        onStop: function () {
          console.log("Subscription stopped! ", arguments, this);
        },
        onReady: function () {
          console.log("Subscription ready! ", arguments, this);
        },
        sort: {
          createdAt: -1
        }
      });
      console.log(_this.subscription);
      _this.subscription3 = _this.subscribe('segmentList', _this.userId, {
        onStop: function () {
          console.log("Segment List subscription stopped! ", arguments, this);
        },
        onReady: function () {
          console.log("Segment List subscription ready! ", arguments, this);
        }
      });
      console.log(_this.subscription3);
    });
  }

  return add_questionsOnCreated;
}());
Template.add_questions.helpers({
  category: function () {
    return Template.instance().category();
  },
  categoryCheck: function () {
    return Template.instance().categoryCheck();
  },
  userSegmentList: function () {
    var segList = [];
    var s = UserSegment.find();
    s.forEach(function (m) {
      segList.push({
        value: m._id,
        text: m.name
      });
    });
    return segList;
  },
  assignedUserSegments: function (q) {
    console.log("sssssssssssss", q);

    if (typeof q === "undefined") {
      return [];
    }

    var assigned = [];

    for (var i = 0; i < q.segments.length; i++) {
      var seg = UserSegment.findOne({
        _id: q.segments[i]
      });
      assigned.push({
        value: q.segments[i],
        text: seg.name
      });
    }

    return assigned;
  },
  questions: function () {
    var x = Question.find({
      Categories: parseInt(Template.instance().categoryToIndex.get())
    }, {
      sort: {
        createdAt: -1
      }
    });
    return x;
  },
  questionAuthor: function (question) {
    var u = User.findOne(question.CreatedBy);
    return "<span style='white-space:nowrap;'>" + u.MyProfile.fullName() + " <span class='label label-warning'>" + u.MyProfile.UserType.Personality.getFourLetter() + "</span></span>";
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    u.callMethod('fullName', function (err, result) {
      console.log(err, result);
      return result;
    }); //return u.fullName();
  },
  indexToCategory: function (ind) {
    if (ind === 0) {
      return 'IE';
    }

    if (ind === 1) {
      return 'NS';
    }

    if (ind === 2) {
      return 'TF';
    }

    if (ind === 3) {
      return 'JP';
    }

    return 'UN';
  },
  categoryToIndex: function (cat) {
    if (cat === 'IE') {
      return 0;
    }

    if (cat === 'NS') {
      return 1;
    }

    if (cat === 'TF') {
      return 2;
    }

    if (cat === 'JP') {
      return 3;
    }

    return -1;
  },
  categoryList: function () {
    var categories = [{
      text: 'IE',
      value: 0
    }, {
      text: 'NS',
      value: 1
    }, {
      text: 'TF',
      value: 2
    }, {
      text: 'JP',
      value: 3
    }];
    return categories;
  },
  averageAnswer: function (times, sum) {
    if (times === 0) {
      return 0;
    }

    return Math.round(Math.abs(sum) / times);
  },
  totalAnswers: function (right, left) {
    return right + left;
  },
  canDelete: function (question) {
    return question.TimesAnswered.LeftSum + question.TimesAnswered.RightSum < 1;
  }
});
Template.add_questions.events({
  'click button.quest-cat-select': function (event, instance) {
    console.log('click button.quest-cat-select =>', event, instance);
    var newCat = $(event.target).data('category');
    FlowRouter.go("/addQuestions/" + newCat);

    instance._category.set(newCat);

    instance.categoryToIndex.set(instance.convertCategory(newCat));
    instance.fixTabs();
  },
  'click button.dropdown-toggle': function (event, instance) {
    event.preventDefault();
    console.log('click button.dropdown-toggle => ', event, instance);
  },
  'click ul.dropdown-menu li a': function (event, instance) {
    event.preventDefault();
    console.log('click ul.dropdown-menu li a => ', event, instance);
    var newCat = $(event.target).html();
    FlowRouter.go($(event.target).attr('href'));

    instance._category.set(newCat);

    instance.categoryToIndex.set(instance.convertCategory(newCat)); //$('.Selected-Category').html(newCat);

    $('[name=Category]').val($(event.target).data('value'));
    $('button.quest-cat-select.cat-' + newCat).addClass('active');
    instance.fixTabs();
  },
  'click span.toggle-enable': function (event, instance) {
    console.log('click span.toggle-enable => ', event, instance);
    var qid = $(event.target).closest('tr').data('id');
    var q = Question.findOne({
      _id: qid
    });
    q.Active = !q.Active;
    q.save();
  },
  'click span.delete': function (event, instance) {
    event.preventDefault();
    console.log('click span.delete => ', event, instance);
    var target = event.target;
    var qid = $(target).data('qid');
    var vals = instance.makeModalStuff("Are you really sure?", "<h5>Do you really want to delete the question:</h5><table class='table table-bordered'><tr>" + $("#" + qid).html() + "</tr></table>", "No!", "I guess...", function (event) {
      $('#tempModal').modal('hide');
      $(this).off(event);
      Meteor.call('question.delete', qid, function (error) {
        if (error) {
          console.log("Error on delete: ", error);
        } else {
          console.log(qid + " should be deleted...");
        }
      });
    }, {
      qid: qid
    });
    instance.showModal(vals);
  },
  'submit #newQuestion': function (event, instance) {
    event.preventDefault();
    console.log('submit #newQuestion => ', event, instance);
    var target = event.target;
    var values = {
      //'Category':target.Category.value,
      'Categories': $(target).find("#select-categories")[0].selectize.items,
      'Text': target.Text.value,
      'LeftText': target.LeftText.value,
      'RightText': target.RightText.value,
      'segments': $(target).find("#select-segments")[0].selectize ? $(target).find("#select-segments")[0].selectize.items : []
    };
    console.log(values);
    Meteor.call('question.insert', values.Categories, values.Text, values.LeftText, values.RightText, values.segments, function (error) {
      if (error) {
        console.log("EEEEEERRRORRRRR: ", error);
      } else {
        target.Text.value = '';
        target.LeftText.value = '';
        target.RightText.value = '';
      }
    });
  }
});
Template.add_questions.onRendered(function () {
  $('.dropdown-toggle').dropdown();
  $('ul.nav-tabs li a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('tbody.edit-body').hide();
    $('#' + $(this).data('type') + "Table").show();
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"add_readings":{"add_readings.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_readings/add_readings.html                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.add_readings.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.add_readings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_readings/template.add_readings.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("add_readings");
Template["add_readings"] = new Template("Template.add_readings", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container"
    }, "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.TABLE({
      class: "table table-striped table-hover"
    }, "\n                ", HTML.THEAD("\n                ", HTML.TR("\n                    ", HTML.TD("\n                        ", HTML.A({
      href: "#",
      id: "addTypeReadingLink"
    }, HTML.H4({
      style: "margin:0;"
    }, "Add new trait description ", HTML.SPAN({
      class: "glyphicon glyphicon-chevron-down"
    }))), "\n                        ", HTML.DIV({
      class: "add-type-reading",
      style: "overflow: inherit;display:none;"
    }, "\n                            ", HTML.DIV({
      role: "",
      class: "",
      id: "addReading"
    }, "\n                                ", HTML.FORM({
      id: "newReading"
    }, "\n                                    ", HTML.INPUT({
      type: "text",
      class: "form-control input-medium",
      name: "Header",
      style: "height:34px;margin:5px 0 5px 0;",
      placeholder: "Title..."
    }), "\n                                    ", HTML.TEXTAREA({
      class: "form-control",
      name: "Body",
      placeholder: "Body of the description...",
      style: "height:200px;margin:5px 0 5px 0;"
    }), "\n                                    ", HTML.BUTTON({
      class: "btn btn-default btn-primary new-reading pull-right",
      type: "submit",
      style: "margin:5px 0 5px 0;"
    }, "Add"), "\n                                "), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n                "), "\n                ", HTML.TBODY("\n                ", HTML.TR("\n                    ", HTML.TD("\n                        ", HTML.H4("Edit existing trait descriptions"), "\n                    "), "\n                "), "\n                "), "\n                ", HTML.TBODY({
      id: "readingTable",
      class: "edit-body",
      style: ""
    }, "\n            ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("readings")),
        _variable: "reading"
      };
    }, function() {
      return [ "\n                ", HTML.TR({
        "data-id": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id"));
        },
        id: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id"));
        },
        class: "edit-reading edit-row"
      }, "\n                    ", HTML.TD("\n                        ", HTML.DIV({
        class: "row"
      }, "\n                            ", HTML.DIV({
        class: "col-md-1"
      }, "\n                                ", HTML.SPAN({
        style: "cursor: pointer;",
        class: function() {
          return [ "label label-", Blaze.If(function() {
            return Spacebars.call(Spacebars.dot(view.lookup("reading"), "Enabled"));
          }, function() {
            return "success";
          }, function() {
            return "danger";
          }), " toggle-enable-reading" ];
        }
      }, Blaze.If(function() {
        return Spacebars.call(Spacebars.dot(view.lookup("reading"), "Enabled"));
      }, function() {
        return "Active";
      }, function() {
        return "Inactive";
      })), "\n                            "), "\n                            ", HTML.DIV({
        class: "col-md-10"
      }, "\n                                ", HTML.H5(HTML.STRONG(Blaze.View("lookup:reading.Header", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "Header"));
      }))), "\n                                ", HTML.P({
        class: "text-justify"
      }, "\n                                    ", Blaze.View("lookup:reading.Body", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "Body"));
      }), "\n                                "), "\n                                ", HTML.DIV({
        style: "float:left;"
      }, "\n                                    ", HTML.A({
        href: "#",
        class: "readingCategoryLink",
        "data-category": "0",
        "data-high": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 0, 1);
        },
        "data-low": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 0, 0);
        }
      }, "\n                                        ", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("readingHasCategory"), view.lookup("reading"), 0);
      }, function() {
        return [ "\n                                            ", HTML.SPAN({
          class: "label label-primary",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: function() {
            return Spacebars.mustache(view.lookup("readingCategory"), view.lookup("reading"), 0);
          }
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 0);
        })), "\n                                        " ];
      }, function() {
        return [ "\n                                            ", HTML.SPAN({
          class: "label label-default",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: "Not set"
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 0);
        })), "\n                                        " ];
      }), "\n                                    "), "\n                                    ", HTML.A({
        href: "#",
        class: "readingCategoryLink",
        "data-category": "1",
        "data-high": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 1, 1);
        },
        "data-low": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 1, 0);
        }
      }, Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("readingHasCategory"), view.lookup("reading"), 1);
      }, function() {
        return HTML.SPAN({
          class: "label label-primary",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: function() {
            return Spacebars.mustache(view.lookup("readingCategory"), view.lookup("reading"), 1);
          }
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 1);
        }));
      }, function() {
        return HTML.SPAN({
          class: "label label-default",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: "Not set"
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 1);
        }));
      })), "\n                                    ", HTML.A({
        href: "#",
        class: "readingCategoryLink",
        "data-category": "2",
        "data-high": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 2, 1);
        },
        "data-low": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 2, 0);
        }
      }, Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("readingHasCategory"), view.lookup("reading"), 2);
      }, function() {
        return HTML.SPAN({
          class: "label label-primary",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: function() {
            return Spacebars.mustache(view.lookup("readingCategory"), view.lookup("reading"), 2);
          }
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 2);
        }));
      }, function() {
        return HTML.SPAN({
          class: "label label-default",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: "Not set"
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 2);
        }));
      })), "\n                                    ", HTML.A({
        href: "#",
        class: "readingCategoryLink",
        "data-category": "3",
        "data-high": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 3, 1);
        },
        "data-low": function() {
          return Spacebars.mustache(view.lookup("getRange"), view.lookup("reading"), 3, 0);
        }
      }, Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("readingHasCategory"), view.lookup("reading"), 3);
      }, function() {
        return HTML.SPAN({
          class: "label label-primary",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: function() {
            return Spacebars.mustache(view.lookup("readingCategory"), view.lookup("reading"), 3);
          }
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 3);
        }));
      }, function() {
        return HTML.SPAN({
          class: "label label-default",
          "data-toggle": "tooltip",
          "data-placement": "top",
          title: "Not set"
        }, Blaze.View("lookup:indexToCategory", function() {
          return Spacebars.mustache(view.lookup("indexToCategory"), 3);
        }));
      })), "\n                                "), "\n                                ", HTML.DIV({
        style: "float:right;font-weight:bold;"
      }, Blaze.View("lookup:readingAuthor", function() {
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("readingAuthor"), view.lookup("reading")));
      })), "\n                            "), "\n                            ", HTML.DIV({
        class: "col-md-1",
        style: "text-align: right;"
      }, "\n                                ", HTML.SPAN({
        class: "glyphicon glyphicon-remove delete-reading text-danger",
        "data-rid": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id"));
        },
        style: "cursor: pointer;"
      }), "\n                            "), "\n                            ", HTML.DIV({
        class: "col-md-10 col-md-offset-1 expansion-drawer",
        style: "display:none;"
      }, "\n                                ", HTML.FORM({
        id: function() {
          return [ "addCategoryToReading-", Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id")) ];
        },
        class: "addCategoryToReadingForm"
      }, "\n                                    ", HTML.INPUT({
        type: "hidden",
        name: "readingId",
        value: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id"));
        }
      }), "\n                                    ", HTML.DIV({
        class: "input-group",
        style: "margin-top:10px;"
      }, "\n                                        ", HTML.SPAN({
        class: "input-group-addon readingCategoryDisplay"
      }), "\n                                        ", HTML.INPUT({
        type: "hidden",
        name: "Category",
        value: ""
      }), "\n                                        ", HTML.INPUT({
        type: "text",
        class: "form-control input-medium",
        name: "Low",
        style: "height:34px;",
        placeholder: "Low limit"
      }), "\n                                        ", HTML.SPAN({
        class: "input-group-addon"
      }, HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), "to", HTML.CharRef({
        html: "&nbsp;",
        str: " "
      })), "\n                                        ", HTML.INPUT({
        type: "text",
        class: "form-control input-medium",
        name: "High",
        style: "height:34px;",
        placeholder: "High limit"
      }), "\n                                        ", HTML.SPAN({
        class: "input-group-btn"
      }, "\n                                            ", HTML.BUTTON({
        class: "btn btn-default btn-primary new-reading-category",
        type: "submit"
      }, "Set"), "\n                                        "), "\n                                    "), "\n                                "), "\n                            "), "\n                        "), "\n                    "), HTML.SCRIPT("\n                        $('#", Blaze.View("lookup:reading._id", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("reading"), "_id"));
      }), ' *[data-toggle="tooltip"]\').tooltip();\n                    '), "\n                "), "\n            " ];
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.Comment(" Modal "), "\n        ", HTML.DIV({
      class: "modal fade",
      id: "tempModal",
      tabindex: "-1",
      role: "dialog",
      "aria-labelledby": "tempModalLabel"
    }, "\n          ", HTML.DIV({
      class: "modal-dialog",
      role: "document",
      style: "margin:0;"
    }, "\n            ", HTML.DIV({
      class: "modal-content"
    }, "\n              ", HTML.DIV({
      class: "modal-header"
    }, "\n                ", HTML.BUTTON({
      type: "button",
      class: "close",
      "data-dismiss": "modal",
      "aria-label": "Close"
    }, HTML.SPAN({
      "aria-hidden": "true"
    }, HTML.CharRef({
      html: "&times;",
      str: "×"
    }))), "\n                ", HTML.H4({
      class: "modal-title"
    }), "\n              "), "\n              ", HTML.DIV({
      class: "modal-body"
    }, "\n\n              "), "\n              ", HTML.DIV({
      class: "modal-footer"
    }, "\n                ", HTML.BUTTON({
      type: "button",
      class: "btn btn-default closebtn",
      "data-dismiss": "modal"
    }), "\n                ", HTML.BUTTON({
      type: "button",
      class: "btn btn-primary savebtn"
    }), "\n              "), "\n            "), "\n          "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_readings.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/add_readings/add_readings.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Question;
module.watch(require("/imports/api/questions/questions.js"), {
  Question: function (v) {
    Question = v;
  }
}, 0);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 1);
var FlowRouter;
module.watch(require("meteor/kadira:flow-router"), {
  FlowRouter: function (v) {
    FlowRouter = v;
  }
}, 2);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 3);
var TypeReading;
module.watch(require("/imports/api/type_readings/type_readings.js"), {
  TypeReading: function (v) {
    TypeReading = v;
  }
}, 4);
module.watch(require("./add_readings.html"));
Template.add_readings.onCreated(function () {
  function add_readingsOnCreated() {
    var _this = this;

    this.showModal = function (stuff) {
      var m = $('#tempModal');
      m.find('h4.modal-title').html(stuff.Title);
      m.find('div.modal-body').html(stuff.Body);
      m.find('div.modal-footer button.closebtn').html(stuff.CloseText);
      m.find('div.modal-footer button.savebtn').html(stuff.SaveText).click(stuff.SaveFunction);

      _.each(stuff.data, function (name, val) {
        m.data(name, val);
      });

      m.modal('show');
    };

    this.makeModalStuff = function (title, body, closeText, saveText, saveFunction, data) {
      return {
        Title: title,
        Body: body,
        CloseText: closeText,
        SaveText: saveText,
        SaveFunction: saveFunction,
        data: data
      };
    };

    this.autorun(function () {
      _this.subscription = _this.subscribe('typereadings.getAll', {
        onStop: function () {
          console.log("Subscription stopped! ", arguments, this);
        },
        onReady: function () {
          console.log("Subscription ready! ", arguments, this);
        },
        sort: {
          "TypeReadingCategories.Range.Delta": -1
        }
      });
      console.log(_this.subscription);
    });
  }

  return add_readingsOnCreated;
}());
Template.add_readings.helpers({
  readings: function () {
    return TypeReading.find({}, {
      sort: {
        "TypeReadingCategories.Range.low": 1,
        "TypeReadingCategories.Range.Delta": -1
      }
    });
  },
  indexToCategory: function (ind) {
    if (ind === 0) {
      return 'IE';
    }

    if (ind === 1) {
      return 'NS';
    }

    if (ind === 2) {
      return 'TF';
    }

    if (ind === 3) {
      return 'JP';
    }

    return 'UN';
  },
  categoryToIndex: function (cat) {
    if (cat === 'IE') {
      return 0;
    }

    if (cat === 'NS') {
      return 1;
    }

    if (cat === 'TF') {
      return 2;
    }

    if (cat === 'JP') {
      return 3;
    }

    return -1;
  },
  readingHasCategory: function (reading, category) {
    return !!reading.TypeReadingCategories[category];
  },
  readingCategory: function (reading, category) {
    if (!reading.TypeReadingCategories[category]) {
      return "-";
    } else {
      return "from " + reading.TypeReadingCategories[category].Range.low + " to " + reading.TypeReadingCategories[category].Range.high;
    }
  },
  getRange: function (reading, category, isHigh) {
    if (!reading.TypeReadingCategories[category]) {
      return "";
    }

    return isHigh ? reading.TypeReadingCategories[category].Range.high : reading.TypeReadingCategories[category].Range.low;
  },
  readingAuthor: function (reading) {
    var u = User.findOne(reading.CreatedBy);
    return u.MyProfile.fullName() + " <span class='label label-warning'>" + u.MyProfile.UserType.Personality.getFourLetter() + "</span>";
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    u.callMethod('fullName', function (err, result) {
      console.log(err, result);
      return result;
    }); //return u.fullName();
  }
});
Template.add_readings.events({
  'click span.toggle-enable-reading': function (event, instance) {
    console.log('click span.toggle-enable-reading => ', event, instance);
    var rid = $(event.target).closest('tr').data('id');
    Meteor.call('typereadings.toggle', rid, function (error) {
      if (error) {
        console.log("Error on toggle reading: ", error);
      } else {
        console.log(rid + " should be toggled.");
      }
    });
  },
  'click span.delete-reading': function (event, instance) {
    event.preventDefault();
    console.log('click span.delete-reading => ', event, instance);
    var target = event.target;
    var rid = $(target).data('rid');
    var vals = instance.makeModalStuff("Are you really sure?", "<h5>Do you really want to delete the reading:</h5><table class='table table-bordered'><tr>" + $("#" + rid).html() + "</tr></table>", "No!", "I guess...", function (event) {
      $('#tempModal').modal('hide');
      $(this).off(event);
      Meteor.call('typereadings.delete', rid, function (error) {
        if (error) {
          console.log("Error on delete: ", error);
        } else {
          console.log(rid + " should be deleted...");
        }
      });
    }, {
      rid: rid
    });
    instance.showModal(vals);
  },
  'click #addTypeReadingLink': function (event, instance) {
    event.preventDefault();

    if ($('span', event.target).hasClass('glyphicon-chevron-down')) {
      $('span', event.target).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      $('div.add-type-reading').slideDown(300);
    } else {
      $('span', event.target).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      $('div.add-type-reading').slideUp(300);
    }
  },
  'click a.readingCategoryLink': function (event, instance) {
    event.preventDefault();
    var me = $(event.target);
    var parentData = me.parent().get(0).dataset;
    var cat = parseInt(parentData.category);
    var hi = parentData.high;
    var low = parentData.low;
    var mom = me.parents('div.row:first');
    mom.find('input[name=Category]').val(cat);
    mom.find('span.readingCategoryDisplay').html(instance.view.template.__helpers[" indexToCategory"](cat));
    mom.find('input[name=Low]').val(low);
    mom.find('input[name=High]').val(hi);

    if (!mom.find('.expansion-drawer').is(':visible')) {
      $('.expansion-drawer').slideUp(300);
      mom.find('.expansion-drawer').slideDown(300);
    }
  },
  'submit #newReading': function (event, instance) {
    event.preventDefault();
    console.log('submit #newReading => ', event, instance);
    var target = event.target;
    var values = {
      'Header': target.Header.value,
      'Body': target.Body.value
    };
    console.log(values);
    Meteor.call('typereadings.insert', values.Header, values.Body, function (error) {
      if (error) {
        console.log("EEEEEERRRORRRRR: ", error);
      } else {
        target.Header.value = '';
        target.Body.value = '';
      }
    });
  },
  'submit form.addCategoryToReadingForm': function (event, instance) {
    event.preventDefault();
    var target = event.target;
    var values = {
      Category: target.Category.value,
      High: target.High.value,
      Low: target.Low.value,
      ReadingId: target.readingId.value
    };
    Meteor.call('typereadings.addCategoryToReading', values.ReadingId, values.Category, values.High, values.Low, function (error) {
      if (error) {
        console.log("EEEEEEEEEEERRRRRRRRRRROOOOOOOOORRRRR: ", error);
      } else {
        console.log("We good, man!");
        target.Low.value = '';
        target.High.value = '';
      }
    });
  }
});
Template.add_readings.onRendered(function () {});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"admin_teams":{"admin_teams.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/admin_teams/admin_teams.html                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.admin_teams.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.admin_teams.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/admin_teams/template.admin_teams.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("admin_teams");
Template["admin_teams"] = new Template("Template.admin_teams", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container"
    }, "\n        ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isInRole"), "admin");
    }, function() {
      return [ "\n            ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("specificTeam"));
      }, function() {
        return [ "\n                ", HTML.DIV({
          id: "form-new-team"
        }, "\n                    ", HTML.DIV({
          class: "row spaced"
        }, "\n                        ", HTML.DIV({
          class: "col-sm-6"
        }, "\n                            ", HTML.DIV({
          class: "input-group"
        }, "\n                                ", HTML.INPUT({
          id: "input-new-team-name",
          type: "text",
          class: "form-control",
          placeholder: "New team name..."
        }), "\n                                ", HTML.SPAN({
          class: "input-group-btn"
        }, "\n                                    ", HTML.BUTTON({
          class: "btn btn-primary",
          id: "btn-create-team"
        }, HTML.SPAN({
          class: "glyphicon glyphicon-plus-sign"
        }), " Create"), "\n                                "), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
          class: "col-sm-6"
        }, "\n                            ", HTML.DIV({
          class: "alert",
          id: "msg-create"
        }, "\n                            "), "\n                        "), "\n                    "), "\n                    ", HTML.DIV({
          class: "row spaced",
          id: "div-new-team-details"
        }, "\n                        ", HTML.DIV({
          class: "col-sm-6"
        }, "\n                            ", HTML.TEXTAREA({
          id: "input-new-team-description",
          class: "form-control",
          placeholder: "New team description..."
        }), "\n                        "), "\n                    "), "\n                "), "\n            " ];
      }), "\n        " ];
    }), "\n        ", Blaze.If(function() {
      return Spacebars.call(view.lookup("specificTeam"));
    }, function() {
      return [ "\n            ", HTML.DIV({
        class: "team-list list-group"
      }, "\n                ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teams")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                    ", Blaze._TemplateWith(function() {
          return {
            team: Spacebars.call(view.lookup("team")),
            single: Spacebars.call("1")
          };
        }, function() {
          return Spacebars.include(view.lookupTemplate("team_view"));
        }), "\n                " ];
      }), "\n            "), "\n        " ];
    }, function() {
      return [ "\n            ", HTML.DIV({
        class: "team-list list-group"
      }, "\n                My Teams\n                ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teamsMemberOf")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                    ", Blaze._TemplateWith(function() {
          return {
            team: Spacebars.call(view.lookup("team"))
          };
        }, function() {
          return Spacebars.include(view.lookupTemplate("team_view"));
        }), "\n                " ];
      }), "\n            "), "\n            ", HTML.DIV({
        class: "team-list list-group"
      }, "\n                Other Teams\n                ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teamsOther")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                    ", Blaze._TemplateWith(function() {
          return {
            team: Spacebars.call(view.lookup("team"))
          };
        }, function() {
          return Spacebars.include(view.lookupTemplate("team_view"));
        }), "\n                " ];
      }), "\n            "), "\n        " ];
    }), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

Template.__checkName("team_view");
Template["team_view"] = new Template("Template.team_view", (function() {
  var view = this;
  return HTML.DIV({
    class: function() {
      return [ "team-view ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("single"));
      }, function() {
        return "collapsed";
      }), " list-group-item" ];
    },
    "data-team-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
    },
    "data-team-name": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
    },
    id: function() {
      return [ "div-team-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
    }
  }, "\n        ", HTML.DIV({
    class: "row summary-row"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10 collapsed-summary"
  }, "\n                ", Blaze._TemplateWith(function() {
    return {
      team: Spacebars.call(view.lookup("team"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("team_icon"));
  }), "\n                ", HTML.SPAN({
    class: "team-name"
  }, Blaze.View("lookup:team.Name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
  })), "\n                ", HTML.SPAN({
    class: "collapsed-description"
  }, Blaze.View("lookup:team.Description", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Description"));
  })), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-10 expanded-summary"
  }, "\n                ", HTML.SPAN({
    class: "team-title"
  }, HTML.INPUT(HTML.Attrs({
    type: "text",
    id: function() {
      return [ "team-title-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
    },
    class: "flat form-control",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
    },
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter team name...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "title");
  }))), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-2 text-right btn-group-xs"
  }, "\n                ", HTML.Raw('<button class="btn btn-success btn-save glyphicon glyphicon-ok details" disabled="" alt="Save changes"></button>'), "\n                ", HTML.Raw('<button class="btn btn-warning btn-cancel glyphicon glyphicon-remove details" disabled="" alt="Discard changes"></button>'), "\n                ", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("single"));
  }, function() {
    return [ "\n                    ", HTML.BUTTON({
      class: "btn btn-primary btn-expand glyphicon glyphicon-chevron-down",
      id: function() {
        return [ "btn-expand-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
      }
    }), "\n                " ];
  }), "\n            "), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10"
  }, "\n                ", HTML.DIV({
    class: "team-description"
  }, "\n                    ", HTML.TEXTAREA(HTML.Attrs({
    id: function() {
      return [ "team-description-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
    },
    class: "flat form-control",
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter team description...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "description");
  }, {
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Description"));
    }
  })), "\n                "), "\n            "), "\n            ", HTML.Raw('<div class="col-sm-2 text-right">\n            </div>'), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10"
  }, "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin,view-members", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "user-list-table"
    }, "\n                    ", HTML.H4("Members"), "\n                    ", HTML.TABLE({
      class: "table"
    }, "\n                        ", HTML.THEAD("\n                            ", HTML.TR("\n                                ", HTML.TH("First Name"), "\n                                ", HTML.TH("Last Name"), "\n                                ", HTML.TH("Team Roles"), "\n                            "), "\n                        "), "\n                        ", HTML.TBODY("\n                            ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.dataMustache(view.lookup("teamMembers"), Spacebars.dot(view.lookup("team"), "Name")),
        _variable: "member"
      };
    }, function() {
      return [ "\n                            ", HTML.TR({
        "data-user-id": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("member"), "_id"));
        }
      }, "\n                                ", HTML.TD(Blaze.View("lookup:member.firstName", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("member"), "firstName"));
      })), "\n                                ", HTML.TD(Blaze.View("lookup:member.lastName", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("member"), "lastName"));
      })), "\n                                ", HTML.TD("\n                                    ", Blaze._TemplateWith(function() {
        return {
          id: Spacebars.call("select-roles-"),
          id2: Spacebars.call(view.lookup("uniqueId")),
          name: Spacebars.call("roles[]"),
          placeholder: Spacebars.call("Roles..."),
          list: Spacebars.call(view.lookup("rolesList")),
          selected: Spacebars.call(Spacebars.dot(view.lookup("member"), "roles"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("select_autocomplete"));
      }), "\n                                "), "\n                            "), "\n                            " ];
    }), "\n                        "), "\n                    "), "\n                "), "\n                " ];
  }), "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("hasTeamRequests"), Spacebars.dot(view.lookup("team"), "Name"));
    }, function() {
      return [ "\n                ", HTML.DIV({
        class: "user-list-table"
      }, "\n                    ", HTML.H4("Join requests"), "\n                    ", HTML.TABLE({
        class: "table"
      }, "\n                        ", HTML.THEAD("\n                            ", HTML.TR("\n                                ", HTML.TH("First Name"), "\n                                ", HTML.TH("Last Name"), "\n                                ", HTML.TH("Actions"), "\n                            "), "\n                        "), "\n                        ", HTML.TBODY("\n                            ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.dataMustache(view.lookup("teamRequests"), Spacebars.dot(view.lookup("team"), "Name")),
          _variable: "request"
        };
      }, function() {
        return [ "\n                            ", HTML.TR({
          class: ""
        }, "\n                                ", HTML.TD(Blaze.View("lookup:request.firstName", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("request"), "firstName"));
        })), "\n                                ", HTML.TD(Blaze.View("lookup:request.lastName", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("request"), "lastName"));
        })), "\n                                ", HTML.TD("\n                                    ", HTML.SPAN({
          class: "label label-info"
        }, "\n                                        ", HTML.A({
          href: "#",
          "data-user-id": function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("request"), "_id"));
          },
          class: "btn-approve-join"
        }, "Approve"), "\n                                    "), "\n                                    ", HTML.SPAN({
          class: "label label-default"
        }, "\n                                        ", HTML.A({
          href: "#",
          "data-user-id": function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("request"), "_id"));
          },
          class: "btn-decline-join"
        }, "Decline"), "\n                                    "), "\n                                "), "\n                            "), "\n                            " ];
      }), "\n                        "), "\n                    "), "\n                "), "\n                " ];
    }), "\n                ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("hasTeamInvites"), Spacebars.dot(view.lookup("team"), "Name"));
    }, function() {
      return [ "\n                ", HTML.DIV({
        class: "user-list-table"
      }, "\n                    ", HTML.H4("Pending invitations"), "\n                    ", HTML.TABLE({
        class: "table"
      }, "\n                        ", HTML.THEAD("\n                            ", HTML.TR("\n                                ", HTML.TH("First Name"), "\n                                ", HTML.TH("Last Name"), "\n                                ", HTML.TH("Actions"), "\n                            "), "\n                        "), "\n                        ", HTML.TBODY("\n                            ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.dataMustache(view.lookup("teamInvites"), Spacebars.dot(view.lookup("team"), "Name")),
          _variable: "invite"
        };
      }, function() {
        return [ "\n                            ", HTML.TR({
          class: ""
        }, "\n                                ", HTML.TD(Blaze.View("lookup:invite.firstName", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("invite"), "firstName"));
        })), "\n                                ", HTML.TD(Blaze.View("lookup:invite.lastName", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("invite"), "lastName"));
        })), "\n                                ", HTML.TD("\n                                    ", HTML.SPAN({
          class: "label label-warning"
        }, "\n                                        ", HTML.A({
          href: "#",
          "data-user-id": function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("invite"), "_id"));
          },
          class: "btn-cancel-invite"
        }, "Cancel"), "\n                                    "), "\n                                "), "\n                            "), "\n                            " ];
      }), "\n                        "), "\n                    "), "\n                "), "\n                " ];
    }), "\n                " ];
  }), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-2 text-right"
  }, "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced"
    }, HTML.DIV({
      class: "col-sm-12"
    }, "\n                    ", HTML.DIV({
      class: "dropdown",
      "data-team-id": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
      }
    }, "\n                        ", HTML.BUTTON({
      type: "button",
      id: function() {
        return [ "add-user-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
      },
      class: "btn btn-primary btn-sm btn-add-users btn-block btn-text-left",
      "data-toggle": "dropdown",
      "data-placement": "right",
      title: "Send join requests"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-plus-sign"
    }), " Add users"), "\n                        ", HTML.DIV({
      class: "dropdown-menu add-users",
      "aria-labelledby": function() {
        return [ "add-user-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
      }
    }, "\n                            ", HTML.DIV({
      class: "text-right btn-bar"
    }, "\n                                ", HTML.BUTTON({
      class: "btn btn-success btn-xs btn-add-users-save"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-ok"
    })), "\n                                ", HTML.BUTTON({
      class: "btn btn-warning btn-xs btn-add-users-cancel"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-remove"
    })), "\n                            "), "\n                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-add-users-"),
        id2: Spacebars.call(Spacebars.dot(view.lookup("team"), "_id")),
        name: Spacebars.call("users[]"),
        placeholder: Spacebars.call("Users..."),
        list: Spacebars.call(view.lookup("userAddList"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                        "), "\n                    "), "\n                ")), "\n                " ];
  }), "\n                ", Blaze.Unless(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "member,admin-join-request,user-join-request", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced"
    }, HTML.DIV({
      class: "col-sm-12"
    }, "\n                    ", HTML.DIV("\n                        ", HTML.BUTTON({
      type: "button",
      "data-team-id": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
      },
      class: "btn btn-primary btn-sm btn-user-request-join btn-block btn-text-left",
      title: function() {
        return [ "Ask to join ", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name")) ];
      }
    }, HTML.SPAN({
      class: "glyphicon glyphicon-user"
    }), " Join team"), "\n                    "), "\n                ")), "\n                " ];
  }), "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "user-join-request", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "label label-warning"
    }, "\n                    requested\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                ", HTML.INPUT({
    name: function() {
      return [ "icon-upload-", Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id")) ];
    },
    class: "file-upload-input",
    type: "file"
  }), "\n                ", HTML.Raw('<!-- <span class="team-icon" style="background:url(data:{{team.IconType}};base64,{{iconData64}}) norepeat left center; padding: 5px 0 5px 25px;width:16px;height:16px;"></span> -->'), "\n                ", Blaze._TemplateWith(function() {
    return {
      team: Spacebars.call(view.lookup("team"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("team_icon"));
  }), "\n            "), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced"
  }, "\n            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin-join-request", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV("\n                    ", HTML.DIV({
      class: "alert alert-info"
    }, "\n                        You have been invited to join ", Blaze.View("lookup:team.Name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
    }), ".\n                        ", HTML.BUTTON({
      type: "button",
      "data-team-name": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
      },
      "data-team-id": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
      },
      class: "btn btn-primary btn-xs btn-accept-join",
      "data-toggle": "tooltip",
      "data-placement": "right",
      title: "Accept invitation to join group"
    }, "Accept"), "\n                        ", HTML.BUTTON({
      type: "button",
      "data-team-name": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
      },
      "data-team-id": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
      },
      class: "btn btn-secondary btn-xs btn-decline-join",
      "data-toggle": "tooltip",
      "data-placement": "right",
      title: "Decline invitation to join group"
    }, "Decline"), "\n                    "), "\n                "), "\n                " ];
  }), "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin,view-goals", Spacebars.dot(view.lookup("team"), "Name"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "team-goal-quick-list details"
    }, "\n                    ", HTML.H4({
      class: "section-title"
    }, "Goals"), "\n                    ", Blaze._TemplateWith(function() {
      return {
        teamName: Spacebars.call(Spacebars.dot(view.lookup("team"), "Name"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("team_goals"));
    }), "\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"admin_teams.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/admin_teams/admin_teams.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Team, TeamIcon;
module.watch(require("/imports/api/teams/teams.js"), {
  Team: function (v) {
    Team = v;
  },
  TeamIcon: function (v) {
    TeamIcon = v;
  }
}, 0);
var TeamGoal;
module.watch(require("/imports/api/team_goals/team_goals.js"), {
  TeamGoal: function (v) {
    TeamGoal = v;
  }
}, 1);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 2);
var FlowRouter;
module.watch(require("meteor/kadira:flow-router"), {
  FlowRouter: function (v) {
    FlowRouter = v;
  }
}, 3);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 4);
module.watch(require("./admin_teams.html"));
module.watch(require("../team_goals/team_goals.js"));
module.watch(require("/imports/ui/components/select_autocomplete/select_autocomplete.js"));
Template.admin_teams.onCreated(function () {
  var _this = this;

  if (this.data.teamName) {
    this.teamName = this.data.teamName;
  } else if (FlowRouter.getParam('teamName')) {
    this.teamName = FlowRouter.getParam('teamName').split('-').join(' ');
  } else {
    this.teamName = '';
  }

  console.log(this.teamName, FlowRouter.getParam('teamName'), "bbbbbbbbbbbbbb");
  this.autorun(function () {
    console.log("autorunning admin_teams...");
    _this.subscription = _this.subscribe('userList', Meteor.userId(), {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
    _this.subscription2 = _this.subscribe('teamMemberList', Meteor.userId(), {
      onStop: function () {
        console.log("Team Member subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Team Member subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
    _this.subscription3 = _this.subscribe('teamsData', Meteor.userId(), {
      onStop: function () {
        console.log("teamsData subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("teamsData subscription ready! ", arguments, this);
        console.log(Team.find().fetch());
      }
    });
    console.log(_this.subscription3);
  });
});
Template.admin_teams.onRendered(function () {
  Meteor.setTimeout(function () {
    $("table.table select.selectized").each(function (s) {
      this.selectize.on('item_add', function (val, $item) {
        var userId = $item.closest("[data-user-id]").data("user-id");
        var teamName = $item.closest("[data-team-name]").data("team-name");
        var t = Team.findOne({
          Name: teamName
        });
        t.addRole(userId, val);
      });
      this.selectize.on('item_remove', function (val, $item) {
        var userId = this.$control.closest("[data-user-id]").data("user-id");
        var teamName = this.$control.closest("[data-team-name]").data("team-name");
        var t = Team.findOne({
          Name: teamName
        });
        t.removeRole(userId, val);
      });
    });
  }, 1000);
});
Template.admin_teams.helpers({
  specificTeam: function () {
    if (typeof Template.instance().teamName === 'undefined' || Template.instance().teamName === '') {
      return false;
    } else {
      return true;
    }
  },
  teams: function () {
    if (typeof Team === 'undefined') {
      return false;
    }

    var t;

    if (typeof Template.instance().teamName === 'undefined' || Template.instance().teamName === '') {
      t = Team.find(); //.fetch();
    } else {
      t = Team.find({
        Name: Template.instance().teamName
      }); //.fetch();
    }

    console.log(Template.instance().teamName, t, "rrrrrrrrrrrr");
    var t_invited = [],
        t_member = [],
        t_else = [];
    t.forEach(function (team) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {
        t_invited.push(team);
      } else if (team.Members.includes(Meteor.userId())) {
        t_member.push(team);
      } else {
        t_else.push(team);
      }
    });
    return t_invited.concat(t_member, t_else);
  },
  teamsMemberOf: function () {
    if (typeof Team === 'undefined') {
      return false;
    }

    var t = Team.find(); //.fetch();

    var t_invited = [],
        t_member = [],
        t_else = [];
    t.forEach(function (team) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {
        t_invited.push(team);
      } else if (team.Members.includes(Meteor.userId())) {
        t_member.push(team);
      } else {//t_else.push(team);
      }
    });

    if (t_member.length > 1 && !Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
      //if regular user is a member of a team other than "No Team", hide "No Team" from this view
      t_member = t_member.filter(function (tm) {
        return tm.Name !== Team.Default.Name;
      });
    } else {//
    }

    return t_invited.concat(t_member, t_else);
  },
  teamsOther: function () {
    if (typeof Team === 'undefined') {
      return false;
    }

    var t = Team.find(); //.fetch();

    var t_invited = [],
        t_member = [],
        t_else = [];
    t.forEach(function (team) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', team.Name)) {//t_invited.push(team);
      } else if (team.Members.includes(Meteor.userId())) {//t_member.push(team);
      } else {
        t_else.push(team);
      }
    });
    return t_invited.concat(t_member, t_else);
  },
  teamMembers: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "member";
    var u = User.find(teamRole);

    if (typeof u === "undefined") {
      return false;
    }

    var memberList = [];
    u.forEach(function (m) {
      memberList.push({
        _id: m._id,
        firstName: m.MyProfile.firstName,
        lastName: m.MyProfile.lastName,
        roles: m.roles[teamName]
      });
    });
    return memberList;
  },
  uniqueId: function () {
    var text = "";
    var idLength = 10;
    var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < idLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },
  teamRequests: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "user-join-request";
    var u = User.find(teamRole);

    if (!u) {
      return [];
    }

    var requestList = [];
    u.forEach(function (m) {
      requestList.push({
        _id: m._id,
        firstName: m.MyProfile.firstName,
        lastName: m.MyProfile.lastName,
        roles: "user-join-request"
      });
    });
    return requestList;
  },
  rolesList: function () {
    var roles = [];
    Roles.getAllRoles().forEach(function (r) {
      roles.push({
        text: r.name,
        value: r.name
      });
    });
    return roles;
  },
  users: function () {
    return User.find().fetch();
  },
  userAddList: function (teamName) {
    var t = Team.findOne({
      Name: teamName
    });
    var memberList = [];

    if (t) {
      memberList = t.Members;
    }

    var u = User.find({
      _id: {
        '$nin': memberList
      }
    });
    var addList = [];
    u.forEach(function (m) {
      addList.push({
        value: m._id,
        text: m.MyProfile.firstName + " " + m.MyProfile.lastName
      });
    });
    return addList;
  }
});

function teamChanged($g) {
  $g.find(".btn-save").prop("disabled", false);
  $g.find(".btn-cancel").prop("disabled", false);
}

function teamUnchanged($g) {
  $g.find(".btn-save").prop("disabled", true);
  $g.find(".btn-cancel").prop("disabled", true);
  $g.find(".changed").removeClass("changed");
}

function saveTeam(teamId) {
  var saveObj = {
    Name: $("#team-title-" + teamId).val(),
    Description: $("#team-description-" + teamId).val()
  };
  var t = Team.findOne({
    _id: teamId
  });

  if (t) {
    t.updateFromObj(saveObj);
  }
}

Template.admin_teams.events({
  'change .file-upload-input': function (event, instance) {
    var file = event.currentTarget.files[0];
    var reader = new FileReader();

    reader.onload = function (fileLoadEvent) {
      var teamId = $(event.target).closest("[data-team-id]").data("team-id");
      var t = Team.findOne({
        _id: teamId
      });
      t.uploadIcon(file, reader.result);
    };

    reader.readAsBinaryString(file);
  },
  'change input.flat,textarea.flat': function (event, instance) {
    $(event.target).addClass('changed');
    var $team = $(event.target).closest("[data-team-id]");
  },
  'change input,textarea,select': function (event, instance) {
    var $t = $(event.target);
    var $team = $(event.target).closest("[data-team-id]");
    teamChanged($team);
  },
  'keyup input,textarea': function (event, instance) {
    var $t = $(event.target);
    var $team = $(event.target).closest("[data-team-id]");
    teamChanged($team);
  },
  'click button.btn-save': function (event, instance) {
    var $t = $(event.target);
    var teamId = $t.closest("[data-team-id]").data("team-id");
    saveTeam(teamId);
    teamUnchanged($("#div-team-" + teamId));
  },
  'click button#btn-create-team': function (event, instance) {
    var newTeamName = $("#input-new-team-name").val();

    if ("" === newTeamName) {
      $("#msg-create").removeClass("alert-success").addClass("alert-danger").html("Team name required").css("display", "inline-block");
      return;
    }

    var newTeamDescription = $("#input-new-team-description").val();
    var newTeam = {
      Name: newTeamName,
      Description: newTeamDescription
    };
    Meteor.call('team.createNewTeam', newTeam, function (err, rslt) {
      if (!err) {
        $("#div-new-team-details").slideUp();
        $("#input-new-team-name").val("");
        $("#msg-create").removeClass("alert-danger").addClass("alert-success").html("Team created!").css("display", "inline-block");
        $("#input-new-team-name").closest(".input-group").removeClass("has-error").removeClass("has-feedback");
      } else {
        console.log(err);
        $("#input-new-team-name").closest(".input-group").addClass("has-error").addClass("has-feedback");
        $("#msg-create").removeClass("alert-success").addClass("alert-danger").html("Duplicate team name").css("display", "inline-block");

        if (err.error === 409) {
          console.log("duplicate");
        }
      }

      Meteor.setTimeout(function () {
        $("#msg-create").fadeOut();
      }, 5000);
    });
  },
  'focus #form-new-team': function (event, instance) {
    $("#div-new-team-details").slideDown();
  },
  'blur #form-new-team': function (event, instance) {
    console.log("triggered div blur");
  },
  'click .dropdown-menu.add-users': function (event, instance) {
    event.stopPropagation();
  },
  'click button.btn-add-users-save': function (event, instance) {
    var $select = $(event.target).closest(".dropdown-menu").find(".selectized");
    var teamId = $(event.target).closest("[data-team-id]").data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    var userList = $select[0].selectize.items;
    t.adminRequestUserJoin(userList);
    $select[0].selectize.clear(true);
    $(event.target).closest(".dropdown").toggleClass('open');
  },
  'click button.btn-add-users-cancel': function (event, instance) {
    var $select = $(event.target).closest(".dropdown-menu").find(".selectized");
    $select[0].selectize.clear(true);
    $(event.target).closest(".dropdown").toggleClass('open');
  },
  'click button.btn-add-users': function (event, instance) {//show add-user widget
  },
  'click button.btn-accept-join': function (event, instance) {
    var teamId = $(event.target).data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.userAcceptJoin();
  },
  'click button.btn-decline-join': function (event, instance) {
    var teamId = $(event.target).data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.userDeclineJoin();
  },
  'click a.btn-admin-request-join': function (event, instance) {
    event.preventDefault();
    var userId = $(event.target).closest("[data-user-id]").data("user-id");
    var teamId = $(event.target).closest("[data-team-id]").data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.adminRequestUserJoin(userId);
  },
  'click button.btn-user-request-join': function (event, instance) {
    event.preventDefault();
    var teamId = $(event.target).data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.userRequestJoin();
  },
  'click a.btn-approve-join': function (event, instance) {
    event.preventDefault();
    var userId = $(event.target).data("user-id");
    var teamId = $(event.target).closest("[data-team-id]").data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.adminAcceptJoin(userId);
  },
  'click a.btn-decline-join': function (event, instance) {
    event.preventDefault();
    var userId = $(event.target).data("user-id");
    var teamId = $(event.target).closest("[data-team-id]").data("team-id");
    var t = Team.findOne({
      _id: teamId
    });
    t.adminRejectJoin(userId);
  },
  'click button.btn-remove-user-role': function (event, instance) {
    event.preventDefault();
    var userId = $(event.target).closest("[data-user-id]").data("user-id");
    var teamId = $(event.target).closest("[data-team-id]").data("team-id");
    var role = $(event.target).closest("[data-role]").data("role");
  },
  'click div.team-goal-quick-list': function (event, instance) {
    var teamName = $(event.target).closest("[data-team-name]").data("team-name");

    if (teamName) {
      FlowRouter.go("/teamGoals/" + teamName.split(" ").join("-"));
    }
  },
  'click button.btn-expand,div.collapsed-summary': function (event, instance) {
    var $target = $(event.target);
    var $teamContainer = $target.closest("[data-team-id]");
    var $targetExpandBtn = $teamContainer.find(".btn-expand.glyphicon");
    $targetExpandBtn.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");

    if ($teamContainer.hasClass("collapsed")) {
      $(".team-view[data-team-id]:not(.collapsed)").slideUp(function () {
        $(this).addClass("collapsed").css("display", "block");
      });
      $teamContainer.css("display", "none").removeClass("collapsed").slideDown(function () {
        $('html, body').animate({
          scrollTop: $teamContainer.offset().top
        }, 500);
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-down");
      $targetExpandBtn.addClass("glyphicon-chevron-up");
    } else {
      $teamContainer.slideUp(function () {
        $teamContainer.addClass("collapsed").css("display", "block");
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-up");
      $targetExpandBtn.addClass("glyphicon-chevron-down");
    }
  },
  'click tr[data-user-id]': function (event, instance) {
    if (!$(event.target).closest(".selectize-control").length) {
      var $target = $(event.target).closest("[data-user-id]");
      var uid = $target.data("user-id");
      FlowRouter.go("/profile/" + uid);
    }
  }
});
Template.team_view.helpers({
  fldEnabled: function (fld) {
    var team = Template.instance().data.team; //let t = TeamGoal.findOne( {_id: team._id} );
    //if (!t) {

    if (Roles.userIsInRole(Meteor.userId(), 'admin', team.Name)) {
      return "";
    } else {
      return "disabled";
    } //}


    if (g.hasModifyPerm(fld)) {
      return "";
    } else {
      return "disabled";
    }
  },
  iconData64: function () {
    var team = Template.instance().data.team;
    var t = Team.findOne({
      _id: team._id
    });
    return team.Icon64;
  },
  teamMembers: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "member";
    var u = User.find(teamRole);

    if (typeof u === "undefined") {
      return false;
    }

    var memberList = [];
    u.forEach(function (m) {
      memberList.push({
        _id: m._id,
        firstName: m.MyProfile.firstName,
        lastName: m.MyProfile.lastName,
        roles: m.roles[teamName]
      });
    });
    return memberList;
  },
  hasTeamRequests: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "user-join-request";
    var u = User.find(teamRole);

    if (!u || u.count() == 0) {
      return false;
    } else {
      return true;
    }
  },
  teamRequests: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "user-join-request";
    var u = User.find(teamRole);

    if (!u) {
      return [];
    }

    var requestList = [];
    u.forEach(function (m) {
      requestList.push({
        _id: m._id,
        firstName: m.MyProfile.firstName,
        lastName: m.MyProfile.lastName,
        roles: "user-join-request"
      });
    });
    return requestList;
  },
  hasTeamInvites: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "admin-join-request";
    var u = User.find(teamRole);

    if (!u || u.count() == 0) {
      return false;
    } else {
      return true;
    }
  },
  teamInvites: function (teamName) {
    var teamRole = {};
    teamRole["roles." + teamName] = "admin-join-request";
    var u = User.find(teamRole);

    if (!u) {
      return [];
    }

    var inviteList = [];
    u.forEach(function (m) {
      inviteList.push({
        _id: m._id,
        firstName: m.MyProfile.firstName,
        lastName: m.MyProfile.lastName,
        roles: "admin-join-request"
      });
    });
    return inviteList;
  },
  rolesList: function () {
    var roles = [];
    Roles.getAllRoles().forEach(function (r) {
      roles.push({
        text: r.name,
        value: r.name
      });
    });
    return roles;
  },
  uniqueId: function () {
    var text = "";
    var idLength = 10;
    var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < idLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },
  userAddList: function (teamName) {
    var t = Team.findOne({
      Name: teamName
    });
    var memberList = [];

    if (t) {
      memberList = t.Members;
    }

    var u = User.find({
      _id: {
        '$nin': memberList
      }
    });
    var addList = [];
    u.forEach(function (m) {
      addList.push({
        value: m._id,
        text: m.MyProfile.firstName + " " + m.MyProfile.lastName
      });
    });
    return addList;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ask_questions":{"ask_questions.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/ask_questions/ask_questions.html                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.ask_questions.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.ask_questions.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/ask_questions/template.ask_questions.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("ask_questions");
Template["ask_questions"] = new Template("Template.ask_questions", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container questions"
    }, "\n        ", HTML.DIV({
      class: "jumbotron"
    }, "\n            ", Blaze._TemplateWith(function() {
      return {
        source: Spacebars.call("questions")
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_feedback"));
    }), "\n            ", Spacebars.include(view.lookupTemplate("questions")), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ask_questions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/ask_questions/ask_questions.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Question;
module.watch(require("/imports/api/questions/questions.js"), {
  Question: function (v) {
    Question = v;
  }
}, 0);
var User, Profile, UserType, MyersBriggs, Answer;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  },
  Profile: function (v) {
    Profile = v;
  },
  UserType: function (v) {
    UserType = v;
  },
  MyersBriggs: function (v) {
    MyersBriggs = v;
  },
  Answer: function (v) {
    Answer = v;
  }
}, 1);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 2);
module.watch(require("./ask_questions.html"));
module.watch(require("../../components/questions/questions.js"));
module.watch(require("../../components/personality/personality.js"));
Template.ask_questions.helpers({
  answeredQuestionsLength: function () {
    var u = User.findOne({
      _id: Template.instance().userId
    });
    return u.MyProfile.UserType.AnsweredQuestions.length;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dash_min":{"dash_min.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/dash_min/dash_min.html                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.dash_min.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.dash_min.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/dash_min/template.dash_min.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("dash_min");
Template["dash_min"] = new Template("Template.dash_min", (function() {
  var view = this;
  return HTML.DIV({
    class: "container text-center"
  }, HTML.Raw('\n        <div class="row spaced">\n            <div class="col-md-12">\n                <button type="button" class="btn btn-primary questions">Answer Questions</button>\n            </div>\n        </div>\n        <div class="row spaced">\n            <div class="col-md-12">\n                <button type="button" class="btn btn-success learnshare">Learn Share</button>\n            </div>\n        </div>\n        '), Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("isInRole"), "admin");
  }, function() {
    return [ "\n            ", HTML.DIV({
      class: "row spaced"
    }, "\n                ", HTML.DIV({
      class: "col-md-12"
    }, "\n                    ", HTML.BUTTON({
      type: "button",
      class: "btn btn-success user-segments"
    }, "User Segments"), "\n                "), "\n            "), "\n        " ];
  }), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dash_min.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/dash_min/dash_min.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./dash_min.html"));
Template.dash_min.events({
  'click button.questions': function (event, instance) {
    FlowRouter.go('/questions');
  },
  'click button.learnshare': function (event, instance) {
    FlowRouter.go('/learnShareList');
  },
  'click button.user-segments': function (event, instance) {
    FlowRouter.go('/userSegments');
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"home":{"home.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/home/home.html                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.home.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.home.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/home/template.home.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("App_home");
Template["App_home"] = new Template("Template.App_home", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container questions"
    }, "\n        ", HTML.DIV({
      class: "jumbotron"
    }, "\n            ", Blaze._TemplateWith(function() {
      return {
        source: Spacebars.call("questions")
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_feedback"));
    }), "\n            ", Spacebars.include(view.lookupTemplate("questions")), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"home.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/home/home.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./home.html"));
module.watch(require("../../components/questions/questions.js"));
module.watch(require("../../components/personality/personality.js"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"individual_goals":{"individual_goals.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/individual_goals/individual_goals.html                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.individual_goals.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.individual_goals.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/individual_goals/template.individual_goals.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("individual_goals");
Template["individual_goals"] = new Template("Template.individual_goals", (function() {
  var view = this;
  return [ Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container goal-list individual-goal-list"
    }, "\n        ", HTML.DIV({
      class: "row spaced title"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.H2("Goals"), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced goal-controls",
      "data-goal-id": "new"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.BUTTON({
      id: "btn-add-goal",
      class: "btn btn-primary",
      "data-txt-add": "Add a goal...",
      "data-txt-save": "Save"
    }, "Add a goal..."), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced blank-goal",
      id: "blank-goal"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", Blaze._TemplateWith(function() {
      return {
        goal: Spacebars.call(view.lookup("blankGoal")),
        users: Spacebars.call(view.lookup("userList"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("igoal_view"));
    }), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced existing-goals"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", Blaze.Unless(function() {
      return Spacebars.call(view.lookup("goalReload"));
    }, function() {
      return [ "\n                    ", Blaze.If(function() {
        return Spacebars.call(view.lookup("ownList"));
      }, function() {
        return [ "\n                        ", HTML.H3("Personal"), "\n                        ", Blaze.If(function() {
          return Spacebars.dataMustache(view.lookup("hasGoalsTeam"), "");
        }, function() {
          return [ "\n                            ", Blaze.Each(function() {
            return {
              _sequence: Spacebars.dataMustache(view.lookup("individualGoalsTeam"), ""),
              _variable: "goal"
            };
          }, function() {
            return [ "\n                                ", Blaze._TemplateWith(function() {
              return {
                goal: Spacebars.call(view.lookup("goal"))
              };
            }, function() {
              return Spacebars.include(view.lookupTemplate("igoal_view"));
            }), "\n                            " ];
          }), "\n                        " ];
        }, function() {
          return "\n                            No goals yet\n                        ";
        }), "\n                    " ];
      }), "\n                    ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teamList")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                        ", HTML.H3(Blaze.View("lookup:team.Name", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
        })), "\n                        ", Blaze.If(function() {
          return Spacebars.dataMustache(view.lookup("hasGoalsTeam"), Spacebars.dot(view.lookup("team"), "_id"));
        }, function() {
          return [ "\n                            ", Blaze.Each(function() {
            return {
              _sequence: Spacebars.dataMustache(view.lookup("individualGoalsTeam"), Spacebars.dot(view.lookup("team"), "_id")),
              _variable: "goal"
            };
          }, function() {
            return [ "\n                                ", Blaze._TemplateWith(function() {
              return {
                goal: Spacebars.call(view.lookup("goal"))
              };
            }, function() {
              return Spacebars.include(view.lookupTemplate("igoal_view"));
            }), "\n                            " ];
          }), "\n                        " ];
        }, function() {
          return "\n                            No goals yet\n                        ";
        }), "\n                    " ];
      }), "\n                " ];
    }), "\n            "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  }), HTML.Raw('\n\n    <div class="modal fade" id="goal-modal-new">\n        <div class="modal-dialog modal-lg" role="document">\n          <div class="modal-content">\n            <div class="modal-header">\n              <h5 class="modal-title">New Sub Goal</h5>\n            </div>\n            <div class="modal-body">\n            </div>\n          </div>\n        </div>\n    </div>\n    '), HTML.DIV({
    class: "modal fade",
    id: "goal-modal-sub"
  }, "\n        ", HTML.DIV({
    class: "modal-dialog modal-lg",
    role: "document"
  }, "\n          ", HTML.DIV({
    class: "modal-content"
  }, "\n            ", HTML.Raw('<div class="modal-header">\n              <h5 class="modal-title">View/Edit Sub Goal</h5>\n            </div>'), "\n            ", HTML.DIV({
    class: "modal-body"
  }, "\n                ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasSubgoalView"));
  }, function() {
    return [ "\n                  ", Blaze._TemplateWith(function() {
      return {
        goal: Spacebars.call(view.lookup("subgoal"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("igoal_view"));
    }), "\n                " ];
  }), "\n            "), "\n          "), "\n        "), "\n    ") ];
}));

Template.__checkName("igoal_view");
Template["igoal_view"] = new Template("Template.igoal_view", (function() {
  var view = this;
  return HTML.DIV({
    class: function() {
      return [ "team-goal ", Spacebars.mustache(view.lookup("collapsed"), Spacebars.dot(view.lookup("goal"), "parentId")) ];
    },
    "data-goal-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id"));
    },
    id: function() {
      return [ "div-goal-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, HTML.Raw('\n        <!-- <form id="form-goal-{{goal._id}}"> -->\n        '), HTML.DIV({
    class: function() {
      return [ "progress pct-", Spacebars.mustache(view.lookup("progressPct")) ];
    },
    "data-pct": function() {
      return Spacebars.mustache(view.lookup("progressPct"));
    }
  }, "\n            ", HTML.DIV({
    class: "progress-bar",
    role: "progressbar",
    style: function() {
      return [ "width: ", Spacebars.mustache(view.lookup("progressPct")), "%;" ];
    },
    "aria-valuenow": function() {
      return Spacebars.mustache(view.lookup("progressPct"));
    },
    "aria-valuemin": "0",
    "aria-valuemax": "100"
  }, Blaze.View("lookup:progressPct", function() {
    return Spacebars.mustache(view.lookup("progressPct"));
  }), "%"), "\n        "), "\n        ", HTML.DIV({
    class: "row summary-row"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10 collapsed-summary"
  }, "\n                ", HTML.SPAN({
    class: "team-goal-title"
  }, Blaze.View("lookup:goal.title", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
  })), "\n                ", HTML.SPAN({
    class: "collapsed-description"
  }, Blaze.View("lookup:goal.description", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "description"));
  })), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-10 expanded-summary"
  }, "\n                ", HTML.SPAN({
    class: "team-goal-title"
  }, HTML.INPUT(HTML.Attrs({
    type: "text",
    id: function() {
      return [ "goal-title-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "flat form-control goal-title",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
    },
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter goal title...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "title");
  }))), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-2 text-right btn-group-xs"
  }, "\n                ", HTML.Raw('<button class="btn btn-success btn-save glyphicon glyphicon-ok details" disabled="" alt="Save changes"></button>'), "\n                ", HTML.Raw('<button class="btn btn-warning btn-cancel glyphicon glyphicon-remove details" disabled="" alt="Discard changes"></button>'), "\n                ", HTML.BUTTON({
    class: "btn btn-primary btn-expand glyphicon glyphicon-chevron-down",
    id: function() {
      return [ "btn-expand-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }), "\n            "), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10"
  }, "\n                ", HTML.DIV({
    class: "team-goal-description"
  }, "\n                    ", HTML.TEXTAREA(HTML.Attrs({
    id: function() {
      return [ "goal-description-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "flat form-control goal-description",
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter goal description...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "description");
  }, {
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "description"));
    }
  })), "\n                "), "\n            "), "\n            ", HTML.Raw('<div class="col-sm-2 text-right">\n            </div>'), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-6"
  }, "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        ", HTML.LABEL({
    for: function() {
      return [ "select-team-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "Team"), "\n                        ", HTML.SELECT({
    class: "form-control",
    id: function() {
      return [ "select-team-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "\n                            ", Blaze.If(function() {
    return Spacebars.call(view.lookup("ownList"));
  }, function() {
    return [ "\n                                ", HTML.OPTION({
      value: ""
    }, "(personal)"), "\n                            " ];
  }), "\n                            ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("teamList")),
      _variable: "team"
    };
  }, function() {
    return [ "\n                                ", HTML.OPTION(HTML.Attrs({
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
      }
    }, function() {
      return Spacebars.attrMustache(view.lookup("teamSelected"), Spacebars.dot(view.lookup("team"), "_id"));
    }), Blaze.View("lookup:team.Name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
    })), "\n                            " ];
  }), "\n                        "), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        ", HTML.LABEL({
    for: function() {
      return [ "select-privacy-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "Privacy"), "\n                        ", HTML.SELECT({
    class: "form-control",
    id: function() {
      return [ "select-privacy-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "\n                            ", Blaze.If(function() {
    return Spacebars.call(view.lookup("ownList"));
  }, function() {
    return [ "\n                                ", HTML.OPTION(HTML.Attrs({
      value: "private"
    }, function() {
      return Spacebars.attrMustache(view.lookup("privacySelected"), "private");
    }), "Private"), "\n                            " ];
  }), "\n                            ", HTML.OPTION(HTML.Attrs({
    value: "team"
  }, function() {
    return Spacebars.attrMustache(view.lookup("privacySelected"), "team");
  }), "Team"), "\n                            ", HTML.OPTION(HTML.Attrs({
    value: "public"
  }, function() {
    return Spacebars.attrMustache(view.lookup("privacySelected"), "public");
  }), "Public"), "\n                        "), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-6"
  }, "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-4 text-right"
  }, "\n                        ", HTML.LABEL({
    for: function() {
      return [ "input-start-date-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "Start"), "\n                    "), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-start-date-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "startDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "startDate");
  })), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.Raw('<div class="col-sm-4 text-right">\n                        Due\n                    </div>'), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-date-due-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "dueDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "dueDate");
  })), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.Raw('<div class="col-sm-4 text-right">\n                        Review\n                    </div>'), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-date-review-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "reviewDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "reviewDate");
  })), "\n                    "), "\n                "), "\n                ", Blaze.Unless(function() {
    return Spacebars.dataMustache(view.lookup("isNew"), Spacebars.dot(view.lookup("goal"), "_id"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-4 text-right"
    }, "\n                        Completed\n                    "), "\n                    ", HTML.DIV({
      class: "col-sm-8"
    }, "\n                        ", HTML.INPUT(HTML.Attrs({
      id: function() {
        return [ "input-date-reached-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      type: "text",
      class: "form-control flat date",
      value: function() {
        return Spacebars.mustache(view.lookup("dateField"), "reachedDate");
      }
    }, function() {
      return Spacebars.attrMustache(view.lookup("fldEnabled"), "reachedDate");
    })), "\n                    "), "\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n\n        ", HTML.DIV({
    class: "row spaced comments details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-6 goal-comments"
  }, "\n                ", HTML.Raw("<h3>Comments</h3>"), "\n                ", HTML.DIV("\n                    ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.dataMustache(view.lookup("goalComments"), Spacebars.dot(view.lookup("goal"), "_id")),
      _variable: "comment"
    };
  }, function() {
    return [ "\n                    ", HTML.DIV({
      class: "goal-comment-outer"
    }, "\n                        ", HTML.DIV({
      class: "goal-comment-header row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:getUserName", function() {
      return Spacebars.mustache(view.lookup("getUserName"), Spacebars.dot(view.lookup("comment"), "userId"));
    }), "\n                                ", HTML.DIV({
      class: "float-right"
    }, "\n                                    ", Blaze.View("lookup:formatDate", function() {
      return Spacebars.mustache(view.lookup("formatDate"), Spacebars.dot(view.lookup("comment"), "date"));
    }), "\n                                "), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "goal-comment row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:comment.text", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "text"));
    }), "\n                            "), "\n                        "), "\n                    "), "\n                    " ];
  }), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced comment-add details"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        ", HTML.DIV({
    class: "row spaced"
  }, "\n                            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                                ", HTML.TEXTAREA({
    id: function() {
      return [ "new-comment-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "new-comment form-control"
  }), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
    class: "row spaced"
  }, "\n                            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                                ", HTML.BUTTON({
    id: function() {
      return [ "btn-comment-add-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "btn btn-primary btn-comment-add",
    alt: "Add comment"
  }, HTML.Raw('<span class="glyphicon glyphicon-pencil"></span>'), " Add comment"), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-6 review-comments"
  }, "\n                ", HTML.Raw("<h3>Reviews</h3>"), "\n                ", HTML.DIV("\n                    ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.dataMustache(view.lookup("reviewComments"), Spacebars.dot(view.lookup("goal"), "_id")),
      _variable: "comment"
    };
  }, function() {
    return [ "\n                    ", HTML.DIV({
      class: "goal-comment-outer"
    }, "\n                        ", HTML.DIV({
      class: "goal-comment-header row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:getUserName", function() {
      return Spacebars.mustache(view.lookup("getUserName"), Spacebars.dot(view.lookup("comment"), "userId"));
    }), "\n                                ", HTML.DIV({
      class: "float-right"
    }, "\n                                    ", Blaze.View("lookup:formatDate", function() {
      return Spacebars.mustache(view.lookup("formatDate"), Spacebars.dot(view.lookup("comment"), "date"));
    }), "\n                                "), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "goal-comment row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:comment.text", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "text"));
    }), "\n                            "), "\n                        "), "\n                    "), "\n                    " ];
  }), "\n                "), "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "reviewComments");
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced comment-add details"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.DIV({
      class: "row spaced"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", HTML.TEXTAREA({
      id: function() {
        return [ "new-review-comment-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      class: "new-review-comment form-control"
    }), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "row spaced"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", HTML.BUTTON({
      id: function() {
        return [ "btn-review-comment-add-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      class: "btn btn-primary btn-review-comment-add",
      alt: "Add comment"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-pencil"
    }), " Add comment"), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "subgoals");
  }, function() {
    return [ "\n        ", HTML.DIV({
      class: "row spaced details subgoal-add"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.BUTTON({
      class: "btn btn-primary btn-sm btn-add-subgoal",
      alt: "Add subgoal"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-th-list"
    }), " Add subgoal"), "\n            "), "\n        "), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasChildren"));
  }, function() {
    return [ "\n        ", HTML.DIV({
      class: "row spaced details subgoals"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.DIV({
      class: "team-goal-children"
    }, "\n                    ", HTML.UL("\n                        ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("childGoals")),
        _variable: "childGoal"
      };
    }, function() {
      return [ "\n                        ", HTML.LI("\n                            ", Blaze._TemplateWith(function() {
        return {
          goal: Spacebars.call(view.lookup("childGoal"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("child_igoal_view"));
      }), "\n                        "), "\n                        " ];
    }), "\n                    "), "\n                "), "\n            "), "\n        "), "\n        " ];
  }), HTML.Raw("\n        <!-- </form> -->\n    "));
}));

Template.__checkName("child_igoal_view");
Template["child_igoal_view"] = new Template("Template.child_igoal_view", (function() {
  var view = this;
  return [ HTML.DIV({
    class: "team-goal-title",
    "data-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id"));
    }
  }, Blaze.View("lookup:goal.title", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
  })), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasChildren"));
  }, function() {
    return [ "\n    ", HTML.UL("\n        ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("childGoals")),
        _variable: "childGoal"
      };
    }, function() {
      return [ "\n        ", HTML.LI("\n            ", Blaze._TemplateWith(function() {
        return {
          goal: Spacebars.call(view.lookup("childGoal"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("child_igoal_view"));
      }), "\n        "), "\n        " ];
    }), "\n    "), "\n    " ];
  }) ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"individual_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/individual_goals/individual_goals.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 1);
var Team;
module.watch(require("/imports/api/teams/teams.js"), {
  Team: function (v) {
    Team = v;
  }
}, 2);
var IndividualGoal;
module.watch(require("/imports/api/individual_goals/individual_goals.js"), {
  IndividualGoal: function (v) {
    IndividualGoal = v;
  }
}, 3);
module.watch(require("./individual_goals.html"));
module.watch(require("/imports/ui/components/select_autocomplete/select_autocomplete.js"));
var BLANK_GOAL = {
  _id: "new",
  title: "",
  description: ""
};

var _hasSubgoalView = new ReactiveVar(false);

var _subgoalId = new ReactiveVar("");

Template.individual_goals.onCreated(function () {
  var _this = this;

  if (FlowRouter.getParam('userId')) {
    this.userId = FlowRouter.getParam('userId');
  } else {
    this.userId = Meteor.userId();
  }

  Session.set("goal_user_id", this.userId);
  Session.set("goalReload", false);
  this.userSubscriptionReady = new ReactiveVar(false);
  this.autorun(function () {
    _this.modalGoalId = FlowRouter.getParam('goalId');

    if ("undefined" !== typeof _this.modalGoalId && "" !== _this.modalGoalId) {
      _hasSubgoalView.set(true);

      _subgoalId.set(FlowRouter.getParam('goalId'));

      $("body").on("hidden.bs.modal", "#goal-modal-sub", function () {
        _hasSubgoalView.set(false);

        _subgoalId.set("");

        FlowRouter.go("/individualGoals/" + FlowRouter.getParam('teamName'));
      });
      Meteor.setTimeout(function () {
        $("#goal-modal-sub").modal("show");
        $("#goal-modal-sub").find("div.team-goal").removeClass("collapsed");
      }, 1000);
    }

    _this.subscription = _this.subscribe('individualGoalsData', getUserId(), {
      onStop: function () {
        console.log("Team Goals subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Team Goals subscription ready! ", arguments, this);
      }
    });
    _this.subscription2 = _this.subscribe('userList', Meteor.userId(), {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
    _this.subscription3 = _this.subscribe('teamsMemberOfList', getUserId(), {
      onStop: function () {
        console.log("Team Member Of List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Team Member Of List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
  });
});
Template.individual_goals.onRendered(function () {
  Meteor.setTimeout(function () {
    $("input.date").datetimepicker({
      format: 'YYYY-MM-DD',
      useCurrent: false,
      showClear: true,
      showClose: true
    });
  }, 1000);
  $("body").on("hidden.bs.modal", "#goal-modal-new", function () {
    $newgoal = $("#div-goal-new").detach();
    $newgoal.data("parent-id", "");
    $("#blank-goal").find(".col-sm-12").append($newgoal);
  });
});

var resetNewGoalForm = function () {
  var valInputs = ["goal-title-new", "goal-description-new", "input-date-due-new", "input-date-review-new", "input-date-reached-new"];

  for (var i = 0; i < valInputs.length; i++) {
    $("#" + valInputs[i]).val("");
  }
};

function saveGoal(goalId) {
  var saveObj = {
    title: $("#goal-title-" + goalId).val(),
    description: $("#goal-description-" + goalId).val(),
    userId: getUserId(),
    teamId: $("#select-team-" + goalId).val(),
    privacy: $("#select-privacy-" + goalId).val()
  };
  var startDate = $("#input-start-date-" + goalId).val();

  if ("" !== startDate) {
    saveObj.startDate = new Date(startDate);
  }

  var dueDate = $("#input-date-due-" + goalId).val();

  if ("" !== dueDate) {
    saveObj.dueDate = new Date(dueDate);
  }

  var rvwDate = $("#input-date-review-" + goalId).val();

  if ("" !== rvwDate) {
    saveObj.reviewDate = new Date(rvwDate);
  }

  if (goalId === BLANK_GOAL._id) {
    var parentId = $("#div-goal-new").data("parent-id");

    if ("" !== parentId) {
      saveObj.parentId = parentId;
    }

    Meteor.call('individualgoals.createNewGoal', saveObj, function (err, rslt) {
      console.log(err, rslt);
    });
  } else {
    var g = IndividualGoal.findOne({
      _id: goalId
    });
    var reviewedOnDate = $("#input-date-reviewed-on-" + goalId).val();

    if ("" !== reviewedOnDate) {
      saveObj.reviewedOnDate = new Date(reviewedOnDate);
    }

    var reachedDate = $("#input-date-reached-" + goalId).val();

    if ("" !== reachedDate) {
      saveObj.reachedDate = new Date(reachedDate);
    }

    g.updateFromObj(saveObj);
  }
}

function goalChanged($g) {
  $g.find(".btn-save").prop("disabled", false);
  $g.find(".btn-cancel").prop("disabled", false);
}

function goalUnchanged($g) {
  $g.find(".btn-save").prop("disabled", true);
  $g.find(".btn-cancel").prop("disabled", true);
  $g.find(".changed").removeClass("changed");
}

Template.individual_goals.events({
  'change input.flat,textarea.flat': function (event, instance) {
    $(event.target).addClass('changed');
    var $goal = $(event.target).closest("[data-goal-id]");

    if ($goal) {
      if ($("#goal-title-" + $goal.data("goal-id")).val() != "") {//
      }
    }
  },
  'change input,textarea,select': function (event, instance) {
    var $t = $(event.target);
    var $goal = $(event.target).closest("[data-goal-id]");
    goalChanged($goal);
  },
  'keyup input,textarea': function (event, instance) {
    var $t = $(event.target);
    var $goal = $(event.target).closest("[data-goal-id]");
    goalChanged($goal);
  },
  'click button.btn-save': function (event, instance) {
    var $t = $(event.target);
    var goalId = $t.closest("[data-goal-id]").data("goal-id");
    saveGoal(goalId);
    goalUnchanged($("#div-goal-" + goalId));
    $modalParent = $t.closest(".modal");

    if ($modalParent.length) {
      $modalParent.modal('hide');
      $newgoal = $("#div-goal-new").detach();
      $newgoal.data("parent-id", "");
      $("#blank-goal").find(".col-sm-12").html($newgoal);
    }

    if (goalId == BLANK_GOAL._id) {
      resetNewGoalForm();

      if (!$modalParent.length) {
        $(".goal-controls").show();
        $("#blank-goal").slideUp();
      }
    }
  },
  'click button.btn-add-subgoal': function (event, instance) {
    var parentId = $(event.target).closest("[data-goal-id]").data("goal-id");
    $newgoal = $("#div-goal-new").detach();
    $newgoal.data("parent-id", parentId);
    $newgoal.find(".btn-cancel").attr("disabled", false);
    $("#goal-modal-new").find(".modal-body").append($newgoal);
    $("#goal-modal-new").modal("show");
    $("#goal-modal-new").find("div.team-goal").removeClass("collapsed");
  },
  'click button.btn-cancel': function (event, instance) {
    var $t = $(event.target);
    var goalId = $t.closest("[data-goal-id]").data("goal-id");
    $modalParent = $t.closest(".modal");

    if ($modalParent.length) {
      $modalParent.modal('hide');
      $newgoal = $("#div-goal-new").detach();
      $newgoal.data("parent-id", "");
      $("#blank-goal").find(".col-sm-12").append($newgoal);
    }

    if (goalId == BLANK_GOAL._id) {
      resetNewGoalForm();

      if (!$modalParent.length) {
        $(".goal-controls").show();
        $("#blank-goal").slideUp();
      }
    } else {
      //forces a reload from the database
      Session.set("goalReload", true);
      Meteor.setTimeout(function () {
        Session.set("goalReload", false);
      }, 100);
    }
  },
  'click button.btn-comment-add': function (event, instance) {
    $btnAdd = $(event.target);
    var goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
    var $comment = $("#new-comment-" + goalId);
    var newComment = $comment.val();
    var g = IndividualGoal.findOne({
      _id: goalId
    });
    g.addComment(newComment);
    $comment.val("");
  },
  'click button.btn-review-comment-add': function (event, instance) {
    $btnAdd = $(event.target);
    var goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
    var $comment = $("#new-review-comment-" + goalId);
    var newComment = $comment.val();
    var g = IndividualGoal.findOne({
      _id: goalId
    });
    g.addReviewComment(newComment);
    $comment.val("");
  },
  'click button#btn-add-goal': function (event, instance) {
    var $btnAdd = $(event.target);
    $goal = $btnAdd.closest("[data-goal-id]");
    var goalId = $goal.data("goal-id");
    $(".goal-controls").hide();
    var $btnCancel = $("#blank-goal").find(".btn-cancel");
    $btnCancel.prop("disabled", false);
    $(".team-goal[data-goal-id=" + goalId + "]").removeClass("collapsed");
    $("#blank-goal").slideDown();
    $("#btn-add-cancel").fadeIn();
  },
  'click button#btn-add-cancel': function (event, instance) {
    $("#blank-goal").slideUp();
    $("#btn-add-cancel").fadeOut();
  },
  'click button.btn-expand,div.collapsed-summary': function (event, instance) {
    var $target = $(event.target);
    var $goalContainer = $target.closest("[data-goal-id]");
    var $targetExpandBtn = $goalContainer.find(".btn-expand.glyphicon");
    $targetExpandBtn.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");

    if ($goalContainer.hasClass("collapsed")) {
      $(".team-goal[data-goal-id]:not(.collapsed)").slideUp(function () {
        $(this).addClass("collapsed").css("display", "block");
      });
      $goalContainer.css("display", "none").removeClass("collapsed").slideDown(function () {
        $('html, body').animate({
          scrollTop: $goalContainer.offset().top
        }, 500);
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-down");
      $targetExpandBtn.addClass("glyphicon-chevron-up");
    } else {
      $goalContainer.slideUp(function () {
        $goalContainer.addClass("collapsed").css("display", "block");
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-up");
      $targetExpandBtn.addClass("glyphicon-chevron-down");
    }
  },
  'keyup textarea.goal-description,input.goal-title': _.debounce(function (event, instance) {
    var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

    if ("new" === goalId) {
      //don't auto-save if creating a new goal
      return;
    }

    saveGoal(goalId);
    goalUnchanged($("#div-goal-" + goalId));
  }, 2000),
  'change input,select': _.debounce(function (event, instance) {
    if (!Session.get("saving")) {
      var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

      if ("new" === goalId) {
        //don't auto-save if creating a new goal
        return;
      }

      saveGoal(goalId);
      goalUnchanged($("#div-goal-" + goalId));
    }
  }, 2000),
  'dp.change': _.debounce(function (event, instance) {
    if (!Session.get("saving")) {
      var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

      if ("new" === goalId) {
        //don't auto-save if creating a new goal
        return;
      }

      saveGoal(goalId);
      goalUnchanged($("#div-goal-" + goalId));
    }
  }, 2000),
  'click div.team-goal-title[data-id]': function (event, instance) {
    _hasSubgoalView.set(true);

    var gid = $(event.target).data("id");

    _subgoalId.set(gid);

    FlowRouter.go("/individualGoals/" + FlowRouter.getParam('teamName') + "/" + gid);
    $("#goal-modal-sub").prop("disabled", false).modal("show");
  }
});

function getUserId() {
  return Session.get("goal_user_id");
}

Template.individual_goals.helpers({
  goalReload: function () {
    return Session.get("goalReload");
  },
  hasGoals: function () {
    var uid = getUserId();
    var g = IndividualGoal.find({
      userId: uid,
      parentId: ''
    }).fetch();
    return g.length > 0;
  },
  hasGoalsTeam: function (tid) {
    var uid = getUserId();
    var g = IndividualGoal.find({
      userId: uid,
      parentId: '',
      teamId: tid
    }).fetch();
    return g.length > 0;
  },
  individualGoals: function () {
    var uid = getUserId();
    var g = IndividualGoal.find({
      userId: uid,
      parentId: ''
    }).fetch();
    return g;
  },
  individualGoalsTeam: function (tid) {
    var uid = getUserId();
    var g = IndividualGoal.find({
      userId: uid,
      parentId: '',
      teamId: tid
    }).fetch();
    return g;
  },
  ownList: function () {
    //check to see if the user logged in is the owner of the goals currently displayed
    return Meteor.userId() === getUserId();
  },
  blankGoal: function () {
    return Object.assign({
      userId: getUserId()
    }, BLANK_GOAL);
  },
  hasSubgoalView: function () {
    var hasView = _hasSubgoalView.get();

    var gid = _subgoalId.get();

    if (hasView) {
      return true;
    } else {
      return false;
    }
  },
  subgoal: function () {
    var hasView = _hasSubgoalView.get();

    var subgoalId = Template.instance().modalGoalId;
    subgoalId = _subgoalId.get();
    var g = IndividualGoal.findOne({
      _id: subgoalId
    });

    if (g) {
      return g;
    } else {
      return {};
    }
  },
  goalComments: function (goalId) {
    var g = IndividualGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.goalComments;
    return c;
  },
  reviewComments: function (goalId) {
    var g = IndividualGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.reviewComments;
    return c;
  },
  formatDate: function (dateObj) {
    return dateObj.toLocaleDateString();
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    if (!u) return "";
    var fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
    return fullName;
  },
  userList: function () {
    var list = [{
      id: 1,
      name: "George"
    }, {
      id: 2,
      name: "Frank"
    }];
    return list;
  },
  teamList: function () {
    //list of teams the user is a member of
    var t = Team.find({
      Members: getUserId()
    });

    if (!t) {
      return [];
    }

    return t.fetch();
  }
}); //Template.igoal_view.onRendered(function () {
//});

Template.igoal_view.helpers({
  childGoals: function () {
    var goalId = Template.instance().data.goal._id;

    var children = IndividualGoal.find({
      parentId: goalId
    }).fetch();
    return children;
  },
  hasChildren: function () {
    var goalId = Template.instance().data.goal._id;

    var doesHave = IndividualGoal.find({
      parentId: goalId
    }).fetch().length > 0;
    return doesHave;
  },
  goalComments: function (goalId) {
    if (goalId === BLANK_GOAL._id) {
      return;
    }

    var g = IndividualGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.goalComments;
    return c;
  },
  reviewComments: function (goalId) {
    if (goalId === BLANK_GOAL._id) {
      return;
    }

    var g = IndividualGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.reviewComments;
    return c;
  },
  formatDate: function (dateObj) {
    return dateObj.toLocaleDateString();
  },
  dateField: function (fld) {
    var goal = Template.instance().data.goal;

    if (goal._id == BLANK_GOAL._id) {
      return "";
    }

    var d = goal[fld];

    if (!(d instanceof Date)) {
      return "";
    }

    var dateText = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
    return dateText;
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    if (!u) return "";
    var fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
    return fullName;
  },
  userList: function () {
    var userList = [];
    User.find({}).forEach(function (user) {
      userList.push({
        text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
        value: user._id
      });
    });
    return userList;
  },
  progressPct: function () {
    var goal = Template.instance().data.goal;
    var g = IndividualGoal.findOne({
      _id: goal._id
    });
    if (!g) return 0;

    if (!g.dueDate || !g.startDate || "undefined" === typeof g.dueDate || "undefined" === typeof g.startDate) {
      return 0;
    }

    var currDt = new Date().getTime();
    var totalDuration = g.dueDate.getTime() - g.startDate.getTime();
    var timeSinceStart = currDt - g.startDate.getTime();
    var pct = timeSinceStart / totalDuration;
    return Math.min(parseInt(pct * 100), 100);
  },
  ownList: function () {
    //check to see if the user logged in is the owner of the goals currently displayed
    return Meteor.userId() === getUserId();
  },
  userHasModifyPerm: function (fld) {
    var goal = Template.instance().data.goal;
    var g = IndividualGoal.findOne({
      _id: goal._id
    });
    if (!g) return true;
    return g.hasModifyPerm(fld);
  },
  fldEnabled: function (fld) {
    var goal = Template.instance().data.goal;
    var g = IndividualGoal.findOne({
      _id: goal._id
    });

    if (!g) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', goal.teamName)) {
        return "";
      } else {
        return "disabled";
      }
    }

    if (g.hasModifyPerm(fld)) {
      return "";
    } else {
      return "disabled";
    }
  },
  isNew: function (id) {
    return BLANK_GOAL._id === id;
  },
  teamList: function () {
    //list of teams the user is a member of
    var t = Team.find();

    if (!t) {
      return [];
    }

    return t.fetch();
  },
  teamSelected: function (teamId) {
    var goal = Template.instance().data.goal;
    var g = IndividualGoal.findOne({
      _id: goal._id
    });

    if (!g) {
      return;
    }

    if (g.teamId === teamId) {
      return "selected";
    } else {
      return "";
    }
  },
  privacySelected: function (privVal) {
    var goal = Template.instance().data.goal;
    var g = IndividualGoal.findOne({
      _id: goal._id
    });

    if (!g) {
      return;
    }

    if (g.privacy === privVal) {
      return "selected";
    } else {
      return "";
    }
  },
  collapsed: function (pid) {
    //if this goal has a parent it is being displayed in a modal and should not be collapsed
    if ("" !== pid) {
      return "";
    } else {
      return "collapsed";
    }
  }
});
Template.child_igoal_view.helpers({
  childGoals: function () {
    var goalId = Template.instance().data.goal._id;

    var children = IndividualGoal.find({
      parentId: goalId
    }).fetch();
    return children;
  },
  hasChildren: function (goalId) {
    goalId = Template.instance().data.goal._id;
    var doesHave = IndividualGoal.find({
      parentId: goalId
    }).count() > 0;
    return doesHave;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"learn_share":{"learn_share.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share/learn_share.html                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.learn_share.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.learn_share.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share/template.learn_share.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("learn_share");
Template["learn_share"] = new Template("Template.learn_share", (function() {
  var view = this;
  return [ Blaze.If(function() {
    return Spacebars.call(view.lookup("canEditAdmin"));
  }, function() {
    return [ "\n        ", HTML.SCRIPT({
      src: "https://swx.cdn.skype.com/shared/v/1.2.15/SkypeBootstrap.min.js"
    }), "\n    " ];
  }), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container",
      "data-lssid": function() {
        return Spacebars.mustache(view.lookup("lssid"));
      }
    }, "\n        ", Blaze.Unless(function() {
      return Spacebars.call(view.lookup("currentUser"));
    }, function() {
      return [ "\n            ", Blaze.If(function() {
        return Spacebars.call(view.lookup("sessionActive"));
      }, function() {
        return [ "\n                ", HTML.DIV({
          class: "row spaced"
        }, "\n                    ", HTML.DIV({
          class: "label label-info"
        }, "You are participating as ", HTML.SPAN({
          class: "guest-name",
          id: "guest-name-edit",
          "data-toggle": "modal",
          "data-target": "#modal-edit-name"
        }, Blaze.View("lookup:guestName", function() {
          return Spacebars.mustache(view.lookup("guestName"));
        }), " ", HTML.SPAN({
          class: "glyphicon glyphicon-edit"
        }))), "\n                "), "\n            " ];
      }), "\n        " ];
    }), "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-10"
    }, "\n                ", HTML.H1("Learn", HTML.IMG({
      src: "/img/DeveloperLevel_icon_bg.png",
      class: "dl-icon"
    }), "Share"), "\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("teamId"));
    }, function() {
      return [ "\n                    ", HTML.H1(Blaze._TemplateWith(function() {
        return {
          team: Spacebars.call(view.lookup("team"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("team_icon"));
      }), " ", Blaze.View("lookup:teamName", function() {
        return Spacebars.mustache(view.lookup("teamName"));
      })), "\n                " ];
    }), "\n                ", HTML.DIV("Session title"), "\n                ", HTML.DIV("\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEditAdmin"));
    }, function() {
      return [ "\n                    ", HTML.INPUT({
        class: "form-control input-lg flat",
        value: function() {
          return Spacebars.mustache(view.lookup("title"));
        },
        id: "input-title"
      }), "\n                " ];
    }, function() {
      return [ "\n                    ", HTML.H2(Blaze.View("lookup:title", function() {
        return Spacebars.mustache(view.lookup("title"));
      })), "\n                " ];
    }), "\n                "), "\n            "), "\n            ", HTML.DIV({
      class: "col-sm-2 text-right"
    }, "\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("sessionActive"));
    }, function() {
      return [ "\n                    ", HTML.DIV({
        class: "label label-info"
      }, HTML.A({
        href: "#",
        id: "lockSession"
      }, HTML.SPAN({
        class: "glyphicon glyphicon-lock"
      }, " Active"))), "\n                " ];
    }, function() {
      return [ "\n                    ", HTML.DIV({
        class: "label label-warning"
      }, HTML.A({
        href: "#",
        id: "unlockSession"
      }, HTML.SPAN({
        class: "glyphicon glyphicon-lock"
      }, " Locked"))), "\n                " ];
    }), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-6"
    }, "\n                Skype URL:\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEditAdmin"));
    }, function() {
      return [ "\n                    ", Blaze.If(function() {
        return Spacebars.call(view.lookup("skypeUrl"));
      }, function() {
        return [ "\n                        ", HTML.SPAN({
          id: "span-create-skype",
          style: "display:none;"
        }, "(", HTML.A({
          href: "#",
          id: "a-create-call"
        }, "Create skype meeting"), ")"), "\n                        ", HTML.A({
          id: "a-skype-url",
          href: function() {
            return Spacebars.mustache(view.lookup("skypeUrl"));
          },
          target: "_blank"
        }, Blaze.View("lookup:skypeUrl", function() {
          return Spacebars.mustache(view.lookup("skypeUrl"));
        })), " ", HTML.A({
          id: "a-skype-url-edit",
          href: "#"
        }, HTML.SPAN({
          class: "glyphicon glyphicon-edit"
        })), "\n                        ", HTML.INPUT({
          type: "text",
          id: "input-skype-url",
          class: "form-control",
          value: function() {
            return Spacebars.mustache(view.lookup("skypeUrl"));
          },
          style: "display:none"
        }), "\n                    " ];
      }, function() {
        return [ "\n                        ", HTML.SPAN({
          id: "span-create-skype"
        }, "(", HTML.A({
          href: "#",
          id: "a-create-call"
        }, "Create skype meeting"), ")"), "\n                        ", HTML.INPUT({
          type: "text",
          id: "input-skype-url",
          class: "form-control"
        }), "\n                    " ];
      }), "\n                " ];
    }, function() {
      return [ "\n                    ", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("skypeUrl"));
        },
        target: "_blank"
      }, Blaze.View("lookup:skypeUrl", function() {
        return Spacebars.mustache(view.lookup("skypeUrl"));
      })), "\n                " ];
    }), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-4"
    }, "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        Participants\n                    "), "\n                "), "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.DIV({
      class: "control-group"
    }, "\n                            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEdit"));
    }, function() {
      return [ "\n                                ", Blaze._TemplateWith(function() {
        return {
          id: Spacebars.call("select-participants"),
          id2: Spacebars.call(""),
          name: Spacebars.call("participants[]"),
          placeholder: Spacebars.call("Choose session participants..."),
          list: Spacebars.call(view.lookup("userAddList")),
          selected: Spacebars.call(view.lookup("sessionParticipantItems")),
          onItemRemove: Spacebars.call(view.lookup("itemRemoveHandler")),
          onItemAdd: Spacebars.call(view.lookup("itemAddHandler")),
          create: Spacebars.call("1")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("select_autocomplete"));
      }), "\n                            " ];
    }, function() {
      return [ "\n                                ", Blaze._TemplateWith(function() {
        return {
          items: Spacebars.call(view.lookup("sessionParticipantItems")),
          labelType: Spacebars.call("label-warning")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("label_list"));
      }), "\n                            " ];
    }), "\n                        "), "\n                    "), "\n                "), "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        Guests\n                    "), "\n                "), "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.DIV({
      class: "control-group"
    }, "\n                            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEdit"));
    }, function() {
      return [ "\n                                ", Blaze._TemplateWith(function() {
        return {
          id: Spacebars.call("select-guests"),
          id2: Spacebars.call(""),
          name: Spacebars.call("guests[]"),
          placeholder: Spacebars.call("Choose session guests..."),
          list: Spacebars.call(view.lookup("userAddList")),
          selected: Spacebars.call(view.lookup("sessionGuestItems")),
          onItemRemove: Spacebars.call(view.lookup("itemRemoveGuestHandler")),
          onItemAdd: Spacebars.call(view.lookup("itemAddGuestHandler")),
          create: Spacebars.call("1")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("select_autocomplete"));
      }), "\n                            " ];
    }, function() {
      return [ "\n                                ", Blaze._TemplateWith(function() {
        return {
          items: Spacebars.call(view.lookup("sessionGuestItems")),
          labelType: Spacebars.call("label-warning")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("label_list"));
      }), "\n                            " ];
    }), "\n                        "), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
      class: "col-sm-4"
    }, "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), "\n                    "), "\n                "), "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEditAdmin"));
    }, function() {
      return [ "\n                        ", HTML.DIV({
        id: "p-pick-first"
      }, "\n                            ", HTML.BUTTON({
        id: "btn-pick-first",
        class: "btn btn-primary"
      }, "Pick random presenter"), "\n                        "), "\n                        ", HTML.DIV({
        id: "p-on-deck",
        style: "display:none"
      }, "\n                            ", HTML.BUTTON({
        id: "btn-pick-again",
        class: "btn btn-primary"
      }, "Pick again"), "\n                            ", HTML.BUTTON({
        id: "btn-pick-accept",
        class: "btn btn-success"
      }, "Accept"), "\n                            ", HTML.DIV({
        id: "p-on-deck-info",
        class: "jumbotron"
      }), "\n                        "), "\n                        " ];
    }), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
      class: "col-sm-4"
    }, "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        Presenters\n                    "), "\n                "), "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.UL({
      class: "list-group",
      id: "ls-presenters"
    }, "\n                            ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("sessionPresenters")),
        _variable: "presenter"
      };
    }, function() {
      return [ "\n                            ", HTML.LI({
        class: "list-group-item",
        "data-id": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("presenter"), "id"));
        }
      }, Blaze.View("lookup:order", function() {
        return Spacebars.mustache(view.lookup("order"), view.lookup("@index"));
      }), ". ", Blaze.View("lookup:presenter.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("presenter"), "name"));
      })), "\n                            " ];
    }), "\n                        "), "\n                    "), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                Session Notes\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEdit"));
    }, function() {
      return [ "\n                    ", HTML.TEXTAREA({
        id: "input-notes",
        class: "form-control",
        rows: "10",
        value: function() {
          return Spacebars.mustache(view.lookup("notes"));
        }
      }), "\n                " ];
    }, function() {
      return [ "\n                    ", HTML.DIV({
        class: "jumbotron"
      }, HTML.PRE(Blaze.View("lookup:notes", function() {
        return Spacebars.mustache(view.lookup("notes"));
      }))), "\n                " ];
    }), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                Session Recording\n                ", Blaze.If(function() {
      return Spacebars.call(view.lookup("canEditAdmin"));
    }, function() {
      return [ "\n                    ", HTML.INPUT({
        name: "recording-upload",
        class: "file-upload-input",
        type: "file"
      }), "\n                " ];
    }), "\n                ", HTML.DIV("\n                    ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call(view.lookup("lssid"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("video_embed"));
    }), "\n                "), "\n            "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  }), "\n\n    ", HTML.DIV({
    class: "modal fade",
    id: "modal-edit-name"
  }, "\n      ", HTML.DIV({
    class: "modal-dialog modal-sm",
    role: "document"
  }, "\n        ", HTML.DIV({
    class: "modal-content"
  }, "\n          ", HTML.Raw('<div class="modal-header">\n            <h5 class="modal-title">Guest Name</h5>\n            <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n              <span aria-hidden="true">&times;</span>\n            </button>\n          </div>'), "\n          ", HTML.DIV({
    class: "modal-body"
  }, "\n            ", HTML.INPUT({
    id: "input-guest-name",
    class: "form-control input-lg",
    value: function() {
      return Spacebars.mustache(view.lookup("guestName"));
    }
  }), "\n          "), "\n          ", HTML.Raw('<div class="modal-footer">\n            <button type="button" class="btn btn-primary" id="modal-save-name">Save changes</button>\n            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\n          </div>'), "\n        "), "\n      "), "\n    ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"learn_share.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share/learn_share.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
var LearnShareSession;
module.watch(require("/imports/api/learn_share/learn_share.js"), {
  LearnShareSession: function (v) {
    LearnShareSession = v;
  }
}, 1);
var Team;
module.watch(require("/imports/api/teams/teams.js"), {
  Team: function (v) {
    Team = v;
  }
}, 2);
module.watch(require("./learn_share.html"));
module.watch(require("/imports/ui/components/label_list/label_list.js"));

var generateGuestId = function () {
  var text = "guest-";
  var idLength = 11;
  var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < idLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var app;
var client_id = '8e7e8c57-117c-454a-bf71-7ec493ab82b1';
var meeting;
var version = "appdeveloperlevel/0.59";

function initSkypeAPI() {
  console.log(sessionStorage);
  debugger;
  var hasToken = /^#access_token=/.test(location.hash) || !!sessionStorage.apiAccessToken;
  var hasError = /^#error=/.test(location.hash);

  if (!hasToken && !hasError) {
    var pathParts = location.pathname.split('/');
    sessionStorage.lastLearnShareId = pathParts[pathParts.length - 1];
    console.log(sessionStorage);
    location.assign('https://login.microsoftonline.com/common/oauth2/authorize?response_type=token' + '&client_id=' + client_id + '&redirect_uri=' + location.origin + '/learnShare' + '&resource=https://webdir.online.lync.com');
  } else {
    if (!sessionStorage.apiAccessToken) {
      var tokenresponse = parseHashParams(window.location.hash);
      sessionStorage.apiAccessToken = tokenresponse.access_token;
      window.location.hash = '#';
    }

    Skype.initialize({
      apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255',
      correlationIds: {
        sessionId: 'mySession123' // Necessary for troubleshooting requests, should be unique per session

      }
    }, function (api) {
      console.log("wwwwwwwwwwwwwwwwwwwwwww");
      app = new api.application();
      console.log(app);
      apiSignIn();
    });
  }
}

function parseHashParams(hash) {
  var params = hash.slice(1).split('&');
  var paramarray = {};
  params.forEach(function (param) {
    param = param.split('=');
    paramarray[param[0]] = param[1];
  });
  return paramarray;
}

function apiSignIn() {
  console.log(1234, app);
  var application = app; // the SDK will get its own access token

  app.signInManager.signIn({
    client_id: client_id,
    cors: true,
    redirect_uri: '/learnShare',
    origins: ["https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root"],
    version: version // Necessary for troubleshooting requests; identifies your application in our telemetry

  }).then(function (a) {
    console.log("signed in", a);
    createMeeting();
  }, function (err) {
    $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
    console.log("sign in error", err);
  });
}

function createMeeting() {
  meeting = app.conversationsManager.createMeeting();
  meeting.subject('LearnShare Meeting');
  meeting.accessLevel('Everyone');
  console.log('0', meeting);
  meeting.onlineMeetingUri.get().then(function (uri) {
    console.log('1', uri); //var conversation = app.conversationsManager.getConversationByUri(uri);
    //console.log("what?",conversation);

    var uriChunks = uri.split(':');
    var skypeUser = uriChunks[1].split(';')[0];
    var emlUser = skypeUser.split('@')[0];
    var emlDomain = skypeUser.split('@')[1];
    var mtgId = uriChunks[uriChunks.length - 1];
    var url = 'https://meet.lync.com/' + emlDomain + '/' + emlUser + '/' + mtgId;
    console.log(url);
    $("#input-skype-url").val(url);
    $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
    $("#input-skype-url").trigger("change");
  }, function (err) {
    $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
    console.log(err);
  });
}

Template.learn_share.onCreated(function () {
  var _this = this;

  this.lssid = FlowRouter.getParam('lssid');

  if (!Meteor.user()) {
    //user not logged in, treat as guest
    var gname = Session.get("guestName");

    if ("undefined" === typeof gname) {
      var gid = generateGuestId(); //Session.setPersistent("guestName", 'lurker'+gid.slice(5,10));
      //Session.setPersistent("guestId", gid);
    }
  }

  this.autorun(function () {
    console.log("autorunning learn_share...");
    _this.subscription = _this.subscribe('userList', Meteor.userId(), {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
        var userList = [];
        User.find().forEach(function (user) {
          userList.push({
            text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
            value: user._id
          });
        });
      }
    });
    console.log(_this.subscription);
    _this.subscription2 = _this.subscribe('learnShareDetails', _this.lssid, {
      onStop: function () {
        console.log("LearnShare List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("LearnShare List subscription ready! ", arguments, this);
        var lssess = LearnShareSession.findOne({
          _id: this.params[0]
        });

        if ("locked" !== lssess.state) {
          if (Meteor.user()) {
            lssess.addParticipantSelf();
            lssess = LearnShareSession.findOne({
              _id: this.params[0]
            });
            var _selectControl = $("#select-participants")[0].selectize;

            for (var i = 0; i < lssess.participants.length; i++) {
              _selectControl.addItem(lssess.participants[i].id);
            }

            for (var _i = 0; _i < lssess.presenters.length; _i++) {
              $(".item[data-value=" + lssess.presenters[_i].id + "]").addClass("picked");
            }

            if ($(".item[data-value]").not(".picked").length === 0) {
              $("#btn-pick-first").prop("disabled", true);
            } else {
              $("#btn-pick-first").prop("disabled", false);
            }
          } else {
            lssess.saveGuest(Session.get("guestId"), Session.get("guestName"));
          }
        }
      }
    });
    console.log(_this.subscription2);
    _this.subscription3 = _this.subscribe('teamsData', Meteor.userId(), {
      onStop: function () {
        console.log("teamsData subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("teamsData subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription3);
  });
});
Template.learn_share.onRendered(function () {
  Meteor.setTimeout(function () {
    if (/^#access_token=/.test(location.hash)) {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
      $("#a-skype-url-edit").trigger("click");
      Meteor.setTimeout(function () {
        $("#a-create-call").trigger("click");
      }, 500);
    }

    $('#modal-edit-name').on('shown.bs.modal', function () {
      $('#input-guest-name').focus();
    });
    $(document).on('click', '#selectize-outer-select-guests .selectize-input .item', function (event) {
      var $target = $(event.target);
      var participant = {
        id: $target.data("value"),
        name: $target.text().slice(0, -1)
      };
      var lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
      var ls = LearnShareSession.findOne({
        _id: lssid
      });

      if (!ls) {
        return;
      }

      ls.removeGuest(participant.id);
      ls.addParticipant(participant);
    });
    $(document).on('click', '#selectize-outer-select-participants .selectize-input .item', function (event) {
      var $target = $(event.target);
      var participant = {
        id: $target.data("value"),
        name: $target.text().slice(0, -1)
      };
      var lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
      var ls = LearnShareSession.findOne({
        _id: lssid
      });

      if (!ls) {
        return;
      }

      ls.saveGuest(participant);
      ls.removeParticipant(participant.id);
    });
  }, 500);
});
Template.learn_share.helpers({
  userList: function () {
    var u = User.find().fetch();
    return u;
  },
  canEdit: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return false;
    }

    if (lssess.state === "locked" || !Meteor.user()) {
      return false;
    }

    return true;
  },
  canEditAdmin: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return false;
    }

    if (lssess.state === "locked" || !Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      return false;
    }

    return true;
  },
  sessionPresenters: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    } else {
      return lssess.presenters;
    }
  },
  sessionParticipants: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    } else {
      return lssess.participants;
    }
  },
  sessionParticipantItems: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    }

    var participants = lssess.participants;
    var participantIds = [];

    for (var i = 0; i < participants.length; i++) {
      participantIds.push({
        value: participants[i].id,
        text: participants[i].name
      });
    }

    return participantIds;
  },
  sessionGuests: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    } else {
      return lssess.guests;
    }
  },
  sessionGuestItems: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    }

    var guests = lssess.guests;
    var guestIds = [];

    for (var i = 0; i < guests.length; i++) {
      guestIds.push({
        value: guests[i].id,
        text: guests[i].name
      });
    }

    return guestIds;
  },
  roParticipantNames: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (!lssess) {
      return [];
    }

    var participants = lssess.participants;
    var participantList = [];

    for (var i = 0; i < participants.length; i++) {
      participantList.push(participants[i].name);
    }

    return participantList;
  },
  userAddList: function (teamName) {
    var u = User.find();
    var addList = [];
    u.forEach(function (m) {
      addList.push({
        value: m._id,
        text: m.MyProfile.firstName + " " + m.MyProfile.lastName
      });
    });
    return addList;
  },
  itemRemoveHandler: function () {
    return function (value, $item) {
      var numSelected = $("#select-participants")[0].selectize.items.length;

      if (numSelected === 0) {
        $("#btn-pick-first").attr("disabled", true);
      }

      var lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
      var ls = LearnShareSession.findOne({
        _id: lssid
      });

      if (!ls) {
        return;
      }

      ls.removeParticipant(value);
    };
  },
  itemRemoveGuestHandler: function () {
    return function (value, $item) {
      var lssid = $("#select-guests").closest("[data-lssid]").data("lssid");
      var ls = LearnShareSession.findOne({
        _id: lssid
      });

      if (!ls) {
        return;
      }

      ls.removeGuest(value);
    };
  },
  itemAddHandler: function () {
    return function (value, $item) {
      $("#btn-pick-first").prop("disabled", false);
      var participant = {
        id: value,
        name: $item.text().slice(0, -1)
      };
      var id = $item.closest('[data-lssid]').data('lssid');
      var ls = LearnShareSession.findOne({
        _id: id
      });

      if (!ls) {
        return;
      }

      if (typeof _.find(ls.presenters, function (o) {
        return o.id === participant.id;
      }) !== "undefined") {
        //if added user is in the list of presenters, mark it
        $item.addClass("picked");
      }

      if ("guest" === participant.id.slice(0, 5)) {
        $item.addClass("guest");
      }

      ls.addParticipant(participant);
    };
  },
  itemAddGuestHandler: function () {
    return function (value, $item) {
      $("#btn-pick-first").prop("disabled", false);
      var participant = {
        id: value,
        name: $item.text().slice(0, -1)
      };
      var id = $item.closest('[data-lssid]').data('lssid');
      var ls = LearnShareSession.findOne({
        _id: id
      });

      if (!ls) {
        return;
      }

      if (typeof _.find(ls.presenters, function (o) {
        return o.id === participant.id;
      }) !== "undefined") {
        //if added user is in the list of presenters, mark it
        $item.addClass("picked");
      }

      if ("guest" === participant.id.slice(0, 5)) {
        $item.addClass("guest");
      }

      ls.saveGuest(participant);
    };
  },
  order: function (idx) {
    return idx + 1;
  },
  lssid: function () {
    return Template.instance().lssid;
  },
  title: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return lssess.title;
    }
  },
  teamId: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return lssess.teamId;
    } else {
      return "";
    }
  },
  team: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return Team.findOne({
        _id: lssess.teamId
      });
    } else {
      return "";
    }
  },
  teamName: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return Team.findOne({
        _id: lssess.teamId
      }).Name;
    } else {
      return "";
    }
  },
  sessionActive: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      if (lssess.state == "locked") {
        return false;
      } else {
        return true;
      }
    }
  },
  notes: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return lssess.notes;
    }
  },
  skypeUrl: function () {
    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });

    if (lssess) {
      return lssess.skypeUrl;
    }
  },
  guestName: function () {
    return Session.get("guestName").split('-')[1];
  }
});

var pickRandom = function () {
  var selectControl = $("#select-participants")[0].selectize;
  var availableItems = [];

  for (var i = 0; i < selectControl.items.length; i++) {
    var _$item = $(".item[data-value=" + selectControl.items[i] + "]");

    if (!_$item.hasClass("picked") && !_$item.hasClass("picking")) {
      availableItems.push(_$item);
    }
  }

  if (availableItems.length === 0) {
    //don't pick the same item twice in a row unless it's the last one
    $item = $(".item.picking[data-value]");

    if ($item.length && !$item.hasClass("picked")) {
      availableItems.push($(".item.picking[data-value]"));
    }
  }

  if (availableItems.length <= 1) {
    $("#btn-pick-first").prop("disabled", true);
  }

  if (availableItems.length === 0) {
    //none left to pick
    return '';
  }

  var $picking = availableItems[Math.floor(Math.random() * availableItems.length)];
  $("#p-on-deck-info").data("picking", $picking.data("value"));
  $("#p-on-deck-info").html($picking.text().slice(0, -1));
  $picking.addClass("picking");
  return $picking.data("value");
};

Template.learn_share.events({
  'change .file-upload-input': function (event, instance) {
    var file = event.currentTarget.files[0];
    var reader = new FileReader();

    reader.onload = function (fileLoadEvent) {
      var lssid = $(".container[data-lssid]").data("lssid");
      var lssess = LearnShareSession.findOne({
        _id: lssid
      });
      lssess.uploadRecording(file, reader.result);
    };

    reader.readAsBinaryString(file);
  },
  'click button#btn-pick-first': function (event, instance) {
    var pickingId = pickRandom();

    if (pickingId !== '') {
      $("#p-on-deck").show();
      $("#p-pick-first").hide();
    }
  },
  'click button#btn-pick-again': function (event, instance) {
    var prevPickingId = $("#p-on-deck-info").data("picking");
    var pickingId = pickRandom();

    if (prevPickingId != pickingId) {
      var $prevPicked = $(".item[data-value=" + prevPickingId + "]");
      $prevPicked.removeClass("picking");
    }
  },
  'click button#btn-pick-accept': function (event, instance) {
    var pickedId = $("#p-on-deck-info").data("picking");
    var picked = {};
    var $pickedItem = $(".item[data-value=" + pickedId + "]");
    picked.id = $pickedItem.data("value");
    picked.name = $pickedItem.text().slice(0, -1);
    $pickedItem.removeClass("picking").addClass("picked");
    $("#p-on-deck-info").data("picking", "");
    $("#p-on-deck-info").html("");
    $("#p-on-deck").hide();
    $("#p-pick-first").show();

    if ($(".item[data-value]").not(".picked").length === 0) {
      $("#btn-pick-first").attr("disabled", true);
    }

    var lssid = Template.instance().lssid;
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });
    lssess.addPresenter(picked);
  },
  'keypress #input-notes,#input-title': function (event, instance) {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      event.preventDefault();
    }
  },
  'keyup #input-notes,#input-title': _.debounce(function (event, instance) {
    if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      var lssid = $(".container[data-lssid]").data("lssid");
      var lssess = LearnShareSession.findOne({
        _id: lssid
      });
      lssess.saveText($("#input-title").val(), $("#input-notes").val());
    }
  }, 2000),
  'click button#modal-save-name': function (event, instance) {
    var lssid = $(".container[data-lssid]").data("lssid");
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });
    var guestName = "guest-" + $("#input-guest-name").val(); //Session.setPersistent("guestName",guestName);

    lssess.saveGuest(Session.get("guestId"), guestName);
    $("#modal-edit-name").modal("hide");
  },
  'click a#lockSession': function (event, instance) {
    event.preventDefault();
    var lssid = $(".container[data-lssid]").data("lssid");
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });
    lssess.saveText($("#input-title").val(), $("#input-notes").val());
    lssess.lockSession();
  },
  'click a#unlockSession': function (event, instance) {
    event.preventDefault();

    if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      var lssid = $(".container[data-lssid]").data("lssid");
      var lssess = LearnShareSession.findOne({
        _id: lssid
      });
      lssess.unlockSession();
    }
  },
  'click a#a-skype-url-edit': function (event, instance) {
    event.preventDefault();

    if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
      $("#a-skype-url").hide();
      $("#a-skype-url-edit").hide();
      $("#input-skype-url").show();
      $("#span-create-skype").show();
    }
  },
  'click a#a-create-call': function (event, instance) {
    event.preventDefault();
    console.log("click create call");
    $("#span-create-skype").html("<img src='/img/loading.gif' style='height:20px;width:20px;' /><span style='font-size:xx-small;'>contacting Skype</span>");
    initSkypeAPI();
  },
  'change input#input-skype-url': function (event, instance) {
    var lssid = $(".container[data-lssid]").data("lssid");
    var lssess = LearnShareSession.findOne({
      _id: lssid
    });
    lssess.setSkypeUrl($("#input-skype-url").val());
    $("#a-skype-url").show();
    $("#a-skype-url-edit").show();
    $("#input-skype-url").hide();
    $("#span-create-skype").hide();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"learn_share_list":{"learn_share_list.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share_list/learn_share_list.html                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.learn_share_list.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.learn_share_list.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share_list/template.learn_share_list.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("learn_share_list");
Template["learn_share_list"] = new Template("Template.learn_share_list", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container"
    }, "\n        ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isInRole"), "admin,learn-share-host");
    }, function() {
      return [ "\n        ", HTML.DIV({
        class: "jumbotron create-new-session"
      }, "\n            ", HTML.H3("Create a new Learn", HTML.IMG({
        src: "/img/DeveloperLevel_icon_bg.png",
        class: "dl-icon"
      }), "Share session"), "\n            ", HTML.DIV({
        class: "input-group"
      }, "\n                ", HTML.INPUT({
        type: "text",
        class: "form-control",
        name: "sess-title",
        id: "sess-title",
        placeholder: "Enter a title for the session..."
      }), "\n                ", HTML.SPAN({
        class: "input-group-btn"
      }, "\n                    ", HTML.BUTTON({
        class: "btn btn-primary",
        id: "btn-create-new"
      }, "Begin"), "\n                "), "\n            "), "\n            ", HTML.DIV({
        class: "input-group"
      }, "\n                ", HTML.SELECT({
        id: "select-team"
      }, "\n                    ", HTML.OPTION({
        value: "",
        selected: ""
      }, "- public -"), "\n                    ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teamList")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                        ", HTML.OPTION({
          value: function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "_id"));
          }
        }, Blaze.View("lookup:team.Name", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
        })), "\n                    " ];
      }), "\n                "), "\n            "), "\n        "), "\n        " ];
    }), "\n        ", Blaze.If(function() {
      return Spacebars.call(view.templateInstance().subscriptionsReady());
    }, function() {
      return [ "\n            ", HTML.H3("Public sessions"), "\n            ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("lsSessList")),
          _variable: "lsSess"
        };
      }, function() {
        return [ "\n                ", HTML.DIV({
          class: "jumbotron"
        }, "\n                    ", HTML.A({
          href: function() {
            return [ "/learnShare/", Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "_id")) ];
          }
        }, Blaze.View("lookup:lsSess._id", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "_id"));
        }), " - ", Blaze.View("lookup:lsSess.title", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "title"));
        })), "\n                "), "\n            " ];
      }), "\n            ", Blaze.Each(function() {
        return {
          _sequence: Spacebars.call(view.lookup("teamList")),
          _variable: "team"
        };
      }, function() {
        return [ "\n                ", Blaze.If(function() {
          return Spacebars.dataMustache(view.lookup("hasSessions"), Spacebars.dot(view.lookup("team"), "_id"));
        }, function() {
          return [ "\n                    ", HTML.H3(Blaze._TemplateWith(function() {
            return {
              team: Spacebars.call(view.lookup("team"))
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("team_icon"));
          }), Blaze.View("lookup:team.Name", function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("team"), "Name"));
          }), " team sessions"), "\n                    ", Blaze.Each(function() {
            return {
              _sequence: Spacebars.dataMustache(view.lookup("lsSessList"), Spacebars.dot(view.lookup("team"), "_id")),
              _variable: "lsSess"
            };
          }, function() {
            return [ "\n                        ", HTML.DIV({
              class: "jumbotron"
            }, "\n                            ", HTML.A({
              href: function() {
                return [ "/learnShare/", Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "_id")) ];
              }
            }, Blaze.View("lookup:lsSess._id", function() {
              return Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "_id"));
            }), " - ", Blaze.View("lookup:lsSess.title", function() {
              return Spacebars.mustache(Spacebars.dot(view.lookup("lsSess"), "title"));
            })), "\n                        "), "\n                    " ];
          }), "\n                " ];
        }), "\n            " ];
      }), "\n        " ];
    }), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"learn_share_list.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/learn_share_list/learn_share_list.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var LearnShareSession;
module.watch(require("/imports/api/learn_share/learn_share.js"), {
  LearnShareSession: function (v) {
    LearnShareSession = v;
  }
}, 0);
var Team;
module.watch(require("/imports/api/teams/teams.js"), {
  Team: function (v) {
    Team = v;
  }
}, 1);
module.watch(require("./learn_share_list.html"));
Template.learn_share_list.onCreated(function () {
  var _this = this;

  this.autorun(function () {
    console.log("autorunning learn_share_list...");
    _this.subscription = _this.subscribe('userList', Meteor.userId(), {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
    _this.subscription2 = _this.subscribe('learnShareList', Meteor.userId(), {
      onStop: function () {
        console.log("LearnShare List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("LearnShare List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
    _this.subscription3 = _this.subscribe('teamsMemberOfList', Meteor.userId(), {
      onStop: function () {
        console.log("Team Member Of List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Team Member Of List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription3);
  });
});
Template.learn_share_list.helpers({
  lsSessList: function (teamId) {
    var lst = [];
    var filter = {};

    if (typeof teamId === "string" && teamId != "") {
      filter.teamId = teamId;
    } else {
      filter.teamId = {
        '$in': [null, '']
      };
    }

    LearnShareSession.find(filter).forEach(function (sess) {
      //sorting with { sort: {createdAt:-1} } had no effect, so unshift used to reverse order instead
      lst.unshift(sess);
    });
    return lst;
  },
  hasSessions: function (teamId) {
    var ls = LearnShareSession.find({
      teamId: teamId
    });

    if (!ls || ls.count() == 0) {
      return false;
    } else {
      return true;
    }
  },
  teamList: function () {
    //list of teams the user is a member of
    var t = Team.find({
      Members: Meteor.userId()
    });

    if (!t) {
      return [];
    }

    var lst = t.fetch();
    return lst;
  }
});
Template.learn_share_list.events({
  'click button#btn-create-new': function (event, instance) {
    Meteor.call('learnshare.createNewSession', $("#sess-title").val(), $("#select-team").val(), function (error, result) {
      if (error) {
        console.log("can't create new Learn/Share session", error);
      } else {
        FlowRouter.go("/learnShare/" + result);
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"not-found":{"not-found.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/not-found/not-found.html                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.not-found.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.not-found.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/not-found/template.not-found.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("App_notFound");
Template["App_notFound"] = new Template("Template.App_notFound", (function() {
  var view = this;
  return HTML.Raw('<div id="not-found">\n    <div class="not-found-image">\n      <img src="/img/404.svg" alt="">\n    </div>\n    <div class="not-found-title">\n      <h1>Sorry, that page doesn\'t exist</h1>\n      <a href="/" class="gotohomepage">Go to home</a>\n    </div>\n  </div>');
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"not-found.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/not-found/not-found.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./not-found.html"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"team_goals":{"team_goals.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/team_goals/team_goals.html                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.team_goals.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.team_goals.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/team_goals/template.team_goals.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("team_goals");
Template["team_goals"] = new Template("Template.team_goals", (function() {
  var view = this;
  return [ Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container goal-list team-goal-list",
      "data-team-name": function() {
        return Spacebars.mustache(view.lookup("team"));
      }
    }, "\n        ", HTML.DIV({
      class: "row spaced"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.H2(HTML.A({
      href: "/adminTeams"
    }, Blaze.View("lookup:team", function() {
      return Spacebars.mustache(view.lookup("team"));
    }), " Goals")), "\n            "), "\n        "), "\n        ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isInRole"), "admin", view.lookup("team"));
    }, function() {
      return [ "\n        ", HTML.DIV({
        class: "row spaced goal-controls",
        "data-goal-id": "new"
      }, "\n            ", HTML.DIV({
        class: "col-sm-12"
      }, "\n                ", HTML.BUTTON({
        id: "btn-add-goal",
        class: "btn btn-primary",
        "data-txt-add": "Add a goal...",
        "data-txt-save": "Save"
      }, "Add a goal..."), "\n            "), "\n        "), "\n        ", HTML.DIV({
        class: "row spaced blank-goal",
        id: "blank-goal"
      }, "\n            ", HTML.DIV({
        class: "col-sm-12"
      }, "\n                ", Blaze._TemplateWith(function() {
        return {
          goal: Spacebars.call(view.lookup("blankGoal")),
          users: Spacebars.call(view.lookup("userList"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("goal_view"));
      }), "\n            "), "\n        "), "\n        " ];
    }), "\n        ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isInRole"), "admin,view-goals", view.lookup("team"));
    }, function() {
      return [ "\n        ", HTML.DIV({
        class: "row spaced existing-goals"
      }, "\n            ", HTML.DIV({
        class: "col-sm-12"
      }, "\n                ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("goalReload"));
      }, function() {
        return [ "\n                    ", Blaze.If(function() {
          return Spacebars.call(view.lookup("hasGoals"));
        }, function() {
          return [ "\n                        ", Blaze.Each(function() {
            return {
              _sequence: Spacebars.call(view.lookup("teamGoals")),
              _variable: "goal"
            };
          }, function() {
            return [ "\n                            ", Blaze._TemplateWith(function() {
              return {
                goal: Spacebars.call(view.lookup("goal"))
              };
            }, function() {
              return Spacebars.include(view.lookupTemplate("goal_view"));
            }), "\n                        " ];
          }), "\n                    " ];
        }, function() {
          return [ "\n                        ", HTML.DIV({
            class: "div-no-active"
          }, "No active goals"), "\n                    " ];
        }), "\n                    ", Blaze.If(function() {
          return Spacebars.call(view.lookup("hasReachedGoals"));
        }, function() {
          return [ "\n                        ", HTML.BUTTON({
            "data-toggle": "collapse",
            "data-target": "#div-reached-goals"
          }, "Goals Completed"), "\n                        ", HTML.DIV({
            id: "div-reached-goals",
            class: "collapse"
          }, "\n                        ", Blaze.Each(function() {
            return {
              _sequence: Spacebars.call(view.lookup("teamReachedGoals")),
              _variable: "goal"
            };
          }, function() {
            return [ "\n                            ", Blaze._TemplateWith(function() {
              return {
                goal: Spacebars.call(view.lookup("goal"))
              };
            }, function() {
              return Spacebars.include(view.lookupTemplate("goal_view"));
            }), "\n                        " ];
          }), "\n                        "), "\n                    " ];
        }), "\n                " ];
      }), "\n            "), "\n        "), "\n        " ];
    }), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  }), HTML.Raw('\n\n    <div class="modal fade" id="goal-modal-new">\n        <div class="modal-dialog modal-lg" role="document">\n          <div class="modal-content">\n            <div class="modal-header">\n              <h5 class="modal-title">New Sub Goal</h5>\n            </div>\n            <div class="modal-body">\n            </div>\n          </div>\n        </div>\n    </div>\n    '), HTML.DIV({
    class: "modal fade",
    id: "goal-modal-sub"
  }, "\n        ", HTML.DIV({
    class: "modal-dialog modal-lg",
    role: "document"
  }, "\n          ", HTML.DIV({
    class: "modal-content"
  }, "\n            ", HTML.Raw('<div class="modal-header">\n              <h5 class="modal-title">View/Edit Sub Goal</h5>\n            </div>'), "\n            ", HTML.DIV({
    class: "modal-body"
  }, "\n                ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasSubgoalView"));
  }, function() {
    return [ "\n                  ", Blaze._TemplateWith(function() {
      return {
        goal: Spacebars.call(view.lookup("subgoal"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("goal_view"));
    }), "\n                " ];
  }), "\n            "), "\n          "), "\n        "), "\n    ") ];
}));

Template.__checkName("goal_view");
Template["goal_view"] = new Template("Template.goal_view", (function() {
  var view = this;
  return HTML.DIV({
    class: function() {
      return [ "team-goal ", Spacebars.mustache(view.lookup("collapsed"), Spacebars.dot(view.lookup("goal"), "parentId")) ];
    },
    "data-goal-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id"));
    },
    id: function() {
      return [ "div-goal-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, HTML.Raw('\n        <!-- <form id="form-goal-{{goal._id}}"> -->\n        '), HTML.DIV({
    class: function() {
      return [ "progress pct-", Spacebars.mustache(view.lookup("progressPct")) ];
    },
    "data-pct": function() {
      return Spacebars.mustache(view.lookup("progressPct"));
    }
  }, "\n            ", HTML.DIV({
    class: "progress-bar",
    role: "progressbar",
    style: function() {
      return [ "width: ", Spacebars.mustache(view.lookup("progressPct")), "%;" ];
    },
    "aria-valuenow": function() {
      return Spacebars.mustache(view.lookup("progressPct"));
    },
    "aria-valuemin": "0",
    "aria-valuemax": "100"
  }, Blaze.View("lookup:progressPct", function() {
    return Spacebars.mustache(view.lookup("progressPct"));
  }), "%"), "\n        "), "\n        ", HTML.DIV({
    class: "row summary-row"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10 collapsed-summary"
  }, "\n                ", HTML.SPAN({
    class: "team-goal-title"
  }, Blaze.View("lookup:goal.title", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
  })), "\n                ", HTML.SPAN({
    class: "collapsed-description"
  }, Blaze.View("lookup:goal.description", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "description"));
  })), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-10 expanded-summary"
  }, "\n                ", HTML.SPAN({
    class: "team-goal-title"
  }, HTML.INPUT(HTML.Attrs({
    type: "text",
    id: function() {
      return [ "goal-title-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "flat form-control goal-title",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
    },
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter goal title...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "title");
  }))), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-2 text-right btn-group-xs"
  }, "\n                ", HTML.Raw('<button class="btn btn-success btn-save glyphicon glyphicon-ok details" disabled="" alt="Save changes"></button>'), "\n                ", HTML.Raw('<button class="btn btn-warning btn-cancel glyphicon glyphicon-remove details" disabled="" alt="Discard changes"></button>'), "\n                ", HTML.BUTTON({
    class: "btn btn-primary btn-expand glyphicon glyphicon-chevron-down",
    id: function() {
      return [ "btn-expand-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }), "\n            "), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced"
  }, "\n            ", HTML.DIV({
    class: "col-sm-10"
  }, "\n                ", HTML.DIV({
    class: "team-goal-description"
  }, "\n                    ", HTML.TEXTAREA(HTML.Attrs({
    id: function() {
      return [ "goal-description-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "flat form-control goal-description",
    placeholder: [ HTML.CharRef({
      html: "&lt;",
      str: "<"
    }), "Enter goal description...", HTML.CharRef({
      html: "&gt;",
      str: ">"
    }) ]
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "description");
  }, {
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "description"));
    }
  })), "\n                "), "\n            "), "\n            ", HTML.Raw('<div class="col-sm-2 text-right">\n            </div>'), "\n        "), "\n        ", HTML.DIV({
    class: "row spaced details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-6"
  }, "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        Assigned to\n                        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "assignedTo");
  }, function() {
    return [ "\n                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-assigned-to-"),
        id2: Spacebars.call(Spacebars.dot(view.lookup("goal"), "_id")),
        name: Spacebars.call("assignedTo[]"),
        placeholder: Spacebars.call("Choose assignees..."),
        list: Spacebars.call(view.lookup("userList")),
        selected: Spacebars.call(Spacebars.dot(view.lookup("goal"), "assignedTo")),
        title: Spacebars.call(Spacebars.dot(view.lookup("goal"), "title"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                        " ];
  }, function() {
    return [ "\n                            ", HTML.SPAN({
      class: "ro-user"
    }, Blaze.View("lookup:commaListUsers", function() {
      return Spacebars.mustache(view.lookup("commaListUsers"), Spacebars.dot(view.lookup("goal"), "assignedTo"));
    })), "\n                        " ];
  }), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        Mentors\n                        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "mentors");
  }, function() {
    return [ "\n                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-mentors-"),
        id2: Spacebars.call(Spacebars.dot(view.lookup("goal"), "_id")),
        name: Spacebars.call("mentors[]"),
        placeholder: Spacebars.call("Choose mentors..."),
        list: Spacebars.call(view.lookup("userList")),
        selected: Spacebars.call(Spacebars.dot(view.lookup("goal"), "mentors"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                        " ];
  }, function() {
    return [ "\n                            ", HTML.SPAN({
      class: "ro-user"
    }, Blaze.View("lookup:commaListUsers", function() {
      return Spacebars.mustache(view.lookup("commaListUsers"), Spacebars.dot(view.lookup("goal"), "mentors"));
    })), "\n                        " ];
  }), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        Managers\n                        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "admins");
  }, function() {
    return [ "\n                            ", Blaze._TemplateWith(function() {
      return {
        id: Spacebars.call("select-admins-"),
        id2: Spacebars.call(Spacebars.dot(view.lookup("goal"), "_id")),
        name: Spacebars.call("admins[]"),
        placeholder: Spacebars.call("Choose managers..."),
        list: Spacebars.call(view.lookup("userList")),
        selected: Spacebars.call(Spacebars.dot(view.lookup("goal"), "admins"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("select_autocomplete"));
    }), "\n                        " ];
  }, function() {
    return [ "\n                            ", HTML.SPAN({
      class: "ro-user"
    }, Blaze.View("lookup:commaListUsers", function() {
      return Spacebars.mustache(view.lookup("commaListUsers"), Spacebars.dot(view.lookup("goal"), "admins"));
    })), "\n                        " ];
  }), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-6"
  }, "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-4 text-right"
  }, "\n                        ", HTML.LABEL({
    for: function() {
      return [ "input-start-date-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "Start"), "\n                    "), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-start-date-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "startDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "startDate");
  })), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-4 text-right"
  }, "\n                        ", HTML.LABEL({
    for: function() {
      return [ "input-date-due-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    }
  }, "Due"), "\n                    "), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-date-due-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "dueDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "dueDate");
  })), "\n                    "), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced"
  }, "\n                    ", HTML.Raw('<div class="col-sm-4 text-right">\n                        Review\n                    </div>'), "\n                    ", HTML.DIV({
    class: "col-sm-8"
  }, "\n                        ", HTML.INPUT(HTML.Attrs({
    id: function() {
      return [ "input-date-review-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    type: "text",
    class: "form-control flat date",
    value: function() {
      return Spacebars.mustache(view.lookup("dateField"), "reviewDate");
    }
  }, function() {
    return Spacebars.attrMustache(view.lookup("fldEnabled"), "reviewDate");
  })), "\n                    "), "\n                "), "\n                ", Blaze.Unless(function() {
    return Spacebars.dataMustache(view.lookup("isNew"), Spacebars.dot(view.lookup("goal"), "_id"));
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-4 text-right"
    }, "\n                        Completed\n                    "), "\n                    ", HTML.DIV({
      class: "col-sm-8"
    }, "\n                        ", HTML.INPUT(HTML.Attrs({
      id: function() {
        return [ "input-date-reached-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      type: "text",
      class: "form-control flat date",
      value: function() {
        return Spacebars.mustache(view.lookup("dateField"), "reachedDate");
      }
    }, function() {
      return Spacebars.attrMustache(view.lookup("fldEnabled"), "reachedDate");
    })), "\n                    "), "\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n\n        ", HTML.DIV({
    class: "row spaced comments details"
  }, "\n            ", HTML.DIV({
    class: "col-sm-6 goal-comments"
  }, "\n                ", HTML.Raw("<h3>Comments</h3>"), "\n                ", HTML.DIV("\n                    ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.dataMustache(view.lookup("goalComments"), Spacebars.dot(view.lookup("goal"), "_id")),
      _variable: "comment"
    };
  }, function() {
    return [ "\n                    ", HTML.DIV({
      class: "goal-comment-outer"
    }, "\n                        ", HTML.DIV({
      class: "goal-comment-header row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:getUserName", function() {
      return Spacebars.mustache(view.lookup("getUserName"), Spacebars.dot(view.lookup("comment"), "userId"));
    }), "\n                                ", HTML.DIV({
      class: "float-right"
    }, "\n                                    ", Blaze.View("lookup:formatDate", function() {
      return Spacebars.mustache(view.lookup("formatDate"), Spacebars.dot(view.lookup("comment"), "date"));
    }), "\n                                "), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "goal-comment row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:comment.text", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "text"));
    }), "\n                            "), "\n                        "), "\n                    "), "\n                    " ];
  }), "\n                "), "\n                ", HTML.DIV({
    class: "row spaced comment-add details"
  }, "\n                    ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                        ", HTML.DIV({
    class: "row spaced"
  }, "\n                            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                                ", HTML.TEXTAREA({
    id: function() {
      return [ "new-comment-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "new-comment form-control"
  }), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
    class: "row spaced"
  }, "\n                            ", HTML.DIV({
    class: "col-sm-12"
  }, "\n                                ", HTML.BUTTON({
    id: function() {
      return [ "btn-comment-add-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
    },
    class: "btn btn-primary btn-comment-add",
    alt: "Add comment"
  }, HTML.Raw('<span class="glyphicon glyphicon-pencil"></span>'), " Add comment"), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n            "), "\n            ", HTML.DIV({
    class: "col-sm-6 review-comments"
  }, "\n                ", HTML.Raw("<h3>Reviews</h3>"), "\n                ", HTML.DIV("\n                    ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.dataMustache(view.lookup("reviewComments"), Spacebars.dot(view.lookup("goal"), "_id")),
      _variable: "comment"
    };
  }, function() {
    return [ "\n                    ", HTML.DIV({
      class: "goal-comment-outer"
    }, "\n                        ", HTML.DIV({
      class: "goal-comment-header row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:getUserName", function() {
      return Spacebars.mustache(view.lookup("getUserName"), Spacebars.dot(view.lookup("comment"), "userId"));
    }), "\n                                ", HTML.DIV({
      class: "float-right"
    }, "\n                                    ", Blaze.View("lookup:formatDate", function() {
      return Spacebars.mustache(view.lookup("formatDate"), Spacebars.dot(view.lookup("comment"), "date"));
    }), "\n                                "), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "goal-comment row"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", Blaze.View("lookup:comment.text", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("comment"), "text"));
    }), "\n                            "), "\n                        "), "\n                    "), "\n                    " ];
  }), "\n                "), "\n                ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "goalComments");
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: "row spaced comment-add details"
    }, "\n                    ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                        ", HTML.DIV({
      class: "row spaced"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", HTML.TEXTAREA({
      id: function() {
        return [ "new-review-comment-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      class: "new-review-comment form-control"
    }), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
      class: "row spaced"
    }, "\n                            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                                ", HTML.BUTTON({
      id: function() {
        return [ "btn-review-comment-add-", Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id")) ];
      },
      class: "btn btn-primary btn-review-comment-add",
      alt: "Add comment"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-pencil"
    }), " Add comment"), "\n                            "), "\n                        "), "\n                    "), "\n                "), "\n                " ];
  }), "\n            "), "\n        "), "\n        ", Blaze.If(function() {
    return Spacebars.dataMustache(view.lookup("userHasModifyPerm"), "subgoals");
  }, function() {
    return [ "\n        ", HTML.DIV({
      class: "row spaced details subgoal-add"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.BUTTON({
      class: "btn btn-primary btn-sm btn-add-subgoal",
      alt: "Add subgoal"
    }, HTML.SPAN({
      class: "glyphicon glyphicon-th-list"
    }), " Add subgoal"), "\n            "), "\n        "), "\n        " ];
  }), "\n        ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasChildren"));
  }, function() {
    return [ "\n        ", HTML.DIV({
      class: "row spaced details subgoals"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.DIV({
      class: "team-goal-children"
    }, "\n                    ", HTML.UL("\n                        ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("childGoals")),
        _variable: "childGoal"
      };
    }, function() {
      return [ "\n                        ", HTML.LI("\n                            ", Blaze._TemplateWith(function() {
        return {
          goal: Spacebars.call(view.lookup("childGoal"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("child_goal_view"));
      }), "\n                        "), "\n                        " ];
    }), "\n                    "), "\n                "), "\n            "), "\n        "), "\n        " ];
  }), HTML.Raw("\n        <!-- </form> -->\n    "));
}));

Template.__checkName("child_goal_view");
Template["child_goal_view"] = new Template("Template.child_goal_view", (function() {
  var view = this;
  return [ HTML.DIV({
    class: "team-goal-title",
    "data-id": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "_id"));
    }
  }, Blaze.View("lookup:goal.title", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("goal"), "title"));
  })), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasChildren"));
  }, function() {
    return [ "\n    ", HTML.UL("\n        ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("childGoals")),
        _variable: "childGoal"
      };
    }, function() {
      return [ "\n        ", HTML.LI("\n            ", Blaze._TemplateWith(function() {
        return {
          goal: Spacebars.call(view.lookup("childGoal"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("child_goal_view"));
      }), "\n        "), "\n        " ];
    }), "\n    "), "\n    " ];
  }) ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"team_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/team_goals/team_goals.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 1);
var TeamGoal;
module.watch(require("/imports/api/team_goals/team_goals.js"), {
  TeamGoal: function (v) {
    TeamGoal = v;
  }
}, 2);
module.watch(require("./team_goals.html"));
module.watch(require("/imports/ui/components/select_autocomplete/select_autocomplete.js"));
var BLANK_GOAL = {
  _id: "new",
  title: "",
  description: ""
};

var _hasSubgoalView = new ReactiveVar(false);

var _subgoalId = new ReactiveVar("");

Template.team_goals.onCreated(function () {
  var _this = this;

  if (this.data.teamName) {
    this.teamName = this.data.teamName;
  } else {
    this.teamName = FlowRouter.getParam('teamName').split('-').join(' ');
  }

  Session.set("goalReload", false);
  Session.set("saving", true);
  this.userSubscriptionReady = new ReactiveVar(false);
  this.autorun(function () {
    _this.modalGoalId = FlowRouter.getParam('goalId');

    if ("undefined" !== typeof _this.modalGoalId && "" !== _this.modalGoalId) {
      _hasSubgoalView.set(true);

      _subgoalId.set(FlowRouter.getParam('goalId'));

      $("body").on("hidden.bs.modal", "#goal-modal-sub", function () {
        _hasSubgoalView.set(false);

        _subgoalId.set("");

        FlowRouter.go("/teamGoals/" + FlowRouter.getParam('teamName'));
      });
      Meteor.setTimeout(function () {
        $("#goal-modal-sub").modal("show");
        $("#goal-modal-sub").find("div.team-goal").removeClass("collapsed");
      }, 1000);
    }

    _this.subscription = _this.subscribe('teamGoalsData', _this.teamName, {
      onStop: function () {
        console.log("Team Goals subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Team Goals subscription ready! ", arguments, this);
      }
    });
    _this.subscription2 = _this.subscribe('userList', Meteor.userId(), {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
  });
  Meteor.setTimeout(function () {
    Session.set("saving", false);
  }, 2000);
});
Template.team_goals.onRendered(function () {
  Meteor.setTimeout(function () {
    $("input.date").datetimepicker({
      format: 'YYYY-MM-DD',
      useCurrent: false,
      showClear: true,
      showClose: true
    });
  }, 1000);
  $("body").on("hidden.bs.modal", "#goal-modal-new", function () {
    $newgoal = $("#div-goal-new").detach();
    $newgoal.data("parent-id", "");
    $("#blank-goal").find(".col-sm-12").append($newgoal);
  });
});

var resetNewGoalForm = function () {
  var valInputs = ["goal-title-new", "goal-description-new", "input-date-due-new", "input-date-review-new", "input-date-reached-new"];

  for (var i = 0; i < valInputs.length; i++) {
    $("#" + valInputs[i]).val("");
  }

  var slzInputs = ["select-assigned-to-new", "select-mentors-new", "select-admins-new"];

  for (var _i = 0; _i < valInputs.length; _i++) {
    $("#" + valInputs[_i]).val("");
  }
};

function saveGoal(goalId) {
  var slAssigned = $("#select-assigned-to-" + goalId)[0].selectize;
  var slMentors = $("#select-mentors-" + goalId)[0].selectize;
  var slAdmins = $("#select-admins-" + goalId)[0].selectize;
  var assignList = slAssigned.getValue();
  var mentorList = slMentors.getValue();
  var adminList = slAdmins.getValue();
  var tplTeamName = $("[data-team-name]").data("team-name");
  Session.set("saving", true);
  var saveObj = {
    teamName: tplTeamName,
    title: $("#goal-title-" + goalId).val(),
    description: $("#goal-description-" + goalId).val(),
    assignedTo: assignList,
    mentors: mentorList,
    admins: adminList
  };
  var startDate = $("#input-start-date-" + goalId).val();

  if ("" !== startDate) {
    saveObj.startDate = new Date(startDate);
  }

  var dueDate = $("#input-date-due-" + goalId).val();

  if ("" !== dueDate) {
    saveObj.dueDate = new Date(dueDate);
  }

  var rvwDate = $("#input-date-review-" + goalId).val();

  if ("" !== rvwDate) {
    saveObj.reviewDate = new Date(rvwDate);
  }

  if (goalId === BLANK_GOAL._id) {
    var parentId = $("#div-goal-new").data("parent-id");

    if ("" !== parentId) {
      saveObj.parentId = parentId;
    }

    Meteor.call('teamgoals.createNewGoal', saveObj, function (err, rslt) {
      console.log(err, rslt);
    });
  } else {
    var g = TeamGoal.findOne({
      _id: goalId
    });
    var reviewedOnDate = $("#input-date-reviewed-on-" + goalId).val();

    if ("" !== reviewedOnDate) {
      saveObj.reviewedOnDate = new Date(reviewedOnDate);
    }

    var reachedDate = $("#input-date-reached-" + goalId).val();

    if ("" !== reachedDate) {
      saveObj.reachedDate = new Date(reachedDate);
    }

    g.updateFromObj(saveObj);
  }

  Meteor.setTimeout(function () {
    Session.set("saving", false);
  }, 10000);
}

function goalChanged($g) {
  $g.find(".btn-save").prop("disabled", false);
  $g.find(".btn-cancel").prop("disabled", false);
}

function goalUnchanged($g) {
  $g.find(".btn-save").prop("disabled", true);
  $g.find(".btn-cancel").prop("disabled", true);
  $g.find(".changed").removeClass("changed");
}

Template.team_goals.events({
  'change input.flat,textarea.flat': function (event, instance) {
    $(event.target).addClass('changed');
    var $goal = $(event.target).closest("[data-goal-id]");

    if ($goal) {
      if ($("#goal-title-" + $goal.data("goal-id")).val() != "") {//
      }
    }
  },
  'change input,textarea,select': function (event, instance) {
    var $t = $(event.target);
    var $goal = $(event.target).closest("[data-goal-id]");
    goalChanged($goal);
  },
  'keyup input,textarea': function (event, instance) {
    var $t = $(event.target);
    var $goal = $(event.target).closest("[data-goal-id]");
    goalChanged($goal);
  },
  'click button.btn-save': function (event, instance) {
    var $t = $(event.target);
    var goalId = $t.closest("[data-goal-id]").data("goal-id");
    saveGoal(goalId);
    goalUnchanged($("#div-goal-" + goalId));
    $modalParent = $t.closest(".modal");

    if ($modalParent.length) {
      $modalParent.modal('hide');
      $newgoal = $("#div-goal-new").detach();
      $newgoal.data("parent-id", "");
      $("#blank-goal").find(".col-sm-12").html($newgoal);
    }

    if (goalId == BLANK_GOAL._id) {
      resetNewGoalForm();

      if (!$modalParent.length) {
        $(".goal-controls").show();
        $("#blank-goal").slideUp();
      }
    }
  },
  'click button.btn-add-subgoal': function (event, instance) {
    var parentId = $(event.target).closest("[data-goal-id]").data("goal-id");
    $newgoal = $("#div-goal-new").detach();
    $newgoal.data("parent-id", parentId);
    $newgoal.find(".btn-cancel").attr("disabled", false);
    $("#goal-modal-new").find(".modal-body").append($newgoal);
    $("#goal-modal-new").modal("show");
    $("#goal-modal-new").find("div.team-goal").removeClass("collapsed");
  },
  'click button.btn-cancel': function (event, instance) {
    var $t = $(event.target);
    var goalId = $t.closest("[data-goal-id]").data("goal-id");
    $modalParent = $t.closest(".modal");

    if ($modalParent.length) {
      $modalParent.modal('hide');
      $newgoal = $("#div-goal-new").detach();
      $newgoal.data("parent-id", "");
      $("#blank-goal").find(".col-sm-12").append($newgoal);
    }

    if (goalId == BLANK_GOAL._id) {
      resetNewGoalForm();

      if (!$modalParent.length) {
        $(".goal-controls").show();
        $("#blank-goal").slideUp();
      }
    } else {
      //forces a reload from the database
      Session.set("goalReload", true);
      Meteor.setTimeout(function () {
        Session.set("goalReload", false);
      }, 100);
    }
  },
  'click button.btn-comment-add': function (event, instance) {
    $btnAdd = $(event.target);
    var goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
    var $comment = $("#new-comment-" + goalId);
    var newComment = $comment.val();
    var g = TeamGoal.findOne({
      _id: goalId
    });
    g.addComment(newComment);
    $comment.val("");
  },
  'click button.btn-review-comment-add': function (event, instance) {
    $btnAdd = $(event.target);
    var goalId = $btnAdd.closest("[data-goal-id]").data("goal-id");
    var $comment = $("#new-review-comment-" + goalId);
    var newComment = $comment.val();
    var g = TeamGoal.findOne({
      _id: goalId
    });
    g.addReviewComment(newComment);
    $comment.val("");
  },
  'click button#btn-add-goal': function (event, instance) {
    var $btnAdd = $(event.target);
    $goal = $btnAdd.closest("[data-goal-id]");
    var goalId = $goal.data("goal-id");
    $(".goal-controls").hide();
    var $btnCancel = $("#blank-goal").find(".btn-cancel");
    $btnCancel.prop("disabled", false);
    $(".team-goal[data-goal-id=" + goalId + "]").removeClass("collapsed");
    $("#blank-goal").slideDown();
    $("#btn-add-cancel").fadeIn();
  },
  'click button#btn-add-cancel': function (event, instance) {
    $("#blank-goal").slideUp();
    $("#btn-add-cancel").fadeOut();
  },
  'click button.btn-expand,div.collapsed-summary': function (event, instance) {
    var $target = $(event.target);
    var $goalContainer = $target.closest("[data-goal-id]");
    var $targetExpandBtn = $goalContainer.find(".btn-expand.glyphicon");
    $targetExpandBtn.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");

    if ($goalContainer.hasClass("collapsed")) {
      $(".team-goal[data-goal-id]:not(.collapsed)").slideUp(function () {
        $(this).addClass("collapsed").css("display", "block");
      });
      $goalContainer.css("display", "none").removeClass("collapsed").slideDown(function () {
        $('html, body').animate({
          scrollTop: $goalContainer.offset().top
        }, 500);
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-down");
      $targetExpandBtn.addClass("glyphicon-chevron-up");
    } else {
      $goalContainer.slideUp(function () {
        $goalContainer.addClass("collapsed").css("display", "block");
      });
      $targetExpandBtn.removeClass("glyphicon-chevron-up");
      $targetExpandBtn.addClass("glyphicon-chevron-down");
    }
  },
  'keyup textarea.goal-description,input.goal-title': _.debounce(function (event, instance) {
    var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

    if ("new" === goalId) {
      //don't auto-save if creating a new goal
      return;
    }

    saveGoal(goalId);
    goalUnchanged($("#div-goal-" + goalId));
  }, 2000),
  'change input,select': _.debounce(function (event, instance) {
    if (!Session.get("saving")) {
      var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

      if ("new" === goalId) {
        //don't auto-save if creating a new goal
        return;
      }

      saveGoal(goalId);
      goalUnchanged($("#div-goal-" + goalId));
    }
  }, 2000),
  'dp.change': _.debounce(function (event, instance) {
    if (!Session.get("saving")) {
      var goalId = $(event.target).closest("[data-goal-id]").data("goal-id");

      if ("new" === goalId) {
        //don't auto-save if creating a new goal
        return;
      }

      saveGoal(goalId);
      goalUnchanged($("#div-goal-" + goalId));
    }
  }, 2000),
  'click div.team-goal-title[data-id]': function (event, instance) {
    if (!Session.get("saving")) {
      _hasSubgoalView.set(true);

      var gid = $(event.target).data("id");

      _subgoalId.set(gid);

      FlowRouter.go("/teamGoals/" + FlowRouter.getParam('teamName') + "/" + gid);
      $("#goal-modal-sub").prop("disabled", false).modal("show");
    }
  }
});

function getTeamName() {
  var teamName = Template.instance().teamName;
  return teamName;
}

Template.team_goals.helpers({
  goalReload: function () {
    return Session.get("goalReload");
  },
  hasGoals: function () {
    var teamName = getTeamName();
    var g = TeamGoal.find({
      teamName: teamName,
      parentId: '',
      reachedDate: null
    }).fetch();
    return g.length > 0;
  },
  hasReachedGoals: function () {
    var teamName = getTeamName();
    var g = TeamGoal.find({
      teamName: teamName,
      parentId: '',
      reachedDate: {
        $ne: null
      }
    }).fetch();
    return g.length > 0;
  },
  teamGoals: function () {
    var teamName = getTeamName();
    var g = TeamGoal.find({
      teamName: teamName,
      parentId: '',
      reachedDate: null
    }).fetch();
    return g;
  },
  teamReachedGoals: function () {
    var teamName = getTeamName();
    var g = TeamGoal.find({
      teamName: teamName,
      parentId: '',
      reachedDate: {
        $ne: null
      }
    }).fetch();
    return g;
  },
  blankGoal: function () {
    return Object.assign({
      teamName: Template.instance().teamName
    }, BLANK_GOAL);
  },
  hasSubgoalView: function () {
    var hasView = _hasSubgoalView.get();

    var gid = _subgoalId.get();

    if (hasView) {
      return true;
    } else {
      return false;
    }
  },
  subgoal: function () {
    var hasView = _hasSubgoalView.get();

    var subgoalId = Template.instance().modalGoalId;
    subgoalId = _subgoalId.get();
    var g = TeamGoal.findOne({
      _id: subgoalId
    });

    if (g) {
      return g;
    } else {
      return {};
    }
  },
  team: function () {
    return getTeamName();
  },
  teamSlug: function () {
    return getTeamName().split(" ").join("-");
  },
  goalComments: function (goalId) {
    var g = TeamGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.goalComments;
    return c;
  },
  reviewComments: function (goalId) {
    var g = TeamGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.reviewComments;
    return c;
  },
  formatDate: function (dateObj) {
    return dateObj.toLocaleDateString();
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    if (!u) return "";
    var fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
    return fullName;
  },
  userList: function () {
    var list = [{
      id: 1,
      name: "George"
    }, {
      id: 2,
      name: "Frank"
    }];
    return list;
  }
});
Template.goal_view.onRendered(function () {});
Template.goal_view.helpers({
  childGoals: function () {
    var goalId = Template.instance().data.goal._id;

    var children = TeamGoal.find({
      parentId: goalId
    }).fetch();
    return children;
  },
  hasChildren: function () {
    var goalId = Template.instance().data.goal._id;

    var doesHave = TeamGoal.find({
      parentId: goalId
    }).fetch().length > 0;
    return doesHave;
  },
  goalComments: function (goalId) {
    if (goalId === BLANK_GOAL._id) {
      return;
    }

    var g = TeamGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.goalComments;
    return c;
  },
  reviewComments: function (goalId) {
    if (goalId === BLANK_GOAL._id) {
      return;
    }

    var g = TeamGoal.findOne({
      _id: goalId
    });

    if (!g) {
      return;
    }

    var c = g.reviewComments;
    return c;
  },
  formatDate: function (dateObj) {
    return dateObj.toLocaleDateString();
  },
  dateField: function (fld) {
    var goal = Template.instance().data.goal;

    if (goal._id == BLANK_GOAL._id) {
      return "";
    }

    var d = goal[fld];

    if (!(d instanceof Date)) {
      return "";
    }

    var dateText = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
    return dateText;
  },
  getUserName: function (userId) {
    var u = User.findOne({
      _id: userId
    });
    if (!u) return "";
    var fullName = u.MyProfile.firstName + " " + u.MyProfile.lastName;
    return fullName;
  },
  userList: function () {
    var userList = [];
    var teamRole = {};
    teamRole["roles." + Template.instance().data.goal.teamName] = "member";
    User.find(teamRole).forEach(function (user) {
      userList.push({
        text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
        value: user._id
      });
    });
    console.log(teamRole, userList);
    return userList;
  },
  progressPct: function () {
    var goal = Template.instance().data.goal;
    var g = TeamGoal.findOne({
      _id: goal._id
    });
    if (!g) return 0;

    if (!g.dueDate || !g.startDate || "undefined" === typeof g.dueDate || "undefined" === typeof g.startDate) {
      return 0;
    }

    var currDt = new Date().getTime();
    var totalDuration = g.dueDate.getTime() - g.startDate.getTime();
    var timeSinceStart = currDt - g.startDate.getTime();
    var pct = timeSinceStart / totalDuration;
    return Math.min(parseInt(pct * 100), 100);
  },
  userHasModifyPerm: function (fld) {
    var goal = Template.instance().data.goal;
    var g = TeamGoal.findOne({
      _id: goal._id
    });
    if (!g) return true;
    return g.hasModifyPerm(fld);
  },
  fldEnabled: function (fld) {
    var goal = Template.instance().data.goal;
    var g = TeamGoal.findOne({
      _id: goal._id
    });

    if (!g) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', goal.teamName)) {
        return "";
      } else {
        return "disabled";
      }
    }

    if (g.hasModifyPerm(fld)) {
      return "";
    } else {
      return "disabled";
    }
  },
  commaListUsers: function (lst) {
    var nameList = [];
    var goal = Template.instance().data.goal;
    var g = TeamGoal.findOne({
      _id: goal._id
    });

    for (var i = 0; i < lst.length; i++) {
      var u = User.findOne({
        _id: lst[i]
      });
      nameList.push(u.MyProfile.firstName + " " + u.MyProfile.lastName);
    }

    return nameList.join(', ');
  },
  isNew: function (id) {
    return BLANK_GOAL._id === id;
  },
  collapsed: function (pid) {
    //if this goal has a parent it is being displayed in a modal and should not be collapsed
    if ("" !== pid) {
      return "";
    } else {
      return "collapsed";
    }
  }
});
Template.child_goal_view.helpers({
  childGoals: function () {
    var goalId = Template.instance().data.goal._id;

    var children = TeamGoal.find({
      parentId: goalId
    }).fetch();
    return children;
  },
  hasChildren: function (goalId) {
    goalId = Template.instance().data.goal._id;
    var doesHave = TeamGoal.find({
      parentId: goalId
    }).count() > 0;
    return doesHave;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_dashboard":{"user_dashboard.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_dashboard/user_dashboard.html                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.user_dashboard.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.user_dashboard.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_dashboard/template.user_dashboard.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("user_dashboard");
Template["user_dashboard"] = new Template("Template.user_dashboard", (function() {
  var view = this;
  return HTML.DIV({
    class: "container user-dashboard"
  }, "\n        ", HTML.DIV({
    class: "row"
  }, "\n            ", Blaze.Each(function() {
    return {
      _sequence: Spacebars.call(view.lookup("dashboardPanes")),
      _variable: "pane"
    };
  }, function() {
    return [ "\n                ", HTML.DIV({
      class: function() {
        return [ "col-sm-", Spacebars.mustache(Spacebars.dot(view.lookup("pane"), "size")) ];
      }
    }, "\n                    ", HTML.DIV({
      class: function() {
        return [ "dashboard-pane ", Spacebars.mustache(Spacebars.dot(view.lookup("pane"), "name")) ];
      },
      "data-route": function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("pane"), "route"));
      }
    }, "\n                        ", Blaze.View("lookup:pane.title", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("pane"), "title"));
    }), "\n                        ", Blaze._TemplateWith(function() {
      return {
        template: Spacebars.call(Spacebars.dot(view.lookup("pane"), "name")),
        data: Spacebars.call(Spacebars.dot(view.lookup("pane"), "data"))
      };
    }, function() {
      return Spacebars.include(function() {
        return Spacebars.call(Template.__dynamic);
      });
    }), "\n                    "), "\n                "), "\n            " ];
  }), "\n        "), "\n    ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_dashboard.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_dashboard/user_dashboard.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
module.watch(require("./user_dashboard.html"));
module.watch(require("/imports/ui/pages/learn_share_list/learn_share_list.js"));
module.watch(require("/imports/ui/pages/home/home.js"));
Template.user_dashboard.onCreated(function () {//
});
Template.user_dashboard.helpers({
  dashboardPanes: function () {
    var u = User.findOne({
      _id: Meteor.userId()
    });

    if (u && "undefined" !== typeof u.MyProfile.dashboardPanes && u.MyProfile.dashboardPanes.length > 0) {
      return u.MyProfile.dashboardPanes;
    } else {
      return [{
        size: 6,
        name: 'individual_goals',
        title: 'Goals',
        route: '/goals',
        data: {}
      }, {
        size: 6,
        name: 'admin_teams',
        title: 'Teams',
        route: '/adminTeams',
        data: {}
      }, {
        size: 6,
        name: 'learn_share_list',
        title: 'Learn/Share',
        route: '/learnShareList',
        data: {}
      }, {
        size: 6,
        name: 'user_profile',
        title: 'Profile',
        route: '/profile',
        data: {}
      }, {
        size: 12,
        name: 'App_home',
        title: 'Questions',
        route: '/',
        data: {}
      }];
    }
  }
});
Template.user_dashboard.events({
  'click div.dashboard-pane': function (event, instance) {
    var target = $(event.target).data("route");

    if ("undefined" === target) {
      return;
    }

    FlowRouter.go(target);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_profile":{"user_profile.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_profile/user_profile.html                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.user_profile.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.user_profile.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_profile/template.user_profile.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("user_profile");
Template["user_profile"] = new Template("Template.user_profile", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container user-profile",
      style: "position:relative"
    }, "\n        ", HTML.A({
      class: "a-goals-link",
      href: function() {
        return [ "/goals/", Spacebars.mustache(view.lookup("userId")) ];
      }
    }, "Goals"), "\n        ", HTML.FORM({
      id: "frm-profile"
    }, "\n        ", HTML.DIV({
      id: "btn-group",
      class: "col-sm-4 text-right btn-group-xs"
    }, "\n            ", HTML.BUTTON({
      class: "btn btn-success btn-save glyphicon glyphicon-ok details",
      alt: "Save changes"
    }), "\n            ", HTML.BUTTON({
      class: "btn btn-warning btn-cancel glyphicon glyphicon-remove details",
      alt: "Discard changes"
    }), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL({
      for: "input-fname"
    }, "First name:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.INPUT({
      id: "input-fname",
      type: "text",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("userField"), "firstName");
      }
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL({
      for: "input-lname"
    }, "Last name:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.INPUT({
      id: "input-lname",
      type: "text",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("userField"), "lastName");
      }
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL({
      for: "input-email"
    }, "Email Address:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.INPUT({
      id: "input-email",
      type: "text",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("emailAddress"));
      }
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL({
      for: "input-gender"
    }, "Gender:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.SELECT({
      id: "input-gender",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("userField"), "gender");
      }
    }, "\n                        ", HTML.OPTION(), "\n                        ", HTML.OPTION(HTML.Attrs({
      value: "0"
    }, function() {
      return Spacebars.attrMustache(view.lookup("genderSelected"), "male");
    }), "Male"), "\n                        ", HTML.OPTION(HTML.Attrs({
      value: "1"
    }, function() {
      return Spacebars.attrMustache(view.lookup("genderSelected"), "female");
    }), "Female"), "\n                    "), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL({
      for: "input-bdate"
    }, "Birth date:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.INPUT({
      id: "input-bdate",
      type: "text",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("userField"), "birthDate");
      }
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL("Segments"), "\n                ", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isInRole"), "admin");
    }, function() {
      return [ "\n                    ", Blaze._TemplateWith(function() {
        return {
          id: Spacebars.call("select-segments"),
          id2: Spacebars.call(""),
          name: Spacebars.call("segments[]"),
          placeholder: Spacebars.call("User Segments..."),
          list: Spacebars.call(view.lookup("userSegmentList")),
          selected: Spacebars.call(view.lookup("assignedUserSegments")),
          onItemRemove: Spacebars.call(view.lookup("itemRemoveHandler")),
          onItemAdd: Spacebars.call(view.lookup("itemAddHandler"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("select_autocomplete"));
      }), "\n                " ];
    }, function() {
      return [ "\n                    ", Blaze._TemplateWith(function() {
        return {
          items: Spacebars.call(view.lookup("assignedUserSegments")),
          labelType: Spacebars.call("label-warning")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("label_list"));
      }), "\n                " ];
    }), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", HTML.LABEL("Dashboard:"), "\n                ", HTML.DIV({
      class: "form-group"
    }, "\n                    ", HTML.INPUT({
      type: "text",
      disabled: "disabled",
      class: "form-control flat",
      value: function() {
        return Spacebars.mustache(view.lookup("userField"), "dashboardPanes");
      }
    }), "\n                "), "\n            "), "\n        "), "\n        ", HTML.DIV({
      class: "row",
      style: "padding:15px;background-color:#000"
    }, "\n            ", HTML.DIV({
      class: "col-sm-12"
    }, "\n                ", Blaze._TemplateWith(function() {
      return {
        userId: Spacebars.call(view.lookup("userId"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("personality"));
    }), "\n            "), "\n        "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_profile.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_profile/user_profile.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
var UserSegment;
module.watch(require("/imports/api/user_segments/user_segments.js"), {
  UserSegment: function (v) {
    UserSegment = v;
  }
}, 1);
module.watch(require("./user_profile.html"));
Template.user_profile.onCreated(function () {
  var _this = this;

  if (this.data.userId) {
    this.userId = this.data.userId;
  } else if (FlowRouter.getParam('userId')) {
    this.userId = FlowRouter.getParam('userId');
  } else {
    this.userId = Meteor.userId();
  }

  this.autorun(function () {
    _this.subscription = _this.subscribe('userData', {
      onStop: function () {
        console.log("User profile subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User profile subscription ready! ", arguments, this);
      }
    });
    _this.subscription2 = _this.subscribe('userList', _this.userId, {
      onStop: function () {
        console.log("User List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription2);
    _this.subscription3 = _this.subscribe('segmentList', _this.userId, {
      onStop: function () {
        console.log("Segment List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Segment List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription3);
  });
});
Template.user_profile.onRendered(function () {
  Meteor.setTimeout(function () {
    $("#input-bdate").datetimepicker({
      useCurrent: false,
      showClear: true,
      showClose: true,
      format: 'YYYY-MM-DD'
    });
  }, 1000);
});
Template.user_profile.helpers({
  userId: function () {
    return Template.instance().userId;
  },
  userSegmentList: function () {
    var segList = [];
    var s = UserSegment.find();
    s.forEach(function (m) {
      segList.push({
        value: m._id,
        text: m.name
      });
    });
    return segList;
  },
  assignedUserSegments: function () {
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });
    var assigned = [];

    if (u) {
      var segs = u.MyProfile.segments;
      console.log(segs, segs[0], UserSegment.findOne({
        _id: segs[0]
      }));

      for (var i = 0; i < segs.length; i++) {
        var segTxt = UserSegment.findOne({
          _id: segs[i]
        }).name;
        assigned.push({
          value: segs[i],
          text: segTxt
        });
      }
    }

    console.log("assigned:", assigned);
    return assigned;
  },
  userField: function (fldName) {
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });

    if (u) {
      switch (fldName) {
        case 'firstName':
          return u.MyProfile.firstName;
          break;

        case 'lastName':
          return u.MyProfile.lastName;
          break;

        case 'fullName':
          return u.MyProfile.fullName();
          break;

        case 'gender':
          return u.MyProfile.gender ? 'female' : 'male';
          break;

        case 'birthDate':
          var d = u.MyProfile.birthDate;
          var dateText = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
          return dateText;
          break;

        case 'dashboardPanes':
          return u.MyProfile.dashboardPanes.length > 0 ? 'Custom' : 'Default';
          break;
      }

      return u.MyProfile.fullName();
    } else {
      return "";
    }
  },
  genderSelected: function (label) {
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });
    if (!u) return "";

    if (("f" === label.slice(0, 1) || "F" === label.slice(0, 1)) && u.MyProfile.gender === true) {
      return "selected";
    }

    if (("m" === label.slice(0, 1) || "M" === label.slice(0, 1)) && u.MyProfile.gender === false) {
      return "selected";
    }

    return "";
  },
  userName: function () {
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });

    if (u) {
      return u.MyProfile.fullName();
    } else {
      return "";
    }
  },
  emailAddress: function () {
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });

    if (u) {
      emailAddresses = [];

      for (var i = 0; i < u.emails.length; i++) {
        emailAddresses.push(u.emails[i].address);
      }

      return emailAddresses.join(',');
    } else {
      return "";
    }
  },
  itemAddHandler: function () {
    return function (value, $item) {
      var participant = {
        id: value,
        name: $item.text().slice(0, -1)
      };
    };
  },
  itemRemoveHandler: function () {
    return function (value, $item) {//
    };
  }
});
Template.user_profile.events({
  'change input.flat,textarea.flat,select': function (event, instance) {
    $(event.target).addClass('changed');
    $("#btn-group").fadeIn();
  },
  'dp.change': function (event, instance) {
    $(event.target).addClass('changed');
    $("#btn-group").fadeIn();
  },
  'keyup input,textarea': function (event, instance) {
    var $t = $(event.target);
    $t.addClass('changed');
    $("#btn-group").fadeIn();
  },
  'click button.btn-save': function (event, instance) {
    var $t = $(event.target);
    $t.closest(".container").find(".changed").removeClass("changed"); //todo: update database

    var uprofile = {
      firstName: $("#input-fname").val(),
      lastName: $("#input-lname").val(),
      gender: true == $("#input-gender").val(),
      birthDate: $("#input-bdate").val(),
      segments: $("#select-segments").val()
    };
    var uid = Template.instance().userId;
    var u = User.findOne({
      _id: uid
    });

    if (u) {
      u.profileUpdate(uprofile);
    }
  },
  'click button.btn-cancel': function (event, instance) {
    var $t = $(event.target);
    $t.closest(".container").find(".changed").removeClass("changed");
    $("#frm-profile")[0].reset();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_segments":{"user_segments.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_segments/user_segments.html                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.user_segments.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.user_segments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_segments/template.user_segments.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("user_segments");
Template["user_segments"] = new Template("Template.user_segments", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.templateInstance().subscriptionsReady());
  }, function() {
    return [ "\n    ", HTML.DIV({
      class: "container"
    }, "\n        ", HTML.TABLE({
      class: "table"
    }, "\n            ", HTML.THEAD("\n                ", HTML.TR("\n                    ", HTML.TH("Name"), "\n                    ", HTML.TH("Description"), "\n                    ", HTML.TH(HTML.CharRef({
      html: "&nbsp;",
      str: " "
    })), "\n                "), "\n            "), "\n            ", HTML.TBODY("\n                ", Blaze.Each(function() {
      return {
        _sequence: Spacebars.call(view.lookup("segmentList")),
        _variable: "segment"
      };
    }, function() {
      return [ "\n                    ", HTML.TR({
        "data-segid": function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("segment"), "_id"));
        }
      }, "\n                        ", HTML.TD(HTML.INPUT({
        id: function() {
          return [ "seg-name-", Spacebars.mustache(Spacebars.dot(view.lookup("segment"), "_id")) ];
        },
        type: "text",
        class: "flat form-control edit",
        value: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("segment"), "name"));
        }
      })), "\n                        ", HTML.TD(HTML.INPUT({
        id: function() {
          return [ "seg-dscr-", Spacebars.mustache(Spacebars.dot(view.lookup("segment"), "_id")) ];
        },
        type: "text",
        class: "flat form-control edit",
        value: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("segment"), "description"));
        }
      })), "\n                        ", HTML.TD({
        class: "btn-group-xs"
      }, "\n                            ", HTML.Comment(' <button class="btn btn-danger btn-cancel glyphicon glyphicon-remove details" alt="Delete segment"></button> '), "\n                        "), "\n                    "), "\n                " ];
    }), "\n                ", HTML.TR("\n                    ", HTML.TD(HTML.INPUT({
      id: "seg-name-new",
      type: "text",
      class: "flat form-control new",
      placeholder: [ HTML.CharRef({
        html: "&lt;",
        str: "<"
      }), "New segment name", HTML.CharRef({
        html: "&gt;",
        str: ">"
      }) ]
    })), "\n                    ", HTML.TD(HTML.INPUT({
      id: "seg-dscr-new",
      type: "text",
      class: "flat form-control new",
      placeholder: [ HTML.CharRef({
        html: "&lt;",
        str: "<"
      }), "New segment description", HTML.CharRef({
        html: "&gt;",
        str: ">"
      }) ]
    })), "\n                    ", HTML.TD({
      class: "btn-group-xs"
    }, "\n                        ", HTML.BUTTON({
      id: "new-seg-save",
      class: "btn btn-success btn-save glyphicon glyphicon-plus details",
      alt: "Delete segment",
      disabled: ""
    }), "\n                    "), "\n                "), "\n            "), "\n        "), "\n    "), "\n    " ];
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("loading")), "\n    " ];
  });
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_segments.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/user_segments/user_segments.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var UserSegment;
module.watch(require("/imports/api/user_segments/user_segments.js"), {
  UserSegment: function (v) {
    UserSegment = v;
  }
}, 0);
module.watch(require("./user_segments.html"));
Template.user_segments.onCreated(function () {
  var _this = this;

  this.autorun(function () {
    _this.subscription = _this.subscribe('segmentList', _this.userId, {
      onStop: function () {
        console.log("Segment List subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("Segment List subscription ready! ", arguments, this);
      }
    });
    console.log(_this.subscription);
  });
});
Template.user_segments.helpers({
  segmentList: function () {
    var s = UserSegment.find();
    return s.fetch();
  }
});
Template.user_segments.events({
  'keyup input.edit': _.debounce(function (event, instance) {
    var segid = $(event.target).closest("[data-segid]").data("segid");
    console.log(segid, $(event.target).closest("[data-segid]"));
    var s = UserSegment.findOne({
      _id: segid
    });
    var name = $("#seg-name-" + segid).val();
    var dscr = $("#seg-dscr-" + segid).val();
    s.update(name, dscr);
  }, 2000),
  'keyup input.new': _.debounce(function (event, instance) {
    if ($("#seg-name-new").val() !== "") {
      $("#new-seg-save").prop("disabled", false);
    } else {
      $("#new-seg-save").prop("disabled", true);
    }
  }, 2000),
  'click #new-seg-save': function (event, instance) {
    if ($("#seg-name-new").val() !== "") {
      var name = $("#seg-name-new").val();
      var dscr = $("#seg-dscr-new").val();
      Meteor.call('segment.createNewSegment', name, dscr);
      $("#seg-name-new").val("");
      $("#seg-dscr-new").val("");
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"verify":{"verify.html":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/verify/verify.html                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./template.verify.js"), {
  "*": module.makeNsSetter(true)
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.verify.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/verify/template.verify.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("verify");
Template["verify"] = new Template("Template.verify", (function() {
  var view = this;
  return HTML.Raw('<div class="container">\n        <p>\n        Your email address must be verified before you can access the app.\n        <a href="#" id="resend-verify">Click here</a> to resend verification email.\n        </p>\n        <button type="button" id="at-nav-button" onclick="AccountsTemplates.logout()" class="btn btn-default navbar-btn">Sign Out</button>\n    </div>');
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/pages/verify/verify.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
module.watch(require("./verify.html"));
Template.user_profile.onCreated(function () {
  var _this = this;

  this.autorun(function () {
    _this.subscription = _this.subscribe('userData', {
      onStop: function () {
        console.log("User profile subscription stopped! ", arguments, this);
      },
      onReady: function () {
        console.log("User profile subscription ready! ", arguments, this);
      }
    });
  });
});
Template.verify.events({
  'click #resend-verify': function (event, instance) {
    event.preventDefault();
    Meteor.call('user.sendVerificationEmail', function () {
      console.log('resent');
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"api":{"categories":{"categories.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/categories/categories.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Category: function () {
    return Category;
  },
  CategoryManager: function () {
    return CategoryManager;
  }
});
var Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  }
}, 0);
var check;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  }
}, 1);
var DefaultCategoryID = "xhKdwhacaWTcBTGPn";
var TypeStats = Class.create({
  name: 'TypeStats',
  fields: {
    num: {
      type: Number,
      "default": 0
    }
  }
});
var Category = Class.create({
  name: 'Category',
  collection: new Mongo.Collection('categories'),
  fields: {
    name: {
      type: String,
      "default": "the Unnamed Category"
    },
    description: {
      type: String,
      "default": "this is the default stuff for a Category"
    },
    stats: {
      type: Object,
      "default": function () {
        return {};
      }
    }
  },
  helpers: {
    addByType: function (type) {
      if (!this.getStatsByType(type)) {
        this.stats[type] = new TypeStats();
      }

      this.getStatsByType(type).num++;
      this.save();
    },
    removeByType: function (type) {
      if (!this.getStatsByType(type)) {
        return false;
      }

      this.getStatsByType(type).num--;
      this.save();
    },
    getStatsByType: function (type) {
      return this.stats[type];
    }
  },
  meteorMethods: {
    update: function (name, dscr) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
        this.name = name;
        this.description = dscr;
        console.log(this.save());
      }
    }
  }
});
Category.Default = Category.findOne({
  _id: DefaultCategoryID
});

if (typeof Category.Default === "undefined") {
  Category.Default = new Category({
    _id: DefaultCategoryID
  });

  if (Meteor.isServer) {
    Category.Default.save();
  }
}

var CategoryManager = Class.create({
  name: 'CategoryManager',
  fields: {
    Categories: {
      type: [String],
      "default": function () {
        return [];
      }
    },
    Type: {
      type: String,
      "default": "um... what!?"
    }
  },
  helpers: {
    length: function () {
      return this.Categories.length;
    },
    areIntersected: function (categoryManager) {
      for (var i = 0; i < this.Categories.length; i++) {
        for (var j = 0; j < categoryManager.Categories.length; i++) {
          if (this.Categories[i] == categoryManager.Categories[j]) {
            return true;
          }
        }
      }

      return false;
    },
    addCategory: function (category, type) {
      if (!type) {
        type = this.Type;
      }

      this.Categories.push(category._id);
      category.addByType(type);
    },
    hasCategory: function (category) {
      if (this.Categories.length == 0) {
        this.addCategory(Category.Default, this.Type);
      }

      return _.find(this.Categories, function (catId) {
        return category._id == catId;
      });
    },
    removeCategory: function (category, type, skipSlice) {
      var index = -1;

      _.each(this.Categories, function (catId, i) {
        if (catId == category._id) {
          index = i;
        }
      });

      if (index < 0) {
        return false;
      }

      if (!skipSlice) {
        if (index == 0) {
          this.Categories.shift();
        } else if (index == this.Categories.length - 1) {
          this.Categories.pop();
        } else {
          this.Categories = this.Categories.slice(0, index).concat(this.Categories.slice(index + 1));
        }
      }

      category.removeByType(type);
    }
  }
});

CategoryManager.OfType = function (type) {
  var c = new CategoryManager();
  c.Type = type;
  return c;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"individual_goals":{"individual_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/individual_goals/individual_goals.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  IndividualGoal: function () {
    return IndividualGoal;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var User;
module.watch(require("../users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 2);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 3);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 4);
var GoalComment;
module.watch(require("/imports/api/team_goals/team_goals.js"), {
  GoalComment: function (v) {
    GoalComment = v;
  }
}, 5);
var IndividualGoal = Class.create({
  name: 'IndividualGoal',
  collection: new Mongo.Collection('individual_goal'),
  fields: {
    userId: {
      type: String,
      "default": ''
    },
    title: {
      type: String,
      "default": ''
    },
    description: {
      type: String,
      "default": ''
    },
    parentId: {
      type: String,
      "default": ''
    },
    assignedToStr: {
      type: String,
      "transient": true
    },
    reachedDate: {
      type: Date,
      optional: true
    },
    startDate: {
      type: Date,
      optional: true
    },
    dueDate: {
      type: Date,
      optional: true
    },
    reviewDate: {
      type: Date,
      optional: true
    },
    reviewedOnDate: {
      type: Date,
      optional: true
    },
    goalComments: {
      type: [GoalComment],
      "default": []
    },
    reviewComments: {
      type: [GoalComment],
      "default": []
    },
    teamId: {
      type: String,
      "default": ""
    },
    privacy: {
      type: String,
      "default": 'private'
    },
    createdBy: {
      type: String,
      "default": ''
    }
  },
  behaviors: {
    timestamp: {}
  },
  helpers: {
    getGoalRoleGroup: function () {
      return this.teamName + '+' + this._id;
    },
    userIsAdmin: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.teamName) || Roles.userIsInRole(Meteor.userId(), 'admin', this.getGoalRoleGroup())) {
        //user is either a global admin, a team admin, or a goal admin
        return true;
      } else {
        return false;
      }
    },
    userIsMentor: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'mentor', this.getGoalRoleGroup())) {
        //user is a mentor for this goal
        return true;
      } else {
        return false;
      }
    },
    userIsAssigned: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'assigned', this.getGoalRoleGroup())) {
        //user is assigned to this goal
        return true;
      } else {
        return false;
      }
    },
    setDateField: function (fieldName, rdate) {
      if (typeof rdate === "undefined") {
        rdate = new Date();
      } else if (!(rdate instanceof Date)) {
        return false;
      }

      this[fieldName] = rdate;
      return true;
    },
    getUserFullNameX: function (userId) {
      var u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      var name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },
    hasModifyPerm: function (fieldName) {
      switch (fieldName) {
        //admins-only fields
        case 'dueDate':
        case 'startDate':
        case 'reachedDate':
        case 'reviewDate':
        case 'title':
        case 'description':
        case 'assignedTo':
        case 'mentors':
        case 'admins':
        case 'subgoals':
          return this.userIsAdmin();
          break;
        //admins and mentors

        case 'reviewedOnDate':
        case 'reviewComments':
          return this.userIsAdmin() || this.userIsMentor();
          break;
        //anyone assigned to the goal

        case 'goalComments':
          return this.userIsAdmin() || this.userIsMentor() || this.userIsAssigned();
          break;

        case 'teamId':
        case 'privacy':
          return true;
          break;

        default:
          return false;
          break;
      }
    },
    notifyNew: function (oldList, newList) {
      var diffList = _.difference(newList, oldList);

      for (var i = 0; i < diffList.length; i++) {
        UserNotify.add({
          userId: diffList[i],
          title: 'Goals',
          body: 'You have been added to goal ' + this.title,
          action: 'teamgoals:' + this.teamName
        });
      }
    }
  },
  events: {
    beforeSave: function (e) {
      /*
      let egoal = e.currentTarget;
       //any user added to a goal is automatically added to the 'view-goals' role for the team
      //if they are already in that role, this should just ignore the redundant addUser
      let flds = ["assignedTo","mentors","admins"];
      for (let i in flds) {
          if (Array.isArray(egoal[flds[i]]) && egoal[flds[i]].length > 0) {
              Roles.addUsersToRoles(egoal[flds[i]], 'view-goals', egoal.teamName);
          }
      }
      */
    }
  },
  meteorMethods: {
    setDueDate: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("dueDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setGoalReached: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reachedDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setReviewDate: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setGoalReviewedOn: function (rdate) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewedOnDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    addComment: function (commentTxt) {
      //mentors, admins, and assignees
      if (!this.userIsAdmin() && !this.userIsMentor() && !this.userIsAssigned()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.goalComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },
    addReviewComment: function (commentTxt) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.reviewComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },
    createNewGoal: function () {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      } //

    },
    setTitle: function (title) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.title = title;
      this.save();
    },
    setDescription: function (descr) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.description = descr;
      this.save();
    },
    setAssignedTo: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.assignedTo, ulist);
      this.assignedTo = ulist;
      this.save();
    },
    setMentors: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.mentors, ulist);
      this.mentors = ulist;
      this.save();
    },
    setAdmins: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.admins, ulist);
      this.admins = ulist;
      this.save();
    },
    getUserFullName: function (userId) {
      var invocation = DDP._CurrentInvocation.get();

      if (invocation.isSimulation) {
        return "George";
      }

      var u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      var name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },
    updateFromObj: function (updObj) {
      var permError = false;

      for (var fld in meteorBabelHelpers.sanitizeForInObject(updObj)) {
        if (this[fld] !== updObj[fld] || Array.isArray(updObj[fld]) && _.isEqual(this[fld], updObj[fld])) {
          if (this.hasModifyPerm(fld)) {
            if (fld === "assignedTo" || fld === "mentors" || fld === "admins") {
              this.notifyNew(this[fld], updObj[fld]);
            }

            this[fld] = updObj[fld];
          } else {
            permError = true;
          }
        }
      }

      this.save();

      if (permError) {
        throw new Meteor.Error(403, "You are not authorized");
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"learn_share":{"learn_share.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/learn_share/learn_share.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  LearnShareSession: function () {
    return LearnShareSession;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 3);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 4);
var fs = {};

if (Meteor.isServer) {
  fs = Npm.require('fs');
}

var LSUser = Class.create({
  name: 'LSUser',
  fields: {
    id: {
      type: String,
      "default": ''
    },
    name: {
      type: String,
      "default": 'John Doe'
    }
  }
});
var LearnShareSession = Class.create({
  name: "LearnShareSession",
  collection: new Mongo.Collection('learn_share'),
  fields: {
    title: {
      type: String,
      "default": "unnamed Learn/Share session"
    },
    notes: {
      type: String,
      "default": "duly noted"
    },
    participants: {
      type: [LSUser],
      "default": []
    },
    guests: {
      type: [LSUser],
      "default": []
    },
    presenters: {
      type: [LSUser],
      "default": []
    },
    state: {
      type: String,
      "default": "active"
    },
    skypeUrl: {
      type: String,
      "default": ""
    },
    teamId: {
      type: String,
      "default": ""
    }
  },
  behaviors: {
    timestamp: {}
  },
  meteorMethods: {
    addPresenter: function (user) {
      if ("locked" === this.state) {
        return;
      }

      var lsUser = new LSUser(user); //check for duplicate

      if (typeof _.find(this.presenters, function (o) {
        return o.id === lsUser.id;
      }) !== "undefined") {
        return false;
      }

      this.presenters.push(lsUser);
      return this.save();
    },
    addParticipant: function (user) {
      if ("locked" === this.state) {
        return;
      }

      var lsUser = new LSUser(user); //check for duplicate

      if (typeof _.find(this.participants, function (o) {
        return o.id === lsUser.id;
      }) !== "undefined") {
        return false;
      }

      this.participants.push(lsUser);
      UserNotify.add({
        userId: lsUser.id,
        title: 'Learn/Share',
        body: 'You have been added to a Learn/Share session',
        action: 'learnshare:' + this._id
      });
      return this.save();
    },
    removeParticipant: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.participants = _.filter(this.participants, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removeGuest: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.guests = _.filter(this.guests, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    removePresenter: function (userId) {
      if ("locked" === this.state) {
        return;
      }

      this.presenters = _.filter(this.presenters, function (o) {
        return o.id !== userId;
      });
      return this.save();
    },
    addParticipantSelf: function () {
      if ("locked" === this.state) {
        return;
      }

      if (Meteor.userId()) {
        //check for duplicate
        if (typeof _.find(this.participants, function (o) {
          return o.id === Meteor.userId();
        }) === "undefined") {
          var u = User.findOne({
            _id: Meteor.userId()
          });

          if (!u) {
            throw new Meteor.Error(403, "You are not authorized");
          } else {
            var lsu = new LSUser({
              id: Meteor.userId(),
              name: u.MyProfile.firstName + " " + u.MyProfile.lastName
            });
            this.participants.push(lsu);
            this.save();
          }
        }
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    saveGuest: function (guestId, guestName) {
      if ("locked" === this.state) {
        return;
      }

      var guestObj = _.find(this.guests, function (o) {
        return o.id === guestId;
      });

      if ("undefined" !== typeof guestObj) {
        console.log("already a guest");
        this.guests = _.filter(this.guests, function (o) {
          return o.id !== guestId;
        });
        guestObj.name = guestName;
      } else {
        console.log("not a guest");
        guestObj = new LSUser({
          id: guestId,
          name: guestName
        });
      }

      this.guests.push(guestObj);
      this.save();
    },
    saveText: function (title, notes) {
      if ("locked" === this.state) {
        return;
      }

      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.title = title;
        this.notes = notes;
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    lockSession: function (title, notes) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.state = "locked";
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    unlockSession: function (title, notes) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.state = "active";
        this.save();
      } else {
        throw new Meteor.Error(403, "You are not authorized");
      }
    },
    setSkypeUrl: function (url) {
      if (Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        this.skypeUrl = url;
        this.save();
      }
    },
    uploadRecording: function (fileInfo, fileData) {
      if (Meteor.isServer && Roles.userIsInRole(Meteor.userId(), ['admin', 'learn-share-host'], Roles.GLOBAL_GROUP)) {
        var uploadPath = '/uploads/';
        fs.writeFile(uploadPath + this._id + ".mp4", fileData, 'binary', function (err) {
          console.log("File written.", err);
        });
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"questions":{"questions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/questions/questions.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Question: function () {
    return Question;
  },
  Reading: function () {
    return Reading;
  },
  MyersBriggsCategory: function () {
    return MyersBriggsCategory;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var check;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  }
}, 3);
var User;
module.watch(require("../users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 4);
var Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults: function (v) {
    Defaults = v;
  }
}, 5);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 6);
var MyersBriggsCategory = Enum.create({
  name: 'MyersBriggsCategory',
  identifiers: ['IE', 'NS', 'TF', 'JP']
});
var Reading = Class.create({
  name: 'Reading',
  fields: {
    Rank: {
      type: Number,
      "default": 0,
      validators: [{
        type: 'lte',
        resolveParam: function () {
          return 50;
        }
      }, {
        type: 'gte',
        resolveParam: function () {
          return -50;
        }
      }]
    },
    Text: {
      type: String,
      "default": 'Well, you feel...'
    }
  }
});
var PolarStats = Class.create({
  name: 'PolarStats',
  fields: {
    LeftSum: {
      type: Number,
      "default": 0
    },
    RightSum: {
      type: Number,
      "default": 0
    }
  },
  helpers: {
    reset: function () {
      this.LeftSum = 0;
      this.RightSum = 0;
    }
  }
});
var Question = Class.create({
  name: "Question",
  collection: new Mongo.Collection('questions'),
  fields: {
    Category: {
      type: MyersBriggsCategory,
      "default": 'IE'
    },
    Categories: {
      type: [MyersBriggsCategory],
      "default": []
    },
    Text: {
      type: String,
      "default": 'Whoa! What we askin\' here?'
    },
    LeftText: {
      type: String,
      "default": 'Whoa! What we askin\' here?'
    },
    RightText: {
      type: String,
      "default": 'Whoa! What we askin\' here?'
    },
    Readings: {
      type: [Reading],
      "default": function () {
        return [{
          Rank: -50,
          Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."
        }, {
          Rank: -49,
          Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."
        }, {
          Rank: -40,
          Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "
        }, {
          Rank: -30,
          Text: "This is your most common behavior, but there are definitely times you've done the opposite."
        }, {
          Rank: -20,
          Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."
        }, {
          Rank: -10,
          Text: "You don't have much of a preference either way, but this side sounds a bit more likely."
        }, {
          Rank: 10,
          Text: "You don't have much of a preference either way, but this side sounds a bit more likely."
        }, {
          Rank: 20,
          Text: "This is a good default choice for you, but time and circumstance could easily find you doing the other."
        }, {
          Rank: 30,
          Text: "This is your most common behavior, but there are definitely times you've done the opposite."
        }, {
          Rank: 40,
          Text: "You can think of cases where you have done things the other way, but not under normal circumstances. "
        }, {
          Rank: 49,
          Text: "There may be a possible scenerio where the reverse may apply, but it would be really rare."
        }, {
          Rank: 50,
          Text: "You will ALWAYS Do this. Doing otherwise is inconceivable to you."
        }];
      }
    },
    segments: {
      type: [String],
      "default": []
    },
    Active: {
      type: Boolean,
      "default": false
    },
    CreatedBy: {
      type: String,
      "default": function () {
        return Meteor.userId();
      }
    },
    TimesAnswered: {
      type: PolarStats,
      "default": function () {
        return new PolarStats();
      }
    },
    SumOfAnswers: {
      type: PolarStats,
      "default": function () {
        return new PolarStats();
      }
    }
  },
  meteorMethods: {
    getUser: function () {
      var u = User.findOne({
        _id: this.CreatedBy
      });
      return u;
    }
  },
  helpers: {
    addAnswer: function (answer) {
      if (answer.Value < 0) {
        this.TimesAnswered.LeftSum++;
        this.SumOfAnswers.LeftSum += answer.Value;
      } else {
        this.TimesAnswered.RightSum++;
        this.SumOfAnswers.RightSum += answer.Value;
      }

      this.save();
    },
    removeAnswer: function (answer) {
      if (answer.Value < 0) {
        this.TimesAnswered.LeftSum--;

        if (this.TimesAnswered.LeftSum <= 0) {
          this.TimesAnswered.LeftSum = 0;
          this.SumOfAnswers.LeftSum = 0;
        } else {
          this.SumOfAnswers.LeftSum -= answer.Value;
        }
      } else {
        this.TimesAnswered.RightSum--;

        if (this.TimesAnswered.RightSum <= 0) {
          this.TimesAnswered.RightSum = 0;
          this.SumOfAnswers.RightSum = 0;
        } else {
          this.SumOfAnswers.RightSum -= answer.Value;
        }
      }

      this.save();
    },
    allAnsweredUsers: function () {
      return User.find({
        'MyProfile.UserType.AnsweredQuestions.QuestionID': {
          $eq: this._id
        }
      });
    },
    unanswerAll: function (noSave) {
      var self = this;
      self.allAnsweredUsers().forEach(function (user) {
        var b = user.MyProfile.UserType.AnsweredQuestions.length;
        user.MyProfile.UserType.unAnswerQuestion(user.MyProfile.UserType.getAnswerForQuestion(self._id), false);

        if (!noSave) {
          user.save();
        }
      });
      this.reset();
    },
    reset: function () {
      this.TimesAnswered.reset();
      this.SumOfAnswers.reset();
      this.save();
    }
  },
  behaviors: {
    timestamp: {},
    softremove: {}
  },
  secured: {
    update: false
  },
  events: {
    beforeInsert: function (e) {
      var u = User.findOne({
        username: Defaults.user.username
      });
      UserNotify.add({
        userId: u._id,
        title: 'Questions',
        body: 'New question added',
        action: 'questions:' + e.currentTarget._id
      });
    },
    beforeUpdate: function (e) {
      var allowed = ['updatedAt', 'TimesAnswered', 'TimesAnswered.LeftSum', 'SumOfAnswers', 'SumOfAnswers.LeftSum', 'TimesAnswered.RightSum', 'SumOfAnswers.RightSum'];
      var doc = e.currentTarget;
      var fieldNames = doc.getModified();

      _.each(fieldNames, function (fieldName) {
        if (!Meteor.isServer && allowed.indexOf(fieldName) < 0 && !Roles.userIsInRole(Meteor.userId(), ['admin'], Roles.GLOBAL_GROUP)) {
          throw new Meteor.Error(403, "You are not authorized");
        }
      });
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"team_goals":{"team_goals.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/team_goals/team_goals.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  TeamGoal: function () {
    return TeamGoal;
  },
  GoalComment: function () {
    return GoalComment;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var User;
module.watch(require("../users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 2);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 3);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 4);
var GoalComment = Class.create({
  name: 'GoalComment',
  fields: {
    userId: {
      type: String,
      "default": function () {
        return Meteor.userId();
      }
    },
    date: {
      type: Date,
      "default": function () {
        return new Date();
      }
    },
    text: {
      type: String,
      "default": ''
    }
  }
});
var TeamGoal = Class.create({
  name: 'TeamGoal',
  collection: new Mongo.Collection('team_goal'),
  fields: {
    teamName: {
      type: String,
      "default": ''
    },
    title: {
      type: String,
      "default": ''
    },
    description: {
      type: String,
      "default": ''
    },
    parentId: {
      type: String,
      "default": ''
    },
    assignedTo: {
      type: [String],
      "default": []
    },
    mentors: {
      type: [String],
      "default": []
    },
    assignedToStr: {
      type: String,
      "transient": true
    },
    mentorsStr: {
      type: String,
      "transient": true
    },
    adminsStr: {
      type: String,
      "transient": true
    },
    admins: {
      type: [String],
      "default": []
    },
    reachedDate: {
      type: Date,
      optional: true
    },
    startDate: {
      type: Date,
      optional: true
    },
    dueDate: {
      type: Date,
      optional: true
    },
    reviewDate: {
      type: Date,
      optional: true
    },
    reviewedOnDate: {
      type: Date,
      optional: true
    },
    goalComments: {
      type: [GoalComment],
      "default": []
    },
    reviewComments: {
      type: [GoalComment],
      "default": []
    }
  },
  behaviors: {
    timestamp: {}
  },
  helpers: {
    getGoalRoleGroup: function () {
      return this.teamName + '+' + this._id;
    },
    userIsAdmin: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.teamName) || Roles.userIsInRole(Meteor.userId(), 'admin', this.getGoalRoleGroup())) {
        //user is either a global admin, a team admin, or a goal admin
        return true;
      } else {
        return false;
      }
    },
    userIsMentor: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'mentor', this.getGoalRoleGroup())) {
        //user is a mentor for this goal
        return true;
      } else {
        return false;
      }
    },
    userIsAssigned: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'assigned', this.getGoalRoleGroup())) {
        //user is assigned to this goal
        return true;
      } else {
        return false;
      }
    },
    setDateField: function (fieldName, rdate) {
      if (typeof rdate === "undefined") {
        rdate = new Date();
      } else if (!(rdate instanceof Date)) {
        return false;
      }

      this[fieldName] = rdate;
      return true;
    },
    getUserFullNameX: function (userId) {
      var u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      var name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },
    hasModifyPerm: function (fieldName) {
      switch (fieldName) {
        //admins-only fields
        case 'dueDate':
        case 'startDate':
        case 'reachedDate':
        case 'reviewDate':
        case 'title':
        case 'description':
        case 'assignedTo':
        case 'mentors':
        case 'admins':
        case 'subgoals':
          return this.userIsAdmin();
          break;
        //admins and mentors

        case 'reviewedOnDate':
        case 'reviewComments':
          return this.userIsAdmin() || this.userIsMentor();
          break;
        //anyone assigned to the goal

        case 'goalComments':
          return this.userIsAdmin() || this.userIsMentor() || this.userIsAssigned();
          break;

        default:
          return false;
          break;
      }
    },
    notifyNew: function (oldList, newList) {
      var diffList = _.difference(newList, oldList);

      for (var i = 0; i < diffList.length; i++) {
        UserNotify.add({
          userId: diffList[i],
          title: 'Team Goals',
          body: 'You have been added to goal ' + this.title,
          action: 'teamgoals:' + this.teamName
        });
      }
    }
  },
  events: {
    beforeSave: function (e) {
      var egoal = e.currentTarget; //any user added to a goal is automatically added to the 'view-goals' role for the team
      //if they are already in that role, this should just ignore the redundant addUser

      var flds = ["assignedTo", "mentors", "admins"];

      for (var i in meteorBabelHelpers.sanitizeForInObject(flds)) {
        if (Array.isArray(egoal[flds[i]]) && egoal[flds[i]].length > 0) {
          Roles.addUsersToRoles(egoal[flds[i]], 'view-goals', egoal.teamName);
        }
      }
    }
  },
  meteorMethods: {
    setDueDate: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("dueDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setGoalReached: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reachedDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setReviewDate: function (rdate) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    setGoalReviewedOn: function (rdate) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      if (this.setDateField("reviewedOnDate", rdate)) {
        this.save();
      } else {
        throw new Meteor.Error(403, "Invalid date");
      }
    },
    addComment: function (commentTxt) {
      //mentors, admins, and assignees
      if (!this.userIsAdmin() && !this.userIsMentor() && !this.userIsAssigned()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.goalComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },
    addReviewComment: function (commentTxt) {
      //mentors and admins
      if (!this.userIsAdmin() && !this.userIsMentor()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.reviewComments.push(new GoalComment({
        userId: Meteor.userId(),
        date: new Date(),
        text: commentTxt
      }));
      this.save();
    },
    createNewGoal: function () {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      } //

    },
    setTitle: function (title) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.title = title;
      this.save();
    },
    setDescription: function (descr) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.description = descr;
      this.save();
    },
    setAssignedTo: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.assignedTo, ulist);
      this.assignedTo = ulist;
      this.save();
    },
    setMentors: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.mentors, ulist);
      this.mentors = ulist;
      this.save();
    },
    setAdmins: function (ulist) {
      //admins only
      if (!this.userIsAdmin()) {
        throw new Meteor.Error(403, "You are not authorized");
      }

      this.notifyNew(this.admins, ulist);
      this.admins = ulist;
      this.save();
    },
    getUserFullName: function (userId) {
      var invocation = DDP._CurrentInvocation.get();

      if (invocation.isSimulation) {
        return "George";
      }

      var u = User.findOne({
        _id: userId
      });

      if (!u) {
        return "Michael";
      }

      var name = u.MyProfile.firstName + " " + u.MyProfile.lastName;
      return name;
    },
    updateFromObj: function (updObj) {
      var permError = false;

      for (var fld in meteorBabelHelpers.sanitizeForInObject(updObj)) {
        if (this[fld] !== updObj[fld] || Array.isArray(updObj[fld]) && _.isEqual(this[fld], updObj[fld])) {
          if (this.hasModifyPerm(fld)) {
            if (fld === "assignedTo" || fld === "mentors" || fld === "admins") {
              this.notifyNew(this[fld], updObj[fld]);
            }

            this[fld] = updObj[fld];
          } else {
            permError = true;
          }
        }
      }

      this.save();

      if (permError) {
        throw new Meteor.Error(403, "You are not authorized");
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"teams":{"teams.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/teams/teams.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Team: function () {
    return Team;
  },
  TeamIcon: function () {
    return TeamIcon;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var check;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  }
}, 3);
var User;
module.watch(require("../users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 4);
var Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults: function (v) {
    Defaults = v;
  }
}, 5);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 6);
var DefaultTeamID = "NCuypCXN47KrSTeXh";
var TeamIcon = Class.create({
  name: "TeamIcon",
  fields: {
    data: {
      type: String,
      "default": ''
    },
    contentType: {
      type: String,
      "default": 'image/png'
    }
  }
});
var Team = Class.create({
  name: "Team",
  collection: new Mongo.Collection('teams'),
  fields: {
    Name: {
      type: String,
      "default": 'Whoa! The no-name team?'
    },
    Description: {
      type: String,
      "default": 'This team is nondescript.'
    },
    Icon64: {
      type: String,
      "default": ''
    },
    IconType: {
      type: String,
      defaut: 'image/png',
      optional: true
    },
    Icon: {
      type: TeamIcon,
      "default": function () {
        return new TeamIcon();
      }
    },
    Public: {
      type: Boolean,
      "default": true
    },
    Members: {
      type: [String],
      "default": []
    },
    Active: {
      type: Boolean,
      "default": false
    },
    CreatedBy: {
      type: String,
      "default": function () {
        return this.userId;
      }
    }
  },
  indexes: {
    nameIndex: {
      fields: {
        Name: 1
      },
      options: {
        unique: true
      }
    }
  },
  meteorMethods: {
    userRequestJoin: function () {
      Roles.addUsersToRoles(Meteor.userId(), 'user-join-request', this.Name);
    },
    adminRequestUserJoin: function (user) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name) && !Roles.userIsInRole(user, 'member', this.Name)) {
        Roles.addUsersToRoles(user, 'admin-join-request', this.Name);

        for (var i = 0; i < user.length; i++) {
          UserNotify.add({
            userId: user[i],
            title: 'Teams',
            body: 'Received join request for team ' + this.Name,
            action: 'teams:' + this.Name.split(' ').join('-')
          });
        }
      }
    },
    userAcceptJoin: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
        Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
        this.addUsers(Meteor.userId());
      }
    },
    userDeclineJoin: function () {
      if (Roles.userIsInRole(Meteor.userId(), 'admin-join-request', this.Name)) {
        Roles.removeUsersFromRoles(Meteor.userId(), 'admin-join-request', this.Name);
      }
    },
    adminAcceptJoin: function (userId) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, 'user-join-request', this.Name); //Roles.addUsersToRoles(userId, 'member', this.Name);

        this.addUsers(userId);
      }
    },
    adminRejectJoin: function (userId) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, 'user-join-request', this.Name);
      }
    },
    addRole: function (userId, role) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.addUsersToRoles(userId, role, this.Name);
      }
    },
    removeRole: function (userId, role) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        Roles.removeUsersFromRoles(userId, role, this.Name);
      }
    },
    updateFromObj: function (updObj) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin', this.Name)) {
        for (var fld in meteorBabelHelpers.sanitizeForInObject(updObj)) {
          if ("Icon64" !== fld && "IconType" !== fld && "Icon" !== fld) {
            this[fld] = updObj[fld];
          }
        }

        this.save();
      }
    },
    uploadIcon: function (fileInfo, fileData) {
      if (Meteor.isServer) {
        var base64Image = new Buffer(fileData, 'binary').toString('base64');
        this.Icon64 = base64Image;
        this.IconType = 'image/png';
        this.save();
      }
    }
  },
  helpers: {
    addUsers: function (users) {
      var _this = this;

      if (typeof users === 'string') {
        users = [users];
      } //admin list has to be filtered because getUsersInRole includes admin in GLOBAL_GROUP


      var groupAdminList = Roles.getUsersInRole('admin', this.Name).fetch().filter(function (user) {
        return "undefined" !== typeof user.roles && "undefined" !== typeof user.roles[_this.Name] && user.roles[_this.Name].indexOf('admin') > -1;
      });

      for (var i = 0; i < users.length; i++) {
        if (this.Members.indexOf(users[i]) === -1) {
          this.Members.push(users[i]);
        }

        var currUserRoles = ['member']; //Roles.addUsersToRoles(users[i], 'member', this.Name);
        //if team doesn't have an admin, the first user added becomes admin

        if (i == 0 && groupAdminList.length == 0) {
          //Roles.addUsersToRoles(users[i], 'admin', this.Name);
          currUserRoles.push('admin');
        } else {
          //Roles.addUsersToRoles(users[i], Defaults.role.name, this.Name);
          currUserRoles.push(Defaults.role.name);
        }

        Roles.addUsersToRoles(users[i], currUserRoles, this.Name);
        /*
        let u = User.findOne( {_id: users[i]} );
        if (u && u.teams.indexOf(this.Name) === -1) {
            u.teams.push(this.Name);
            u.save();
        }
        */
      }

      this.save();
    },
    removeUsers: function (users) {
      if (typeof users === 'string') {
        users = [users];
      }

      for (var i = 0; i < users.length; i++) {}
    },
    removeUsersFromTeamRoles: function (users, roles) {
      if (typeof users === 'string') {
        users = [users];
      }

      if (typeof roles === 'string') {
        roles = [roles];
      } //if removing the 'member' role from users, completely remove them from all roles and from the group


      if (roles.indexOf('member') !== -1) {
        this.removeUsers(users);
      }

      for (var i = 0; i < users.length; i++) {}
    }
  },
  behaviors: {
    timestamp: {},
    softremove: {}
  },
  secured: {},
  events: {
    afterInit: function (e) {//
    },
    beforeSave: function (e) {
      console.log("before save Team", e.currentTarget.Name, e.currentTarget.Members);
    }
  }
});
Team.Default = Team.findOne({
  _id: DefaultTeamID
});

if (typeof Team.Default === "undefined") {
  Team.Default = new Team({
    _id: DefaultTeamID,
    Name: 'No Team',
    Active: true
  });

  if (Meteor.isServer) {
    Team.Default.CreatedBy = 'kkcDYH3ix4f4Lb5qk'; //console.log(Team.Default);
    //Team.Default.save();
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"type_readings":{"type_readings.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/type_readings/type_readings.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  TypeReading: function () {
    return TypeReading;
  },
  ReadingRange: function () {
    return ReadingRange;
  },
  TypeReadingCategory: function () {
    return TypeReadingCategory;
  },
  TypeReadingCategories: function () {
    return TypeReadingCategories;
  }
});
var Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  }
}, 0);
var check;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  }
}, 1);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 2);
var MyersBriggsCategory;
module.watch(require("../questions/questions.js"), {
  MyersBriggsCategory: function (v) {
    MyersBriggsCategory = v;
  }
}, 3);
var Category, CategoryManager;
module.watch(require("../categories/categories.js"), {
  Category: function (v) {
    Category = v;
  },
  CategoryManager: function (v) {
    CategoryManager = v;
  }
}, 4);
var ReadingRange = Class.create({
  name: "ReadingRange",
  fields: {
    high: {
      type: Number,
      "default": 50
    },
    low: {
      type: Number,
      "default": 0
    },
    Delta: {
      type: Number,
      "default": 50
    }
  },
  helpers: {
    "in": function (val) {
      return this.low <= val && val <= this.high;
    },
    setDelta: function () {
      this.Delta = this.high - this.low;
      return this;
    }
  }
});

ReadingRange.Create = function (high, low) {
  var m = new ReadingRange();
  m.high = high;
  m.low = low;
  return m.setDelta();
};

ReadingRange.FullHigh = function () {
  return ReadingRange.Create(50, 0);
};

ReadingRange.FullLow = function () {
  return ReadingRange.Create(0, -50);
};

var TypeReadingCategory = Class.create({
  name: "TypeReadingCategory",
  fields: {
    MyersBriggsCategory: {
      type: MyersBriggsCategory
    },
    Range: {
      type: ReadingRange,
      "default": function () {
        return ReadingRange.FullHigh;
      }
    }
  }
});
var TypeReadingCategories = Class.create({
  name: "TypeReadingCategories",
  fields: {
    0: {
      type: TypeReadingCategory,
      optional: true
    },
    1: {
      type: TypeReadingCategory,
      optional: true
    },
    2: {
      type: TypeReadingCategory,
      optional: true
    },
    3: {
      type: TypeReadingCategory,
      optional: true
    }
  }
});
var TypeReading = Class.create({
  name: "TypeReading",
  collection: new Mongo.Collection('type_readings'),
  fields: {
    TypeReadingCategories: {
      type: TypeReadingCategories,
      "default": {}
    },
    Categories: {
      type: CategoryManager,
      "default": function () {
        return CategoryManager.OfType("TypeReading");
      }
    },
    Header: {
      type: String,
      "default": ""
    },
    Body: {
      type: String,
      "default": ""
    },
    CreatedBy: {
      type: String,
      "default": function () {
        return Meteor.userId();
      }
    },
    Enabled: {
      type: Boolean,
      "default": false
    }
  },
  helpers: {
    toggle: function () {
      this.Enabled = !this.Enabled;
      this.save();
    },
    addTypeCategory: function (cat) {
      this.TypeReadingCategories[cat.MyersBriggsCategory] = cat;
    }
  },
  events: {
    beforeSave: function (e) {
      _.forEach(e.target.TypeReadingCategories, function (reading) {
        if (reading == null) {
          return;
        }

        reading.Range.setDelta();
      });

      if (e.target.Categories.length() < 1) {
        e.target.Categories.addCategory(Category.Default);
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_feedback":{"user_feedback.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_feedback/user_feedback.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserFeedback: function () {
    return UserFeedback;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var UserFeedback = Class.create({
  name: 'UserFeedback',
  collection: new Mongo.Collection('user_feedback'),
  fields: {
    userId: {
      type: String,
      "default": ''
    },
    source: {
      type: String,
      "default": ''
    },
    context: {
      type: String,
      "default": ''
    },
    comment: {
      type: String,
      "default": ''
    },
    dateCreated: {
      type: Date,
      "default": function () {
        return new Date();
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_notify":{"user_notify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_notify/user_notify.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserNotify: function () {
    return UserNotify;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var User;
module.watch(require("../users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 3);
var Email;
module.watch(require("meteor/email"), {
  Email: function (v) {
    Email = v;
  }
}, 4);
var UserNotify = Class.create({
  name: "UserNotify",
  collection: new Mongo.Collection('user_notify'),
  fields: {
    userId: {
      type: String,
      "default": ''
    },
    isRead: {
      type: Boolean,
      "default": false
    },
    isPushed: {
      type: Boolean,
      "default": false
    },
    isEmailed: {
      type: Boolean,
      "default": false
    },
    title: {
      type: String,
      "default": ''
    },
    body: {
      type: String,
      "default": ''
    },
    action: {
      type: String,
      "default": ''
    },
    createdDate: {
      type: Date,
      "default": function () {
        return new Date();
      }
    }
  },
  meteorMethods: {
    markRead: function () {
      this.isRead = true;
      this.save();
    },
    markNotified: function () {
      this.isPushed = true;
      this.save();
    }
  },
  helpers: {
    test: function () {
      console.log("123");
    },
    pushNotify: function (opts) {
      var noteOpts = {
        body: this.body,
        icon: '/img/panda.png',
        data: this._id
      };
      var browserNote;

      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          browserNote = new Notification(this.title, noteOpts);
        } // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
              // If the user accepts, let's create a notification
              if (permission === "granted") {
                browserNote = new Notification(this.title, noteOpts);
              }
            });
          }

      if (Notification.permission === "granted" && typeof opts.onclick !== 'undefined') {
        browserNote.onclick = opts.onclick;
      }
    }
  },
  events: {
    beforeSave: function (e) {
      if (Meteor.isServer) {
        var note = e.currentTarget;

        if (!note.isEmailed) {
          var u = User.findOne({
            _id: note.userId
          });

          if (u) {
            var addr = u.emails[0].address;
            Email.send({
              to: addr,
              from: "wayne@paladinarcher.com",
              subject: "Developer Level Notification - " + note.title,
              text: note.body
            });
          }
        }
      }
    }
  }
});

if (Meteor.isClient) {//
}

UserNotify.add = function (opts) {
  var notify = new UserNotify(opts);
  notify.save();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"user_segments":{"user_segments.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/user_segments/user_segments.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  UserSegment: function () {
    return UserSegment;
  }
});
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 1);
var Class, Enum;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  },
  Enum: function (v) {
    Enum = v;
  }
}, 2);
var UserSegment = Class.create({
  name: 'UserSegment',
  collection: new Mongo.Collection('user_segments'),
  fields: {
    name: {
      type: String,
      "default": 'Default user segment'
    },
    description: {
      type: String,
      "default": 'The default user segment for relevant content'
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"users":{"users.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/users/users.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  User: function () {
    return User;
  },
  Profile: function () {
    return Profile;
  },
  UserType: function () {
    return UserType;
  },
  MyersBriggs: function () {
    return MyersBriggs;
  },
  Answer: function () {
    return Answer;
  }
});
var Class;
module.watch(require("meteor/jagi:astronomy"), {
  Class: function (v) {
    Class = v;
  }
}, 0);
var check;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  }
}, 1);
var MyersBriggsCategory, Question;
module.watch(require("../questions/questions.js"), {
  MyersBriggsCategory: function (v) {
    MyersBriggsCategory = v;
  },
  Question: function (v) {
    Question = v;
  }
}, 2);
var Category, CategoryManager;
module.watch(require("../categories/categories.js"), {
  Category: function (v) {
    Category = v;
  },
  CategoryManager: function (v) {
    CategoryManager = v;
  }
}, 3);
var Defaults;
module.watch(require("../../startup/both/defaults.js"), {
  Defaults: function (v) {
    Defaults = v;
  }
}, 4);
var Team;
module.watch(require("../teams/teams.js"), {
  Team: function (v) {
    Team = v;
  }
}, 5);
var UserSegment;
module.watch(require("../user_segments/user_segments.js"), {
  UserSegment: function (v) {
    UserSegment = v;
  }
}, 6);
var MyersBriggsBit = Class.create({
  name: 'MyersBriggsBit',
  fields: {
    Value: {
      type: Number,
      "default": 0
    },
    Totals: {
      type: Number,
      "default": 0
    },
    QuestionCount: {
      type: Number,
      "default": 0
    }
  },
  helpers: {
    addValue: function (value) {
      this.Totals += value;
      this.QuestionCount++;
      this.Value = this.QuestionCount == 0 ? 0 : this.Totals / this.QuestionCount;
    },
    removeValue: function (value) {
      this.QuestionCount--;

      if (this.QuestionCount < 0) {
        this.QuestionCount = 0;
      }

      if (this.QuestionCount == 0) {
        this.Totals = this.Value = 0;
        return;
      }

      this.Totals -= value;
      this.Value = this.Totals / this.QuestionCount;
    },
    reset: function () {
      this.Totals = 0;
      this.QuestionCount = 0;
      this.Value = 0;
    }
  }
});
var MyersBriggs = Class.create({
  name: 'MyersBriggs',
  fields: {
    IE: {
      type: MyersBriggsBit,
      "default": function () {
        return new MyersBriggsBit();
      }
    },
    NS: {
      type: MyersBriggsBit,
      "default": function () {
        return new MyersBriggsBit();
      }
    },
    TF: {
      type: MyersBriggsBit,
      "default": function () {
        return new MyersBriggsBit();
      }
    },
    JP: {
      type: MyersBriggsBit,
      "default": function () {
        return new MyersBriggsBit();
      }
    }
  },
  helpers: {
    addByCategory: function (category, value) {
      console.log(category, value);
      var name = this.getIdentifierById(category);
      this[name].addValue(value);
    },
    removeByCategory: function (category, value) {
      var name = this.getIdentifierById(category);
      this[name].removeValue(value);
    },
    getIdentifierById: function (categoryId) {
      if (categoryId === 0) {
        return 'IE';
      }

      if (categoryId === 1) {
        return 'NS';
      }

      if (categoryId === 2) {
        return 'TF';
      }

      return 'JP';
    },
    getFourLetter: function () {
      var IEL = this.IE.Value === 0 ? '_' : this.IE.Value < 0 ? 'I' : 'E';
      var NSL = this.NS.Value === 0 ? '_' : this.NS.Value < 0 ? 'N' : 'S';
      var TFL = this.TF.Value === 0 ? '_' : this.TF.Value < 0 ? 'T' : 'F';
      var JPL = this.JP.Value === 0 ? '_' : this.JP.Value < 0 ? 'J' : 'P';
      return "" + IEL + NSL + TFL + JPL;
    },
    reset: function () {
      for (var i = 0; i < 4; i++) {
        this[this.getIdentifierById(i)].reset();
      }
    }
  }
});
var Answer = Class.create({
  name: 'Answer',
  fields: {
    Category: {
      type: MyersBriggsCategory,
      "default": 0
    },
    Categories: {
      type: [MyersBriggsCategory],
      "default": []
    },
    QuestionID: {
      type: String,
      "default": ''
    },
    Reversed: {
      type: Boolean,
      "default": false
    },
    Value: {
      type: Number,
      "default": 0
    },
    AnsweredAt: {
      type: Date,
      "default": function () {
        return new Date();
      }
    }
  },
  helpers: {
    getQuestion: function () {
      var q = Question.findOne({
        _id: this.QuestionID
      });
      return q;
    },
    unanswer: function () {
      this.getQuestion().removeAnswer(this);
    }
  }
});
var UserType = Class.create({
  name: 'UserType',
  fields: {
    Personality: {
      type: MyersBriggs,
      "default": function () {
        return new MyersBriggs();
      }
    },
    AnsweredQuestions: {
      type: [Answer],
      "default": function () {
        return [];
      }
    },
    TotalQuestions: {
      type: Number,
      "default": 0
    }
  },
  helpers: {
    getAnsweredQuestionsIDs: function () {
      var qids = [];

      _.each(this.AnsweredQuestions, function (ans) {
        qids.push(ans.QuestionID);
      });

      return qids;
    },
    setTotalQuestions: function (totalQuestions) {
      //console.log("user.js totalQuestions", totalQuestions);
      this.TotalQuestions = totalQuestions; //console.log("user.js totalQuestions2", this.TotalQuestions);
    },
    getTotalQuestions: function () {
      return this.TotalQuestions;
    },
    answerQuestion: function (answer) {
      this.AnsweredQuestions.push(answer);
      console.log(this.AnsweredQuestions);
      console.log(answer.Categories);
      var contextThis = this;

      _.each(answer.Categories, function (cat) {
        contextThis.Personality.addByCategory(cat, answer.Value);
      }); //this.Personality.addByCategory(answer.Category, answer.Value);

    },
    unAnswerQuestion: function (answer, skipSlice) {
      var index = this.getAnswerIndexForQuestionID(answer.QuestionID);
      var before = this.AnsweredQuestions.length;

      if (index < 0) {
        return;
      }

      console.log(index);

      if (!skipSlice) {
        if (index == 0) {
          this.AnsweredQuestions.shift();
        } else if (index == this.AnsweredQuestions.length - 1) {
          this.AnsweredQuestions.pop();
        } else {
          this.AnsweredQuestions = this.AnsweredQuestions.slice(0, index).concat(this.AnsweredQuestions.slice(index + 1));
        }
      }

      answer.unanswer();

      _.each(answer.Categories, function (cat) {
        this.Personality.removeByCategory(cat, answer.Value);
      }); //this.Personality.removeByCategory(answer.Category, answer.Value);


      console.log("User Answer Count: " + before + " => " + this.AnsweredQuestions.length);
    },
    getAnswerIndexForQuestionID: function (questionId) {
      for (var i = 0; i < this.AnsweredQuestions.length; i++) {
        if (this.AnsweredQuestions[i].QuestionID == questionId) {
          return i;
        }
      }

      return -1;
    },
    getAnswerForQuestion: function (questionId) {
      return _.find(this.AnsweredQuestions, function (ans, i) {
        return ans.QuestionID == questionId;
      });
    },
    reset: function () {
      var self = this;

      _.each(this.AnsweredQuestions, function (ans) {
        self.unAnswerQuestion(ans, true);
      });

      this.Personality.reset();
      this.AnsweredQuestions = [];
    }
  }
});
var DashboardPane = Class.create({
  name: 'DashboardPane',
  fields: {
    size: {
      type: Number,
      "default": 4
    },
    name: {
      type: String,
      "default": 'App_home'
    },
    title: {
      type: String,
      "default": 'Personality Questions'
    },
    route: {
      type: String,
      "default": '/'
    }
  }
});
var Profile = Class.create({
  name: 'Profile',
  fields: {
    firstName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2
      }]
    },
    lastName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2
      }]
    },
    UserType: {
      type: UserType,
      "default": function () {
        return new UserType();
      }
    },
    gender: {
      type: Boolean,
      "default": false
    },
    birthDate: {
      type: Date,
      optional: true
    },
    Categories: {
      type: CategoryManager,
      "default": function () {
        return CategoryManager.OfType("User");
      }
    },
    dashboardPanes: {
      type: [DashboardPane],
      "default": []
    },
    segments: {
      type: [String],
      "default": []
    }
  },
  helpers: {
    calculateAge: function () {
      if (this.birthDate) {
        var diff = Date.now() - this.birthDate.getTime();
        this.age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
      }
    },
    fullName: function (param) {
      var fullName = this.firstName + ' ' + this.lastName;

      if (param === 'lower') {
        return fullName.toLowerCase();
      } else if (param === 'upper') {
        return fullName.toUpperCase();
      }

      return fullName;
    }
  }
});
var User = Class.create({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    emails: {
      type: [Object],
      "default": function () {
        return [];
      }
    },
    MyProfile: {
      type: Profile,
      "default": function () {
        return new Profile();
      }
    },
    teams: {
      type: [String],
      "default": function () {
        return [Team.Default.Name];
      }
    },
    roles: {
      type: Object
    }
  },
  resolveError: function (_ref) {
    var nestedName = _ref.nestedName,
        validator = _ref.validator;
    console.log(nestedName, validator);
  },
  events: {
    afterInit: function (e) {
      e.target.MyProfile.calculateAge();
    },
    beforeSave: function (e) {
      if (e.currentTarget.MyProfile.Categories.length() === 0) {
        e.currentTarget.MyProfile.Categories.addCategory(Category.Default);
      }

      if (e.currentTarget.teams.length === 0) {
        e.currentTarget.addTeam(Team.Default.Name);
      }
    }
  },
  meteorMethods: {
    create: function () {
      return this.save();
    },
    changeName: function (firstName, lastName) {
      check(firstName, String);
      check(lastName, String);
      this.MyProfile.firstName = firstName;
      this.MyProfile.lastName = lastName;
      return this.save();
    },
    fullName: function (param) {
      return this.MyProfile.fullName(param);
    },
    addTeam: function (teamName) {
      var teamDoc = Team.findOne({
        "Name": teamName
      });

      if (typeof teamDoc !== "undefined") {
        teamDoc.addUsers(this._id);
      } else {
        return false;
      }
    },
    profileUpdate: function (uprofile) {
      check(uprofile.firstName, String);
      check(uprofile.lastName, String);
      check(uprofile.gender, Boolean);
      this.MyProfile.firstName = uprofile.firstName;
      this.MyProfile.lastName = uprofile.lastName;
      this.MyProfile.gender = uprofile.gender;
      this.MyProfile.segments = uprofile.segments;

      if ("" !== uprofile.birthDate) {
        this.MyProfile.birthDate = new Date(uprofile.birthDate);
      }

      return this.save();
    }
  },
  indexes: {},
  behaviors: {
    slug: {
      fieldName: 'email'
    },
    timestamp: {}
  }
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: Object
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"both":{"at_config.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/at_config.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var User;
module.watch(require("/imports/api/users/users.js"), {
  User: function (v) {
    User = v;
  }
}, 0);
var Team;
module.watch(require("/imports/api/teams/teams.js"), {
  Team: function (v) {
    Team = v;
  }
}, 1);
var Defaults;
module.watch(require("/imports/startup/both/defaults.js"), {
  Defaults: function (v) {
    Defaults = v;
  }
}, 2);

var myPostLogout = function () {
  //example redirect after logout
  FlowRouter.go('/signin');
};

var mySubmitFunc = function (error, state) {
  if (!error) {
    if (state === "signIn") {// Successfully logged in
      // ...
    }

    if (state === "signUp") {// Successfully registered
      // ...
    }
  }
};

function myPreSubmitFunc() {
  console.log("Pre:  ", arguments);
}

function myPostSubmitFunc(userId, info) {
  Accounts.emailTemplates.siteName = "DeveloperLevel";
  Accounts.emailTemplates.from = "DeveloperLevel <wayne@paladinarcher.com>";
  Accounts.emailTemplates.verifyEmail = {
    subject: function () {
      return "[DeveloperLevel] Verify your email address";
    },
    text: function (user, url) {
      var emailAddress = user.emails[0].address,
          urlWithoutHash = url.replace('#/', ''),
          supportEmail = "support@developerlevel.com",
          emailBody = "To verify your email address (" + emailAddress + ") visit the following link:\n\n" + urlWithoutHash + "\n\n If you did not request this verification, please ignore this email.";
      return emailBody;
    }
  };
  Accounts.sendVerificationEmail(userId);
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
  showResendVerificationEmailLink: false,
  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,
  // Privacy Policy and Terms of Use
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',
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
      hasError: "fa fa-times"
    }
  }
}); // Define these routes in a file loaded on both client and server

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
  type: "text",
  required: true,
  displayName: "First Name",
  func: function (value) {
    //if(Meteor.isClient) {
    console.log("Firstname validation: ", value); //}

    return false;
  }
}, {
  _id: "last_name",
  type: "text",
  required: true,
  displayName: "Last Name",
  func: function (value) {
    //if(Meteor.isClient) {
    console.log("Lastname validation: ", value); //}

    return false;
  }
}, {
  _id: "gender",
  type: "select",
  required: true,
  displayName: "Gender",
  select: [{
    text: "Male",
    value: "male"
  }, {
    text: "Female",
    value: "female"
  }]
}]);

if (Meteor.isServer) {
  Accounts.onCreateUser(function (options, user) {
    user.slug = options.email;
    user.updateAt = user.createdAt;
    user.MyProfile = {
      firstName: options.profile.first_name,
      lastName: options.profile.last_name,
      gender: options.profile.gender === "female",
      UserType: {
        Personality: {
          IE: {},
          NS: {},
          TF: {},
          JP: {}
        },
        AnsweredQuestions: []
      },
      birthDate: undefined,
      age: undefined
    };
    user.teams = [Team.Default.Name];
    user.roles = {};
    user.profile = options.profile;

    if (options.isAdmin && options.username === 'admin') {
      user.roles[Roles.GLOBAL_GROUP] = ['admin'];
      Roles.addUsersToRoles(user._id, 'admin', Roles.GLOBAL_GROUP);
    } else {
      var t = Team.findOne({
        Name: Team.Default.Name
      });
      user.roles[Team.Default.Name] = ['member', Defaults.role.name];
      t.addUsers(user._id);
    }

    return user;
  });
  Accounts.validateNewUser(function (user) {
    var loggedInUser;

    try {
      loggedInUser = Meteor.user();
    } catch (ex) {
      console.log(ex);
    }

    if (!loggedInUser || Roles.userIsInRole(loggedInUser, ['admin', 'manage-users'], Roles.GLOBAL_GROUP)) {
      // NOTE: This example assumes the user is not using groups.
      return true;
    }

    throw new Meteor.Error(403, "Not authorized to create new users");
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/defaults.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Defaults: function () {
    return Defaults;
  }
});
var Defaults = {
  'user': {
    'username': 'admin',
    'email': 'admin@mydomain.com',
    'isAdmin': true,
    'profile': {
      'first_name': 'Admin',
      'last_name': 'Admin',
      'gender': 'female'
    }
  },
  'team': {
    'Name': "No Team",
    'Public': true,
    'Members': [],
    'Active': true
  },
  'role': {
    'name': 'No-Permissions'
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/both/index.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./at_config.js"));

// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
if (Meteor.isClient) {
  Session.setDefault('refreshQuestions', Math.random());
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"config.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/client/config.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.subscribe('userData');
/*Meteor.subscribe('teamsData', Meteor.userId(), {
    onReady: function() {
        console.log("teamsData subscription ready");
    }
}); */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/client/index.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./config.js"));
module.watch(require("./routes.js"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routes.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/client/routes.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var FlowRouter;
module.watch(require("meteor/kadira:flow-router"), {
  FlowRouter: function (v) {
    FlowRouter = v;
  }
}, 0);
var BlazeLayout;
module.watch(require("meteor/kadira:blaze-layout"), {
  BlazeLayout: function (v) {
    BlazeLayout = v;
  }
}, 1);
var LearnShareSession;
module.watch(require("/imports/api/learn_share/learn_share.js"), {
  LearnShareSession: function (v) {
    LearnShareSession = v;
  }
}, 2);
var UserNotify;
module.watch(require("/imports/api/user_notify/user_notify.js"), {
  UserNotify: function (v) {
    UserNotify = v;
  }
}, 3);
module.watch(require("../../ui/layouts/body/body.js"));
module.watch(require("../../ui/components/header/header.js"));
module.watch(require("../../ui/components/loading/loading.html"));
module.watch(require("../../ui/components/select_feedback/select_feedback.js"));
module.watch(require("../../ui/components/team_icon/team_icon.html"));
module.watch(require("../../ui/components/video_embed/video_embed.js"));
module.watch(require("../../ui/pages/home/home.js"));
module.watch(require("../../ui/pages/add_questions/add_questions.js"));
module.watch(require("../../ui/pages/add_readings/add_readings.js"));
module.watch(require("../../ui/pages/admin_teams/admin_teams.js"));
module.watch(require("../../ui/pages/learn_share/learn_share.js"));
module.watch(require("../../ui/pages/learn_share_list/learn_share_list.js"));
module.watch(require("../../ui/pages/team_goals/team_goals.js"));
module.watch(require("../../ui/pages/individual_goals/individual_goals.js"));
module.watch(require("../../ui/pages/user_dashboard/user_dashboard.js"));
module.watch(require("../../ui/pages/ask_questions/ask_questions.js"));
module.watch(require("../../ui/pages/dash_min/dash_min.js"));
module.watch(require("../../ui/pages/user_profile/user_profile.js"));
module.watch(require("../../ui/pages/not-found/not-found.js"));
module.watch(require("../../ui/pages/verify/verify.js"));
module.watch(require("../../ui/pages/user_segments/user_segments.js"));
module.watch(require("../../ui/layouts/login/login.js"));

var ensureEmailVerified = function () {
  Meteor.setTimeout(function () {
    console.log("tttt", Meteor.user(), Meteor.user().emails[0].verified);

    if ((typeof Meteor.user().username === "undefined" || Meteor.user().username !== "admin") && !Meteor.user().emails[0].verified) {
      FlowRouter.redirect("/verify/notverified");
    }
  }, 500);
}; // Set up all routes in the app


FlowRouter.route('/', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'App.home',
  action: function () {
    FlowRouter.redirect("/dashboard");
  }
});
FlowRouter.route('/dashboard', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'dashboard',
  action: function () {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'dash_min'
    });
  }
});
FlowRouter.route('/controlcenter', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'controlcenter',
  action: function () {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'user_dashboard'
    });
  }
});
FlowRouter.route('/questions', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'ask_questions',
  action: function () {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'ask_questions'
    });
  }
});
FlowRouter.route('/signin', {
  name: 'signin',
  action: function () {
    BlazeLayout.render('Auth_page', {});
  }
});
FlowRouter.route('/addQuestions/:category', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'addQuestions',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'add_questions'
    });
  }
});
FlowRouter.route('/addTraitDescriptions', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'addTraitDescriptions',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'add_readings'
    });
  }
});
FlowRouter.route('/adminTeams', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'adminTeams',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'admin_teams'
    });
  }
});
FlowRouter.route('/adminTeams/:teamName', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'adminTeams',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'admin_teams'
    });
  }
});
FlowRouter.route('/learnShareList', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'learnShareList',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'learn_share_list'
    });
  }
});
FlowRouter.route('/learnShare/:lssid', {
  //triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'learnShare',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'learn_share'
    });
  }
});
FlowRouter.route('/learnShare', {
  //triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'learnShare',
  action: function (params, queryParams) {
    if (sessionStorage.lastLearnShareId) {
      FlowRouter.go('/learnShare/' + sessionStorage.lastLearnShareId + location.hash);
    } else {
      BlazeLayout.render('App_body', {
        main: 'App_notFound'
      });
    }
  }
});
FlowRouter.route('/teamGoals/:teamName', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'teamGoals',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'team_goals'
    });
  }
});
FlowRouter.route('/teamGoals/:teamName/:goalId', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'teamGoals',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'team_goals'
    });
  }
});
FlowRouter.route('/goals', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'individualGoals',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'individual_goals'
    });
  }
});
FlowRouter.route('/goals/:userId', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'individualGoals',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'individual_goals'
    });
  }
});
FlowRouter.route('/userSegments', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'userSegments',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'user_segments'
    });
  }
});
FlowRouter.route('/profile', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'profile',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'user_profile'
    });
  }
});
FlowRouter.route('/profile/:userId', {
  triggersEnter: [AccountsTemplates.ensureSignedIn, ensureEmailVerified],
  name: 'profile',
  action: function (params, queryParams) {
    BlazeLayout.render('App_body', {
      top: 'header',
      main: 'user_profile'
    });
  }
});
FlowRouter.route('/verify-email/:token', {
  name: 'verify-email',
  action: function (params) {
    Accounts.verifyEmail(params.token, function (error) {
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
  action: function (params, queryParams) {
    BlazeLayout.render('verify');
  }
});
FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render('App_body', {
      main: 'App_notFound'
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("/imports/startup/both"));
module.watch(require("/imports/startup/client"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".less"
  ]
});

var exports = require("/client/main.js");