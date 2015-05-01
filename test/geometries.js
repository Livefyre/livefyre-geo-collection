var test = require('blue-tape');
var geometries = require('../').geometries;

test('can create a circle GeoJSOn from geometries.circle', function (t) {
  var center = [1.0, 2.0];
  var radius = 5.0;
  var units = 'km' || 'mi';
  var geometry = geometries.circle(center, radius, units);
  t.equal(geometry.type, 'Circle');
  t.deepEqual(geometry, {
    type: "Circle",
    coordinates: center,
     radius: radius,
     properties: {
        radius_units: units
      }
  });
  t.end();
});


/*

{
    "type": "Circle",
    "coordinates": [ geoCoords.x, geoCoords.y ],
     "radius": r,
     "properties": {
        "radius_units": "mi"
      }
  };

  */