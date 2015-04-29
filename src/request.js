var geoUrl = require('./geo-url');
var Promise = require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');

/**
 * Fetch GeoJSON describing Content in a Livefyre Collection at a certain
 * map tile
 */
module.exports = function () {
  var url = geoUrl.apply(this, arguments);
  return fetch(url);
}
