var test = require('blue-tape');
// var geoCollectionMixin = require('../').mixin;
var GeoCollection = require('../').GeoCollection;

var mockGeometry = fixture('ks.geojson');

var fakeCollection = {
  network: 'labs.fyre.co',
  siteId: 315833,
  articleId: 'ben-geo-0'
};

test('can create a GeoCollection', function (t) {
  var collection = new GeoCollection({
    collection: fakeCollection,
    geometry: mockGeometry
  });
  t.equal(typeof collection, 'object');
  t.equal(typeof collection.createArchive, 'function');

  // createArchive() returns a stream.Readable
  var archive = collection.createArchive();
  t.equal(typeof archive, 'object');
  t.equal(typeof archive.on, 'function');
  t.equal(typeof archive.read, 'function');
  t.equal(typeof archive.pipe, 'function');

  // #TODO createUpdater() returns a stream.Readable
  // var updater = collection.createUpdater();
  // t.equal(typeof updater, 'object');
  // t.equal(typeof updater.on, 'function');
  // t.equal(typeof updater.read, 'function');
  // t.equal(typeof updater.pipe, 'function');

  t.end();
})

function fixture(path) {
  var json = require('fs').readFileSync(__dirname+'/fixtures/'+path, 'utf8');
  return JSON.parse(json);
}
