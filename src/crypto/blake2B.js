const blake2b = require('blake2b');

export default {

  hash: function (size, msg) {
    const output = new Uint8Array(size)
    const input = Buffer.from(msg)
    return blake2b(size).update(input).digest(output);
  }

}
