var Readable = require('stream').Readable;
var fetchGeo = require('./fetch');
var log = require('debug')('livefyre-geo-collection/tile-archive');

module.exports = function createTileArchive(opts) {
  var archive = new Readable();
  var max = 10;
  var paging = null;
  var page = 1;
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

    log(['fetching page',page++,'of content in tile'].join(' '));
    fetchGeo(opts)
    .then(function (response) {
      var json = JSON.stringify(response);
      paging = response.paging;
      archive.push(json);
    })
    .then(null, function (err) {
      archive.emit('error', err);
    });
  };
  return archive;
}
