var serviceHostTemplate = '{networkName}.{service}.fyre.co';
/**
 * Get the host to make geojson requests to for a network
 * @example apiHostForNetwork('ben.fyre.co') -> 'ben.bootstrap.fyre.co'
 * @example apiHostForNetwork('livefyre.com') -> 'bootstrap.livefyre.com'
 */
exports.apiHostForNetwork = function apiHostForNetwork(network, service) {
  service = service || 'bootstrap';
  if (network === 'livefyre.com') {
    return service+'.livefyre.com';
  }
  return this.renderURLTemplate(serviceHostTemplate, {
    networkName: this.networkNameOfNetwork(network),
    service: service
  });
}

/**
 * Render a URL Template string with a context object
 * http://en.wikipedia.org/wiki/URL_Template
 * @example render('{thing}s', { thing: 'apple' }) -> 'apples'
 */
exports.renderURLTemplate = function renderURLTemplate(template, context) {
  context = context || {};
  var rendered = template;
  Object.keys(context).forEach(function (key) {
    var symbol = '{'+key+'}';
    rendered = rendered.replace(symbol, context[key]);
  });
  return rendered;
}

var networkNamePattern = /([^.]+)\.fyre\.co/i
/**
 * Get the Livefyre networkName of a full network host
 * @example networkNameOfNetwork('ben.fyre.co') -> 'ben'
 */
exports.networkNameOfNetwork = function networkNameOfNetwork(network) {
  var networkName = network.match(networkNamePattern);
  if ( ! networkName) {
    throw new Error("Couldn't extract networkName from network "+network);
  }
  return networkName[1];
}
