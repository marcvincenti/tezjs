const bs58check = require('bs58check');

import tezprefix from './prefix';

module.exports = {

  encode: function (payload, prefix) {
    const _prefix = tezprefix[prefix] || [];
    const n = new Uint8Array(_prefix.length + payload.length);
    n.set(_prefix);
    n.set(payload, _prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
  },

  decode: function (encoded, prefix) {
    return bs58check.decode(encoded).slice(tezprefix[prefix].length);
  }

}
