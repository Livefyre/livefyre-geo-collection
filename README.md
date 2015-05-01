# livefyre-geo-collection

[![Build Status](https://travis-ci.org/gobengo/livefyre-geo-collection.svg?branch=master)](https://travis-ci.org/gobengo/livefyre-geo-collection)

## Usage

### as library

Get the URL of a specific map tile's worth of geo-indexed Content.

```javascript
var geoOpts = {
    collection: {
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
    },
    x: 3,
    y: 7,
    z: 1
};

// .url() creates a URL to GeoJSON
require('livefyre-geo-collection').url(geoOpts) === 'https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json';

// .request() returns a promise of WHATWG fetch response
require('livefyre-geo-collection').request(geoOpts)
.then(function (res) {
  console.log('requested and got status '+res.status);
  // See https://fetch.spec.whatwg.org/#response-class for more methods
});

// .fetch() fetches GeoJSON and returns it directly
require('livefyre-geo-collection').fetch(geoOpts)
.then(function (json) {
  /*
  JSON is like:
  {
    "paging": {
      "hasPrev": false,
      "limit": 50
    },
    "type": "FeatureCollection",
    "features": [],
    "authors": []
  }
  */
});
```

### as cli

Use `./bin/cli.js` (+[docs](./bin/doc.txt)).

```
⚡ ./bin/cli.js -h
Usage:
  livefyre-geo-collection <collection> <x> <y> <z> url
  livefyre-geo-collection <collection> <x> <y> <z> fetch
  livefyre-geo-collection -v | --version
  livefyre-geo-collection -h | --help

Commands:
  url    Get the API URL of the GeoJSON
  fetch  fetch the GeoJSON and return the response to stdout

Arguments:
  <collection>  URN of Livefyre Collection
  <x>           x coordinate of map tile
  <y>           y coordinate of map tile
  <z>           z coordinate of map tile

Options:
  -h, --help     show this help message and exit
  -v, --version  show version and exit

Examples:
  ⚡ livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-0:collection \
    3 7 1 \
    url
  https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json

  ⚡ livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-0:collection \
    3 7 1 \
    fetch
  {
    "paging": {
      "hasPrev": false,
      "limit": 50
    },
    "type": "FeatureCollection",
    "features": [],
    "authors": []
  }
```

Note: If you `npm link` this repo, or `npm install -g livefyre-geo-collection`, then you can just

```
livefyre-geo-collection -h
```

## Goal

v1 will be able to do this in the browser

```javascript
Livefyre.require([
  'streamhub-wall#3',
  'livefyre-geo-collection#1'],
function (Wall, GeoCollection) {
  new Wall({
    el: document.getElement('wall'),
    collection: GeoCollection({
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

```javascript
Livefyre.require([
  'streamhub-wall#3',
  'livefyre-geo-collection#1'],
function (Wall, GeoCollection) {
  new Wall({
    el: document.getElement('wall'),
    collection: GeoCollection({
      network: 'labs.fyre.co',
      siteId: 315833,
      articleId: 'ben-geo-0'
      geometry: GeoCollection.geometries.circle([1,1, 0,0], 'radi')
    })
  })
});
```
