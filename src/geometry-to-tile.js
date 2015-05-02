/**
 * Given a geometry, return the smallest GIS tile that circumscribes it
 * @param geometry {object} A GeoJSON geometry
 */
module.exports = function geometryToTile(geometry) {
  var extent = require('turf-extent')(geometry);
  var tiles = tilesCovering(extent, smallestZoomForExtent(extent));
  // #TODO
  if (tiles.length !== 1) {
    throw new Error("Can't find a tile that covers that geometry");
  }
  var tile = tiles[0];
  return tile;
}

// Given an extent, return the highest zoom level in tiles that circumscribes
// the extent
// #TODO optimize to not be a naive brute force
function smallestZoomForExtent(extent) {
  var lastZoom;
  var zoom = 1;
  var numTiles = tilesCovering(extent, zoom).length;
  while (validZoom(zoom)) {
    lastZoom = zoom;
    zoom = zoom + 1;
    numTiles = tilesCovering(extent, zoom).length;
    if (numTiles > 1) {
      return lastZoom;
    }
  }
  if ( ! validZoom(zoom)) {
    throw new Error("Couldn't find zoom for extent");
  }
  return zoom;
}

function validZoom(zoom) {
  return 0 <= zoom <= 16;
}

function tilesCovering(extent, zoom) {
  return require('xyz-affair')(xyzExtent(extent), zoom);
}

// convert extent structure from [wsen] -> [[w,s], [e,n]]
function xyzExtent(WSEN) {
  return [[WSEN[0], WSEN[1]], [WSEN[2], WSEN[3]]];
}
