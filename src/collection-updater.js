var log = require('debug')('livefyre-collection-updater');
var Readable = require('stream').Readable;

/**
 * Create a Readable stream of real-time updates to a Livefyre Collection
 */
module.exports = function createCollectionUpdater(opts) {
  var collection = Object.create(opts.collection);
  var event = opts.event;
  var updater = new Readable({ objectMode: true });
  var fetch = opts.fetch || require('isomorphic-fetch');
  updater._read = function (size) {
    if ( ! (typeof event === 'number' && collection.id)) {
      // init to get event
      return bootstrapInit(fetch, collection)
      .then(function (bootstrapInitBody) {
        event = bootstrapInitBody.collectionSettings.event;
        collection.id = bootstrapInitBody.collectionSettings.collectionId;
        return this._read()
      }.bind(this))
    }
    streamSinceEvent(fetch, collection, event)
    .then(function (streamResponseBody) {
      if (streamResponseBody.timeout) {
        log('timeout')
        // poll again
        return this._read();
      }
      var streamData = streamResponseBody.data;
      event = streamData.maxEventId;
      this.push(streamResponseBody);
    }.bind(this))
  };
  return updater;
}

// fetch bootstrap init for a collection
function bootstrapInit(fetch, collection) {
  var url = require('./collection-init-url')({ collection: collection });
  log('bootstrapInit '+url)
  return fetch(url)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw createHttpResponseNotOkError(response);
  });
}

// fetch one stream request for a collection, since event
function streamSinceEvent(fetch, collection, event) {
  var url = require('./collection-stream-url')({
    collection: collection,
    event: event
  })
  log('streamSinceEvent '+url);
  return fetch(url, { controller: {} })
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    throw createHttpResponseNotOkError(response);
  });
  /**
  Response Body will be like
  { timeout: true,
    parked: true,
    h: 'ct7.dsr.t402.livefyre.com' }
  */
}

function createHttpResponseNotOkError(response, msg) {
  var msg = msg || "HTTP Response is not 200 OK";
  var err = new Error(msg);
  err.response = response;
  return err;
}
