export default {

  toBuffer: function (bytes) {
    return new Uint8Array(bytes.match(/[\da-f]{2}/gi)).map(function (h) {
      return parseInt(h, 16)
    });
  }

}
