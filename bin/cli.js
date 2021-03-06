#!/usr/bin/env node
var Promise = require('es6-promise').polyfill();
var argv = process.argv.slice(2);
var fs = require('fs');
var doc = fs.readFileSync(__dirname+'/doc.txt', 'utf8');
var geoCollection = require('../');
var opts;

try {
  opts = require('docopt').docopt(doc, {
    exit: false,
    help: false
  })
  // console.log('opts are', opts);
} catch (e) {
  opts = { '--help': true }
}

if (opts['--version']) {
  var packageJson = JSON.parse(fs.readFileSync(__dirname+'/../package.json'), 'utf8');
  console.log(packageJson.version);
  process.exit();
}

if (opts['--help']) {
  console.log(doc);
  process.exit(1);
}

var geoCollectionOpts = {
  collection: collectionFromUrn(opts['<collection>']),
  tile: tileFromOpts(opts),
  geometry: geometryFromOpts(opts)
}

if (opts.url) {
  process.stdout.write(require('../src/geo-url')(geoCollectionOpts))
}

if (opts.fetch) {
  require('../src/fetch')(geoCollectionOpts)
  .then(function (json) {
    console.log(JSON.stringify(json, null, 2));
    process.exit();
  })
  .then(null, function (err) {
    console.error(err);
    process.exit(1);
  })
}

if (opts.archive) {
  createArchiveFromOpts(geoCollectionOpts)
  .pipe(objectsToStdout())
}

if (opts.stream) {
  createUpdaterFromOpts(geoCollectionOpts)
  .pipe(objectsToStdout())
}

// return a writable that will print written objects to stdout, then
// quit the process when done
function objectsToStdout() {
  var writable = new (require('stream').PassThrough)({ objectMode: true });

  writable.on('pipe', function (src) {
    src.on('error', handleError);
  })

  writable.on('error', handleError)
  .pipe(require('through2').obj(function (state, encoding, next) {
    // convert to json strings
    try {
      this.push(JSON.stringify(state));      
    } catch (e) {
      return next(e);
    }
    next();
  }))
  .on('error', handleError)
  .pipe(process.stdout)
  .on('error', handleError)
  .on('finish', function () {
    process.exit();
  });
  function handleError(err) {
    console.error(err);
    process.exit(1);
  }
  return writable;
}

function createArchiveFromOpts(opts) {
  if (opts.geometry) {
    var collection = new geoCollection.GeoCollection({
      collection: opts.collection,
      geometry: opts.geometry
    });
    return collection.createArchive();
  }
  if (opts.tile) {
    return geoCollection.createTileArchive(opts)    
  }
  throw new Error("Can't create archive from opts");
}

function createUpdaterFromOpts(opts) {
  if (opts.geometry) {
    var collection = new geoCollection.GeoCollection({
      collection: opts.collection,
      geometry: opts.geometry
    });
    return collection.createUpdater();    
  }
  if (opts.tile) {
    throw new Error("TODO: Dont know how to make updater for tile")
  }
  throw new Error("Can't create updater from opts");
}


function collectionFromUrn(urn) {
  var collectionPatterns = {
    network: /([^:]+):site=/i,
    siteId: /site=([^:]+)/i,
    articleId: /article=([^:]+)/i
  };
  var collection = Object.keys(collectionPatterns).reduce(function (collection, key) {
    var pattern = collectionPatterns[key];
    var match = urn.match(pattern);
    if ( ! match) {
      throw new Error("Couldn't extract "+key+" from Collection URN "+urn)
    }
    collection[key] = match[1]
    return collection;
  }, {});
  return collection;
}

function tileFromOpts() {
  if (opts['<tile>']) {
    return parseTile(opts['<tile>']);
  }
  if (opts['<geometry>']) {
    return require('../src/geometry-to-tile')(parseGeometry(opts['<geometry>']));
  }
  throw new Error("Couldn't determine tile from opts")
}

function parseTile(tileStr) {
    // tile opt should be like "z,x,y"
  var tile = tileStr.split(',')
    .map(function (coord) { return parseFloat(coord, 10); })
    .reduce(function (tile, coord, i) {
      var dimension;
      switch(i) {
        case 0:
          dimension = 'z';
          break;
        case 1:
          dimension = 'x';
          break;
        case 2:
          dimension = 'y';
          break;
      }
      tile[dimension] = coord;
      return tile;
    }, {});
  return tile;
}

function geometryFromOpts(opts) {
  if (opts['<geometry>']) {
    return parseGeometry(opts['<geometry>']);
  }
}

function parseGeometry(geometryStr) {
  var geometry = JSON.parse(geometryStr);
  return geometry;
}
