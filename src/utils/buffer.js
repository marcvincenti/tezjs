module.exports = {

  merge: function(buf1 ,buf2) {
    const buf = new Uint8Array(buf1.length + buf2.length);
    buf.set(buf1);
    buf.set(buf2, buf1.length);
    return buf;
  },

  toHex: function (buffer) {
    return buffer.reduce((prev, cur) => prev + ('0' + cur.toString(16)).slice(-2), '');
  }

}
