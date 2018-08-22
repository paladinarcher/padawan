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
var DDP = Package['ddp-client'].DDP;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var ValidationError = Package['mdg:validation-error'].ValidationError;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"jagi:astronomy":{"lib":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/main.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
module1.export({
  Astro: function () {
    return Astro;
  },
  Module: function () {
    return Module;
  },
  Class: function () {
    return Class;
  },
  Enum: function () {
    return Enum;
  },
  Union: function () {
    return Union;
  },
  Type: function () {
    return Type;
  },
  Field: function () {
    return Field;
  },
  ScalarField: function () {
    return ScalarField;
  },
  ObjectField: function () {
    return ObjectField;
  },
  ListField: function () {
    return ListField;
  },
  Behavior: function () {
    return Behavior;
  },
  Validator: function () {
    return Validator;
  },
  Validators: function () {
    return Validators;
  },
  ValidationError: function () {
    return ValidationError;
  },
  Event: function () {
    return Event;
  },
  reservedKeywords: function () {
    return reservedKeywords;
  }
});
module1.watch(require("./core/ejson.js"));
module1.watch(require("./modules/core/module.js"));
module1.watch(require("./modules/storage/module.js"));
module1.watch(require("./modules/behaviors/module.js"));
module1.watch(require("./modules/events/module.js"));
module1.watch(require("./modules/methods/module.js"));
module1.watch(require("./modules/helpers/module.js"));
module1.watch(require("./modules/fields/module.js"));
module1.watch(require("./modules/indexes/module.js"));
module1.watch(require("./modules/validators/module.js"));
var Config;
module1.watch(require("./core/config.js"), {
  "default": function (v) {
    Config = v;
  }
}, 0);
var Module;
module1.watch(require("./core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 1);
var Class;
module1.watch(require("./core/class.js"), {
  "default": function (v) {
    Class = v;
  }
}, 2);
var reservedKeywords;
module1.watch(require("./core/reserved_keywords.js"), {
  "default": function (v) {
    reservedKeywords = v;
  }
}, 3);
var Enum;
module1.watch(require("./modules/fields/Enum.js"), {
  "default": function (v) {
    Enum = v;
  }
}, 4);
var Union;
module1.watch(require("./modules/fields/Union.js"), {
  "default": function (v) {
    Union = v;
  }
}, 5);
var Type;
module1.watch(require("./modules/fields/type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 6);
var Field;
module1.watch(require("./modules/fields/Field"), {
  "default": function (v) {
    Field = v;
  }
}, 7);
var ScalarField;
module1.watch(require("./modules/fields/ScalarField"), {
  "default": function (v) {
    ScalarField = v;
  }
}, 8);
var ObjectField;
module1.watch(require("./modules/fields/ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 9);
var ListField;
module1.watch(require("./modules/fields/ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 10);
var Behavior;
module1.watch(require("./modules/behaviors/behavior.js"), {
  "default": function (v) {
    Behavior = v;
  }
}, 11);
var Validator;
module1.watch(require("./modules/validators/validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 12);
var Validators;
module1.watch(require("./modules/validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 13);
var ValidationError;
module1.watch(require("meteor/mdg:validation-error"), {
  ValidationError: function (v) {
    ValidationError = v;
  }
}, 14);
var Event;
module1.watch(require("./modules/events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 15);
var Astro = {
  config: Config,
  Config: Config,
  Module: Module,
  Class: Class,
  Enum: Enum,
  Union: Union,
  Type: Type,
  Field: Field,
  ScalarField: ScalarField,
  ObjectField: ObjectField,
  ListField: ListField,
  Behavior: Behavior,
  Validator: Validator,
  Validators: Validators,
  ValidationError: ValidationError,
  Event: Event,
  reservedKeywords: reservedKeywords
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core":{"class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/core/class.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var module1 = module;

var _concat;

module1.watch(require("lodash/concat"), {
  "default": function (v) {
    _concat = v;
  }
}, 0);

var _defaults;

module1.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 1);

var _each;

module1.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 2);

var _has;

module1.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 3);

var _includes;

module1.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 4);

var _intersection;

module1.watch(require("lodash/intersection"), {
  "default": function (v) {
    _intersection = v;
  }
}, 5);

var _isNumber;

module1.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 6);
var EJSON;
module1.watch(require("meteor/ejson"), {
  EJSON: function (v) {
    EJSON = v;
  }
}, 7);
var config;
module1.watch(require("./config"), {
  "default": function (v) {
    config = v;
  }
}, 8);
var throwParseError;
module1.watch(require("../modules/core/utils/throw_parse_error"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 9);
var cloneDefinition;
module1.watch(require("../modules/core/utils/cloneDefinition"), {
  "default": function (v) {
    cloneDefinition = v;
  }
}, 10);
var castNested;
module1.watch(require("../modules/fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 11);
var Module;
module1.watch(require("./module"), {
  "default": function (v) {
    Module = v;
  }
}, 12);
var Event;
module1.watch(require("../modules/events/event"), {
  "default": function (v) {
    Event = v;
  }
}, 13);
var Type;
module1.watch(require("../modules/fields/type"), {
  "default": function (v) {
    Type = v;
  }
}, 14);
var Validators;
module1.watch(require("../modules/validators/validators"), {
  "default": function (v) {
    Validators = v;
  }
}, 15);
var warn;
module1.watch(require("../modules/core/utils/warn"), {
  "default": function (v) {
    warn = v;
  }
}, 16);

var initClass = function (Class) {
  // Create and store the schema "definition" object in the class constructor.
  // It's a combination of all parent definitions and a definition that
  // created this class. It's used to create child classes.
  Class.definition = {}; // Create and store the "schema" object in the class constructor. It's an
  // object that contains all the data related with a given class. The
  // "schema" object contains "computed" data of the schema "definition".
  // Thanks to that, Astronomy does not need to compute data on the fly and
  // everything works faster.

  Class.schema = {}; // Create empty array for storing child classes.

  Class.children = []; // Init the class schema and schema definition.

  Module.forEach(function (module) {
    module.onInitSchema(Class.schema, Class.getName());
    module.onInitDefinition(Class.definition, Class.getName());
  }); // We have to call the "onInitClass" hooks in the separate loop after
  // initiation of the schema and schema definition, because some
  // "onInitClass" hooks can execute the "Class.extend" method which requires
  // schema and schama definition to be initalized.

  Module.forEach(function (module) {
    module.onInitClass(Class, Class.getName());
  });
};

var Class =
/*#__PURE__*/
function () {
  function Class() {
    var rawDoc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Set default options.
    _defaults(options, {
      // From version 2.3.0, we can turn off setting default values on fetching
      // so it will not populate fields that were excluded on find.
      defaults: config.defaults,
      // We clone values on document construction, but this option is overridden
      // in the "find" method and set to false, so it does not unnecessary clone
      // clone raw values.
      clone: true,
      cast: false
    });

    var doc = this;
    var _Class = doc.constructor;

    if (!_Class.getName()) {
      throw new Error('Can not create instance of the "Class" class');
    } // If there is the "_isNew" property passed to the class constructor, the
    // we use it to determine if a document is stored in collection. Otherwise
    // document is a new one.


    if (_Class.getCollection()) {
      doc._isNew = _has(rawDoc, "_isNew") ? rawDoc._isNew : true;
    } // Trigger the "beforeInit" event handlers.


    doc.dispatchEvent(new Event("beforeInit")); // Set values in a document.

    _each(_Class.getFieldsNames(), function (fieldName) {
      doc.set(fieldName, rawDoc[fieldName], options);
    }); // Trigger the "afterInit" event handlers.


    doc.dispatchEvent(new Event("afterInit"));
  } // Method needed for EJSONification.


  var _proto = Class.prototype;

  _proto.typeName = function () {
    function typeName() {
      return "Astronomy";
    }

    return typeName;
  }();

  _proto.toJSONValue = function () {
    function toJSONValue(args) {
      var doc = this;
      var Class = doc.constructor;
      var json = {
        "class": Class.getName()
      }; // Trigger the "toJSONValue" event handlers.

      doc.dispatchEvent(new Event("toJSONValue", {
        json: json
      }));
      return json;
    }

    return toJSONValue;
  }();

  Class.getName = function () {
    function getName() {
      return this.className;
    }

    return getName;
  }();

  Class.getParent = function () {
    function getParent() {
      if (this.parentClassName) {
        return this.get(this.parentClassName);
      }
    }

    return getParent;
  }();
  /**
   * @param {(Number|Boolean)} depth - The depth to which look for children, or "true" to get all children.
   */


  Class.getChildren = function () {
    function getChildren() {
      var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var classes = [];

      if (!depth) {
        return classes;
      }

      classes.push.apply(classes, (0, _toConsumableArray2.default)(this.children));

      if (_isNumber(depth)) {
        depth--;
      }

      _each(this.children, function (Child) {
        classes.push.apply(classes, (0, _toConsumableArray2.default)(Child.getChildren(depth)));
      });

      return classes;
    }

    return getChildren;
  }();

  Class.create = function () {
    function create(definition) {
      // Get class name.
      var className = definition.name; // Warn about class duplicate.

      if (_has(this.classes, className)) {
        warn("Duplicate of the \"" + className + "\" class");
      } // Extend the Class class.


      var Class = this.classes[className] =
      /*#__PURE__*/
      function (_this) {
        (0, _inheritsLoose2.default)(Class, _this);

        function Class() {
          return _this.apply(this, arguments) || this;
        }

        return Class;
      }(this); // Store the class name in the constructor.


      Class.className = className; // Initialize class.

      initClass(Class); // Extend class with a definition.

      Class.extend(definition); // Register a new type.

      Type.create({
        name: className,
        "class": Class,
        validate: function (args) {
          // Add current class as a param of validator.
          args.param = Class;
          Validators.class(args);
        }
      });
      return Class;
    }

    return create;
  }();

  Class.inherit = function () {
    function inherit(definition) {
      var Parent = this;
      var className = definition.name; // Warn about class duplicate.

      if (_has(this.classes, className)) {
        warn("Duplicate of the \"" + className + "\" class");
      } // Extend the parent class.


      var Class = this.classes[className] =
      /*#__PURE__*/
      function (_Parent) {
        (0, _inheritsLoose2.default)(Class, _Parent);

        function Class() {
          return _Parent.apply(this, arguments) || this;
        }

        return Class;
      }(Parent); // Store the class name in the constructor.


      Class.className = className; // Store the parent class name in the constructor.

      Class.parentClassName = Parent.getName(); // Initialize class.

      initClass(Class); // Store child class in the parent class.

      Parent.children.push(Class); // Extend class with the parent class definition.

      Class.extend(Parent.definition); // Extend class with the definition.

      Class.extend(definition); // Register a new type.

      Type.create({
        name: className,
        "class": Class,
        validate: function (args) {
          // Add current class as a param of validator.
          args.param = Class;
          Validators.class(args);
        }
      });
      return Class;
    }

    return inherit;
  }();

  Class.extend = function () {
    function extend(extendDefinition) {
      var _this2 = this;

      var onlyModules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (typeof onlyModules === "string") {
        onlyModules = [onlyModules];
      }

      if (!Match.test(onlyModules, [String])) {
        throwParseError([{
          "class": this.getName()
        }, {
          method: "extend"
        }, "The second argument has to be a string or an array of strings"]);
      } // Clone definition to not modify the original one.


      extendDefinition = cloneDefinition(extendDefinition);
      Module.forEach(function (module) {
        // If the second argument was passed, then we only run module hooks for
        // modules that were listed in the second argument.
        if (onlyModules.length > 0 && !_includes(onlyModules, module.name) && _intersection(onlyModules, module.aliases).length === 0) {
          return;
        } // Initialize parsed definition.


        var parsedDefinition = {};
        module.onInitDefinition(parsedDefinition, Class.getName()); // Parse the extending definition and put parsed properties in the parsed
        // definition.

        module.onParseDefinition(parsedDefinition, extendDefinition, _this2.getName()); // Apply parsed definition.

        module.onApplyDefinition(_this2, parsedDefinition, _this2.getName()); // Merge parsed definition with a class definition.

        module.onMergeDefinitions(_this2.definition, parsedDefinition, _this2.getName()); // Finalize class creation.

        module.onFinalizeClass(_this2, _this2.getName());
      }); // Extend children.

      var children = this.getChildren();

      _each(children, function (ChildClass) {
        ChildClass.extend(extendDefinition, onlyModules);
      });
    }

    return extend;
  }();

  Class.get = function () {
    function get(className) {
      return this.classes[className];
    }

    return get;
  }();

  Class.has = function () {
    function has(className) {
      return _has(this.classes, className);
    }

    return has;
  }();

  Class.includes = function () {
    function includes(Class) {
      return _includes(this.classes, Class);
    }

    return includes;
  }();

  Class.isParentOf = function () {
    function isParentOf(Class) {
      if (!Class || !Class.prototype) {
        return false;
      }

      return this.prototype.isPrototypeOf(Class.prototype);
    }

    return isParentOf;
  }();

  Class.isChildOf = function () {
    function isChildOf(Class) {
      if (!Class || !Class.prototype) {
        return false;
      }

      return Class.prototype.isPrototypeOf(this.prototype);
    }

    return isChildOf;
  }();

  Class.isNew = function () {
    function isNew(doc, _isNew) {
      if (arguments.length === 2) {
        doc._isNew = _isNew;
      } else {
        return doc._isNew;
      }
    }

    return isNew;
  }();

  return Class;
}();

Class.classes = {};
module1.exportDefault(Class);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/core/config.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Config = {
  verbose: true,
  resolving: true,
  defaults: true
};
module.exportDefault(Config);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ejson.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/core/ejson.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var AstroClass;
module.watch(require("./class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 0);
var Event;
module.watch(require("../modules/events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 1);
EJSON.addType('Astronomy', function (json) {
  var Class = AstroClass.get(json.class);
  var doc = new Class(); // Trigger the "fromJSONValue" event handlers.

  doc.dispatchEvent(new Event('fromJSONValue', {
    json: json
  }));
  return doc;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/core/module.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;

var _each;

module1.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var throwParseError;
module1.watch(require("../modules/core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 1);

var Module =
/*#__PURE__*/
function () {
  function Module(definition) {
    var _this = this;

    if (!Match.test(definition, Object)) {
      throwParseError(['Module definition has to be an object']);
    } // Set module name.


    if (!Match.test(definition.name, String)) {
      throwParseError(['Module name has to be a string']);
    }

    this.name = definition.name; // Set module aliases.

    if (!Match.test(definition.aliases, Match.Maybe([String]))) {
      throwParseError(["Module aliases has to be an array of strings in the \"" + this.name + "\" module"]);
    }

    this.aliases = definition.aliases; // Set module hooks.

    _each(['onInitSchema', 'onInitDefinition', 'onInitClass', 'onParseDefinition', 'onApplyDefinition', 'onMergeDefinitions', 'onFinalizeClass'], function (hookName) {
      if (definition[hookName] === undefined) {
        return;
      }

      if (!Match.test(definition[hookName], Function)) {
        throwParseError([{
          'module': _this.name
        }, {
          'property': hookName
        }, "The \"" + hookName + "\" hook has to be a function"]);
      }

      _this[hookName] = definition[hookName];
    }); // Set module utils.


    if (definition.utils) {
      if (!Match.test(definition.utils, Object)) {
        throwParseError([{
          'module': this.name
        }, {
          'property': 'utils'
        }, 'Utilities definition has to be an object']);
      }

      this.utils = {};

      _each(definition.utils, function (method, methodName) {
        if (!Match.test(method, Function)) {
          throwParseError([{
            'module': _this.name
          }, {
            'property': 'utils'
          }, {
            'method': methodName
          }, 'Utility has to be a function']);
        }

        _this.utils[methodName] = method;
      });
    }
  }

  var _proto = Module.prototype;

  _proto.onInitSchema = function () {
    function onInitSchema(schema, className) {}

    return onInitSchema;
  }();

  _proto.onInitDefinition = function () {
    function onInitDefinition(definition, className) {}

    return onInitDefinition;
  }();

  _proto.onInitClass = function () {
    function onInitClass(Class, className) {}

    return onInitClass;
  }();

  _proto.onParseDefinition = function () {
    function onParseDefinition(parsedDefinition, definition, className) {}

    return onParseDefinition;
  }();

  _proto.onApplyDefinition = function () {
    function onApplyDefinition(Class, definition, className) {}

    return onApplyDefinition;
  }();

  _proto.onMergeDefinitions = function () {
    function onMergeDefinitions(targetDefinition, sourceDefinition, className) {}

    return onMergeDefinitions;
  }();

  _proto.onFinalizeClass = function () {
    function onFinalizeClass(Class, className) {}

    return onFinalizeClass;
  }();

  Module.create = function () {
    function create(definition) {
      var module = new this(definition);
      this.modules[module.name] = module;
      this.modulesOrder.push(module.name);
      return module;
    }

    return create;
  }();

  Module.get = function () {
    function get(moduleName) {
      return this.modules[moduleName];
    }

    return get;
  }();

  Module.forEach = function () {
    function forEach(iteratee) {
      var _this2 = this;

      if (!Match.test(iteratee, Function)) {
        throwParseError(['The first argument of the "Module.forEach" method has to be a function']);
      }

      _each(this.modulesOrder, function (moduleName) {
        iteratee(_this2.modules[moduleName]);
      });
    }

    return forEach;
  }();

  return Module;
}();

;
Module.modules = {};
Module.modulesOrder = [];
module1.exportDefault(Module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reserved_keywords.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/core/reserved_keywords.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var reservedNames = ['_isNew', 'copy', 'dispatchEvent', 'get', 'getModified', 'getModifiedValues', 'getModifier', 'isModified', 'raw', 'reload', 'remove', 'save', 'set', 'toJSONValue', 'typeName', 'validate', 'validateAll'];
module.exportDefault(reservedNames);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"modules":{"behaviors":{"behavior.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/behavior.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);
var throwParseError;
module.watch(require("../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 2);

var checkDefinition = function (definition) {
  // Check parameters validity.
  if (!Match.test(definition, Object)) {
    throwParseError(['Behavior definition has to be an object']);
  } // Check if behavior name is provided and is a string.


  if (!Match.test(definition.name, String)) {
    throwParseError(['Behavior has to be named']);
  } // Check if behavior with a given name already exists.


  if (_has(Behavior.behaviors, definition.name)) {
    throwParseError([{
      'behavior': definition.name
    }, 'Behavior already exists']);
  }
};

var Behavior =
/*#__PURE__*/
function () {
  function Behavior(options) {
    this.options = _extend({}, this.options, options);
  }

  var _proto = Behavior.prototype;

  _proto.createClassDefinition = function () {
    function createClassDefinition() {}

    return createClassDefinition;
  }();

  _proto.apply = function () {
    function apply(Class) {
      var definition = this.createClassDefinition();

      if (definition) {
        Class.extend(definition);
      }
    }

    return apply;
  }();

  Behavior.create = function () {
    function create(definition) {
      checkDefinition(definition); // Get behavior name.

      var behaviorName = definition.name; // Extend the Behavior class.

      var Behavior = this.behaviors[behaviorName] =
      /*#__PURE__*/
      function (_this) {
        (0, _inheritsLoose2.default)(Behavior, _this);

        function Behavior() {
          return _this.apply(this, arguments) || this;
        }

        return Behavior;
      }(this); // Store definition in behavior class.


      Behavior.definition = definition; // Extend prototype with a definition.

      _extend(Behavior.prototype, definition);

      return Behavior;
    }

    return create;
  }();

  Behavior.get = function () {
    function get(behaviorName) {
      return this.behaviors[behaviorName];
    }

    return get;
  }();

  Behavior.has = function () {
    function has(behaviorName) {
      return _has(this.behaviors, behaviorName);
    }

    return has;
  }();

  return Behavior;
}();

;
Behavior.behaviors = {};
module.exportDefault(Behavior);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/module.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 1);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 2);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 3);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 4);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 5);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 6);
Module.create({
  name: 'behaviors',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_static_methods":{"get_behavior.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/class_static_methods/get_behavior.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getBehavior(behaviorName) {
  return this.schema.behaviors[behaviorName];
}

;
module.exportDefault(getBehavior);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_behaviors.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/class_static_methods/get_behaviors.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getBehaviors() {
  return this.schema.behaviors;
}

;
module.exportDefault(getBehaviors);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has_behavior.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/class_static_methods/has_behavior.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasBehavior(behaviorName) {
  return _has(this.schema.behaviors, behaviorName);
}

;
module.exportDefault(hasBehavior);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/apply_definition.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var Behavior;
module.watch(require("../behavior.js"), {
  "default": function (v) {
    Behavior = v;
  }
}, 1);

function onApplyDefinition(Class, parsedDefinition, className) {
  var schema = Class.schema; // Add behaviors to the class.

  _each(parsedDefinition.behaviors, function (behaviorsOptions, behaviorName) {
    // Get the behavior class.
    var BehaviorClass = Behavior.get(behaviorName);

    _each(behaviorsOptions, function (behaviorOptions) {
      // Create the behavior instance passing behavior options.
      var behavior = new BehaviorClass(behaviorOptions); // Add behavior to the schema.

      schema.behaviors[behaviorName] = schema.behaviors[behaviorName] || [];
      schema.behaviors[behaviorName].push(behavior); // Apply behavior to the class.

      behavior.apply(Class);
    });
  });
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/init_class.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getBehavior;
module.watch(require("../class_static_methods/get_behavior.js"), {
  "default": function (v) {
    getBehavior = v;
  }
}, 0);
var getBehaviors;
module.watch(require("../class_static_methods/get_behaviors.js"), {
  "default": function (v) {
    getBehaviors = v;
  }
}, 1);
var hasBehavior;
module.watch(require("../class_static_methods/has_behavior.js"), {
  "default": function (v) {
    hasBehavior = v;
  }
}, 2);

function onInitClass(Class, className) {
  Class.getBehavior = getBehavior;
  Class.getBehaviors = getBehaviors;
  Class.hasBehavior = hasBehavior;
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/init_definition.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.behaviors = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/init_schema.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.behaviors = {};
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/merge_definitions.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.behaviors, function (behaviors, behaviorName) {
    var _targetDefinition$beh;

    targetDefinition.behaviors[behaviorName] = targetDefinition.behaviors[behaviorName] || [];

    (_targetDefinition$beh = targetDefinition.behaviors[behaviorName]).push.apply(_targetDefinition$beh, (0, _toConsumableArray2.default)(behaviors));
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/behaviors/hooks/parse_definition.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 1);
var Behavior;
module.watch(require("../behavior.js"), {
  "default": function (v) {
    Behavior = v;
  }
}, 2);

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence of the "behaviors" property.
  if (definition.behaviors !== undefined) {
    if (!Match.test(definition.behaviors, Match.OneOf([String], Object))) {
      throwParseError([{
        'class': className
      }, {
        'property': 'behaviors'
      }, "Behaviors definition has to be an array of behaviors' names or an " + "object with behaviors' options"]);
    }

    _each(definition.behaviors, function (behaviorOptions, behaviorName) {
      // If we deal with an array of behaviors' names, then behavior options is
      // an empty object.
      if (typeof behaviorOptions === 'string') {
        behaviorName = behaviorOptions;
        behaviorOptions = [{}];
      } // Check if behavior with a given name exists.


      if (!Behavior.has(behaviorName)) {
        throwParseError([{
          'class': className
        }, {
          'behavior': behaviorName
        }, 'Behavior does not exist']);
      } // Behavior options has to be an object or an array of objects, when we
      // are adding multiple behaviors of the same type.


      if (!Match.test(behaviorOptions, Match.OneOf(Object, [Object]))) {
        throwParseError([{
          'class': className
        }, {
          'behavior': behaviorName
        }, 'Behavior options have to be an object or an array of objects']);
      } // Make sure that behavior options is an array of objects.


      if (!Match.test(behaviorOptions, Array)) {
        behaviorOptions = [behaviorOptions];
      }

      parsedDefinition.behaviors[behaviorName] = behaviorOptions;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"core":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/module.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var cloneDefinition;
module1.watch(require("./utils/cloneDefinition"), {
  "default": function (v) {
    cloneDefinition = v;
  }
}, 1);
var deprecated;
module1.watch(require("./utils/deprecated.js"), {
  "default": function (v) {
    deprecated = v;
  }
}, 2);
var overrideMethod;
module1.watch(require("./utils/override_method.js"), {
  "default": function (v) {
    overrideMethod = v;
  }
}, 3);
var throwParseError;
module1.watch(require("./utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 4);
var warn;
module1.watch(require("./utils/warn.js"), {
  "default": function (v) {
    warn = v;
  }
}, 5);
Module.create({
  name: 'core',
  utils: {
    cloneDefinition: cloneDefinition,
    deprecated: deprecated,
    overrideMethod: overrideMethod,
    throwParseError: throwParseError,
    warn: warn
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils":{"cloneDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/utils/cloneDefinition.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _cloneDeepWith;

module.watch(require("lodash/cloneDeepWith"), {
  "default": function (v) {
    _cloneDeepWith = v;
  }
}, 0);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 1);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 2);

function cloneDefinition(definition) {
  return _cloneDeepWith(definition, function (value) {
    if (!_isPlainObject(value) && !_isArray(value)) {
      return value;
    }
  });
}

module.exportDefault(cloneDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deprecated.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/utils/deprecated.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 0);
var warn;
module.watch(require("./warn"), {
  "default": function (v) {
    warn = v;
  }
}, 1);

function deprecated(message) {
  // Be silent and do not log any warnings.
  if (!config.verbose) {
    return;
  } // Print message to the console.


  warn("Deprecation warning: " + message);
}

module.exportDefault(deprecated);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"override_method.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/utils/override_method.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _toArray;

module.watch(require("lodash/toArray"), {
  "default": function (v) {
    _toArray = v;
  }
}, 0);

function overrideMethod(object, methodName, overridingMethod, param) {
  // Get original method.
  var originalMethod = object[methodName]; // Override original method.

  object[methodName] = function () {
    // Convert arguments to array.
    var args = _toArray(arguments); // Execute overriding method passing arguments, original method and extra
    // parameters.


    return overridingMethod.call(this, args, originalMethod, param);
  };
}

;
module.exportDefault(overrideMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"throw_parse_error.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/utils/throw_parse_error.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 1);

function throwParseError(details) {
  var message = '';

  _each(details, function (detail) {
    if (_isObject(detail)) {
      _each(detail, function (value, key) {
        message += '["' + value + '" ' + key + ']';
      });
    } else if (typeof detail === 'string') {
      message += ' ' + detail;
    }
  });

  throw new TypeError(message);
}

;
module.exportDefault(throwParseError);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"warn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/core/utils/warn.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var config;
module.watch(require("../../../core/config.js"), {
  "default": function (v) {
    config = v;
  }
}, 0);

function warn(warning) {
  // Be silent and do not log any warnings.
  if (!config.verbose) {
    return;
  }

  try {
    console.warn(warning);
  } catch (error) {}
}

module.exportDefault(warn);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"events":{"event.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/event.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 0);

var Event =
/*#__PURE__*/
function () {
  function Event(type, data) {
    this.cancelable = false;
    this.propagates = false;

    _extend(this, data);

    this.type = type.toLowerCase();
    this.timeStamp = Date.now();
    this.target = null;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
  }

  var _proto = Event.prototype;

  _proto.preventDefault = function () {
    function preventDefault() {
      this.defaultPrevented = true;
    }

    return preventDefault;
  }();

  _proto.stopPropagation = function () {
    function stopPropagation() {
      this.propagationStopped = true;
    }

    return stopPropagation;
  }();

  _proto.stopImmediatePropagation = function () {
    function stopImmediatePropagation() {
      this.immediatePropagationStopped = true;
      this.stopPropagation();
    }

    return stopImmediatePropagation;
  }();

  return Event;
}();

;
module.exportDefault(Event);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/module.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 1);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 2);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 3);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 4);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 5);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 6);
Module.create({
  name: 'events',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_prototype_methods":{"dispatch_event.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/class_prototype_methods/dispatch_event.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _every;

module.watch(require("lodash/every"), {
  "default": function (v) {
    _every = v;
  }
}, 1);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 2);
var Event;
module.watch(require("../event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 3);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 4);
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 5);

function returnFromDispatchEvent(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }

  return true;
}

function dispatchEvent(event) {
  var doc = this;
  var Class = doc.constructor;

  if (!Match.test(event, Event)) {
    throwParseError([{
      'class': Class.getName()
    }, {
      'method': 'dispatchEvent'
    }, 'The first argument has to be an event object']);
  } // Attach a document to the event as a target.


  if (event.target === null) {
    event.target = doc;
  }

  if (event.currentTarget === null) {
    event.currentTarget = doc;
  } // Get all event handlers of a given type.


  var eventHandlers = Class.getEvents(event.type);

  _every(eventHandlers, function (eventHandler) {
    eventHandler(event); // Stop execution of the following event handlers, if a flag is set.

    return !event.immediatePropagationStopped;
  }); // If propagation was stopped or bubbling is turned off, then we don't go
  // deeper into nested fields.


  if (event.propagationStopped || !event.propagates) {
    return returnFromDispatchEvent(event);
  } // Object fields.


  _each(Class.getObjectFields(), function (field) {
    var value = doc[field.name];

    if (value instanceof AstroClass) {
      event.currentTarget = value;
      value.dispatchEvent(event);
    }
  }); // List fields.


  _each(Class.getListFields(), function (field) {
    var value = doc[field.name];

    if (field.isClass && _isArray(value)) {
      _each(value, function (element) {
        if (element instanceof AstroClass) {
          event.currentTarget = element;
          element.dispatchEvent(event);
        }
      });
    }
  });

  return returnFromDispatchEvent(event);
}

module.exportDefault(dispatchEvent);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_static_methods":{"dispatch_event.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/class_static_methods/dispatch_event.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _every;

module.watch(require("lodash/every"), {
  "default": function (v) {
    _every = v;
  }
}, 0);
var Event;
module.watch(require("../event"), {
  "default": function (v) {
    Event = v;
  }
}, 1);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 2);

function returnFromDispatchEvent(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }

  return true;
}

function dispatchEvent(event) {
  var Class = this; // Get all event handlers of a given type.

  var eventHandlers = Class.getEvents(event.type); // If there are no event of a fiven type, then just return true.

  if (eventHandlers.length === 0) {
    return true;
  } // Attach a document to the event as a target.


  if (event.target === null) {
    event.target = Class;
  }

  if (event.currentTarget === null) {
    event.currentTarget = Class;
  }

  _every(eventHandlers, function (eventHandler) {
    eventHandler(event); // Stop execution of the following event handlers, if a flag is set.

    return !event.immediatePropagationStopped;
  });

  return returnFromDispatchEvent(event);
}

module.exportDefault(dispatchEvent);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_events.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/class_static_methods/get_events.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getEvents(eventName) {
  var Class = this;

  if (eventName) {
    eventName = eventName.toLowerCase();
    return Class.schema.events[eventName] || [];
  }

  return Class.schema.events;
}

module.exportDefault(getEvents);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasEvent.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/class_static_methods/hasEvent.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _get;

module.watch(require("lodash/get"), {
  "default": function (v) {
    _get = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);

var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 2);

function hasEvent(eventName, eventHandler) {
  var Class = this;
  eventName = eventName.toLowerCase();

  if (arguments.length === 2) {
    return _includes(_get(Class.schema.events, eventName), eventHandler);
  } else if (arguments.length === 1) {
    return _has(Class.schema.events, eventName);
  }
}

module.exportDefault(hasEvent);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/apply_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _uniq;

module.watch(require("lodash/uniq"), {
  "default": function (v) {
    _uniq = v;
  }
}, 2);

function onApplyDefinition(Class, parsedDefinition, className) {
  var schema = Class.schema; // Add events to the event manager.

  _each(parsedDefinition.events, function (eventHandlers, eventName) {
    var _defaults2, _schema$events$eventN;

    eventName = eventName.toLowerCase(); // By default events list should be an empty array.

    _defaults(schema.events, (_defaults2 = {}, _defaults2[eventName] = [], _defaults2)); // Add all events to the list.


    (_schema$events$eventN = schema.events[eventName]).push.apply(_schema$events$eventN, (0, _toConsumableArray2.default)(eventHandlers)); // Make sure that there are no duplicates.


    schema.events[eventName] = _uniq(schema.events[eventName]);
  });
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/init_class.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var dispatchEvent;
module.watch(require("../class_static_methods/dispatch_event.js"), {
  "default": function (v) {
    dispatchEvent = v;
  }
}, 0);
var getEvents;
module.watch(require("../class_static_methods/get_events.js"), {
  "default": function (v) {
    getEvents = v;
  }
}, 1);
var hasEvent;
module.watch(require("../class_static_methods/hasEvent"), {
  "default": function (v) {
    hasEvent = v;
  }
}, 2);
var dispatchEventProto;
module.watch(require("../class_prototype_methods/dispatch_event.js"), {
  "default": function (v) {
    dispatchEventProto = v;
  }
}, 3);

function onInitClass(Class, className) {
  // Class static methods.
  Class.dispatchEvent = dispatchEvent;
  Class.getEvents = getEvents;
  Class.hasEvent = hasEvent; // Class prototype methods.

  Class.prototype.dispatchEvent = dispatchEventProto;
}

module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/init_definition.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.events = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/init_schema.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.events = {};
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/merge_definitions.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _uniq;

module.watch(require("lodash/uniq"), {
  "default": function (v) {
    _uniq = v;
  }
}, 2);

function onMergeDefinitions(trgDefinition, srcDefinition, ClassName) {
  _each(srcDefinition.events, function (eventHandlers, eventName) {
    var _defaults2, _trgDefinition$events;

    eventName = eventName.toLowerCase(); // By default events list should be an empty array.

    _defaults(trgDefinition.events, (_defaults2 = {}, _defaults2[eventName] = [], _defaults2)); // Add all events to the list.


    (_trgDefinition$events = trgDefinition.events[eventName]).push.apply(_trgDefinition$events, (0, _toConsumableArray2.default)(eventHandlers)); // Make sure that there are no duplicates.


    trgDefinition.events[eventName] = _uniq(trgDefinition.events[eventName]);
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/events/hooks/parse_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 1);

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "events" property.
  if (definition.events !== undefined) {
    _each(definition.events, function (eventHandlers, eventName) {
      eventName = eventName.toLowerCase(); // Check if the event definition is an array of functions.

      if (!Match.test(eventHandlers, Match.OneOf(Function, [Function]))) {
        throwParseError([{
          'class': className
        }, {
          'event': eventName
        }, 'Event handler has to be a function or an array of functions']);
      } // Convert function to array of functions.


      if (Match.test(eventHandlers, Function)) {
        eventHandlers = [eventHandlers];
      }

      parsedDefinition.events[eventName] = eventHandlers;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"fields":{"Enum.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/Enum.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 0);

var _range;

module.watch(require("lodash/range"), {
  "default": function (v) {
    _range = v;
  }
}, 1);

var _forOwn;

module.watch(require("lodash/forOwn"), {
  "default": function (v) {
    _forOwn = v;
  }
}, 2);

var _isNil;

module.watch(require("lodash/isNil"), {
  "default": function (v) {
    _isNil = v;
  }
}, 3);

var _isNumber;

module.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 4);

var _values;

module.watch(require("lodash/values"), {
  "default": function (v) {
    _values = v;
  }
}, 5);

var _keys;

module.watch(require("lodash/keys"), {
  "default": function (v) {
    _keys = v;
  }
}, 6);

var _indexOf;

module.watch(require("lodash/indexOf"), {
  "default": function (v) {
    _indexOf = v;
  }
}, 7);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 8);
var Type;
module.watch(require("./type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 9);
var Validators;
module.watch(require("../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 10);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 11);
var enumDefinitionPattern = {
  name: String,
  identifiers: Match.OneOf(Array, Object)
};
var Enum = {
  create: function (definition) {
    check(definition, enumDefinitionPattern); // Get identifiers and values.

    var identifiers;

    if (Match.test(definition.identifiers, Array)) {
      identifiers = _zipObject(definition.identifiers, _range(definition.identifiers.length));
    } else if (Match.test(definition.identifiers, Object)) {
      identifiers = definition.identifiers;
      var i = 0;

      _forOwn(identifiers, function (value, key) {
        if (_isNil(value)) {
          identifiers[key] = i;
          i++;
        } else if (_isNumber(value)) {
          i = value + 1;
        }
      });
    }

    var values = _values(identifiers);

    var keys = _keys(identifiers); // Create a new Enum constructor.


    var Enum = function () {
      function Enum(identifier) {
        return Enum[identifier];
      }

      return Enum;
    }();

    Enum.getValues = function () {
      return values;
    };

    Enum.getIdentifiers = function () {
      return keys;
    };

    Enum.getIdentifier = function (value) {
      var index = _indexOf(values, value);

      return keys[index];
    }; // Set identifiers properties in the class.


    _each(identifiers, function (value, name) {
      if (Object.defineProperty) {
        Object.defineProperty(Enum, name, {
          writable: false,
          enumerable: true,
          value: value
        });
      } else {
        Enum[name] = value;
      }
    }); // Create type definition for the given enum.


    Type.create({
      name: definition.name,
      "class": Enum,
      validate: function (args) {
        args.param = values;
        Validators.choice(args);
      }
    }); // Store enum in the enums list.

    this.enums[definition.name] = Enum;
    return Enum;
  },
  enums: {}
};
module.exportDefault(Enum);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/Field.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);

var _isNil;

module.watch(require("lodash/isNil"), {
  "default": function (v) {
    _isNil = v;
  }
}, 2);
var Validators;
module.watch(require("../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 3);

var Field =
/*#__PURE__*/
function () {
  function Field() {
    var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _defaults(definition, {
      optional: false,
      immutable: false,
      "transient": false
    });

    _extend(this, definition);
  }

  var _proto = Field.prototype;

  _proto.getDefault = function () {
    function getDefault(doc) {
      var value = typeof this.default === 'function' ? this.default(doc) : this.default;
      return this.castValue(value, {
        cast: true
      });
    }

    return getDefault;
  }();

  _proto.getOptional = function () {
    function getOptional(doc) {
      if (typeof this.optional === 'function') {
        return this.optional(doc);
      }

      return this.optional;
    }

    return getOptional;
  }();

  _proto.validate = function () {
    function validate(args) {
      // If a field is not optional (required) then it has to have value.
      if (!this.getOptional(args.doc)) {
        Validators.required(args);
      }
    }

    return validate;
  }();

  _proto.castValue = function () {
    function castValue(value, options) {
      if (!_isNil(value)) {
        return this.cast(value, options);
      }

      return value;
    }

    return castValue;
  }();

  _proto.resolveValue = function () {
    function resolveValue(rawDoc) {
      if (!rawDoc) {
        return;
      }

      if (typeof this.resolve === 'function') {
        return this.resolve(rawDoc);
      }

      return rawDoc[this.name];
    }

    return resolveValue;
  }();

  return Field;
}();

;
module.exportDefault(Field);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ListField.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/ListField.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 1);

var _isNil;

module.watch(require("lodash/isNil"), {
  "default": function (v) {
    _isNil = v;
  }
}, 2);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 3);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 4);
var Field;
module.watch(require("./Field"), {
  "default": function (v) {
    Field = v;
  }
}, 5);
var AstroClass;
module.watch(require("../../core/class"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 6);
var Validators;
module.watch(require("../validators/validators"), {
  "default": function (v) {
    Validators = v;
  }
}, 7);
var castToClass;
module.watch(require("./utils/castToClass"), {
  "default": function (v) {
    castToClass = v;
  }
}, 8);
var resolveValues;
module.watch(require("./utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 9);

var ListField =
/*#__PURE__*/
function (_Field) {
  (0, _inheritsLoose2.default)(ListField, _Field);

  function ListField() {
    var _this;

    var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _this = _Field.call(this, definition) || this;
    _this.isClass = AstroClass.isParentOf(_this.type.class);
    return _this;
  }

  var _proto = ListField.prototype;

  _proto.validate = function () {
    function validate(args) {
      var _this2 = this;

      _Field.prototype.validate.call(this, args);

      var doc = args.doc,
          name = args.name,
          value = args.value; // If a value is not empty.

      if (!_isNil(value)) {
        Validators.array(args);

        _each(value, function (element, index) {
          _this2.type.validate({
            doc: doc,
            name: name + '.' + index,
            value: element
          });
        });
      }
    }

    return validate;
  }();

  _proto.cast = function () {
    function cast(value, options) {
      var _this3 = this;

      if (options.element) {
        return this.type.cast(value, options);
      }

      if (value === '' && this.optional) {
        return null;
      } else if (_isArray(value)) {
        return _map(value, function (element) {
          // Class type.
          if (_this3.isClass) {
            // We only cast if a value is a plain object.
            if (_isPlainObject(element)) {
              // Cast value to an instance of the class.
              return castToClass({
                Class: _this3.type.class,
                rawDoc: element,
                options: options
              });
            }

            return element;
          } // Scalar type.
          else {
              // The "cast" option is only passed to the ObjectFields and ListFields.
              // Here we have to check if it's set, so we don't cast if user don't
              // want to.
              if (options.cast) {
                return _this3.type.cast.call(_this3, element);
              }

              return element;
            }
        });
      }

      return value;
    }

    return cast;
  }();

  _proto.resolveValue = function () {
    function resolveValue(rawDoc) {
      var _this4 = this;

      var resolvedValues = _Field.prototype.resolveValue.call(this, rawDoc);

      if (!this.isClass) {
        return resolvedValues;
      }

      return _map(resolvedValues, function (nestedRawDoc) {
        return resolveValues({
          Class: _this4.type.class,
          rawDoc: nestedRawDoc
        });
      });
    }

    return resolveValue;
  }();

  return ListField;
}(Field);

;
module.exportDefault(ListField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ObjectField.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/ObjectField.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 0);
var Field;
module.watch(require("./Field"), {
  "default": function (v) {
    Field = v;
  }
}, 1);
var castToClass;
module.watch(require("./utils/castToClass"), {
  "default": function (v) {
    castToClass = v;
  }
}, 2);
var resolveValues;
module.watch(require("./utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 3);

var ObjectField =
/*#__PURE__*/
function (_Field) {
  (0, _inheritsLoose2.default)(ObjectField, _Field);

  function ObjectField() {
    return _Field.apply(this, arguments) || this;
  }

  var _proto = ObjectField.prototype;

  _proto.validate = function () {
    function validate(args) {
      _Field.prototype.validate.call(this, args);

      this.type.validate(args);
    }

    return validate;
  }();

  _proto.cast = function () {
    function cast(value, options) {
      if (value === '' && this.optional) {
        return null;
      } // We only cast if a value is a plain object.
      else if (_isPlainObject(value)) {
          // Cast value to an instance of the class.
          return castToClass({
            Class: this.type.class,
            rawDoc: value,
            options: options
          });
        }

      return value;
    }

    return cast;
  }();

  _proto.resolveValue = function () {
    function resolveValue(rawDoc) {
      return resolveValues({
        Class: this.type.class,
        rawDoc: _Field.prototype.resolveValue.call(this, rawDoc)
      });
    }

    return resolveValue;
  }();

  return ObjectField;
}(Field);

;
module.exportDefault(ObjectField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ScalarField.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/ScalarField.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _isNil;

module.watch(require("lodash/isNil"), {
  "default": function (v) {
    _isNil = v;
  }
}, 0);
var Field;
module.watch(require("./Field"), {
  "default": function (v) {
    Field = v;
  }
}, 1);

var ScalarField =
/*#__PURE__*/
function (_Field) {
  (0, _inheritsLoose2.default)(ScalarField, _Field);

  function ScalarField() {
    return _Field.apply(this, arguments) || this;
  }

  var _proto = ScalarField.prototype;

  _proto.cast = function () {
    function cast(value) {
      return this.type.cast.call(this, value);
    }

    return cast;
  }();

  _proto.validate = function () {
    function validate(args) {
      _Field.prototype.validate.call(this, args);

      var value = args.value;

      if (!_isNil(value)) {
        return this.type.validate(args);
      }
    }

    return validate;
  }();

  return ScalarField;
}(Field);

;
module.exportDefault(ScalarField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Union.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/Union.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _clone;

module.watch(require("lodash/clone"), {
  "default": function (v) {
    _clone = v;
  }
}, 0);

var _some;

module.watch(require("lodash/some"), {
  "default": function (v) {
    _some = v;
  }
}, 1);
var Type;
module.watch(require("./type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 2);
var Validators;
module.watch(require("../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 3);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 4);
var unionDefinitionPattern = {
  name: String,
  types: [Function],
  cast: Match.Optional(Function)
};
var Union = {
  create: function (definition) {
    check(definition, unionDefinitionPattern); // Create a new Union constructor.

    var Union = function () {
      function Union(identifier) {
        return Union[identifier];
      }

      return Union;
    }(); // Copy list of types to the union constructor.


    Union.types = _clone(definition.types); // Copy casting function to the union constructor if defined.

    if (typeof definition.cast === 'function') {
      Union.cast = definition.cast;
    } // Create type definition for the given enum.


    Type.create({
      name: definition.name,
      "class": Union,
      cast: function (value) {
        return Union.cast ? Union.cast(value) : value;
      },
      validate: function (args) {
        var caughtErrors = []; // Check if a value will pass validation executed by any of the union
        // types.

        if (!_some(Union.types, function (TypeClass) {
          var AstroType = Type.find(TypeClass);

          try {
            AstroType.validate(args);
            return true;
          } catch (err) {
            caughtErrors.push(err);
            return false;
          }
        })) {
          throw caughtErrors[0];
        }
      }
    }); // Store enum in the unions list.

    this.unions[definition.name] = Union;
    return Union;
  },
  unions: {}
};
module.exportDefault(Union);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/module.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
module1.watch(require("./types/boolean.js"));
module1.watch(require("./types/date.js"));
module1.watch(require("./types/mongo_object_id.js"));
module1.watch(require("./types/number.js"));
module1.watch(require("./types/object.js"));
module1.watch(require("./types/string.js"));
var castNested;
module1.watch(require("./utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 1);
var getAll;
module1.watch(require("./utils/getAll"), {
  "default": function (v) {
    getAll = v;
  }
}, 2);
var getMany;
module1.watch(require("./utils/getMany"), {
  "default": function (v) {
    getMany = v;
  }
}, 3);
var getOne;
module1.watch(require("./utils/getOne"), {
  "default": function (v) {
    getOne = v;
  }
}, 4);
var isNestedFieldName;
module1.watch(require("./utils/isNestedFieldName"), {
  "default": function (v) {
    isNestedFieldName = v;
  }
}, 5);
var rawAll;
module1.watch(require("./utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 6);
var rawMany;
module1.watch(require("./utils/rawMany"), {
  "default": function (v) {
    rawMany = v;
  }
}, 7);
var rawOne;
module1.watch(require("./utils/rawOne"), {
  "default": function (v) {
    rawOne = v;
  }
}, 8);
var setAll;
module1.watch(require("./utils/set_all.js"), {
  "default": function (v) {
    setAll = v;
  }
}, 9);
var setMany;
module1.watch(require("./utils/set_many.js"), {
  "default": function (v) {
    setMany = v;
  }
}, 10);
var setOne;
module1.watch(require("./utils/set_one.js"), {
  "default": function (v) {
    setOne = v;
  }
}, 11);
var traverse;
module1.watch(require("./utils/traverse.js"), {
  "default": function (v) {
    traverse = v;
  }
}, 12);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 13);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 14);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 15);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 16);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 17);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 18);
Module.create({
  name: 'fields',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  utils: {
    castNested: castNested,
    getAll: getAll,
    getMany: getMany,
    getOne: getOne,
    isNestedFieldName: isNestedFieldName,
    rawAll: rawAll,
    rawMany: rawMany,
    rawOne: rawOne,
    setAll: setAll,
    setMany: setMany,
    setOne: setOne,
    traverse: traverse
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"type.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/type.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _find;

module.watch(require("lodash/find"), {
  "default": function (v) {
    _find = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);
var Validators;
module.watch(require("../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 2);
var warn;
module.watch(require("../core/utils/warn"), {
  "default": function (v) {
    warn = v;
  }
}, 3);
var typeDefinitionPattern = {
  name: String,
  "class": Match.Any,
  cast: Match.Optional(Function),
  validate: Match.Optional(Function)
};
var enumDefinitionPattern = {
  name: String,
  options: Object
};

var Type =
/*#__PURE__*/
function () {
  function Type(definition) {
    check(definition, typeDefinitionPattern);
    this.name = definition.name;
    this.class = definition.class;

    if (typeof definition.validate === "function") {
      this.validate = definition.validate;
    }

    if (typeof definition.cast === "function") {
      this.cast = definition.cast;
    }
  }

  var _proto = Type.prototype;

  _proto.cast = function () {
    function cast(value) {
      return value;
    }

    return cast;
  }();

  _proto.validate = function () {
    function validate(doc, fieldName) {
      return true;
    }

    return validate;
  }();

  Type.create = function () {
    function create(definition) {
      var type = new Type(definition); // Warn about class duplicate.

      if (_has(this.types, type.name)) {
        warn("Duplicate of the \"" + type.name + "\" type");
      }

      this.types[type.name] = type;
    }

    return create;
  }();

  Type.get = function () {
    function get(name) {
      return this.types[name];
    }

    return get;
  }();

  Type.has = function () {
    function has(name) {
      return _has(this.types, name);
    }

    return has;
  }();

  Type.find = function () {
    function find(Class) {
      return _find(this.types, function (type) {
        return type.class.prototype === Class.prototype;
      });
    }

    return find;
  }();

  return Type;
}();

Type.types = {};
module.exportDefault(Type);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_events":{"from_json_value.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_events/from_json_value.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function fromJSONValue(e) {
  var doc = e.currentTarget;
  doc.set(EJSON.parse(e.json.values), {
    defaults: false,
    clone: false,
    cast: false
  });
}

module.exportDefault(fromJSONValue);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"to_json_value.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_events/to_json_value.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getAll;
module.watch(require("../utils/getAll"), {
  "default": function (v) {
    getAll = v;
  }
}, 0);

function toJSONValue(e) {
  var doc = e.currentTarget;
  e.json.values = EJSON.stringify(getAll(doc));
}

;
module.exportDefault(toJSONValue);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_prototype_methods":{"get.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_prototype_methods/get.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 0);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 1);
var getAll;
module.watch(require("../utils/getAll"), {
  "default": function (v) {
    getAll = v;
  }
}, 2);
var getMany;
module.watch(require("../utils/getMany"), {
  "default": function (v) {
    getMany = v;
  }
}, 3);
var getOne;
module.watch(require("../utils/getOne"), {
  "default": function (v) {
    getOne = v;
  }
}, 4);

function get() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    return getAll(this);
  } else if (args.length >= 1) {
    if (typeof args[0] === 'string') {
      return getOne.apply(void 0, [this].concat(args));
    } else if (_isArray(args[0])) {
      return getMany.apply(void 0, [this].concat(args));
    } else if (_isPlainObject(args[0])) {
      return getAll.apply(void 0, [this].concat(args));
    }
  }
}

;
module.exportDefault(get);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"raw.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_prototype_methods/raw.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 0);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 1);
var rawAll;
module.watch(require("../utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 2);
var rawMany;
module.watch(require("../utils/rawMany"), {
  "default": function (v) {
    rawMany = v;
  }
}, 3);
var rawOne;
module.watch(require("../utils/rawOne"), {
  "default": function (v) {
    rawOne = v;
  }
}, 4);

function raw() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    return rawAll(this);
  } else if (args.length >= 1) {
    if (typeof args[0] === 'string') {
      return rawOne.apply(void 0, [this].concat(args));
    } else if (_isArray(args[0])) {
      return rawMany.apply(void 0, [this].concat(args));
    } else if (_isPlainObject(args[0])) {
      return rawAll.apply(void 0, [this].concat(args));
    }
  }
}

;
module.exportDefault(raw);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_prototype_methods/set.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 2);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 3);
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 4);
var setMany;
module.watch(require("../utils/set_many"), {
  "default": function (v) {
    setMany = v;
  }
}, 5);
var setOne;
module.watch(require("../utils/set_one"), {
  "default": function (v) {
    setOne = v;
  }
}, 6);
var castNested;
module.watch(require("../utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 7);

function merge(doc) {
  var result = {};

  _each(doc, function (fieldValue, fieldName) {
    // If a field value is an object then we prefix each nested field name with
    // a field name of the parent object. However, we can not do it for arrays
    // as it's not obvious how we would like to merge arrays - concat/replace?
    if (_isPlainObject(fieldValue) && !_isArray(fieldValue)) {
      _each(merge(fieldValue), function (nestedFieldValue, nestedFieldName) {
        result[fieldName + "." + nestedFieldName] = nestedFieldValue;
      });
    } else {
      result[fieldName] = fieldValue;
    }
  });

  return result;
}

function set() {
  var doc = this; // Default options.

  var options = {
    defaults: config.defaults,
    clone: true,
    cast: false,
    merge: false
  }; // Setting single field.

  if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string' && arguments.length >= 2) {
    // The last argument is an options object.
    if (_isPlainObject(arguments.length <= 2 ? undefined : arguments[2])) {
      _extend(options, arguments.length <= 2 ? undefined : arguments[2]);
    } // Do not override values if the "merge" option is set and instead merge
    // nested objects.


    if (options.merge && _isPlainObject(arguments.length <= 1 ? undefined : arguments[1])) {
      var _merge;

      setMany(doc, merge((_merge = {}, _merge[arguments.length <= 0 ? undefined : arguments[0]] = arguments.length <= 1 ? undefined : arguments[1], _merge)), options);
    } else {
      setOne(doc, arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], options);
    }
  } // Setting multiple fields at once.
  else if (_isPlainObject(arguments.length <= 0 ? undefined : arguments[0]) && arguments.length >= 1) {
      // The last argument is an options object.
      if (_isPlainObject(arguments.length <= 1 ? undefined : arguments[1])) {
        _extend(options, arguments.length <= 1 ? undefined : arguments[1]);
      } // Do not override values if the "merge" option is set and instead merge
      // nested objects.


      if (options.merge) {
        setMany(doc, merge(arguments.length <= 0 ? undefined : arguments[0]), options);
      } else {
        setMany(doc, arguments.length <= 0 ? undefined : arguments[0], options);
      }
    }
}

;
module.exportDefault(set);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_static_methods":{"get_field.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_field.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getField(fieldName) {
  return this.schema.fields[fieldName];
}

module.exportDefault(getField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_fields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_fields.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _values;

module.watch(require("lodash/values"), {
  "default": function (v) {
    _values = v;
  }
}, 0);

function getFields() {
  return _values(this.schema.fields);
}

;
module.exportDefault(getFields);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_fields_names.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_fields_names.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

function getFieldsNames() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Prepare options.
  _defaults(options, {
    "transient": true,
    immutable: true
  });

  var fieldsNames = [];

  _each(this.schema.fields, function (field, name) {
    // Don't get a transient field.
    if (!options.transient && field.transient) {
      return;
    } // Don't get an immutable field.


    if (!options.immutable && field.immutable) {
      return;
    }

    fieldsNames.push(name);
  });

  return fieldsNames;
}

;
module.exportDefault(getFieldsNames);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_list_fields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_list_fields.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _filter;

module.watch(require("lodash/filter"), {
  "default": function (v) {
    _filter = v;
  }
}, 0);
var ListField;
module.watch(require("../ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 1);

function getListFields() {
  var classOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return _filter(this.getFields(), function (field) {
    if (classOnly) {
      return field instanceof ListField && field.isClass;
    }

    return field instanceof ListField;
  });
}

;
module.exportDefault(getListFields);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_object_fields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_object_fields.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _filter;

module.watch(require("lodash/filter"), {
  "default": function (v) {
    _filter = v;
  }
}, 0);
var ObjectField;
module.watch(require("../ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 1);

function getObjectFields() {
  return _filter(this.getFields(), function (field) {
    return field instanceof ObjectField;
  });
}

;
module.exportDefault(getObjectFields);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_scalar_fields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/get_scalar_fields.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _filter;

module.watch(require("lodash/filter"), {
  "default": function (v) {
    _filter = v;
  }
}, 0);
var ScalarField;
module.watch(require("../ScalarField"), {
  "default": function (v) {
    ScalarField = v;
  }
}, 1);

function getScalarFields() {
  return _filter(this.getFields(), function (field) {
    return field instanceof ScalarField;
  });
}

;
module.exportDefault(getScalarFields);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has_field.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/class_static_methods/has_field.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasField(fieldName) {
  return _has(this.schema.fields, fieldName);
}

;
module.exportDefault(hasField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/apply_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 2);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 3);
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 4);
var ScalarField;
module.watch(require("../ScalarField"), {
  "default": function (v) {
    ScalarField = v;
  }
}, 5);
var ObjectField;
module.watch(require("../ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 6);
var ListField;
module.watch(require("../ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 7);

function checkTypeExistence(type, className, fieldName) {
  if (!type) {
    throwParseError([{
      'class': className
    }, {
      'property': 'fields'
    }, {
      'field': fieldName
    }, 'Type does not exist']);
  }
}

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition.fields, function (fieldDefinition, fieldName) {
    // Prepare field variable.
    var field; // List field.

    if (Match.test(fieldDefinition.type, Array)) {
      var type = Type.find(fieldDefinition.type[0]);
      checkTypeExistence(type, className, fieldDefinition.name);

      if (AstroClass.isParentOf(type.class)) {
        field = new ListField(_extend({}, fieldDefinition, {
          type: type
        }));
      } else {
        field = new ListField(_extend({}, fieldDefinition, {
          type: type
        }));
      }
    } // Scalar or object field.
    else {
        var _type = Type.find(fieldDefinition.type);

        checkTypeExistence(_type, className, fieldDefinition.name);

        if (AstroClass.isParentOf(_type.class)) {
          field = new ObjectField(_extend({}, fieldDefinition, {
            type: _type
          }));
        } else {
          field = new ScalarField(_extend({}, fieldDefinition, {
            type: _type
          }));
        }
      } // Add a field object to the fields list.


    Class.schema.fields[fieldName] = field;
    Class.schema.fieldsNames.push(fieldName);
  });
}

module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/init_class.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getField;
module.watch(require("../class_static_methods/get_field.js"), {
  "default": function (v) {
    getField = v;
  }
}, 0);
var getFieldsNames;
module.watch(require("../class_static_methods/get_fields_names.js"), {
  "default": function (v) {
    getFieldsNames = v;
  }
}, 1);
var getFields;
module.watch(require("../class_static_methods/get_fields.js"), {
  "default": function (v) {
    getFields = v;
  }
}, 2);
var getObjectFields;
module.watch(require("../class_static_methods/get_object_fields.js"), {
  "default": function (v) {
    getObjectFields = v;
  }
}, 3);
var getListFields;
module.watch(require("../class_static_methods/get_list_fields.js"), {
  "default": function (v) {
    getListFields = v;
  }
}, 4);
var getScalarFields;
module.watch(require("../class_static_methods/get_scalar_fields.js"), {
  "default": function (v) {
    getScalarFields = v;
  }
}, 5);
var hasField;
module.watch(require("../class_static_methods/has_field.js"), {
  "default": function (v) {
    hasField = v;
  }
}, 6);
var get;
module.watch(require("../class_prototype_methods/get.js"), {
  "default": function (v) {
    get = v;
  }
}, 7);
var raw;
module.watch(require("../class_prototype_methods/raw.js"), {
  "default": function (v) {
    raw = v;
  }
}, 8);
var set;
module.watch(require("../class_prototype_methods/set.js"), {
  "default": function (v) {
    set = v;
  }
}, 9);
var fromJSONValue;
module.watch(require("../class_events/from_json_value.js"), {
  "default": function (v) {
    fromJSONValue = v;
  }
}, 10);
var toJSONValue;
module.watch(require("../class_events/to_json_value.js"), {
  "default": function (v) {
    toJSONValue = v;
  }
}, 11);

function onInitClass(Class, className) {
  // Class static methods.
  Class.getField = getField;
  Class.getFieldsNames = getFieldsNames;
  Class.getFields = getFields;
  Class.getObjectFields = getObjectFields;
  Class.getListFields = getListFields;
  Class.getScalarFields = getScalarFields;
  Class.hasField = hasField; // Class prototype methods.

  Class.prototype.get = get;
  Class.prototype.raw = raw;
  Class.prototype.set = set; // Class events.

  Class.extend({
    events: {
      fromJSONValue: fromJSONValue,
      toJSONValue: toJSONValue
    }
  }, ['events']);
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/init_definition.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.fields = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/init_schema.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.fields = {};
  schema.fieldsNames = [];
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/merge_definitions.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, className) {
  _each(sourceDefinition.fields, function (fieldDefinition, fieldName) {
    targetDefinition.fields[fieldName] = fieldDefinition;
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/hooks/parse_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);

var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 2);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 3);
var Class;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    Class = v;
  }
}, 4);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 5);
var reservedKeywords;
module.watch(require("../../../core/reserved_keywords.js"), {
  "default": function (v) {
    reservedKeywords = v;
  }
}, 6);
var typePattern = Match.OneOf(Function, [Function]);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.fields === undefined) {
    return;
  } // Fields definition has to be an object.


  if (!Match.test(definition.fields, Object)) {
    throwParseError([{
      'class': className
    }, {
      'property': 'fields'
    }, 'Fields definition has to be an object']);
  }

  _each(definition.fields, function (fieldDefinition, fieldName) {
    if (Match.test(fieldDefinition, typePattern)) {
      fieldDefinition = {
        name: fieldName,
        type: fieldDefinition
      };
    } else if (Match.test(fieldDefinition, Object)) {
      fieldDefinition = _extend(fieldDefinition, {
        name: fieldName
      });
    } else {
      throwParseError([{
        'class': className
      }, {
        'property': 'fields'
      }, {
        'field': fieldName
      }, 'Field definition has to be an object or type']);
    } // Check if a field name is not reserved keyword.


    if (_includes(reservedKeywords, fieldName)) {
      throwParseError([{
        'class': className
      }, {
        'method': fieldName
      }, 'Reserved keyword']);
    }

    parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
  });
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"types":{"boolean.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/boolean.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 1);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 2);
Type.create({
  name: 'Boolean',
  "class": Boolean,
  cast: function (value) {
    if (typeof value === 'boolean' && _isObject(value)) {
      return value;
    } else if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        } else {
          return false;
        }
      } else if (value.toLowerCase() === 'false' || value === '0') {
        return false;
      }
    }

    return Boolean(value);
  },
  validate: function (args) {
    Validators.boolean(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"date.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/date.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isNaN;

module.watch(require("lodash/isNaN"), {
  "default": function (v) {
    _isNaN = v;
  }
}, 0);

var _isNumber;

module.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 1);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 2);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 3);
Type.create({
  name: 'Date',
  "class": Date,
  cast: function (value) {
    if (_isNumber(value)) {
      return new Date(value);
    } else if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        }
      } else if (/^[0-9]+$/.test(value)) {
        return new Date(parseInt(value, 10));
      } else {
        var time = Date.parse(value);

        if (!_isNaN(time)) {
          return new Date(time);
        }
      }
    }

    return value;
  },
  validate: function (args) {
    Validators.date(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mongo_object_id.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/mongo_object_id.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 0);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 1);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 2);
Type.create({
  name: 'MongoObjectID',
  "class": Mongo.ObjectID,
  validate: function (args) {
    Validators.mongoObjectID(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"number.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/number.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isNaN;

module.watch(require("lodash/isNaN"), {
  "default": function (v) {
    _isNaN = v;
  }
}, 0);

var _isNumber;

module.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 1);

var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 2);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 3);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 4);
Type.create({
  name: 'Number',
  "class": Number,
  cast: function (value) {
    if (typeof value === 'string') {
      if (value === '') {
        // The "this" context is a field.
        if (this.optional) {
          return null;
        } else {
          return 0;
        }
      }
    } else if (_isObject(value)) {
      return value;
    } else if (!_isNaN(value) && _isNumber(value)) {
      return value;
    }

    var number = Number(value);
    return !_isNaN(number) ? number : value;
  },
  validate: function (args) {
    Validators.number(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/object.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 0);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 1);
Type.create({
  name: 'Object',
  "class": Object,
  validate: function (args) {
    Validators.object(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"string.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/types/string.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);
var Type;
module.watch(require("../type.js"), {
  "default": function (v) {
    Type = v;
  }
}, 1);
var Validators;
module.watch(require("../../validators/validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 2);
Type.create({
  name: 'String',
  "class": String,
  cast: function (value) {
    if (typeof value === 'string' || _isObject(value)) {
      return value;
    }

    return String(value);
  },
  validate: function (args) {
    Validators.string(args);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"utils":{"castNested.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/castNested.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var ObjectField;
module.watch(require("../ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 1);
var ListField;
module.watch(require("../ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 2);

function castNested() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = args.doc,
      options = args.options;
  var Class = doc.constructor;

  _each(Class.getFields(), function (field) {
    if (field instanceof ObjectField || field instanceof ListField && field.isClass) {
      doc[field.name] = field.castValue(doc[field.name], options);
    }
  });
}

;
module.exportDefault(castNested);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"castToClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/castToClass.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getChildClass;
module.watch(require("./getChildClass"), {
  "default": function (v) {
    getChildClass = v;
  }
}, 0);

function castToClass() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Class = args.Class,
      rawDoc = args.rawDoc,
      options = args.options; // If the class has a type field, then we have to check if we are
  // casting to some of the nested classes.

  var ChildClass = getChildClass({
    Class: Class,
    rawDoc: rawDoc
  }); // Create instance of an original class or some of its childs.

  return new ChildClass(rawDoc, options);
}

module.exportDefault(castToClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getAll.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/getAll.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);
var getMany;
module.watch(require("./getMany"), {
  "default": function (v) {
    getMany = v;
  }
}, 1);

function getAll(doc) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true,
    undefined: true
  });

  var Class = doc.constructor; // Get list of fields and their values.

  return getMany(doc, Class.getFieldsNames(options), options);
}

;
module.exportDefault(getAll);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getChildClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/getChildClass.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 0);

function getChildClass() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Class = args.Class,
      rawDoc = args.rawDoc;
  var typeField = Class.getTypeField(); // If a class does not have a type field, then we just return an original
  // class.

  if (!typeField) {
    return Class;
  } // If a class has a type field, then we have to check if a raw document
  // contains information about child class type.


  var ChildClass = Class.get(rawDoc[typeField]); // Return a child class if it exists and in fact it's a child of an original
  // class.

  if (ChildClass && ChildClass.isChildOf(Class)) {
    return ChildClass;
  } // Otherwise just return original class.


  return Class;
}

module.exportDefault(getChildClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getMany.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/getMany.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 1);

var _omitBy;

module.watch(require("lodash/omitBy"), {
  "default": function (v) {
    _omitBy = v;
  }
}, 2);

var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 3);
var getOne;
module.watch(require("./getOne"), {
  "default": function (v) {
    getOne = v;
  }
}, 4);

function getMany(doc, fieldsNames) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true,
    undefined: true
  });

  var values = _zipObject(fieldsNames, _map(fieldsNames, function (fieldName) {
    return getOne(doc, fieldName, options);
  }));

  if (options.undefined) {
    return values;
  } else {
    return _omitBy(values, function (value) {
      return value === undefined;
    });
  }
}

;
module.exportDefault(getMany);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getOne.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/getOne.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);
var traverse;
module.watch(require("./traverse.js"), {
  "default": function (v) {
    traverse = v;
  }
}, 1);

function getOne(doc, fieldName) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true
  });

  return traverse(doc, fieldName, function (nestedDoc, nestedFieldName, field) {
    // If a field does not exist than we don't return anything.
    if (!field) {
      return;
    } // Don't get a transient field.


    if (!options.transient && field.transient) {
      return;
    } // Don't get an immutable field.


    if (!options.immutable && field.immutable) {
      return;
    } // Just return value.


    return nestedDoc[nestedFieldName];
  });
}

;
module.exportDefault(getOne);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isNestedFieldName.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/isNestedFieldName.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function isNestedFieldName(fieldPattern) {
  return fieldPattern.indexOf('.') !== -1;
}

;
module.exportDefault(isNestedFieldName);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"rawAll.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/rawAll.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);
var rawMany;
module.watch(require("./rawMany"), {
  "default": function (v) {
    rawMany = v;
  }
}, 1);

function rawAll(doc) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true,
    undefined: true
  });

  var Class = doc.constructor; // Get list of fields and their values.

  return rawMany(doc, Class.getFieldsNames(options), options);
}

;
module.exportDefault(rawAll);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"rawMany.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/rawMany.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 1);

var _omitBy;

module.watch(require("lodash/omitBy"), {
  "default": function (v) {
    _omitBy = v;
  }
}, 2);

var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 3);
var rawOne;
module.watch(require("./rawOne"), {
  "default": function (v) {
    rawOne = v;
  }
}, 4);

function rawMany(doc, fieldsNames) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true,
    undefined: true
  });

  var values = _zipObject(fieldsNames, _map(fieldsNames, function (fieldName) {
    return rawOne(doc, fieldName, options);
  }));

  if (options.undefined) {
    return values;
  } else {
    return _omitBy(values, function (value) {
      return value === undefined;
    });
  }
}

;
module.exportDefault(rawMany);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"rawOne.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/rawOne.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 1);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 2);
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 3);
var traverse;
module.watch(require("./traverse.js"), {
  "default": function (v) {
    traverse = v;
  }
}, 4);
var rawAll;
module.watch(require("./rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 5);

function rawOne(doc, fieldName) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Prepare default options values.
  _defaults(options, {
    "transient": true,
    immutable: true,
    // We still need the "undefined" options in the "rawOne" util, because we
    // might want to get nested document that may have undefined fields.
    undefined: true
  });

  return traverse(doc, fieldName, function (nestedDoc, nestedFieldName, field) {
    // If a field does not exist than we don't return anything.
    if (!field) {
      return;
    } // Don't get a transient field.


    if (!options.transient && field.transient) {
      return;
    } // Don't get an immutable field.


    if (!options.immutable && field.immutable) {
      return;
    } // Get field's value.


    var fieldValue = nestedDoc[nestedFieldName];

    if (fieldValue instanceof AstroClass) {
      return rawAll(fieldValue, options);
    } else if (_isArray(fieldValue)) {
      return _map(fieldValue, function (element) {
        if (element instanceof AstroClass) {
          return rawAll(element, options);
        } else {
          return element;
        }
      });
    } else {
      return fieldValue;
    }
  });
}

;
module.exportDefault(rawOne);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"resolveValues.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/resolveValues.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _fromPairs;

module.watch(require("lodash/fromPairs"), {
  "default": function (v) {
    _fromPairs = v;
  }
}, 0);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 1);
var config;
module.watch(require("../../../core/config.js"), {
  "default": function (v) {
    config = v;
  }
}, 2);
var getChildClass;
module.watch(require("./getChildClass"), {
  "default": function (v) {
    getChildClass = v;
  }
}, 3);

function resolveValues() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Class = args.Class,
      rawDoc = args.rawDoc; // We can not resolve when dealing with non object value or the "resolving"
  // config param is turned off.

  if (!rawDoc || !config.resolving) {
    return rawDoc;
  } // When resolving values, we need to get resolve method for a child class
  // if a given document is actually an instance of child class.


  var ChildClass = getChildClass({
    Class: Class,
    rawDoc: rawDoc
  }); // Construct resolved document from key-value pairs.

  return _fromPairs(_map(ChildClass.getFields(), function (field) {
    return [field.name, field.resolveValue(rawDoc)];
  }));
}

module.exportDefault(resolveValues);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_all.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/set_all.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _difference;

module.watch(require("lodash/difference"), {
  "default": function (v) {
    _difference = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _forOwn;

module.watch(require("lodash/forOwn"), {
  "default": function (v) {
    _forOwn = v;
  }
}, 2);

var _keys;

module.watch(require("lodash/keys"), {
  "default": function (v) {
    _keys = v;
  }
}, 3);
var setOne;
module.watch(require("./set_one.js"), {
  "default": function (v) {
    setOne = v;
  }
}, 4);

function setAll(doc, fieldsValues, options) {
  var Class = doc.constructor; // Get names of the fields that are not present in the fieldsValues variable.

  var fieldsNames = _difference(Class.getFieldsNames(), _keys(fieldsValues));

  _each(fieldsNames, function (fieldName) {
    setOne(doc, fieldName, undefined, options);
  });

  _forOwn(fieldsValues, function (fieldValue, fieldName) {
    setOne(doc, fieldName, fieldValue, options);
  });
}

;
module.exportDefault(setAll);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_many.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/set_many.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _forOwn;

module.watch(require("lodash/forOwn"), {
  "default": function (v) {
    _forOwn = v;
  }
}, 0);
var setOne;
module.watch(require("./set_one.js"), {
  "default": function (v) {
    setOne = v;
  }
}, 1);

function setMany(doc, fieldsValues, options) {
  // Set multiple fields.
  _forOwn(fieldsValues, function (setValue, fieldName) {
    setOne(doc, fieldName, setValue, options);
  });
}

;
module.exportDefault(setMany);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_one.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/set_one.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);
var EJSON;
module.watch(require("meteor/ejson"), {
  EJSON: function (v) {
    EJSON = v;
  }
}, 1);
var traverse;
module.watch(require("../utils/traverse"), {
  "default": function (v) {
    traverse = v;
  }
}, 2);
var warn;
module.watch(require("../../core/utils/warn"), {
  "default": function (v) {
    warn = v;
  }
}, 3);
var ObjectField;
module.watch(require("../ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 4);
var ListField;
module.watch(require("../ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 5);

function setOne(doc, fieldPattern, fieldValue, options) {
  // If the "clone" option was set and the value being set is an object,
  // then we clone value using the "EJSON.clone" function.
  if (options.clone && _isObject(fieldValue)) {
    fieldValue = EJSON.clone(fieldValue);
  }

  return traverse(doc, fieldPattern, function (nestedDoc, nestedFieldName, field) {
    // If a field does not exist than we don't return anything.
    if (!field) {
      var Class = doc.constructor;
      var className = Class.getName();
      warn("[\"" + className + "\" class][\"" + fieldPattern + "\" field] " + 'Trying to set a value of the field that does not exist in the class');
      return;
    } // Cast value if the "cast" option was set or if a field is instance of
    // ObjectField or ListField.


    if (options.cast || field instanceof ObjectField || field instanceof ListField && field.isClass) {
      // If the "cast" option is set and we're casting array's element.
      if (options.cast && field instanceof ListField && /\d+/.test(nestedFieldName)) {
        options.element = true;
      }

      fieldValue = field.castValue(fieldValue, options);
    } // Set default value if the "defualts" option was set.


    if (fieldValue === undefined && options.defaults) {
      fieldValue = field.getDefault(nestedDoc);
    } // Finally set casted/cloned/untouched value.


    nestedDoc[nestedFieldName] = fieldValue;
  });
}

module.exportDefault(setOne);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"traverse.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/fields/utils/traverse.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);
var isNestedFieldName;
module.watch(require("./isNestedFieldName"), {
  "default": function (v) {
    isNestedFieldName = v;
  }
}, 1);
var AstroClass;
module.watch(require("../../../core/class"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 2);

function traverse(doc, name, callback) {
  if (!doc) {
    return;
  }

  var Class;
  var field; // Check whether the given field name is a nested field name.

  if (!isNestedFieldName(name)) {
    // Get a class.
    var _Class = doc.constructor; // Get a field definition.

    var _field = _Class.getField(name); // Execute the callback function passing the last nested document, the last
    // segment name and a field object.


    return callback(doc, name, _field);
  } // Split the nested field pattern name by the "." character.


  var segments = name.split('.'); // Get the last and one before the last index.

  var lastIndex = segments.length - 1; // Traverse nested fields until reaching the last one from the pattern.

  var next = function (nestedDoc, segmentIndex) {
    segmentIndex = segmentIndex || 0; // Get a nested field name under the given index.

    var segment = segments[segmentIndex]; // Check if a nested document is an instance of the Astronomy class and get
    // a field object for a given field name;

    if (nestedDoc instanceof AstroClass) {
      // Get a class for of a nested document.
      Class = nestedDoc.constructor; // Get a field object from the nested class.

      field = Class.getField(segment);
    }

    if (segmentIndex === lastIndex) {
      // Execute the callback function, if we reached the last nested document.
      return callback(nestedDoc, segment, field);
    } else if (_isObject(nestedDoc[segment])) {
      // Go deeper if a value of the current nested document is an object.
      return next(nestedDoc[segment], segmentIndex + 1);
    }
  }; // Start traversing nested fields.


  return next(doc);
}

;
module.exportDefault(traverse);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"helpers":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/module.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var onInitSchema;
module1.watch(require("./hooks/onInitSchema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 1);
var onInitDefinition;
module1.watch(require("./hooks/onInitDefinition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 2);
var onParseDefinition;
module1.watch(require("./hooks/onParseDefinition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 3);
var onMergeDefinitions;
module1.watch(require("./hooks/onMergeDefinitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 4);
var onApplyDefinition;
module1.watch(require("./hooks/onApplyDefinition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 5);
var onInitClass;
module1.watch(require("./hooks/onInitClass.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 6);
Module.create({
  name: 'methods',
  aliases: ['helpers'],
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_static_methods":{"getHelper.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/class_static_methods/getHelper.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getHelper(helperName) {
  return this.schema.helpers[helperName];
}

;
module.exportDefault(getHelper);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getHelpers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/class_static_methods/getHelpers.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getHelpers() {
  return this.schema.helpers;
}

;
module.exportDefault(getHelpers);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasHelper.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/class_static_methods/hasHelper.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasHelper(helperName) {
  return _has(this.schema.helpers, helperName);
}

;
module.exportDefault(hasHelper);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"onApplyDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onApplyDefinition.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onApplyDefinition(Class, parsedDefinition, className) {
  var schema = Class.schema; // Add helpers to the class.

  _each(parsedDefinition.helpers, function (helper, helperName) {
    schema.helpers[helperName] = helper;
    Class.prototype[helperName] = helper;
  });
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onInitClass.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var deprecated;
module.watch(require("../../core/utils/deprecated"), {
  "default": function (v) {
    deprecated = v;
  }
}, 0);
var getHelper;
module.watch(require("../class_static_methods/getHelper.js"), {
  "default": function (v) {
    getHelper = v;
  }
}, 1);
var getHelpers;
module.watch(require("../class_static_methods/getHelpers.js"), {
  "default": function (v) {
    getHelpers = v;
  }
}, 2);
var hasHelper;
module.watch(require("../class_static_methods/hasHelper.js"), {
  "default": function (v) {
    hasHelper = v;
  }
}, 3);

function onInitClass(Class, className) {
  Class.getHelper = getHelper;
  Class.getHelpers = getHelpers;
  Class.hasHelper = hasHelper; // Class static helpers.

  Class.getMethod = function () {
    deprecated("Methods have been renamed to helpers. Please use the " + ("\"" + className + ".getHelper\" function."));

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.getHelper.apply(this, args);
  };

  Class.getMethods = function () {
    deprecated("Methods have been renamed to helpers. Please use the " + ("\"" + className + ".getHelpers\" function."));

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.getHelpers.apply(this, args);
  };

  Class.hasMethod = function () {
    deprecated("Methods have been renamed to helpers. Please use the " + ("\"" + className + ".hasHelper\" function."));

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.hasHelper.apply(this, args);
  };
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onInitDefinition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.helpers = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitSchema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onInitSchema.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.helpers = {};
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onMergeDefinitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onMergeDefinitions.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.helpers, function (helper, helperName) {
    targetDefinition.helpers[helperName] = helper;
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onParseDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/helpers/hooks/onParseDefinition.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 2);
var deprecated;
module.watch(require("../../core/utils/deprecated"), {
  "default": function (v) {
    deprecated = v;
  }
}, 3);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 4);
var reservedKeywords;
module.watch(require("../../../core/reserved_keywords.js"), {
  "default": function (v) {
    reservedKeywords = v;
  }
}, 5);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.methods) {
    definition.helpers = definition.helpers || {};
    deprecated("Methods have been renamed to helpers. Please use the \"helpers\" " + ("section in the \"" + className + "\" class definition."));

    _each(definition.methods, function (method, methodName) {
      if (_has(definition.helpers, methodName)) {
        deprecated("Methods have been renamed to helpers. Please move the " + ("\"" + methodName + "\" method to the \"helpers\" section in the ") + ("\"" + className + "\" class definition."));
      } else {
        definition.helpers[methodName] = method;
      }
    });
  } // Check existence and validity of the "helpers" property.


  if (definition.helpers !== undefined) {
    if (!Match.test(definition.helpers, Object)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'helpers'
      }, 'Helpers definition has to be an object']);
    }

    _each(definition.helpers, function (helper, helperName) {
      if (!Match.test(helper, Function)) {
        throwParseError([{
          'class': className
        }, {
          'helper': helperName
        }, 'Helper has to be a function']);
      }

      if (_includes(reservedKeywords, helperName)) {
        throwParseError([{
          'class': className
        }, {
          'helper': helperName
        }, 'Reserved keyword']);
      }

      parsedDefinition.helpers[helperName] = helper;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"indexes":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/module.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 1);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 2);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 3);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 4);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 5);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 6);
Module.create({
  name: 'indexes',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_static_methods":{"get_index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/class_static_methods/get_index.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getIndex(indexName) {
  return this.schema.indexes[indexName];
}

;
module.exportDefault(getIndex);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_indexes.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/class_static_methods/get_indexes.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getIndexes() {
  return this.schema.indexes;
}

;
module.exportDefault(getIndexes);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has_index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/class_static_methods/has_index.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasIndex(indexName) {
  return _has(this.schema.indexes, indexName);
}

;
module.exportDefault(hasIndex);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/apply_definition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _concat;

module.watch(require("lodash/concat"), {
  "default": function (v) {
    _concat = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 2);

var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 3);

var _mapKeys;

module.watch(require("lodash/mapKeys"), {
  "default": function (v) {
    _mapKeys = v;
  }
}, 4);

function onApplyDefinition(Class, parsedDefinition, className) {
  var Collection = Class.getCollection();

  if (!Meteor.isServer || !Collection || Collection && !Collection._connection) {
    return;
  }

  var schema = Class.schema;

  function prefixIndexes(indexes, fieldName) {
    // Prefix the fields property.
    _each(indexes, function (index, indexName) {
      index.fields = _mapKeys(index.fields, function (value, key) {
        return fieldName + "." + key;
      });

      _extend(index.options, {
        name: fieldName + "." + indexName
      });
    }); // Prefix object keys.


    indexes = _mapKeys(indexes, function (index, indexName) {
      return fieldName + "." + indexName;
    });
    return indexes;
  } // Add indexes to the collection from nested classes.


  var checkedClasses = [];

  function collectNestedIndexes(Class) {
    // Stop checking if a given class was already checked.
    if (_includes(checkedClasses, Class)) {
      return;
    }

    checkedClasses.push(Class);
    var indexes = {};

    var fields = _concat(Class.getObjectFields(), Class.getListFields(true));

    _each(fields, function (field) {
      _extend(indexes, prefixIndexes(field.type.class.definition.indexes, field.name), prefixIndexes(collectNestedIndexes(field.type.class), field.name));
    });

    return indexes;
  }

  var indexes = _extend({}, parsedDefinition.indexes, collectNestedIndexes(Class));

  _each(indexes, function (index, indexName) {
    schema.indexes[indexName] = index;

    Collection._ensureIndex(index.fields, index.options);
  });
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/init_class.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getIndex;
module.watch(require("../class_static_methods/get_index.js"), {
  "default": function (v) {
    getIndex = v;
  }
}, 0);
var getIndexes;
module.watch(require("../class_static_methods/get_indexes.js"), {
  "default": function (v) {
    getIndexes = v;
  }
}, 1);
var hasIndex;
module.watch(require("../class_static_methods/has_index.js"), {
  "default": function (v) {
    hasIndex = v;
  }
}, 2);

function onInitClass(Class, className) {
  // Class static methods.
  Class.getIndex = getIndex;
  Class.getIndexes = getIndexes;
  Class.hasIndex = hasIndex;
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/init_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.indexes = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/init_schema.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.indexes = {};
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/merge_definitions.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.indexes, function (index, indexName) {
    targetDefinition.indexes[indexName] = index;
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/indexes/hooks/parse_definition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 1);
var fieldDefinitionPattern = Match.ObjectIncluding({
  index: Match.OneOf(1, -1, String)
});

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "indexes" property.
  if (definition.indexes !== undefined) {
    _each(definition.indexes, function (index, indexName) {
      if (!Match.test(index, Object)) {
        throwParseError([{
          'class': className
        }, {
          'index': indexName
        }, 'Indexes definition has to be an object']);
      }

      index = {
        fields: index.fields,
        options: index.options || {}
      };
      index.options.name = index.options.name || indexName;
      parsedDefinition.indexes[indexName] = index;
    });
  }

  if (definition.fields !== undefined) {
    _each(definition.fields, function (fieldDefinition, fieldName) {
      // Stop if a field definition does not contain index information.
      if (!Match.test(fieldDefinition, fieldDefinitionPattern)) {
        return;
      } // Prepare an index definition.


      var indexDefinition = {
        fields: {},
        options: {
          name: fieldName
        }
      };
      indexDefinition.fields[fieldName] = fieldDefinition.index;
      parsedDefinition.indexes[fieldName] = indexDefinition;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"methods":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/module.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var onInitSchema;
module1.watch(require("./hooks/onInitSchema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 1);
var onInitDefinition;
module1.watch(require("./hooks/onInitDefinition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 2);
var onParseDefinition;
module1.watch(require("./hooks/onParseDefinition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 3);
var onMergeDefinitions;
module1.watch(require("./hooks/onMergeDefinitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 4);
var onApplyDefinition;
module1.watch(require("./hooks/onApplyDefinition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 5);
var onInitClass;
module1.watch(require("./hooks/onInitClass.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 6);
var onFinalizeClass;
module1.watch(require("./hooks/onFinalizeClass.js"), {
  "default": function (v) {
    onFinalizeClass = v;
  }
}, 7);
Module.create({
  name: 'meteorMethods',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  onFinalizeClass: onFinalizeClass
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_prototype_methods":{"applyMethod.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/class_prototype_methods/applyMethod.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var callMeteorMethod;
module.watch(require("../../storage/utils/call_meteor_method"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 0);
var rawAll;
module.watch(require("../../fields/utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 1);

function applyMethod(methodName, methodArgs, callback) {
  var doc = this;
  var Class = doc.constructor; // Prepare arguments to be sent to the "/Astronomy/execute" method.

  var meteorMethodArgs = {
    className: Class.getName(),
    methodName: methodName,
    methodArgs: methodArgs,
    rawDoc: rawAll(doc, {
      "transient": false
    })
  };

  try {
    return callMeteorMethod(Class, "/Astronomy/execute", [meteorMethodArgs], callback);
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
}

module.exportDefault(applyMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callMethod.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/class_prototype_methods/callMethod.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _last;

module.watch(require("lodash/last"), {
  "default": function (v) {
    _last = v;
  }
}, 0);
var applyMethod;
module.watch(require("./applyMethod"), {
  "default": function (v) {
    applyMethod = v;
  }
}, 1);

function callMethod(methodName) {
  for (var _len = arguments.length, methodArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    methodArgs[_key - 1] = arguments[_key];
  }

  // Get the last argument.
  var callback = _last(methodArgs); // If the last argument is a callback function, then remove the last
  // argument.


  if (typeof callback === 'function') {
    methodArgs.pop();
  } // If the last argument is not a callback function, then clear the
  // "callback" variable.
  else {
      callback = undefined;
    }

  return applyMethod.call(this, methodName, methodArgs, callback);
}

;
module.exportDefault(callMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_static_methods":{"getMeteorMethod.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/class_static_methods/getMeteorMethod.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getMethod(methodName) {
  return this.schema.methods[methodName];
}

;
module.exportDefault(getMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getMeteorMethods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/class_static_methods/getMeteorMethods.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getMethods() {
  return this.schema.methods;
}

;
module.exportDefault(getMethods);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasMeteorMethod.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/class_static_methods/hasMeteorMethod.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasMethod(methodName) {
  return _has(this.schema.methods, methodName);
}

;
module.exportDefault(hasMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"onApplyDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onApplyDefinition.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onApplyDefinition(Class, parsedDefinition, className) {
  var schema = Class.schema; // Add Meteor methods to the class schema.

  _each(parsedDefinition.meteorMethods, function (method, methodName) {
    schema.methods[methodName] = method;
  });
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onFinalizeClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onFinalizeClass.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);
var wrapMethod;
module.watch(require("../utils/wrapMethod"), {
  "default": function (v) {
    wrapMethod = v;
  }
}, 2);
var hasMeteorMethod;
module.watch(require("../../storage/utils/has_meteor_method"), {
  "default": function (v) {
    hasMeteorMethod = v;
  }
}, 3);
var astronomyExecute;
module.watch(require("../meteor_methods/astronomyExecute"), {
  "default": function (v) {
    astronomyExecute = v;
  }
}, 4);
var applyMethod;
module.watch(require("../class_prototype_methods/applyMethod"), {
  "default": function (v) {
    applyMethod = v;
  }
}, 5);
var callMethod;
module.watch(require("../class_prototype_methods/callMethod"), {
  "default": function (v) {
    callMethod = v;
  }
}, 6);

function onFinalizeClass(Class, className) {
  var schema = Class.schema;

  if (schema.collection) {
    var Collection = schema.collection;
    var connection = Collection._connection || Meteor.connection || Meteor.server;

    if (connection) {
      if (!hasMeteorMethod(connection, "/Astronomy/execute")) {
        // Add Meteor method.
        connection.methods({
          "/Astronomy/execute": astronomyExecute
        });
      }
    } // Add Meteor methods to the class.


    _each(schema.methods, function (method, methodName) {
      Class.prototype[methodName] = wrapMethod(methodName);
    }); // Add universal "applyMethod" and "callMethod" methods that can invoke any
    // method even if only defined on the server.


    Class.prototype.applyMethod = applyMethod;
    Class.prototype.callMethod = callMethod;
  }
}

module.exportDefault(onFinalizeClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onInitClass.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getMeteorMethod;
module.watch(require("../class_static_methods/getMeteorMethod.js"), {
  "default": function (v) {
    getMeteorMethod = v;
  }
}, 0);
var getMeteorMethods;
module.watch(require("../class_static_methods/getMeteorMethods.js"), {
  "default": function (v) {
    getMeteorMethods = v;
  }
}, 1);
var hasMeteorMethod;
module.watch(require("../class_static_methods/hasMeteorMethod.js"), {
  "default": function (v) {
    hasMeteorMethod = v;
  }
}, 2);

function onInitClass(Class, className) {
  // Class static methods.
  Class.getMeteorMethod = getMeteorMethod;
  Class.getMeteorMethods = getMeteorMethods;
  Class.hasMeteorMethod = hasMeteorMethod;
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onInitDefinition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.meteorMethods = {};
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onInitSchema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onInitSchema.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.methods = {};
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onMergeDefinitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onMergeDefinitions.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, className) {
  _each(sourceDefinition.meteorMethods, function (method, methodName) {
    targetDefinition.meteorMethods[methodName] = method;
  });
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onParseDefinition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/hooks/onParseDefinition.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 1);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 2);
var reservedKeywords;
module.watch(require("../../../core/reserved_keywords.js"), {
  "default": function (v) {
    reservedKeywords = v;
  }
}, 3);

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "meteorMethods" property.
  if (definition.meteorMethods !== undefined) {
    if (!Match.test(definition.meteorMethods, Object)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'meteorMethods'
      }, 'meteorMethods definition has to be an object']);
    }

    _each(definition.meteorMethods, function (meteorMethod, meteorMethodName) {
      if (!Match.test(meteorMethod, Function)) {
        throwParseError([{
          'class': className
        }, {
          'meteorMethod': meteorMethodName
        }, 'Meteor method has to be a function']);
      }

      if (_includes(reservedKeywords, meteorMethodName)) {
        throwParseError([{
          'class': className
        }, {
          'meteorMethod': meteorMethodName
        }, 'Reserved keyword']);
      }

      parsedDefinition.meteorMethods[meteorMethodName] = meteorMethod;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meteor_methods":{"astronomyExecute.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/meteor_methods/astronomyExecute.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var AstroClass;
module.watch(require("../../../core/class"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 0);

function astronomyExecute() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  check(args, Match.Any);
  var className = args.className,
      rawDoc = args.rawDoc,
      methodName = args.methodName,
      methodArgs = args.methodArgs;
  var Class = AstroClass.get(className);
  var doc;

  if (rawDoc._id) {
    doc = Class.findOne(rawDoc._id);
  }

  if (doc) {
    doc.set(rawDoc);
  } else {
    doc = new Class(rawDoc, {
      clone: false
    });
  } // Get a method from the class. In some cases method may not be present,
  // because it might be defined only on the server.


  var method = Class.getMeteorMethod(methodName);

  if (!method) {
    return;
  }

  return method.apply(doc, methodArgs);
}

;
module.exportDefault(astronomyExecute);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"utils":{"wrapMethod.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/methods/utils/wrapMethod.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _last;

module.watch(require("lodash/last"), {
  "default": function (v) {
    _last = v;
  }
}, 0);
var callMeteorMethod;
module.watch(require("../../storage/utils/call_meteor_method"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 1);
var rawAll;
module.watch(require("../../fields/utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 2);

function wrapMethod(methodName) {
  return function () {
    var doc = this;
    var Class = doc.constructor; // Get the last argument.

    for (var _len = arguments.length, methodArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      methodArgs[_key] = arguments[_key];
    }

    var callback = _last(methodArgs); // If the last argument is a callback function, then remove the last
    // argument.


    if (typeof callback === "function") {
      methodArgs.pop();
    } else {
      // If the last argument is not a callback function, then clear the
      // "callback" variable.
      callback = undefined;
    } // Call the "/Astronomy/execute" method.


    return doc.applyMethod(methodName, methodArgs, callback);
  };
}

module.exportDefault(wrapMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"storage":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/module.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
var applyModifier;
module1.watch(require("./utils/apply_modifier.js"), {
  "default": function (v) {
    applyModifier = v;
  }
}, 1);
var callMeteorMethod;
module1.watch(require("./utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 2);
var classInsert;
module1.watch(require("./utils/class_insert.js"), {
  "default": function (v) {
    classInsert = v;
  }
}, 3);
var classUpdate;
module1.watch(require("./utils/class_update.js"), {
  "default": function (v) {
    classUpdate = v;
  }
}, 4);
var classRemove;
module1.watch(require("./utils/class_remove.js"), {
  "default": function (v) {
    classRemove = v;
  }
}, 5);
var documentInsert;
module1.watch(require("./utils/document_insert.js"), {
  "default": function (v) {
    documentInsert = v;
  }
}, 6);
var documentUpdate;
module1.watch(require("./utils/document_update.js"), {
  "default": function (v) {
    documentUpdate = v;
  }
}, 7);
var documentRemove;
module1.watch(require("./utils/document_remove.js"), {
  "default": function (v) {
    documentRemove = v;
  }
}, 8);
var getModified;
module1.watch(require("./utils/getModified"), {
  "default": function (v) {
    getModified = v;
  }
}, 9);
var getModifier;
module1.watch(require("./utils/getModifier"), {
  "default": function (v) {
    getModifier = v;
  }
}, 10);
var hasMeteorMethod;
module1.watch(require("./utils/has_meteor_method.js"), {
  "default": function (v) {
    hasMeteorMethod = v;
  }
}, 11);
var isModified;
module1.watch(require("./utils/isModified"), {
  "default": function (v) {
    isModified = v;
  }
}, 12);
var isRemote;
module1.watch(require("./utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 13);
var omitUndefined;
module1.watch(require("./utils/omit_undefined.js"), {
  "default": function (v) {
    omitUndefined = v;
  }
}, 14);
var throwIfSelectorIsNotId;
module1.watch(require("./utils/throw_if_selector_is_not_id.js"), {
  "default": function (v) {
    throwIfSelectorIsNotId = v;
  }
}, 15);
var transformToClass;
module1.watch(require("./utils/transformToClass"), {
  "default": function (v) {
    transformToClass = v;
  }
}, 16);
var triggerBeforeSave;
module1.watch(require("./utils/trigger_before_save.js"), {
  "default": function (v) {
    triggerBeforeSave = v;
  }
}, 17);
var triggerBeforeInsert;
module1.watch(require("./utils/trigger_before_insert.js"), {
  "default": function (v) {
    triggerBeforeInsert = v;
  }
}, 18);
var triggerBeforeUpdate;
module1.watch(require("./utils/trigger_before_update.js"), {
  "default": function (v) {
    triggerBeforeUpdate = v;
  }
}, 19);
var triggerBeforeRemove;
module1.watch(require("./utils/trigger_before_remove.js"), {
  "default": function (v) {
    triggerBeforeRemove = v;
  }
}, 20);
var triggerAfterSave;
module1.watch(require("./utils/trigger_after_save.js"), {
  "default": function (v) {
    triggerAfterSave = v;
  }
}, 21);
var triggerAfterInsert;
module1.watch(require("./utils/trigger_after_insert.js"), {
  "default": function (v) {
    triggerAfterInsert = v;
  }
}, 22);
var triggerAfterUpdate;
module1.watch(require("./utils/trigger_after_update.js"), {
  "default": function (v) {
    triggerAfterUpdate = v;
  }
}, 23);
var triggerAfterRemove;
module1.watch(require("./utils/trigger_after_remove.js"), {
  "default": function (v) {
    triggerAfterRemove = v;
  }
}, 24);
var wrapTransform;
module1.watch(require("./utils/wrapTransform.js"), {
  "default": function (v) {
    wrapTransform = v;
  }
}, 25);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 26);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 27);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 28);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 29);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 30);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 31);
Module.create({
  name: "storage",
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  utils: {
    applyModifier: applyModifier,
    callMeteorMethod: callMeteorMethod,
    classInsert: classInsert,
    classUpdate: classUpdate,
    classRemove: classRemove,
    documentInsert: documentInsert,
    documentUpdate: documentUpdate,
    documentRemove: documentRemove,
    getModified: getModified,
    getModifier: getModifier,
    hasMeteorMethod: hasMeteorMethod,
    isModified: isModified,
    isRemote: isRemote,
    omitUndefined: omitUndefined,
    throwIfSelectorIsNotId: throwIfSelectorIsNotId,
    transformToClass: transformToClass,
    triggerBeforeSave: triggerBeforeSave,
    triggerBeforeInsert: triggerBeforeInsert,
    triggerBeforeUpdate: triggerBeforeUpdate,
    triggerBeforeRemove: triggerBeforeRemove,
    triggerAfterSave: triggerAfterSave,
    triggerAfterInsert: triggerAfterInsert,
    triggerAfterUpdate: triggerAfterUpdate,
    triggerAfterRemove: triggerAfterRemove,
    wrapTransform: wrapTransform
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_events":{"fromJSONValue.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_events/fromJSONValue.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function fromJSONValue(e) {
  var doc = e.currentTarget;
  doc._isNew = e.json.isNew;
}

;
module.exportDefault(fromJSONValue);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toJSONValue.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_events/toJSONValue.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function toJSONValue(e) {
  var doc = e.currentTarget;
  e.json.isNew = doc._isNew;
}

;
module.exportDefault(toJSONValue);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_prototype_methods":{"copy.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/copy.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function copy(save) {
  var doc = this;
  save = save || false; // Use EJSON to clone object.

  var copy = EJSON.clone(doc); // Clear the "_id" field so when saving it will store it as a new document
  // instead of updating the old one.

  copy._id = null;
  copy._isNew = true;

  if (save) {
    copy.save();
  }

  return copy;
}

;
module.exportDefault(copy);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getModified.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/getModified.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var utilGetModified;
module.watch(require("../utils/getModified"), {
  "default": function (v) {
    utilGetModified = v;
  }
}, 0);

function getModified() {
  var doc = this;
  return utilGetModified({
    doc: doc,
    "transient": true
  });
}

;
module.exportDefault(getModified);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getModifiedValues.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/getModifiedValues.js                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var utilGetModified;
module.watch(require("../utils/getModified"), {
  "default": function (v) {
    utilGetModified = v;
  }
}, 1);
var rawOne;
module.watch(require("../../fields/utils/rawOne"), {
  "default": function (v) {
    rawOne = v;
  }
}, 2);

function getModifiedValues() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$old = options.old,
      old = _options$old === void 0 ? false : _options$old,
      _options$raw = options.raw,
      raw = _options$raw === void 0 ? false : _options$raw;
  var doc = this;
  var Class = doc.constructor; // Get list of modified fields.

  var modified = utilGetModified({
    doc: doc,
    "transient": true
  }); // Get old or new values of a document.

  if (old) {
    doc = Class.findOne(doc._id);

    if (!doc) {
      doc = new Class();
    }
  } // Collect values for each field.


  var values = {};

  _each(modified, function (name) {
    if (raw) {
      values[name] = rawOne(doc, name);
    } else {
      values[name] = doc.get(name);
    }
  });

  return values;
}

;
module.exportDefault(getModifiedValues);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getModifier.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/getModifier.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var utilGetModifier;
module.watch(require("../utils/getModifier"), {
  "default": function (v) {
    utilGetModifier = v;
  }
}, 0);

function getModifier() {
  var doc = this;
  return utilGetModifier({
    doc: doc
  });
}

;
module.exportDefault(getModifier);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isModified.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/isModified.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var utilIsModified;
module.watch(require("../utils/isModified"), {
  "default": function (v) {
    utilIsModified = v;
  }
}, 0);

function isModified(pattern) {
  var doc = this;
  return utilIsModified({
    doc: doc,
    pattern: pattern,
    "transient": true
  });
}

;
module.exportDefault(isModified);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reload.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/reload.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 0);
var resolveValues;
module.watch(require("../../fields/utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 1);
var Event;
module.watch(require("../../events/event"), {
  "default": function (v) {
    Event = v;
  }
}, 2);

function reload() {
  var doc = this;
  var Class = doc.constructor; // The document has to be already saved in the collection.
  // Get a document from the collection without transformation.

  var rawDoc = Class.findOne(doc._id, {
    transform: null
  });

  if (rawDoc) {
    // Trigger the "beforeInit" event handlers.
    doc.dispatchEvent(new Event('beforeInit')); // Set all fields.

    doc.set(resolveValues({
      Class: Class,
      rawDoc: rawDoc
    })); // Trigger the "afterInit" event handlers.

    doc.dispatchEvent(new Event('afterInit'));
  }
}

;
module.exportDefault(reload);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/remove.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var documentRemove;
module.watch(require("../utils/document_remove.js"), {
  "default": function (v) {
    documentRemove = v;
  }
}, 0);
var isRemote;
module.watch(require("../utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 1);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 2);

function remove() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  var doc = this;
  var Class = doc.constructor; // If the first argument is callback function then reassign values.

  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  } // Get variables from the first argument.


  var _args = args,
      _args$simulation = _args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/remove'; // Prepare arguments for the meteor method.

    var methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation: simulation
    };

    try {
      // Run meteor method.
      var result = callMeteorMethod(Class, methodName, [methodArgs], callback); // Change the "_isNew" flag to "true". After removing a document can be
      // saved again as a new one.

      doc._isNew = true; // Return result of the meteor method call.

      return result;
    } // Catch stub exceptions.
    catch (err) {
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
    var _methodArgs = {
      doc: doc,
      simulation: simulation,
      trusted: true
    };

    var _result = documentRemove(_methodArgs);

    if (callback) {
      callback(undefined, _result);
    }

    return _result;
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
}

module.exportDefault(remove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"save.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_prototype_methods/save.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 2);

var _omit;

module.watch(require("lodash/omit"), {
  "default": function (v) {
    _omit = v;
  }
}, 3);
var DDP;
module.watch(require("meteor/ddp"), {
  DDP: function (v) {
    DDP = v;
  }
}, 4);
var documentInsert;
module.watch(require("../utils/document_insert"), {
  "default": function (v) {
    documentInsert = v;
  }
}, 5);
var documentUpdate;
module.watch(require("../utils/document_update"), {
  "default": function (v) {
    documentUpdate = v;
  }
}, 6);
var isRemote;
module.watch(require("../utils/is_remote"), {
  "default": function (v) {
    isRemote = v;
  }
}, 7);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 8);
var rawAll;
module.watch(require("../../fields/utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 9);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 10);
var getModifier;
module.watch(require("../../storage/utils/getModifier"), {
  "default": function (v) {
    getModifier = v;
  }
}, 11);

function save() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  var doc = this;
  var Class = doc.constructor;
  var Collection = Class.getCollection(); // If the first argument is callback function then reassign values.

  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  } // Set default options.


  _defaults(options, {
    stopOnFirstError: true,
    simulation: true,
    forceUpdate: false
  }); // Cast all fields.


  if (options.cast) {
    _each(Class.getFields(), function (field) {
      doc[field.name] = field.castValue(doc[field.name], {
        clone: false,
        cast: true
      });
    });
  } // Cast only nested fields.
  else {
      castNested({
        doc: doc,
        options: {
          clone: false
        }
      });
    } // Detect which operation we are executing.


  var inserting = doc._isNew; // Generate ID if not provided.

  if (inserting && !doc._id) {
    var generateId = true; // Don't generate the id if we're the client and the 'outermost' call.
    // This optimization saves us passing both the randomSeed and the id.
    // Passing both is redundant.

    if (Collection._isRemoteCollection()) {
      var enclosing = DDP._CurrentInvocation.get();

      if (!enclosing) {
        generateId = false;
      }
    }

    if (generateId) {
      doc._id = Collection._makeNewID();
    }
  } // If we are dealing with a remote collection and we are not on the server.


  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/' + (inserting ? 'insert' : 'update'); // Prepare arguments for meteor method.

    var methodArgs = {
      className: Class.getName(),
      stopOnFirstError: options.stopOnFirstError,
      simulation: options.simulation
    }; // Inserting.

    if (inserting) {
      _extend(methodArgs, {
        rawDoc: rawAll(doc, {
          "transient": false
        })
      });
    } // Updating.
    else {
        // If the "forceUpdate" option was set then we don't run the "getModifier"
        // function to get modifier and instead we just take entire raw object and
        // remove the "_id" field as we can't update it.
        var modifier = options.forceUpdate ? _omit(doc.raw(), ['_id']) : getModifier({
          doc: doc
        });

        _extend(methodArgs, {
          selector: {
            _id: doc._id
          },
          modifier: modifier,
          options: {},
          fields: options.fields
        });
      }

    try {
      // Run Meteor method.
      var result = callMeteorMethod(Class, methodName, [methodArgs], callback);

      if (result && inserting) {
        // In the insert operation the value return from the meteor method is
        // a document ID.
        doc._id = result;
      } // Document is not new anymore.


      doc._isNew = false;
      return result;
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Prepare arguments.
    var _methodArgs = {
      doc: doc,
      stopOnFirstError: options.stopOnFirstError,
      simulation: options.simulation,
      trusted: true
    };

    if (inserting) {
      var _result = documentInsert(_methodArgs);

      if (callback) {
        callback(undefined, _result);
      }

      return _result;
    } else {
      _methodArgs.fields = options.fields;

      var _result2 = documentUpdate(_methodArgs);

      if (callback) {
        callback(undefined, _result2);
      }

      return _result2;
    }
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
}

module.exportDefault(save);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_static_methods":{"find.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/find.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  find: function () {
    return find;
  },
  findOne: function () {
    return findOne;
  }
});

var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);

var _isNull;

module.watch(require("lodash/isNull"), {
  "default": function (v) {
    _isNull = v;
  }
}, 2);

var _map;

module.watch(require("lodash/map"), {
  "default": function (v) {
    _map = v;
  }
}, 3);
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 4);
var wrapTransform;
module.watch(require("../utils/wrapTransform"), {
  "default": function (v) {
    wrapTransform = v;
  }
}, 5);
var transformToClass;
module.watch(require("../utils/transformToClass"), {
  "default": function (v) {
    transformToClass = v;
  }
}, 6);
var Event;
module.watch(require("../../events/event"), {
  "default": function (v) {
    Event = v;
  }
}, 7);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 8);

function createMethod(methodName) {
  return function (selector, options) {
    var Class = this;
    var Collection = Class.getCollection(); // Get selector from arguments.

    if (arguments.length === 0) {
      selector = {};
    } else {
      selector = arguments[0];
    } // If selector is null then just proceed to collection's find method.


    if (_isNull(selector)) {
      return Collection[methodName](selector, options);
    } // Rewrite selector to make it an object.


    selector = Mongo.Collection._rewriteSelector(selector); // Set default options.

    options = _defaults({}, options, {
      defaults: config.defaults,
      children: true,
      // We don't want to clone raw object in the "find" method.
      clone: false
    }); // Modify selector and options using the "beforeFind" event handlers.

    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('beforeFind', {
        selector: selector,
        options: options
      }));
    }

    var typeField = Class.getTypeField();

    if ( // If it's an inherited class, then get only documents being instances of
    // the subclass...
    typeField && // ... however do not override a type property in selector when
    // developer provided it and wants to deal with it by him/herself.
    !_has(selector, typeField)) {
      // If a class has child classes then we have to fetch document being
      // instances of the parent and child classes depending on a value of
      // the "children" option.
      var children = Class.getChildren(options.children);

      if (options.children && children.length > 0) {
        children.push(Class);
        selector[typeField] = {
          $in: _map(children, function (Child) {
            return Child.getName();
          })
        };
      } else {
        selector[typeField] = Class.getName();
      }
    }

    var classTransform = Class.getTransform();

    if (options.transform !== null && classTransform !== null) {
      // Wrap the transform function with the "wrapTransform" function, which
      // resolves values.
      options.transform = wrapTransform({
        Class: Class,
        // First, try getting the transform function passed to the "find"
        // method. Later, check if the transform function is defined in the
        // class definition. If none of them contains a transform function, then
        // get the default one.
        transform: options.transform || classTransform || transformToClass({
          Class: Class,
          options: options
        })
      });
    } // Execute the original method.


    var result = Collection[methodName](selector, options); // Modify a query result using the "afterFind" event handlers.

    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('afterFind', {
        selector: selector,
        options: options,
        result: result
      }));
    }

    return result;
  };
}

var find = createMethod('find');
var findOne = createMethod('findOne');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/get_collection.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getCollection() {
  return this.schema.collection;
}

;
module.exportDefault(getCollection);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_transform.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/get_transform.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Class;
module.watch(require("../../../core/class"), {
  "default": function (v) {
    Class = v;
  }
}, 0);

function getTransform() {
  return this.schema.transform;
}

module.exportDefault(getTransform);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_type_field.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/get_type_field.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getTypeField() {
  return this.schema.typeField;
}

;
module.exportDefault(getTypeField);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/insert.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isRemote;
module.watch(require("../utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 0);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 1);
var classInsert;
module.watch(require("../utils/class_insert.js"), {
  "default": function (v) {
    classInsert = v;
  }
}, 2);

function insert(rawDoc, callback) {
  var Class = this;
  var Collection = Class.getCollection(); // Prepare arguments.

  var args = {
    className: Class.getName(),
    rawDoc: rawDoc
  }; // Generate ID if not provided.

  if (!rawDoc._id) {
    var generateId = true; // Don't generate the id if we're the client and the 'outermost' call.
    // This optimization saves us passing both the randomSeed and the id.
    // Passing both is redundant.

    if (Collection._isRemoteCollection()) {
      var enclosing = DDP._CurrentInvocation.get();

      if (!enclosing) {
        generateId = false;
      }
    }

    if (generateId) {
      rawDoc._id = Collection._makeNewID();
    }
  } // If we are dealing with a remote collection and we are not on the server.


  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/insert';

    try {
      // Run Meteor method.
      return callMeteorMethod(Class, methodName, [args], callback);
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Set the "trusted" argument to true.
    args.trusted = true; // Insert a document.

    var result = classInsert(args);

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
}

module.exportDefault(insert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"is_secured.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/is_secured.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function isSecured(operation) {
  if (_has(this.schema.secured, operation)) {
    return this.schema.secured[operation];
  } else {
    var common = this.schema.secured.common;
    return common !== undefined ? common : true;
  }
}

;
module.exportDefault(isSecured);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/remove.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isRemote;
module.watch(require("../utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 0);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 1);
var classRemove;
module.watch(require("../utils/class_remove.js"), {
  "default": function (v) {
    classRemove = v;
  }
}, 2);

function remove(selector, options, callback) {
  var Class = this; // If we omit options argument then it may be a callback function.

  if (options instanceof Function) {
    callback = options;
    options = {};
  } // Make sure that options is at least an empty object.


  options = options || {}; // Prepare arguments.

  var args = {
    className: Class.getName(),
    selector: selector,
    options: options
  }; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/remove';

    try {
      // Run Meteor method.
      return callMeteorMethod(Class, methodName, [args], callback);
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Set the "trusted" argument to true.
    args.trusted = true; // Remove a document.

    var result = classRemove(args);

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
}

module.exportDefault(remove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/update.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isRemote;
module.watch(require("../utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 0);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 1);
var classUpdate;
module.watch(require("../utils/class_update.js"), {
  "default": function (v) {
    classUpdate = v;
  }
}, 2);

function update(selector, modifier, options, callback) {
  var Class = this; // If we omit options argument then it may be a callback function.

  if (options instanceof Function) {
    callback = options;
    options = {};
  } // Make sure that options is at least an empty object.


  options = options || {}; // Prepare arguments.

  var args = {
    className: Class.getName(),
    selector: selector,
    modifier: modifier,
    options: options
  }; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/update';

    try {
      // Run Meteor method.
      return callMeteorMethod(Class, methodName, [args], callback);
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Set the "trusted" argument to true.
    args.trusted = true; // Remove a document.

    var result = classUpdate(args);

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
}

module.exportDefault(update);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"upsert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/class_static_methods/upsert.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isRemote;
module.watch(require("../utils/is_remote.js"), {
  "default": function (v) {
    isRemote = v;
  }
}, 0);
var callMeteorMethod;
module.watch(require("../utils/call_meteor_method.js"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 1);
var classUpsert;
module.watch(require("../utils/class_upsert.js"), {
  "default": function (v) {
    classUpsert = v;
  }
}, 2);

function upsert(selector, modifier, options, callback) {
  var Class = this; // If we omit options argument then it may be a callback function.

  if (options instanceof Function) {
    callback = options;
    options = {};
  } // Make sure that options is at least an empty object.


  options = options || {}; // Prepare arguments.

  var args = {
    className: Class.getName(),
    selector: selector,
    modifier: modifier,
    options: options
  }; // If we are dealing with a remote collection and we are not on the server.

  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    var methodName = '/Astronomy/upsert';

    try {
      // Run Meteor method.
      return callMeteorMethod(Class, methodName, [args], callback);
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.


  try {
    // Set the "trusted" argument to true.
    args.trusted = true; // Remove a document.

    var result = classUpsert(args);

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
}

module.exportDefault(upsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/apply_definition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 1);

var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 2);
var resolveValues;
module.watch(require("../../fields/utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 3);
var hasMeteorMethod;
module.watch(require("../utils/has_meteor_method"), {
  "default": function (v) {
    hasMeteorMethod = v;
  }
}, 4);
var find, findOne;
module.watch(require("../class_static_methods/find"), {
  find: function (v) {
    find = v;
  },
  findOne: function (v) {
    findOne = v;
  }
}, 5);
var insert;
module.watch(require("../class_static_methods/insert"), {
  "default": function (v) {
    insert = v;
  }
}, 6);
var update;
module.watch(require("../class_static_methods/update"), {
  "default": function (v) {
    update = v;
  }
}, 7);
var upsert;
module.watch(require("../class_static_methods/upsert"), {
  "default": function (v) {
    upsert = v;
  }
}, 8);
var remove;
module.watch(require("../class_static_methods/remove"), {
  "default": function (v) {
    remove = v;
  }
}, 9);
var protoSave;
module.watch(require("../class_prototype_methods/save"), {
  "default": function (v) {
    protoSave = v;
  }
}, 10);
var protoRemove;
module.watch(require("../class_prototype_methods/remove"), {
  "default": function (v) {
    protoRemove = v;
  }
}, 11);
var protoReload;
module.watch(require("../class_prototype_methods/reload"), {
  "default": function (v) {
    protoReload = v;
  }
}, 12);
var protoCopy;
module.watch(require("../class_prototype_methods/copy"), {
  "default": function (v) {
    protoCopy = v;
  }
}, 13);
var protoGetModifier;
module.watch(require("../class_prototype_methods/getModifier"), {
  "default": function (v) {
    protoGetModifier = v;
  }
}, 14);
var protoGetModified;
module.watch(require("../class_prototype_methods/getModified"), {
  "default": function (v) {
    protoGetModified = v;
  }
}, 15);
var protoGetModifiedValues;
module.watch(require("../class_prototype_methods/getModifiedValues"), {
  "default": function (v) {
    protoGetModifiedValues = v;
  }
}, 16);
var protoIsModified;
module.watch(require("../class_prototype_methods/isModified"), {
  "default": function (v) {
    protoIsModified = v;
  }
}, 17);
var meteorInsert;
module.watch(require("../meteor_methods/insert"), {
  "default": function (v) {
    meteorInsert = v;
  }
}, 18);
var meteorUpdate;
module.watch(require("../meteor_methods/update"), {
  "default": function (v) {
    meteorUpdate = v;
  }
}, 19);
var meteorUpsert;
module.watch(require("../meteor_methods/upsert"), {
  "default": function (v) {
    meteorUpsert = v;
  }
}, 20);
var meteorRemove;
module.watch(require("../meteor_methods/remove"), {
  "default": function (v) {
    meteorRemove = v;
  }
}, 21);
var fromJSONValue;
module.watch(require("../class_events/fromJSONValue"), {
  "default": function (v) {
    fromJSONValue = v;
  }
}, 22);
var toJSONValue;
module.watch(require("../class_events/toJSONValue"), {
  "default": function (v) {
    toJSONValue = v;
  }
}, 23);

function onApplyDefinition(Class, parsedDefinition, className) {
  var schema = Class.schema;

  if (parsedDefinition.collection) {
    var _Collection = schema.collection = parsedDefinition.collection; // Get type of the "_id" field.


    var id = _Collection._makeNewID();

    var IdType = id.constructor;
    Class.extend({
      // Add the "_id" field if not already added.
      fields: {
        _id: {
          name: '_id',
          type: IdType,
          optional: true
        }
      },
      // Add storage events.
      events: {
        toJSONValue: [toJSONValue],
        fromJSONValue: [fromJSONValue]
      }
    }, ['fields', 'events']); // If it's a remote collection then we register methods on the connection
    // object of the collection.

    var connection = _Collection._connection;

    if (connection) {
      // Prepare meteor methods to be added.
      var meteorMethods = {
        '/Astronomy/insert': meteorInsert,
        '/Astronomy/update': meteorUpdate,
        '/Astronomy/upsert': meteorUpsert,
        '/Astronomy/remove': meteorRemove
      };

      _each(meteorMethods, function (meteorMethod, methodName) {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_zipObject([methodName], [meteorMethod]));
        }
      });
    } // Class static methods.


    Class.find = find;
    Class.findOne = findOne;
    Class.insert = insert;
    Class.update = update;
    Class.upsert = upsert;
    Class.remove = remove; // Class prototype methods.

    Class.prototype.save = protoSave;
    Class.prototype.remove = protoRemove;
    Class.prototype.reload = protoReload;
    Class.prototype.copy = protoCopy;
    Class.prototype.getModifier = protoGetModifier;
    Class.prototype.getModified = protoGetModified;
    Class.prototype.getModifiedValues = protoGetModifiedValues;
    Class.prototype.isModified = protoIsModified;
  } // Apply type field.


  if (parsedDefinition.typeField) {
    var typeField = schema.typeField = parsedDefinition.typeField; // Add the type field if not already added.

    if (!Class.hasField(typeField)) {
      var _fields;

      Class.extend({
        fields: (_fields = {}, _fields[typeField] = {
          type: String,
          index: 1
        }, _fields),
        events: {
          afterInit: function (e) {
            var doc = e.currentTarget;
            var Class = doc.constructor;
            doc[typeField] = Class.getName();
          }
        }
      }, ['fields', 'events']);
    }

    if (parsedDefinition.typeField) {
      schema.typeField = parsedDefinition.typeField;
    }
  } // If class has already assigned collection.


  var Collection = Class.getCollection();

  if (Collection) {
    // Apply the "transform" property only if it's a function or equal null.
    if (typeof parsedDefinition.transform === 'function' || parsedDefinition.transform === null) {
      schema.transform = parsedDefinition.transform;
    }

    if (parsedDefinition.secured !== undefined) {
      _extend(schema.secured, parsedDefinition.secured);
    }
  }
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/init_class.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getCollection;
module.watch(require("../class_static_methods/get_collection.js"), {
  "default": function (v) {
    getCollection = v;
  }
}, 0);
var getTypeField;
module.watch(require("../class_static_methods/get_type_field.js"), {
  "default": function (v) {
    getTypeField = v;
  }
}, 1);
var getTransform;
module.watch(require("../class_static_methods/get_transform.js"), {
  "default": function (v) {
    getTransform = v;
  }
}, 2);
var isSecured;
module.watch(require("../class_static_methods/is_secured.js"), {
  "default": function (v) {
    isSecured = v;
  }
}, 3);

function onInitClass(Class, className) {
  // Class static methods.
  Class.getCollection = getCollection;
  Class.getTypeField = getTypeField;
  Class.getTransform = getTransform;
  Class.isSecured = isSecured;
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/init_definition.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.collection = undefined;
  definition.typeField = undefined;
  definition.transform = undefined;
  definition.secured = undefined;
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/init_schema.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.collection = undefined;
  schema.typeField = undefined;
  schema.transform = undefined;
  schema.secured = {
    common: true
  };
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/merge_definitions.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  if (sourceDefinition.collection) {
    targetDefinition.collection = sourceDefinition.collection;
  }

  if (sourceDefinition.typeField) {
    targetDefinition.typeField = sourceDefinition.typeField;
  }

  if (sourceDefinition.transform !== undefined) {
    targetDefinition.transform = sourceDefinition.transform;
  }

  if (sourceDefinition.secured !== undefined) {
    targetDefinition.secured = _extend({}, targetDefinition.secured, sourceDefinition.secured);
  }
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/hooks/parse_definition.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 0);

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "collection" property.
  if (definition.collection !== undefined) {
    // The "collection" property has to be an instance of the
    // "Mongo.Collection".
    if (!(definition.collection instanceof Mongo.Collection)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'collection'
      }, 'Property value has to be an instance of "Mongo.Collection"']);
    }

    parsedDefinition.collection = definition.collection;
  } // Check existence and validity of the "typeField" property.


  if (definition.typeField !== undefined) {
    // The "typeField" property has to be a string.
    if (!Match.test(definition.typeField, String)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'typeField'
      }, 'Property value has to be a string']);
    }

    parsedDefinition.typeField = definition.typeField;
  } // Check existence and validity of the "transform" property.


  if (definition.transform !== undefined) {
    // The "transform" property has to be a function.
    if (!Match.test(definition.transform, Match.OneOf(Function, null))) {
      throwParseError([{
        'class': className
      }, {
        'property': 'transform'
      }, 'Property value has to be a function or null']);
    }

    parsedDefinition.transform = definition.transform;
  } // Check existence and validity of the "secured" property.


  if (definition.secured !== undefined) {
    if (!Match.test(definition.secured, Match.OneOf(Boolean, Object))) {
      throwParseError([{
        'class': className
      }, {
        'property': 'secured'
      }, 'Property value has to be a boolean or an object with keys being ' + 'method name and values being boolean']);
    }

    if (typeof definition.secured === 'boolean') {
      parsedDefinition.secured = {
        common: definition.secured
      };
    } else {
      parsedDefinition.secured = definition.secured;
    }
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meteor_methods":{"insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/meteor_methods/insert.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var classInsert;
module.watch(require("../utils/class_insert.js"), {
  "default": function (v) {
    classInsert = v;
  }
}, 0);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 1);

function insert(args) {
  check(args, Match.Any);
  return classInsert(args);
}

;
module.exportDefault(insert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/meteor_methods/remove.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var classRemove;
module.watch(require("../utils/class_remove.js"), {
  "default": function (v) {
    classRemove = v;
  }
}, 0);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 1);

function remove(args) {
  check(args, Match.Any);
  return classRemove(args);
}

;
module.exportDefault(remove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/meteor_methods/update.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var classUpdate;
module.watch(require("../utils/class_update.js"), {
  "default": function (v) {
    classUpdate = v;
  }
}, 0);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 1);

function update(args) {
  check(args, Match.Any);
  return classUpdate(args);
}

;
module.exportDefault(update);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"upsert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/meteor_methods/upsert.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var classUpsert;
module.watch(require("../utils/class_upsert.js"), {
  "default": function (v) {
    classUpsert = v;
  }
}, 0);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 1);

function upsert(args) {
  check(args, Match.Any);
  return classUpsert(args);
}

;
module.exportDefault(upsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"utils":{"already_in_simulation.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/already_in_simulation.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var DDP;
module.watch(require("meteor/ddp"), {
  DDP: function (v) {
    DDP = v;
  }
}, 0);

function alreadyInSimulation() {
  var enclosing = DDP._CurrentInvocation.get();

  return enclosing && enclosing.isSimulation;
}

module.exportDefault(alreadyInSimulation);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"apply_modifier.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/apply_modifier.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _size;

module.watch(require("lodash/size"), {
  "default": function (v) {
    _size = v;
  }
}, 0);
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 1);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 2);
var setAll;
module.watch(require("../../fields/utils/set_all"), {
  "default": function (v) {
    setAll = v;
  }
}, 3);
var LocalCollection;
module.watch(require("meteor/minimongo"), {
  LocalCollection: function (v) {
    LocalCollection = v;
  }
}, 4);

function applyModifier() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = args.doc,
      modifier = args.modifier,
      options = args.options; // Apply modifier only if provided.

  if (modifier && _size(modifier) > 0) {
    // Get raw object because the "_modify" method can only work with plain
    // objects.
    var rawDoc = doc.raw(); // Use Minimongo's the "_modify" method to apply modifier.

    LocalCollection._modify(rawDoc, modifier, options); // Set all values back again on a document.


    setAll(doc, rawDoc, {
      defaults: config.defaults,
      clone: false,
      cast: false
    });
  }
}

;
module.exportDefault(applyModifier);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"call_meteor_method.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/call_meteor_method.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var callMeteorMethod = function (Class, methodName, methodArgs, callback) {
  var Collection = Class.getCollection();
  var connection = Collection && Collection._connection;

  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  } // Prepare meteor method options.


  var methodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
  return connection.apply(methodName, methodArgs, methodOptions, callback);
};

module.exportDefault(callMeteorMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/class_insert.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 0);
var documentInsert;
module.watch(require("./document_insert.js"), {
  "default": function (v) {
    documentInsert = v;
  }
}, 1);

function classInsert() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var className = args.className,
      rawDoc = args.rawDoc,
      stopOnFirstError = args.stopOnFirstError,
      fields = args.fields,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  var Class = AstroClass.get(className); // Create a new document.

  var doc = new Class(rawDoc); // Insert a document.

  return documentInsert({
    doc: doc,
    stopOnFirstError: stopOnFirstError,
    simulation: simulation,
    trusted: trusted
  });
}

;
module.exportDefault(classInsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/class_remove.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 0);
var alreadyInSimulation;
module.watch(require("./already_in_simulation.js"), {
  "default": function (v) {
    alreadyInSimulation = v;
  }
}, 1);
var throwIfSelectorIsNotId;
module.watch(require("./throw_if_selector_is_not_id.js"), {
  "default": function (v) {
    throwIfSelectorIsNotId = v;
  }
}, 2);
var documentRemove;
module.watch(require("./document_remove.js"), {
  "default": function (v) {
    documentRemove = v;
  }
}, 3);

function classRemove() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var className = args.className,
      selector = args.selector,
      options = args.options,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  } // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.


  if (!trusted && !alreadyInSimulation()) {
    throwIfSelectorIsNotId(selector, 'remove');
  }

  var Class = AstroClass.get(className); // Get all documents matching selector.

  var docs = Class.find(selector, options); // Prepare result of the method execution.

  var result = 0;
  docs.forEach(function (doc) {
    // Update a document.
    result += documentRemove({
      doc: doc,
      simulation: simulation,
      trusted: trusted
    });
  });
  return result;
}

;
module.exportDefault(classRemove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/class_update.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 0);

var _mapKeys;

module.watch(require("lodash/mapKeys"), {
  "default": function (v) {
    _mapKeys = v;
  }
}, 1);
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 2);
var alreadyInSimulation;
module.watch(require("./already_in_simulation.js"), {
  "default": function (v) {
    alreadyInSimulation = v;
  }
}, 3);
var throwIfSelectorIsNotId;
module.watch(require("./throw_if_selector_is_not_id.js"), {
  "default": function (v) {
    throwIfSelectorIsNotId = v;
  }
}, 4);
var documentUpdate;
module.watch(require("./document_update.js"), {
  "default": function (v) {
    documentUpdate = v;
  }
}, 5);
var applyModifier;
module.watch(require("./apply_modifier.js"), {
  "default": function (v) {
    applyModifier = v;
  }
}, 6);
var Minimongo;
module.watch(require("meteor/minimongo"), {
  Minimongo: function (v) {
    Minimongo = v;
  }
}, 7);

function classUpdate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var className = args.className,
      selector = args.selector,
      modifier = args.modifier,
      options = args.options,
      stopOnFirstError = args.stopOnFirstError,
      fields = args.fields,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  } // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.


  if (!trusted && !alreadyInSimulation()) {
    throwIfSelectorIsNotId(selector, 'update');
  }

  var Class = AstroClass.get(className); // Get all documents matching selector.

  var docs;
  var oldDocs;

  if (options.multi) {
    docs = Class.find(selector, options); // Get all old documents in one batched query so that performance is
    // improved when updating many documents. Map all documents to an object
    // where properites are documents' IDs.

    oldDocs = _mapKeys(Class.find(selector, _extend(options, {
      defaults: false
    })).fetch(), function (oldDoc) {
      return oldDoc._id;
    });
  } else {
    docs = Class.find(selector, _extend(options, {
      limit: 1
    })); // Get all old documents in one batched query so that performance is
    // improved when updating many documents. Map all documents to an object
    // where properites are documents' IDs.

    oldDocs = _mapKeys(Class.find(selector, _extend(options, {
      limit: 1,
      defaults: false
    })).fetch(), function (oldDoc) {
      return oldDoc._id;
    });
  } // Create a minimongo matcher object to find array indexes on the projection
  // operator use.


  var matcher = new Minimongo.Matcher(selector); // Prepare result of the method execution.

  var result = 0;
  docs.forEach(function (doc) {
    var oldDoc = oldDocs[doc._id]; // Use matcher to find array indexes in a given document that needs updating
    // on the projection operator use.

    var queryResult = matcher.documentMatches(doc); // Apply modifier.

    applyModifier({
      doc: doc,
      modifier: modifier,
      options: queryResult.arrayIndices ? {
        arrayIndices: queryResult.arrayIndices
      } : {}
    }); // Update a document.

    result += documentUpdate({
      doc: doc,
      stopOnFirstError: stopOnFirstError,
      simulation: simulation,
      fields: fields,
      trusted: trusted,
      oldDoc: oldDoc
    });
  });
  return result;
}

;
module.exportDefault(classUpdate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_upsert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/class_upsert.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 0);
var AstroClass;
module.watch(require("../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 1);
var alreadyInSimulation;
module.watch(require("./already_in_simulation.js"), {
  "default": function (v) {
    alreadyInSimulation = v;
  }
}, 2);
var throwIfSelectorIsNotId;
module.watch(require("./throw_if_selector_is_not_id.js"), {
  "default": function (v) {
    throwIfSelectorIsNotId = v;
  }
}, 3);
var documentInsert;
module.watch(require("./document_insert.js"), {
  "default": function (v) {
    documentInsert = v;
  }
}, 4);
var documentUpdate;
module.watch(require("./document_update.js"), {
  "default": function (v) {
    documentUpdate = v;
  }
}, 5);
var applyModifier;
module.watch(require("./apply_modifier.js"), {
  "default": function (v) {
    applyModifier = v;
  }
}, 6);
var Minimongo, LocalCollection;
module.watch(require("meteor/minimongo"), {
  Minimongo: function (v) {
    Minimongo = v;
  },
  LocalCollection: function (v) {
    LocalCollection = v;
  }
}, 7);

function classUpsert() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var className = args.className,
      selector = args.selector,
      modifier = args.modifier,
      options = args.options,
      stopOnFirstError = args.stopOnFirstError,
      fields = args.fields,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  } // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.


  if (!trusted && !alreadyInSimulation()) {
    throwIfSelectorIsNotId(selector, 'upsert');
  }

  var Class = AstroClass.get(className); // Get all documents matching selector.

  var docs;

  if (options.multi) {
    docs = Class.find(selector, options);
  } else {
    docs = Class.find(selector, _extend(options, {
      limit: 1
    }));
  } // Create a minimongo matcher object to find array indexes on the projection
  // operator use.


  var matcher = new Minimongo.Matcher(selector); // Prepare result of the method execution.

  var result = {
    numberAffected: 0,
    insertedId: null
  };

  if (docs.count() > 0) {
    docs.forEach(function (doc) {
      // Use matcher to find array indexes in a given document that needs updating
      // on the projection operator use.
      var queryResult = matcher.documentMatches(doc); // Apply modifier.

      applyModifier({
        doc: doc,
        modifier: modifier,
        options: queryResult.arrayIndices ? {
          arrayIndices: queryResult.arrayIndices
        } : {}
      }); // Update a document.

      result.numberAffected += documentUpdate({
        doc: doc,
        stopOnFirstError: stopOnFirstError,
        simulation: simulation,
        fields: fields,
        trusted: trusted
      });
    });
  } else {
    var doc; // Create a new document from selector.

    if (LocalCollection._createUpsertDocument) {
      doc = new Class(LocalCollection._createUpsertDocument(selector, modifier));
    } else if (LocalCollection._removeDollarOperators) {
      doc = new Class(LocalCollection._removeDollarOperators(selector)); // Apply modifier for the insert operation.

      applyModifier({
        doc: doc,
        modifier: modifier,
        options: {
          isInsert: true
        }
      });
    } // Insert a document.


    result.insertedId = documentInsert({
      doc: doc,
      stopOnFirstError: stopOnFirstError,
      simulation: simulation,
      trusted: trusted
    });
  }

  return result;
}

;
module.exportDefault(classUpsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"diff.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/diff.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 1);

var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 2);

var _keys;

module.watch(require("lodash/keys"), {
  "default": function (v) {
    _keys = v;
  }
}, 3);

var _noop;

module.watch(require("lodash/noop"), {
  "default": function (v) {
    _noop = v;
  }
}, 4);

var _union;

module.watch(require("lodash/union"), {
  "default": function (v) {
    _union = v;
  }
}, 5);
var EJSON;
module.watch(require("meteor/ejson"), {
  EJSON: function (v) {
    EJSON = v;
  }
}, 6);

function diff() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fieldName = args.fieldName,
      newDoc = args.newDoc,
      oldDoc = args.oldDoc,
      _args$prefix = args.prefix,
      prefix = _args$prefix === void 0 ? '' : _args$prefix,
      result = args.result,
      _args$onDiff = args.onDiff,
      onDiff = _args$onDiff === void 0 ? _noop : _args$onDiff,
      _args$onObjectDiff = args.onObjectDiff,
      onObjectDiff = _args$onObjectDiff === void 0 ? _noop : _args$onObjectDiff,
      _args$onListDiff = args.onListDiff,
      onListDiff = _args$onListDiff === void 0 ? _noop : _args$onListDiff,
      _args$onScalarDiff = args.onScalarDiff,
      onScalarDiff = _args$onScalarDiff === void 0 ? _noop : _args$onScalarDiff; // Combine fields from old and new document.

  var fieldsNames = _union(_keys(oldDoc), _keys(newDoc)); // Loop through all fields and check if they differ.


  _each(fieldsNames, function (fieldName) {
    var oldValue = oldDoc[fieldName];
    var newValue = newDoc[fieldName];

    if (!EJSON.equals(oldValue, newValue)) {
      var nestedPrefix = (prefix && prefix + '.') + fieldName;
      onDiff({
        oldValue: oldValue,
        newValue: newValue,
        prefix: nestedPrefix,
        result: result
      }); // Compare two objects.

      if (_isPlainObject(oldValue) && _isPlainObject(newValue)) {
        onObjectDiff({
          oldDoc: oldValue,
          newDoc: newValue,
          prefix: nestedPrefix,
          result: result
        });
      } // Compare two lists.
      else if (_isArray(oldValue) && _isArray(newValue)) {
          onListDiff({
            oldList: oldValue,
            newList: newValue,
            prefix: nestedPrefix,
            result: result
          });
        } // Compare two scalars.
        else {
            onScalarDiff({
              oldValue: oldValue,
              newValue: newValue,
              prefix: nestedPrefix,
              result: result
            });
          }
    }
  });
}

module.exportDefault(diff);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"document_insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/document_insert.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _omitBy;

module.watch(require("lodash/omitBy"), {
  "default": function (v) {
    _omitBy = v;
  }
}, 0);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 1);
var rawAll;
module.watch(require("../../fields/utils/rawAll"), {
  "default": function (v) {
    rawAll = v;
  }
}, 2);
var triggerBeforeSave;
module.watch(require("./trigger_before_save"), {
  "default": function (v) {
    triggerBeforeSave = v;
  }
}, 3);
var triggerBeforeInsert;
module.watch(require("./trigger_before_insert"), {
  "default": function (v) {
    triggerBeforeInsert = v;
  }
}, 4);
var triggerAfterSave;
module.watch(require("./trigger_after_save"), {
  "default": function (v) {
    triggerAfterSave = v;
  }
}, 5);
var triggerAfterInsert;
module.watch(require("./trigger_after_insert"), {
  "default": function (v) {
    triggerAfterInsert = v;
  }
}, 6);
var documentValidate;
module.watch(require("../../validators/utils/document_validate"), {
  "default": function (v) {
    documentValidate = v;
  }
}, 7);

function documentInsert() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = args.doc,
      stopOnFirstError = args.stopOnFirstError,
      fields = args.fields,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  var Class = doc.constructor;
  var Collection = Class.getCollection(); // Generate ID if not provided.

  if (!doc._id) {
    doc._id = Collection._makeNewID();
  } // Check if a class is secured.


  if (Class.isSecured('insert') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Inserting from the client is not allowed');
  } // Cast nested documents.


  castNested({
    doc: doc,
    options: {
      clone: false
    }
  }); // Trigger before events.

  triggerBeforeSave(doc, trusted);
  triggerBeforeInsert(doc, trusted); // Cast nested documents.

  castNested({
    doc: doc,
    options: {
      clone: false
    }
  }); // Validate a document.

  documentValidate({
    doc: doc,
    fields: fields,
    stopOnFirstError: stopOnFirstError,
    simulation: simulation
  }); // Get plain values of all fields. Pick only values that we want to save.

  var values = rawAll(doc, {
    "transient": false
  });
  values = _omitBy(values, function (value) {
    return value === undefined;
  }); // Insert a document.

  try {
    // There is a difference in what the insert method returns depending on the
    // environment. On the client it returns an inserted document id, on the
    // server it returns array of inserted documents. So we always return the
    // generated id. We can't send an entire document because it could be a
    // security issue if we are not subscribed to all fields of a document.
    Collection._collection.insert(values); // Change the "_isNew" flag to "false". Mark a document as not new.


    doc._isNew = false; // Trigger after events.

    triggerAfterInsert(doc, trusted);
    triggerAfterSave(doc, trusted);
    return doc._id;
  } catch (err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    } else {
      throw err;
    }
  }
}

;
module.exportDefault(documentInsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"document_remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/document_remove.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var triggerBeforeRemove;
module.watch(require("./trigger_before_remove.js"), {
  "default": function (v) {
    triggerBeforeRemove = v;
  }
}, 0);
var triggerAfterRemove;
module.watch(require("./trigger_after_remove.js"), {
  "default": function (v) {
    triggerAfterRemove = v;
  }
}, 1);

function documentRemove() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = args.doc,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  var Class = doc.constructor;
  var Collection = Class.getCollection(); // Remove only when document has the "_id" field (it's persisted).

  if (doc._isNew) {
    return 0;
  } // Check if a class is secured.


  if (Class.isSecured('remove') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Removing from the client is not allowed');
  } // Trigger before events.


  triggerBeforeRemove(doc, trusted); // Remove a document.

  try {
    var result = Collection._collection.remove({
      _id: doc._id
    }); // Mark a document as new, so it will be possible to save it again.


    doc._isNew = true; // Trigger after events.

    triggerAfterRemove(doc, trusted);
    return result;
  } catch (err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    } else {
      throw err;
    }
  }
}

;
module.exportDefault(documentRemove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"document_update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/document_update.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _omit;

module.watch(require("lodash/omit"), {
  "default": function (v) {
    _omit = v;
  }
}, 0);

var _size;

module.watch(require("lodash/size"), {
  "default": function (v) {
    _size = v;
  }
}, 1);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 2);
var triggerBeforeSave;
module.watch(require("./trigger_before_save"), {
  "default": function (v) {
    triggerBeforeSave = v;
  }
}, 3);
var triggerBeforeUpdate;
module.watch(require("./trigger_before_update"), {
  "default": function (v) {
    triggerBeforeUpdate = v;
  }
}, 4);
var triggerAfterSave;
module.watch(require("./trigger_after_save"), {
  "default": function (v) {
    triggerAfterSave = v;
  }
}, 5);
var triggerAfterUpdate;
module.watch(require("./trigger_after_update"), {
  "default": function (v) {
    triggerAfterUpdate = v;
  }
}, 6);
var isModified;
module.watch(require("./isModified"), {
  "default": function (v) {
    isModified = v;
  }
}, 7);
var getModifier;
module.watch(require("./getModifier"), {
  "default": function (v) {
    getModifier = v;
  }
}, 8);
var documentValidate;
module.watch(require("../../validators/utils/document_validate"), {
  "default": function (v) {
    documentValidate = v;
  }
}, 9);

function documentUpdate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = args.doc,
      stopOnFirstError = args.stopOnFirstError,
      fields = args.fields,
      _args$simulation = args.simulation,
      simulation = _args$simulation === void 0 ? true : _args$simulation,
      _args$forceUpdate = args.forceUpdate,
      forceUpdate = _args$forceUpdate === void 0 ? false : _args$forceUpdate,
      _args$trusted = args.trusted,
      trusted = _args$trusted === void 0 ? false : _args$trusted,
      oldDoc = args.oldDoc; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  var Class = doc.constructor;
  var Collection = Class.getCollection(); // Return if there were no modifications.

  if (!isModified({
    doc: doc,
    fields: fields
  })) {
    // Validate a document even if there were no modifications.
    documentValidate({
      doc: doc,
      fields: fields,
      stopOnFirstError: stopOnFirstError,
      simulation: simulation
    }); // 0 documents were modified.

    return 0;
  } // Check if a class is secured.


  if (Class.isSecured('update') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Updating from the client is not allowed');
  } // Cast nested documents.


  castNested({
    doc: doc,
    options: {
      clone: false
    }
  }); // Trigger before events.

  triggerBeforeSave(doc, trusted);
  triggerBeforeUpdate(doc, trusted); // Cast nested documents.

  castNested({
    doc: doc,
    options: {
      clone: false
    }
  }); // Validate a document.

  documentValidate({
    doc: doc,
    fields: fields,
    stopOnFirstError: stopOnFirstError,
    simulation: simulation
  }); // Get modifier.
  // If the "forceUpdate" option was set then we don't run the "getModifier"
  // function to get modifier and instead we just take entire raw object and
  // remove the "_id" field as we can't update it.

  var modifier = forceUpdate ? _omit(doc.raw(), ['_id']) : getModifier({
    doc: doc,
    fields: fields,
    oldDoc: oldDoc
  }); // Stop execution is a modifier is empty.

  if (_size(modifier) === 0) {
    return 0;
  } // Update a document.


  try {
    var result = Collection._collection.update({
      _id: doc._id
    }, modifier); // Trigger after events.


    triggerAfterUpdate(doc, trusted);
    triggerAfterSave(doc, trusted);
    return result;
  } catch (err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    } else {
      throw err;
    }
  }
}

;
module.exportDefault(documentUpdate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getModified.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/getModified.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var module1 = module;

var _each;

module1.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isPlainObject;

module1.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 1);

var _range;

module1.watch(require("lodash/range"), {
  "default": function (v) {
    _range = v;
  }
}, 2);
var EJSON;
module1.watch(require("meteor/ejson"), {
  EJSON: function (v) {
    EJSON = v;
  }
}, 3);
var throwParseError;
module1.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 4);
var rawMany;
module1.watch(require("../../fields/utils/rawMany"), {
  "default": function (v) {
    rawMany = v;
  }
}, 5);
var diff;
module1.watch(require("./diff"), {
  "default": function (v) {
    diff = v;
  }
}, 6);
var handlers = {};

handlers.onDiff = function (_ref) {
  var prefix = _ref.prefix,
      result = _ref.result;
  result.push(prefix);
};

handlers.onObjectDiff = function (_ref2) {
  var oldDoc = _ref2.oldDoc,
      newDoc = _ref2.newDoc,
      prefix = _ref2.prefix,
      result = _ref2.result;
  diff((0, _objectSpread2.default)({
    oldDoc: oldDoc,
    newDoc: newDoc,
    prefix: prefix,
    result: result
  }, handlers));
};

handlers.onListDiff = function (_ref3) {
  var oldList = _ref3.oldList,
      newList = _ref3.newList,
      prefix = _ref3.prefix,
      result = _ref3.result;
  var maxLength = Math.max(oldList.length, newList.length);

  _each(_range(maxLength), function (index) {
    var arrayPrefix = prefix + "." + index;
    var oldElement = oldList[index];
    var newElement = newList[index];

    if (!EJSON.equals(oldElement, newElement)) {
      result.push(arrayPrefix); // If both array elements are object, then we perform diff between
      // them.

      if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
        // Get a difference between elements.
        diff((0, _objectSpread2.default)({
          oldDoc: oldElement,
          newDoc: newElement,
          prefix: arrayPrefix,
          result: result
        }, handlers));
      }
    }
  });
};

function getModified() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var newDoc = options.doc,
      _options$transient = options.transient,
      transient = _options$transient === void 0 ? false : _options$transient,
      _options$immutable = options.immutable,
      immutable = _options$immutable === void 0 ? false : _options$immutable,
      fields = options.fields;
  var Class = newDoc.constructor;
  var opts = {
    defaults: false
  };
  var oldDoc = Class.findOne(newDoc._id, opts);

  if (!oldDoc) {
    oldDoc = new Class({}, opts);
  } // If there is no document before modifications that may mean that we are not
  // subscribed to the publication publishing given document or we modified the
  // _id of a document.


  if (!oldDoc) {
    throwParseError([{
      'module': 'storage'
    }, {
      'utility': 'getModified'
    }, "Can not get a document before modifications. You are not subscribed " + ("to the publication publishing a \"" + Class.getName() + "\" document with ") + ("the id \"" + newDoc._id + "\" or you have modified the \"_id\" field")]);
  } // If there are not fields specified, then get all of them.


  if (!fields) {
    fields = Class.getFieldsNames();
  }

  var result = [];
  diff((0, _objectSpread2.default)({
    // Get raw data from the docs.
    oldDoc: rawMany(oldDoc, fields, {
      "transient": transient,
      immutable: immutable,
      undefined: false
    }),
    newDoc: rawMany(newDoc, fields, {
      "transient": transient,
      immutable: immutable,
      undefined: false
    }),
    result: result
  }, handlers));
  return result;
}

;
module1.exportDefault(getModified);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getModifier.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/getModifier.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var module1 = module;

var _each;

module1.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isNumber;

module1.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 1);

var _isPlainObject;

module1.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 2);

var _omitBy;

module1.watch(require("lodash/omitBy"), {
  "default": function (v) {
    _omitBy = v;
  }
}, 3);

var _size;

module1.watch(require("lodash/size"), {
  "default": function (v) {
    _size = v;
  }
}, 4);
var EJSON;
module1.watch(require("meteor/ejson"), {
  EJSON: function (v) {
    EJSON = v;
  }
}, 5);
var throwParseError;
module1.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 6);
var rawMany;
module1.watch(require("../../fields/utils/rawMany"), {
  "default": function (v) {
    rawMany = v;
  }
}, 7);
var diff;
module1.watch(require("./diff"), {
  "default": function (v) {
    diff = v;
  }
}, 8);
var handlers = {};

handlers.onObjectDiff = function (_ref) {
  var oldDoc = _ref.oldDoc,
      newDoc = _ref.newDoc,
      prefix = _ref.prefix,
      result = _ref.result;
  diff((0, _objectSpread2.default)({
    oldDoc: oldDoc,
    newDoc: newDoc,
    prefix: prefix,
    result: result
  }, handlers));
};

handlers.onListDiff = function (_ref2) {
  var oldList = _ref2.oldList,
      newList = _ref2.newList,
      prefix = _ref2.prefix,
      result = _ref2.result;

  // NOTE: We need check a new array size. If its length increased or stayed the
  // same then all changes can be registered using the $set modifier. If an
  // array length decreased, then we should slice it. However it may not be
  // possible if some element has also changed. In such situation we have to
  // override entire array.
  // Array length decreased.
  if (newList.length < oldList.length) {
    // Due to an error in MiniMongo it's not possible to apply $push modifier
    // with the $slice operator set to positive number. That's why we have to
    // override entire array when it was shrinked.
    result.$set[prefix] = newList;
  } // Array length increased or stayed the same.
  else if (newList.length >= oldList.length) {
      var modified = false; // Compare up to number of elements in the new list.

      _each(newList, function (newElement, index) {
        var arrayPrefix = prefix + "." + index;
        var oldElement = oldList[index]; // When iterating over elements up to old array length.

        if (index < oldList.length) {
          if (!EJSON.equals(oldElement, newElement)) {
            modified = true; // If both array elements are object, then we perform diff.

            if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
              // Get a difference between elements.
              diff((0, _objectSpread2.default)({
                oldDoc: oldElement,
                newDoc: newElement,
                prefix: arrayPrefix,
                result: result
              }, handlers));
            } else {
              result.$set[arrayPrefix] = newElement;
            }
          }
        } // When iterating over newly added array elements.
        else {
            // Elements up to the old array length were modified, so we can not
            // use the $push operator in conjunction with the $set operator.
            if (modified) {
              // If both array elements are object, then we perform diff.
              if (_isPlainObject(oldElement) && _isPlainObject(newElement)) {
                // Get a difference between elements.
                diff((0, _objectSpread2.default)({
                  oldDoc: oldElement,
                  newDoc: newElement,
                  prefix: arrayPrefix,
                  result: result
                }, handlers));
              } else {
                result.$set[arrayPrefix] = newElement;
              }
            } // Elements up to the old array length were not modified, so if there
            // is any new array element added, we can insert it with the $push
            // operator.
            else {
                // We have to check if there is only one element being pushed or
                // more. If there is only one element then we use
                // $push[prefix]: element
                if (newList.length - oldList.length === 1) {
                  result.$push[prefix] = newElement;
                } // If there are more elements we have to use
                // $push: { [prefix]: { $each: elements } }
                else {
                    result.$push[prefix] = {
                      $each: newList.slice(index)
                    }; // We have to break each loop here. We don't need to check any
                    // more elements.

                    return false;
                  }
              }
          }
      });
    }
};

handlers.onScalarDiff = function (_ref3) {
  var oldValue = _ref3.oldValue,
      newValue = _ref3.newValue,
      prefix = _ref3.prefix,
      result = _ref3.result;

  if (newValue !== undefined) {
    if (_isNumber(oldValue) && _isNumber(newValue)) {
      result.$inc[prefix] = newValue - oldValue;
    } else {
      result.$set[prefix] = newValue;
    }
  } else {
    result.$unset[prefix] = '';
  }
};

var getModifier = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var newDoc = options.doc,
      _options$transient = options.transient,
      transient = _options$transient === void 0 ? false : _options$transient,
      _options$immutable = options.immutable,
      immutable = _options$immutable === void 0 ? false : _options$immutable,
      fields = options.fields,
      oldDoc = options.oldDoc;
  var Class = newDoc.constructor;
  var opts = {
    defaults: false
  };

  if (!oldDoc) {
    oldDoc = Class.findOne(newDoc._id, opts);
  }

  if (!oldDoc) {
    oldDoc = new Class({}, opts);
  } // If there is no document before modifications that may mean that we are not
  // subscribed to the publication publishing given document or we modified the
  // _id of a document.


  if (!oldDoc) {
    throwParseError([{
      'module': 'storage'
    }, {
      'utility': 'getModified'
    }, "Can not get a document before modifications. You are not subscribed " + ("to the publication publishing a \"" + Class.getName() + "\" document with ") + ("the id \"" + newDoc._id + "\" or you have modified the \"_id\" field")]);
  } // If there are not fields specified, then get all of them.


  if (!fields) {
    fields = Class.getFieldsNames();
  }

  var result = {
    $set: {},
    $inc: {},
    $unset: {},
    $push: {}
  };
  diff((0, _objectSpread2.default)({
    // Get raw data from the docs.
    oldDoc: rawMany(oldDoc, fields, {
      "transient": transient,
      immutable: immutable,
      undefined: false
    }),
    newDoc: rawMany(newDoc, fields, {
      "transient": transient,
      immutable: immutable,
      undefined: false
    }),
    result: result
  }, handlers)); // Return only non empty modifiers.

  return _omitBy(result, function (modifier) {
    return _size(modifier) === 0;
  });
};

module1.exportDefault(getModifier);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has_meteor_method.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/has_meteor_method.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);

function hasMeteorMethod(connection, methodName) {
  // There is inconsistency between client and server. On the client connection
  // object contains the "_methodHandlers" property and on the server the
  // "method_handlers" property.
  var methodHandlers = connection._methodHandlers || connection.method_handlers;
  return _has(methodHandlers, methodName);
}

;
module.exportDefault(hasMeteorMethod);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isModified.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/isModified.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 0);
var getModified;
module.watch(require("./getModified"), {
  "default": function (v) {
    getModified = v;
  }
}, 1);

function isModified() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = options.doc,
      pattern = options.pattern,
      _options$transient = options.transient,
      transient = _options$transient === void 0 ? false : _options$transient,
      _options$immutable = options.immutable,
      immutable = _options$immutable === void 0 ? false : _options$immutable;
  var modified = getModified({
    doc: doc,
    "transient": transient,
    immutable: immutable
  });

  if (pattern) {
    return _includes(modified, pattern);
  } else {
    return modified.length > 0;
  }
}

;
module.exportDefault(isModified);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"is_remote.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/is_remote.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function isRemote(Class) {
  var Collection = Class.getCollection();

  if (!Collection) {
    return false;
  }

  var connection = Collection._connection;
  return connection && connection !== Meteor.server;
}

module.exportDefault(isRemote);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"omit_undefined.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/omit_undefined.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isPlainObject;

module.watch(require("lodash/isPlainObject"), {
  "default": function (v) {
    _isPlainObject = v;
  }
}, 0);

var _transform;

module.watch(require("lodash/transform"), {
  "default": function (v) {
    _transform = v;
  }
}, 1);

function omitUndefined(obj) {
  return _transform(obj, function (result, value, key) {
    if (_isPlainObject(value)) {
      result[key] = omitUndefined(value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  });
}

module.exportDefault(omitUndefined);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"throw_if_selector_is_not_id.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/throw_if_selector_is_not_id.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var LocalCollection;
module.watch(require("meteor/minimongo"), {
  LocalCollection: function (v) {
    LocalCollection = v;
  }
}, 0);

function throwIfSelectorIsNotId(selector, methodName) {
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
    throw new Meteor.Error(403, "Not permitted. Untrusted code may only " + methodName + " documents by ID.");
  }
}

;
module.exportDefault(throwIfSelectorIsNotId);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transformToClass.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/transformToClass.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);
var config;
module.watch(require("../../../core/config"), {
  "default": function (v) {
    config = v;
  }
}, 1);
var wrapTransform;
module.watch(require("./wrapTransform"), {
  "default": function (v) {
    wrapTransform = v;
  }
}, 2);
var castToClass;
module.watch(require("../../fields/utils/castToClass"), {
  "default": function (v) {
    castToClass = v;
  }
}, 3);
var resolveValues;
module.watch(require("../../fields/utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 4);

function transformToClass() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Class = args.Class,
      _args$options = args.options,
      options = _args$options === void 0 ? {} : _args$options; // When fetching document from collection we don't want to clone raw document
  // and we want default values to be set.

  _defaults(options, {
    defaults: config.defaults,
    clone: false,
    cast: false
  });

  return function (rawDoc) {
    var doc = castToClass({
      Class: Class,
      rawDoc: rawDoc,
      options: options
    });
    return doc;
  };
}

;
module.exportDefault(transformToClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_after_insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_after_insert.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerAfterInsert(doc, trusted) {
  // Trigger the "afterInsert" event handlers.
  doc.dispatchEvent(new Event('afterInsert', {
    propagates: true,
    trusted: trusted
  }));
}

;
module.exportDefault(triggerAfterInsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_after_remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_after_remove.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerAfterRemove(doc, trusted) {
  // Trigger the "afterRemove" event handlers.
  doc.dispatchEvent(new Event('afterRemove', {
    propagates: true,
    trusted: trusted
  }));
}

;
module.exportDefault(triggerAfterRemove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_after_save.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_after_save.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerAfterSave(doc, trusted) {
  // Trigger the "afterSave" event handlers.
  doc.dispatchEvent(new Event('afterSave', {
    propagates: true,
    trusted: trusted
  }));
}

;
module.exportDefault(triggerAfterSave);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_after_update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_after_update.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerAfterUpdate(doc, trusted) {
  // Trigger the "afterUpdate" event handlers.
  doc.dispatchEvent(new Event('afterUpdate', {
    propagates: true,
    trusted: trusted
  }));
}

;
module.exportDefault(triggerAfterUpdate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_before_insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_before_insert.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerBeforeInsert(doc, trusted) {
  // Trigger the "beforeInsert" event handlers.
  if (!doc.dispatchEvent(new Event('beforeInsert', {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeInsert'
    });
  }
}

;
module.exportDefault(triggerBeforeInsert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_before_remove.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_before_remove.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerBeforeRemove(doc, trusted) {
  // Trigger the "beforeRemove" event handlers.
  if (!doc.dispatchEvent(new Event('beforeRemove', {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeRemove'
    });
  }
}

;
module.exportDefault(triggerBeforeRemove);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_before_save.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_before_save.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerBeforeSave(doc, trusted) {
  // Trigger the "beforeSave" event handlers.
  if (!doc.dispatchEvent(new Event('beforeSave', {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeSave'
    });
  }
}

;
module.exportDefault(triggerBeforeSave);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"trigger_before_update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/trigger_before_update.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Event;
module.watch(require("../../events/event.js"), {
  "default": function (v) {
    Event = v;
  }
}, 0);

function triggerBeforeUpdate(doc, trusted) {
  // Trigger the "beforeUpdate" event handlers.
  if (!doc.dispatchEvent(new Event('beforeUpdate', {
    cancelable: true,
    propagates: true,
    trusted: trusted
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeUpdate'
    });
  }
}

;
module.exportDefault(triggerBeforeUpdate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"wrapTransform.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/storage/utils/wrapTransform.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var resolveValues;
module.watch(require("../../fields/utils/resolveValues"), {
  "default": function (v) {
    resolveValues = v;
  }
}, 0);

function wrapTransform() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Class = args.Class,
      transform = args.transform;
  return function (rawDoc) {
    var resolvedValues = resolveValues({
      Class: Class,
      rawDoc: rawDoc
    });
    resolvedValues._isNew = false;
    return transform(resolvedValues);
  };
}

module.exportDefault(wrapTransform);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"validators":{"module.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/module.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var module1 = module;
var Module;
module1.watch(require("../../core/module.js"), {
  "default": function (v) {
    Module = v;
  }
}, 0);
module1.watch(require("./validators/comparison/choice.js"));
module1.watch(require("./validators/comparison/email.js"));
module1.watch(require("./validators/comparison/equal.js"));
module1.watch(require("./validators/comparison/not_equal.js"));
module1.watch(require("./validators/comparison/regexp.js"));
module1.watch(require("./validators/existence/null.js"));
module1.watch(require("./validators/existence/not_null.js"));
module1.watch(require("./validators/existence/required.js"));
module1.watch(require("./validators/logical/and.js"));
module1.watch(require("./validators/logical/or.js"));
module1.watch(require("./validators/nested/every.js"));
module1.watch(require("./validators/nested/has.js"));
module1.watch(require("./validators/nested/includes.js"));
module1.watch(require("./validators/size/gt.js"));
module1.watch(require("./validators/size/gte.js"));
module1.watch(require("./validators/size/length.js"));
module1.watch(require("./validators/size/lt.js"));
module1.watch(require("./validators/size/lte.js"));
module1.watch(require("./validators/size/max_length.js"));
module1.watch(require("./validators/size/min_length.js"));
module1.watch(require("./validators/type/array.js"));
module1.watch(require("./validators/type/boolean.js"));
module1.watch(require("./validators/type/class.js"));
module1.watch(require("./validators/type/date.js"));
module1.watch(require("./validators/type/integer.js"));
module1.watch(require("./validators/type/mongo_object_id.js"));
module1.watch(require("./validators/type/number.js"));
module1.watch(require("./validators/type/object.js"));
module1.watch(require("./validators/type/string.js"));
var documentValidate;
module1.watch(require("./utils/document_validate.js"), {
  "default": function (v) {
    documentValidate = v;
  }
}, 1);
var parseValidators;
module1.watch(require("./utils/parse_validators.js"), {
  "default": function (v) {
    parseValidators = v;
  }
}, 2);
var onInitSchema;
module1.watch(require("./hooks/init_schema.js"), {
  "default": function (v) {
    onInitSchema = v;
  }
}, 3);
var onInitDefinition;
module1.watch(require("./hooks/init_definition.js"), {
  "default": function (v) {
    onInitDefinition = v;
  }
}, 4);
var onParseDefinition;
module1.watch(require("./hooks/parse_definition.js"), {
  "default": function (v) {
    onParseDefinition = v;
  }
}, 5);
var onMergeDefinitions;
module1.watch(require("./hooks/merge_definitions.js"), {
  "default": function (v) {
    onMergeDefinitions = v;
  }
}, 6);
var onApplyDefinition;
module1.watch(require("./hooks/apply_definition.js"), {
  "default": function (v) {
    onApplyDefinition = v;
  }
}, 7);
var onInitClass;
module1.watch(require("./hooks/init_class.js"), {
  "default": function (v) {
    onInitClass = v;
  }
}, 8);
Module.create({
  name: 'validators',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  utils: {
    documentValidate: documentValidate,
    parseValidators: parseValidators
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validator.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validator.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var ValidationError;
module.watch(require("meteor/mdg:validation-error"), {
  ValidationError: function (v) {
    ValidationError = v;
  }
}, 0);
var Validators;
module.watch(require("./validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 1);

var Validator =
/*#__PURE__*/
function () {
  function Validator(definition) {
    this.name = definition.name;

    if (definition.parseParam) {
      this.parseParam = definition.parseParam;
    }

    if (definition.isValid) {
      this.isValid = definition.isValid;
    }

    if (definition.validate) {
      this.validate = definition.validate;
    }

    if (definition.resolveError) {
      this.resolveError = definition.resolveError;
    }
  }

  var _proto = Validator.prototype;

  _proto.validate = function () {
    function validate(_ref) {
      var _this = this;

      var doc = _ref.doc,
          name = _ref.name,
          nestedName = _ref.nestedName,
          value = _ref.value,
          param = _ref.param,
          resolveParam = _ref.resolveParam,
          message = _ref.message,
          resolveError = _ref.resolveError;
      // Get the class name, which will be used later for letting know what class
      // thrown error.
      var className = doc.constructor.getName(); // Resolve param is the "resolveParam" function is provided.

      if (Match.test(resolveParam, Function)) {
        param = resolveParam({
          doc: doc,
          name: name,
          nestedName: nestedName,
          value: value
        });
      } // Parse param type if validator has parsing function.


      if (Match.test(this.parseParam, Function)) {
        this.parseParam(param);
      } // Prepare data for validation.


      var args = {
        className: className,
        doc: doc,
        name: name,
        nestedName: nestedName,
        value: value,
        param: param,
        validator: this.name
      }; // Perform validation.

      if (!this.isValid(args)) {
        // Prepare function for throwing validation error.
        var throwError = function (message) {
          // Throw error only if the error message has been successfully
          // generated.
          if (!message) {
            return;
          } // Throw error.


          throw new ValidationError([{
            className: className,
            type: _this.name,
            name: name,
            nestedName: nestedName,
            value: value,
            param: param,
            message: message
          }], message);
        }; // Generate error message using the "resolveError" function if provided.


        if (Match.test(resolveError, Function)) {
          throwError(resolveError(args));
        } // Get error message from the string if provided.


        if (Match.test(message, String)) {
          throwError(message);
        } // Get error by executing a class level "resolveError" function.


        var Class = doc.constructor;
        var classResolveError = Class.getResolveError();

        if (classResolveError instanceof Function) {
          throwError(classResolveError(args));
        } // Get default error message.


        if (this.resolveError instanceof Function) {
          throwError(this.resolveError(args));
        }

        throwError(ValidationError.DEFAULT_REASON);
      }
    }

    return validate;
  }();

  Validator.create = function () {
    function create(definition) {
      var validator = new Validator(definition);
      Validator.validators[validator.name] = validator; // Create a validation function.

      return Validators[validator.name] = function (options) {
        validator.validate(options);
      };
    }

    return create;
  }();

  return Validator;
}();

;
Validator.validators = {};
module.exportDefault(Validator);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validators.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validators = {};
module.exportDefault(Validators);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class_prototype_methods":{"validate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_prototype_methods/validate.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _defaults;

module.watch(require("lodash/defaults"), {
  "default": function (v) {
    _defaults = v;
  }
}, 0);

var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 1);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 2);
var documentValidate;
module.watch(require("../utils/document_validate"), {
  "default": function (v) {
    documentValidate = v;
  }
}, 3);
var callMeteorMethod;
module.watch(require("../../storage/utils/call_meteor_method"), {
  "default": function (v) {
    callMeteorMethod = v;
  }
}, 4);

function validate() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  var doc = this;
  var Class = doc.constructor;
  var Collection = Class.getCollection();
  var connection = Collection && Collection._connection;

  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection;
  } // If the first argument is callback function then reassign values.


  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  } // Set default options.


  _defaults(options, {
    fields: Class.getValidationOrder(),
    modified: false,
    stopOnFirstError: true,
    simulation: true
  }); // If a fields property is a string then put it into array.


  if (Match.test(options.fields, String)) {
    options.fields = [options.fields];
  } // Cast all fields.


  if (options.cast) {
    _each(Class.getFields(), function (field) {
      doc[field.name] = field.castValue(doc[field.name], {
        clone: false,
        cast: true
      });
    });
  } // Cast only nested fields.
  else {
      castNested({
        doc: doc,
        options: {
          clone: false
        }
      });
    } // Prepare arguments for meteor method and utility.


  var methodArgs = {
    doc: doc,
    fields: options.fields,
    modified: options.modified,
    stopOnFirstError: options.stopOnFirstError,
    simulation: options.simulation
  }; // If we are dealing with a remote collection and we are not on the server.

  if (connection && connection !== Meteor.server) {
    // Prepare arguments for meteor method.
    var methodName = '/Astronomy/validate';

    try {
      // Run Meteor method.
      return callMeteorMethod(Class, methodName, [methodArgs], callback);
    } // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }

      throw err;
    }
  } // If we can just validate a document without calling the meteor method. We
  // may be on the server or the collection may be local.


  try {
    // Validate a document.
    var result = documentValidate(methodArgs);

    if (callback) {
      callback();
    }

    return result;
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }

    throw err;
  }
}

module.exportDefault(validate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validate_all.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_prototype_methods/validate_all.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extend;

module.watch(require("lodash/extend"), {
  "default": function (v) {
    _extend = v;
  }
}, 0);

function validateAll() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  var doc = this;
  var Class = doc.constructor; // If the first argument is callback function then reassign values.

  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  }

  _extend(options, {
    fields: Class.getValidationOrder(),
    stopOnFirstError: false
  });

  doc.validate(options, callback);
}

;
module.exportDefault(validateAll);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_static_methods":{"getCheckPattern.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/getCheckPattern.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Match;
module.watch(require("meteor/check"), {
  Match: function (v) {
    Match = v;
  }
}, 0);
var ValidationError;
module.watch(require("meteor/mdg:validation-error"), {
  ValidationError: function (v) {
    ValidationError = v;
  }
}, 1);

function getCheckPattern() {
  var Class = this;
  return Match.Where(function (doc) {
    try {
      doc.validate();
    } catch (err) {
      if (ValidationError.is(err)) {
        var firstError = err.details[0];
        var matchError = new Match.Error(firstError.message);
        matchError.sanitizedError = err;
        throw matchError;
      } else {
        throw err;
      }
    }

    return true;
  });
}

;
module.exportDefault(getCheckPattern);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_resolve_error.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/get_resolve_error.js                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getResolveError() {
  var Class = this;
  return Class.schema.resolveError;
}

;
module.exportDefault(getResolveError);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_validation_order.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/get_validation_order.js                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _difference;

module.watch(require("lodash/difference"), {
  "default": function (v) {
    _difference = v;
  }
}, 0);

function getValidationOrder() {
  var Class = this; // Get all validators.

  var validators = Class.getValidators(); // Get fields names for defined validators.

  var fieldsNames = Class.getFieldsNames(); // Make variable name shorter.

  var validationOrder = Class.schema.validationOrder; // If there is a validation order provided, then combine fields provided in
  // the validation order with the order of validators.

  if (validationOrder) {
    // Detect what fields are not present in the validation order.
    var diff = _difference(fieldsNames, validationOrder); // Combine validation order with fields that left.


    return validationOrder.concat(diff);
  } // If there is no validation order, then just return fields names in the order
  // in which validators were defined.
  else {
      return fieldsNames;
    }
}

;
module.exportDefault(getValidationOrder);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_validators.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/get_validators.js                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function getValidators(fieldName) {
  var Class = this;

  if (!Match.test(fieldName, Match.Optional(String))) {
    throw TypeError('The first argument of the "getValidators" function has to be a string ' + 'or left empty');
  }

  if (fieldName) {
    return Class.schema.validators[fieldName];
  } else {
    return Class.schema.validators;
  }
}

;
module.exportDefault(getValidators);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/validate.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _tail;

module.watch(require("lodash/tail"), {
  "default": function (v) {
    _tail = v;
  }
}, 0);

function validate(rawDoc) {
  var Class = this;
  var doc = new Class(rawDoc);

  var args = _tail(arguments);

  return doc.validate.apply(doc, args);
}

;
module.exportDefault(validate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validateAll.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/class_static_methods/validateAll.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _tail;

module.watch(require("lodash/tail"), {
  "default": function (v) {
    _tail = v;
  }
}, 0);

function validateAll(rawDoc) {
  var Class = this;
  var doc = new Class(rawDoc);

  var args = _tail(arguments);

  return doc.validateAll.apply(doc, args);
}

;
module.exportDefault(validateAll);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hooks":{"apply_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/apply_definition.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _zipObject;

module.watch(require("lodash/zipObject"), {
  "default": function (v) {
    _zipObject = v;
  }
}, 1);
var hasMeteorMethod;
module.watch(require("../../storage/utils/has_meteor_method.js"), {
  "default": function (v) {
    hasMeteorMethod = v;
  }
}, 2);
var meteorValidate;
module.watch(require("../meteor_methods/validate.js"), {
  "default": function (v) {
    meteorValidate = v;
  }
}, 3);

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition.validators, function (validators, fieldName) {
    Class.schema.validators[fieldName] = Class.schema.validators[fieldName] || [];

    _each(validators, function (validator) {
      Class.schema.validators[fieldName] = Class.schema.validators[fieldName].concat(validator);
    });
  }); // Add the "/Astronomy/validate" meteor method only when a class has assigned
  // collection.


  var Collection = Class.getCollection(); // If it's a remote collection then we register methods on the connection
  // object of the collection.

  var connection = Collection && Collection._connection; // If it's not a remote collection than use main Meteor connection.

  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  }

  if (connection) {
    // Prepare meteor methods to be added.
    var meteorMethods = {
      '/Astronomy/validate': meteorValidate
    };

    _each(meteorMethods, function (meteorMethod, methodName) {
      if (!hasMeteorMethod(connection, methodName)) {
        // Add meteor method.
        connection.methods(_zipObject([methodName], [meteorMethod]));
      }
    });
  }

  Class.schema.resolveError = parsedDefinition.resolveError;
}

;
module.exportDefault(onApplyDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/init_class.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getResolveError;
module.watch(require("../class_static_methods/get_resolve_error.js"), {
  "default": function (v) {
    getResolveError = v;
  }
}, 0);
var getValidationOrder;
module.watch(require("../class_static_methods/get_validation_order.js"), {
  "default": function (v) {
    getValidationOrder = v;
  }
}, 1);
var getValidators;
module.watch(require("../class_static_methods/get_validators.js"), {
  "default": function (v) {
    getValidators = v;
  }
}, 2);
var validateStatic;
module.watch(require("../class_static_methods/validate.js"), {
  "default": function (v) {
    validateStatic = v;
  }
}, 3);
var validateAllStatic;
module.watch(require("../class_static_methods/validateAll.js"), {
  "default": function (v) {
    validateAllStatic = v;
  }
}, 4);
var getCheckPatternStatic;
module.watch(require("../class_static_methods/getCheckPattern.js"), {
  "default": function (v) {
    getCheckPatternStatic = v;
  }
}, 5);
var validate;
module.watch(require("../class_prototype_methods/validate.js"), {
  "default": function (v) {
    validate = v;
  }
}, 6);
var validateAll;
module.watch(require("../class_prototype_methods/validate_all.js"), {
  "default": function (v) {
    validateAll = v;
  }
}, 7);

function onInitClass(Class, className) {
  // Class static methods.
  Class.getResolveError = getResolveError;
  Class.getValidationOrder = getValidationOrder;
  Class.getValidators = getValidators;
  Class.validate = validateStatic;
  Class.validateAll = validateAllStatic;
  Class.getCheckPattern = getCheckPatternStatic; // Class prototype methods.

  Class.prototype.validate = validate;
  Class.prototype.validateAll = validateAll;
}

;
module.exportDefault(onInitClass);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/init_definition.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitDefinition(definition, className) {
  definition.validators = {};
  definition.resolveError = undefined;
}

;
module.exportDefault(onInitDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init_schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/init_schema.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function onInitSchema(schema, className) {
  schema.validators = {};
  schema.resolveError = undefined;
}

;
module.exportDefault(onInitSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"merge_definitions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/merge_definitions.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.validators, function (validators, fieldName) {
    targetDefinition.validators[fieldName] = targetDefinition.validators[fieldName] || [];
    targetDefinition.validators[fieldName] = targetDefinition.validators[fieldName].concat(validators);
  });

  targetDefinition.resolveError = sourceDefinition.resolveError;
}

;
module.exportDefault(onMergeDefinitions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_definition.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/hooks/parse_definition.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 2);
var parseValidators;
module.watch(require("../utils/parse_validators.js"), {
  "default": function (v) {
    parseValidators = v;
  }
}, 3);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.resolveError) {
    if (!Match.test(definition.resolveError, Function)) {
      throwParseError([{
        'class': className
      }, {
        'property': 'resolveError'
      }, 'Property values has to be a function']);
    }

    parsedDefinition.resolveError = definition.resolveError;
  }

  if (definition.fields) {
    _each(definition.fields, function (fieldDefinition, fieldName) {
      if (_has(fieldDefinition, 'validators')) {
        parseValidators(fieldDefinition.validators, [{
          'class': className
        }, {
          'property': 'fields'
        }, {
          'field': fieldName
        }, {
          'property': 'validators'
        }]);
        parsedDefinition.validators[fieldName] = fieldDefinition.validators;
        fieldDefinition.validators = undefined;
      }
    });
  }

  if (definition.validators) {
    _each(definition.validators, function (validators, fieldName) {
      parseValidators(validators, [{
        'class': className
      }, {
        'property': 'validators'
      }]);
      parsedDefinition.validators[fieldName] = validators;
    });
  }
}

;
module.exportDefault(onParseDefinition);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meteor_methods":{"validate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/meteor_methods/validate.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var documentValidate;
module.watch(require("../utils/document_validate.js"), {
  "default": function (v) {
    documentValidate = v;
  }
}, 0);
var check, Match;
module.watch(require("meteor/check"), {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 1);

function validate(options) {
  check(options, Match.Any);
  return documentValidate(options);
}

;
module.exportDefault(validate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"utils":{"document_validate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/utils/document_validate.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _intersection;

module.watch(require("lodash/intersection"), {
  "default": function (v) {
    _intersection = v;
  }
}, 1);

var _isNil;

module.watch(require("lodash/isNil"), {
  "default": function (v) {
    _isNil = v;
  }
}, 2);
var AstroClass;
module.watch(require("../../../core/class"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 3);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 4);
var castNested;
module.watch(require("../../fields/utils/castNested"), {
  "default": function (v) {
    castNested = v;
  }
}, 5);
var isNestedFieldName;
module.watch(require("../../fields/utils/isNestedFieldName"), {
  "default": function (v) {
    isNestedFieldName = v;
  }
}, 6);
var traverse;
module.watch(require("../../fields/utils/traverse"), {
  "default": function (v) {
    traverse = v;
  }
}, 7);
var ObjectField;
module.watch(require("../../fields/ObjectField"), {
  "default": function (v) {
    ObjectField = v;
  }
}, 8);
var ListField;
module.watch(require("../../fields/ListField"), {
  "default": function (v) {
    ListField = v;
  }
}, 9);
var Validators;
module.watch(require("../validators"), {
  "default": function (v) {
    Validators = v;
  }
}, 10);
var ValidationError;
module.watch(require("meteor/mdg:validation-error"), {
  ValidationError: function (v) {
    ValidationError = v;
  }
}, 11);

function documentValidate() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doc = options.doc,
      fields = options.fields,
      _options$modified = options.modified,
      modified = _options$modified === void 0 ? false : _options$modified,
      _options$prefix = options.prefix,
      prefix = _options$prefix === void 0 ? '' : _options$prefix,
      _options$stopOnFirstE = options.stopOnFirstError,
      stopOnFirstError = _options$stopOnFirstE === void 0 ? true : _options$stopOnFirstE,
      _options$simulation = options.simulation,
      simulation = _options$simulation === void 0 ? true : _options$simulation; // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.

  if (!simulation && !Meteor.isServer) {
    return;
  }

  var Class = doc.constructor; // Cast nested fields.

  castNested({
    doc: doc,
    options: {
      clone: false
    }
  }); // Prepare array for storing errors list.

  var errors = []; // Helper function for catching and collecting errors.

  var catchValidationError = function (func) {
    try {
      func();
    } catch (err) {
      // If it's ValidationError.
      if (ValidationError.is(err)) {
        // If we stop on first error then just throw error again.
        if (stopOnFirstError) {
          throw err;
        } // Otherwise we collect errors.
        else {
            _each(err.details, function (details) {
              errors.push(details);
            });
          }
      } // It it's not ValidationError, then we throw error again.
      else {
          throw err;
        }
    }
  }; // If no fields were passed to validation, then we pick default validation
  // order.


  if (!fields) {
    fields = Class.getValidationOrder();
  } // Validate only modified fields.


  if (modified && Class.getCollection()) {
    fields = _intersection(fields, doc.getModified());
  }

  _each(fields, function (name) {
    // If it is a nested field pattern name then we have to look for the most
    // nested document and validate the nested field.
    if (isNestedFieldName(name)) {
      traverse(doc, name, function (nestedDoc, nestedName, field) {
        catchValidationError(function () {
          documentValidate({
            doc: nestedDoc,
            fields: [nestedName],
            prefix: prefix + name.substr(0, name.lastIndexOf(nestedName)),
            stopOnFirstError: stopOnFirstError,
            simulation: simulation
          });
        });
      });
      return;
    }

    var field = Class.getField(name); // Move to the next one if a field does not exist.

    if (!field) {
      return;
    } // We do not validate transient fields.


    if (field.transient) {
      return;
    } // Get value of the field.


    var value = doc.get(name); // If a field is optional and value is undefined then we do not validate.

    if (field.getOptional(doc) && _isNil(value)) {
      return;
    } // Execute validation in the try-catch block. That's because we want to
    // continue validation if the "stopOnFirstError" flag is set to false.


    catchValidationError(function () {
      // First, execute type level validators.
      field.validate({
        doc: doc,
        name: prefix + name,
        nestedName: name,
        value: value
      }); // Get validators for a given field.

      var validators = Class.getValidators(name);

      _each(validators, function (_ref) {
        var type = _ref.type,
            param = _ref.param,
            resolveParam = _ref.resolveParam,
            message = _ref.message,
            resolveError = _ref.resolveError;
        // Get validation helper function.
        var validationFunction = Validators[type]; // Execute single validator.

        validationFunction({
          doc: doc,
          name: prefix + name,
          nestedName: name,
          value: value,
          param: param,
          resolveParam: resolveParam,
          message: message,
          resolveError: resolveError
        });
      });
    }); // If it is the object field then validate it.

    if (field instanceof ObjectField) {
      if (value instanceof AstroClass) {
        catchValidationError(function () {
          documentValidate({
            doc: value,
            fields: value.constructor.getValidationOrder(),
            prefix: prefix + field.name + '.',
            stopOnFirstError: stopOnFirstError
          });
        });
      }
    } // If it is the list field then validate each one.
    else if (field instanceof ListField && field.isClass) {
        _each(value, function (element, index) {
          if (element instanceof AstroClass) {
            catchValidationError(function () {
              documentValidate({
                doc: element,
                fields: element.constructor.getValidationOrder(),
                prefix: prefix + field.name + '.' + index + '.',
                stopOnFirstError: stopOnFirstError
              });
            });
          }
        });
      }
  }); // If we have not thrown any error yet then it means that there are no errors
  // or we do not throw on the first error.


  if (errors.length > 0) {
    throw new ValidationError(errors, errors[0].message);
  }
}

;
module.exportDefault(documentValidate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_validators.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/utils/parse_validators.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);

var _union;

module.watch(require("lodash/union"), {
  "default": function (v) {
    _union = v;
  }
}, 2);
var throwParseError;
module.watch(require("../../core/utils/throw_parse_error.js"), {
  "default": function (v) {
    throwParseError = v;
  }
}, 3);
var Validators;
module.watch(require("../validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 4);
var validatorsPattern = [{
  type: String,
  param: Match.Optional(Match.Any),
  resolveParam: Match.Optional(Function),
  message: Match.Optional(String),
  resolveError: Match.Optional(Function)
}];

function parseValidators(validators, parseContext) {
  // Validators list is an array of object that should include at least the
  // "type" property.
  if (validators && !Match.test(validators, validatorsPattern)) {
    throwParseError(_union(parseContext, ['Validators definition has to be an array of objects']));
  }

  _each(validators, function (validator) {
    // Check if a validator of a given type exists.
    if (!_has(Validators, validator.type)) {
      throwParseError(_union(parseContext, ["There is no \"" + validator.type + "\" validator"]));
    }
  });
}

;
module.exportDefault(parseValidators);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"validators":{"comparison":{"choice.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/comparison/choice.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'choice',
  parseParam: function (param) {
    if (!Match.test(param, [Match.Any])) {
      throw new TypeError("Parameter for the \"choice\" validator has to be an array of values");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return _includes(param, value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    var choices = param.join(', ');
    return "\"" + name + "\" has to be one of the values " + choices;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"email.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/comparison/email.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
// The e-mail address regular expression from http://emailregex.com/.
var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
Validator.create({
  name: 'email',
  isValid: function (_ref) {
    var value = _ref.value;
    return re.test(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" should be a valid email address";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"equal.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/comparison/equal.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'equal',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return EJSON.equals(value, param);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" should be equal " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"not_equal.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/comparison/not_equal.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'notEqual',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return !EJSON.equals(value, param);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" should not to be equal " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"regexp.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/comparison/regexp.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'regexp',
  parseParam: function (param) {
    if (!Match.test(param, RegExp)) {
      throw new TypeError("Parameter for the \"regexp\" validator has to be a regular expression");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return param.test(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" does not match the \"" + param.toString() + "\" regular expression";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"existence":{"not_null.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/existence/not_null.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'notNull',
  isValid: function (_ref) {
    var value = _ref.value;
    return value !== null;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" should not be null";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"null.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/existence/null.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'null',
  isValid: function (_ref) {
    var value = _ref.value;
    return value === null;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" should be null";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"required.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/existence/required.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'required',
  isValid: function (_ref) {
    var value = _ref.value;
    return value !== null && value !== undefined;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" is required";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"logical":{"and.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/logical/and.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);
var parseValidators;
module.watch(require("../../utils/parse_validators.js"), {
  "default": function (v) {
    parseValidators = v;
  }
}, 1);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 2);
var Validators;
module.watch(require("../../validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 3);
Validator.create({
  name: 'and',
  parseParam: function (param) {
    parseValidators(param);
  },
  validate: function (_ref) {
    var doc = _ref.doc,
        name = _ref.name,
        value = _ref.value,
        validators = _ref.param;

    _each(validators, function (validator) {
      // Get validator.
      var validationFunction = Validators[validator.type]; // Execute single validator.

      validationFunction({
        doc: doc,
        name: name,
        value: value,
        param: validator.param
      });
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"or.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/logical/or.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _some;

module.watch(require("lodash/some"), {
  "default": function (v) {
    _some = v;
  }
}, 0);
var parseValidators;
module.watch(require("../../utils/parse_validators.js"), {
  "default": function (v) {
    parseValidators = v;
  }
}, 1);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 2);
var Validators;
module.watch(require("../../validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 3);
var ValidationError;
module.watch(require("meteor/mdg:validation-error"), {
  ValidationError: function (v) {
    ValidationError = v;
  }
}, 4);
Validator.create({
  name: 'or',
  parseParam: function (param) {
    parseValidators(param);
  },
  validate: function (_ref) {
    var doc = _ref.doc,
        name = _ref.name,
        value = _ref.value,
        validators = _ref.param;
    var firstError;

    var isValid = _some(validators, function (validator) {
      // Get validator.
      var validationFunction = Validators[validator.type]; // Execute single validator.

      try {
        validationFunction({
          doc: doc,
          name: name,
          value: value,
          param: validator.param
        });
        return true;
      } catch (err) {
        if (ValidationError.is(err)) {
          // Collect only the first error that occured.
          if (!firstError) {
            firstError = err;
          }

          return false;
        } else {
          throw err;
        }
      }
    });

    if (!isValid) {
      throw firstError;
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"nested":{"every.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/nested/every.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _each;

module.watch(require("lodash/each"), {
  "default": function (v) {
    _each = v;
  }
}, 0);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 1);
var parseValidators;
module.watch(require("../../utils/parse_validators.js"), {
  "default": function (v) {
    parseValidators = v;
  }
}, 2);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 3);
var Validators;
module.watch(require("../../validators.js"), {
  "default": function (v) {
    Validators = v;
  }
}, 4);
Validator.create({
  name: 'every',
  parseParam: function (param) {
    parseValidators(param);
  },
  validate: function (_ref) {
    var doc = _ref.doc,
        name = _ref.name,
        nestedName = _ref.nestedName,
        value = _ref.value,
        validators = _ref.param;

    if (!_isArray(value)) {
      throw new TypeError("The \"every\" validator can only work with arrays");
    } // Execute validators for each array element.


    _each(value, function (element, index) {
      // Execute each validator.
      _each(validators, function (validator) {
        // Get validator.
        var validationFunction = Validators[validator.type]; // Execute single validator.

        validationFunction({
          doc: doc,
          name: name + "." + index,
          nestedName: nestedName + "." + index,
          value: element,
          param: validator.param
        });
      });
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/nested/has.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);

var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 1);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 2);
Validator.create({
  name: 'has',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;

    if (!_isObject(value)) {
      throw new TypeError("The \"has\" validator can only work with objects");
    }

    return _has(value, param);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "The \"" + name + "\" field does not have the \"" + param + "\" property";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"includes.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/nested/includes.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _includes;

module.watch(require("lodash/includes"), {
  "default": function (v) {
    _includes = v;
  }
}, 0);

var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 1);

var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 2);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 3);
Validator.create({
  name: 'includes',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;

    if (!_isArray(value) && !_isObject(value)) {
      throw new TypeError("The \"includes\" validator can only work with arrays and objects");
    }

    return _includes(value, param);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "The \"" + name + "\" field does not contain the \"" + param + "\" value";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"size":{"gt.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/gt.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'gt',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return value > param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" has to be greater than " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"gte.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/gte.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'gte',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return value >= param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" has to be greater than or equal " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"length.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/length.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'length',
  parseParam: function (param) {
    if (!Match.test(param, Number)) {
      throw new TypeError("Parameter for the \"length\" validator has to be a number");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;

    if (!_has(value, 'length')) {
      throw new TypeError("Length of the value can not be measured");
    }

    return value.length === param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "Length of \"" + name + "\" has to be " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lt.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/lt.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'lt',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return value < param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" has to be less than " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lte.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/lte.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'lte',
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;
    return value <= param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "\"" + name + "\" has to be less than or equal " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"max_length.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/max_length.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'maxLength',
  parseParam: function (param) {
    if (!Match.test(param, Number)) {
      throw new TypeError("Parameter for the \"maxLength\" validator has to be a number");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;

    if (!_has(value, 'length')) {
      return false;
    }

    return value.length <= param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "Length of \"" + name + "\" has to be at most " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"min_length.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/size/min_length.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _has;

module.watch(require("lodash/has"), {
  "default": function (v) {
    _has = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'minLength',
  parseParam: function (param) {
    if (!Match.test(param, Number)) {
      throw new TypeError("Parameter for the \"minLength\" validator has to be a number");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        param = _ref.param;

    if (!_has(value, 'length')) {
      return false;
    }

    return value.length >= param;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        param = _ref2.param;
    return "Length of \"" + name + "\" has to be at least " + param;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"type":{"array.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/array.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isArray;

module.watch(require("lodash/isArray"), {
  "default": function (v) {
    _isArray = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'array',
  isValid: function (_ref) {
    var value = _ref.value;
    return _isArray(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be an array";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"boolean.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/boolean.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'boolean',
  isValid: function (_ref) {
    var value = _ref.value;
    return typeof value === 'boolean';
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be a boolean";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"class.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/class.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
var AstroClass;
module.watch(require("../../../../core/class.js"), {
  "default": function (v) {
    AstroClass = v;
  }
}, 1);
Validator.create({
  name: 'class',
  parseParam: function (param) {
    if (!AstroClass.isParentOf(param)) {
      throw new TypeError("Parameter for the \"class\" validator has to be an Astronomy class");
    }
  },
  isValid: function (_ref) {
    var value = _ref.value,
        Class = _ref.param;
    return value instanceof Class;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name,
        Class = _ref2.param;
    var className = Class.getName();
    return "\"" + name + "\" has to be " + className;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"date.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/date.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isDate;

module.watch(require("lodash/isDate"), {
  "default": function (v) {
    _isDate = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'date',
  isValid: function (_ref) {
    var value = _ref.value;
    return _isDate(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be a date";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"integer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/integer.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isInteger;

module.watch(require("lodash/isInteger"), {
  "default": function (v) {
    _isInteger = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'integer',
  isValid: function (_ref) {
    var value = _ref.value;
    return _isInteger(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be an integer";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mongo_object_id.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/mongo_object_id.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
var Match;
module.watch(require("meteor/check"), {
  Match: function (v) {
    Match = v;
  }
}, 1);
var Mongo;
module.watch(require("meteor/mongo"), {
  Mongo: function (v) {
    Mongo = v;
  }
}, 2);
Validator.create({
  name: 'mongoObjectID',
  isValid: function (_ref) {
    var value = _ref.value;
    return Match.test(value, Mongo.ObjectID);
    ;
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be a Mongo.ObjectID";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"number.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/number.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isNaN;

module.watch(require("lodash/isNaN"), {
  "default": function (v) {
    _isNaN = v;
  }
}, 0);

var _isNumber;

module.watch(require("lodash/isNumber"), {
  "default": function (v) {
    _isNumber = v;
  }
}, 1);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 2);
Validator.create({
  name: 'number',
  isValid: function (_ref) {
    var value = _ref.value;
    return !_isNaN(value) && _isNumber(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be a number";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/object.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _isObject;

module.watch(require("lodash/isObject"), {
  "default": function (v) {
    _isObject = v;
  }
}, 0);
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 1);
Validator.create({
  name: 'object',
  isValid: function (_ref) {
    var value = _ref.value;
    return _isObject(value);
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be an object";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"string.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jagi_astronomy/lib/modules/validators/validators/type/string.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Validator;
module.watch(require("../../validator.js"), {
  "default": function (v) {
    Validator = v;
  }
}, 0);
Validator.create({
  name: 'string',
  isValid: function (_ref) {
    var value = _ref.value;
    return typeof value === 'string';
  },
  resolveError: function (_ref2) {
    var name = _ref2.name;
    return "\"" + name + "\" has to be a string";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"node_modules":{"lodash":{"concat.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/concat.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayPush = require('./_arrayPush'),
    baseFlatten = require('./_baseFlatten'),
    copyArray = require('./_copyArray'),
    isArray = require('./isArray');

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}

module.exports = concat;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayPush.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayPush.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseFlatten.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseFlatten.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isFlattenable.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isFlattenable.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Symbol.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Symbol.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_root.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_root.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_freeGlobal.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_freeGlobal.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isArguments.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isArguments.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsArguments.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsArguments.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseGetTag.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseGetTag.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getRawTag.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getRawTag.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_objectToString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_objectToString.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isObjectLike.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isObjectLike.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isArray.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_copyArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_copyArray.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/defaults.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var apply = require('./_apply'),
    assignInWith = require('./assignInWith'),
    baseRest = require('./_baseRest'),
    customDefaultsAssignIn = require('./_customDefaultsAssignIn');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, customDefaultsAssignIn);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_apply.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_apply.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assignInWith.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/assignInWith.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_copyObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_copyObject.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_assignValue.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_assignValue.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseAssignValue.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseAssignValue.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_defineProperty.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_defineProperty.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getNative.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getNative.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsNative.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsNative.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isFunction.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isFunction.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isObject.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isMasked.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isMasked.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_coreJsData.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_coreJsData.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_toSource.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_toSource.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getValue.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getValue.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"eq.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/eq.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createAssigner.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createAssigner.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseRest.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseRest.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"identity.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/identity.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_overRest.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_overRest.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_setToString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_setToString.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseSetToString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseSetToString.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constant.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/constant.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_shortOut.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_shortOut.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isIterateeCall.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isIterateeCall.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isArrayLike.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isArrayLike.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isLength.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isLength.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isIndex.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isIndex.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"keysIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/keysIn.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayLikeKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayLikeKeys.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseTimes.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseTimes.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isBuffer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isBuffer.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stubFalse.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/stubFalse.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isTypedArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isTypedArray.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsTypedArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsTypedArray.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseUnary.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseUnary.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_nodeUtil.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_nodeUtil.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseKeysIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseKeysIn.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isPrototype.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isPrototype.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_nativeKeysIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_nativeKeysIn.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_customDefaultsAssignIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_customDefaultsAssignIn.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = customDefaultsAssignIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"each.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/each.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = require('./forEach');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"forEach.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/forEach.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayEach.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayEach.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseEach.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseEach.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseForOwn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseForOwn.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseFor.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseFor.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createBaseFor.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createBaseFor.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"keys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/keys.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseKeys.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_nativeKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_nativeKeys.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_overArg.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_overArg.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createBaseEach.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createBaseEach.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_castFunction.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_castFunction.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"has.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/has.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseHas.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hasPath.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hasPath.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_castPath.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_castPath.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isKey.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isKey.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isSymbol.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isSymbol.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stringToPath.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stringToPath.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_memoizeCapped.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_memoizeCapped.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"memoize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/memoize.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_MapCache.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_MapCache.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapCacheClear.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapCacheClear.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Hash.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Hash.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hashClear.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hashClear.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_nativeCreate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_nativeCreate.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hashDelete.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hashDelete.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hashGet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hashGet.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hashHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hashHas.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hashSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hashSet.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_ListCache.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_ListCache.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_listCacheClear.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_listCacheClear.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_listCacheDelete.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_listCacheDelete.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_assocIndexOf.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_assocIndexOf.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_listCacheGet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_listCacheGet.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_listCacheHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_listCacheHas.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_listCacheSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_listCacheSet.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Map.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Map.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapCacheDelete.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapCacheDelete.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getMapData.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getMapData.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isKeyable.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isKeyable.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapCacheGet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapCacheGet.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapCacheHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapCacheHas.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapCacheSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapCacheSet.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/toString.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseToString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseToString.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayMap.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_toKey.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_toKey.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"includes.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/includes.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIndexOf.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIndexOf.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN'),
    strictIndexOf = require('./_strictIndexOf');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseFindIndex.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseFindIndex.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsNaN.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsNaN.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_strictIndexOf.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_strictIndexOf.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isString.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isString.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toInteger.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/toInteger.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toFinite.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/toFinite.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toNumber.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/toNumber.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"values.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/values.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseValues.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseValues.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"intersection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/intersection.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    baseRest = require('./_baseRest'),
    castArrayLikeObject = require('./_castArrayLikeObject');

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIntersection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIntersection.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_SetCache.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_SetCache.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_setCacheAdd.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_setCacheAdd.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_setCacheHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_setCacheHas.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayIncludes.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayIncludes.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayIncludesWith.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayIncludesWith.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cacheHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cacheHas.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_castArrayLikeObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_castArrayLikeObject.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isArrayLikeObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isArrayLikeObject.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isNumber.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isNumber.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cloneDeepWith.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/cloneDeepWith.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.cloneWith` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the deep cloned value.
 * @see _.cloneWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * }
 *
 * var el = _.cloneDeepWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 20
 */
function cloneDeepWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
}

module.exports = cloneDeepWith;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseClone.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseClone.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Stack.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Stack.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stackClear.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stackClear.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stackDelete.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stackDelete.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stackGet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stackGet.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stackHas.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stackHas.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stackSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stackSet.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseAssign.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseAssign.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseAssignIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseAssignIn.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneBuffer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneBuffer.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_copySymbols.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_copySymbols.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getSymbols.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getSymbols.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayFilter.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayFilter.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stubArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/stubArray.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_copySymbolsIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_copySymbolsIn.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getSymbolsIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getSymbolsIn.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getPrototype.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getPrototype.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getAllKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getAllKeys.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseGetAllKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseGetAllKeys.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getAllKeysIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getAllKeysIn.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getTag.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getTag.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_DataView.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_DataView.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Promise.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Promise.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Set.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Set.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_WeakMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_WeakMap.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_initCloneArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_initCloneArray.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_initCloneByTag.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_initCloneByTag.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneArrayBuffer.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneArrayBuffer.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_Uint8Array.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_Uint8Array.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneDataView.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneDataView.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneMap.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_addMapEntry.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_addMapEntry.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayReduce.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayReduce.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_mapToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_mapToArray.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneRegExp.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneRegExp.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneSet.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_addSetEntry.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_addSetEntry.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_setToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_setToArray.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneSymbol.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneSymbol.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_cloneTypedArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_cloneTypedArray.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_initCloneObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_initCloneObject.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseCreate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseCreate.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isPlainObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isPlainObject.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extend.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/extend.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = require('./assignIn');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assignIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/assignIn.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */
var assignIn = createAssigner(function(object, source) {
  copyObject(source, keysIn(source), object);
});

module.exports = assignIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isNil.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isNil.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fromPairs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/fromPairs.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
function fromPairs(pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}

module.exports = fromPairs;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"map.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/map.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIteratee.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIteratee.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseMatches.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseMatches.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsMatch.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsMatch.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsEqual.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsEqual.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsEqualDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsEqualDeep.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_equalArrays.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_equalArrays.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arraySome.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arraySome.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_equalByTag.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_equalByTag.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_equalObjects.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_equalObjects.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_getMatchData.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_getMatchData.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_isStrictComparable.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_isStrictComparable.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_matchesStrictComparable.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_matchesStrictComparable.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseMatchesProperty.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseMatchesProperty.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/get.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseGet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseGet.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var castPath = require('./_castPath'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/hasIn.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseHasIn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseHasIn.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"property.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/property.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseProperty.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseProperty.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_basePropertyDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_basePropertyDeep.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseMap.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"find.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/find.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createFind.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createFind.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"findIndex.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/findIndex.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/toArray.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Symbol = require('./_Symbol'),
    copyArray = require('./_copyArray'),
    getTag = require('./_getTag'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    iteratorToArray = require('./_iteratorToArray'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray'),
    stringToArray = require('./_stringToArray'),
    values = require('./values');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Built-in value references. */
var symIterator = Symbol ? Symbol.iterator : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}

module.exports = toArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_iteratorToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_iteratorToArray.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stringToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stringToArray.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var asciiToArray = require('./_asciiToArray'),
    hasUnicode = require('./_hasUnicode'),
    unicodeToArray = require('./_unicodeToArray');

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_asciiToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_asciiToArray.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_hasUnicode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_hasUnicode.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_unicodeToArray.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_unicodeToArray.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"size.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/size.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseKeys = require('./_baseKeys'),
    getTag = require('./_getTag'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    stringSize = require('./_stringSize');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }
  var tag = getTag(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return baseKeys(collection).length;
}

module.exports = size;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_stringSize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_stringSize.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var asciiSize = require('./_asciiSize'),
    hasUnicode = require('./_hasUnicode'),
    unicodeSize = require('./_unicodeSize');

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

module.exports = stringSize;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_asciiSize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_asciiSize.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseProperty = require('./_baseProperty');

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = baseProperty('length');

module.exports = asciiSize;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_unicodeSize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_unicodeSize.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

module.exports = unicodeSize;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"difference.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/difference.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    baseRest = require('./_baseRest'),
    isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseDifference.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseDifference.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"forOwn.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/forOwn.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseForOwn = require('./_baseForOwn'),
    castFunction = require('./_castFunction');

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

module.exports = forOwn;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"omitBy.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/omitBy.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIteratee = require('./_baseIteratee'),
    negate = require('./negate'),
    pickBy = require('./pickBy');

/**
 * The opposite of `_.pickBy`; this method creates an object composed of
 * the own and inherited enumerable string keyed properties of `object` that
 * `predicate` doesn't return truthy for. The predicate is invoked with two
 * arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omitBy(object, _.isNumber);
 * // => { 'b': '2' }
 */
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}

module.exports = omitBy;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"negate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/negate.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

module.exports = negate;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"pickBy.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/pickBy.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    basePickBy = require('./_basePickBy'),
    getAllKeysIn = require('./_getAllKeysIn');

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}

module.exports = pickBy;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_basePickBy.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_basePickBy.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGet = require('./_baseGet'),
    baseSet = require('./_baseSet'),
    castPath = require('./_castPath');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseSet.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zipObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/zipObject.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var assignValue = require('./_assignValue'),
    baseZipObject = require('./_baseZipObject');

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

module.exports = zipObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseZipObject.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseZipObject.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

module.exports = baseZipObject;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mapKeys.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/mapKeys.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseAssignValue = require('./_baseAssignValue'),
    baseForOwn = require('./_baseForOwn'),
    baseIteratee = require('./_baseIteratee');

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

module.exports = mapKeys;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"omit.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/omit.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayMap = require('./_arrayMap'),
    baseClone = require('./_baseClone'),
    baseUnset = require('./_baseUnset'),
    castPath = require('./_castPath'),
    copyObject = require('./_copyObject'),
    customOmitClone = require('./_customOmitClone'),
    flatRest = require('./_flatRest'),
    getAllKeysIn = require('./_getAllKeysIn');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseUnset.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseUnset.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var castPath = require('./_castPath'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"last.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/last.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_parent.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_parent.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGet = require('./_baseGet'),
    baseSlice = require('./_baseSlice');

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseSlice.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseSlice.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_customOmitClone.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_customOmitClone.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isPlainObject = require('./isPlainObject');

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_flatRest.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_flatRest.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var flatten = require('./flatten'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"flatten.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/flatten.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"range.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/range.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var createRange = require('./_createRange');

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

module.exports = range;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createRange.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createRange.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseRange = require('./_baseRange'),
    isIterateeCall = require('./_isIterateeCall'),
    toFinite = require('./toFinite');

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

module.exports = createRange;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseRange.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseRange.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

module.exports = baseRange;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"noop.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/noop.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"union.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/union.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseFlatten = require('./_baseFlatten'),
    baseRest = require('./_baseRest'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseUniq.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseUniq.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_createSet.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_createSet.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transform.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/transform.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayEach = require('./_arrayEach'),
    baseCreate = require('./_baseCreate'),
    baseForOwn = require('./_baseForOwn'),
    baseIteratee = require('./_baseIteratee'),
    getPrototype = require('./_getPrototype'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray');

/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

  iteratee = baseIteratee(iteratee, 4);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

module.exports = transform;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isNull.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isNull.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"uniq.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/uniq.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseUniq = require('./_baseUniq');

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

module.exports = uniq;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"every.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/every.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayEvery = require('./_arrayEvery'),
    baseEvery = require('./_baseEvery'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * Iteration is stopped once `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * **Note:** This method returns `true` for
 * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
 * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
 * elements of empty collections.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.every(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.every(users, 'active');
 * // => false
 */
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = every;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_arrayEvery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_arrayEvery.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * A specialized version of `_.every` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 */
function arrayEvery(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

module.exports = arrayEvery;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseEvery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseEvery.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.every` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

module.exports = baseEvery;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isNaN.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isNaN.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"filter.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/filter.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseFilter.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseFilter.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"some.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/some.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var arraySome = require('./_arraySome'),
    baseIteratee = require('./_baseIteratee'),
    baseSome = require('./_baseSome'),
    isArray = require('./isArray'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = some;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseSome.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseSome.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  var result;

  baseEach(collection, function(value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

module.exports = baseSome;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isDate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isDate.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIsDate = require('./_baseIsDate'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsDate = nodeUtil && nodeUtil.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

module.exports = isDate;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"_baseIsDate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/_baseIsDate.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */
function baseIsDate(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag;
}

module.exports = baseIsDate;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isInteger.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/isInteger.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var toInteger = require('./toInteger');

/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}

module.exports = isInteger;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"tail.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/tail.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseSlice = require('./_baseSlice');

/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}

module.exports = tail;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"indexOf.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/indexOf.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseIndexOf = require('./_baseIndexOf'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

module.exports = indexOf;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"clone.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/jagi_astronomy/node_modules/lodash/clone.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/jagi:astronomy/lib/main.js");

/* Exports */
Package._define("jagi:astronomy", exports);

})();
