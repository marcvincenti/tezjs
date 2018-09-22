import account from './account.js';
import req from './requests/req.js';

const addressBaseRoute = '/chains/main/blocks/head/context/contracts';

export default {

  getAddress: function (address, callback) {
    const route = `${addressBaseRoute}/${address}`;
    req.get(route, callback);
  },

  getBalance: function (address, callback) {
    const route = `${addressBaseRoute}/${address}/balance`;
    req.get(route, (err, res) => callback(err, res ? parseInt(res) : res));
  },

  transfer: function (wallet, to, amount, params, callback) {
    let { fee, gasLimit, storageLimit } = params || {};
    if (typeof fee == 'undefined') fee = 50000;
    if (typeof gasLimit == 'undefined') gasLimit = 200;
    if (typeof storageLimit == 'undefined') storageLimit = 0;
    req.get('/chains/main/blocks/head/header', function(err, head) {
      if (err) {
        callback(err, head);
      } else {
        req.get(`/chains/main/blocks/head/context/contracts/${wallet.pkh}/counter`, function(err, counter) {
          if (err) {
            callback(err, counter);
          } else {
            const forge_route = `/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`;
            const operation = {
              kind: 'transaction',
              counter: (parseInt(counter) + 1).toString(),
              fee: fee.toString(),
              gas_limit: gasLimit.toString(),
              storage_limit: storageLimit.toString(),
              amount: amount.toString(),
              source: wallet.pkh,
              destination: to
            };
            const operations = {
              branch: head.hash,
              contents: [operation]
            };
            req.send(forge_route, operations, (err, bytes) => {
              if (err) {
                callback(err, bytes);
              } else {
                const sig = wallet.sign(bytes);
                const operations_route = '/chains/main/blocks/head/helpers/preapply/operations';
                operations.protocol = head.protocol;
                operations.signature = sig.signature;
                req.send(operations_route, [operations], (err, operations) => {
                  if (err) {
                    callback(err, bytes);
                  } else {
                    console.log(operations);
                  }
                });
              }
            });
          }
        });
      }
    });
  },

}
