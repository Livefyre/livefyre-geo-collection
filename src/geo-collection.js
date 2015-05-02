var createTileArchive = require('./tile-archive');
var geometryToTile = require('./geometry-to-tile');

/**
 * Represents the subset of items in a Livefyre Collection that are
 * contained in the provided geometry
 * @param collection {object} {network, siteId, articleId}
 * @param geometry {object} a GeoJSON geometry
 */
module.exports = function GeoCollection(collection, geometry) {
  this.createArchive = function () {
    var tile = geometryToTile(geometry);
    var tileArchive = createTileArchive({
      collection: collection,
      tile: tile
    });
    // stream of things in the right tile, but filtered to exclude
    // anything that wasn't in the geometry
    return tileArchive.pipe(geometryContentFilter(geometry));
  };
};

function geometryContentFilter(geometry) {
  return require('through2-filter')(function (content) {
    var coord = coordOfContent(content);
    return geometryContainsCoordinate(geometry, coord);
  });
}

function coordOfContent() {

}

function geometryContainsCoordinate(geometry, coord) {
  return true;
}
