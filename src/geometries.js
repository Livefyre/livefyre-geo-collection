exports.circle = function (shape, center, radius, unit) {
  console.log('making a circle', arguments)
  var geometry = {
    "type": shape,
    "coordinates": [center[0], center[1]],
     "radius": radius,
     "properties": {
        "radius_units": unit
      }
  };
  return geometry;
}