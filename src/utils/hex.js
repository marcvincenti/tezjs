export default {

  fromBuffer: function (buffer) {
    return new Uint8Array(buffer).map((b) => {
      return ('00' + b.toString(16)).slice(-2);
    }).join('');
  },

  toBuffer: function (bytes) {
    return new Uint8Array(bytes.match(/[\da-f]{2}/gi)).map(function (h) {
      return parseInt(h, 16)
    });
  }

}
