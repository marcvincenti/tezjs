import req from './requests/req.js';

export default {

  getBalance: function (address, callback) {
    const route = `/chains/main/blocks/head/context/contracts/${address}/balance`;
    return req.get(route, (err, res) => callback(err, res ? parseInt(res) : res));
  },

  getHead: function (callback) {
    const route = '/chains/main/blocks/head';
    return req.get(route, callback);
  },

}
