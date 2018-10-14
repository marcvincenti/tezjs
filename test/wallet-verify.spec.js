import chai from 'chai';

const assert = chai.assert;
const message = '0xdeadbeef';

import lib from '../src/index.js';

describe('Using wallet object', () => {

  describe('with a tz1 pkh', () => {

    it('should verify tz1 signature', () => {
      const wallet = lib.account.create();
      const signature = wallet.sign(message);
      assert.isTrue(wallet.verify(signature.signature, message),
        'The signature provided should be truthy.');
      assert.isFalse(wallet.verify(signature.signature, ''),
        'The signature provided should correspond to only one message.');
    });

  });

  describe('with a tz2 pkh', () => {

    it('should verify tz2 signature', () => {
      const wallet = lib.account.create({ curve: 'Secp256k1' });
      const signature = wallet.sign(message);
      assert.isTrue(wallet.verify(signature.signature, message),
        'The signature provided should be truthy.');
      assert.isFalse(wallet.verify(signature.signature, '0'),
        'The signature provided should not correspond to this message.');
    });

  });

  describe('with a tz3 pkh', () => {

    it('should verify tz3 signature', () => {
      const wallet = lib.account.create({ curve: 'P256' });
      const signature = wallet.sign(message);
      assert.isTrue(wallet.verify(signature.signature, message),
        'The signature provided should be truthy.');
      assert.isFalse(wallet.verify(signature.signature, '0'),
        'The signature provided should not correspond to this message.');
    });

  });

});
