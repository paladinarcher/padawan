(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"jagi:astronomy-softremove-behavior":{"lib":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/main.js                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.watch(require("./behavior/behavior.js"));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"behavior":{"behavior.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/behavior/behavior.js                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
const module1 = module;

let _bind;

module1.watch(require("lodash/bind"), {
  default(v) {
    _bind = v;
  }

}, 0);

let _forEach;

module1.watch(require("lodash/forEach"), {
  default(v) {
    _forEach = v;
  }

}, 1);

let _zipObject;

module1.watch(require("lodash/zipObject"), {
  default(v) {
    _zipObject = v;
  }

}, 2);
let Module, Behavior, Event;
module1.watch(require("meteor/jagi:astronomy"), {
  Module(v) {
    Module = v;
  },

  Behavior(v) {
    Behavior = v;
  },

  Event(v) {
    Event = v;
  }

}, 3);
let beforeFind;
module1.watch(require("../class_events/beforeFind"), {
  default(v) {
    beforeFind = v;
  }

}, 4);
let softRemove;
module1.watch(require("../class_prototype_methods/softRemove"), {
  default(v) {
    softRemove = v;
  }

}, 5);
let softRestore;
module1.watch(require("../class_prototype_methods/softRestore"), {
  default(v) {
    softRestore = v;
  }

}, 6);
let meteorSoftRemove;
module1.watch(require("../meteor_methods/softRemove"), {
  default(v) {
    meteorSoftRemove = v;
  }

}, 7);
let meteorSoftRestore;
module1.watch(require("../meteor_methods/softRestore"), {
  default(v) {
    meteorSoftRestore = v;
  }

}, 8);
const hasMeteorMethod = Module.modules.storage.utils.hasMeteorMethod;
Behavior.create({
  name: "softremove",
  options: {
    removedFieldName: "removed",
    hasRemovedAtField: true,
    removedAtFieldName: "removedAt"
  },

  createClassDefinition() {
    const behavior = this;
    const definition = {
      fields: {},
      events: {
        beforeFind: _bind(beforeFind, behavior)
      },
      // Fix for Astronomy 2.2.4 where I've changed name of the "methods" module
      // to "helpers" module. I shouldn't do that even when changing property
      // name in schema.
      helpers: {
        softRemove,
        softRestore
      }
    }; // Add a field storing a removal flag.

    definition.fields[behavior.options.removedFieldName] = {
      type: Boolean,
      default: false
    };

    if (behavior.options.hasRemovedAtField) {
      // Add a field storing a removal date.
      definition.fields[behavior.options.removedAtFieldName] = {
        type: Date,
        optional: true
      };
    }

    return definition;
  },

  apply(Class) {
    const Collection = Class.getCollection(); // If it's a remote collection then we register methods on the connection
    // object of the collection.

    let connection = Collection._connection;

    if (connection) {
      // Prepare meteor methods to be added.
      let meteorMethods = {
        "/Astronomy/softRemove": meteorSoftRemove,
        "/Astronomy/softRestore": meteorSoftRestore
      };

      _forEach(meteorMethods, (meteorMethod, methodName) => {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_zipObject([methodName], [meteorMethod]));
        }
      });
    }

    Class.extend(this.createClassDefinition(), ["fields", "events", "helpers", "methods"]);
  }

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_events":{"beforeFind.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/class_events/beforeFind.js                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
const beforeFind = function (e) {
  const doc = e.currentTarget;
  const Class = doc.constructor;
  const selector = e.selector;
  selector[this.options.removedFieldName] = {
    $ne: true
  };
};

module.exportDefault(beforeFind);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_prototype_methods":{"softRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/class_prototype_methods/softRemove.js                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Match;
module.watch(require("meteor/check"), {
  Match(v) {
    Match = v;
  }

}, 0);
let Module;
module.watch(require("meteor/jagi:astronomy"), {
  Module(v) {
    Module = v;
  }

}, 1);
let documentSoftRemove;
module.watch(require("../utils/documentSoftRemove"), {
  default(v) {
    documentSoftRemove = v;
  }

}, 2);
const isRemote = Module.modules.storage.utils.isRemote;
const callMeteorMethod = Module.modules.storage.utils.callMeteorMethod;

const softRemove = function (args = {}, callback) {
  let doc = this;
  let Class = doc.constructor; // If the first argument is callback function then reassign values.

  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  } // Get variables from the first argument.


  let {
    simulation = true
  } = args; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    let methodName = "/Astronomy/softRemove"; // Prepare arguments for the meteor method.

    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };

    try {
      // Run meteor method.
      let result = callMeteorMethod(Class, methodName, [methodArgs], callback); // Return result of the meteor method call.

      return result;
    } catch (err) {
      // Catch stub exceptions.
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Prepare arguments.
    let methodArgs = {
      doc,
      simulation,
      trusted: true
    };
    let result = documentSoftRemove(methodArgs);

    if (callback) {
      callback(undefined, result);
    }

    return result;
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
};

module.exportDefault(softRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"softRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/class_prototype_methods/softRestore.js                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Match;
module.watch(require("meteor/check"), {
  Match(v) {
    Match = v;
  }

}, 0);
let Module;
module.watch(require("meteor/jagi:astronomy"), {
  Module(v) {
    Module = v;
  }

}, 1);
let documentSoftRestore;
module.watch(require("../utils/documentSoftRestore"), {
  default(v) {
    documentSoftRestore = v;
  }

}, 2);
const isRemote = Module.modules.storage.utils.isRemote;
const callMeteorMethod = Module.modules.storage.utils.callMeteorMethod;

const softRestore = function (args = {}, callback) {
  let doc = this;
  let Class = doc.constructor; // If the first argument is callback function then reassign values.

  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  } // Get variables from the first argument.


  let {
    simulation = true
  } = args; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    let methodName = "/Astronomy/softRestore"; // Prepare arguments for the meteor method.

    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };

    try {
      // Run meteor method.
      let result = callMeteorMethod(Class, methodName, [methodArgs], callback); // Return result of the meteor method call.

      return result;
    } catch (err) {
      // Catch stub exceptions.
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Prepare arguments.
    let methodArgs = {
      doc,
      simulation,
      trusted: true
    };
    let result = documentSoftRestore(methodArgs);

    if (callback) {
      callback(undefined, result);
    }

    return result;
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
};

module.exportDefault(softRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meteor_methods":{"softRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/meteor_methods/softRemove.js                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let classSoftRemove;
module.watch(require("../utils/classSoftRemove"), {
  default(v) {
    classSoftRemove = v;
  }

}, 0);

const softRemove = function (args) {
  return classSoftRemove(args);
};

module.exportDefault(softRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"softRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/meteor_methods/softRestore.js                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let classSoftRestore;
module.watch(require("../utils/classSoftRestore"), {
  default(v) {
    classSoftRestore = v;
  }

}, 0);

const softRestore = function (args) {
  return classSoftRestore(args);
};

module.exportDefault(softRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"utils":{"classSoftRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/classSoftRemove.js                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let AstroClass, Module;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    AstroClass = v;
  },

  Module(v) {
    Module = v;
  }

}, 0);
let documentSoftRemove;
module.watch(require("./documentSoftRemove"), {
  default(v) {
    documentSoftRemove = v;
  }

}, 1);
const throwIfSelectorIsNotId = Module.modules.storage.utils.throwIfSelectorIsNotId;

const classRemove = function (args = {}) {
  let {
    className,
    selector,
    simulation = true,
    trusted = false
  } = args; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  } // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.


  if (!trusted) {
    throwIfSelectorIsNotId(selector, "softRemove");
  }

  let Class = AstroClass.get(className); // Get all documents matching selector.

  let docs = Class.find(selector); // Prepare result of the method execution.

  let result = 0;
  docs.forEach(doc => {
    // Update a document.
    result += documentSoftRemove({
      doc,
      simulation,
      trusted
    });
  });
  return result;
};

module.exportDefault(classRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"classSoftRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/classSoftRestore.js                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let AstroClass, Module;
module.watch(require("meteor/jagi:astronomy"), {
  Class(v) {
    AstroClass = v;
  },

  Module(v) {
    Module = v;
  }

}, 0);
let documentSoftRestore;
module.watch(require("./documentSoftRestore"), {
  default(v) {
    documentSoftRestore = v;
  }

}, 1);
const throwIfSelectorIsNotId = Module.modules.storage.utils.throwIfSelectorIsNotId;

const classRestore = function (args = {}) {
  let {
    className,
    selector,
    simulation = true,
    trusted = false
  } = args; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  } // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.


  if (!trusted) {
    throwIfSelectorIsNotId(selector, "softRestore");
  }

  let Class = AstroClass.get(className); // Get all documents matching selector.

  let docs = Class.find(selector, {
    disableEvents: true
  }); // Prepare result of the method execution.

  let result = 0;
  docs.forEach(doc => {
    // Update a document.
    result += documentSoftRestore({
      doc,
      simulation,
      trusted
    });
  });
  return result;
};

module.exportDefault(classRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"documentSoftRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/documentSoftRemove.js                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let _defaults;

module.watch(require("lodash/defaults"), {
  default(v) {
    _defaults = v;
  }

}, 0);
let triggerBeforeSoftRemove;
module.watch(require("./triggerBeforeSoftRemove"), {
  default(v) {
    triggerBeforeSoftRemove = v;
  }

}, 1);
let triggerAfterSoftRemove;
module.watch(require("./triggerAfterSoftRemove"), {
  default(v) {
    triggerAfterSoftRemove = v;
  }

}, 2);
let Module;
module.watch(require("meteor/jagi:astronomy"), {
  Module(v) {
    Module = v;
  }

}, 3);
const getModifier = Module.modules.storage.utils.getModifier;

const documentSoftRemove = function (args = {}) {
  const {
    doc,
    simulation = true,
    trusted = false
  } = args; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection(); // Remove only when document has the "_id" field (it's persisted).

  if (Class.isNew(doc) || !doc._id) {
    return 0;
  } // Check if a class is secured.


  if (Class.isSecured("softRemove") && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, "Soft removing from the client is not allowed");
  } // Trigger before events.


  triggerBeforeSoftRemove(doc, trusted); // Prepare selector.

  const selector = {
    _id: doc._id
  }; // Prepare modifier.

  const modifier = _defaults(getModifier({
    doc
  }), {
    $set: {}
  });

  const behavior = Class.getBehavior("softremove")[0];
  modifier.$set[behavior.options.removedFieldName] = true;

  if (behavior.options.hasRemovedAtField) {
    modifier.$set[behavior.options.removedAtFieldName] = new Date();
  } // Remove a document.


  const result = Collection._collection.update(selector, modifier); // Trigger after events.


  triggerAfterSoftRemove(doc, trusted);
  return result;
};

module.exportDefault(documentSoftRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"documentSoftRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/documentSoftRestore.js                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let triggerBeforeSoftRestore;
module.watch(require("./triggerBeforeSoftRestore"), {
  default(v) {
    triggerBeforeSoftRestore = v;
  }

}, 0);
let triggerAfterSoftRestore;
module.watch(require("./triggerAfterSoftRestore"), {
  default(v) {
    triggerAfterSoftRestore = v;
  }

}, 1);

const documentSoftRestore = function (args = {}) {
  const {
    doc,
    simulation = true,
    trusted = false
  } = args; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection(); // Restore only when document has the "_id" field (it's persisted).

  if (Class.isNew(doc) || !doc._id) {
    return 0;
  } // Check if a class is secured.


  if (Class.isSecured("softRestore") && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, "Soft restoring from the client is not allowed");
  } // Trigger before events.


  triggerBeforeSoftRestore(doc, trusted); // Prepare selector.

  const selector = {
    _id: doc._id
  }; // Prepare modifier.

  const modifier = {
    $set: {}
  };
  const behavior = Class.getBehavior("softremove")[0];
  modifier.$set[behavior.options.removedFieldName] = false;

  if (behavior.options.hasRemovedAtField) {
    modifier.$unset = {
      [behavior.options.removedAtFieldName]: ""
    };
  } // Restore a document.


  const result = Collection._collection.update(selector, modifier); // Trigger after events.


  triggerAfterSoftRestore(doc, trusted);
  return result;
};

module.exportDefault(documentSoftRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggerAfterSoftRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/triggerAfterSoftRemove.js                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Event;
module.watch(require("meteor/jagi:astronomy"), {
  Event(v) {
    Event = v;
  }

}, 0);

const triggerAfterSoftRemove = function (doc, trusted) {
  // Trigger the "afterSoftRemove" event handlers.
  doc.dispatchEvent(new Event("afterSoftRemove", {
    propagates: true,
    trusted: trusted
  }));
};

module.exportDefault(triggerAfterSoftRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggerAfterSoftRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/triggerAfterSoftRestore.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Event;
module.watch(require("meteor/jagi:astronomy"), {
  Event(v) {
    Event = v;
  }

}, 0);

const triggerAfterSoftRestore = function (doc, trusted) {
  // Trigger the "afterSoftRestore" event handlers.
  doc.dispatchEvent(new Event("afterSoftRestore", {
    propagates: true,
    trusted: trusted
  }));
};

module.exportDefault(triggerAfterSoftRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggerBeforeSoftRemove.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/triggerBeforeSoftRemove.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Event;
module.watch(require("meteor/jagi:astronomy"), {
  Event(v) {
    Event = v;
  }

}, 0);

const triggerBeforeSoftRemove = function (doc, trusted) {
  // Trigger the "beforeSoftRemove" event handlers.
  if (!doc.dispatchEvent(new Event("beforeSoftRemove", {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeSoftRemove"
    });
  }
};

module.exportDefault(triggerBeforeSoftRemove);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggerBeforeSoftRestore.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/jagi_astronomy-softremove-behavior/lib/utils/triggerBeforeSoftRestore.js                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
let Event;
module.watch(require("meteor/jagi:astronomy"), {
  Event(v) {
    Event = v;
  }

}, 0);

const triggerBeforeSoftRestore = function (doc, trusted) {
  // Trigger the "beforeSoftRestore" event handlers.
  if (!doc.dispatchEvent(new Event("beforeSoftRestore", {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeSoftRestore"
    });
  }
};

module.exportDefault(triggerBeforeSoftRestore);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"lodash":{"bind.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor/jagi_astronomy-softremove-behavior/node_modules/lodash/bind.js                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"forEach.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor/jagi_astronomy-softremove-behavior/node_modules/lodash/forEach.js                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zipObject.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor/jagi_astronomy-softremove-behavior/node_modules/lodash/zipObject.js                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// node_modules/meteor/jagi_astronomy-softremove-behavior/node_modules/lodash/defaults.js                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/jagi:astronomy-softremove-behavior/lib/main.js");

/* Exports */
Package._define("jagi:astronomy-softremove-behavior", exports);

})();

//# sourceURL=meteor://💻app/packages/jagi_astronomy-softremove-behavior.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvYmVoYXZpb3IvYmVoYXZpb3IuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNvZnRyZW1vdmUtYmVoYXZpb3IvbGliL2NsYXNzX2V2ZW50cy9iZWZvcmVGaW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zb2Z0cmVtb3ZlLWJlaGF2aW9yL2xpYi9jbGFzc19wcm90b3R5cGVfbWV0aG9kcy9zb2Z0UmVtb3ZlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zb2Z0cmVtb3ZlLWJlaGF2aW9yL2xpYi9jbGFzc19wcm90b3R5cGVfbWV0aG9kcy9zb2Z0UmVzdG9yZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvbWV0ZW9yX21ldGhvZHMvc29mdFJlbW92ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvbWV0ZW9yX21ldGhvZHMvc29mdFJlc3RvcmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNvZnRyZW1vdmUtYmVoYXZpb3IvbGliL3V0aWxzL2NsYXNzU29mdFJlbW92ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvdXRpbHMvY2xhc3NTb2Z0UmVzdG9yZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvdXRpbHMvZG9jdW1lbnRTb2Z0UmVtb3ZlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zb2Z0cmVtb3ZlLWJlaGF2aW9yL2xpYi91dGlscy9kb2N1bWVudFNvZnRSZXN0b3JlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zb2Z0cmVtb3ZlLWJlaGF2aW9yL2xpYi91dGlscy90cmlnZ2VyQWZ0ZXJTb2Z0UmVtb3ZlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zb2Z0cmVtb3ZlLWJlaGF2aW9yL2xpYi91dGlscy90cmlnZ2VyQWZ0ZXJTb2Z0UmVzdG9yZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc29mdHJlbW92ZS1iZWhhdmlvci9saWIvdXRpbHMvdHJpZ2dlckJlZm9yZVNvZnRSZW1vdmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNvZnRyZW1vdmUtYmVoYXZpb3IvbGliL3V0aWxzL3RyaWdnZXJCZWZvcmVTb2Z0UmVzdG9yZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJ3YXRjaCIsInJlcXVpcmUiLCJtb2R1bGUxIiwiX2JpbmQiLCJkZWZhdWx0IiwidiIsIl9mb3JFYWNoIiwiX3ppcE9iamVjdCIsIk1vZHVsZSIsIkJlaGF2aW9yIiwiRXZlbnQiLCJiZWZvcmVGaW5kIiwic29mdFJlbW92ZSIsInNvZnRSZXN0b3JlIiwibWV0ZW9yU29mdFJlbW92ZSIsIm1ldGVvclNvZnRSZXN0b3JlIiwiaGFzTWV0ZW9yTWV0aG9kIiwibW9kdWxlcyIsInN0b3JhZ2UiLCJ1dGlscyIsImNyZWF0ZSIsIm5hbWUiLCJvcHRpb25zIiwicmVtb3ZlZEZpZWxkTmFtZSIsImhhc1JlbW92ZWRBdEZpZWxkIiwicmVtb3ZlZEF0RmllbGROYW1lIiwiY3JlYXRlQ2xhc3NEZWZpbml0aW9uIiwiYmVoYXZpb3IiLCJkZWZpbml0aW9uIiwiZmllbGRzIiwiZXZlbnRzIiwiaGVscGVycyIsInR5cGUiLCJCb29sZWFuIiwiRGF0ZSIsIm9wdGlvbmFsIiwiYXBwbHkiLCJDbGFzcyIsIkNvbGxlY3Rpb24iLCJnZXRDb2xsZWN0aW9uIiwiY29ubmVjdGlvbiIsIl9jb25uZWN0aW9uIiwibWV0ZW9yTWV0aG9kcyIsIm1ldGVvck1ldGhvZCIsIm1ldGhvZE5hbWUiLCJtZXRob2RzIiwiZXh0ZW5kIiwiZSIsImRvYyIsImN1cnJlbnRUYXJnZXQiLCJjb25zdHJ1Y3RvciIsInNlbGVjdG9yIiwiJG5lIiwiZXhwb3J0RGVmYXVsdCIsIk1hdGNoIiwiZG9jdW1lbnRTb2Z0UmVtb3ZlIiwiaXNSZW1vdGUiLCJjYWxsTWV0ZW9yTWV0aG9kIiwiYXJncyIsImNhbGxiYWNrIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidGVzdCIsIkZ1bmN0aW9uIiwic2ltdWxhdGlvbiIsIm1ldGhvZEFyZ3MiLCJjbGFzc05hbWUiLCJnZXROYW1lIiwiX2lkIiwicmVzdWx0IiwiZXJyIiwidHJ1c3RlZCIsInVuZGVmaW5lZCIsImRvY3VtZW50U29mdFJlc3RvcmUiLCJjbGFzc1NvZnRSZW1vdmUiLCJjbGFzc1NvZnRSZXN0b3JlIiwiQXN0cm9DbGFzcyIsInRocm93SWZTZWxlY3RvcklzTm90SWQiLCJjbGFzc1JlbW92ZSIsIk1ldGVvciIsImlzU2VydmVyIiwiZ2V0IiwiZG9jcyIsImZpbmQiLCJmb3JFYWNoIiwiY2xhc3NSZXN0b3JlIiwiZGlzYWJsZUV2ZW50cyIsIl9kZWZhdWx0cyIsInRyaWdnZXJCZWZvcmVTb2Z0UmVtb3ZlIiwidHJpZ2dlckFmdGVyU29mdFJlbW92ZSIsImdldE1vZGlmaWVyIiwiaXNOZXciLCJpc1NlY3VyZWQiLCJFcnJvciIsIm1vZGlmaWVyIiwiJHNldCIsImdldEJlaGF2aW9yIiwiX2NvbGxlY3Rpb24iLCJ1cGRhdGUiLCJ0cmlnZ2VyQmVmb3JlU29mdFJlc3RvcmUiLCJ0cmlnZ2VyQWZ0ZXJTb2Z0UmVzdG9yZSIsIiR1bnNldCIsImRpc3BhdGNoRXZlbnQiLCJwcm9wYWdhdGVzIiwiY2FuY2VsYWJsZSIsImV2ZW50TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPQyxLQUFQLENBQWFDLFFBQVEsd0JBQVIsQ0FBYixFOzs7Ozs7Ozs7OztBQ0FBLE1BQU1DLFVBQVFILE1BQWQ7O0FBQXFCLElBQUlJLEtBQUo7O0FBQVVELFFBQVFGLEtBQVIsQ0FBY0MsUUFBUSxhQUFSLENBQWQsRUFBcUM7QUFBQ0csVUFBUUMsQ0FBUixFQUFVO0FBQUNGLFlBQU1FLENBQU47QUFBUTs7QUFBcEIsQ0FBckMsRUFBMkQsQ0FBM0Q7O0FBQThELElBQUlDLFFBQUo7O0FBQWFKLFFBQVFGLEtBQVIsQ0FBY0MsUUFBUSxnQkFBUixDQUFkLEVBQXdDO0FBQUNHLFVBQVFDLENBQVIsRUFBVTtBQUFDQyxlQUFTRCxDQUFUO0FBQVc7O0FBQXZCLENBQXhDLEVBQWlFLENBQWpFOztBQUFvRSxJQUFJRSxVQUFKOztBQUFlTCxRQUFRRixLQUFSLENBQWNDLFFBQVEsa0JBQVIsQ0FBZCxFQUEwQztBQUFDRyxVQUFRQyxDQUFSLEVBQVU7QUFBQ0UsaUJBQVdGLENBQVg7QUFBYTs7QUFBekIsQ0FBMUMsRUFBcUUsQ0FBckU7QUFBd0UsSUFBSUcsTUFBSixFQUFXQyxRQUFYLEVBQW9CQyxLQUFwQjtBQUEwQlIsUUFBUUYsS0FBUixDQUFjQyxRQUFRLHVCQUFSLENBQWQsRUFBK0M7QUFBQ08sU0FBT0gsQ0FBUCxFQUFTO0FBQUNHLGFBQU9ILENBQVA7QUFBUyxHQUFwQjs7QUFBcUJJLFdBQVNKLENBQVQsRUFBVztBQUFDSSxlQUFTSixDQUFUO0FBQVcsR0FBNUM7O0FBQTZDSyxRQUFNTCxDQUFOLEVBQVE7QUFBQ0ssWUFBTUwsQ0FBTjtBQUFROztBQUE5RCxDQUEvQyxFQUErRyxDQUEvRztBQUFrSCxJQUFJTSxVQUFKO0FBQWVULFFBQVFGLEtBQVIsQ0FBY0MsUUFBUSw0QkFB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QixVQUFTbkQsR0FBVCxFQUFjdUIsT0FBZCxFQUF1QjtBQUN0RDtBQUNBLE1BQ0UsQ0FBQ3ZCLElBQUlzRCxhQUFKLENBQ0MsSUFBSTVGLEtBQUosQ0FBVSxtQkFBVixFQUErQjtBQUM3QjhGLGdCQUFZLElBRGlCO0FBRTdCRCxnQkFBWSxJQUZpQjtBQUc3QmhDLGFBQVNBO0FBSG9CLEdBQS9CLENBREQsQ0FESCxFQVFFO0FBQ0E7QUFDQSxVQUFNLElBQUlRLE9BQU9jLEtBQVgsQ0FBaUIsV0FBakIsRUFBOEIscUJBQTlCLEVBQXFEO0FBQ3pEWSxpQkFBVztBQUQ4QyxLQUFyRCxDQUFOO0FBR0Q7QUFDRixDQWhCRDs7QUFGQTFHLE9BQU9zRCxhQUFQLENBb0JlOEMsd0JBcEJmLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2phZ2lfYXN0cm9ub215LXNvZnRyZW1vdmUtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuL2JlaGF2aW9yL2JlaGF2aW9yLmpzXCI7XG4iLCJpbXBvcnQgX2JpbmQgZnJvbSBcImxvZGFzaC9iaW5kXCI7XG5pbXBvcnQgX2ZvckVhY2ggZnJvbSBcImxvZGFzaC9mb3JFYWNoXCI7XG5pbXBvcnQgX3ppcE9iamVjdCBmcm9tIFwibG9kYXNoL3ppcE9iamVjdFwiO1xuaW1wb3J0IHsgTW9kdWxlLCBCZWhhdmlvciwgRXZlbnQgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5pbXBvcnQgYmVmb3JlRmluZCBmcm9tIFwiLi4vY2xhc3NfZXZlbnRzL2JlZm9yZUZpbmRcIjtcbmltcG9ydCBzb2Z0UmVtb3ZlIGZyb20gXCIuLi9jbGFzc19wcm90b3R5cGVfbWV0aG9kcy9zb2Z0UmVtb3ZlXCI7XG5pbXBvcnQgc29mdFJlc3RvcmUgZnJvbSBcIi4uL2NsYXNzX3Byb3RvdHlwZV9tZXRob2RzL3NvZnRSZXN0b3JlXCI7XG5pbXBvcnQgbWV0ZW9yU29mdFJlbW92ZSBmcm9tIFwiLi4vbWV0ZW9yX21ldGhvZHMvc29mdFJlbW92ZVwiO1xuaW1wb3J0IG1ldGVvclNvZnRSZXN0b3JlIGZyb20gXCIuLi9tZXRlb3JfbWV0aG9kcy9zb2Z0UmVzdG9yZVwiO1xuY29uc3QgaGFzTWV0ZW9yTWV0aG9kID0gTW9kdWxlLm1vZHVsZXMuc3RvcmFnZS51dGlscy5oYXNNZXRlb3JNZXRob2Q7XG5cbkJlaGF2aW9yLmNyZWF0ZSh7XG4gIG5hbWU6IFwic29mdHJlbW92ZVwiLFxuICBvcHRpb25zOiB7XG4gICAgcmVtb3ZlZEZpZWxkTmFtZTogXCJyZW1vdmVkXCIsXG4gICAgaGFzUmVtb3ZlZEF0RmllbGQ6IHRydWUsXG4gICAgcmVtb3ZlZEF0RmllbGROYW1lOiBcInJlbW92ZWRBdFwiXG4gIH0sXG4gIGNyZWF0ZUNsYXNzRGVmaW5pdGlvbigpIHtcbiAgICBjb25zdCBiZWhhdmlvciA9IHRoaXM7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0ge1xuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICBiZWZvcmVGaW5kOiBfYmluZChiZWZvcmVGaW5kLCBiZWhhdmlvcilcbiAgICAgIH0sXG4gICAgICAvLyBGaXggZm9yIEFzdHJvbm9teSAyLjIuNCB3aGVyZSBJJ3ZlIGNoYW5nZWQgbmFtZSBvZiB0aGUgXCJtZXRob2RzXCIgbW9kdWxlXG4gICAgICAvLyB0byBcImhlbHBlcnNcIiBtb2R1bGUuIEkgc2hvdWxkbid0IGRvIHRoYXQgZXZlbiB3aGVuIGNoYW5naW5nIHByb3BlcnR5XG4gICAgICAvLyBuYW1lIGluIHNjaGVtYS5cbiAgICAgIGhlbHBlcnM6IHtcbiAgICAgICAgc29mdFJlbW92ZSxcbiAgICAgICAgc29mdFJlc3RvcmVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQWRkIGEgZmllbGQgc3RvcmluZyBhIHJlbW92YWwgZmxhZy5cbiAgICBkZWZpbml0aW9uLmZpZWxkc1tiZWhhdmlvci5vcHRpb25zLnJlbW92ZWRGaWVsZE5hbWVdID0ge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmIChiZWhhdmlvci5vcHRpb25zLmhhc1JlbW92ZWRBdEZpZWxkKSB7XG4gICAgICAvLyBBZGQgYSBmaWVsZCBzdG9yaW5nIGEgcmVtb3ZhbCBkYXRlLlxuICAgICAgZGVmaW5pdGlvbi5maWVsZHNbYmVoYXZpb3Iub3B0aW9ucy5yZW1vdmVkQXRGaWVsZE5hbWVdID0ge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbiAgfSxcbiAgYXBwbHkoQ2xhc3MpIHtcbiAgICBjb25zdCBDb2xsZWN0aW9uID0gQ2xhc3MuZ2V0Q29sbGVjdGlvbigpO1xuXG4gICAgLy8gSWYgaXQncyBhIHJlbW90ZSBjb2xsZWN0aW9uIHRoZW4gd2UgcmVnaXN0ZXIgbWV0aG9kcyBvbiB0aGUgY29ubmVjdGlvblxuICAgIC8vIG9iamVjdCBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICBsZXQgY29ubmVjdGlvbiA9IENvbGxlY3Rpb24uX2Nvbm5lY3Rpb247XG4gICAgaWYgKGNvbm5lY3Rpb24pIHtcbiAgICAgIC8vIFByZXBhcmUgbWV0ZW9yIG1ldGhvZHMgdG8gYmUgYWRkZWQuXG4gICAgICBsZXQgbWV0ZW9yTWV0aG9kcyA9IHtcbiAgICAgICAgXCIvQXN0cm9ub215L3NvZnRSZW1vdmVcIjogbWV0ZW9yU29mdFJlbW92ZSxcbiAgICAgICAgXCIvQXN0cm9ub215L3NvZnRSZXN0b3JlXCI6IG1ldGVvclNvZnRSZXN0b3JlXG4gICAgICB9O1xuICAgICAgX2ZvckVhY2gobWV0ZW9yTWV0aG9kcywgKG1ldGVvck1ldGhvZCwgbWV0aG9kTmFtZSkgPT4ge1xuICAgICAgICBpZiAoIWhhc01ldGVvck1ldGhvZChjb25uZWN0aW9uLCBtZXRob2ROYW1lKSkge1xuICAgICAgICAgIC8vIEFkZCBtZXRlb3IgbWV0aG9kLlxuICAgICAgICAgIGNvbm5lY3Rpb24ubWV0aG9kcyhfemlwT2JqZWN0KFttZXRob2ROYW1lXSwgW21ldGVvck1ldGhvZF0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgQ2xhc3MuZXh0ZW5kKHRoaXMuY3JlYXRlQ2xhc3NEZWZpbml0aW9uKCksIFtcbiAgICAgIFwiZmllbGRzXCIsXG4gICAgICBcImV2ZW50c1wiLFxuICAgICAgXCJoZWxwZXJzXCIsXG4gICAgICBcIm1ldGhvZHNcIlxuICAgIF0pO1xuICB9XG59KTtcbiIsImNvbnN0IGJlZm9yZUZpbmQgPSBmdW5jdGlvbihlKSB7XG4gIGNvbnN0IGRvYyA9IGUuY3VycmVudFRhcmdldDtcbiAgY29uc3QgQ2xhc3MgPSBkb2MuY29uc3RydWN0b3I7XG4gIGNvbnN0IHNlbGVjdG9yID0gZS5zZWxlY3RvcjtcblxuICBzZWxlY3Rvclt0aGlzLm9wdGlvbnMucmVtb3ZlZEZpZWxkTmFtZV0gPSB7ICRuZTogdHJ1ZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYmVmb3JlRmluZDtcbiIsImltcG9ydCB7IE1hdGNoIH0gZnJvbSBcIm1ldGVvci9jaGVja1wiO1xuaW1wb3J0IHsgTW9kdWxlIH0gZnJvbSBcIm1ldGVvci9qYWdpOmFzdHJvbm9teVwiO1xuaW1wb3J0IGRvY3VtZW50U29mdFJlbW92ZSBmcm9tIFwiLi4vdXRpbHMvZG9jdW1lbnRTb2Z0UmVtb3ZlXCI7XG5jb25zdCBpc1JlbW90ZSA9IE1vZHVsZS5tb2R1bGVzLnN0b3JhZ2UudXRpbHMuaXNSZW1vdGU7XG5jb25zdCBjYWxsTWV0ZW9yTWV0aG9kID0gTW9kdWxlLm1vZHVsZXMuc3RvcmFnZS51dGlscy5jYWxsTWV0ZW9yTWV0aG9kO1xuXG5jb25zdCBzb2Z0UmVtb3ZlID0gZnVuY3Rpb24oYXJncyA9IHt9LCBjYWxsYmFjaykge1xuICBsZXQgZG9jID0gdGhpcztcbiAgbGV0IENsYXNzID0gZG9jLmNvbnN0cnVjdG9yO1xuXG4gIC8vIElmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBjYWxsYmFjayBmdW5jdGlvbiB0aGVuIHJlYXNzaWduIHZhbHVlcy5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgTWF0Y2gudGVzdChhcmdzLCBGdW5jdGlvbikpIHtcbiAgICBjYWxsYmFjayA9IGFyZ3M7XG4gICAgYXJncyA9IHt9O1xuICB9XG4gIC8vIEdldCB2YXJpYWJsZXMgZnJvbSB0aGUgZmlyc3QgYXJndW1lbnQuXG4gIGxldCB7IHNpbXVsYXRpb24gPSB0cnVlIH0gPSBhcmdzO1xuXG4gIC8vIElmIHdlIGFyZSBkZWFsaW5nIHdpdGggYSByZW1vdGUgY29sbGVjdGlvbiBhbmQgd2UgYXJlIG5vdCBvbiB0aGUgc2VydmVyLlxuICBpZiAoaXNSZW1vdGUoQ2xhc3MpKSB7XG4gICAgLy8gUHJlcGFyZSBtZXRlb3IgbWV0aG9kIG5hbWUgdG8gYmUgY2FsbGVkLlxuICAgIGxldCBtZXRob2ROYW1lID0gXCIvQXN0cm9ub215L3NvZnRSZW1vdmVcIjtcbiAgICAvLyBQcmVwYXJlIGFyZ3VtZW50cyBmb3IgdGhlIG1ldGVvciBtZXRob2QuXG4gICAgbGV0IG1ldGhvZEFyZ3MgPSB7XG4gICAgICBjbGFzc05hbWU6IENsYXNzLmdldE5hbWUoKSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIF9pZDogZG9jLl9pZFxuICAgICAgfSxcbiAgICAgIHNpbXVsYXRpb25cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFJ1biBtZXRlb3IgbWV0aG9kLlxuICAgICAgbGV0IHJlc3VsdCA9IGNhbGxNZXRlb3JNZXRob2QoQ2xhc3MsIG1ldGhvZE5hbWUsIFttZXRob2RBcmdzXSwgY2FsbGJhY2spO1xuICAgICAgLy8gUmV0dXJuIHJlc3VsdCBvZiB0aGUgbWV0ZW9yIG1ldGhvZCBjYWxsLlxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIENhdGNoIHN0dWIgZXhjZXB0aW9ucy5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB3ZSBjYW4ganVzdCByZW1vdmUgYSBkb2N1bWVudCB3aXRob3V0IGNhbGxpbmcgdGhlIG1ldGVvciBtZXRob2QuIFdlIG1heVxuICAvLyBiZSBvbiB0aGUgc2VydmVyIG9yIHRoZSBjb2xsZWN0aW9uIG1heSBiZSBsb2NhbC5cbiAgdHJ5IHtcbiAgICAvLyBQcmVwYXJlIGFyZ3VtZW50cy5cbiAgICBsZXQgbWV0aG9kQXJncyA9IHtcbiAgICAgIGRvYyxcbiAgICAgIHNpbXVsYXRpb24sXG4gICAgICB0cnVzdGVkOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgcmVzdWx0ID0gZG9jdW1lbnRTb2Z0UmVtb3ZlKG1ldGhvZEFyZ3MpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCByZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb2Z0UmVtb3ZlO1xuIiwiaW1wb3J0IHsgTWF0Y2ggfSBmcm9tIFwibWV0ZW9yL2NoZWNrXCI7XG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5pbXBvcnQgZG9jdW1lbnRTb2Z0UmVzdG9yZSBmcm9tIFwiLi4vdXRpbHMvZG9jdW1lbnRTb2Z0UmVzdG9yZVwiO1xuY29uc3QgaXNSZW1vdGUgPSBNb2R1bGUubW9kdWxlcy5zdG9yYWdlLnV0aWxzLmlzUmVtb3RlO1xuY29uc3QgY2FsbE1ldGVvck1ldGhvZCA9IE1vZHVsZS5tb2R1bGVzLnN0b3JhZ2UudXRpbHMuY2FsbE1ldGVvck1ldGhvZDtcblxuY29uc3Qgc29mdFJlc3RvcmUgPSBmdW5jdGlvbihhcmdzID0ge30sIGNhbGxiYWNrKSB7XG4gIGxldCBkb2MgPSB0aGlzO1xuICBsZXQgQ2xhc3MgPSBkb2MuY29uc3RydWN0b3I7XG5cbiAgLy8gSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGNhbGxiYWNrIGZ1bmN0aW9uIHRoZW4gcmVhc3NpZ24gdmFsdWVzLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiBNYXRjaC50ZXN0KGFyZ3MsIEZ1bmN0aW9uKSkge1xuICAgIGNhbGxiYWNrID0gYXJncztcbiAgICBhcmdzID0ge307XG4gIH1cbiAgLy8gR2V0IHZhcmlhYmxlcyBmcm9tIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgbGV0IHsgc2ltdWxhdGlvbiA9IHRydWUgfSA9IGFyZ3M7XG5cbiAgLy8gSWYgd2UgYXJlIGRlYWxpbmcgd2l0aCBhIHJlbW90ZSBjb2xsZWN0aW9uIGFuZCB3ZSBhcmUgbm90IG9uIHRoZSBzZXJ2ZXIuXG4gIGlmIChpc1JlbW90ZShDbGFzcykpIHtcbiAgICAvLyBQcmVwYXJlIG1ldGVvciBtZXRob2QgbmFtZSB0byBiZSBjYWxsZWQuXG4gICAgbGV0IG1ldGhvZE5hbWUgPSBcIi9Bc3Ryb25vbXkvc29mdFJlc3RvcmVcIjtcbiAgICAvLyBQcmVwYXJlIGFyZ3VtZW50cyBmb3IgdGhlIG1ldGVvciBtZXRob2QuXG4gICAgbGV0IG1ldGhvZEFyZ3MgPSB7XG4gICAgICBjbGFzc05hbWU6IENsYXNzLmdldE5hbWUoKSxcbiAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgIF9pZDogZG9jLl9pZFxuICAgICAgfSxcbiAgICAgIHNpbXVsYXRpb25cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFJ1biBtZXRlb3IgbWV0aG9kLlxuICAgICAgbGV0IHJlc3VsdCA9IGNhbGxNZXRlb3JNZXRob2QoQ2xhc3MsIG1ldGhvZE5hbWUsIFttZXRob2RBcmdzXSwgY2FsbGJhY2spO1xuICAgICAgLy8gUmV0dXJuIHJlc3VsdCBvZiB0aGUgbWV0ZW9yIG1ldGhvZCBjYWxsLlxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIENhdGNoIHN0dWIgZXhjZXB0aW9ucy5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB3ZSBjYW4ganVzdCByZW1vdmUgYSBkb2N1bWVudCB3aXRob3V0IGNhbGxpbmcgdGhlIG1ldGVvciBtZXRob2QuIFdlIG1heVxuICAvLyBiZSBvbiB0aGUgc2VydmVyIG9yIHRoZSBjb2xsZWN0aW9uIG1heSBiZSBsb2NhbC5cbiAgdHJ5IHtcbiAgICAvLyBQcmVwYXJlIGFyZ3VtZW50cy5cbiAgICBsZXQgbWV0aG9kQXJncyA9IHtcbiAgICAgIGRvYyxcbiAgICAgIHNpbXVsYXRpb24sXG4gICAgICB0cnVzdGVkOiB0cnVlXG4gICAgfTtcbiAgICBsZXQgcmVzdWx0ID0gZG9jdW1lbnRTb2Z0UmVzdG9yZShtZXRob2RBcmdzKTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc29mdFJlc3RvcmU7XG4iLCJpbXBvcnQgY2xhc3NTb2Z0UmVtb3ZlIGZyb20gXCIuLi91dGlscy9jbGFzc1NvZnRSZW1vdmVcIjtcblxuY29uc3Qgc29mdFJlbW92ZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcmV0dXJuIGNsYXNzU29mdFJlbW92ZShhcmdzKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvZnRSZW1vdmU7XG4iLCJpbXBvcnQgY2xhc3NTb2Z0UmVzdG9yZSBmcm9tIFwiLi4vdXRpbHMvY2xhc3NTb2Z0UmVzdG9yZVwiO1xuXG5jb25zdCBzb2Z0UmVzdG9yZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcmV0dXJuIGNsYXNzU29mdFJlc3RvcmUoYXJncyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb2Z0UmVzdG9yZTtcbiIsImltcG9ydCB7IENsYXNzIGFzIEFzdHJvQ2xhc3MsIE1vZHVsZSB9IGZyb20gXCJtZXRlb3IvamFnaTphc3Ryb25vbXlcIjtcbmltcG9ydCBkb2N1bWVudFNvZnRSZW1vdmUgZnJvbSBcIi4vZG9jdW1lbnRTb2Z0UmVtb3ZlXCI7XG5jb25zdCB0aHJvd0lmU2VsZWN0b3JJc05vdElkID1cbiAgTW9kdWxlLm1vZHVsZXMuc3RvcmFnZS51dGlscy50aHJvd0lmU2VsZWN0b3JJc05vdElkO1xuXG5jb25zdCBjbGFzc1JlbW92ZSA9IGZ1bmN0aW9uKGFyZ3MgPSB7fSkge1xuICBsZXQgeyBjbGFzc05hbWUsIHNlbGVjdG9yLCBzaW11bGF0aW9uID0gdHJ1ZSwgdHJ1c3RlZCA9IGZhbHNlIH0gPSBhcmdzO1xuXG4gIC8vIFN0b3AgZXhlY3V0aW9uLCBpZiB3ZSBhcmUgbm90IG9uIHRoZSBzZXJ2ZXIsIHdoZW4gdGhlIFwic2ltdWxhdGlvblwiIGZsYWcgaXNcbiAgLy8gbm90IHNldC5cbiAgaWYgKCFzaW11bGF0aW9uICYmICFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUaHJvdyBleGNlcHRpb24gaWYgd2UgYXJlIHRyeWluZyB0byBwZXJmb3JtIGFuIG9wZXJhdGlvbiBvbiBtb3JlIHRoYW4gb25lXG4gIC8vIGRvY3VtZW50IGF0IG9uY2UgYW5kIGl0J3Mgbm90IHRydXN0ZWQgY2FsbC5cbiAgaWYgKCF0cnVzdGVkKSB7XG4gICAgdGhyb3dJZlNlbGVjdG9ySXNOb3RJZChzZWxlY3RvciwgXCJzb2Z0UmVtb3ZlXCIpO1xuICB9XG5cbiAgbGV0IENsYXNzID0gQXN0cm9DbGFzcy5nZXQoY2xhc3NOYW1lKTtcbiAgLy8gR2V0IGFsbCBkb2N1bWVudHMgbWF0Y2hpbmcgc2VsZWN0b3IuXG4gIGxldCBkb2NzID0gQ2xhc3MuZmluZChzZWxlY3Rvcik7XG4gIC8vIFByZXBhcmUgcmVzdWx0IG9mIHRoZSBtZXRob2QgZXhlY3V0aW9uLlxuICBsZXQgcmVzdWx0ID0gMDtcblxuICBkb2NzLmZvckVhY2goZG9jID0+IHtcbiAgICAvLyBVcGRhdGUgYSBkb2N1bWVudC5cbiAgICByZXN1bHQgKz0gZG9jdW1lbnRTb2Z0UmVtb3ZlKHtcbiAgICAgIGRvYyxcbiAgICAgIHNpbXVsYXRpb24sXG4gICAgICB0cnVzdGVkXG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzc1JlbW92ZTtcbiIsImltcG9ydCB7IENsYXNzIGFzIEFzdHJvQ2xhc3MsIE1vZHVsZSB9IGZyb20gXCJtZXRlb3IvamFnaTphc3Ryb25vbXlcIjtcbmltcG9ydCBkb2N1bWVudFNvZnRSZXN0b3JlIGZyb20gXCIuL2RvY3VtZW50U29mdFJlc3RvcmVcIjtcbmNvbnN0IHRocm93SWZTZWxlY3RvcklzTm90SWQgPVxuICBNb2R1bGUubW9kdWxlcy5zdG9yYWdlLnV0aWxzLnRocm93SWZTZWxlY3RvcklzTm90SWQ7XG5cbmNvbnN0IGNsYXNzUmVzdG9yZSA9IGZ1bmN0aW9uKGFyZ3MgPSB7fSkge1xuICBsZXQgeyBjbGFzc05hbWUsIHNlbGVjdG9yLCBzaW11bGF0aW9uID0gdHJ1ZSwgdHJ1c3RlZCA9IGZhbHNlIH0gPSBhcmdzO1xuXG4gIC8vIFN0b3AgZXhlY3V0aW9uLCBpZiB3ZSBhcmUgbm90IG9uIHRoZSBzZXJ2ZXIsIHdoZW4gdGhlIFwic2ltdWxhdGlvblwiIGZsYWcgaXNcbiAgLy8gbm90IHNldC5cbiAgaWYgKCFzaW11bGF0aW9uICYmICFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUaHJvdyBleGNlcHRpb24gaWYgd2UgYXJlIHRyeWluZyB0byBwZXJmb3JtIGFuIG9wZXJhdGlvbiBvbiBtb3JlIHRoYW4gb25lXG4gIC8vIGRvY3VtZW50IGF0IG9uY2UgYW5kIGl0J3Mgbm90IHRydXN0ZWQgY2FsbC5cbiAgaWYgKCF0cnVzdGVkKSB7XG4gICAgdGhyb3dJZlNlbGVjdG9ySXNOb3RJZChzZWxlY3RvciwgXCJzb2Z0UmVzdG9yZVwiKTtcbiAgfVxuXG4gIGxldCBDbGFzcyA9IEFzdHJvQ2xhc3MuZ2V0KGNsYXNzTmFtZSk7XG4gIC8vIEdldCBhbGwgZG9jdW1lbnRzIG1hdGNoaW5nIHNlbGVjdG9yLlxuICBsZXQgZG9jcyA9IENsYXNzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICBkaXNhYmxlRXZlbnRzOiB0cnVlXG4gIH0pO1xuICAvLyBQcmVwYXJlIHJlc3VsdCBvZiB0aGUgbWV0aG9kIGV4ZWN1dGlvbi5cbiAgbGV0IHJlc3VsdCA9IDA7XG5cbiAgZG9jcy5mb3JFYWNoKGRvYyA9PiB7XG4gICAgLy8gVXBkYXRlIGEgZG9jdW1lbnQuXG4gICAgcmVzdWx0ICs9IGRvY3VtZW50U29mdFJlc3RvcmUoe1xuICAgICAgZG9jLFxuICAgICAgc2ltdWxhdGlvbixcbiAgICAgIHRydXN0ZWRcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzUmVzdG9yZTtcbiIsImltcG9ydCBfZGVmYXVsdHMgZnJvbSBcImxvZGFzaC9kZWZhdWx0c1wiO1xuaW1wb3J0IHRyaWdnZXJCZWZvcmVTb2Z0UmVtb3ZlIGZyb20gXCIuL3RyaWdnZXJCZWZvcmVTb2Z0UmVtb3ZlXCI7XG5pbXBvcnQgdHJpZ2dlckFmdGVyU29mdFJlbW92ZSBmcm9tIFwiLi90cmlnZ2VyQWZ0ZXJTb2Z0UmVtb3ZlXCI7XG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5cbmNvbnN0IGdldE1vZGlmaWVyID0gTW9kdWxlLm1vZHVsZXMuc3RvcmFnZS51dGlscy5nZXRNb2RpZmllcjtcblxuY29uc3QgZG9jdW1lbnRTb2Z0UmVtb3ZlID0gZnVuY3Rpb24oYXJncyA9IHt9KSB7XG4gIGNvbnN0IHsgZG9jLCBzaW11bGF0aW9uID0gdHJ1ZSwgdHJ1c3RlZCA9IGZhbHNlIH0gPSBhcmdzO1xuXG4gIC8vIFN0b3AgZXhlY3V0aW9uLCBpZiB3ZSBhcmUgbm90IG9uIHRoZSBzZXJ2ZXIsIHdoZW4gdGhlIFwic2ltdWxhdGlvblwiIGZsYWcgaXNcbiAgLy8gbm90IHNldC5cbiAgaWYgKCFzaW11bGF0aW9uICYmICFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBDbGFzcyA9IGRvYy5jb25zdHJ1Y3RvcjtcbiAgY29uc3QgQ29sbGVjdGlvbiA9IENsYXNzLmdldENvbGxlY3Rpb24oKTtcblxuICAvLyBSZW1vdmUgb25seSB3aGVuIGRvY3VtZW50IGhhcyB0aGUgXCJfaWRcIiBmaWVsZCAoaXQncyBwZXJzaXN0ZWQpLlxuICBpZiAoQ2xhc3MuaXNOZXcoZG9jKSB8fCAhZG9jLl9pZCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYSBjbGFzcyBpcyBzZWN1cmVkLlxuICBpZiAoQ2xhc3MuaXNTZWN1cmVkKFwic29mdFJlbW92ZVwiKSAmJiBNZXRlb3IuaXNTZXJ2ZXIgJiYgIXRydXN0ZWQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJTb2Z0IHJlbW92aW5nIGZyb20gdGhlIGNsaWVudCBpcyBub3QgYWxsb3dlZFwiKTtcbiAgfVxuXG4gIC8vIFRyaWdnZXIgYmVmb3JlIGV2ZW50cy5cbiAgdHJpZ2dlckJlZm9yZVNvZnRSZW1vdmUoZG9jLCB0cnVzdGVkKTtcblxuICAvLyBQcmVwYXJlIHNlbGVjdG9yLlxuICBjb25zdCBzZWxlY3RvciA9IHtcbiAgICBfaWQ6IGRvYy5faWRcbiAgfTtcbiAgLy8gUHJlcGFyZSBtb2RpZmllci5cbiAgY29uc3QgbW9kaWZpZXIgPSBfZGVmYXVsdHMoXG4gICAgZ2V0TW9kaWZpZXIoe1xuICAgICAgZG9jXG4gICAgfSksXG4gICAge1xuICAgICAgJHNldDoge31cbiAgICB9XG4gICk7XG4gIGNvbnN0IGJlaGF2aW9yID0gQ2xhc3MuZ2V0QmVoYXZpb3IoXCJzb2Z0cmVtb3ZlXCIpWzBdO1xuICBtb2RpZmllci4kc2V0W2JlaGF2aW9yLm9wdGlvbnMucmVtb3ZlZEZpZWxkTmFtZV0gPSB0cnVlO1xuICBpZiAoYmVoYXZpb3Iub3B0aW9ucy5oYXNSZW1vdmVkQXRGaWVsZCkge1xuICAgIG1vZGlmaWVyLiRzZXRbYmVoYXZpb3Iub3B0aW9ucy5yZW1vdmVkQXRGaWVsZE5hbWVdID0gbmV3IERhdGUoKTtcbiAgfVxuICAvLyBSZW1vdmUgYSBkb2N1bWVudC5cbiAgY29uc3QgcmVzdWx0ID0gQ29sbGVjdGlvbi5fY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcblxuICAvLyBUcmlnZ2VyIGFmdGVyIGV2ZW50cy5cbiAgdHJpZ2dlckFmdGVyU29mdFJlbW92ZShkb2MsIHRydXN0ZWQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb2N1bWVudFNvZnRSZW1vdmU7XG4iLCJpbXBvcnQgdHJpZ2dlckJlZm9yZVNvZnRSZXN0b3JlIGZyb20gXCIuL3RyaWdnZXJCZWZvcmVTb2Z0UmVzdG9yZVwiO1xuaW1wb3J0IHRyaWdnZXJBZnRlclNvZnRSZXN0b3JlIGZyb20gXCIuL3RyaWdnZXJBZnRlclNvZnRSZXN0b3JlXCI7XG5cbmNvbnN0IGRvY3VtZW50U29mdFJlc3RvcmUgPSBmdW5jdGlvbihhcmdzID0ge30pIHtcbiAgY29uc3QgeyBkb2MsIHNpbXVsYXRpb24gPSB0cnVlLCB0cnVzdGVkID0gZmFsc2UgfSA9IGFyZ3M7XG5cbiAgLy8gU3RvcCBleGVjdXRpb24sIGlmIHdlIGFyZSBub3Qgb24gdGhlIHNlcnZlciwgd2hlbiB0aGUgXCJzaW11bGF0aW9uXCIgZmxhZyBpc1xuICAvLyBub3Qgc2V0LlxuICBpZiAoIXNpbXVsYXRpb24gJiYgIU1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IENsYXNzID0gZG9jLmNvbnN0cnVjdG9yO1xuICBjb25zdCBDb2xsZWN0aW9uID0gQ2xhc3MuZ2V0Q29sbGVjdGlvbigpO1xuXG4gIC8vIFJlc3RvcmUgb25seSB3aGVuIGRvY3VtZW50IGhhcyB0aGUgXCJfaWRcIiBmaWVsZCAoaXQncyBwZXJzaXN0ZWQpLlxuICBpZiAoQ2xhc3MuaXNOZXcoZG9jKSB8fCAhZG9jLl9pZCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYSBjbGFzcyBpcyBzZWN1cmVkLlxuICBpZiAoQ2xhc3MuaXNTZWN1cmVkKFwic29mdFJlc3RvcmVcIikgJiYgTWV0ZW9yLmlzU2VydmVyICYmICF0cnVzdGVkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgIDQwMyxcbiAgICAgIFwiU29mdCByZXN0b3JpbmcgZnJvbSB0aGUgY2xpZW50IGlzIG5vdCBhbGxvd2VkXCJcbiAgICApO1xuICB9XG5cbiAgLy8gVHJpZ2dlciBiZWZvcmUgZXZlbnRzLlxuICB0cmlnZ2VyQmVmb3JlU29mdFJlc3RvcmUoZG9jLCB0cnVzdGVkKTtcblxuICAvLyBQcmVwYXJlIHNlbGVjdG9yLlxuICBjb25zdCBzZWxlY3RvciA9IHtcbiAgICBfaWQ6IGRvYy5faWRcbiAgfTtcbiAgLy8gUHJlcGFyZSBtb2RpZmllci5cbiAgY29uc3QgbW9kaWZpZXIgPSB7XG4gICAgJHNldDoge31cbiAgfTtcbiAgY29uc3QgYmVoYXZpb3IgPSBDbGFzcy5nZXRCZWhhdmlvcihcInNvZnRyZW1vdmVcIilbMF07XG4gIG1vZGlmaWVyLiRzZXRbYmVoYXZpb3Iub3B0aW9ucy5yZW1vdmVkRmllbGROYW1lXSA9IGZhbHNlO1xuICBpZiAoYmVoYXZpb3Iub3B0aW9ucy5oYXNSZW1vdmVkQXRGaWVsZCkge1xuICAgIG1vZGlmaWVyLiR1bnNldCA9IHtcbiAgICAgIFtiZWhhdmlvci5vcHRpb25zLnJlbW92ZWRBdEZpZWxkTmFtZV06IFwiXCJcbiAgICB9O1xuICB9XG4gIC8vIFJlc3RvcmUgYSBkb2N1bWVudC5cbiAgY29uc3QgcmVzdWx0ID0gQ29sbGVjdGlvbi5fY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcblxuICAvLyBUcmlnZ2VyIGFmdGVyIGV2ZW50cy5cbiAgdHJpZ2dlckFmdGVyU29mdFJlc3RvcmUoZG9jLCB0cnVzdGVkKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9jdW1lbnRTb2Z0UmVzdG9yZTtcbiIsImltcG9ydCB7IEV2ZW50IH0gZnJvbSBcIm1ldGVvci9qYWdpOmFzdHJvbm9teVwiO1xuXG5jb25zdCB0cmlnZ2VyQWZ0ZXJTb2Z0UmVtb3ZlID0gZnVuY3Rpb24oZG9jLCB0cnVzdGVkKSB7XG4gIC8vIFRyaWdnZXIgdGhlIFwiYWZ0ZXJTb2Z0UmVtb3ZlXCIgZXZlbnQgaGFuZGxlcnMuXG4gIGRvYy5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBFdmVudChcImFmdGVyU29mdFJlbW92ZVwiLCB7XG4gICAgICBwcm9wYWdhdGVzOiB0cnVlLFxuICAgICAgdHJ1c3RlZDogdHJ1c3RlZFxuICAgIH0pXG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0cmlnZ2VyQWZ0ZXJTb2Z0UmVtb3ZlO1xuIiwiaW1wb3J0IHsgRXZlbnQgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5cbmNvbnN0IHRyaWdnZXJBZnRlclNvZnRSZXN0b3JlID0gZnVuY3Rpb24oZG9jLCB0cnVzdGVkKSB7XG4gIC8vIFRyaWdnZXIgdGhlIFwiYWZ0ZXJTb2Z0UmVzdG9yZVwiIGV2ZW50IGhhbmRsZXJzLlxuICBkb2MuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgRXZlbnQoXCJhZnRlclNvZnRSZXN0b3JlXCIsIHtcbiAgICAgIHByb3BhZ2F0ZXM6IHRydWUsXG4gICAgICB0cnVzdGVkOiB0cnVzdGVkXG4gICAgfSlcbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRyaWdnZXJBZnRlclNvZnRSZXN0b3JlO1xuIiwiaW1wb3J0IHsgRXZlbnQgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5cbmNvbnN0IHRyaWdnZXJCZWZvcmVTb2Z0UmVtb3ZlID0gZnVuY3Rpb24oZG9jLCB0cnVzdGVkKSB7XG4gIC8vIFRyaWdnZXIgdGhlIFwiYmVmb3JlU29mdFJlbW92ZVwiIGV2ZW50IGhhbmRsZXJzLlxuICBpZiAoXG4gICAgIWRvYy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEV2ZW50KFwiYmVmb3JlU29mdFJlbW92ZVwiLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIHByb3BhZ2F0ZXM6IHRydWUsXG4gICAgICAgIHRydXN0ZWQ6IHRydXN0ZWRcbiAgICAgIH0pXG4gICAgKVxuICApIHtcbiAgICAvLyBJZiBhbiBldmVudCB3YXMgcHJldmVudGVkLCB0aGVuIHdlIHN0b3AgaGVyZS5cbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwicHJldmVudGVkXCIsIFwiT3BlcmF0aW9uIHByZXZlbnRlZFwiLCB7XG4gICAgICBldmVudE5hbWU6IFwiYmVmb3JlU29mdFJlbW92ZVwiXG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRyaWdnZXJCZWZvcmVTb2Z0UmVtb3ZlO1xuIiwiaW1wb3J0IHsgRXZlbnQgfSBmcm9tIFwibWV0ZW9yL2phZ2k6YXN0cm9ub215XCI7XG5cbmNvbnN0IHRyaWdnZXJCZWZvcmVTb2Z0UmVzdG9yZSA9IGZ1bmN0aW9uKGRvYywgdHJ1c3RlZCkge1xuICAvLyBUcmlnZ2VyIHRoZSBcImJlZm9yZVNvZnRSZXN0b3JlXCIgZXZlbnQgaGFuZGxlcnMuXG4gIGlmIChcbiAgICAhZG9jLmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgRXZlbnQoXCJiZWZvcmVTb2Z0UmVzdG9yZVwiLCB7XG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIHByb3BhZ2F0ZXM6IHRydWUsXG4gICAgICAgIHRydXN0ZWQ6IHRydXN0ZWRcbiAgICAgIH0pXG4gICAgKVxuICApIHtcbiAgICAvLyBJZiBhbiBldmVudCB3YXMgcHJldmVudGVkLCB0aGVuIHdlIHN0b3AgaGVyZS5cbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwicHJldmVudGVkXCIsIFwiT3BlcmF0aW9uIHByZXZlbnRlZFwiLCB7XG4gICAgICBldmVudE5hbWU6IFwiYmVmb3JlU29mdFJlc3RvcmVcIlxuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB0cmlnZ2VyQmVmb3JlU29mdFJlc3RvcmU7XG4iXX0=
