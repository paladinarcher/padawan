(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"jagi:astronomy-slug-behavior":{"lib":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/main.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./behavior/behavior.js"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"behavior":{"apply.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/apply.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function apply(Class) {
  Class.extend(this.createClassDefinition(), ['fields', 'events']);
}

module.exportDefault(apply);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"behavior.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/behavior.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Behavior;
module.watch(require("meteor/jagi:astronomy"), {
  Behavior(v) {
    Behavior = v;
  }

}, 0);
let createClassDefinition;
module.watch(require("./createClassDefinition"), {
  default(v) {
    createClassDefinition = v;
  }

}, 1);
let apply;
module.watch(require("./apply"), {
  default(v) {
    apply = v;
  }

}, 2);
let generateSlug;
module.watch(require("./generateSlug"), {
  default(v) {
    generateSlug = v;
  }

}, 3);
Behavior.create({
  name: 'slug',
  options: {
    generateOnInit: false,
    fieldName: null,
    helperName: null,
    slugFieldName: 'slug',
    canUpdate: false,
    unique: true,
    separator: '-'
  },
  createClassDefinition,
  apply,
  generateSlug
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"check.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/check.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Module;
module.watch(require("meteor/jagi:astronomy"), {
  Module(v) {
    Module = v;
  }

}, 0);
const throwParseError = Module.get('core').utils.throwParseError;

function check(Class) {
  if (this.options.fieldName && this.options.helperName) {
    throwParseError([{
      'class': Class.getName()
    }, {
      'behavior': 'slug'
    }, 'Can not generate a slug from the field and method at the same time']);
  } else if (this.options.fieldName) {
    if (!Class.hasField(this.options.fieldName)) {
      throwParseError([{
        'class': Class.getName()
      }, {
        'behavior': 'slug'
      }, `The "${this.options.fieldName}" field that does not exist`]);
    }
  } else if (this.options.helperName) {
    if (!Class.hasHelper(this.options.helperName)) {
      throwParseError([{
        'class': Class.getName()
      }, {
        'behavior': 'slug'
      }, `The "${this.options.helperName}" helper that does not exist`]);
    }
  } else {
    throwParseError([{
      'class': Class.getName()
    }, {
      'behavior': 'slug'
    }, 'Provide "fieldName" or "helperName" as a source of a slug']);
  }
}

module.exportDefault(check);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createClassDefinition.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/createClassDefinition.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let bind;
module.watch(require("lodash"), {
  bind(v) {
    bind = v;
  }

}, 0);
let afterInit;
module.watch(require("../class_events/afterInit"), {
  default(v) {
    afterInit = v;
  }

}, 1);
let beforeSave;
module.watch(require("../class_events/beforeSave"), {
  default(v) {
    beforeSave = v;
  }

}, 2);

function createClassDefinition() {
  const definition = {
    fields: {
      [this.options.slugFieldName]: {
        type: String,
        immutable: !this.options.canUpdate,
        optional: true
      }
    },
    events: {
      afterInit: bind(afterInit, this),
      beforeSave: bind(beforeSave, this)
    }
  };
  return definition;
}

module.exportDefault(createClassDefinition);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"diacriticsMap.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/diacriticsMap.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
const diacriticsMap = [{
  'base': 'a',
  'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0430]/g
}, {
  'base': 'aa',
  'letters': /[\uA733]/g
}, {
  'base': 'ae',
  'letters': /[\u00E6\u01FD\u01E3]/g
}, {
  'base': 'ao',
  'letters': /[\uA735]/g
}, {
  'base': 'au',
  'letters': /[\uA737]/g
}, {
  'base': 'av',
  'letters': /[\uA739\uA73B]/g
}, {
  'base': 'ay',
  'letters': /[\uA73D]/g
}, {
  'base': 'b',
  'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0431]/g
}, {
  'base': 'c',
  'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
}, {
  'base': 'ch',
  'letters': /[\u0447]/g
}, {
  'base': 'd',
  'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A\u0434]/g
}, {
  'base': 'dz',
  'letters': /[\u01F3\u01C6]/g
}, {
  'base': 'e',
  'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD\u0435\u0451\u044D]/g
}, {
  'base': 'f',
  'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C\u0444]/g
}, {
  'base': 'g',
  'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F\u0433]/g
}, {
  'base': 'h',
  'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
}, {
  'base': 'hv',
  'letters': /[\u0195]/g
}, {
  'base': 'i',
  'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131\u0438\u0439]/g
}, {
  'base': 'ia',
  'letters': /[\u044F]/g
}, {
  'base': 'ie',
  'letters': /[\u044A]/g
}, {
  'base': 'iu',
  'letters': /[\u044E]/g
}, {
  'base': 'j',
  'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
}, {
  'base': 'k',
  'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3\u043A]/g
}, {
  'base': 'kh',
  'letters': /[\u0445]/g
}, {
  'base': 'l',
  'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u043B]/g
}, {
  'base': 'lj',
  'letters': /[\u01C9]/g
}, {
  'base': 'm',
  'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F\u043C]/g
}, {
  'base': 'n',
  'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u043D]/g
}, {
  'base': 'nj',
  'letters': /[\u01CC]/g
}, {
  'base': 'o',
  'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275\u043E]/g
}, {
  'base': 'oi',
  'letters': /[\u01A3]/g
}, {
  'base': 'ou',
  'letters': /[\u0223]/g
}, {
  'base': 'oo',
  'letters': /[\uA74F]/g
}, {
  'base': 'p',
  'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u043F]/g
}, {
  'base': 'q',
  'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
}, {
  'base': 'r',
  'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783\u0440]/g
}, {
  'base': 's',
  'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0441]/g
}, {
  'base': 'sh',
  'letters': /[\u0448]/g
}, {
  'base': 'shch',
  'letters': /[\u0449]/g
}, {
  'base': 't',
  'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787\u0442]/g
}, {
  'base': 'ts',
  'letters': /[\u0446]/g
}, {
  'base': 'tz',
  'letters': /[\uA729]/g
}, {
  'base': 'u',
  'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289\u0443]/g
}, {
  'base': 'v',
  'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C\u0432]/g
}, {
  'base': 'vy',
  'letters': /[\uA761]/g
}, {
  'base': 'w',
  'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
}, {
  'base': 'x',
  'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
}, {
  'base': 'y',
  'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF\u044B]/g
}, {
  'base': 'z',
  'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763\u0437]/g
}, {
  'base': 'zh',
  'letters': /[\u0436]/g
}];
module.exportDefault(diacriticsMap);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generateSlug.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/behavior/generateSlug.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let isNull, each;
module.watch(require("lodash"), {
  isNull(v) {
    isNull = v;
  },

  each(v) {
    each = v;
  }

}, 0);
let check;
module.watch(require("./check"), {
  default(v) {
    check = v;
  }

}, 1);
let diacriticsMap;
module.watch(require("./diacriticsMap"), {
  default(v) {
    diacriticsMap = v;
  }

}, 2);

function generateSlug(doc) {
  const Class = doc.constructor; // Check validity of the class for generating slug.

  check.call(this, Class);
  let value;

  if (this.options.fieldName) {
    // Get value of a field to make a slug from.
    value = doc.get(this.options.fieldName);
  } else if (this.options.helperName) {
    // Generate value by a method to make a slug from.
    value = doc[this.options.helperName]();
  } // If a value is null then we can not create a slug.


  if (isNull(value)) {
    return;
  } // Take the current value of the slug field.


  const oldSlug = doc.get(this.options.slugFieldName); // If the current slug is not empty and we can not update, then we have to
  // stop here.

  if (oldSlug && !this.options.canUpdate) {
    return;
  } // GENERATE A NEW SLUG.
  // Lower case.


  let newSlug = value.toLowerCase(); // Remove diacriticts.

  each(diacriticsMap, function (diacriticMap) {
    newSlug = newSlug.replace(diacriticMap.letters, diacriticMap.base);
  }); // Remove unsupported characters.

  newSlug = newSlug.replace(/[^\w\s-]+/g, ''); // Trim.

  newSlug = newSlug.replace(/^\s+|\s+$/g, ''); // Replace white characters with separator.

  newSlug = newSlug.replace(/\s+/g, this.options.separator); // If the "unique" option was set, then check whether there are any
  // duplicates. If there is any document with the same slug, then we have to
  // add number at the end of the slug.

  if (newSlug !== oldSlug) {
    // We have to check uniquness of the slug.
    if (this.options.unique) {
      const selector = {
        [this.options.slugFieldName]: newSlug
      };
      const count = Class.find(selector, {
        disableEvents: true
      }).count();

      if (count > 0) {
        // Prepare the selector with a regular expression querying all the
        // documents that contains our slug and ends with number.
        const prefix = newSlug + this.options.separator;
        const re = new RegExp('^' + prefix + '\\d+$');
        selector[this.options.slugFieldName] = re; // Limit the amount of fields being fetched to only the slug field.

        const options = {
          fields: {
            [this.options.slugFieldName]: 1
          },
          disableEvents: true
        }; // Set the first number that will be added at the end of the slug to 2.

        let index = 2; // Loop through all the documents with the same slug.

        Class.find(selector, options).forEach(d => {
          let dSlug = d.get(this.options.slugFieldName);
          let dIndex = parseInt(dSlug.replace(prefix, ''), 10);

          if (dIndex >= index) {
            index = dIndex + 1;
          }
        });
        newSlug = prefix + index;
      }
    } // Set a new slug.


    doc.set(this.options.slugFieldName, newSlug);
  }
}

module.exportDefault(generateSlug);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"class_events":{"afterInit.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/class_events/afterInit.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function afterInit(e) {
  if (this.options.generateOnInit) {
    const doc = e.currentTarget;
    const Class = doc.constructor;
    this.generateSlug(doc);
  }
}

module.exportDefault(afterInit);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"beforeSave.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jagi_astronomy-slug-behavior/lib/class_events/beforeSave.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function beforeSave(e) {
  const doc = e.currentTarget;
  const Class = doc.constructor; // Check if a field from which we want to create a slug has been
  // modified.

  if (this.options.fieldName) {
    if (!doc.isModified(this.options.fieldName)) {
      return;
    }
  }

  this.generateSlug(doc);
}

module.exportDefault(beforeSave);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"lodash":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/jagi_astronomy-slug-behavior/node_modules/lodash/package.json                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "lodash";
exports.version = "4.17.2";
exports.main = "lodash.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lodash.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/jagi_astronomy-slug-behavior/node_modules/lodash/lodash.js                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/jagi:astronomy-slug-behavior/lib/main.js");

/* Exports */
Package._define("jagi:astronomy-slug-behavior", exports);

})();

//# sourceURL=meteor://💻app/packages/jagi_astronomy-slug-behavior.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc2x1Zy1iZWhhdmlvci9saWIvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc2x1Zy1iZWhhdmlvci9saWIvYmVoYXZpb3IvYXBwbHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNsdWctYmVoYXZpb3IvbGliL2JlaGF2aW9yL2JlaGF2aW9yLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zbHVnLWJlaGF2aW9yL2xpYi9iZWhhdmlvci9jaGVjay5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktc2x1Zy1iZWhhdmlvci9saWIvYmVoYXZpb3IvY3JlYXRlQ2xhc3NEZWZpbml0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zbHVnLWJlaGF2aW9yL2xpYi9iZWhhdmlvci9kaWFjcml0aWNzTWFwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS1zbHVnLWJlaGF2aW9yL2xpYi9iZWhhdmlvci9nZW5lcmF0ZVNsdWcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNsdWctYmVoYXZpb3IvbGliL2NsYXNzX2V2ZW50cy9hZnRlckluaXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2phZ2k6YXN0cm9ub215LXNsdWctYmVoYXZpb3IvbGliL2NsYXNzX2V2ZW50cy9iZWZvcmVTYXZlLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsImFwcGx5IiwiQ2xhc3MiLCJleHRlbmQiLCJjcmVhdGVDbGFzc0RlZmluaXRpb24iLCJleHBvcnREZWZhdWx0IiwiQmVoYXZpb3IiLCJ2IiwiZGVmYXVsdCIsImdlbmVyYXRlU2x1ZyIsImNyZWF0ZSIsIm5hbWUiLCJvcHRpb25zIiwiZ2VuZXJhdGVPbkluaXQiLCJmaWVsZE5hbWUiLCJoZWxwZXJOYW1lIiwic2x1Z0ZpZWxkTmFtZSIsImNhblVwZGF0ZSIsInVuaXF1ZSIsInNlcGFyYXRvciIsIk1vZHVsZSIsInRocm93UGFyc2VFcnJvciIsImdldCIsInV0aWxzIiwiY2hlY2siLCJnZXROYW1lIiwiaGFzRmllbGQiLCJoYXNIZWxwZXIiLCJiaW5kIiwiYWZ0ZXJJbml0IiwiYmVmb3JlU2F2ZSIsImRlZmluaXRpb24iLCJmaWVsZHMiLCJ0eXBlIiwiU3RyaW5nIiwiaW1tdXRhYmxlIiwib3B0aW9uYWwiLCJldmVudHMiLCJkaWFjcml0aWNzTWFwIiwiaXNOdWxsIiwiZWFjaCIsImRvYyIsImNvbnN0cnVjdG9yIiwiY2FsbCIsInZhbHVlIiwib2xkU2x1ZyIsIm5ld1NsdWciLCJ0b0xvd2VyQ2FzZSIsImRpYWNyaXRpY01hcCIsInJlcGxhY2UiLCJsZXR0ZXJzIiwiYmFzZSIsInNlbGVjdG9yIiwiY291bnQiLCJmaW5kIiwiZGlzYWJsZUV2ZW50cyIsInByZWZpeCIsInJlIiwiUmVnRXhwIiwiaW5kZXgiLCJmb3JFYWNoIiwiZCIsImRTbHVnIiwiZEluZGV4IiwicGFyc2VJbnQiLCJzZXQiLCJlIiwiY3VycmVudFRhcmdldCIsImlzTW9kaWZpZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHdCQUFSLENBQWIsRTs7Ozs7Ozs7Ozs7QUNBQSxTQUFTQyxLQUFULENBQWVDLEtBQWYsRUFBc0I7QUFDcEJBLFFBQU1DLE1BQU4sQ0FBYSxLQUFLQyxxQkFBTCxFQUFiLEVBQTJDLENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FBM0M7QUFDRDs7QUFGRE4sT0FBT08sYUFBUCxDQUllSixLQUpmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSUssUUFBSjtBQUFhUixPQUFPQyxLQUFQLENBQWFDLFFBQVEsdUJBQVIs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d0IsR0FBSixDQUFRLEtBQUtyRCxPQUFMLENBQWFJLGFBQXJCLEVBQW9DOEIsT0FBcEM7QUFDRDtBQUNGOztBQTlGRGhELE9BQU9PLGFBQVAsQ0FnR2VJLFlBaEdmLEU7Ozs7Ozs7Ozs7O0FDQUEsU0FBU29CLFNBQVQsQ0FBbUJxQyxDQUFuQixFQUFzQjtBQUNwQixNQUFJLEtBQUt0RCxPQUFMLENBQWFDLGNBQWpCLEVBQWlDO0FBQy9CLFVBQU00QixNQUFNeUIsRUFBRUMsYUFBZDtBQUNBLFVBQU1qRSxRQUFRdUMsSUFBSUMsV0FBbEI7QUFDQSxTQUFLakMsWUFBTCxDQUFrQmdDLEdBQWxCO0FBQ0Q7QUFDRjs7QUFORDNDLE9BQU9PLGFBQVAsQ0FRZXdCLFNBUmYsRTs7Ozs7Ozs7Ozs7QUNBQSxTQUFTQyxVQUFULENBQW9Cb0MsQ0FBcEIsRUFBdUI7QUFDckIsUUFBTXpCLE1BQU15QixFQUFFQyxhQUFkO0FBQ0EsUUFBTWpFLFFBQVF1QyxJQUFJQyxXQUFsQixDQUZxQixDQUdyQjtBQUNBOztBQUNBLE1BQUksS0FBSzlCLE9BQUwsQ0FBYUUsU0FBakIsRUFBNEI7QUFDMUIsUUFBSSxDQUFDMkIsSUFBSTJCLFVBQUosQ0FBZSxLQUFLeEQsT0FBTCxDQUFhRSxTQUE1QixDQUFMLEVBQTZDO0FBQzNDO0FBQ0Q7QUFDRjs7QUFDRCxPQUFLTCxZQUFMLENBQWtCZ0MsR0FBbEI7QUFDRDs7QUFYRDNDLE9BQU9PLGFBQVAsQ0FhZXlCLFVBYmYsRSIsImZpbGUiOiIvcGFja2FnZXMvamFnaV9hc3Ryb25vbXktc2x1Zy1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9iZWhhdmlvci9iZWhhdmlvci5qcyc7IiwiZnVuY3Rpb24gYXBwbHkoQ2xhc3MpIHtcbiAgQ2xhc3MuZXh0ZW5kKHRoaXMuY3JlYXRlQ2xhc3NEZWZpbml0aW9uKCksIFsnZmllbGRzJywgJ2V2ZW50cyddKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXBwbHk7IiwiaW1wb3J0IHtcbiAgQmVoYXZpb3Jcbn0gZnJvbSAnbWV0ZW9yL2phZ2k6YXN0cm9ub215JztcbmltcG9ydCBjcmVhdGVDbGFzc0RlZmluaXRpb24gZnJvbSAnLi9jcmVhdGVDbGFzc0RlZmluaXRpb24nO1xuaW1wb3J0IGFwcGx5IGZyb20gJy4vYXBwbHknO1xuaW1wb3J0IGdlbmVyYXRlU2x1ZyBmcm9tICcuL2dlbmVyYXRlU2x1Zyc7XG5cbkJlaGF2aW9yLmNyZWF0ZSh7XG4gIG5hbWU6ICdzbHVnJyxcbiAgb3B0aW9uczoge1xuICAgIGdlbmVyYXRlT25Jbml0OiBmYWxzZSxcbiAgICBmaWVsZE5hbWU6IG51bGwsXG4gICAgaGVscGVyTmFtZTogbnVsbCxcbiAgICBzbHVnRmllbGROYW1lOiAnc2x1ZycsXG4gICAgY2FuVXBkYXRlOiBmYWxzZSxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgc2VwYXJhdG9yOiAnLSdcbiAgfSxcbiAgY3JlYXRlQ2xhc3NEZWZpbml0aW9uLFxuICBhcHBseSxcbiAgZ2VuZXJhdGVTbHVnXG59KTtcbiIsImltcG9ydCB7XG4gIE1vZHVsZVxufSBmcm9tICdtZXRlb3IvamFnaTphc3Ryb25vbXknO1xuY29uc3QgdGhyb3dQYXJzZUVycm9yID0gTW9kdWxlLmdldCgnY29yZScpLnV0aWxzLnRocm93UGFyc2VFcnJvcjtcblxuZnVuY3Rpb24gY2hlY2soQ2xhc3MpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5maWVsZE5hbWUgJiYgdGhpcy5vcHRpb25zLmhlbHBlck5hbWUpIHtcbiAgICB0aHJvd1BhcnNlRXJyb3IoW3tcbiAgICAgICAgJ2NsYXNzJzogQ2xhc3MuZ2V0TmFtZSgpXG4gICAgICB9LCB7XG4gICAgICAgICdiZWhhdmlvcic6ICdzbHVnJ1xuICAgICAgfSxcbiAgICAgICdDYW4gbm90IGdlbmVyYXRlIGEgc2x1ZyBmcm9tIHRoZSBmaWVsZCBhbmQgbWV0aG9kIGF0IHRoZSBzYW1lIHRpbWUnXG4gICAgXSk7XG4gIH1cbiAgZWxzZSBpZiAodGhpcy5vcHRpb25zLmZpZWxkTmFtZSkge1xuICAgIGlmICghQ2xhc3MuaGFzRmllbGQodGhpcy5vcHRpb25zLmZpZWxkTmFtZSkpIHtcbiAgICAgIHRocm93UGFyc2VFcnJvcihbe1xuICAgICAgICAgICdjbGFzcyc6IENsYXNzLmdldE5hbWUoKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJ2JlaGF2aW9yJzogJ3NsdWcnXG4gICAgICAgIH0sXG4gICAgICAgIGBUaGUgXCIke3RoaXMub3B0aW9ucy5maWVsZE5hbWV9XCIgZmllbGQgdGhhdCBkb2VzIG5vdCBleGlzdGBcbiAgICAgIF0pO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuaGVscGVyTmFtZSkge1xuICAgIGlmICghQ2xhc3MuaGFzSGVscGVyKHRoaXMub3B0aW9ucy5oZWxwZXJOYW1lKSkge1xuICAgICAgdGhyb3dQYXJzZUVycm9yKFt7XG4gICAgICAgICAgJ2NsYXNzJzogQ2xhc3MuZ2V0TmFtZSgpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAnYmVoYXZpb3InOiAnc2x1ZydcbiAgICAgICAgfSxcbiAgICAgICAgYFRoZSBcIiR7dGhpcy5vcHRpb25zLmhlbHBlck5hbWV9XCIgaGVscGVyIHRoYXQgZG9lcyBub3QgZXhpc3RgXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3dQYXJzZUVycm9yKFt7XG4gICAgICAgICdjbGFzcyc6IENsYXNzLmdldE5hbWUoKVxuICAgICAgfSwge1xuICAgICAgICAnYmVoYXZpb3InOiAnc2x1ZydcbiAgICAgIH0sXG4gICAgICAnUHJvdmlkZSBcImZpZWxkTmFtZVwiIG9yIFwiaGVscGVyTmFtZVwiIGFzIGEgc291cmNlIG9mIGEgc2x1ZydcbiAgICBdKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjaGVjazsiLCJpbXBvcnQge1xuICBiaW5kXG59IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYWZ0ZXJJbml0IGZyb20gJy4uL2NsYXNzX2V2ZW50cy9hZnRlckluaXQnO1xuaW1wb3J0IGJlZm9yZVNhdmUgZnJvbSAnLi4vY2xhc3NfZXZlbnRzL2JlZm9yZVNhdmUnO1xuXG5mdW5jdGlvbiBjcmVhdGVDbGFzc0RlZmluaXRpb24oKSB7XG4gIGNvbnN0IGRlZmluaXRpb24gPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICBbdGhpcy5vcHRpb25zLnNsdWdGaWVsZE5hbWVdOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgaW1tdXRhYmxlOiAhdGhpcy5vcHRpb25zLmNhblVwZGF0ZSxcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgYWZ0ZXJJbml0OiBiaW5kKGFmdGVySW5pdCwgdGhpcyksXG4gICAgICBiZWZvcmVTYXZlOiBiaW5kKGJlZm9yZVNhdmUsIHRoaXMpXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBkZWZpbml0aW9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDbGFzc0RlZmluaXRpb247IiwiY29uc3QgZGlhY3JpdGljc01hcCA9IFt7XG4gICdiYXNlJzogJ2EnLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2MVxcdTI0RDBcXHVGRjQxXFx1MUU5QVxcdTAwRTBcXHUwMEUxXFx1MDBFMlxcdTFFQTdcXHUxRUE1XFx1MUVBQlxcdTFFQTlcXHUwMEUzXFx1MDEwMVxcdTAxMDNcXHUxRUIxXFx1MUVBRlxcdTFFQjVcXHUxRUIzXFx1MDIyN1xcdTAxRTFcXHUwMEU0XFx1MDFERlxcdTFFQTNcXHUwMEU1XFx1MDFGQlxcdTAxQ0VcXHUwMjAxXFx1MDIwM1xcdTFFQTFcXHUxRUFEXFx1MUVCN1xcdTFFMDFcXHUwMTA1XFx1MkM2NVxcdTAyNTBcXHUwNDMwXS9nXG59LCB7XG4gICdiYXNlJzogJ2FhJyxcbiAgJ2xldHRlcnMnOiAvW1xcdUE3MzNdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnYWUnLFxuICAnbGV0dGVycyc6IC9bXFx1MDBFNlxcdTAxRkRcXHUwMUUzXS9nXG59LCB7XG4gICdiYXNlJzogJ2FvJyxcbiAgJ2xldHRlcnMnOiAvW1xcdUE3MzVdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnYXUnLFxuICAnbGV0dGVycyc6IC9bXFx1QTczN10vZ1xufSwge1xuICAnYmFzZSc6ICdhdicsXG4gICdsZXR0ZXJzJzogL1tcXHVBNzM5XFx1QTczQl0vZ1xufSwge1xuICAnYmFzZSc6ICdheScsXG4gICdsZXR0ZXJzJzogL1tcXHVBNzNEXS9nXG59LCB7XG4gICdiYXNlJzogJ2InLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2MlxcdTI0RDFcXHVGRjQyXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MDE4MFxcdTAxODNcXHUwMjUzXFx1MDQzMV0vZ1xufSwge1xuICAnYmFzZSc6ICdjJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNjNcXHUyNEQyXFx1RkY0M1xcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMEU3XFx1MUUwOVxcdTAxODhcXHUwMjNDXFx1QTczRlxcdTIxODRdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnY2gnLFxuICAnbGV0dGVycyc6IC9bXFx1MDQ0N10vZ1xufSwge1xuICAnYmFzZSc6ICdkJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNjRcXHUyNEQzXFx1RkY0NFxcdTFFMEJcXHUwMTBGXFx1MUUwRFxcdTFFMTFcXHUxRTEzXFx1MUUwRlxcdTAxMTFcXHUwMThDXFx1MDI1NlxcdTAyNTdcXHVBNzdBXFx1MDQzNF0vZ1xufSwge1xuICAnYmFzZSc6ICdkeicsXG4gICdsZXR0ZXJzJzogL1tcXHUwMUYzXFx1MDFDNl0vZ1xufSwge1xuICAnYmFzZSc6ICdlJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNjVcXHUyNEQ0XFx1RkY0NVxcdTAwRThcXHUwMEU5XFx1MDBFQVxcdTFFQzFcXHUxRUJGXFx1MUVDNVxcdTFFQzNcXHUxRUJEXFx1MDExM1xcdTFFMTVcXHUxRTE3XFx1MDExNVxcdTAxMTdcXHUwMEVCXFx1MUVCQlxcdTAxMUJcXHUwMjA1XFx1MDIwN1xcdTFFQjlcXHUxRUM3XFx1MDIyOVxcdTFFMURcXHUwMTE5XFx1MUUxOVxcdTFFMUJcXHUwMjQ3XFx1MDI1QlxcdTAxRERcXHUwNDM1XFx1MDQ1MVxcdTA0NERdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnZicsXG4gICdsZXR0ZXJzJzogL1tcXHUwMDY2XFx1MjRENVxcdUZGNDZcXHUxRTFGXFx1MDE5MlxcdUE3N0NcXHUwNDQ0XS9nXG59LCB7XG4gICdiYXNlJzogJ2cnLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2N1xcdTI0RDZcXHVGRjQ3XFx1MDFGNVxcdTAxMURcXHUxRTIxXFx1MDExRlxcdTAxMjFcXHUwMUU3XFx1MDEyM1xcdTAxRTVcXHUwMjYwXFx1QTdBMVxcdTFENzlcXHVBNzdGXFx1MDQzM10vZ1xufSwge1xuICAnYmFzZSc6ICdoJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNjhcXHUyNEQ3XFx1RkY0OFxcdTAxMjVcXHUxRTIzXFx1MUUyN1xcdTAyMUZcXHUxRTI1XFx1MUUyOVxcdTFFMkJcXHUxRTk2XFx1MDEyN1xcdTJDNjhcXHUyQzc2XFx1MDI2NV0vZ1xufSwge1xuICAnYmFzZSc6ICdodicsXG4gICdsZXR0ZXJzJzogL1tcXHUwMTk1XS9nXG59LCB7XG4gICdiYXNlJzogJ2knLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2OVxcdTI0RDhcXHVGRjQ5XFx1MDBFQ1xcdTAwRURcXHUwMEVFXFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDBFRlxcdTFFMkZcXHUxRUM5XFx1MDFEMFxcdTAyMDlcXHUwMjBCXFx1MUVDQlxcdTAxMkZcXHUxRTJEXFx1MDI2OFxcdTAxMzFcXHUwNDM4XFx1MDQzOV0vZ1xufSwge1xuICAnYmFzZSc6ICdpYScsXG4gICdsZXR0ZXJzJzogL1tcXHUwNDRGXS9nXG59LCB7XG4gICdiYXNlJzogJ2llJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTA0NEFdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnaXUnLFxuICAnbGV0dGVycyc6IC9bXFx1MDQ0RV0vZ1xufSwge1xuICAnYmFzZSc6ICdqJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNkFcXHUyNEQ5XFx1RkY0QVxcdTAxMzVcXHUwMUYwXFx1MDI0OV0vZ1xufSwge1xuICAnYmFzZSc6ICdrJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNkJcXHUyNERBXFx1RkY0QlxcdTFFMzFcXHUwMUU5XFx1MUUzM1xcdTAxMzdcXHUxRTM1XFx1MDE5OVxcdTJDNkFcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBN0EzXFx1MDQzQV0vZ1xufSwge1xuICAnYmFzZSc6ICdraCcsXG4gICdsZXR0ZXJzJzogL1tcXHUwNDQ1XS9nXG59LCB7XG4gICdiYXNlJzogJ2wnLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2Q1xcdTI0REJcXHVGRjRDXFx1MDE0MFxcdTAxM0FcXHUwMTNFXFx1MUUzN1xcdTFFMzlcXHUwMTNDXFx1MUUzRFxcdTFFM0JcXHUwMTdGXFx1MDE0MlxcdTAxOUFcXHUwMjZCXFx1MkM2MVxcdUE3NDlcXHVBNzgxXFx1QTc0N1xcdTA0M0JdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnbGonLFxuICAnbGV0dGVycyc6IC9bXFx1MDFDOV0vZ1xufSwge1xuICAnYmFzZSc6ICdtJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNkRcXHUyNERDXFx1RkY0RFxcdTFFM0ZcXHUxRTQxXFx1MUU0M1xcdTAyNzFcXHUwMjZGXFx1MDQzQ10vZ1xufSwge1xuICAnYmFzZSc6ICduJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNkVcXHUyNEREXFx1RkY0RVxcdTAxRjlcXHUwMTQ0XFx1MDBGMVxcdTFFNDVcXHUwMTQ4XFx1MUU0N1xcdTAxNDZcXHUxRTRCXFx1MUU0OVxcdTAxOUVcXHUwMjcyXFx1MDE0OVxcdUE3OTFcXHVBN0E1XFx1MDQzRF0vZ1xufSwge1xuICAnYmFzZSc6ICduaicsXG4gICdsZXR0ZXJzJzogL1tcXHUwMUNDXS9nXG59LCB7XG4gICdiYXNlJzogJ28nLFxuICAnbGV0dGVycyc6IC9bXFx1MDA2RlxcdTI0REVcXHVGRjRGXFx1MDBGMlxcdTAwRjNcXHUwMEY0XFx1MUVEM1xcdTFFRDFcXHUxRUQ3XFx1MUVENVxcdTAwRjVcXHUxRTREXFx1MDIyRFxcdTFFNEZcXHUwMTREXFx1MUU1MVxcdTFFNTNcXHUwMTRGXFx1MDIyRlxcdTAyMzFcXHUwMEY2XFx1MDIyQlxcdTFFQ0ZcXHUwMTUxXFx1MDFEMlxcdTAyMERcXHUwMjBGXFx1MDFBMVxcdTFFRERcXHUxRURCXFx1MUVFMVxcdTFFREZcXHUxRUUzXFx1MUVDRFxcdTFFRDlcXHUwMUVCXFx1MDFFRFxcdTAwRjhcXHUwMUZGXFx1MDI1NFxcdUE3NEJcXHVBNzREXFx1MDI3NVxcdTA0M0VdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnb2knLFxuICAnbGV0dGVycyc6IC9bXFx1MDFBM10vZ1xufSwge1xuICAnYmFzZSc6ICdvdScsXG4gICdsZXR0ZXJzJzogL1tcXHUwMjIzXS9nXG59LCB7XG4gICdiYXNlJzogJ29vJyxcbiAgJ2xldHRlcnMnOiAvW1xcdUE3NEZdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAncCcsXG4gICdsZXR0ZXJzJzogL1tcXHUwMDcwXFx1MjRERlxcdUZGNTBcXHUxRTU1XFx1MUU1N1xcdTAxQTVcXHUxRDdEXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1MDQzRl0vZ1xufSwge1xuICAnYmFzZSc6ICdxJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNzFcXHUyNEUwXFx1RkY1MVxcdTAyNEJcXHVBNzU3XFx1QTc1OV0vZ1xufSwge1xuICAnYmFzZSc6ICdyJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNzJcXHUyNEUxXFx1RkY1MlxcdTAxNTVcXHUxRTU5XFx1MDE1OVxcdTAyMTFcXHUwMjEzXFx1MUU1QlxcdTFFNURcXHUwMTU3XFx1MUU1RlxcdTAyNERcXHUwMjdEXFx1QTc1QlxcdUE3QTdcXHVBNzgzXFx1MDQ0MF0vZ1xufSwge1xuICAnYmFzZSc6ICdzJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNzNcXHUyNEUyXFx1RkY1M1xcdTAwREZcXHUwMTVCXFx1MUU2NVxcdTAxNURcXHUxRTYxXFx1MDE2MVxcdTFFNjdcXHUxRTYzXFx1MUU2OVxcdTAyMTlcXHUwMTVGXFx1MDIzRlxcdUE3QTlcXHVBNzg1XFx1MUU5QlxcdTA0NDFdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAnc2gnLFxuICAnbGV0dGVycyc6IC9bXFx1MDQ0OF0vZ1xufSwge1xuICAnYmFzZSc6ICdzaGNoJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTA0NDldL2dcbn0sIHtcbiAgJ2Jhc2UnOiAndCcsXG4gICdsZXR0ZXJzJzogL1tcXHUwMDc0XFx1MjRFM1xcdUZGNTRcXHUxRTZCXFx1MUU5N1xcdTAxNjVcXHUxRTZEXFx1MDIxQlxcdTAxNjNcXHUxRTcxXFx1MUU2RlxcdTAxNjdcXHUwMUFEXFx1MDI4OFxcdTJDNjZcXHVBNzg3XFx1MDQ0Ml0vZ1xufSwge1xuICAnYmFzZSc6ICd0cycsXG4gICdsZXR0ZXJzJzogL1tcXHUwNDQ2XS9nXG59LCB7XG4gICdiYXNlJzogJ3R6JyxcbiAgJ2xldHRlcnMnOiAvW1xcdUE3MjldL2dcbn0sIHtcbiAgJ2Jhc2UnOiAndScsXG4gICdsZXR0ZXJzJzogL1tcXHUwMDc1XFx1MjRFNFxcdUZGNTVcXHUwMEY5XFx1MDBGQVxcdTAwRkJcXHUwMTY5XFx1MUU3OVxcdTAxNkJcXHUxRTdCXFx1MDE2RFxcdTAwRkNcXHUwMURDXFx1MDFEOFxcdTAxRDZcXHUwMURBXFx1MUVFN1xcdTAxNkZcXHUwMTcxXFx1MDFENFxcdTAyMTVcXHUwMjE3XFx1MDFCMFxcdTFFRUJcXHUxRUU5XFx1MUVFRlxcdTFFRURcXHUxRUYxXFx1MUVFNVxcdTFFNzNcXHUwMTczXFx1MUU3N1xcdTFFNzVcXHUwMjg5XFx1MDQ0M10vZ1xufSwge1xuICAnYmFzZSc6ICd2JyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNzZcXHUyNEU1XFx1RkY1NlxcdTFFN0RcXHUxRTdGXFx1MDI4QlxcdUE3NUZcXHUwMjhDXFx1MDQzMl0vZ1xufSwge1xuICAnYmFzZSc6ICd2eScsXG4gICdsZXR0ZXJzJzogL1tcXHVBNzYxXS9nXG59LCB7XG4gICdiYXNlJzogJ3cnLFxuICAnbGV0dGVycyc6IC9bXFx1MDA3N1xcdTI0RTZcXHVGRjU3XFx1MUU4MVxcdTFFODNcXHUwMTc1XFx1MUU4N1xcdTFFODVcXHUxRTk4XFx1MUU4OVxcdTJDNzNdL2dcbn0sIHtcbiAgJ2Jhc2UnOiAneCcsXG4gICdsZXR0ZXJzJzogL1tcXHUwMDc4XFx1MjRFN1xcdUZGNThcXHUxRThCXFx1MUU4RF0vZ1xufSwge1xuICAnYmFzZSc6ICd5JyxcbiAgJ2xldHRlcnMnOiAvW1xcdTAwNzlcXHUyNEU4XFx1RkY1OVxcdTFFRjNcXHUwMEZEXFx1MDE3N1xcdTFFRjlcXHUwMjMzXFx1MUU4RlxcdTAwRkZcXHUxRUY3XFx1MUU5OVxcdTFFRjVcXHUwMUI0XFx1MDI0RlxcdTFFRkZcXHUwNDRCXS9nXG59LCB7XG4gICdiYXNlJzogJ3onLFxuICAnbGV0dGVycyc6IC9bXFx1MDA3QVxcdTI0RTlcXHVGRjVBXFx1MDE3QVxcdTFFOTFcXHUwMTdDXFx1MDE3RVxcdTFFOTNcXHUxRTk1XFx1MDFCNlxcdTAyMjVcXHUwMjQwXFx1MkM2Q1xcdUE3NjNcXHUwNDM3XS9nXG59LCB7XG4gICdiYXNlJzogJ3poJyxcbiAgJ2xldHRlcnMnOiAvW1xcdTA0MzZdL2dcbn1dO1xuXG5leHBvcnQgZGVmYXVsdCBkaWFjcml0aWNzTWFwOyIsImltcG9ydCB7XG4gIGlzTnVsbCxcbiAgZWFjaFxufSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNoZWNrIGZyb20gJy4vY2hlY2snO1xuaW1wb3J0IGRpYWNyaXRpY3NNYXAgZnJvbSAnLi9kaWFjcml0aWNzTWFwJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVTbHVnKGRvYykge1xuICBjb25zdCBDbGFzcyA9IGRvYy5jb25zdHJ1Y3RvcjtcblxuICAvLyBDaGVjayB2YWxpZGl0eSBvZiB0aGUgY2xhc3MgZm9yIGdlbmVyYXRpbmcgc2x1Zy5cbiAgY2hlY2suY2FsbCh0aGlzLCBDbGFzcyk7XG5cbiAgbGV0IHZhbHVlO1xuICBpZiAodGhpcy5vcHRpb25zLmZpZWxkTmFtZSkge1xuICAgIC8vIEdldCB2YWx1ZSBvZiBhIGZpZWxkIHRvIG1ha2UgYSBzbHVnIGZyb20uXG4gICAgdmFsdWUgPSBkb2MuZ2V0KHRoaXMub3B0aW9ucy5maWVsZE5hbWUpO1xuICB9XG4gIGVsc2UgaWYgKHRoaXMub3B0aW9ucy5oZWxwZXJOYW1lKSB7XG4gICAgLy8gR2VuZXJhdGUgdmFsdWUgYnkgYSBtZXRob2QgdG8gbWFrZSBhIHNsdWcgZnJvbS5cbiAgICB2YWx1ZSA9IGRvY1t0aGlzLm9wdGlvbnMuaGVscGVyTmFtZV0oKTtcbiAgfVxuXG4gIC8vIElmIGEgdmFsdWUgaXMgbnVsbCB0aGVuIHdlIGNhbiBub3QgY3JlYXRlIGEgc2x1Zy5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUYWtlIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBzbHVnIGZpZWxkLlxuICBjb25zdCBvbGRTbHVnID0gZG9jLmdldCh0aGlzLm9wdGlvbnMuc2x1Z0ZpZWxkTmFtZSk7XG4gIC8vIElmIHRoZSBjdXJyZW50IHNsdWcgaXMgbm90IGVtcHR5IGFuZCB3ZSBjYW4gbm90IHVwZGF0ZSwgdGhlbiB3ZSBoYXZlIHRvXG4gIC8vIHN0b3AgaGVyZS5cbiAgaWYgKG9sZFNsdWcgJiYgIXRoaXMub3B0aW9ucy5jYW5VcGRhdGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBHRU5FUkFURSBBIE5FVyBTTFVHLlxuICAvLyBMb3dlciBjYXNlLlxuICBsZXQgbmV3U2x1ZyA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gIC8vIFJlbW92ZSBkaWFjcml0aWN0cy5cbiAgZWFjaChkaWFjcml0aWNzTWFwLCBmdW5jdGlvbihkaWFjcml0aWNNYXApIHtcbiAgICBuZXdTbHVnID0gbmV3U2x1Zy5yZXBsYWNlKGRpYWNyaXRpY01hcC5sZXR0ZXJzLCBkaWFjcml0aWNNYXAuYmFzZSk7XG4gIH0pO1xuICAvLyBSZW1vdmUgdW5zdXBwb3J0ZWQgY2hhcmFjdGVycy5cbiAgbmV3U2x1ZyA9IG5ld1NsdWcucmVwbGFjZSgvW15cXHdcXHMtXSsvZywgJycpO1xuICAvLyBUcmltLlxuICBuZXdTbHVnID0gbmV3U2x1Zy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gIC8vIFJlcGxhY2Ugd2hpdGUgY2hhcmFjdGVycyB3aXRoIHNlcGFyYXRvci5cbiAgbmV3U2x1ZyA9IG5ld1NsdWcucmVwbGFjZSgvXFxzKy9nLCB0aGlzLm9wdGlvbnMuc2VwYXJhdG9yKTtcblxuICAvLyBJZiB0aGUgXCJ1bmlxdWVcIiBvcHRpb24gd2FzIHNldCwgdGhlbiBjaGVjayB3aGV0aGVyIHRoZXJlIGFyZSBhbnlcbiAgLy8gZHVwbGljYXRlcy4gSWYgdGhlcmUgaXMgYW55IGRvY3VtZW50IHdpdGggdGhlIHNhbWUgc2x1ZywgdGhlbiB3ZSBoYXZlIHRvXG4gIC8vIGFkZCBudW1iZXIgYXQgdGhlIGVuZCBvZiB0aGUgc2x1Zy5cbiAgaWYgKG5ld1NsdWcgIT09IG9sZFNsdWcpIHtcbiAgICAvLyBXZSBoYXZlIHRvIGNoZWNrIHVuaXF1bmVzcyBvZiB0aGUgc2x1Zy5cbiAgICBpZiAodGhpcy5vcHRpb25zLnVuaXF1ZSkge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSB7XG4gICAgICAgIFt0aGlzLm9wdGlvbnMuc2x1Z0ZpZWxkTmFtZV06IG5ld1NsdWdcbiAgICAgIH07XG4gICAgICBjb25zdCBjb3VudCA9IENsYXNzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgICAgZGlzYWJsZUV2ZW50czogdHJ1ZVxuICAgICAgfSkuY291bnQoKTtcblxuICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICAvLyBQcmVwYXJlIHRoZSBzZWxlY3RvciB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIHF1ZXJ5aW5nIGFsbCB0aGVcbiAgICAgICAgLy8gZG9jdW1lbnRzIHRoYXQgY29udGFpbnMgb3VyIHNsdWcgYW5kIGVuZHMgd2l0aCBudW1iZXIuXG4gICAgICAgIGNvbnN0IHByZWZpeCA9IG5ld1NsdWcgKyB0aGlzLm9wdGlvbnMuc2VwYXJhdG9yO1xuICAgICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoJ14nICsgcHJlZml4ICsgJ1xcXFxkKyQnKTtcbiAgICAgICAgc2VsZWN0b3JbdGhpcy5vcHRpb25zLnNsdWdGaWVsZE5hbWVdID0gcmU7XG4gICAgICAgIC8vIExpbWl0IHRoZSBhbW91bnQgb2YgZmllbGRzIGJlaW5nIGZldGNoZWQgdG8gb25seSB0aGUgc2x1ZyBmaWVsZC5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMuc2x1Z0ZpZWxkTmFtZV06IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVFdmVudHM6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgLy8gU2V0IHRoZSBmaXJzdCBudW1iZXIgdGhhdCB3aWxsIGJlIGFkZGVkIGF0IHRoZSBlbmQgb2YgdGhlIHNsdWcgdG8gMi5cbiAgICAgICAgbGV0IGluZGV4ID0gMjtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZG9jdW1lbnRzIHdpdGggdGhlIHNhbWUgc2x1Zy5cbiAgICAgICAgQ2xhc3MuZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZm9yRWFjaCgoZCkgPT4ge1xuICAgICAgICAgIGxldCBkU2x1ZyA9IGQuZ2V0KHRoaXMub3B0aW9ucy5zbHVnRmllbGROYW1lKTtcbiAgICAgICAgICBsZXQgZEluZGV4ID0gcGFyc2VJbnQoZFNsdWcucmVwbGFjZShwcmVmaXgsICcnKSwgMTApO1xuICAgICAgICAgIGlmIChkSW5kZXggPj0gaW5kZXgpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZEluZGV4ICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ld1NsdWcgPSBwcmVmaXggKyBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgYSBuZXcgc2x1Zy5cbiAgICBkb2Muc2V0KHRoaXMub3B0aW9ucy5zbHVnRmllbGROYW1lLCBuZXdTbHVnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZVNsdWc7IiwiZnVuY3Rpb24gYWZ0ZXJJbml0KGUpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5nZW5lcmF0ZU9uSW5pdCkge1xuICAgIGNvbnN0IGRvYyA9IGUuY3VycmVudFRhcmdldDtcbiAgICBjb25zdCBDbGFzcyA9IGRvYy5jb25zdHJ1Y3RvcjtcbiAgICB0aGlzLmdlbmVyYXRlU2x1Zyhkb2MpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFmdGVySW5pdDsiLCJmdW5jdGlvbiBiZWZvcmVTYXZlKGUpIHtcbiAgY29uc3QgZG9jID0gZS5jdXJyZW50VGFyZ2V0O1xuICBjb25zdCBDbGFzcyA9IGRvYy5jb25zdHJ1Y3RvcjtcbiAgLy8gQ2hlY2sgaWYgYSBmaWVsZCBmcm9tIHdoaWNoIHdlIHdhbnQgdG8gY3JlYXRlIGEgc2x1ZyBoYXMgYmVlblxuICAvLyBtb2RpZmllZC5cbiAgaWYgKHRoaXMub3B0aW9ucy5maWVsZE5hbWUpIHtcbiAgICBpZiAoIWRvYy5pc01vZGlmaWVkKHRoaXMub3B0aW9ucy5maWVsZE5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHRoaXMuZ2VuZXJhdGVTbHVnKGRvYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJlZm9yZVNhdmU7Il19
