var test = require('blue-tape');
var geoUrl = require('../').url;

test('returns something', function (t) {
  var url = geoUrl();
  t.ok(url, 'url is truthy');
  t.end();
});
