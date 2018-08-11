import chai from 'chai';

const assert = chai.assert;

import lib from '../lib/tez.js';

describe('Using account library', () => {
  describe('when creating a wallet', () => {

    it('should return a tz1 address', () => {
      const wallet = lib.account.create();
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.isTrue(/^edsk[a-km-zA-HJ-NP-Z1-9]{94}$/.test(wallet.sk),
        'secret_key don\'t have required format');
      assert.isTrue(/^edpk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(wallet.pk),
        'public_key don\'t have required format');
      assert.isTrue(/^tz1[a-km-zA-HJ-NP-Z1-9]{33}$/.test(wallet.pkh),
        'address don\'t have required format');
    });

    it('should return a tz2 wallet', () => {
      const wallet = lib.account.create({
        curve: lib.curve.Secp256k1
      });
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.isTrue(/^spsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(wallet.sk),
        'secret_key don\'t have required format');
      assert.isTrue(/^sppk[a-km-zA-HJ-NP-Z1-9]{51}$/.test(wallet.pk),
        'public_key don\'t have required format');
      assert.isTrue(/^tz2[a-km-zA-HJ-NP-Z1-9]{33}$/.test(wallet.pkh),
        'address don\'t have required format');
    });

    it('should return a tz3 wallet', () => {
      const wallet = lib.account.create({
        curve: lib.curve.P256
      });
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.isTrue(/^p2sk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(wallet.sk),
        'secret_key don\'t have required format');
      assert.isTrue(/^p2pk[a-km-zA-HJ-NP-Z1-9]{51}$/.test(wallet.pk),
        'public_key don\'t have required format');
      assert.isTrue(/^tz3[a-km-zA-HJ-NP-Z1-9]{33}$/.test(wallet.pkh),
        'address don\'t have required format');
    });

  });
});
