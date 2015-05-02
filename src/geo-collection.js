var createTileArchive = require('./tile-archive');

/**
 * Represents the subset of items in a Livefyre Collection that are
 * contained in the provided geometry
 * @param collection {object} {network, siteId, articleId}
 * @param geometry {object} a GeoJSON geometry
 */
module.exports = function GeoCollection(collection, geometry) {
  this.createArchive = function () {
    // todo: convert geometry to proper tile
    var tile = {
      x: 3,
      y: 7,
      z: 1
    };
    return createTileArchive({
      collection: collection,
      tile: tile
    });
  };
};
