(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"jagi:astronomy-timestamp-behavior":{"lib":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/jagi_astronomy-timestamp-behavior/lib/main.js               //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
module.watch(require("./behavior/behavior.js"));
//////////////////////////////////////////////////////////////////////////

},"behavior":{"behavior.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/jagi_astronomy-timestamp-behavior/lib/behavior/behavior.js  //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
let Behavior;
module.watch(require("meteor/jagi:astronomy"), {
  Behavior(v) {
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
    const definition = {
      fields: {},
      events: {
        beforeInsert: e => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setCreationDate(doc);
        },
        beforeUpdate: e => {
          var doc = e.currentTarget;
          var Class = doc.constructor;
          this.setModificationDate(doc);
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
    const date = new Date(); // If the "hasCreatedField" option is set.

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
    const date = new Date(); // If the "hasUpdatedField" option is set.

    if (this.options.hasUpdatedField) {
      // Set value for the "updatedAt" field.
      doc[this.options.updatedFieldName] = date;
    }
  }
});
//////////////////////////////////////////////////////////////////////////

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

//# sourceURL=meteor://💻app/packages/jagi_astronomy-timestamp-behavior.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvamFnaTphc3Ryb25vbXktdGltZXN0YW1wLWJlaGF2aW9yL2xpYi9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9qYWdpOmFzdHJvbm9teS10aW1lc3RhbXAtYmVoYXZpb3IvbGliL2JlaGF2aW9yL2JlaGF2aW9yLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsIkJlaGF2aW9yIiwidiIsImNyZWF0ZSIsIm5hbWUiLCJvcHRpb25zIiwiaGFzQ3JlYXRlZEZpZWxkIiwiY3JlYXRlZEZpZWxkTmFtZSIsImhhc1VwZGF0ZWRGaWVsZCIsInVwZGF0ZWRGaWVsZE5hbWUiLCJjcmVhdGVDbGFzc0RlZmluaXRpb24iLCJkZWZpbml0aW9uIiwiZmllbGRzIiwiZXZlbnRzIiwiYmVmb3JlSW5zZXJ0IiwiZSIsImRvYyIsImN1cnJlbnRUYXJnZXQiLCJDbGFzcyIsImNvbnN0cnVjdG9yIiwic2V0Q3JlYXRpb25EYXRlIiwiYmVmb3JlVXBkYXRlIiwic2V0TW9kaWZpY2F0aW9uRGF0ZSIsInR5cGUiLCJEYXRlIiwiaW1tdXRhYmxlIiwib3B0aW9uYWwiLCJhcHBseSIsImV4dGVuZCIsImRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLHdCQUFSLENBQWIsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJQyxRQUFKO0FBQWFILE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSx1QkFBUixDQUFiLEVBQThDO0FBQUNDLFdBQVNDLENBQVQsRUFBVztBQUFDRCxlQUFTQyxDQUFUO0FBQVc7O0FBQXhCLENBQTlDLEVBQXdFLENBQXhFO0FBRWJELFNBQVNFLE1BQVQsQ0FBZ0I7QUFDZEMsUUFBTSxXQURRO0FBRWRDLFdBQVM7QUFDUEMscUJBQWlCLElBRFY7QUFFUEMsc0JBQWtCLFdBRlg7QUFHUEMscUJBQWlCLElBSFY7QUFJUEMsc0JBQWtCO0FBSlgsR0FGSztBQVFkQyx5QkFBdUIsWUFBVztBQUNoQyxVQUFNQyxhQUFhO0FBQ2pCQyxjQUFRLEVBRFM7QUFFakJDLGNBQVE7QUFDTkMsc0JBQWVDLENBQUQsSUFBTztBQUNuQixjQUFJQyxNQUFNRCxFQUFFRSxhQUFaO0FBQ0EsY0FBSUMsUUFBUUYsSUFBSUcsV0FBaEI7QUFDQSxlQUFLQyxlQUFMLENBQXFCSixHQUFyQjtBQUNELFNBTEs7QUFNTkssc0JBQWVOLENBQUQsSUFBTztBQUNuQixjQUFJQyxNQUFNRCxFQUFFRSxhQUFaO0FBQ0EsY0FBSUMsUUFBUUYsSUFBSUcsV0FBaEI7QUFDQSxlQUFLRyxtQkFBTCxDQUF5Qk4sR0FBekI7QUFDRDtBQVZLO0FBRlMsS0FBbkI7O0FBZ0JBLFFBQUksS0FBS1gsT0FBTCxDQUFhQyxlQUFqQixFQUFrQztBQUNoQztBQUNBSyxpQkFBV0MsTUFBWCxDQUFrQixLQUFLUCxPQUFMLENBQWFFLGdCQUEvQixJQUFtRDtBQUNqRGdCLGNBQU1DLElBRDJDO0FBRWpEQyxtQkFBVyxJQUZzQztBQUdqREMsa0JBQVU7QUFIdUMsT0FBbkQ7QUFLRDs7QUFFRCxRQUFJLEtBQUtyQixPQUFMLENBQWFHLGVBQWpCLEVBQWtDO0FBQ2hDO0FBQ0FHLGlCQUFXQyxNQUFYLENBQWtCLEtBQUtQLE9BQUwsQ0FBYUksZ0JBQS9CLElBQW1EO0FBQ2pEYyxjQUFNQyxJQUQyQztBQUVqREUsa0JBQVU7QUFGdUMsT0FBbkQ7QUFJRDs7QUFFRCxXQUFPZixVQUFQO0FBQ0QsR0EzQ2E7QUE0Q2RnQixTQUFPLFVBQVNULEtBQVQsRUFBZ0I7QUFDckJBLFVBQU1VLE1BQU4sQ0FBYSxLQUFLbEIscUJBQUwsRUFBYixFQUEyQyxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQTNDO0FBQ0QsR0E5Q2E7QUErQ2RVLG1CQUFpQixVQUFTSixHQUFULEVBQWM7QUFDN0I7QUFDQSxVQUFNYSxPQUFPLElBQUlMLElBQUosRUFBYixDQUY2QixDQUk3Qjs7QUFDQSxRQUFJLEtBQUtuQixPQUFMLENBQWFDLGVBQWpCLEVBQWtDO0FBQ2hDO0FBQ0FVLFVBQUksS0FBS1gsT0FBTCxDQUFhRSxnQkFBakIsSUFBcUNzQixJQUFyQztBQUNEOztBQUVELFFBQUksS0FBS3hCLE9BQUwsQ0FBYUcsZUFBakIsRUFBa0M7QUFDaEM7QUFDQVEsVUFBSSxLQUFLWCxPQUFMLENBQWFJLGdCQUFqQixJQUFxQ29CLElBQXJDO0FBQ0Q7QUFDRixHQTdEYTtBQThEZFAsdUJBQXFCLFVBQVNOLEdBQVQsRUFBYztBQUNqQztBQUNBLFVBQU1hLE9BQU8sSUFBSUwsSUFBSixFQUFiLENBRmlDLENBSWpDOztBQUNBLFFBQUksS0FBS25CLE9BQUwsQ0FBYUcsZUFBakIsRUFBa0M7QUFDaEM7QUFDQVEsVUFBSSxLQUFLWCxPQUFMLENBQWFJLGdCQUFqQixJQUFxQ29CLElBQXJDO0FBQ0Q7QUFDRjtBQXZFYSxDQUFoQixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9qYWdpX2FzdHJvbm9teS10aW1lc3RhbXAtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vYmVoYXZpb3IvYmVoYXZpb3IuanMnOyIsImltcG9ydCB7IEJlaGF2aW9yIH0gZnJvbSAnbWV0ZW9yL2phZ2k6YXN0cm9ub215JztcblxuQmVoYXZpb3IuY3JlYXRlKHtcbiAgbmFtZTogJ3RpbWVzdGFtcCcsXG4gIG9wdGlvbnM6IHtcbiAgICBoYXNDcmVhdGVkRmllbGQ6IHRydWUsXG4gICAgY3JlYXRlZEZpZWxkTmFtZTogJ2NyZWF0ZWRBdCcsXG4gICAgaGFzVXBkYXRlZEZpZWxkOiB0cnVlLFxuICAgIHVwZGF0ZWRGaWVsZE5hbWU6ICd1cGRhdGVkQXQnXG4gIH0sXG4gIGNyZWF0ZUNsYXNzRGVmaW5pdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHtcbiAgICAgIGZpZWxkczoge30sXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgYmVmb3JlSW5zZXJ0OiAoZSkgPT4ge1xuICAgICAgICAgIHZhciBkb2MgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgdmFyIENsYXNzID0gZG9jLmNvbnN0cnVjdG9yO1xuICAgICAgICAgIHRoaXMuc2V0Q3JlYXRpb25EYXRlKGRvYyk7XG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZVVwZGF0ZTogKGUpID0+IHtcbiAgICAgICAgICB2YXIgZG9jID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgICAgIHZhciBDbGFzcyA9IGRvYy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICB0aGlzLnNldE1vZGlmaWNhdGlvbkRhdGUoZG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc0NyZWF0ZWRGaWVsZCkge1xuICAgICAgLy8gQWRkIGEgZmllbGQgZm9yIHN0b3JpbmcgYSBjcmVhdGlvbiBkYXRlLlxuICAgICAgZGVmaW5pdGlvbi5maWVsZHNbdGhpcy5vcHRpb25zLmNyZWF0ZWRGaWVsZE5hbWVdID0ge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBpbW11dGFibGU6IHRydWUsXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzVXBkYXRlZEZpZWxkKSB7XG4gICAgICAvLyBBZGQgYSBmaWVsZCBmb3Igc3RvcmluZyBhbiB1cGRhdGUgZGF0ZS5cbiAgICAgIGRlZmluaXRpb24uZmllbGRzW3RoaXMub3B0aW9ucy51cGRhdGVkRmllbGROYW1lXSA9IHtcbiAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmluaXRpb247XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbihDbGFzcykge1xuICAgIENsYXNzLmV4dGVuZCh0aGlzLmNyZWF0ZUNsYXNzRGVmaW5pdGlvbigpLCBbJ2ZpZWxkcycsICdldmVudHMnXSk7XG4gIH0sXG4gIHNldENyZWF0aW9uRGF0ZTogZnVuY3Rpb24oZG9jKSB7XG4gICAgLy8gR2V0IGN1cnJlbnQgZGF0ZS5cbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgIC8vIElmIHRoZSBcImhhc0NyZWF0ZWRGaWVsZFwiIG9wdGlvbiBpcyBzZXQuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYXNDcmVhdGVkRmllbGQpIHtcbiAgICAgIC8vIFNldCB2YWx1ZSBmb3IgY3JlYXRlZCBmaWVsZC5cbiAgICAgIGRvY1t0aGlzLm9wdGlvbnMuY3JlYXRlZEZpZWxkTmFtZV0gPSBkYXRlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzVXBkYXRlZEZpZWxkKSB7XG4gICAgICAvLyBTZXQgdmFsdWUgZm9yIHRoZSBcInVwZGF0ZWRBdFwiIGZpZWxkLlxuICAgICAgZG9jW3RoaXMub3B0aW9ucy51cGRhdGVkRmllbGROYW1lXSA9IGRhdGU7XG4gICAgfVxuICB9LFxuICBzZXRNb2RpZmljYXRpb25EYXRlOiBmdW5jdGlvbihkb2MpIHtcbiAgICAvLyBHZXQgY3VycmVudCBkYXRlLlxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgLy8gSWYgdGhlIFwiaGFzVXBkYXRlZEZpZWxkXCIgb3B0aW9uIGlzIHNldC5cbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc1VwZGF0ZWRGaWVsZCkge1xuICAgICAgLy8gU2V0IHZhbHVlIGZvciB0aGUgXCJ1cGRhdGVkQXRcIiBmaWVsZC5cbiAgICAgIGRvY1t0aGlzLm9wdGlvbnMudXBkYXRlZEZpZWxkTmFtZV0gPSBkYXRlO1xuICAgIH1cbiAgfVxufSk7Il19
