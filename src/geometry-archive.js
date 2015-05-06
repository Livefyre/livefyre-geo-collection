var log = require('debug')('livefyre-geo-collection/geometry-archive');

/**
 * Create a stream of FeatureCollection GeoJSONs representing things in the
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

  tileArchive.on('error', handleError);

  // stream of things in the right tile, but filtered to exclude
  // anything that wasn't in the geometry
  var geometryArchive = tileArchive.pipe(geometryContentFilter(geometry));

  function handleError(err) {
    geometryArchive.emit('error', err);
  }
  return geometryArchive;
};
    
function geometryContentFilter(geometry) {
  return require('through2')(function (content, enc, done) {
    var featureCollection = JSON.parse(content.toString('utf8'))
    var filteredFeatureCollection = require('xtend')(featureCollection, {
      features: featureCollection.features.filter(function (feature) {
        var point = pointFromLivefyreFeature(feature);
        return geometryContainsPoint(geometry, point);
      })
    });
    try {
      this.push(JSON.stringify(filteredFeatureCollection));      
    } catch (e) {
      return done(e);
    }
    done();
  });
}

function geometryContainsPoint(geometry, point) {
  var contains = require('turf-inside')(
    { geometry: point },
    { geometry: geometry }
  );
  if ( ! contains) {
    log('geometry does contain point');
  } else {
    log('geometry contains point');
  }
  return contains;
}

function pointFromLivefyreFeature(feature) {
  // #TODO: I should be able to use feature.geometry, but currently
  // the .coordinates there are swapped incorrectly [lat, lon]
  var geocode = feature.properties.content.annotations.geocode;
  var point = {
    type: 'Point',
    coordinates: [geocode.longitude, geocode.latitude]
  };
  return point;
}
