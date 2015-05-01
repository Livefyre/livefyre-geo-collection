var test = require('blue-tape');
var geometries = require('../').geometries;

test('can create a circle GeoJSOn from geometries.circle', function (t) {
  var shape = 'Circle';
  var center = [1.0, 2.0];
  var radius = 5.0;
  var units = 'mi' || 'km';
  var geometry = geometries.circle(shape, center, radius, units);
  //t.equal(geometry.type, 'Circle');
  t.deepEqual(geometry, {
    type: shape,
    coordinates: center,
     radius: radius,
     properties: {
        radius_units: units
      }
  });
  t.end();
});