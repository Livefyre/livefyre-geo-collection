'use strict';
var base64 = require('./base64');
var livefyreUrl = require('./livefyre-url');
var querystring = require('querystring');

var geoUrlTemplate = '{protocol}//{host}/bs3/v3.1/{network}/{siteId}/{b64urlArticleId}/geojson/{z}/{x}/{y}.json';
/**
 * Get the URL of geo-indexed content of a Livefyre Collection
 * @param collection {object} - { network, siteId, articleId }
 * @param tile.x {number} - x coordinate of map tile
 * @param tile.y {number} - y coordinate of map tile
 * @param tile.z {number} - z coordinate of map tile
 * @param [protocol='https:'] - protocol to use in URL
 */
module.exports = function (opts) {
  var collection = opts.collection;
  var tile = opts.tile;
  var url = livefyreUrl.renderURLTemplate(geoUrlTemplate, {
    host: livefyreUrl.apiHostForNetwork(collection.network, 'bootstrap'),
    protocol: opts.protocol || 'https:',
    network: collection.network,
    siteId: collection.siteId,
    b64urlArticleId: base64.pad(base64.urlEncode(collection.articleId)),
    x: tile.x,
    y: tile.y,
    z: tile.z
  });
  if (opts.until) {
    url = [url, querystring.stringify({ until: opts.until })].join('?')
  }
  return url;
}
