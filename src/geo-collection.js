/**
 * Represents the subset of items in a Livefyre Collection that are
 * contained in the provided geometry
 * @param collection {object} {network, siteId, articleId}
 * @param geometry {object} a GeoJSON geometry
 */
module.exports = function GeoCollection(collection, geometry) {
  /**
   * Create an archive stream of historical Content in the Geometry
   */
  this.createArchive = function () {
    var archive = require('./geometry-archive')(collection, geometry);
    return archive;
  };
  /**
   * Create an updater stream of new items added to the Geometry
   */
  this.updater = function () {
    throw new Error('#TODO');
  };
};
