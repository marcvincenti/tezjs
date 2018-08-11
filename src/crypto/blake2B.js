const sodium = require('libsodium-wrappers');

export default {

  hash: function (size, msg) {
    return sodium.crypto_generichash(size, msg);
  }

}
