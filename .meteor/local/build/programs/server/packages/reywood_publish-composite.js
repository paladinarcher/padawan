(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var enableDebugLogging, publishComposite;

var require = meteorInstall({"node_modules":{"meteor":{"reywood:publish-composite":{"lib":{"publish_composite.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publish_composite.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  enableDebugLogging: () => enableDebugLogging,
  publishComposite: () => publishComposite
});

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Publication;
module.watch(require("./publication"), {
  default(v) {
    Publication = v;
  }

}, 2);
let Subscription;
module.watch(require("./subscription"), {
  default(v) {
    Subscription = v;
  }

}, 3);
let debugLog, enableDebugLogging;
module.watch(require("./logging"), {
  debugLog(v) {
    debugLog = v;
  },

  enableDebugLogging(v) {
    enableDebugLogging = v;
  }

}, 4);

function publishComposite(name, options) {
  return Meteor.publish(name, function publish(...args) {
    const subscription = new Subscription(this);
    const instanceOptions = prepareOptions.call(this, options, args);
    const publications = [];
    instanceOptions.forEach(opt => {
      const pub = new Publication(subscription, opt);
      pub.publish();
      publications.push(pub);
    });
    this.onStop(() => {
      publications.forEach(pub => pub.unpublish());
    });
    debugLog('Meteor.publish', 'ready');
    this.ready();
  });
} // For backwards compatibility


Meteor.publishComposite = publishComposite;

function prepareOptions(options, args) {
  let preparedOptions = options;

  if (typeof preparedOptions === 'function') {
    preparedOptions = preparedOptions.apply(this, args);
  }

  if (!preparedOptions) {
    return [];
  }

  if (!_.isArray(preparedOptions)) {
    preparedOptions = [preparedOptions];
  }

  return preparedOptions;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_ref_counter.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/doc_ref_counter.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class DocumentRefCounter {
  constructor(observer) {
    this.heap = {};
    this.observer = observer;
  }

  increment(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (!this.heap[key]) {
      this.heap[key] = 0;
    }

    this.heap[key] += 1;
  }

  decrement(collectionName, docId) {
    const key = `${collectionName}:${docId.valueOf()}`;

    if (this.heap[key]) {
      this.heap[key] -= 1;
      this.observer.onChange(collectionName, docId, this.heap[key]);
    }
  }

}

module.exportDefault(DocumentRefCounter);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"logging.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/logging.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  debugLog: () => debugLog,
  enableDebugLogging: () => enableDebugLogging
});

/* eslint-disable no-console */
let debugLoggingEnabled = false;

function debugLog(source, message) {
  if (!debugLoggingEnabled) {
    return;
  }

  let paddedSource = source;

  while (paddedSource.length < 35) {
    paddedSource += ' ';
  }

  console.log(`[${paddedSource}] ${message}`);
}

function enableDebugLogging() {
  debugLoggingEnabled = true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publication.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/publication.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Match, check;
module.watch(require("meteor/check"), {
  Match(v) {
    Match = v;
  },

  check(v) {
    check = v;
  }

}, 1);

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 2);
let debugLog;
module.watch(require("./logging"), {
  debugLog(v) {
    debugLog = v;
  }

}, 3);
let PublishedDocumentList;
module.watch(require("./published_document_list"), {
  default(v) {
    PublishedDocumentList = v;
  }

}, 4);

class Publication {
  constructor(subscription, options, args) {
    check(options, {
      find: Function,
      children: Match.Optional(Match.OneOf([Object], Function)),
      collectionName: Match.Optional(String)
    });
    this.subscription = subscription;
    this.options = options;
    this.args = args || [];
    this.childrenOptions = options.children || [];
    this.publishedDocs = new PublishedDocumentList();
    this.collectionName = options.collectionName;
  }

  publish() {
    this.cursor = this._getCursor();

    if (!this.cursor) {
      return;
    }

    const collectionName = this._getCollectionName(); // Use Meteor.bindEnvironment to make sure the callbacks are run with the same
    // environmentVariables as when publishing the "parent".
    // It's only needed when publish is being recursively run.


    this.observeHandle = this.cursor.observe({
      added: Meteor.bindEnvironment(doc => {
        const alreadyPublished = this.publishedDocs.has(doc._id);

        if (alreadyPublished) {
          debugLog('Publication.observeHandle.added', `${collectionName}:${doc._id} already published`);
          this.publishedDocs.unflagForRemoval(doc._id);

          this._republishChildrenOf(doc);

          this.subscription.changed(collectionName, doc._id, doc);
        } else {
          this.publishedDocs.add(collectionName, doc._id);

          this._publishChildrenOf(doc);

          this.subscription.added(collectionName, doc);
        }
      }),
      changed: Meteor.bindEnvironment(newDoc => {
        debugLog('Publication.observeHandle.changed', `${collectionName}:${newDoc._id}`);

        this._republishChildrenOf(newDoc);
      }),
      removed: doc => {
        debugLog('Publication.observeHandle.removed', `${collectionName}:${doc._id}`);

        this._removeDoc(collectionName, doc._id);
      }
    });
    this.observeChangesHandle = this.cursor.observeChanges({
      changed: (id, fields) => {
        debugLog('Publication.observeChangesHandle.changed', `${collectionName}:${id}`);
        this.subscription.changed(collectionName, id, fields);
      }
    });
  }

  unpublish() {
    debugLog('Publication.unpublish', this._getCollectionName());

    this._stopObservingCursor();

    this._unpublishAllDocuments();
  }

  _republish() {
    this._stopObservingCursor();

    this.publishedDocs.flagAllForRemoval();
    debugLog('Publication._republish', 'run .publish again');
    this.publish();
    debugLog('Publication._republish', 'unpublish docs from old cursor');

    this._removeFlaggedDocs();
  }

  _getCursor() {
    return this.options.find.apply(this.subscription.meteorSub, this.args);
  }

  _getCollectionName() {
    return this.collectionName || this.cursor && this.cursor._getCollectionName();
  }

  _publishChildrenOf(doc) {
    const children = _.isFunction(this.childrenOptions) ? this.childrenOptions(doc, ...this.args) : this.childrenOptions;

    _.each(children, function createChildPublication(options) {
      const pub = new Publication(this.subscription, options, [doc].concat(this.args));
      this.publishedDocs.addChildPub(doc._id, pub);
      pub.publish();
    }, this);
  }

  _republishChildrenOf(doc) {
    this.publishedDocs.eachChildPub(doc._id, publication => {
      publication.args[0] = doc;

      publication._republish();
    });
  }

  _unpublishAllDocuments() {
    this.publishedDocs.eachDocument(doc => {
      this._removeDoc(doc.collectionName, doc.docId);
    }, this);
  }

  _stopObservingCursor() {
    debugLog('Publication._stopObservingCursor', 'stop observing cursor');

    if (this.observeHandle) {
      this.observeHandle.stop();
      delete this.observeHandle;
    }

    if (this.observeChangesHandle) {
      this.observeChangesHandle.stop();
      delete this.observeChangesHandle;
    }
  }

  _removeFlaggedDocs() {
    this.publishedDocs.eachDocument(doc => {
      if (doc.isFlaggedForRemoval()) {
        this._removeDoc(doc.collectionName, doc.docId);
      }
    }, this);
  }

  _removeDoc(collectionName, docId) {
    this.subscription.removed(collectionName, docId);

    this._unpublishChildrenOf(docId);

    this.publishedDocs.remove(docId);
  }

  _unpublishChildrenOf(docId) {
    debugLog('Publication._unpublishChildrenOf', `unpublishing children of ${this._getCollectionName()}:${docId}`);
    this.publishedDocs.eachChildPub(docId, publication => {
      publication.unpublish();
    });
  }

}

module.exportDefault(Publication);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"subscription.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/subscription.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 0);
let DocumentRefCounter;
module.watch(require("./doc_ref_counter"), {
  default(v) {
    DocumentRefCounter = v;
  }

}, 1);
let debugLog;
module.watch(require("./logging"), {
  debugLog(v) {
    debugLog = v;
  }

}, 2);

class Subscription {
  constructor(meteorSub) {
    this.meteorSub = meteorSub;
    this.docHash = {};
    this.refCounter = new DocumentRefCounter({
      onChange: (collectionName, docId, refCount) => {
        debugLog('Subscription.refCounter.onChange', `${collectionName}:${docId.valueOf()} ${refCount}`);

        if (refCount <= 0) {
          meteorSub.removed(collectionName, docId);

          this._removeDocHash(collectionName, docId);
        }
      }
    });
  }

  added(collectionName, doc) {
    this.refCounter.increment(collectionName, doc._id);

    if (this._hasDocChanged(collectionName, doc._id, doc)) {
      debugLog('Subscription.added', `${collectionName}:${doc._id}`);
      this.meteorSub.added(collectionName, doc._id, doc);

      this._addDocHash(collectionName, doc);
    }
  }

  changed(collectionName, id, changes) {
    if (this._shouldSendChanges(collectionName, id, changes)) {
      debugLog('Subscription.changed', `${collectionName}:${id}`);
      this.meteorSub.changed(collectionName, id, changes);

      this._updateDocHash(collectionName, id, changes);
    }
  }

  removed(collectionName, id) {
    debugLog('Subscription.removed', `${collectionName}:${id.valueOf()}`);
    this.refCounter.decrement(collectionName, id);
  }

  _addDocHash(collectionName, doc) {
    this.docHash[buildHashKey(collectionName, doc._id)] = doc;
  }

  _updateDocHash(collectionName, id, changes) {
    const key = buildHashKey(collectionName, id);
    const existingDoc = this.docHash[key] || {};
    this.docHash[key] = _.extend(existingDoc, changes);
  }

  _shouldSendChanges(collectionName, id, changes) {
    return this._isDocPublished(collectionName, id) && this._hasDocChanged(collectionName, id, changes);
  }

  _isDocPublished(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    return !!this.docHash[key];
  }

  _hasDocChanged(collectionName, id, doc) {
    const existingDoc = this.docHash[buildHashKey(collectionName, id)];

    if (!existingDoc) {
      return true;
    }

    return _.any(_.keys(doc), key => !_.isEqual(doc[key], existingDoc[key]));
  }

  _removeDocHash(collectionName, id) {
    const key = buildHashKey(collectionName, id);
    delete this.docHash[key];
  }

}

function buildHashKey(collectionName, id) {
  return `${collectionName}::${id.valueOf()}`;
}

module.exportDefault(Subscription);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document.js                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
class PublishedDocument {
  constructor(collectionName, docId) {
    this.collectionName = collectionName;
    this.docId = docId;
    this.childPublications = [];
    this._isFlaggedForRemoval = false;
  }

  addChildPub(childPublication) {
    this.childPublications.push(childPublication);
  }

  eachChildPub(callback) {
    this.childPublications.forEach(callback);
  }

  isFlaggedForRemoval() {
    return this._isFlaggedForRemoval;
  }

  unflagForRemoval() {
    this._isFlaggedForRemoval = false;
  }

  flagForRemoval() {
    this._isFlaggedForRemoval = true;
  }

}

module.exportDefault(PublishedDocument);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document_list.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/reywood_publish-composite/lib/published_document_list.js                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 0);
let PublishedDocument;
module.watch(require("./published_document"), {
  default(v) {
    PublishedDocument = v;
  }

}, 1);

class PublishedDocumentList {
  constructor() {
    this.documents = {};
  }

  add(collectionName, docId) {
    const key = valueOfId(docId);

    if (!this.documents[key]) {
      this.documents[key] = new PublishedDocument(collectionName, docId);
    }
  }

  addChildPub(docId, publication) {
    if (!publication) {
      return;
    }

    const key = valueOfId(docId);
    const doc = this.documents[key];

    if (typeof doc === 'undefined') {
      throw new Error(`Doc not found in list: ${key}`);
    }

    this.documents[key].addChildPub(publication);
  }

  get(docId) {
    const key = valueOfId(docId);
    return this.documents[key];
  }

  remove(docId) {
    const key = valueOfId(docId);
    delete this.documents[key];
  }

  has(docId) {
    return !!this.get(docId);
  }

  eachDocument(callback, context) {
    _.each(this.documents, function execCallbackOnDoc(doc) {
      callback.call(this, doc);
    }, context || this);
  }

  eachChildPub(docId, callback) {
    const doc = this.get(docId);

    if (doc) {
      doc.eachChildPub(callback);
    }
  }

  getIds() {
    const docIds = [];
    this.eachDocument(doc => {
      docIds.push(doc.docId);
    });
    return docIds;
  }

  unflagForRemoval(docId) {
    const doc = this.get(docId);

    if (doc) {
      doc.unflagForRemoval();
    }
  }

  flagAllForRemoval() {
    this.eachDocument(doc => {
      doc.flagForRemoval();
    });
  }

}

function valueOfId(docId) {
  if (docId === null) {
    throw new Error('Document ID is null');
  }

  if (typeof docId === 'undefined') {
    throw new Error('Document ID is undefined');
  }

  return docId.valueOf();
}

module.exportDefault(PublishedDocumentList);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/reywood:publish-composite/lib/publish_composite.js");
require("/node_modules/meteor/reywood:publish-composite/lib/doc_ref_counter.js");
require("/node_modules/meteor/reywood:publish-composite/lib/logging.js");
require("/node_modules/meteor/reywood:publish-composite/lib/publication.js");
require("/node_modules/meteor/reywood:publish-composite/lib/subscription.js");

/* Exports */
Package._define("reywood:publish-composite", exports, {
  enableDebugLogging: enableDebugLogging,
  publishComposite: publishComposite
});

})();

//# sourceURL=meteor://💻app/packages/reywood_publish-composite.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaF9jb21wb3NpdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL2RvY19yZWZfY291bnRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvbG9nZ2luZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL3N1YnNjcmlwdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaGVkX2RvY3VtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9yZXl3b29kOnB1Ymxpc2gtY29tcG9zaXRlL2xpYi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJlbmFibGVEZWJ1Z0xvZ2dpbmciLCJwdWJsaXNoQ29tcG9zaXRlIiwiXyIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJNZXRlb3IiLCJQdWJsaWNhdGlvbiIsImRlZmF1bHQiLCJTdWJzY3JpcHRpb24iLCJkZWJ1Z0xvZyIsIm5hbWUiLCJvcHRpb25zIiwicHVibGlzaCIsImFyZ3MiLCJzdWJzY3JpcHRpb24iLCJpbnN0YW5jZU9wdGlvbnMiLCJwcmVwYXJlT3B0aW9ucyIsImNhbGwiLCJwdWJsaWNhdGlvbnMiLCJmb3JFYWNoIiwib3B0IiwicHViIiwicHVzaCIsIm9uU3RvcCIsInVucHVibGlzaCIsInJlYWR5IiwicHJlcGFyZWRPcHRpb25zIiwiYXBwbHkiLCJpc0FycmF5IiwiRG9jdW1lbnRSZWZDb3VudGVyIiwiY29uc3RydWN0b3IiLCJvYnNlcnZlciIsImhlYXAiLCJpbmNyZW1lbnQiLCJjb2xsZWN0aW9uTmFtZSIsImRvY0lkIiwia2V5IiwidmFsdWVPZiIsImRlY3JlbWVudCIsIm9uQ2hhbmdlIiwiZXhwb3J0RGVmYXVsdCIsImRlYnVnTG9nZ2luZ0VuYWJsZWQiLCJzb3VyY2UiLCJtZXNzYWdlIiwicGFkZGVkU291cmNlIiwibGVuZ3RoIiwiY29uc29sZSIsImxvZyIsIk1hdGNoIiwiY2hlY2siLCJQdWJsaXNoZWREb2N1bWVudExpc3QiLCJmaW5kIiwiRnVuY3Rpb24iLCJjaGlsZHJlbiIsIk9wdGlvbmFsIiwiT25lT2YiLCJPYmplY3QiLCJTdHJpbmciLCJjaGlsZHJlbk9wdGlvbnMiLCJwdWJsaXNoZWREb2NzIiwiY3Vyc29yIiwiX2dldEN1cnNvciIsIl9nZXRDb2xsZWN0aW9uTmFtZSIsIm9ic2VydmVIYW5kbGUiLCJvYnNlcnZlIiwiYWRkZWQiLCJiaW5kRW52aXJvbm1lbnQiLCJkb2MiLCJhbHJlYWR5UHVibGlzaGVkIiwiaGFzIiwiX2lkIiwidW5mbGFnRm9yUmVtb3ZhbCIsIl9yZXB1Ymxpc2hDaGlsZHJlbk9mIiwiY2hhbmdlZCIsImFkZCIsIl9wdWJsaXNoQ2hpbGRyZW5PZiIsIm5ld0RvYyIsInJlbW92ZWQiLCJfcmVtb3ZlRG9jIiwib2JzZXJ2ZUNoYW5nZXNIYW5kbGUiLCJvYnNlcnZlQ2hhbmdlcyIsImlkIiwiZmllbGRzIiwiX3N0b3BPYnNlcnZpbmdDdXJzb3IiLCJfdW5wdWJsaXNoQWxsRG9jdW1lbnRzIiwiX3JlcHVibGlzaCIsImZsYWdBbGxGb3JSZW1vdmFsIiwiX3JlbW92ZUZsYWdnZWREb2NzIiwibWV0ZW9yU3ViIiwiaXNGdW5jdGlvbiIsImVhY2giLCJjcmVhdGVDaGlsZFB1YmxpY2F0aW9uIiwiY29uY2F0IiwiYWRkQ2hpbGRQdWIiLCJlYWNoQ2hpbGRQdWIiLCJwdWJsaWNhdGlvbiIsImVhY2hEb2N1bWVudCIsInN0b3AiLCJpc0ZsYWdnZWRGb3JSZW1vdmFsIiwiX3VucHVibGlzaENoaWxkcmVuT2YiLCJyZW1vdmUiLCJkb2NIYXNoIiwicmVmQ291bnRlciIsInJlZkNvdW50IiwiX3JlbW92ZURvY0hhc2giLCJfaGFzRG9jQ2hhbmdlZCIsIl9hZGREb2NIYXNoIiwiY2hhbmdlcyIsIl9zaG91bGRTZW5kQ2hhbmdlcyIsIl91cGRhdGVEb2NIYXNoIiwiYnVpbGRIYXNoS2V5IiwiZXhpc3RpbmdEb2MiLCJleHRlbmQiLCJfaXNEb2NQdWJsaXNoZWQiLCJhbnkiLCJrZXlzIiwiaXNFcXVhbCIsIlB1Ymxpc2hlZERvY3VtZW50IiwiY2hpbGRQdWJsaWNhdGlvbnMiLCJfaXNGbGFnZ2VkRm9yUmVtb3ZhbCIsImNoaWxkUHVibGljYXRpb24iLCJjYWxsYmFjayIsImZsYWdGb3JSZW1vdmFsIiwiZG9jdW1lbnRzIiwidmFsdWVPZklkIiwiRXJyb3IiLCJnZXQiLCJjb250ZXh0IiwiZXhlY0NhbGxiYWNrT25Eb2MiLCJnZXRJZHMiLCJkb2NJZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsTUFBUCxDQUFjO0FBQUNDLHNCQUFtQixNQUFJQSxrQkFBeEI7QUFBMkNDLG9CQUFpQixNQUFJQTtBQUFoRSxDQUFkOztBQUFpRyxJQUFJQyxDQUFKOztBQUFNSixPQUFPSyxLQUFQLENBQWFDLFFBQVEsbUJBQVIsQ0FBYixFQUEwQztBQUFDRixJQUFFRyxDQUFGLEVBQUk7QUFBQ0gsUUFBRUcsQ0FBRjtBQUFJOztBQUFWLENBQTFDLEVBQXNELENBQXREO0FBQXlELElBQUlDLE1BQUo7QUFBV1IsT0FBT0ssS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDRSxTQUFPRCxDQUFQLEVBQVM7QUFBQ0MsYUFBT0QsQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJRSxXQUFKO0FBQWdCVCxPQUFPSyxLQUFQLENBQWFDLFFBQVEsZUFBUixD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LFVBQU0sSUFBSTBGLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQ0g7O0FBQ0QsTUFBSSxPQUFPMUYsS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUM5QixVQUFNLElBQUkwRixLQUFKLENBQVUsMEJBQVYsQ0FBTjtBQUNIOztBQUNELFNBQU8xRixNQUFNRSxPQUFOLEVBQVA7QUFDSDs7QUE1RkR4QyxPQUFPMkMsYUFBUCxDQThGZVUscUJBOUZmLEUiLCJmaWxlIjoiL3BhY2thZ2VzL3JleXdvb2RfcHVibGlzaC1jb21wb3NpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmltcG9ydCBQdWJsaWNhdGlvbiBmcm9tICcuL3B1YmxpY2F0aW9uJztcbmltcG9ydCBTdWJzY3JpcHRpb24gZnJvbSAnLi9zdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgZGVidWdMb2csIGVuYWJsZURlYnVnTG9nZ2luZyB9IGZyb20gJy4vbG9nZ2luZyc7XG5cblxuZnVuY3Rpb24gcHVibGlzaENvbXBvc2l0ZShuYW1lLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIE1ldGVvci5wdWJsaXNoKG5hbWUsIGZ1bmN0aW9uIHB1Ymxpc2goLi4uYXJncykge1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZU9wdGlvbnMgPSBwcmVwYXJlT3B0aW9ucy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICBjb25zdCBwdWJsaWNhdGlvbnMgPSBbXTtcblxuICAgICAgICBpbnN0YW5jZU9wdGlvbnMuZm9yRWFjaCgob3B0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwdWIgPSBuZXcgUHVibGljYXRpb24oc3Vic2NyaXB0aW9uLCBvcHQpO1xuICAgICAgICAgICAgcHViLnB1Ymxpc2goKTtcbiAgICAgICAgICAgIHB1YmxpY2F0aW9ucy5wdXNoKHB1Yik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub25TdG9wKCgpID0+IHtcbiAgICAgICAgICAgIHB1YmxpY2F0aW9ucy5mb3JFYWNoKHB1YiA9PiBwdWIudW5wdWJsaXNoKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZWJ1Z0xvZygnTWV0ZW9yLnB1Ymxpc2gnLCAncmVhZHknKTtcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH0pO1xufVxuXG4vLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbk1ldGVvci5wdWJsaXNoQ29tcG9zaXRlID0gcHVibGlzaENvbXBvc2l0ZTtcblxuZnVuY3Rpb24gcHJlcGFyZU9wdGlvbnMob3B0aW9ucywgYXJncykge1xuICAgIGxldCBwcmVwYXJlZE9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgaWYgKHR5cGVvZiBwcmVwYXJlZE9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJlcGFyZWRPcHRpb25zID0gcHJlcGFyZWRPcHRpb25zLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIGlmICghcHJlcGFyZWRPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAoIV8uaXNBcnJheShwcmVwYXJlZE9wdGlvbnMpKSB7XG4gICAgICAgIHByZXBhcmVkT3B0aW9ucyA9IFtwcmVwYXJlZE9wdGlvbnNdO1xuICAgIH1cblxuICAgIHJldHVybiBwcmVwYXJlZE9wdGlvbnM7XG59XG5cblxuZXhwb3J0IHtcbiAgICBlbmFibGVEZWJ1Z0xvZ2dpbmcsXG4gICAgcHVibGlzaENvbXBvc2l0ZSxcbn07XG4iLCJjbGFzcyBEb2N1bWVudFJlZkNvdW50ZXIge1xuICAgIGNvbnN0cnVjdG9yKG9ic2VydmVyKSB7XG4gICAgICAgIHRoaXMuaGVhcCA9IHt9O1xuICAgICAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgfVxuXG4gICAgaW5jcmVtZW50KGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2NJZC52YWx1ZU9mKCl9YDtcbiAgICAgICAgaWYgKCF0aGlzLmhlYXBba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5oZWFwW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVhcFtrZXldICs9IDE7XG4gICAgfVxuXG4gICAgZGVjcmVtZW50KGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2NJZC52YWx1ZU9mKCl9YDtcbiAgICAgICAgaWYgKHRoaXMuaGVhcFtrZXldKSB7XG4gICAgICAgICAgICB0aGlzLmhlYXBba2V5XSAtPSAxO1xuXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyLm9uQ2hhbmdlKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCwgdGhpcy5oZWFwW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEb2N1bWVudFJlZkNvdW50ZXI7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmxldCBkZWJ1Z0xvZ2dpbmdFbmFibGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRlYnVnTG9nKHNvdXJjZSwgbWVzc2FnZSkge1xuICAgIGlmICghZGVidWdMb2dnaW5nRW5hYmxlZCkgeyByZXR1cm47IH1cbiAgICBsZXQgcGFkZGVkU291cmNlID0gc291cmNlO1xuICAgIHdoaWxlIChwYWRkZWRTb3VyY2UubGVuZ3RoIDwgMzUpIHsgcGFkZGVkU291cmNlICs9ICcgJzsgfVxuICAgIGNvbnNvbGUubG9nKGBbJHtwYWRkZWRTb3VyY2V9XSAke21lc3NhZ2V9YCk7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnTG9nZ2luZygpIHtcbiAgICBkZWJ1Z0xvZ2dpbmdFbmFibGVkID0gdHJ1ZTtcbn1cblxuZXhwb3J0IHtcbiAgICBkZWJ1Z0xvZyxcbiAgICBlbmFibGVEZWJ1Z0xvZ2dpbmcsXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYXRjaCwgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuaW1wb3J0IHsgZGVidWdMb2cgfSBmcm9tICcuL2xvZ2dpbmcnO1xuaW1wb3J0IFB1Ymxpc2hlZERvY3VtZW50TGlzdCBmcm9tICcuL3B1Ymxpc2hlZF9kb2N1bWVudF9saXN0JztcblxuXG5jbGFzcyBQdWJsaWNhdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc3Vic2NyaXB0aW9uLCBvcHRpb25zLCBhcmdzKSB7XG4gICAgICAgIGNoZWNrKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGZpbmQ6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgY2hpbGRyZW46IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKFtPYmplY3RdLCBGdW5jdGlvbikpLFxuICAgICAgICAgICAgY29sbGVjdGlvbk5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzIHx8IFtdO1xuICAgICAgICB0aGlzLmNoaWxkcmVuT3B0aW9ucyA9IG9wdGlvbnMuY2hpbGRyZW4gfHwgW107XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcyA9IG5ldyBQdWJsaXNoZWREb2N1bWVudExpc3QoKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IG9wdGlvbnMuY29sbGVjdGlvbk5hbWU7XG4gICAgfVxuXG4gICAgcHVibGlzaCgpIHtcbiAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLl9nZXRDdXJzb3IoKTtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnNvcikgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IHRoaXMuX2dldENvbGxlY3Rpb25OYW1lKCk7XG5cbiAgICAgICAgLy8gVXNlIE1ldGVvci5iaW5kRW52aXJvbm1lbnQgdG8gbWFrZSBzdXJlIHRoZSBjYWxsYmFja3MgYXJlIHJ1biB3aXRoIHRoZSBzYW1lXG4gICAgICAgIC8vIGVudmlyb25tZW50VmFyaWFibGVzIGFzIHdoZW4gcHVibGlzaGluZyB0aGUgXCJwYXJlbnRcIi5cbiAgICAgICAgLy8gSXQncyBvbmx5IG5lZWRlZCB3aGVuIHB1Ymxpc2ggaXMgYmVpbmcgcmVjdXJzaXZlbHkgcnVuLlxuICAgICAgICB0aGlzLm9ic2VydmVIYW5kbGUgPSB0aGlzLmN1cnNvci5vYnNlcnZlKHtcbiAgICAgICAgICAgIGFkZGVkOiBNZXRlb3IuYmluZEVudmlyb25tZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbHJlYWR5UHVibGlzaGVkID0gdGhpcy5wdWJsaXNoZWREb2NzLmhhcyhkb2MuX2lkKTtcblxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5UHVibGlzaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5vYnNlcnZlSGFuZGxlLmFkZGVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH0gYWxyZWFkeSBwdWJsaXNoZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLnVuZmxhZ0ZvclJlbW92YWwoZG9jLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcHVibGlzaENoaWxkcmVuT2YoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24uY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuYWRkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHVibGlzaENoaWxkcmVuT2YoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkZWQoY29sbGVjdGlvbk5hbWUsIGRvYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjaGFuZ2VkOiBNZXRlb3IuYmluZEVudmlyb25tZW50KChuZXdEb2MpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUhhbmRsZS5jaGFuZ2VkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7bmV3RG9jLl9pZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXB1Ymxpc2hDaGlsZHJlbk9mKG5ld0RvYyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlbW92ZWQ6IChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUhhbmRsZS5yZW1vdmVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVEb2MoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZSA9IHRoaXMuY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgICAgICAgIGNoYW5nZWQ6IChpZCwgZmllbGRzKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLm9ic2VydmVDaGFuZ2VzSGFuZGxlLmNoYW5nZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtpZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5jaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVucHVibGlzaCgpIHtcbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLnVucHVibGlzaCcsIHRoaXMuX2dldENvbGxlY3Rpb25OYW1lKCkpO1xuICAgICAgICB0aGlzLl9zdG9wT2JzZXJ2aW5nQ3Vyc29yKCk7XG4gICAgICAgIHRoaXMuX3VucHVibGlzaEFsbERvY3VtZW50cygpO1xuICAgIH1cblxuICAgIF9yZXB1Ymxpc2goKSB7XG4gICAgICAgIHRoaXMuX3N0b3BPYnNlcnZpbmdDdXJzb3IoKTtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZmxhZ0FsbEZvclJlbW92YWwoKTtcblxuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3JlcHVibGlzaCcsICdydW4gLnB1Ymxpc2ggYWdhaW4nKTtcbiAgICAgICAgdGhpcy5wdWJsaXNoKCk7XG5cbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLl9yZXB1Ymxpc2gnLCAndW5wdWJsaXNoIGRvY3MgZnJvbSBvbGQgY3Vyc29yJyk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZsYWdnZWREb2NzKCk7XG4gICAgfVxuXG4gICAgX2dldEN1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maW5kLmFwcGx5KHRoaXMuc3Vic2NyaXB0aW9uLm1ldGVvclN1YiwgdGhpcy5hcmdzKTtcbiAgICB9XG5cbiAgICBfZ2V0Q29sbGVjdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb25OYW1lIHx8ICh0aGlzLmN1cnNvciAmJiB0aGlzLmN1cnNvci5fZ2V0Q29sbGVjdGlvbk5hbWUoKSk7XG4gICAgfVxuXG4gICAgX3B1Ymxpc2hDaGlsZHJlbk9mKGRvYykge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IF8uaXNGdW5jdGlvbih0aGlzLmNoaWxkcmVuT3B0aW9ucykgP1xuICAgICAgICB0aGlzLmNoaWxkcmVuT3B0aW9ucyhkb2MsIC4uLnRoaXMuYXJncykgOiB0aGlzLmNoaWxkcmVuT3B0aW9ucztcbiAgICAgICAgXy5lYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiBjcmVhdGVDaGlsZFB1YmxpY2F0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHB1YiA9IG5ldyBQdWJsaWNhdGlvbih0aGlzLnN1YnNjcmlwdGlvbiwgb3B0aW9ucywgW2RvY10uY29uY2F0KHRoaXMuYXJncykpO1xuICAgICAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmFkZENoaWxkUHViKGRvYy5faWQsIHB1Yik7XG4gICAgICAgICAgICBwdWIucHVibGlzaCgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBfcmVwdWJsaXNoQ2hpbGRyZW5PZihkb2MpIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmVhY2hDaGlsZFB1Yihkb2MuX2lkLCAocHVibGljYXRpb24pID0+IHtcbiAgICAgICAgICAgIHB1YmxpY2F0aW9uLmFyZ3NbMF0gPSBkb2M7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbi5fcmVwdWJsaXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF91bnB1Ymxpc2hBbGxEb2N1bWVudHMoKSB7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoRG9jdW1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRG9jKGRvYy5jb2xsZWN0aW9uTmFtZSwgZG9jLmRvY0lkKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3N0b3BPYnNlcnZpbmdDdXJzb3IoKSB7XG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5fc3RvcE9ic2VydmluZ0N1cnNvcicsICdzdG9wIG9ic2VydmluZyBjdXJzb3InKTtcblxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVIYW5kbGUuc3RvcCgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZUhhbmRsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVDaGFuZ2VzSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVDaGFuZ2VzSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVDaGFuZ2VzSGFuZGxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbW92ZUZsYWdnZWREb2NzKCkge1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZWFjaERvY3VtZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2MuaXNGbGFnZ2VkRm9yUmVtb3ZhbCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRG9jKGRvYy5jb2xsZWN0aW9uTmFtZSwgZG9jLmRvY0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3JlbW92ZURvYyhjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24ucmVtb3ZlZChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpO1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2hDaGlsZHJlbk9mKGRvY0lkKTtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLnJlbW92ZShkb2NJZCk7XG4gICAgfVxuXG4gICAgX3VucHVibGlzaENoaWxkcmVuT2YoZG9jSWQpIHtcbiAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLl91bnB1Ymxpc2hDaGlsZHJlbk9mJywgYHVucHVibGlzaGluZyBjaGlsZHJlbiBvZiAke3RoaXMuX2dldENvbGxlY3Rpb25OYW1lKCl9OiR7ZG9jSWR9YCk7XG5cbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmVhY2hDaGlsZFB1Yihkb2NJZCwgKHB1YmxpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbi51bnB1Ymxpc2goKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaWNhdGlvbjtcbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmltcG9ydCBEb2N1bWVudFJlZkNvdW50ZXIgZnJvbSAnLi9kb2NfcmVmX2NvdW50ZXInO1xuaW1wb3J0IHsgZGVidWdMb2cgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5cbmNsYXNzIFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3RydWN0b3IobWV0ZW9yU3ViKSB7XG4gICAgICAgIHRoaXMubWV0ZW9yU3ViID0gbWV0ZW9yU3ViO1xuICAgICAgICB0aGlzLmRvY0hhc2ggPSB7fTtcbiAgICAgICAgdGhpcy5yZWZDb3VudGVyID0gbmV3IERvY3VtZW50UmVmQ291bnRlcih7XG4gICAgICAgICAgICBvbkNoYW5nZTogKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCwgcmVmQ291bnQpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLnJlZkNvdW50ZXIub25DaGFuZ2UnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2NJZC52YWx1ZU9mKCl9ICR7cmVmQ291bnR9YCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0ZW9yU3ViLnJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZGVkKGNvbGxlY3Rpb25OYW1lLCBkb2MpIHtcbiAgICAgICAgdGhpcy5yZWZDb3VudGVyLmluY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0RvY0NoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQsIGRvYykpIHtcbiAgICAgICAgICAgIGRlYnVnTG9nKCdTdWJzY3JpcHRpb24uYWRkZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2MuX2lkfWApO1xuICAgICAgICAgICAgdGhpcy5tZXRlb3JTdWIuYWRkZWQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgICAgICB0aGlzLl9hZGREb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBkb2MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nob3VsZFNlbmRDaGFuZ2VzKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykpIHtcbiAgICAgICAgICAgIGRlYnVnTG9nKCdTdWJzY3JpcHRpb24uY2hhbmdlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2lkfWApO1xuICAgICAgICAgICAgdGhpcy5tZXRlb3JTdWIuY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlZChjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICAgICAgZGVidWdMb2coJ1N1YnNjcmlwdGlvbi5yZW1vdmVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7aWQudmFsdWVPZigpfWApO1xuICAgICAgICB0aGlzLnJlZkNvdW50ZXIuZGVjcmVtZW50KGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgfVxuXG4gICAgX2FkZERvY0hhc2goY29sbGVjdGlvbk5hbWUsIGRvYykge1xuICAgICAgICB0aGlzLmRvY0hhc2hbYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkKV0gPSBkb2M7XG4gICAgfVxuXG4gICAgX3VwZGF0ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGJ1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgICAgICBjb25zdCBleGlzdGluZ0RvYyA9IHRoaXMuZG9jSGFzaFtrZXldIHx8IHt9O1xuICAgICAgICB0aGlzLmRvY0hhc2hba2V5XSA9IF8uZXh0ZW5kKGV4aXN0aW5nRG9jLCBjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBfc2hvdWxkU2VuZENoYW5nZXMoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RvY1B1Ymxpc2hlZChjb2xsZWN0aW9uTmFtZSwgaWQpICYmXG4gICAgICAgICAgICB0aGlzLl9oYXNEb2NDaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcyk7XG4gICAgfVxuXG4gICAgX2lzRG9jUHVibGlzaGVkKGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5kb2NIYXNoW2tleV07XG4gICAgfVxuXG4gICAgX2hhc0RvY0NoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBkb2MpIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdEb2MgPSB0aGlzLmRvY0hhc2hbYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCldO1xuXG4gICAgICAgIGlmICghZXhpc3RpbmdEb2MpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgICAgICByZXR1cm4gXy5hbnkoXy5rZXlzKGRvYyksIGtleSA9PiAhXy5pc0VxdWFsKGRvY1trZXldLCBleGlzdGluZ0RvY1trZXldKSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGJ1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgICAgICBkZWxldGUgdGhpcy5kb2NIYXNoW2tleV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgcmV0dXJuIGAke2NvbGxlY3Rpb25OYW1lfTo6JHtpZC52YWx1ZU9mKCl9YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3Vic2NyaXB0aW9uO1xuIiwiY2xhc3MgUHVibGlzaGVkRG9jdW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gY29sbGVjdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuZG9jSWQgPSBkb2NJZDtcbiAgICAgICAgdGhpcy5jaGlsZFB1YmxpY2F0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLl9pc0ZsYWdnZWRGb3JSZW1vdmFsID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGRQdWIoY2hpbGRQdWJsaWNhdGlvbikge1xuICAgICAgICB0aGlzLmNoaWxkUHVibGljYXRpb25zLnB1c2goY2hpbGRQdWJsaWNhdGlvbik7XG4gICAgfVxuXG4gICAgZWFjaENoaWxkUHViKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY2hpbGRQdWJsaWNhdGlvbnMuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgaXNGbGFnZ2VkRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRmxhZ2dlZEZvclJlbW92YWw7XG4gICAgfVxuXG4gICAgdW5mbGFnRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZsYWdGb3JSZW1vdmFsKCkge1xuICAgICAgICB0aGlzLl9pc0ZsYWdnZWRGb3JSZW1vdmFsID0gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1Ymxpc2hlZERvY3VtZW50O1xuIiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuaW1wb3J0IFB1Ymxpc2hlZERvY3VtZW50IGZyb20gJy4vcHVibGlzaGVkX2RvY3VtZW50JztcblxuXG5jbGFzcyBQdWJsaXNoZWREb2N1bWVudExpc3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50cyA9IHt9O1xuICAgIH1cblxuICAgIGFkZChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdmFsdWVPZklkKGRvY0lkKTtcblxuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRzW2tleV0gPSBuZXcgUHVibGlzaGVkRG9jdW1lbnQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZENoaWxkUHViKGRvY0lkLCBwdWJsaWNhdGlvbikge1xuICAgICAgICBpZiAoIXB1YmxpY2F0aW9uKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuZG9jdW1lbnRzW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERvYyBub3QgZm91bmQgaW4gbGlzdDogJHtrZXl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRvY3VtZW50c1trZXldLmFkZENoaWxkUHViKHB1YmxpY2F0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQoZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdmFsdWVPZklkKGRvY0lkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzW2tleV07XG4gICAgfVxuXG4gICAgcmVtb3ZlKGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRvY3VtZW50c1trZXldO1xuICAgIH1cblxuICAgIGhhcyhkb2NJZCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmdldChkb2NJZCk7XG4gICAgfVxuXG4gICAgZWFjaERvY3VtZW50KGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgIF8uZWFjaCh0aGlzLmRvY3VtZW50cywgZnVuY3Rpb24gZXhlY0NhbGxiYWNrT25Eb2MoZG9jKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGRvYyk7XG4gICAgICAgIH0sIGNvbnRleHQgfHwgdGhpcyk7XG4gICAgfVxuXG4gICAgZWFjaENoaWxkUHViKGRvY0lkLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmdldChkb2NJZCk7XG5cbiAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgICAgZG9jLmVhY2hDaGlsZFB1YihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJZHMoKSB7XG4gICAgICAgIGNvbnN0IGRvY0lkcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZWFjaERvY3VtZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgIGRvY0lkcy5wdXNoKGRvYy5kb2NJZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkb2NJZHM7XG4gICAgfVxuXG4gICAgdW5mbGFnRm9yUmVtb3ZhbChkb2NJZCkge1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmdldChkb2NJZCk7XG5cbiAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgICAgZG9jLnVuZmxhZ0ZvclJlbW92YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZsYWdBbGxGb3JSZW1vdmFsKCkge1xuICAgICAgICB0aGlzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICBkb2MuZmxhZ0ZvclJlbW92YWwoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB2YWx1ZU9mSWQoZG9jSWQpIHtcbiAgICBpZiAoZG9jSWQgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb2N1bWVudCBJRCBpcyBudWxsJyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZG9jSWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgSUQgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIHJldHVybiBkb2NJZC52YWx1ZU9mKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1Ymxpc2hlZERvY3VtZW50TGlzdDtcbiJdfQ==
