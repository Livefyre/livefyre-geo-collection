var test = require('blue-tape');
var initUrl = require('../src/collection-init-url');

var cases = [{
  message: 'with minimal args',
  opts: {
    collection: {
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    }
  },
  url: 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/init'
},{
  message: 'with http: protocol',
  opts: {
    collection: {
      protocol: 'http:',
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    }
  },
  url: 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/init'
},{
  message: 'with livefyre.com network',
  opts: {
    collection: {
      network: 'livefyre.com',
      siteId: 315833,
      articleId: 'ben-geo-0'
    }
  },
  url: 'https://bootstrap.livefyre.com/bs3/v3.1/livefyre.com/315833/YmVuLWdlby0w/init'
},{
  message: 'with base64 articleId that needs some padding =',
  opts: {
    collection: {
      network: 'labs-t402.fyre.co',
      siteId: 303827,
      articleId: 'uat-ben-geo-0'
    }
  },
  url: 'https://labs-t402.bootstrap.fyre.co/bs3/v3.1/labs-t402.fyre.co/303827/dWF0LWJlbi1nZW8tMA==/init'
}]

test('collection-init-url creates correct urls for prod', function (t) {
  cases.forEach(function (testCase) {
    var opts = Object.create(testCase.opts);
    var url = initUrl(opts);
    var message = testCase.message || 'url matches what testCase says it should be';
    t.equal(url, testCase.url, message);
  });
  t.end();
});

