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
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"ecmascript-runtime-client":{"modern.js":function(require){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/ecmascript-runtime-client/modern.js                         //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
try {
  require("core-js/modules/es7.object.get-own-property-descriptors");
} catch (e) {
  throw new Error([
    "The core-js npm package could not be found in your node_modules ",
    "directory. Please run the following command to install it:",
    "",
    "  meteor npm install --save core-js",
    ""
  ].join("\n"));
}

require("core-js/modules/es6.object.is");
require("core-js/modules/es6.function.name");
require("core-js/modules/es6.number.is-finite");
require("core-js/modules/es6.number.is-nan");
require("core-js/modules/es7.array.flatten");
require("core-js/modules/es7.array.flat-map");
require("core-js/modules/es7.object.values");
require("core-js/modules/es7.object.entries");
require("core-js/modules/es7.string.pad-start");
require("core-js/modules/es7.string.pad-end");

//////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/ecmascript-runtime-client/modern.js");

/* Exports */
Package._define("ecmascript-runtime-client", exports);

})();
