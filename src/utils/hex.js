module.exports = {

  toBuffer: function (bytes) {
    const byteArray = bytes.match(/[\da-f]{2}/gi) || [];
    return new Uint8Array(
      byteArray.map(function (h) {
        return parseInt(h, 16)
      })
    );
  }

}
