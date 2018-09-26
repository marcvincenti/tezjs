import account from './account';
import req from './requests/req';

const addressBaseRoute = '/chains/main/blocks/head/context/contracts';

export default {

  getBalance: function (address, callback) {
    const route = `${addressBaseRoute}/${address}/balance`;
    req.get(route, (err, res) => callback(err, res ? parseInt(res) : res));
  }

}
