/**
 * Given a Stream response body as returned by Livefyre Stream API,
 * Return an array of Content 'state' objects
 */
module.exports = function streamBodyToStates(streamBody) {
  var streamData = streamBody.data;
  var stateMap = streamData.states;
  var addAuthor = addAuthorsToState(streamData.authors);
  var states = Object.keys(stateMap).reduce(function (states, id) {
    var stateWithAuthor = addAuthor(stateMap[id]);
    states.push(stateWithAuthor);
    return states;
  }, []);
  return states;
};

function addAuthorsToState(authors) {
  return function (state) {
    var authorId = state.content.authorId;
    var author = authors[authorId];
    if (author) {
      state.content.author = author;
    }
    return state;
  }
}
