#!/usr/bin/env node
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
  x: opts['<x>'],
  y: opts['<y>'],
  z: opts['<z>'],
}

if (opts.url) {
  process.stdout.write(geoCollection.url(geoCollectionOpts))
}

if (opts.fetch) {
  geoCollection.fetch(geoCollectionOpts)
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
  geoCollection.archive(geoCollectionOpts)
  .on('error', function (err) {
    console.error(err);
    process.exit(1);
  })
  .pipe(process.stdout)
  .on('finish', function () {
    process.exit();
  });
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


