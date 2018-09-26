import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using rpc library', () => {

  it('should transfer 1 tez', (done) => {
    const alphanet_sk = 'edsk4Jq8hUbvt7sg7SNo8i9Fmrg2MkpG8cPubPqhNc3vhm18ZfacTx';
    const wallet = lib.account.fromPrivate(alphanet_sk);
    const wallet2 = lib.account.create();
    // transfer 1 tezzie
    lib.operation.transfer(wallet, wallet2.pkh, 1000000, null, (err, res) => {
      assert.isNull(err, 'transfer request have failed');
      // TODO: add integration tests
      done();
    });
  });

});
