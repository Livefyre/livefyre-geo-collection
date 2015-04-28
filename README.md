# livefyre-geo-collection

[![Build Status](https://travis-ci.org/gobengo/livefyre-geo-collection.svg?branch=master)](https://travis-ci.org/gobengo/livefyre-geo-collection)

## Usage

Get the URL of a specific map tile's worth of geo-indexed Content.

```javascript
var url = require('livefyre-geo-collection').url({
    collection: {
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    },
    x: 3,
    y: 7,
    z: 1
});

(url === 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json');
```

## Goal

v1 will be able to do this

```javascript
Livefyre.require([
  'streamhub-wall#3',
  'livefyre-geo-collection#1'],
function (Wall, GeoCollection) {
  new Wall({
    el: document.getElement('wall'),
    collection: new GeoCollection({
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
      geometry: {
        "type": "Polygon",
        "coordinates": [ [100.0, 0.0], [101.0, 0.0] ]
      }
    })
  })
});
```
