'use strict';
var base64 = require('./base64');

var geoUrlTemplate = '{protocol}//{host}/bs3/v3.1/{network}/{siteId}/{b64urlArticleId}/geojson/{x}/{y}/{z}.json';
/**
 * Get the URL of geo-indexed content of a Livefyre Collection
 * @param collection {object} - { network, siteId, articleId }
 * @param x {number} - x coordinate of map tile
 * @param y {number} - y coordinate of map tile
 * @param z {number} - z coordinate of map tile
 * @param [protocol='https:'] - protocol to use in URL
 */
module.exports = function (opts) {
  var collection = opts.collection;
  var url = render(geoUrlTemplate, {
    host: apiHostForNetwork(collection.network),
    protocol: opts.protocol || 'https:',
    network: collection.network,
    siteId: collection.siteId,
    b64urlArticleId: base64.urlEncode(collection.articleId),
    x: opts.x,
    y: opts.y,
    z: opts.z
  });
  return url;
}

/**
 * Render a template string with a context object
 * @example render('{thing}s', { thing: 'apple' }) -> 'apples'
 */
function render(template, context) {
  context = context || {};
  var rendered = template;
  Object.keys(context).forEach(function (key) {
    var symbol = '{'+key+'}';
    rendered = rendered.replace(symbol, context[key]);
  });
  return rendered;
}

var networkNamePattern = /([^.]+)\.fyre\.co/i
/**
 * Get the Livefyre networkName of a full network host
 * @example networkNameOfNetwork('ben.fyre.co') -> 'ben'
 */
function networkNameOfNetwork(network) {
  var networkName = network.match(networkNamePattern);
  if ( ! networkName) {
    throw new Error("Couldn't extract networkName from network "+network);
  }
  return networkName[1];
}

var bootstrapHostTemplate = '{networkName}.bootstrap.fyre.co';
/**
 * Get the host to make geojson requests to for a network
 * @example apiHostForNetwork('ben.fyre.co') -> 'ben.bootstrap.fyre.co'
 * @example apiHostForNetwork('livefyre.com') -> 'bootstrap.livefyre.com'
 */
function apiHostForNetwork(network) {
  if (network === 'livefyre.com') {
    return 'bootstrap.livefyre.com';
  }
  return render(bootstrapHostTemplate, {
    networkName: networkNameOfNetwork(network)
  });
}
