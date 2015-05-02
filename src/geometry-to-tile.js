/**
 * Given a geometry, return the smallest GIS tile that circumscribes it
 * @param geometry {object} A GeoJSON geometry
 */
module.exports = function geometryToTile(geometry) {
  // #TODO
  var tile = {
    z: 3,
    x: 3,
    y: 1
  };
  return tile;
}
