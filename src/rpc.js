import req from './requests/req.js';

const addressBaseRoute = '/chains/main/blocks/head/context/contracts';

export default {

  getAddress: function (address, callback) {
    const route = `${addressBaseRoute}/${address}`;
    return req.get(route, callback);
  },

  getBalance: function (address, callback) {
    const route = `${addressBaseRoute}/${address}/balance`;
    return req.get(route, (err, res) => callback(err, res ? parseInt(res) : res));
  },

  getHead: function (callback) {
    const route = '/chains/main/blocks/head';
    return req.get(route, callback);
  },

}
