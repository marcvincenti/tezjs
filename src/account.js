const sodium = require('libsodium-wrappers');
const bip39 = require('bip39');

import curves from './crypto/curves';
import black2B from './crypto/blake2B';
import base58 from './crypto/base58';

export default {

  fromMnemonic: function (mnemonic, params) {
    const { curve, password } = params || {};
    const p_curve = curve || curves.Ed25519;

    const seed = bip39.mnemonicToSeed(mnemonic, password).slice(0, 32);
    switch (p_curve.type) {
      case 'ecdsa':
        const keyPair = p_curve.ec.genKeyPair({ entropy: seed });
        const pubPoint = keyPair.getPublic();
        const compressed_pub = new Buffer([
          Number(pubPoint.getY().toString(2).slice(-1)) + 2,
          ...pubPoint.getX().toBuffer()
        ]);
        switch (p_curve.name) {
          case 'Secp256k1':
            return {
              mnemonic: mnemonic,
              curve: 'Secp256k1',
              sk: base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
              pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
              pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash')
            };
          case 'P256':
            return {
              mnemonic: mnemonic,
              curve: 'P256',
              sk: base58.encode(keyPair.getPrivate().toBuffer(), 'p256_secret_key'),
              pk: base58.encode(compressed_pub, 'p256_public_key'),
              pkh: base58.encode(black2B.hash(20, compressed_pub), 'p256_public_key_hash')
            };
        }
        break;
      case 'eddsa':
        if (p_curve.name === 'Ed25519') {
          const kp = sodium.crypto_sign_seed_keypair(seed);
          return {
            mnemonic: mnemonic,
            curve: 'Ed25519',
            sk: base58.encode(seed, 'ed25519_seed'),
            pk: base58.encode(kp.publicKey, 'ed25519_public_key'),
            pkh: base58.encode(black2B.hash(20, kp.publicKey), 'ed25519_public_key_hash')
          };
        }
        break;
    }
    throw `Unknown curve ${p_curve.name}!`;
  },

  fromPrivate: function (privateKey) {
    if (/^edsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(privateKey)) {
      const seed = base58.decode(privateKey, 'ed25519_seed');
      const kp = sodium.crypto_sign_seed_keypair(seed);
      return {
        curve: 'Ed25519',
        sk: privateKey,
        pk: base58.encode(kp.publicKey, 'ed25519_public_key'),
        pkh: base58.encode(black2B.hash(20, kp.publicKey), 'ed25519_public_key_hash')
      };
    } else if (/^spsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(privateKey)) {
      const sk = base58.decode(privateKey, 'secp256k1_secret_key');
      const pubPoint = curves.Secp256k1.ec.keyFromPrivate(sk).getPublic();
      const compressed_pub = new Buffer([
        Number(pubPoint.getY().toString(2).slice(-1)) + 2,
        ...pubPoint.getX().toBuffer()
      ]);
      return {
        curve: 'Secp256k1',
        sk: privateKey,
        pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
        pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash')
      };
    } else if (/^p2sk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(privateKey)) {
      const sk = base58.decode(privateKey, 'p256_secret_key');
      const pubPoint = curves.P256.ec.keyFromPrivate(sk).getPublic();
      const compressed_pub = new Buffer([
        Number(pubPoint.getY().toString(2).slice(-1)) + 2,
        ...pubPoint.getX().toBuffer()
      ]);
      return {
        curve: 'P256',
        sk: privateKey,
        pk: base58.encode(compressed_pub, 'p256_public_key'),
        pkh: base58.encode(black2B.hash(20, compressed_pub), 'p256_public_key_hash')
      };
    } else {
      throw `Incorrect secret provided!`;
    }
  },

  create: function (params) {
    const mnemonic = bip39.generateMnemonic(160);
    return this.fromMnemonic(mnemonic, params);
  }

}
