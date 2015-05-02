var test = require('blue-tape');
// var geoCollectionMixin = require('../').mixin;
var GeoCollection = require('../').GeoCollection;

var mockGeometry = {
  "type": "Circle",
  "coordinates": [ 1, 2 ],
   "radius": 3,
   "properties": {
      "radius_units": "mi"
    }
};
var fakeCollection = {
  network: 'labs.fyre.co',
  siteId: 315833,
  articleId: 'ben-geo-0'
};

test('can create a GeoCollection', function (t) {
  var collection = new GeoCollection(fakeCollection, mockGeometry);
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
