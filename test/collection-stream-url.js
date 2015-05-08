var test = require('blue-tape');
var streamUrl = require('../src/collection-stream-url');

var cases = [{
  message: 'with minimal args',
  opts: {
    collection: {
      id: 42,
      network: 'labs.fyre.co'
    },
    event: 0
  },
  url: 'https://labs.stream1.fyre.co/v3.1/collection/42/0/'
},{
  message: 'with http: protocol',
  opts: {
    collection: {
      id: 42,
      network: 'labs.fyre.co'
    },
    event: 1,
    protocol: 'http:'
  },
  url: 'http://labs.stream1.fyre.co/v3.1/collection/42/1/'
}]

test('collection-stream-url creates correct urls for prod', function (t) {
  cases.forEach(function (testCase) {
    var opts = Object.create(testCase.opts);
    var url = streamUrl(opts);
    var message = testCase.message || 'url matches what testCase says it should be';
    t.equal(url, testCase.url, message);
  });
  t.end();
});

