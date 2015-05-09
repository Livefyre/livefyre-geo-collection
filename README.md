# livefyre-geo-collection

[![Build Status](https://travis-ci.org/gobengo/livefyre-geo-collection.svg?branch=master)](https://travis-ci.org/Livefyre/livefyre-geo-collection)

A library to access Livefyre Collections through its Map Tile API. This lets you fetch historic content or real-time updates of social content for any GeoJSON Geometry.

## Example Use Cases

* Show me all the social Content that is geotagged at a warriors game at Oracle Arena
* Show me all the the social Content originating from within a 1 mile radius of me

## How does it work?

* You tell `livefyre-geo-collection` about your desired geofence by providing a GeoJSON Geometry. You can use [geojson.io](http://geojson.io/) to draw these.
  - Or use the fixtures in [test/fixtures](./test/fixtures/)
* The library figures out the bounding box of that geometry
* The library figures out which map tile x,y,z covers that bounding box
* The library requests Livefyre APIs to get either historic or real-time Content from that tile
* If the API returns Content that is in the tile, but not in the provided geometry, it throws it onthe ground
* Content in the provided geometry is emitted from a [Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable)

## Usage

### as browser library via Livefyre.js

This example creates a GeoCollection and renders it in a Livefyre Media Wall. [live example](http://output.jsbin.com/joyejiceqi/1/quiet)

You can build this library for browsers (using browserify) via `make dist` if you'd like to deploy it yourself.

```html
<script src="https://cdn.livefyre.com/Livefyre.js"></script>
<script>
Livefyre.require([
  'streamhub-wall#3',
  'streamhub-sdk#2',
  'livefyre-geo-collection#0'],
function (Wall, SDK, GeoCollection) {
  var appEl = document.getElementById('app');
  var collection = new GeoCollection.GeoCollection({
    collection: {
      network: 'labs-t402.fyre.co',
      siteId: 303827,
      articleId: 'uat-ben-geo-0'
    },
    geometry: kansasGeometry(),
    transformState: stateToContent
  });

  var app = new Wall({
    el: document.getElementById('app'),
    collection: collection
  })

  function stateToContent(state) {
    var contents = SDK.StateToContent.transform(state);
    if ( ! (contents && contents.length)) {
      return;
    }
    var content = contents[0];
    return content;
  }

  function kansasGeometry() {
    var json = document.getElementById('kansas-geometry').innerHTML;
    return JSON.parse(json)
  }
})
</script>
```

### as node library

Use the `.GeoCollection` constructor.

```javascript
var geoCollection = new (require('livefyre-geo-collection').GeoCollection)({
  collection: {
    network: 'labs.fyre.co',
    siteId: 315833,
    articleId: 'ben-geo-0'
  },
  // Northeast Kansas
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [
          -95.745849609375,
          39.189690821096804
        ],
        [
          -96.00677490234375,
          38.90813299596705
        ],
        [
          -95.50140380859374,
          38.84826438869913
        ],
        [
          -94.9932861328125,
          38.94232097947902
        ],
        [
          -95.02349853515625,
          39.07464374293249
        ],
        [
          -95.745849609375,
          39.189690821096804
        ]
      ]
    ]
  }
});

// Get a Readable of Content previously added to the Collection
geoCollection.createArchive().on('data', function (content) {
  console.log(content);
});

// Get an infinitely-running real-time feed of new Content added to this geometry in the Collection
geoCollection.createUpdater().on('data', function (content) {
  console.log(content);
})
```

### as cli

Use `./bin/cli.js` (+[docs](./bin/doc.txt)).

```
⚡ ./bin/cli.js -h
Usage:
  livefyre-geo-collection <collection> (-t <tile> | -g <geometry>) url
  livefyre-geo-collection <collection> (-t <tile> | -g <geometry>) fetch
  livefyre-geo-collection <collection> (-t <tile> | -g <geometry>) archive
  livefyre-geo-collection <collection> (-t <tile> | -g <geometry>) stream
  livefyre-geo-collection -v | --version
  livefyre-geo-collection -h | --help

Commands:
  url      print the API URL of the GeoJSON
  fetch    fetch one page of GeoJSON and return the response to stdout
  archive  fetch all the GeoJSON and stream the response to stdout.
  stream   stream real-time updates to stdout
  
Arguments:
  <collection>  URN of Livefyre Collection

Options:
  -t, --tile      specify the GIS tile to access like z,x,y
  -g, --geometry  determine the tile from a GeoJSON geometry (JSON string)
  -h, --help      show this help message and exit
  -v, --version   show version and exit

Examples:
  # Get all historic content from a collection + geometry
  ⚡ livefyre-geo-collection urn:livefyre:client-demo-accounts.fyre.co:site=372680:article=custom-1426705037726:collection -g "$(cat test/fixtures/usa.geojson)" archive

  # Get real-time updates from a collection + geometry
  ⚡ livefyre-geo-collection urn:livefyre:client-demo-accounts.fyre.co:site=372680:article=custom-1426705037726:collection -g "$(cat test/fixtures/usa.geojson)" stream

  # Get URL for provided tile of Collection
  ⚡ livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-1:collection \
    -t 3,3,1 \
    url
  https://labs.bootstrap.fyre.co/bs3/v3.1/labs.fyre.co/315833/YmVuLWdlby0w/geojson/3/7/1.json

  # Fetch one page of content fromthe tile
  ⚡ livefyre-geo-collection urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-1:collection \
    -t 3,3,1 \
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

  # Example of sourcing a GeoJSON feature from a file
  ⚡ node ./bin/cli.js urn:livefyre:labs.fyre.co:site=315833:article=ben-geo-1:collection -g "$(cat test/fixtures/ks.json)" url
```

Note: If you `npm link` this repo, or `npm install -g livefyre-geo-collection`, then you can just

```
livefyre-geo-collection -h
```
