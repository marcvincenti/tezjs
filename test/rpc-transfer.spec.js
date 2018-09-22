import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using rpc library', () => {

  it('should return the head of main chain', (done) => {
    const alphanet_sk = 'fillwithyourown';
    const wallet = lib.account.fromPrivate(alphanet_sk);
    const wallet2 = lib.account.create();
    // transfer 1 tezzie
    lib.rpc.transfer(wallet, wallet2.pkh, 1000000, null, (err, res) => {
      assert.isNull(err, 'transfer request have failed');
      // TODO: add integration tests
      done();
    });
  });

});
