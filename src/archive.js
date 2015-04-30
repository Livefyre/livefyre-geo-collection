var Readable = require('stream').Readable;
var fetchGeo = require('./fetch');

module.exports = function (opts) {
  var archive = new Readable({ objectMode: true });
  var max = 10;
  var paging = null;
  archive._read = function () {
    var hasPrev = paging && paging.hasPrev;
    if (paging) {
      if (hasPrev) {
        console.error(new Error('There is previous content but I dont yet know how to get it from the API! Ending for now #TODO'))
        return archive.push(null);
      } else {
        // we done
        return archive.push(null);        
      }
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
