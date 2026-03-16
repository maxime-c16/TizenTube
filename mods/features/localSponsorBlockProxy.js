var TIZEN_PROXY_BASE = 'http://127.0.0.1:8888';
var TIZEN_PROXY_REMAPS = [
  ['https://sponsor.ajay.app/api/', TIZEN_PROXY_BASE + '/api/'],
  ['https://api.dearrow.ajay.app/api/', TIZEN_PROXY_BASE + '/api/'],
  ['https://dearrow-thumb.ajay.app/api/', TIZEN_PROXY_BASE + '/api/']
];
var tizenTubeOriginalFetch = window.fetch;
var tizenTubeOriginalXHROpen = XMLHttpRequest.prototype.open;

function remapSponsorBlockUrl(input) {
  var i;
  var value = input;

  if (typeof value !== 'string') {
    return value;
  }

  for (i = 0; i < TIZEN_PROXY_REMAPS.length; i += 1) {
    if (value.indexOf(TIZEN_PROXY_REMAPS[i][0]) === 0) {
      return TIZEN_PROXY_REMAPS[i][1] + value.substring(TIZEN_PROXY_REMAPS[i][0].length);
    }
  }

  return value;
}

if (typeof tizenTubeOriginalFetch === 'function') {
  window.fetch = function(resource, init) {
    var remapped;

    if (typeof resource === 'string') {
      remapped = remapSponsorBlockUrl(resource);
      if (remapped !== resource) {
        return tizenTubeOriginalFetch.call(this, remapped, init);
      }
    } else if (resource && typeof resource.url === 'string') {
      remapped = remapSponsorBlockUrl(resource.url);
      if (remapped !== resource.url) {
        return tizenTubeOriginalFetch.call(this, remapped, init);
      }
    }

    return tizenTubeOriginalFetch.call(this, resource, init);
  };
}

XMLHttpRequest.prototype.open = function(method, url) {
  arguments[1] = remapSponsorBlockUrl(url);
  return tizenTubeOriginalXHROpen.apply(this, arguments);
};
