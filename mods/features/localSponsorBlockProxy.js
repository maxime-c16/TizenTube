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

function showProxyBootMarker() {
  if (!document || document.getElementById('tt-proxy-marker')) {
    return;
  }

  var marker = document.createElement('div');
  marker.id = 'tt-proxy-marker';
  marker.textContent = 'TizenTube Proxy active';
  marker.style.position = 'fixed';
  marker.style.top = '24px';
  marker.style.right = '24px';
  marker.style.zIndex = '2147483647';
  marker.style.padding = '10px 14px';
  marker.style.background = 'rgba(11, 18, 33, 0.88)';
  marker.style.color = '#d7ffe1';
  marker.style.border = '1px solid rgba(88, 217, 140, 0.55)';
  marker.style.borderRadius = '999px';
  marker.style.fontFamily = 'sans-serif';
  marker.style.fontSize = '18px';
  marker.style.lineHeight = '1';
  marker.style.pointerEvents = 'none';
  marker.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.35)';

  function attachMarker() {
    if (!document.body) {
      return setTimeout(attachMarker, 50);
    }
    document.body.appendChild(marker);
    setTimeout(function() {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    }, 4000);
  }

  attachMarker();
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

window.__TIZENTUBE_PROXY_ACTIVE = true;
showProxyBootMarker();
