var log = require('debug')('livefyre-geo-collection/feature-contains-state');
var createFeatureCollection = require('turf-featurecollection');

/**
 * Return whether a GeoJSON Feature contains a Livefyre Content State
 */
module.exports = function (feature, state) {
  var stateFeatureCollection;
  try {
    stateFeatureCollection = createFeatureCollection([stateToFeature(state)]);
  } catch (err) {
    log('error converting state to FeatureCollection '+err);
    return false;
  }
  var outerFeatureCollection = (feature.type === 'FeatureCollection')
    ? feature
    : createFeatureCollection([feature]);
  var intersection = require('turf-within')(
    stateFeatureCollection,
    outerFeatureCollection
  );
  return Boolean(intersection.features.length);
}

// convert a Livefyre State to a GeoJSON Point Feature
function stateToFeature(state) {
  var geocode = state.content.annotations.geocode;
  if ( ! geocode) {
    throw new Error("State does not have geocode, so can't be a feature");
  }
  var feature = {
    id: state.content.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [geocode.longitude, geocode.latitude]
    },
    properties: require('xtend')(state)
  };
  return feature;  
}
