import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using rpc library', () => {

  it('should return the balance of a wallet', (done) => {
    const wallet = lib.account.create();
    lib.rpc.getBalance(wallet.pkh, (err, res) => {
      assert.isNull(err, 'balance request have failed');
      assert.strictEqual(res, 0, 'balance should be 0')
      done();
    });
  });

});
