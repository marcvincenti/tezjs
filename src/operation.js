import req from './requests/req';
import watermark from './utils/watermark';

export default {

  transfer: function (wallet, to, amount, params, callback) {
    let { fee, gasLimit, storageLimit } = params || {};
    if (typeof fee === 'undefined') fee = 50000;
    if (typeof gasLimit === 'undefined') gasLimit = 200;
    if (typeof storageLimit === 'undefined') storageLimit = 0;
    req.get('/chains/main/blocks/head/header', function(err, head) {
      if (err) {
        callback(err, head);
      } else {
        req.get(`/chains/main/blocks/head/context/contracts/${wallet.pkh}/counter`, function(err, counter) {
          if (err) {
            callback(err, counter);
          } else {
            const forge_route = `/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`;
            counter = parseInt(counter);
            const operations = {
              branch: head.hash,
              contents: []
            };
            req.get(`/chains/main/blocks/head/context/contracts/${wallet.pkh}/manager_key`, function (err, manager) {
              if (err) {
                callback(err, counter);
              } else {
                if (typeof manager.key === 'undefined') {
                  operations.contents.push({
                    kind: 'reveal',
                    counter: (++counter).toString(),
                    fee: '0',
                    gas_limit: '0',
                    storage_limit: '0',
                    public_key: wallet.pk,
                    source: wallet.pkh
                  });
                }
                operations.contents.push({
                  kind: 'transaction',
                  counter: (++counter).toString(),
                  fee: fee.toString(),
                  gas_limit: gasLimit.toString(),
                  storage_limit: storageLimit.toString(),
                  amount: amount.toString(),
                  source: wallet.pkh,
                  destination: to
                });
                req.send(forge_route, operations, function (err, bytes) {
                  if (err) {
                    callback(err, bytes);
                  } else {
                    const sig = wallet.sign(bytes, watermark.generic);
                    const operations_route = '/chains/main/blocks/head/helpers/preapply/operations';
                    operations.protocol = head.protocol;
                    operations.signature = sig.signature;
                    req.send(operations_route, [operations], function (err, operations) {
                      if (err) {
                        callback(err, operations);
                      } else {
                        // verify operations
                        let err = false;
                        operations.forEach((batch) => {
                          batch.contents.forEach((op) => {
                            if (op.metadata.operation_result.status !== 'applied') {
                              err = true;
                              callback('operation error', batch);
                            }
                          });
                        });
                        if (!err) {
                          req.send('/injection/operation', sig.bytes, function (err, res) {
                            if (err) {
                              callback(err, res);
                            } else {
                              callback(err, {
                                hash: res,
                                operations: operations
                              })
                            }
                          });
                        }
                      }
                    });
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
