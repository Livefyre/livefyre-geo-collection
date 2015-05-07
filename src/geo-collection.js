var featureCollectionToStates = require('./feature-collection-to-states');
var featureContainsState = require('./feature-contains-state');
var log = require('debug')('livefyre-geo-collection/geo-collection');
var through = require('through2');

// create a Transform that accepts Livefyre Content states and only re-emits
// those that have geocodes and are in the provided geometry
function geometryStateFilter(geometry) {
  return through.obj(function (state, encoding, next){
    try {
      var feature = require('turf-feature')(geometry);
      var contains = featureContainsState(feature, state);
    } catch(err) {
      return next(err);
    }
    if (contains) {
      this.push(state);
    } else {
      log('feature does not contain state, skipping')
    }
    next();
  });
}

/**
 * Represents the subset of items in a Livefyre Collection that are
 * contained in the provided geometry
 * @param collection {object} {network, siteId, articleId}
 * @param geometry {object} a GeoJSON geometry
 */
module.exports = function GeoCollection(opts) {
  var collection = opts.collection;
  var geometry = opts.geometry;
  var transformState = opts.transformState;
  var fetch = opts.fetch;

  /**
   * Create an archive stream of historical Content in the Geometry
   */
  this.createArchive = function () {
    var tile = require('./geometry-to-tile')(geometry);
    var states = require('./tile-archive')({
      collection: collection,
      tile: tile,
      fetch: fetch
      })
      .on('error', handleError)
      .pipe(transformFeatureCollectionsToStates())
      .on('error', handleError)
      .pipe(spread())
      .on('error', handleError)
      .pipe(geometryStateFilter(geometry))
      ;

    // if a transformState function is passed, map it over every
    // state
    if (transformState) {
      states = states
        .on('error',handleError)
        .pipe(stateTransformer(transformState));
    }

    function handleError(err) {
      log('error in geo-collection archive', err);
      states.emit('error', err);
    }

    return states;
  };
  /**
   * Create an updater stream of new items added to the Geometry
   */
  this.createUpdater = function () {
    var states = require('./collection-updater')({
      collection: collection,
      fetch: fetch
    })
      .on('error', handleError)
      .pipe(transformStreamBodyToStates())
      .on('error', handleError)
      .pipe(spread())
      .on('error', handleError)
      .pipe(geometryStateFilter(geometry))
      ;

    // if a transformState function is passed, map it over every
    // state
    if (transformState) {
      states = states
        .on('error',handleError)
        .pipe(stateTransformer(transformState));
    }

    function handleError(err) {
      log('error in geo-collection updater', err);
      states.emit('error', err);
    }
    return states;
  };

  /**
   * Implement Collection#pipe, which pipes into a destination and its .more
   */
  this.pipe = function (destination) {
    var archive;
    if (isMore(destination.more)) {
      this.createArchive().pipe(destination.more);
    }
  }
};

function stateTransformer(transformState) {
  return through.obj(function (state, encoding, next) {
    var transformed;
    try {
      transformed = transformState(state);
    } catch (err) {
      return next(err);
    }
    // if it returns a falsy, dont push it along
    if (transformed) {
      this.push(transformed);
    }
    next();
  })
}

function isMore(more) {
  return more && typeof more.write === 'function';
}

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

// create a Transform that accepts stream response bodies and re-emits
// arrays of Livefyre States
function transformStreamBodyToStates() {
  return through.obj(function (streamBody, encoding, next) {
    var states;
    try {
      states = require('./stream-body-to-states')(streamBody);
    } catch(err) {
      return next(err);
    }
    this.push(states);
    next();
  });
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
