import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using account library', () => {

  describe('when using secret keys from official tezos-client', () => {

    it('should return a wallet with tz1 address', () => {
      const sk = 'edsk3wnVorDRBUht8w7vefLji4sLWkVDNGNF5CN9BWtxRmpYAWpt6q';
      const pk = 'edpkuFkm62ebM37CWXTx3dqDLFT6ePk7yZVbMdaDSeQWb37kBXz6We';
      const pkh = 'tz1N93PbCUEZU8S3XXnNJR8bj9oRBGywwj56';
      const wallet = lib.account.fromPrivate(sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Ed25519', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz2 address', () => {
      const sk = 'spsk38BvsjK6ZdHvMJbxX3HzNBsRxj6madWx5fV9Y79oYfDwRzhmkC';
      const pk = 'sppk7ZakqxCp4xeGr1e9uiMYijV9EZM9twWpTLyioKCaFmgsSwfHJEk';
      const pkh = 'tz2KbbjHAFRs5bCYQ5WPHugt3u7kJ7npBpPU';
      const wallet = lib.account.fromPrivate(sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Secp256k1', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz3 address', () => {
      const sk = 'p2sk3Lco3M48eZtuNBMQNi2PAbo8veAP1BxfdG5nNd5tFSS18EtW8E';
      const pk = 'p2pk676Pfs6q7TELiNn6y64em5XiFFym1sFgRNRZA7Pd8wKjztHmXdG';
      const pkh = 'tz3iwTH5uTKkB2Yz61qpVsvSDqbaUmK2PnQY';
      const wallet = lib.account.fromPrivate(sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('P256', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

  });

  describe('when using encrypted secret keys from official tezos-client', () => {

    it('should return a wallet with tz1 address', () => {
      const password = 'test';
      const esk = 'edesk1tN9p8BakkvZPz2DGAf9oAmxnhx5mFGSe7uVhNdz12Y7Mk2qNtzNaSE2pAwJA1pK9DUSQf1QV5fJeikP19U';
      const pk = 'edpkvRVsYXVd4AGtuxtNvioCD8UjBYDPUUsi2mCD4ReKHtS1HL4Xmp';
      const pkh = 'tz1eWafUkYUnvoW55ZKzcRnkfXhr6ua314wP';
      const wallet = lib.account.fromPrivate(esk, {password: password});
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Ed25519', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz2 address', () => {
      const password = 'test';
      const esk = 'spesk28ioM6QyinG5zKgNyY8de4m4hsMgVAPLfqPkZAuxkQVQJJkK6BexdPv9riRqdQp21FKRfF6Jnd9xdZUZHde';
      const pk = 'sppk7breTgoqRQGkE6j4touN5f3rUZ3UNhhuaKMFJ6zmGBE5giC2qqy';
      const pkh = 'tz2TvHBaQfLVB8XMGcENUcLeHfn9NCuegMcJ';
      const wallet = lib.account.fromPrivate(esk, {password: password});
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Secp256k1', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should return a wallet with tz3 address', () => {
      const password = 'test';
      const esk = 'p2esk243JjKQ21dqmjDYxBxR5LQer6fm2KVWLXLoFPQ2egyJ5zPRh82Z95uCwPghynXqDRdoF5X8zFQodsvkL8EK';
      const pk = 'p2pk65G5s7jnHhfqXHwyirQMtxoS7bZFt7L7zZDcLCHwPsnzPByE52h';
      const pkh = 'tz3VvJiZD4Ly11QVPTF9NMmQQisPRcXt44bc';
      const wallet = lib.account.fromPrivate(esk, {password: password});
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('P256', wallet.curve, 'wrong curve used');
      assert.strictEqual(pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

  });

  describe('when using secret keys from this tezos-client', () => {

    it('should recreate a tz1 wallet', () => {
      const generated = lib.account.create();
      const wallet = lib.account.fromPrivate(generated.sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Ed25519', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.sk, wallet.sk, 'secret key must be the same');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should recreate a tz2 wallet', () => {
      const generated = lib.account.create({ curve: 'Secp256k1' });
      const wallet = lib.account.fromPrivate(generated.sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('Secp256k1', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.sk, wallet.sk, 'secret key must be the same');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should recreate a tz3 wallet', () => {
      const generated = lib.account.create({ curve: 'P256' });
      const wallet = lib.account.fromPrivate(generated.sk);
      assert.isObject(wallet, 'wallet shouldn\'t be empty');
      assert.strictEqual('P256', wallet.curve, 'wrong curve used');
      assert.strictEqual(generated.sk, wallet.sk, 'secret key must be the same');
      assert.strictEqual(generated.pk, wallet.pk, 'wrong derived public key');
      assert.strictEqual(generated.pkh, wallet.pkh, 'wrong derived public key hash');
      assert.isFunction(wallet.sign, 'wallet don\'t have a sign function');
      assert.isFunction(wallet.verify, 'wallet don\'t have a verify function');
    });

    it('should fail to recreate a wallet', () => {
      try {
        lib.account.fromPrivate('unknown');
        assert.fail('no error thrown.');
      } catch (e) {
        assert.strictEqual('Incorrect secret provided!', e, 'wrong error thrown');
      }
    });

  });

});
