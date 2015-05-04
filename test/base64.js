var test = require('blue-tape');
var base64 = require('../src/base64');

test('base64.pad will pad encoded strings with a proper number of =', function (t) {
  var needPadding = [
    ['dWF0LWJlbi1nZW8tMA', 'dWF0LWJlbi1nZW8tMA=='],
    ['dWF0LWJlbi1nZW8tMA=', 'dWF0LWJlbi1nZW8tMA==']
  ]
  var noPaddingNeeded = ['YmVuLWdlby0w']
  needPadding.forEach(function (s) {
    t.equal(base64.pad(s[0]), s[1]);
  })
  noPaddingNeeded.forEach(function (s) {
    t.equal(base64.pad(s), s);    
  })
  t.end();
});
