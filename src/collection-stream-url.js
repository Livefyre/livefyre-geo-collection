'use strict';
var livefyreUrl = require('./livefyre-url');

var streamUrlTemplate = '{protocol}//{host}/v3.1/collection/{collectionId}/{event}/';
/**
 * Get the URL of the init resource of a Livefyre Collection
 * @param collection {object} - { network, id }
 * @param [protocol='https:'] - protocol to use in URL
 */
module.exports = function (opts) {
  var collection = opts.collection;
  var url = livefyreUrl.renderURLTemplate(streamUrlTemplate, {
    host: livefyreUrl.apiHostForNetwork(collection.network, 'stream1'),
    protocol: opts.protocol || 'https:',
    collectionId: collection.id,
    event: opts.event,
  });
  return url;
}
