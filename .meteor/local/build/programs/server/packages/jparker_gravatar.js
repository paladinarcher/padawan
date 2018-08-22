(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var CryptoJS = Package['jparker:crypto-core'].CryptoJS;

/* Package-scope variables */
var Gravatar;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/jparker_gravatar/gravatar.js                                        //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/* global CryptoJS, _ */

Gravatar = { // eslint-disable-line no-undef
  /**
   * `cleantString` remove starting and trailing whitespaces
   * and lowercase the input
   * @param  {String} string input string that may contain leading and trailing
   * whitespaces and uppercase letters
   * @return {String}        output cleaned string
   */
  cleanString: function (string) {
    return string.trim().toLowerCase()
  },

  /**
   * `isHash` check if a string match the MD5 form :
   * 32 chars string containing letters from `a` to `f`
   * and digits from `0` to `9`
   * @param  {String}  string that might be a hash
   * @return {Boolean}
   */
  isHash: function (string) {
    var self = this
    return /^[a-f0-9]{32}$/i.test(self.cleanString(string))
  },

  /**
   * `hash` takes an input and run it through `CryptoJS.MD5`
   * @see https://atmospherejs.com/jparker/crypto-md5
   * @param  {String} string input string
   * @return {String}        md5 hash of the input
   */
  hash: function (string) {
    var self = this
    return CryptoJS.MD5(self.cleanString(string)).toString()
  },

  /**
   * `imageUrl` will provide the url for the avatar, given an email or a hash
   * and a set of options to be passed to the gravatar API
   * @see https://en.gravatar.com/site/implement/images/
   * @param  {String} emailOrHash email or pregenerated MD5 hash to query
   * gravatar with.
   * @param  {Object} options     options to be passed to gravatar in the query
   * string. The `secure` will be used to determine which base url to use.
   * @return {String}             complete url to the avatar
   */
  imageUrl: function (emailOrHash, options) {
    var self = this
    options = options || {}

    // Want HTTPS ?
    var url = options.secure
    ? 'https://secure.gravatar.com/avatar/'
    : 'http://www.gravatar.com/avatar/'
    delete options.secure

    // Is it an MD5 already ?
    url += self.isHash(emailOrHash)
    ? emailOrHash
    : self.hash(emailOrHash)

    // Have any options to pass ?
    var params = _.map(options, function (val, key) {
      return key + '=' + encodeURIComponent(val)
    }).join('&')

    return (params.length > 0)
    ? url + '?' + params
    : url
  }
}

//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("jparker:gravatar", {
  Gravatar: Gravatar
});

})();
