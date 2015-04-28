var geoUrl = require('../').url;

console.log('livefyre-geo-collection stdout example');

var opts = {
  collection: {
    network: 'labs.fyre.co',
    siteId: 315833,
    articleId: 'ben-geo-0'
  },
  x: 3,
  y: 7,
  z: 1
};

require('../').fetch(opts)
.then(function (res) {
  debugger;
  return res.json();
})
.then(function (json) {
  console.log('fetched', json);
  process.exit();
})
.then(null, function (err) {
  console.error(err);
  process.exit(1);
})

