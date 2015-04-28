var test = require('blue-tape');
var geoUrl = require('../').url;
var cases = [{
  message: 'with minimal args',
  opts: {
    collection: {
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    },
    x: 3,
    y: 7,
    z: 1
  },
  url: 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json'
},{
  message: 'with http: protocol',
  opts: {
    collection: {
      protocol: 'http:',
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    },
    x: 3,
    y: 7,
    z: 1
  },
  url: 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json'
},{
  message: 'with livefyre.com network',
  opts: {
    collection: {
      network: 'livefyre.com',
      siteId: 315833,
      articleId: 'ben-geo-0'
    },
    x: 3,
    y: 6,
    z: 1
  },
  url: 'https://bootstrap.livefyre.com/bs3/v3.1/livefyre.com/315833/YmVuLWdlby0w/geojson/3/6/1.json'
}]

test('geo-url creates correct urls for prod', function (t) {
  cases.forEach(function (testCase) {
    var opts = Object.create(testCase.opts);
    var url = geoUrl(opts);
    var message = testCase.message || 'url matches what testCase says it should be';
    t.equal(url, testCase.url, message);
  });
  t.end();
});
