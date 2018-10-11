import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using account library', () => {

  describe('when using public keys from official tezos-client', () => {

    it('should return a wallet with tz1 address', () => {
      const pk = 'edpkuFkm62ebM37CWXTx3dqDLFT6ePk7yZVbMdaDSeQWb37kBXz6We';
      const pkh = 'tz1N93PbCUEZU8S3XXnNJR8bj9oRBGywwj56';
      const wallet = lib.account.fromPublic(pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Ed25519', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz2 address', () => {
      const pk = 'sppk7ZakqxCp4xeGr1e9uiMYijV9EZM9twWpTLyioKCaFmgsSwfHJEk';
      const pkh = 'tz2KbbjHAFRs5bCYQ5WPHugt3u7kJ7npBpPU';
      const wallet = lib.account.fromPublic(pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Secp256k1', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz3 address', () => {
      const pk = 'p2pk676Pfs6q7TELiNn6y64em5XiFFym1sFgRNRZA7Pd8wKjztHmXdG';
      const pkh = 'tz3iwTH5uTKkB2Yz61qpVsvSDqbaUmK2PnQY';
      const wallet = lib.account.fromPublic(pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('P256', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

  });

  describe('when using public keys from this tezos-client', () => {

    it('should recreate a tz1 wallet', () => {
      const generated = lib.account.create();
      const wallet = lib.account.fromPublic(generated.pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Ed25519', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should recreate a tz2 wallet', () => {
      const generated = lib.account.create({ curve: 'Secp256k1' });
      const wallet = lib.account.fromPublic(generated.pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Secp256k1', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should recreate a tz3 wallet', () => {
      const generated = lib.account.create({ curve: 'P256' });
      const wallet = lib.account.fromPublic(generated.pk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('P256', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should fail to recreate a wallet', () => {
      try {
        lib.account.fromPublic('unknown');
        assert.fail('no error thrown.');
      } catch (e) {
        assert.strictEqual('Incorrect public key provided!', e, 'wrong error thrown');
      }
    });

  });

});
