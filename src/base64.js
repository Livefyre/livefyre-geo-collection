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

base64.pad = function (unpadded) {
  var interval = 4;
  var mod = unpadded.length % interval;
  if ( ! mod) {
    // no need to pad
    return unpadded;
  }
  // need to pad to be multiple of 4. 5 because .join will create
  // (length - 1) '=' chars
  var padding = (new Array(1 + interval - mod)).join('=');
  return unpadded + padding;
}
