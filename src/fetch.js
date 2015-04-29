var geoUrl = require('./geo-url');

var Promise = require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');

var requestGeo = require('./request');

/**
 * Fetch GeoJSON describing Content in a Livefyre Collection at a certain
 * map tile
 */
module.exports = function () {
  return requestGeo.apply(null, arguments).then(function (res) {
    return res.json();
  });
}
