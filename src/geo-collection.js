var through = require('through2');
var featureCollectionToStates = require('./feature-collection-to-states');

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
    var states = require('./geometry-archive')(collection, geometry)
      .on('error', handleError)
      .pipe(transformFeatureCollectionsToStates())
      .on('error', handleError)
      .pipe(spread())
      ;

    function handleError(err) {
      console.error('error in geo-collection archive', err);
      states.emit('error', err);
    }

    return states;
  };
  /**
   * Create an updater stream of new items added to the Geometry
   */
  this.updater = function () {
    throw new Error('#TODO');
  };
};

/**
 * Create a Transform stream that transforms JSON (str) FeatureCollections
 * into arrays of Livefyre Content State objects
 */
function transformFeatureCollectionsToStates() {
  return through.obj(function (buffer, encoding, done) {
    var featureCollection;
    // stringify buffer and parse as JSON
    try {
      featureCollection = JSON.parse(buffer.toString('utf8'));
    } catch (e) {
      return done(e);
    }
    // convert to states
    var states = featureCollectionToStates(featureCollection)
    this.push(states);
    done();
  })
}

/**
 * Create a transform that takes written arrays and pushes along the individual
 * items of the Array
 */
function spread() {
  return through.obj(function (array, encoding, done) {
    if (typeof array.length === 'number') {
      array.forEach(this.push.bind(this))
    } else {
      this.push(array);
    }
    done();
  })
}
