const sodium = require('libsodium-wrappers');
const bip39 = require('bip39');

import curves from './crypto/curves';
import black2B from './crypto/blake2B';
import base58 from './crypto/base58';

export default {

  generate: function (params) {
    const { curve, password } = params || {};
    const p_curve = curve || curves.Ed25519;

    /* Generate a seed */
    const mnemonic = bip39.generateMnemonic(160);
    const seed = bip39.mnemonicToSeed(mnemonic, password).slice(0, 32);

    switch (p_curve.type) {
      case 'ecdsa':
        const keyPair = p_curve.ec.genKeyPair({ entropy: seed });
        const pubPoint = keyPair.getPublic();
        const compressed_pub = new Buffer([
          ...pubPoint.getX().toBuffer(),
          pubPoint.getY().toString(2).slice(-1)
        ]);
        switch (p_curve.name) {
          case 'Secp256k1':
            return {
              mnemonic: mnemonic,
              sk: base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
              pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
              pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash')
            };
          case 'P256':
            return {
              mnemonic: mnemonic,
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
            sk: base58.encode(kp.privateKey, 'ed25519_secret_key'),
            pk: base58.encode(kp.publicKey, 'ed25519_public_key'),
            pkh: base58.encode(black2B.hash(20, kp.publicKey), 'ed25519_public_key_hash')
          };
        }
        break;
    }
    return null;
  }

}
