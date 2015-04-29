var Readable = require('stream').Readable;
var fetchGeo = require('./fetch');

module.exports = function (opts) {
  var archive = new Readable({ objectMode: true });
  var max = 10;
  var paging = null;
  archive._read = function () {
    if (paging && ! paging.hasPrev) {
      // we done
      return archive.push(null);
    }
    fetchGeo(opts)
    .then(function (json) {
      paging = json.paging;
      archive.push(JSON.stringify(json));
    })
    .then(null, function (err) {
      archive.emit('error', err);
    });
  };
  return archive;
}
