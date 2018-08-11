const sodium = require('libsodium-wrappers');

import curves from './crypto/curves';
import black2B from './crypto/blake2B';
import base58 from './crypto/base58';

export default {

  create: function (params) {
    const { curve } = params || {};
    const p_curve = curve || curves.Ed25519;

    let wallet = {};
    if (p_curve.type === 'ecdsa') {
      const keyPair = p_curve.ec.genKeyPair();
      const pubPoint = keyPair.getPublic();
      const compressed_pub = new Buffer([
        ...pubPoint.getX().toBuffer(),
        pubPoint.getY().toString(2).slice(-1)
      ]);
      if (p_curve.name === 'Secp256k1') {
        wallet = {
          sk: base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
          pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
          pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash')
        };
      } else if (p_curve.name === 'P256') {
        wallet = {
          sk: base58.encode(keyPair.getPrivate().toBuffer(), 'p256_secret_key'),
          pk: base58.encode(compressed_pub, 'p256_public_key'),
          pkh: base58.encode(black2B.hash(20, compressed_pub), 'p256_public_key_hash')
        };
      }
    } else if (p_curve.name === 'Ed25519') {
      const kp = sodium.crypto_sign_keypair();
      wallet = {
        sk: base58.encode(kp.privateKey, 'ed25519_secret_key'),
        pk: base58.encode(kp.publicKey, 'ed25519_public_key'),
        pkh: base58.encode(black2B.hash(20, kp.publicKey), 'ed25519_public_key_hash')
      };
    }

    console.log(wallet);

    return wallet;
  }

}
