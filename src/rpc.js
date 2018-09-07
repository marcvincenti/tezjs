import req from './requests/req.js';

export default {

  getBalance: function (address, callback) {
    const route = `/chains/main/blocks/head/context/contracts/${address}/balance`;
    return req.get(route, callback);
  },

}
