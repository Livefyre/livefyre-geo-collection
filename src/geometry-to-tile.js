/**
 * Given a geometry, return the smallest GIS tile that circumscribes it
 * @param geometry {object} A GeoJSON geometry
 */
module.exports = function geometryToTile(geometry) {
  var extent = require('turf-extent')(geometry);
  var tilebelt = require('tilebelt');
  var tile = tileCoveringExtent(extent);
  return tile;
}

function tileCoveringExtent(extent) {
  var tilebelt = require('tilebelt');
  var xyz = tilebelt.bboxToTile(extent);
  return {
    x: xyz[0],
    y: xyz[1],
    z: xyz[2]
  };
}

/**

#TODO

This is somewhat of a naive solution in that it only gets one tile
to cover the whole geometry. If the geometry is complex or much bigger
in one dimension than the other, this will be suboptimal as most of the things
we download from the tile will be thrown out because it's not within the
geometry.

tile-cover looks like a promising way of sometimes finding multiple tiles
to cover the geometry. GeoCollection archives would then need to stream and
merge multiple tile-archives, which is too complicated for me to do now.
https://www.npmjs.com/package/tile-cover

*/
