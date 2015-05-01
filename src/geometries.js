'use strict';

exports.circle = function (type, center, radius, units) {
  console.log('making a circle', arguments);

  var geometryCircle = {
    type: type,
    coordinates: [center[0], center[1]],
    radius: radius,
    properties: {
      radius_units: units
    }
  };

  return geometryCircle;
};

exports.polygon = function (type, coordinates, properties) {
  console.log('making a polygon', arguments);

  var geometryPolygon = {
    type: type,
    coordinates: coordinates,
    properties: properties
  };

  return geometryPolygon;

};