var geoUrl = require('./geo-url');

var Promise = require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');

module.exports = function () {
  var url = geoUrl.apply(this, arguments);
  return fetch(url);
}
