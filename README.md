# livefyre-geo-collection

[![Build Status](https://travis-ci.org/gobengo/livefyre-geo-collection.svg?branch=master)](https://travis-ci.org/gobengo/livefyre-geo-collection)

## Usage

### library

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

### cli

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

Example:
  livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-0:collection 3 7 1 url
  livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-0:collection 3 7 1 fetch
```

Note: If you `npm link` this repo, or `npm install -g livefyre-geo-collection`, then you can just

```
livefyre-geo-collection -h
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
