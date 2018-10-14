import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using operation library', () => {

  const alphanet_sk = 'edsk4Jq8hUbvt7sg7SNo8i9Fmrg2MkpG8cPubPqhNc3vhm18ZfacTx';

  it('should transfer 1 tez from a tz1 pkh', (done) => {
    const wallet = lib.account.fromPrivate(alphanet_sk);
    const wallet2 = lib.account.create();
    // transfer 1 tezzie
    lib.operation.transfer(wallet, wallet2.pkh, 1000000, null, (err, res) => {
      assert.isNull(err, 'transfer request have failed');
      assert.isObject(res, 'result shouldn\'t be empty');
      assert.isNotNull(res.hash, 'result should contain a hash');
      assert.isArray(res.operations, 'result should contain an operations array');
      done();
    });
  });

  /*it('should transfer 1 tez from a tz2 pkh', (done) => {
    const wallet = lib.account.fromPrivate(alphanet_sk);
    const wallet2 = lib.account.create({ curve: 'Secp256k1' });
    lib.operation.transfer(wallet, wallet2.pkh, 1000000, null, (err, res) => {
      assert.isNull(err, 'transfer request have failed');
      lib.operation.transfer(wallet2, wallet.pkh, 950000, null, (err, res) => {
        assert.isNull(err, 'transfer request have failed');
        assert.isObject(res, 'result shouldn\'t be empty');
        assert.isNotNull(res.hash, 'result should contain a hash');
        assert.isArray(res.operations, 'result should contain an operations array');
        done();
      });
    });
  });

  it('should transfer 1 tez from a tz3 pkh', (done) => {
    const wallet = lib.account.fromPrivate(alphanet_sk);
    const wallet2 = lib.account.create({ curve: 'P256' });
    lib.operation.transfer(wallet, wallet2.pkh, 1000000, null, (err, res) => {
      assert.isNull(err, 'transfer request have failed');
      lib.operation.transfer(wallet2, wallet.pkh, 950000, null, (err, res) => {
        assert.isNull(err, 'transfer request have failed');
        assert.isObject(res, 'result shouldn\'t be empty');
        assert.isNotNull(res.hash, 'result should contain a hash');
        assert.isArray(res.operations, 'result should contain an operations array');
        done();
      });
    });
  });*/

});
