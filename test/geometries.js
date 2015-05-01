var test = require('blue-tape');
var geometries = require('../').geometries;

test('can create a circle GeoJSOn from geometries.circle', function (t) {
  var type = 'Circle';
  var center = [1.0, 2.0];
  var radius = 5.0;
  var units = 'mi' || 'km';
  var geometry = geometries.circle(type, center, radius, units);
  //t.equal(geometry.type, 'Circle');
  t.deepEqual(geometry, {
    type: type,
    coordinates: center,
     radius: radius,
     properties: {
        radius_units: units
      }
  });
  t.end();
});

// test('can create a polygon GeoJSOn from geometries.polygon', function (t) {
//   var type = 'Polygon';
//   var coordinates = [[ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]];
//   var props = ['value0', {'this': 'that'}];
//   var geometry = geometries.polygon(type, coordinates, props);
//   //t.equal(geometry.type, 'Circle');
//   t.deepEqual(geometry,
//     {
//       type: type,
//       coordinates: coordinates
//     },
//       properties: {
//         prop0: props[0],
//         prop1: props[1]
//     }
//   });
//   t.end();
// });


/*

{
    "type": "Circle",
    "coordinates": [ geoCoords.x, geoCoords.y ],
     "radius": r,
     "properties": {
        "radius_units": "mi"
      }
  };

  {
     "type": "Polygon",
     "coordinates":
       ]
    }

  */