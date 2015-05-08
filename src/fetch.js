var requestGeo = require('./request');

/**
 * Fetch GeoJSON describing Content in a Livefyre Collection at a certain
 * map tile
 */
module.exports = function () {
  return requestGeo.apply(null, arguments).then(function (res) {
    if (res.ok) {
      return res.json();
    }
    throw createHttpResponseNotOkError(res);
  });
}

function createHttpResponseNotOkError(response, msg) {
  var msg = msg || "HTTP Response is not 200 OK";
  var err = new Error(msg);
  err.response = response;
  return err;
}
