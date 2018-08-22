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
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ValidationError;

var require = meteorInstall({"node_modules":{"meteor":{"mdg:validation-error":{"validation-error.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/mdg_validation-error/validation-error.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// The "details" property of the ValidationError must be an array of objects
// containing at least two properties. The "name" and "type" properties are
// required.
const errorsPattern = [Match.ObjectIncluding({
  name: String,
  type: String
})];
ValidationError = class extends Meteor.Error {
  constructor(errors) {
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ValidationError.DEFAULT_MESSAGE;
    check(errors, errorsPattern);
    check(message, String);
    return super(ValidationError.ERROR_CODE, message, errors);
  } // Static method checking if a given Meteor.Error is an instance of
  // ValidationError.


  static is(err) {
    return err instanceof Meteor.Error && err.error === ValidationError.ERROR_CODE;
  }

}; // Universal validation error code to be use in applications and packages.

ValidationError.ERROR_CODE = 'validation-error'; // Default validation error message that can be changed globally.

ValidationError.DEFAULT_MESSAGE = 'Validation failed';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/mdg:validation-error/validation-error.js");

/* Exports */
Package._define("mdg:validation-error", {
  ValidationError: ValidationError
});

})();
