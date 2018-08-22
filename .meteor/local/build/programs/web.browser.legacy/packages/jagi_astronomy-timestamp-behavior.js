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
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"jagi:astronomy-timestamp-behavior":{"lib":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/jagi_astronomy-timestamp-behavior/lib/main.js             //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
module.watch(require("./behavior/behavior.js"));
////////////////////////////////////////////////////////////////////////

},"behavior":{"behavior.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/jagi_astronomy-timestamp-behavior/lib/behavior/behavior.j //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
var Behavior;
module.watch(require("meteor/jagi:astronomy"), {
  Behavior: function (v) {
    Behavior = v;
  }
}, 0);
Behavior.create({
  name: 'timestamp',
  options: {
    hasCreatedField: true,
    createdFieldName: 'createdAt',
    hasUpdatedField: true,
    updatedFieldName: 'updatedAt'
  },
  createClassDefinition: function () {
    var _this = this;

    var definition = {
      fields: {},
      events: {
        beforeInsert: function (e) {
          var doc = e.currentTarget;
          var Class = doc.constructor;

          _this.setCreationDate(doc);
        },
        beforeUpdate: function (e) {
          var doc = e.currentTarget;
          var Class = doc.constructor;

          _this.setModificationDate(doc);
        }
      }
    };

    if (this.options.hasCreatedField) {
      // Add a field for storing a creation date.
      definition.fields[this.options.createdFieldName] = {
        type: Date,
        immutable: true,
        optional: true
      };
    }

    if (this.options.hasUpdatedField) {
      // Add a field for storing an update date.
      definition.fields[this.options.updatedFieldName] = {
        type: Date,
        optional: true
      };
    }

    return definition;
  },
  apply: function (Class) {
    Class.extend(this.createClassDefinition(), ['fields', 'events']);
  },
  setCreationDate: function (doc) {
    // Get current date.
    var date = new Date(); // If the "hasCreatedField" option is set.

    if (this.options.hasCreatedField) {
      // Set value for created field.
      doc[this.options.createdFieldName] = date;
    }

    if (this.options.hasUpdatedField) {
      // Set value for the "updatedAt" field.
      doc[this.options.updatedFieldName] = date;
    }
  },
  setModificationDate: function (doc) {
    // Get current date.
    var date = new Date(); // If the "hasUpdatedField" option is set.

    if (this.options.hasUpdatedField) {
      // Set value for the "updatedAt" field.
      doc[this.options.updatedFieldName] = date;
    }
  }
});
////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/jagi:astronomy-timestamp-behavior/lib/main.js");

/* Exports */
Package._define("jagi:astronomy-timestamp-behavior", exports);

})();
