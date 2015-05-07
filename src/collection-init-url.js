'use strict';
var base64 = require('./base64');
var livefyreUrl = require('./livefyre-url');

var initUrlTemplate = '{protocol}//{host}/bs3/v3.1/{network}/{siteId}/{b64urlArticleId}/init';
/**
 * Get the URL of the init resource of a Livefyre Collection
 * @param collection {object} - { network, siteId, articleId }
 * @param [protocol='https:'] - protocol to use in URL
 */
module.exports = function (opts) {
  var collection = opts.collection;
  var url = livefyreUrl.renderURLTemplate(initUrlTemplate, {
    host: livefyreUrl.apiHostForNetwork(collection.network, 'bootstrap'),
    protocol: opts.protocol || 'https:',
    network: collection.network,
    siteId: collection.siteId,
    b64urlArticleId: base64.pad(base64.urlEncode(collection.articleId)),
  });
  return url;
}
