// via https://gist.github.com/jhurliman/1250118
var base64 = exports;
 
base64.encode = function(unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};
 
base64.decode = function(encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};
 
base64.urlEncode = function(unencoded) {
  var encoded = base64.encode(unencoded);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
 
base64.urlDecode = function(encoded) {
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4)
    encoded += '=';
  return base64.decode(encoded);
};
