const XMLHttpRequest = (typeof window !== 'undefined' && window.XMLHttpRequest) ?
                        window.XMLHttpRequest
                      : require('xmlhttprequest').XMLHttpRequest;

const defaultEndPoint = 'https://rpc.tezrpc.me';

export default {

  get: function (route, callback) {
    const oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
      if (oReq.readyState === 4) {
        if (oReq.status === 200) {
          const balance = parseInt(oReq.responseText.match(/[0-9]+/gi).pop());
          callback(null, balance);
        } else {
          callback(oReq.status, null);
        }
      }
    }
    oReq.open('GET', defaultEndPoint + route, true);
    oReq.send(null);
  },

}
