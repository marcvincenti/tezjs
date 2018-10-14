const blake2b = require('blake2b');

import buffer from './utils/buffer';

module.exports = {

  hash: function (msg, size = 32) {
    const output = new Uint8Array(size);
    let input = Buffer.from(msg);
    return blake2b(size).update(input).digest(output);
  }

}
