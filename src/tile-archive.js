var Readable = require('stream').Readable;
var fetchGeo = require('./fetch');

module.exports = function createTileArchive(opts) {
  var archive = new Readable({ objectMode: true });
  var max = 10;
  var paging = null;
  archive._read = function () {
    var hasPrev = paging && paging.hasPrev;
    if (paging) {
      if ( ! hasPrev) {
        // all done
        return archive.push(null);
      }
      // add paging opts from last paging response
      opts = Object.create(opts);
      opts.until = Math.ceil(paging.prev);
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
