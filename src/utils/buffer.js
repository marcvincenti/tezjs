export default {

  merge: function(buffer_1 ,buffer_2) {
    const length = buffer_1.length + buffer_2.length;
    const buf = new Uint8Array(length);
    buf.set(buffer_1);
    buf.set(buffer_2, buffer_1.length);
    return buf;
  },

  toHex: function (buffer) {
    return new Uint8Array(buffer).map((b) => {
      return ('00' + b.toString(16)).slice(-2);
    }).join('');
  }

}
