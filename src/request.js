var geoUrl = require('./geo-url');
var fetch = require('./safe-fetch');

/**
 * Fetch GeoJSON describing Content in a Livefyre Collection at a certain
 * map tile
 */
module.exports = function (opts) {
  var url = geoUrl.apply(this, arguments);
  return (opts.fetch || fetch)(url);
}
