/**
 * Given a GeoJSON FeatureCollection as returned by Livefyre geojson API,
 * Return an array of Content 'state' objects
 */
module.exports = function featureCollectionToStates(featureCollection) {
  var features = featureCollection.features;
  var authors = featureCollection.authors;
  var states = features.map(featureToStateWithAuthors(authors));
  return states;
};

function featureToStateWithAuthors(authors) {
  return function (feature) {
    var state = featureToState(feature);
    var authorId = state.content.authorId;
    var author = authors.filter(function (author) {
      return author.id === authorId;
    })[0];
    if (author) {
      state.content.author = author;
    }
    return state;
  }
}

function featureToState(feature) {
  var properties = feature.properties;
  return properties;
}
