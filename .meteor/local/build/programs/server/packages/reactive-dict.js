(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var EJSON = Package.ejson.EJSON;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var value, ReactiveDict;

var require = meteorInstall({"node_modules":{"meteor":{"reactive-dict":{"migration.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/reactive-dict/migration.js                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
module.export({
  ReactiveDict: () => ReactiveDict
});
let ReactiveDict;
module.watch(require("./reactive-dict"), {
  ReactiveDict(v) {
    ReactiveDict = v;
  }

}, 0);
const hasOwn = Object.prototype.hasOwnProperty;
ReactiveDict._migratedDictData = {}; // name -> data

ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict

ReactiveDict._loadMigratedDict = function (dictName) {
  if (hasOwn.call(ReactiveDict._migratedDictData, dictName)) {
    const data = ReactiveDict._migratedDictData[dictName];
    delete ReactiveDict._migratedDictData[dictName];
    return data;
  }

  return null;
};

ReactiveDict._registerDictForMigrate = function (dictName, dict) {
  if (hasOwn.call(ReactiveDict._dictsToMigrate, dictName)) throw new Error("Duplicate ReactiveDict name: " + dictName);
  ReactiveDict._dictsToMigrate[dictName] = dict;
};

if (Meteor.isClient && Package.reload) {
  // Put old migrated data into ReactiveDict._migratedDictData,
  // where it can be accessed by ReactiveDict._loadMigratedDict.
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');

  if (migrationData && migrationData.dicts) ReactiveDict._migratedDictData = migrationData.dicts; // On migration, assemble the data from all the dicts that have been
  // registered.

  Package.reload.Reload._onMigrate('reactive-dict', function () {
    var dictsToMigrate = ReactiveDict._dictsToMigrate;
    var dataToMigrate = {};

    for (var dictName in dictsToMigrate) dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();

    return [true, {
      dicts: dataToMigrate
    }];
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reactive-dict.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/reactive-dict/reactive-dict.js                                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
module.export({
  ReactiveDict: () => ReactiveDict
});
const hasOwn = Object.prototype.hasOwnProperty; // XXX come up with a serialization method which canonicalizes object key
// order, which would allow us to use objects as values for equals.

function stringify(value) {
  if (value === undefined) {
    return 'undefined';
  }

  return EJSON.stringify(value);
}

function parse(serialized) {
  if (serialized === undefined || serialized === 'undefined') {
    return undefined;
  }

  return EJSON.parse(serialized);
}

function changed(v) {
  v && v.changed();
} // XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName


class ReactiveDict {
  constructor(dictName, dictData) {
    // this.keys: key -> value
    this.keys = {};

    if (dictName) {
      // name given; migration will be performed
      if (typeof dictName === 'string') {
        // the normal case, argument is a string name.
        // Only run migration logic on client, it will cause
        // duplicate name errors on server during reloads.
        // _registerDictForMigrate will throw an error on duplicate name.
        Meteor.isClient && ReactiveDict._registerDictForMigrate(dictName, this);

        const migratedData = Meteor.isClient && ReactiveDict._loadMigratedDict(dictName);

        if (migratedData) {
          // Don't stringify migrated data
          this.keys = migratedData;
        } else {
          // Use _setObject to make sure values are stringified
          this._setObject(dictData || {});
        }

        this.name = dictName;
      } else if (typeof dictName === 'object') {
        // back-compat case: dictName is actually migrationData
        // Use _setObject to make sure values are stringified
        this._setObject(dictName);
      } else {
        throw new Error("Invalid ReactiveDict argument: " + dictName);
      }
    } else if (typeof dictData === 'object') {
      this._setObject(dictData);
    }

    this.allDeps = new Tracker.Dependency();
    this.keyDeps = {}; // key -> Dependency

    this.keyValueDeps = {}; // key -> Dependency
  } // set() began as a key/value method, but we are now overloading it
  // to take an object of key/value pairs, similar to backbone
  // http://backbonejs.org/#Model-set


  set(keyOrObject, value) {
    if (typeof keyOrObject === 'object' && value === undefined) {
      // Called as `dict.set({...})`
      this._setObject(keyOrObject);

      return;
    } // the input isn't an object, so it must be a key
    // and we resume with the rest of the function


    const key = keyOrObject;
    value = stringify(value);
    const keyExisted = hasOwn.call(this.keys, key);
    const oldSerializedValue = keyExisted ? this.keys[key] : 'undefined';
    const isNewValue = value !== oldSerializedValue;
    this.keys[key] = value;

    if (isNewValue || !keyExisted) {
      // Using the changed utility function here because this.allDeps might not exist yet,
      // when setting initial data from constructor
      changed(this.allDeps);
    } // Don't trigger changes when setting initial data from constructor,
    // this.KeyDeps is undefined in this case


    if (isNewValue && this.keyDeps) {
      changed(this.keyDeps[key]);

      if (this.keyValueDeps[key]) {
        changed(this.keyValueDeps[key][oldSerializedValue]);
        changed(this.keyValueDeps[key][value]);
      }
    }
  }

  setDefault(keyOrObject, value) {
    if (typeof keyOrObject === 'object' && value === undefined) {
      // Called as `dict.setDefault({...})`
      this._setDefaultObject(keyOrObject);

      return;
    } // the input isn't an object, so it must be a key
    // and we resume with the rest of the function


    const key = keyOrObject;

    if (!hasOwn.call(this.keys, key)) {
      this.set(key, value);
    }
  }

  get(key) {
    this._ensureKey(key);

    this.keyDeps[key].depend();
    return parse(this.keys[key]);
  }

  equals(key, value) {
    // Mongo.ObjectID is in the 'mongo' package
    let ObjectID = null;

    if (Package.mongo) {
      ObjectID = Package.mongo.Mongo.ObjectID;
    } // We don't allow objects (or arrays that might include objects) for
    // .equals, because JSON.stringify doesn't canonicalize object key
    // order. (We can make equals have the right return value by parsing the
    // current value and using EJSON.equals, but we won't have a canonical
    // element of keyValueDeps[key] to store the dependency.) You can still use
    // "EJSON.equals(reactiveDict.get(key), value)".
    //
    // XXX we could allow arrays as long as we recursively check that there
    // are no objects


    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'undefined' && !(value instanceof Date) && !(ObjectID && value instanceof ObjectID) && value !== null) {
      throw new Error("ReactiveDict.equals: value must be scalar");
    }

    const serializedValue = stringify(value);

    if (Tracker.active) {
      this._ensureKey(key);

      if (!hasOwn.call(this.keyValueDeps[key], serializedValue)) {
        this.keyValueDeps[key][serializedValue] = new Tracker.Dependency();
      }

      var isNew = this.keyValueDeps[key][serializedValue].depend();

      if (isNew) {
        Tracker.onInvalidate(() => {
          // clean up [key][serializedValue] if it's now empty, so we don't
          // use O(n) memory for n = values seen ever
          if (!this.keyValueDeps[key][serializedValue].hasDependents()) {
            delete this.keyValueDeps[key][serializedValue];
          }
        });
      }
    }

    let oldValue = undefined;

    if (hasOwn.call(this.keys, key)) {
      oldValue = parse(this.keys[key]);
    }

    return EJSON.equals(oldValue, value);
  }

  all() {
    this.allDeps.depend();
    let ret = {};
    Object.keys(this.keys).forEach(key => {
      ret[key] = parse(this.keys[key]);
    });
    return ret;
  }

  clear() {
    const oldKeys = this.keys;
    this.keys = {};
    this.allDeps.changed();
    Object.keys(oldKeys).forEach(key => {
      changed(this.keyDeps[key]);

      if (this.keyValueDeps[key]) {
        changed(this.keyValueDeps[key][oldKeys[key]]);
        changed(this.keyValueDeps[key]['undefined']);
      }
    });
  }

  delete(key) {
    let didRemove = false;

    if (hasOwn.call(this.keys, key)) {
      const oldValue = this.keys[key];
      delete this.keys[key];
      changed(this.keyDeps[key]);

      if (this.keyValueDeps[key]) {
        changed(this.keyValueDeps[key][oldValue]);
        changed(this.keyValueDeps[key]['undefined']);
      }

      this.allDeps.changed();
      didRemove = true;
    }

    return didRemove;
  }

  destroy() {
    this.clear();

    if (this.name && hasOwn.call(ReactiveDict._dictsToMigrate, this.name)) {
      delete ReactiveDict._dictsToMigrate[this.name];
    }
  }

  _setObject(object) {
    Object.keys(object).forEach(key => {
      this.set(key, object[key]);
    });
  }

  _setDefaultObject(object) {
    Object.keys(object).forEach(key => {
      this.setDefault(key, object[key]);
    });
  }

  _ensureKey(key) {
    if (!(key in this.keyDeps)) {
      this.keyDeps[key] = new Tracker.Dependency();
      this.keyValueDeps[key] = {};
    }
  } // Get a JSON value that can be passed to the constructor to
  // create a new ReactiveDict with the same contents as this one


  _getMigrationData() {
    // XXX sanitize and make sure it's JSONible?
    return this.keys;
  }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/reactive-dict/migration.js");

/* Exports */
Package._define("reactive-dict", exports, {
  ReactiveDict: ReactiveDict
});

})();

//# sourceURL=meteor://💻app/packages/reactive-dict.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmVhY3RpdmUtZGljdC9taWdyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JlYWN0aXZlLWRpY3QvcmVhY3RpdmUtZGljdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJSZWFjdGl2ZURpY3QiLCJ3YXRjaCIsInJlcXVpcmUiLCJ2IiwiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJfbWlncmF0ZWREaWN0RGF0YSIsIl9kaWN0c1RvTWlncmF0ZSIsIl9sb2FkTWlncmF0ZWREaWN0IiwiZGljdE5hbWUiLCJjYWxsIiwiZGF0YSIsIl9yZWdpc3RlckRpY3RGb3JNaWdyYXRlIiwiZGljdCIsIkVycm9yIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJQYWNrYWdlIiwicmVsb2FkIiwibWlncmF0aW9uRGF0YSIsIlJlbG9hZCIsIl9taWdyYXRpb25EYXRhIiwiZGljdHMiLCJfb25NaWdyYXRlIiwiZGljdHNUb01pZ3JhdGUiLCJkYXRhVG9NaWdyYXRlIiwiX2dldE1pZ3JhdGlvbkRhdGEiLCJzdHJpbmdpZnkiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsIkVKU09OIiwicGFyc2UiLCJzZXJpYWxpemVkIiwiY2hhbmdlZCIsImNvbnN0cnVjdG9yIiwiZGljdERhdGEiLCJrZXlzIiwibWlncmF0ZWREYXRhIiwiX3NldE9iamVjdCIsIm5hbWUiLCJhbGxEZXBzIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJrZXlEZXBzIiwia2V5VmFsdWVEZXBzIiwic2V0Iiwia2V5T3JPYmplY3QiLCJrZXkiLCJrZXlFeGlzdGVkIiwib2xkU2VyaWFsaXplZFZhbHVlIiwiaXNOZXdWYWx1ZSIsInNldERlZmF1bHQiLCJfc2V0RGVmYXVsdE9iamVjdCIsImdldCIsIl9lbnN1cmVLZXkiLCJkZXBlbmQiLCJlcXVhbHMiLCJPYmplY3RJRCIsIm1vbmdvIiwiTW9uZ28iLCJEYXRlIiwic2VyaWFsaXplZFZhbHVlIiwiYWN0aXZlIiwiaXNOZXciLCJvbkludmFsaWRhdGUiLCJoYXNEZXBlbmRlbnRzIiwib2xkVmFsdWUiLCJhbGwiLCJyZXQiLCJmb3JFYWNoIiwiY2xlYXIiLCJvbGRLZXlzIiwiZGVsZXRlIiwiZGlkUmVtb3ZlIiwiZGVzdHJveSIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPQyxNQUFQLENBQWM7QUFBQ0MsZ0JBQWEsTUFBSUE7QUFBbEIsQ0FBZDtBQUErQyxJQUFJQSxZQUFKO0FBQWlCRixPQUFPRyxLQUFQLENBQWFDLFFBQVEsaUJBQVIsQ0FBYixFQUF3QztBQUFDRixlQUFhRyxDQUFiLEVBQWU7QUFBQ0gsbUJBQWFHLENBQWI7QUFBZTs7QUFBaEMsQ0FBeEMsRUFBMEUsQ0FBMUU7QUFFaEUsTUFBTUMsU0FBU0MsT0FBT0MsU0FBUCxDQUFpQkMsY0FBaEM7QUFFQVAsYUFBYVEsaUJBQWIsR0FBaUMsRUFBakMsQyxDQUFxQzs7QUFDckNSLGFBQWFTLGVBQWIsR0FBK0IsRUFBL0IsQyxDQUFtQzs7QUFFbkNULGFBQWFVLGlCQUFiLEdBQWlDLFVBQVVDLFFBQVYsRUFBb0I7QUFDbkQsTUFBSVAsT0FBT1EsSUFBUCxDQUFZWixhQUFhUSxpQkFBekIsRUFBNENHLFFBQTVDLENBQUosRUFBMkQ7QUFDekQsVUFBTUUsT0FBT2IsYUFBYVEsaUJBQWIsQ0FBK0JHLFFBQS9CLENBQWI7QUFDQSxXQUFPWCxhQUFhUSxpQkFBYixDQUErQkcsUUFBL0IsQ0FBUDtBQUNBLFdBQU9FLElBQVA7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQVJEOztBQVVBYixhQUFhYyx1QkFBYixHQUF1QyxVQUFVSCxRQUFWLEVBQW9CSSxJQUFwQixFQUEwQjtBQUMvRCxNQUFJWCxPQUFPUSxJQUFQLENBQVlaLGFBQWFTLGVBQXpCLEVBQTBDRSxRQUExQyxDQUFKLEVBQ0UsTUFBTSxJQUFJSyxLQUFKLENBQVUsa0NBQWtDTCxRQUE1QyxD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RCxXQUFPQSxTQUFQO0FBQ0Q7O0FBRURDLFlBQVU7QUFDUixTQUFLSixLQUFMOztBQUNBLFFBQUksS0FBSy9CLElBQUwsSUFBYXJDLE9BQU9RLElBQVAsQ0FBWVosYUFBYVMsZUFBekIsRUFBMEMsS0FBS2dDLElBQS9DLENBQWpCLEVBQXVFO0FBQ3JFLGFBQU96QyxhQUFhUyxlQUFiLENBQTZCLEtBQUtnQyxJQUFsQyxDQUFQO0FBQ0Q7QUFDRjs7QUFFREQsYUFBV3FDLE1BQVgsRUFBbUI7QUFDakJ4RSxXQUFPaUMsSUFBUCxDQUFZdUMsTUFBWixFQUFvQk4sT0FBcEIsQ0FBNEJ0QixPQUFPO0FBQ2pDLFdBQUtGLEdBQUwsQ0FBU0UsR0FBVCxFQUFjNEIsT0FBTzVCLEdBQVAsQ0FBZDtBQUNELEtBRkQ7QUFHRDs7QUFFREssb0JBQWtCdUIsTUFBbEIsRUFBMEI7QUFDeEJ4RSxXQUFPaUMsSUFBUCxDQUFZdUMsTUFBWixFQUFvQk4sT0FBcEIsQ0FBNEJ0QixPQUFPO0FBQ2pDLFdBQUtJLFVBQUwsQ0FBZ0JKLEdBQWhCLEVBQXFCNEIsT0FBTzVCLEdBQVAsQ0FBckI7QUFDRCxLQUZEO0FBR0Q7O0FBRURPLGFBQVdQLEdBQVgsRUFBZ0I7QUFDZCxRQUFJLEVBQUVBLE9BQU8sS0FBS0osT0FBZCxDQUFKLEVBQTRCO0FBQzFCLFdBQUtBLE9BQUwsQ0FBYUksR0FBYixJQUFvQixJQUFJTixRQUFRQyxVQUFaLEVBQXBCO0FBQ0EsV0FBS0UsWUFBTCxDQUFrQkcsR0FBbEIsSUFBeUIsRUFBekI7QUFDRDtBQUNGLEdBeE51QixDQTBOeEI7QUFDQTs7O0FBQ0FyQixzQkFBb0I7QUFDbEI7QUFDQSxXQUFPLEtBQUtVLElBQVo7QUFDRDs7QUEvTnVCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3JlYWN0aXZlLWRpY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZWFjdGl2ZURpY3QgfSBmcm9tICcuL3JlYWN0aXZlLWRpY3QnO1xuXG5jb25zdCBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5SZWFjdGl2ZURpY3QuX21pZ3JhdGVkRGljdERhdGEgPSB7fTsgLy8gbmFtZSAtPiBkYXRhXG5SZWFjdGl2ZURpY3QuX2RpY3RzVG9NaWdyYXRlID0ge307IC8vIG5hbWUgLT4gUmVhY3RpdmVEaWN0XG5cblJlYWN0aXZlRGljdC5fbG9hZE1pZ3JhdGVkRGljdCA9IGZ1bmN0aW9uIChkaWN0TmFtZSkge1xuICBpZiAoaGFzT3duLmNhbGwoUmVhY3RpdmVEaWN0Ll9taWdyYXRlZERpY3REYXRhLCBkaWN0TmFtZSkpIHtcbiAgICBjb25zdCBkYXRhID0gUmVhY3RpdmVEaWN0Ll9taWdyYXRlZERpY3REYXRhW2RpY3ROYW1lXTtcbiAgICBkZWxldGUgUmVhY3RpdmVEaWN0Ll9taWdyYXRlZERpY3REYXRhW2RpY3ROYW1lXTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuUmVhY3RpdmVEaWN0Ll9yZWdpc3RlckRpY3RGb3JNaWdyYXRlID0gZnVuY3Rpb24gKGRpY3ROYW1lLCBkaWN0KSB7XG4gIGlmIChoYXNPd24uY2FsbChSZWFjdGl2ZURpY3QuX2RpY3RzVG9NaWdyYXRlLCBkaWN0TmFtZSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIFJlYWN0aXZlRGljdCBuYW1lOiBcIiArIGRpY3ROYW1lKTtcblxuICBSZWFjdGl2ZURpY3QuX2RpY3RzVG9NaWdyYXRlW2RpY3ROYW1lXSA9IGRpY3Q7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIFBhY2thZ2UucmVsb2FkKSB7XG4gIC8vIFB1dCBvbGQgbWlncmF0ZWQgZGF0YSBpbnRvIFJlYWN0aXZlRGljdC5fbWlncmF0ZWREaWN0RGF0YSxcbiAgLy8gd2hlcmUgaXQgY2FuIGJlIGFjY2Vzc2VkIGJ5IFJlYWN0aXZlRGljdC5fbG9hZE1pZ3JhdGVkRGljdC5cbiAgdmFyIG1pZ3JhdGlvbkRhdGEgPSBQYWNrYWdlLnJlbG9hZC5SZWxvYWQuX21pZ3JhdGlvbkRhdGEoJ3JlYWN0aXZlLWRpY3QnKTtcbiAgaWYgKG1pZ3JhdGlvbkRhdGEgJiYgbWlncmF0aW9uRGF0YS5kaWN0cylcbiAgICBSZWFjdGl2ZURpY3QuX21pZ3JhdGVkRGljdERhdGEgPSBtaWdyYXRpb25EYXRhLmRpY3RzO1xuXG4gIC8vIE9uIG1pZ3JhdGlvbiwgYXNzZW1ibGUgdGhlIGRhdGEgZnJvbSBhbGwgdGhlIGRpY3RzIHRoYXQgaGF2ZSBiZWVuXG4gIC8vIHJlZ2lzdGVyZWQuXG4gIFBhY2thZ2UucmVsb2FkLlJlbG9hZC5fb25NaWdyYXRlKCdyZWFjdGl2ZS1kaWN0JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWN0c1RvTWlncmF0ZSA9IFJlYWN0aXZlRGljdC5fZGljdHNUb01pZ3JhdGU7XG4gICAgdmFyIGRhdGFUb01pZ3JhdGUgPSB7fTtcblxuICAgIGZvciAodmFyIGRpY3ROYW1lIGluIGRpY3RzVG9NaWdyYXRlKVxuICAgICAgZGF0YVRvTWlncmF0ZVtkaWN0TmFtZV0gPSBkaWN0c1RvTWlncmF0ZVtkaWN0TmFtZV0uX2dldE1pZ3JhdGlvbkRhdGEoKTtcblxuICAgIHJldHVybiBbdHJ1ZSwge2RpY3RzOiBkYXRhVG9NaWdyYXRlfV07XG4gIH0pO1xufVxuXG5leHBvcnQgeyBSZWFjdGl2ZURpY3QgfTtcbiIsImNvbnN0IGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIFhYWCBjb21lIHVwIHdpdGggYSBzZXJpYWxpemF0aW9uIG1ldGhvZCB3aGljaCBjYW5vbmljYWxpemVzIG9iamVjdCBrZXlcbi8vIG9yZGVyLCB3aGljaCB3b3VsZCBhbGxvdyB1cyB0byB1c2Ugb2JqZWN0cyBhcyB2YWx1ZXMgZm9yIGVxdWFscy5cbmZ1bmN0aW9uIHN0cmluZ2lmeSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgfVxuICByZXR1cm4gRUpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcGFyc2Uoc2VyaWFsaXplZCkge1xuICBpZiAoc2VyaWFsaXplZCA9PT0gdW5kZWZpbmVkIHx8IHNlcmlhbGl6ZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gRUpTT04ucGFyc2Uoc2VyaWFsaXplZCk7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZWQodikge1xuICB2ICYmIHYuY2hhbmdlZCgpO1xufVxuXG4vLyBYWFggQ09NUEFUIFdJVEggMC45LjEgOiBhY2NlcHQgbWlncmF0aW9uRGF0YSBpbnN0ZWFkIG9mIGRpY3ROYW1lXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVEaWN0IHtcbiAgY29uc3RydWN0b3IoZGljdE5hbWUsIGRpY3REYXRhKSB7XG4gICAgLy8gdGhpcy5rZXlzOiBrZXkgLT4gdmFsdWVcbiAgICB0aGlzLmtleXMgPSB7fTtcblxuICAgIGlmIChkaWN0TmFtZSkge1xuICAgICAgLy8gbmFtZSBnaXZlbjsgbWlncmF0aW9uIHdpbGwgYmUgcGVyZm9ybWVkXG4gICAgICBpZiAodHlwZW9mIGRpY3ROYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyB0aGUgbm9ybWFsIGNhc2UsIGFyZ3VtZW50IGlzIGEgc3RyaW5nIG5hbWUuXG5cbiAgICAgICAgLy8gT25seSBydW4gbWlncmF0aW9uIGxvZ2ljIG9uIGNsaWVudCwgaXQgd2lsbCBjYXVzZVxuICAgICAgICAvLyBkdXBsaWNhdGUgbmFtZSBlcnJvcnMgb24gc2VydmVyIGR1cmluZyByZWxvYWRzLlxuICAgICAgICAvLyBfcmVnaXN0ZXJEaWN0Rm9yTWlncmF0ZSB3aWxsIHRocm93IGFuIGVycm9yIG9uIGR1cGxpY2F0ZSBuYW1lLlxuICAgICAgICBNZXRlb3IuaXNDbGllbnQgJiYgUmVhY3RpdmVEaWN0Ll9yZWdpc3RlckRpY3RGb3JNaWdyYXRlKGRpY3ROYW1lLCB0aGlzKTtcbiAgICAgICAgY29uc3QgbWlncmF0ZWREYXRhID0gTWV0ZW9yLmlzQ2xpZW50ICYmIFJlYWN0aXZlRGljdC5fbG9hZE1pZ3JhdGVkRGljdChkaWN0TmFtZSk7XG5cbiAgICAgICAgaWYgKG1pZ3JhdGVkRGF0YSkge1xuICAgICAgICAgIC8vIERvbid0IHN0cmluZ2lmeSBtaWdyYXRlZCBkYXRhXG4gICAgICAgICAgdGhpcy5rZXlzID0gbWlncmF0ZWREYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFVzZSBfc2V0T2JqZWN0IHRvIG1ha2Ugc3VyZSB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkXG4gICAgICAgICAgdGhpcy5fc2V0T2JqZWN0KGRpY3REYXRhIHx8IHt9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5hbWUgPSBkaWN0TmFtZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRpY3ROYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBiYWNrLWNvbXBhdCBjYXNlOiBkaWN0TmFtZSBpcyBhY3R1YWxseSBtaWdyYXRpb25EYXRhXG4gICAgICAgIC8vIFVzZSBfc2V0T2JqZWN0IHRvIG1ha2Ugc3VyZSB2YWx1ZXMgYXJlIHN0cmluZ2lmaWVkXG4gICAgICAgIHRoaXMuX3NldE9iamVjdChkaWN0TmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFJlYWN0aXZlRGljdCBhcmd1bWVudDogXCIgKyBkaWN0TmFtZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGljdERhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLl9zZXRPYmplY3QoZGljdERhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuYWxsRGVwcyA9IG5ldyBUcmFja2VyLkRlcGVuZGVuY3k7XG4gICAgdGhpcy5rZXlEZXBzID0ge307IC8vIGtleSAtPiBEZXBlbmRlbmN5XG4gICAgdGhpcy5rZXlWYWx1ZURlcHMgPSB7fTsgLy8ga2V5IC0+IERlcGVuZGVuY3lcbiAgfVxuXG4gIC8vIHNldCgpIGJlZ2FuIGFzIGEga2V5L3ZhbHVlIG1ldGhvZCwgYnV0IHdlIGFyZSBub3cgb3ZlcmxvYWRpbmcgaXRcbiAgLy8gdG8gdGFrZSBhbiBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzLCBzaW1pbGFyIHRvIGJhY2tib25lXG4gIC8vIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZy8jTW9kZWwtc2V0XG4gIHNldChrZXlPck9iamVjdCwgdmFsdWUpIHtcbiAgICBpZiAoKHR5cGVvZiBrZXlPck9iamVjdCA9PT0gJ29iamVjdCcpICYmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgLy8gQ2FsbGVkIGFzIGBkaWN0LnNldCh7Li4ufSlgXG4gICAgICB0aGlzLl9zZXRPYmplY3Qoa2V5T3JPYmplY3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyB0aGUgaW5wdXQgaXNuJ3QgYW4gb2JqZWN0LCBzbyBpdCBtdXN0IGJlIGEga2V5XG4gICAgLy8gYW5kIHdlIHJlc3VtZSB3aXRoIHRoZSByZXN0IG9mIHRoZSBmdW5jdGlvblxuICAgIGNvbnN0IGtleSA9IGtleU9yT2JqZWN0O1xuXG4gICAgdmFsdWUgPSBzdHJpbmdpZnkodmFsdWUpO1xuXG4gICAgY29uc3Qga2V5RXhpc3RlZCA9IGhhc093bi5jYWxsKHRoaXMua2V5cywga2V5KTtcbiAgICBjb25zdCBvbGRTZXJpYWxpemVkVmFsdWUgPSBrZXlFeGlzdGVkID8gdGhpcy5rZXlzW2tleV0gOiAndW5kZWZpbmVkJztcbiAgICBjb25zdCBpc05ld1ZhbHVlID0gKHZhbHVlICE9PSBvbGRTZXJpYWxpemVkVmFsdWUpO1xuXG4gICAgdGhpcy5rZXlzW2tleV0gPSB2YWx1ZTtcblxuICAgIGlmIChpc05ld1ZhbHVlIHx8ICFrZXlFeGlzdGVkKSB7XG4gICAgICAvLyBVc2luZyB0aGUgY2hhbmdlZCB1dGlsaXR5IGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB0aGlzLmFsbERlcHMgbWlnaHQgbm90IGV4aXN0IHlldCxcbiAgICAgIC8vIHdoZW4gc2V0dGluZyBpbml0aWFsIGRhdGEgZnJvbSBjb25zdHJ1Y3RvclxuICAgICAgY2hhbmdlZCh0aGlzLmFsbERlcHMpO1xuICAgIH1cblxuICAgIC8vIERvbid0IHRyaWdnZXIgY2hhbmdlcyB3aGVuIHNldHRpbmcgaW5pdGlhbCBkYXRhIGZyb20gY29uc3RydWN0b3IsXG4gICAgLy8gdGhpcy5LZXlEZXBzIGlzIHVuZGVmaW5lZCBpbiB0aGlzIGNhc2VcbiAgICBpZiAoaXNOZXdWYWx1ZSAmJiB0aGlzLmtleURlcHMpIHtcbiAgICAgIGNoYW5nZWQodGhpcy5rZXlEZXBzW2tleV0pO1xuICAgICAgaWYgKHRoaXMua2V5VmFsdWVEZXBzW2tleV0pIHtcbiAgICAgICAgY2hhbmdlZCh0aGlzLmtleVZhbHVlRGVwc1trZXldW29sZFNlcmlhbGl6ZWRWYWx1ZV0pO1xuICAgICAgICBjaGFuZ2VkKHRoaXMua2V5VmFsdWVEZXBzW2tleV1bdmFsdWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXREZWZhdWx0KGtleU9yT2JqZWN0LCB2YWx1ZSkge1xuICAgIGlmICgodHlwZW9mIGtleU9yT2JqZWN0ID09PSAnb2JqZWN0JykgJiYgKHZhbHVlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAvLyBDYWxsZWQgYXMgYGRpY3Quc2V0RGVmYXVsdCh7Li4ufSlgXG4gICAgICB0aGlzLl9zZXREZWZhdWx0T2JqZWN0KGtleU9yT2JqZWN0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gdGhlIGlucHV0IGlzbid0IGFuIG9iamVjdCwgc28gaXQgbXVzdCBiZSBhIGtleVxuICAgIC8vIGFuZCB3ZSByZXN1bWUgd2l0aCB0aGUgcmVzdCBvZiB0aGUgZnVuY3Rpb25cbiAgICBjb25zdCBrZXkgPSBrZXlPck9iamVjdDtcblxuICAgIGlmICghIGhhc093bi5jYWxsKHRoaXMua2V5cywga2V5KSkge1xuICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0KGtleSkge1xuICAgIHRoaXMuX2Vuc3VyZUtleShrZXkpO1xuICAgIHRoaXMua2V5RGVwc1trZXldLmRlcGVuZCgpO1xuICAgIHJldHVybiBwYXJzZSh0aGlzLmtleXNba2V5XSk7XG4gIH1cblxuICBlcXVhbHMoa2V5LCB2YWx1ZSkge1xuICAgIC8vIE1vbmdvLk9iamVjdElEIGlzIGluIHRoZSAnbW9uZ28nIHBhY2thZ2VcbiAgICBsZXQgT2JqZWN0SUQgPSBudWxsO1xuICAgIGlmIChQYWNrYWdlLm1vbmdvKSB7XG4gICAgICBPYmplY3RJRCA9IFBhY2thZ2UubW9uZ28uTW9uZ28uT2JqZWN0SUQ7XG4gICAgfVxuICAgIC8vIFdlIGRvbid0IGFsbG93IG9iamVjdHMgKG9yIGFycmF5cyB0aGF0IG1pZ2h0IGluY2x1ZGUgb2JqZWN0cykgZm9yXG4gICAgLy8gLmVxdWFscywgYmVjYXVzZSBKU09OLnN0cmluZ2lmeSBkb2Vzbid0IGNhbm9uaWNhbGl6ZSBvYmplY3Qga2V5XG4gICAgLy8gb3JkZXIuIChXZSBjYW4gbWFrZSBlcXVhbHMgaGF2ZSB0aGUgcmlnaHQgcmV0dXJuIHZhbHVlIGJ5IHBhcnNpbmcgdGhlXG4gICAgLy8gY3VycmVudCB2YWx1ZSBhbmQgdXNpbmcgRUpTT04uZXF1YWxzLCBidXQgd2Ugd29uJ3QgaGF2ZSBhIGNhbm9uaWNhbFxuICAgIC8vIGVsZW1lbnQgb2Yga2V5VmFsdWVEZXBzW2tleV0gdG8gc3RvcmUgdGhlIGRlcGVuZGVuY3kuKSBZb3UgY2FuIHN0aWxsIHVzZVxuICAgIC8vIFwiRUpTT04uZXF1YWxzKHJlYWN0aXZlRGljdC5nZXQoa2V5KSwgdmFsdWUpXCIuXG4gICAgLy9cbiAgICAvLyBYWFggd2UgY291bGQgYWxsb3cgYXJyYXlzIGFzIGxvbmcgYXMgd2UgcmVjdXJzaXZlbHkgY2hlY2sgdGhhdCB0aGVyZVxuICAgIC8vIGFyZSBubyBvYmplY3RzXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJyAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICEodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSAmJlxuICAgICAgICAhKE9iamVjdElEICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0SUQpICYmXG4gICAgICAgIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFjdGl2ZURpY3QuZXF1YWxzOiB2YWx1ZSBtdXN0IGJlIHNjYWxhclwiKTtcbiAgICB9XG4gICAgY29uc3Qgc2VyaWFsaXplZFZhbHVlID0gc3RyaW5naWZ5KHZhbHVlKTtcblxuICAgIGlmIChUcmFja2VyLmFjdGl2ZSkge1xuICAgICAgdGhpcy5fZW5zdXJlS2V5KGtleSk7XG5cbiAgICAgIGlmICghIGhhc093bi5jYWxsKHRoaXMua2V5VmFsdWVEZXBzW2tleV0sIHNlcmlhbGl6ZWRWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5rZXlWYWx1ZURlcHNba2V5XVtzZXJpYWxpemVkVmFsdWVdID0gbmV3IFRyYWNrZXIuRGVwZW5kZW5jeTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzTmV3ID0gdGhpcy5rZXlWYWx1ZURlcHNba2V5XVtzZXJpYWxpemVkVmFsdWVdLmRlcGVuZCgpO1xuICAgICAgaWYgKGlzTmV3KSB7XG4gICAgICAgIFRyYWNrZXIub25JbnZhbGlkYXRlKCgpID0+IHtcbiAgICAgICAgICAvLyBjbGVhbiB1cCBba2V5XVtzZXJpYWxpemVkVmFsdWVdIGlmIGl0J3Mgbm93IGVtcHR5LCBzbyB3ZSBkb24ndFxuICAgICAgICAgIC8vIHVzZSBPKG4pIG1lbW9yeSBmb3IgbiA9IHZhbHVlcyBzZWVuIGV2ZXJcbiAgICAgICAgICBpZiAoISB0aGlzLmtleVZhbHVlRGVwc1trZXldW3NlcmlhbGl6ZWRWYWx1ZV0uaGFzRGVwZW5kZW50cygpKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5rZXlWYWx1ZURlcHNba2V5XVtzZXJpYWxpemVkVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG9sZFZhbHVlID0gdW5kZWZpbmVkO1xuICAgIGlmIChoYXNPd24uY2FsbCh0aGlzLmtleXMsIGtleSkpIHtcbiAgICAgIG9sZFZhbHVlID0gcGFyc2UodGhpcy5rZXlzW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gRUpTT04uZXF1YWxzKG9sZFZhbHVlLCB2YWx1ZSk7XG4gIH1cblxuICBhbGwoKSB7XG4gICAgdGhpcy5hbGxEZXBzLmRlcGVuZCgpO1xuICAgIGxldCByZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmtleXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHJldFtrZXldID0gcGFyc2UodGhpcy5rZXlzW2tleV0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBvbGRLZXlzID0gdGhpcy5rZXlzO1xuICAgIHRoaXMua2V5cyA9IHt9O1xuXG4gICAgdGhpcy5hbGxEZXBzLmNoYW5nZWQoKTtcblxuICAgIE9iamVjdC5rZXlzKG9sZEtleXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNoYW5nZWQodGhpcy5rZXlEZXBzW2tleV0pO1xuICAgICAgaWYgKHRoaXMua2V5VmFsdWVEZXBzW2tleV0pIHtcbiAgICAgICAgY2hhbmdlZCh0aGlzLmtleVZhbHVlRGVwc1trZXldW29sZEtleXNba2V5XV0pO1xuICAgICAgICBjaGFuZ2VkKHRoaXMua2V5VmFsdWVEZXBzW2tleV1bJ3VuZGVmaW5lZCddKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlbGV0ZShrZXkpIHtcbiAgICBsZXQgZGlkUmVtb3ZlID0gZmFsc2U7XG5cbiAgICBpZiAoaGFzT3duLmNhbGwodGhpcy5rZXlzLCBrZXkpKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMua2V5c1trZXldO1xuICAgICAgZGVsZXRlIHRoaXMua2V5c1trZXldO1xuICAgICAgY2hhbmdlZCh0aGlzLmtleURlcHNba2V5XSk7XG4gICAgICBpZiAodGhpcy5rZXlWYWx1ZURlcHNba2V5XSkge1xuICAgICAgICBjaGFuZ2VkKHRoaXMua2V5VmFsdWVEZXBzW2tleV1bb2xkVmFsdWVdKTtcbiAgICAgICAgY2hhbmdlZCh0aGlzLmtleVZhbHVlRGVwc1trZXldWyd1bmRlZmluZWQnXSk7XG4gICAgICB9XG4gICAgICB0aGlzLmFsbERlcHMuY2hhbmdlZCgpO1xuICAgICAgZGlkUmVtb3ZlID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZFJlbW92ZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIGlmICh0aGlzLm5hbWUgJiYgaGFzT3duLmNhbGwoUmVhY3RpdmVEaWN0Ll9kaWN0c1RvTWlncmF0ZSwgdGhpcy5uYW1lKSkge1xuICAgICAgZGVsZXRlIFJlYWN0aXZlRGljdC5fZGljdHNUb01pZ3JhdGVbdGhpcy5uYW1lXTtcbiAgICB9XG4gIH1cblxuICBfc2V0T2JqZWN0KG9iamVjdCkge1xuICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBfc2V0RGVmYXVsdE9iamVjdChvYmplY3QpIHtcbiAgICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuc2V0RGVmYXVsdChrZXksIG9iamVjdFtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9lbnN1cmVLZXkoa2V5KSB7XG4gICAgaWYgKCEoa2V5IGluIHRoaXMua2V5RGVwcykpIHtcbiAgICAgIHRoaXMua2V5RGVwc1trZXldID0gbmV3IFRyYWNrZXIuRGVwZW5kZW5jeTtcbiAgICAgIHRoaXMua2V5VmFsdWVEZXBzW2tleV0gPSB7fTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgYSBKU09OIHZhbHVlIHRoYXQgY2FuIGJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgdG9cbiAgLy8gY3JlYXRlIGEgbmV3IFJlYWN0aXZlRGljdCB3aXRoIHRoZSBzYW1lIGNvbnRlbnRzIGFzIHRoaXMgb25lXG4gIF9nZXRNaWdyYXRpb25EYXRhKCkge1xuICAgIC8vIFhYWCBzYW5pdGl6ZSBhbmQgbWFrZSBzdXJlIGl0J3MgSlNPTmlibGU/XG4gICAgcmV0dXJuIHRoaXMua2V5cztcbiAgfVxufVxuIl19
