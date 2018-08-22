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
var meteorInstall = Package['modules-runtime'].meteorInstall;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"client.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/client.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
require("./install-packages.js");
require("./stubs.js");
require("./process.js");
require("./reify.js");

exports.addStyles = require("./css").addStyles;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"css.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/css.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var doc = document;
var head = doc.getElementsByTagName("head").item(0);

exports.addStyles = function (css) {
  var style = doc.createElement("style");

  style.setAttribute("type", "text/css");

  // https://msdn.microsoft.com/en-us/library/ms535871(v=vs.85).aspx
  var internetExplorerSheetObject =
    style.sheet || // Edge/IE11.
    style.styleSheet; // Older IEs.

  if (internetExplorerSheetObject) {
    internetExplorerSheetObject.cssText = css;
  } else {
    style.appendChild(doc.createTextNode(css));
  }

  return head.appendChild(style);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"install-packages.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/install-packages.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function install(name, mainModule) {
  var meteorDir = {};

  // Given a package name <name>, install a stub module in the
  // /node_modules/meteor directory called <name>.js, so that
  // require.resolve("meteor/<name>") will always return
  // /node_modules/meteor/<name>.js instead of something like
  // /node_modules/meteor/<name>/index.js, in the rare but possible event
  // that the package contains a file called index.js (#6590).

  if (typeof mainModule === "string") {
    // Set up an alias from /node_modules/meteor/<package>.js to the main
    // module, e.g. meteor/<package>/index.js.
    meteorDir[name + ".js"] = mainModule;
  } else {
    // back compat with old Meteor packages
    meteorDir[name + ".js"] = function (r, e, module) {
      module.exports = Package[name];
    };
  }

  meteorInstall({
    node_modules: {
      meteor: meteorDir
    }
  });
}

// This file will be modified during computeJsOutputFilesMap to include
// install(<name>) calls for every Meteor package.

install("meteor");
install("meteor-base");
install("mobile-experience");
install("modules-runtime");
install("modules", "meteor/modules/client.js");
install("modern-browsers");
install("babel-compiler");
install("ecmascript");
install("ecmascript-runtime");
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");
install("promise", "meteor/promise/client.js");
install("fetch", "meteor/fetch/modern.js");
install("dynamic-import", "meteor/dynamic-import/client.js");
install("es5-shim");
install("ecmascript-runtime-client", "meteor/ecmascript-runtime-client/modern.js");
install("base64", "meteor/base64/base64.js");
install("ejson", "meteor/ejson/ejson.js");
install("diff-sequence", "meteor/diff-sequence/diff.js");
install("geojson-utils", "meteor/geojson-utils/main.js");
install("id-map", "meteor/id-map/id-map.js");
install("random");
install("mongo-id", "meteor/mongo-id/id.js");
install("ordered-dict", "meteor/ordered-dict/ordered_dict.js");
install("tracker");
install("minimongo", "meteor/minimongo/minimongo_client.js");
install("check", "meteor/check/match.js");
install("retry", "meteor/retry/retry.js");
install("callback-hook", "meteor/callback-hook/hook.js");
install("ddp-common");
install("reload", "meteor/reload/reload.js");
install("socket-stream-client", "meteor/socket-stream-client/browser.js");
install("ddp-client", "meteor/ddp-client/client/client.js");
install("ddp");
install("ddp-server");
install("allow-deny");
install("mongo-dev-server");
install("insecure");
install("mongo");
install("blaze-html-templates");
install("reactive-var");
install("standard-minifier-css");
install("standard-minifier-js");
install("shell-server");
install("mdg:validation-error");
install("jagi:astronomy", "meteor/jagi:astronomy/lib/main.js");
install("email");
install("jagi:astronomy-timestamp-behavior", "meteor/jagi:astronomy-timestamp-behavior/lib/main.js");
install("jagi:astronomy-softremove-behavior", "meteor/jagi:astronomy-softremove-behavior/lib/main.js");
install("jagi:astronomy-slug-behavior", "meteor/jagi:astronomy-slug-behavior/lib/main.js");
install("underscore");
install("jquery", "meteor/jquery/main.js");
install("observe-sequence");
install("deps");
install("htmljs");
install("blaze");
install("spacebars");
install("templating-compiler");
install("templating-runtime");
install("templating");
install("ddp-rate-limiter");
install("localstorage");
install("accounts-base", "meteor/accounts-base/client_main.js");
install("reactive-dict", "meteor/reactive-dict/migration.js");
install("useraccounts:core");
install("kadira:flow-router");
install("kadira:blaze-layout");
install("coffeescript");
install("softwarerero:accounts-t9n");
install("useraccounts:flow-routing");
install("useraccounts:bootstrap");
install("reywood:publish-composite");
install("rcy:nouislider");
install("alanning:roles");
install("jeremy:selectize");
install("practicalmeteor:chai");
install("twbs:bootstrap");
install("service-configuration");
install("session");
install("sha");
install("srp");
install("accounts-password");
install("less");
install("accounts-ui-unstyled");
install("accounts-ui");
install("jparker:crypto-core");
install("jparker:crypto-md5");
install("jparker:gravatar");
install("momentjs:moment");
install("tsega:bootstrap3-datetimepicker");
install("webapp", "meteor/webapp/webapp_client.js");
install("livedata");
install("hot-code-push");
install("launch-screen");
install("ui");
install("autoupdate");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/process.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (! global.process) {
  try {
    // The application can run `npm install process` to provide its own
    // process stub; otherwise this module will provide a partial stub.
    global.process = require("process");
  } catch (missing) {
    global.process = {};
  }
}

var proc = global.process;

if (Meteor.isServer) {
  // Make require("process") work on the server in all versions of Node.
  meteorInstall({
    node_modules: {
      "process.js": function (r, e, module) {
        module.exports = proc;
      }
    }
  });
} else {
  proc.platform = "browser";
  proc.nextTick = proc.nextTick || Meteor._setImmediate;
}

if (typeof proc.env !== "object") {
  proc.env = {};
}

var hasOwn = Object.prototype.hasOwnProperty;
for (var key in meteorEnv) {
  if (hasOwn.call(meteorEnv, key)) {
    proc.env[key] = meteorEnv[key];
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/reify.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
require("reify/lib/runtime").enable(
  module.constructor.prototype
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stubs.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/modules/stubs.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var haveStubs = false;
try {
  require.resolve("meteor-node-stubs");
  haveStubs = true;
} catch (noStubs) {}

if (haveStubs) {
  // When meteor-node-stubs is installed in the application's root
  // node_modules directory, requiring it here installs aliases for stubs
  // for all Node built-in modules, such as fs, util, and http.
  require("meteor-node-stubs");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"reify":{"lib":{"runtime":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/modules/node_modules/reify/lib/runtime/index.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

// This module should be compatible with PhantomJS v1, just like the other files
// in reify/lib/runtime. Node 4+ features like const/let and arrow functions are
// not acceptable here, and importing any npm packages should be contemplated
// with extreme skepticism.

var utils = require("./utils.js");
var Entry = require("./entry.js");

// The exports.enable method can be used to enable the Reify runtime for
// specific module objects, or for Module.prototype (where implemented),
// to make the runtime available throughout the entire module system.
exports.enable = function (mod) {
  if (mod.watch !== moduleWatch) {
    mod.watch = moduleWatch;
    mod["export"] = moduleExport;
    mod.exportDefault = moduleExportDefault;
    mod.runSetters = runSetters;

    // Used for copying the properties of a namespace object to
    // mod.exports to implement `export * from "module"` syntax.
    mod.makeNsSetter = moduleMakeNsSetter;

    return true;
  }

  return false;
};

// If key is provided, it will be used to identify the given setters so
// that they can be replaced if module.watch is called again with the same
// key. This avoids potential memory leaks from import declarations inside
// loops. The compiler generates these keys automatically (and
// deterministically) when compiling nested import declarations.
function moduleWatch(exported, setters, key) {
  utils.setESModule(this.exports);
  Entry.getOrCreate(this.exports, this);

  if (utils.isObject(setters)) {
    Entry.getOrCreate(exported).addSetters(this, setters, key);
  }
}

// Register getter functions for local variables in the scope of an export
// statement. Pass true as the second argument to indicate that the getter
// functions always return the same values.
function moduleExport(getters, constant) {
  utils.setESModule(this.exports);
  var entry = Entry.getOrCreate(this.exports, this);
  entry.addGetters(getters, constant);
  if (this.loaded) {
    // If the module has already been evaluated, then we need to trigger
    // another round of entry.runSetters calls, which begins by calling
    // entry.runModuleGetters(module).
    entry.runSetters();
  }
}

// Register a getter function that always returns the given value.
function moduleExportDefault(value) {
  return this["export"]({
    "default": function () {
      return value;
    }
  }, true);
}

// Platform-specific code should find a way to call this method whenever
// the module system is about to return module.exports from require. This
// might happen more than once per module, in case of dependency cycles,
// so we want Module.prototype.runSetters to run each time.
function runSetters(valueToPassThrough) {
  var entry = Entry.get(this.exports);
  if (entry !== null) {
    entry.runSetters();
  }

  if (this.loaded) {
    // If this module has finished loading, then we must create an Entry
    // object here, so that we can add this module to entry.ownerModules
    // by passing it as the second argument to Entry.getOrCreate.
    Entry.getOrCreate(this.exports, this);
  }

  // Assignments to exported local variables get wrapped with calls to
  // module.runSetters, so module.runSetters returns the
  // valueToPassThrough parameter to allow the value of the original
  // expression to pass through. For example,
  //
  //   export var a = 1;
  //   console.log(a += 3);
  //
  // becomes
  //
  //   module.export("a", () => a);
  //   var a = 1;
  //   console.log(module.runSetters(a += 3));
  //
  // This ensures module.runSetters runs immediately after the assignment,
  // and does not interfere with the larger computation.
  return valueToPassThrough;
}

// Returns a function that takes a namespace object and copies the
// properties of the namespace to module.exports, excluding any "default"
// property (by default, unless includeDefault is truthy), which is useful
// for implementing `export * from "module"`.
function moduleMakeNsSetter(includeDefault) {
  var module = this;
  // Discussion of why the "default" property is skipped:
  // https://github.com/tc39/ecma262/issues/948
  return function (namespace) {
    Object.keys(namespace).forEach(function (key) {
      if (includeDefault || key !== "default") {
        utils.copyKey(key, module.exports, namespace);
      }
    });
  };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/modules/node_modules/reify/lib/runtime/utils.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

// This module should be compatible with PhantomJS v1, just like the other files
// in reify/lib/runtime. Node 4+ features like const/let and arrow functions are
// not acceptable here, and importing any npm packages should be contemplated
// with extreme skepticism.

var useSetPrototypeOf = typeof Object.setPrototypeOf === "function";
var useSymbol = typeof Symbol === "function";

var esStrKey = "__esModule";
var esSymKey = useSymbol ? Symbol.for(esStrKey) : null;
var useToStringTag = useSymbol && typeof Symbol.toStringTag === "symbol";
var useGetOwnPropDesc =
  typeof Object.getOwnPropertyDescriptor === "function";
var hasOwn = Object.prototype.hasOwnProperty;

function copyKey(key, target, source) {
  if (useGetOwnPropDesc) {
    var desc = Object.getOwnPropertyDescriptor(source, key);
    desc.configurable = true; // Allow redefinition.
    Object.defineProperty(target, key, desc);
  } else {
    target[key] = source[key];
  }
}

exports.copyKey = copyKey;

// Returns obj[key] unless that property is defined by a getter function,
// in which case the getter function is returned.
exports.valueOrGetter = function (obj, key) {
  if (useGetOwnPropDesc && hasOwn.call(obj, key)) {
    var desc = Object.getOwnPropertyDescriptor(obj, key);
    if (typeof desc.get === "function") {
      return desc.get;
    }
  }

  return obj[key];
};

function getESModule(exported) {
  if (isObjectLike(exported)) {
    if (useSymbol && hasOwn.call(exported, esSymKey)) {
      return !! exported[esSymKey];
    }

    if (hasOwn.call(exported, esStrKey)) {
      return !! exported[esStrKey];
    }
  }

  return false;
}

exports.getESModule = getESModule;

function setESModule(exported) {
  if (isObjectLike(exported)) {
    if (useSymbol) {
      exported[esSymKey] = true;
    } else if (! exported[esStrKey]) {
      // Other module runtime systems may set exported.__esModule such
      // that it can't be redefined, so we call Object.defineProperty only
      // when exported.__esModule is not already true.
      Object.defineProperty(exported, esStrKey, {
        configurable: true,
        enumerable: false,
        value: true,
        writable: false
      });
    }
  }
}

exports.setESModule = setESModule;

function isObject(value) {
  return typeof value === "object" && value !== null;
}

exports.isObject = isObject;

function isObjectLike(value) {
  var type = typeof value;
  return type === "function" || (type === "object" && value !== null);
}

exports.isObjectLike = isObjectLike;

function createNamespace() {
  var namespace = Object.create(null);

  if (useToStringTag) {
    Object.defineProperty(namespace, Symbol.toStringTag, {
      value: "Module",
      configurable: false,
      enumerable: false,
      writable: false
    });
  }

  setESModule(namespace);

  return namespace;
}

exports.createNamespace = createNamespace;

function setPrototypeOf(object, proto) {
  if (useSetPrototypeOf) {
    Object.setPrototypeOf(object, proto);
  } else {
    object.__proto__ = proto;
  }
  return object;
}

exports.setPrototypeOf = setPrototypeOf;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"entry.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/modules/node_modules/reify/lib/runtime/entry.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

// This module should be compatible with PhantomJS v1, just like the other files
// in reify/lib/runtime. Node 4+ features like const/let and arrow functions are
// not acceptable here, and importing any npm packages should be contemplated
// with extreme skepticism.

var utils = require("./utils.js");

var GETTER_ERROR = {};
var NAN = {};
var UNDEFINED = {};
var hasOwn = Object.prototype.hasOwnProperty;
var keySalt = 0;

function Entry(exported) {
  // The module.exports of the module this Entry is managing.
  this.exports = exported;
  // Getters for local variables exported from the managed module.
  this.getters = Object.create(null);
  // Setters for assigning to local variables in parent modules.
  this.setters = Object.create(null);
  // The normalized namespace object that importers receive when they use
  // `import * as namespace from "..."` syntax.
  this.namespace = utils.createNamespace();
  // Map from module.id string to module object for each module this Entry
  // is managing.
  this.ownerModules = Object.create(null);
  // Boolean indicating whether all the modules this Entry is managing
  // have finished loading yet. Call entry.hasLoaded() to compute.
  this._loaded = false;
}

var Ep = utils.setPrototypeOf(Entry.prototype, null);

var weakEntryMap = typeof WeakMap === "function"
  ? new WeakMap
  : new (function FakeWeakMap() {
    // A barely functional WeakMap polyfill, just in case. This
    // implementation needs to be logically correct only in the specific
    // ways that the Entry class uses it. It isn't even "weak" in the
    // garbage-collection sense of the word, but that's fine.
    var keys = [];
    var values = [];

    this.get = function (obj) {
      var index = keys.indexOf(obj);
      if (index >= 0) {
        return values[index];
      }
    };

    this.set = function (obj, value) {
      var index = keys.indexOf(obj);
      if (index >= 0) {
        values[index] = value;
      } else {
        keys.push(obj);
        values.push(value);
      }
    };
  });

Entry.get = function (exported) {
  if (utils.isObjectLike(exported)) {
    var entry = weakEntryMap.get(exported);
    if (entry !== void 0) {
      return entry;
    }
  }
  return null;
};

Entry.getOrCreate = function (exported, mod) {
  var entry = getOrCreate(exported);

  if (utils.isObject(mod)) {
    entry.ownerModules[mod.id] = mod;
  }

  return entry;
};

function getOrCreate(exported) {
  if (! utils.isObjectLike(exported)) {
    // In case the child module modified module.exports, create a temporary
    // Entry object so that we can call the entry.addSetters method once,
    // which will trigger entry.runSetters(names), so that module.importSync
    // behaves as expected.
    return new Entry(exported);
  }

  var entry = weakEntryMap.get(exported);
  if (entry !== void 0) {
    return entry;
  }

  var entry = new Entry(exported);
  weakEntryMap.set(exported, entry);
  return entry;
};

function safeKeys(obj) {
  var keys = Object.keys(obj);
  var esModuleIndex = keys.indexOf("__esModule");
  if (esModuleIndex >= 0) {
    keys.splice(esModuleIndex, 1);
  }
  return keys;
}

Ep.addGetters = function (getters, constant) {
  var names = safeKeys(getters);
  var nameCount = names.length;
  constant = !! constant;

  for (var i = 0; i < nameCount; ++i) {
    var name = names[i];
    var getter = getters[name];

    if (typeof getter === "function" &&
        // Should this throw if this.getters[name] exists?
        ! (name in this.getters)) {
      this.getters[name] = getter;
      getter.constant = constant;
      getter.runCount = 0;
    }
  }
};

Ep.addSetters = function (parent, setters, key) {
  var names = safeKeys(setters);
  var nameCount = names.length;

  if (! nameCount) {
    return;
  }

  // If no key is provided, make a unique key. Otherwise, make sure the key is
  // distinct from keys provided by other parent modules.
  key = key === void 0
    ? makeUniqueKey()
    : parent.id + ":" + key;

  for (var i = 0; i < nameCount; ++i) {
    var name = names[i];
    var setter = setters[name];

    if (typeof setter === "function") {
      setter.parent = parent;
      if (! (name in this.setters)) {
        this.setters[name] = Object.create(null);
      }
      this.setters[name][key] = setter;
    }
  }

  this.runSetters(names);
};

Ep.runGetters = function (names) {
  // Before running getters, copy anything added to the exports object
  // over to the namespace. Values returned by getters take precedence
  // over these values, but we don't want to miss anything.
  syncExportsToNamespace(this, names);

  if (names === void 0 ||
      names.indexOf("*") >= 0) {
    names = Object.keys(this.getters);
  }

  var nameCount = names.length;

  for (var i = 0; i < nameCount; ++i) {
    var name = names[i];
    var value = runGetter(this, name);

    // If the getter is run without error, update both entry.namespace and
    // module.exports with the current value so that CommonJS require
    // calls remain consistent with module.watch.
    if (value !== GETTER_ERROR) {
      this.namespace[name] = value;
      this.exports[name] = value;
    }
  }
};

function syncExportsToNamespace(entry, names) {
  var setDefault = false;

  if (! utils.getESModule(entry.exports)) {
    // If the module entry is managing overrides module.exports, that
    // value should be exposed as the .default property of the namespace,
    // unless module.exports is marked as an ECMASCript module.
    entry.namespace.default = entry.exports;
    setDefault = true;
  }

  if (! utils.isObjectLike(entry.exports)) {
    return;
  }

  if (names === void 0 ||
      names.indexOf("*") >= 0) {
    names = Object.keys(entry.exports);
  }

  names.forEach(function (key) {
    // Don't set any properties for which a getter function exists in
    // entry.getters, don't accidentally override entry.namespace.default,
    // and only copy own properties from entry.exports.
    if (! hasOwn.call(entry.getters, key) &&
        ! (setDefault && key === "default") &&
        hasOwn.call(entry.exports, key)) {
      utils.copyKey(key, entry.namespace, entry.exports);
    }
  });
}

// Called by module.runSetters once the module this Entry is managing has
// finished loading.
Ep.hasLoaded = function () {
  if (this._loaded) {
    return true;
  }

  var ids = Object.keys(this.ownerModules);
  var idCount = ids.length;

  for (var i = 0; i < idCount; ++i) {
    var owner = this.ownerModules[ids[i]];
    if (! owner.loaded && owner.exports === this.exports) {
      // At least one owner module whose exports are still ===
      // this.exports has not finished loading, so this this Entry cannot
      // be marked as loaded yet.
      return false;
    }
  }

  // Set entry._loaded = true only if all the modules in
  // entry.ownerModules that are still associated with entry.exports have
  // finished loading.
  return this._loaded = true;
};

// Called whenever module.exports might have changed, to trigger any
// setters associated with the newly exported values. The names parameter
// is optional; without it, all getters and setters will run.
Ep.runSetters = function (names) {
  // Make sure entry.namespace and module.exports are up to date before we
  // call getExportByName(entry, name).
  this.runGetters(names);

  // Lazily-initialized object mapping parent module identifiers to parent
  // module objects whose setters we might need to run.
  var parents;

  forEachSetter(this, names, function (setter, name, value) {
    if (parents === void 0) {
      parents = Object.create(null);
    }
    parents[setter.parent.id] = setter.parent;

    // The param order for setters is `value` then `name` because the `name`
    // param is only used by namespace exports.
    setter(value, name);
  });

  if (! parents) {
    return;
  }

  // If any of the setters updated the module.exports of a parent module,
  // or updated local variables that are exported by that parent module,
  // then we must re-run any setters registered by that parent module.
  var parentIDs = Object.keys(parents);
  var parentIDCount = parentIDs.length;

  for (var i = 0; i < parentIDCount; ++i) {
    // What happens if parents[parentIDs[id]] === module, or if
    // longer cycles exist in the parent chain? Thanks to our setter.last
    // bookkeeping above, the runSetters broadcast will only proceed
    // as far as there are any actual changes to report.
    var parent = parents[parentIDs[i]];
    var parentEntry = Entry.get(parent.exports);
    if (parentEntry) {
      parentEntry.runSetters();
    }
  }
};

function callSetterIfNecessary(setter, name, value, callback) {
  if (name === "__esModule") {
    // Ignore setters asking for module.exports.__esModule.
    return;
  }

  var shouldCall = false;

  if (setter.last === void 0) {
    setter.last = Object.create(null);
    // Always call the setter if it has never been called before.
    shouldCall = true;
  }

  function changed(name, value) {
    var valueToCompare = value;
    if (valueToCompare !== valueToCompare) {
      valueToCompare = NAN;
    } else if (valueToCompare === void 0) {
      valueToCompare = UNDEFINED;
    }

    if (setter.last[name] === valueToCompare) {
      return false;
    }

    setter.last[name] = valueToCompare;
    return true;
  }

  if (name === "*") {
    var keys = safeKeys(value);
    var keyCount = keys.length;
    for (var i = 0; i < keyCount; ++i) {
      var key = keys[i];
      // Evaluating value[key] is risky because the property might be
      // defined by a getter function that logs a deprecation warning (or
      // worse) when evaluated. For example, Node uses this trick to
      // display a deprecation warning whenever crypto.createCredentials
      // is accessed. Fortunately, when value[key] is defined by a getter
      // function, it's enough to check whether the getter function itself
      // has changed, since we are careful elsewhere to preserve getters
      // rather than prematurely evaluating them.
      if (changed(key, utils.valueOrGetter(value, key))) {
        shouldCall = true;
      }
    }
  } else if (changed(name, value)) {
    shouldCall = true;
  }

  if (shouldCall) {
    // Only invoke the callback if we have not called this setter
    // (with a value of this name) before, or the current value is
    // different from the last value we passed to this setter.
    return callback(setter, name, value);
  }
}

// Invoke the given callback once for every (setter, name, value) that needs to
// be called. Note that forEachSetter does not call any setters itself, only the
// given callback.
function forEachSetter(entry, names, callback) {
  var needToCheckNames = true;

  if (names === void 0) {
    names = Object.keys(entry.setters);
    needToCheckNames = false;
  }

  var nameCount = names.length;

  for (var i = 0; i < nameCount; ++i) {
    var name = names[i];

    if (needToCheckNames &&
        ! hasOwn.call(entry.setters, name)) {
      continue;
    }

    var setters = entry.setters[name];
    var keys = Object.keys(setters);
    var keyCount = keys.length;

    for (var j = 0; j < keyCount; ++j) {
      var key = keys[j];
      var value = getExportByName(entry, name);

      callSetterIfNecessary(setters[key], name, value, callback);

      var getter = entry.getters[name];
      if (typeof getter === "function" &&
          // Sometimes a getter function will throw because it's called
          // before the variable it's supposed to return has been
          // initialized, so we need to know that the getter function has
          // run to completion at least once.
          getter.runCount > 0 &&
          getter.constant) {
        // If we happen to know that this getter function has run
        // successfully, and will never return a different value, then we
        // can forget the corresponding setter, because we've already
        // reported that constant value. Note that we can't forget the
        // getter, because we need to remember the original value in case
        // anyone tampers with entry.exports[name].
        delete setters[key];
      }
    }
  }
}

function getExportByName(entry, name) {
  if (name === "*") {
    return entry.namespace;
  }

  if (hasOwn.call(entry.namespace, name)) {
    return entry.namespace[name];
  }

  var exported = entry.exports;

  if (name === "default" &&
      ! (utils.getESModule(exported) &&
         "default" in exported)) {
    return exported;
  }

  if (exported == null) {
    return;
  }

  return exported[name];
}

function makeUniqueKey() {
  return Math.random()
    .toString(36)
    // Add an incrementing salt to help track key ordering and also
    // absolutely guarantee we never return the same key twice.
    .replace("0.", ++keySalt + "$");
}

function runGetter(entry, name) {
  var getter = entry.getters[name];
  try {
    var result = getter();
    ++getter.runCount;
    return result;
  } catch (e) {}
  return GETTER_ERROR;
}

module.exports = Entry;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
meteorInstall({"node_modules":{"meteor-node-stubs":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor-node-stubs/package.json                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "meteor-node-stubs";
exports.version = "0.4.1";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor-node-stubs/index.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var map = require("./map.json");
var meteorAliases = {};

Object.keys(map).forEach(function (id) {
  if (typeof map[id] === "string") {
    var aliasParts = module.id.split("/");
    aliasParts.pop();
    aliasParts.push("node_modules", map[id]);
    exports[id] = meteorAliases[id + ".js"] =
      aliasParts.join("/");
  } else {
    exports[id] = map[id];
    meteorAliases[id + ".js"] = function(){};
  }
});

if (typeof meteorInstall === "function") {
  meteorInstall({
    // Install the aliases into a node_modules directory one level up from
    // the root directory, so that they do not clutter the namespace
    // available to apps and packages.
    "..": {
      node_modules: meteorAliases
    }
  });
}

// If Buffer is not defined globally, but the "buffer" built-in stub is
// installed and can be imported, use it to define global.Buffer so that
// modules like core-util-is/lib/util.js can refer to Buffer without
// crashing application startup.
if (typeof global.Buffer !== "function") {
  try {
    // Use (0, require)(...) to avoid registering a dependency on the
    // "buffer" stub, in case it is not otherwise bundled.
    global.Buffer = (0, require)("buffer").Buffer;
  } catch (ok) {
    // Failure to import "buffer" is fine as long as the Buffer global
    // variable is not used.
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"map.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor-node-stubs/map.json                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "assert": "assert/",
  "buffer": "buffer/",
  "child_process": null,
  "cluster": null,
  "console": "console-browserify",
  "constants": "constants-browserify",
  "crypto": "../wrappers/crypto.js",
  "dgram": null,
  "dns": null,
  "domain": "domain-browser",
  "events": "events/",
  "fs": null,
  "http": "stream-http",
  "https": "https-browserify",
  "module": "../wrappers/module.js",
  "net": null,
  "os": "os-browserify/browser.js",
  "path": "path-browserify",
  "process": "process/browser.js",
  "punycode": "punycode/",
  "querystring": "querystring-es3/",
  "readline": null,
  "repl": null,
  "stream": "stream-browserify",
  "_stream_duplex": "readable-stream/duplex.js",
  "_stream_passthrough": "readable-stream/passthrough.js",
  "_stream_readable": "readable-stream/readable.js",
  "_stream_transform": "readable-stream/transform.js",
  "_stream_writable": "readable-stream/writable.js",
  "string_decoder": "string_decoder/",
  "sys": "util/util.js",
  "timers": "timers-browserify",
  "tls": null,
  "tty": "tty-browserify",
  "url": "url/",
  "util": "util/util.js",
  "vm": "vm-browserify",
  "zlib": "browserify-zlib"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deps":{"process.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor-node-stubs/deps/process.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
require("process/browser.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"process":{"browser.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor-node-stubs/node_modules/process/browser.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"@babel":{"runtime":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/@babel/runtime/package.json                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "_from": "@babel/runtime@7.0.0-beta.55",
  "_id": "@babel/runtime@7.0.0-beta.55",
  "_inBundle": false,
  "_integrity": "sha1-C8M6paasCwEvN+JbnmqqLkiakWs=",
  "_location": "/@babel/runtime",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "@babel/runtime@7.0.0-beta.55",
    "name": "@babel/runtime",
    "escapedName": "@babel%2fruntime",
    "scope": "@babel",
    "rawSpec": "7.0.0-beta.55",
    "saveSpec": null,
    "fetchSpec": "7.0.0-beta.55"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.0.0-beta.55.tgz",
  "_shasum": "0bc33aa5a6ac0b012f37e25b9e6aaa2e489a916b",
  "_spec": "@babel/runtime@7.0.0-beta.55",
  "_where": "C:\\Users\\wayne\\src\\kwaiette\\tmp\\padawan",
  "author": {
    "name": "Sebastian McKenzie",
    "email": "sebmck@gmail.com"
  },
  "bundleDependencies": false,
  "dependencies": {
    "core-js": "^2.5.7",
    "regenerator-runtime": "^0.12.0"
  },
  "deprecated": false,
  "description": "babel selfContained runtime",
  "devDependencies": {
    "@babel/core": "7.0.0-beta.55",
    "@babel/helpers": "7.0.0-beta.55",
    "@babel/plugin-transform-runtime": "7.0.0-beta.55",
    "@babel/preset-env": "7.0.0-beta.55",
    "@babel/types": "7.0.0-beta.55"
  },
  "license": "MIT",
  "name": "@babel/runtime",
  "repository": {
    "type": "git",
    "url": "https://github.com/babel/babel/tree/master/packages/babel-runtime"
  },
  "version": "7.0.0-beta.55"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers":{"builtin":{"interopRequireDefault.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/@babel/runtime/helpers/builtin/interopRequireDefault.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

module.exports = _interopRequireDefault;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"objectSpread.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/@babel/runtime/helpers/builtin/objectSpread.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var defineProperty = require("./defineProperty");

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }

  return target;
}

module.exports = _objectSpread;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defineProperty.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/@babel/runtime/helpers/builtin/defineProperty.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},"core-js":{"modules":{"es7.object.get-own-property-descriptors.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.object.get-own-property-descriptors.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_export.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_export.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_global.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_global.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_core.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_core.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hide.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_hide.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-dp.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-dp.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_an-object.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_an-object.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_is-object.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_is-object.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_ie8-dom-define.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_ie8-dom-define.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_descriptors.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_descriptors.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_fails.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_fails.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_dom-create.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_dom-create.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-primitive.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-primitive.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_property-desc.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_property-desc.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_redefine.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_redefine.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_has.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_has.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_uid.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_uid.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_ctx.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_ctx.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_a-function.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_a-function.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_own-keys.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_own-keys.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-gopn.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-gopn.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-keys-internal.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-keys-internal.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-iobject.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-iobject.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_iobject.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_iobject.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cof.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_cof.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_defined.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_defined.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_array-includes.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_array-includes.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-length.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-length.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-integer.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-integer.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-absolute-index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-absolute-index.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_shared-key.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_shared-key.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_shared.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_shared.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_library.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_library.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = false;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_enum-bug-keys.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_enum-bug-keys.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-gops.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-gops.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.f = Object.getOwnPropertySymbols;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-gopd.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-gopd.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-pie.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-pie.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.f = {}.propertyIsEnumerable;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_create-property.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_create-property.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es6.object.is.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es6.object.is.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_same-value.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_same-value.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es6.function.name.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es6.function.name.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es6.number.is-finite.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es6.number.is-finite.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es6.number.is-nan.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es6.number.is-nan.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.array.flatten.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.array.flatten.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_flatten-into-array.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_flatten-into-array.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_is-array.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_is-array.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_wks.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_wks.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_to-object.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_to-object.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_array-species-create.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_array-species-create.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_array-species-constructor.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_array-species-constructor.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_add-to-unscopables.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_add-to-unscopables.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.array.flat-map.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.array.flat-map.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.object.values.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.object.values.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-to-array.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-to-array.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_object-keys.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_object-keys.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.object.entries.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.object.entries.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.string.pad-start.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.string.pad-start.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_string-pad.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_string-pad.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_string-repeat.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_string-repeat.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_user-agent.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/_user-agent.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"es7.string.pad-end.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/core-js/modules/es7.string.pad-end.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".less"
  ]
});

var exports = require("/node_modules/meteor/modules/client.js");

/* Exports */
Package._define("modules", exports, {
  meteorInstall: meteorInstall
});

})();
