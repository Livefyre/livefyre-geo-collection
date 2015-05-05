/**
 * Create a stream of Livefyre Content representing things in the
 * provided Collection that are also geolocated in the provided Geometry.
 * @param collection {object} {network, siteId, articleId}
 * @param geometry {object} a GeoJSON geometry
 */
module.exports = function createGeometryArchive(collection, geometry) {
  var tile = require('./geometry-to-tile')(geometry);
  var tileArchive = require('./tile-archive')({
    collection: collection,
    tile: tile
  });
  // stream of things in the right tile, but filtered to exclude
  // anything that wasn't in the geometry
  return tileArchive.pipe(geometryContentFilter(geometry));
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

