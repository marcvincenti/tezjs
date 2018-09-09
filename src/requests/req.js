const XMLHttpRequest = (typeof window !== 'undefined' && window.XMLHttpRequest) ?
                        window.XMLHttpRequest
                      : require('xmlhttprequest').XMLHttpRequest;

import provider from './provider';

export default {

  get: function (route, callback) {
    const oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
      if (oReq.readyState === 4) {
        if (oReq.status === 200) {
          callback(null, JSON.parse(oReq.responseText));
        } else {
          callback(oReq.status, null);
        }
      }
    }
    oReq.open('GET', provider.provider + route, true);
    oReq.send(null);
  },

}
