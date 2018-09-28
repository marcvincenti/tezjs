const sodium = require('libsodium-wrappers');
const bip39 = require('bip39');

import base58 from './utils/base58';
import black2B from './crypto/blake2B';
import buffer from './utils/buffer';
import curves from './crypto/curves';
import hex from './utils/hex';

function generate_ED25519_wallet(secret) {
  const kp = sodium.crypto_sign_seed_keypair(secret);
  return {
    curve: 'Ed25519',
    sk: base58.encode(secret, 'ed25519_seed'),
    pk: base58.encode(kp.publicKey, 'ed25519_public_key'),
    pkh: base58.encode(black2B.hash(20, kp.publicKey), 'ed25519_public_key_hash'),
    sign: function (bytes, watermark) {
      let buf = hex.toBuffer(bytes);
      if (typeof watermark !== 'undefined') {
        buf = buffer.merge(watermark, buf);
      }
      const signature = sodium.crypto_sign_detached(black2B.hash(32, buf), kp.privateKey, 'uint8array');
      return {
        signature: base58.encode(signature, 'ed25519_signature'),
        bytes: bytes + buffer.toHex(signature)
      }
    },
    verify: function (signature, bytes) {
      return sodium.crypto_sign_verify_detached(signature, hex.toBuffer(bytes), kp.publicKey);
    }
  };
}

function generate_Secp256k1_wallet(secret) {
  const keyPair = curves.Secp256k1.ec.keyFromPrivate(secret);
  const pubPoint = keyPair.getPublic();
  const compressed_pub = new Buffer([
    Number(pubPoint.getY().toString(2).slice(-1)) + 2,
    ...pubPoint.getX().toBuffer()
  ]);
  return {
    curve: 'Secp256k1',
    sk: base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
    pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
    pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash')
  };
}

function generate_P256_wallet(secret) {
  const keyPair = curves.P256.ec.keyFromPrivate(secret);
  const pubPoint = keyPair.getPublic();
  const compressed_pub = new Buffer([
    Number(pubPoint.getY().toString(2).slice(-1)) + 2,
    ...pubPoint.getX().toBuffer()
  ]);
  return {
    curve: 'P256',
    sk: base58.encode(keyPair.getPrivate().toBuffer(), 'p256_secret_key'),
    pk: base58.encode(compressed_pub, 'p256_public_key'),
    pkh: base58.encode(black2B.hash(20, compressed_pub), 'p256_public_key_hash')
  };
}

export default {

  create: function (params) {
    const mnemonic = bip39.generateMnemonic(160);
    return this.fromMnemonic(mnemonic, params);
  },

  fromMnemonic: function (mnemonic, params) {
    let { passphrase, curve } = params || {};
    if (typeof curve == 'undefined') curve = 'Ed25519';

    const seed = bip39.mnemonicToSeed(mnemonic, passphrase).slice(0, 32);
    let wallet;
    switch (curve) {
      case 'Ed25519':
        wallet = generate_ED25519_wallet(seed);
        break;
      case 'Secp256k1':
        wallet = generate_Secp256k1_wallet(seed);
        break;
      case 'P256':
        wallet = generate_P256_wallet(seed);
        break;
      default:
        throw `Unknown curve ${curve}!`;
    }
    wallet.mnemonic = mnemonic;
    return wallet;
  },

  fromPrivate: function (sk) {
    if (/^edsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'ed25519_seed');
      return generate_ED25519_wallet(seed);
    } else if (/^spsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'secp256k1_secret_key');
      return generate_Secp256k1_wallet(seed);
    } else if (/^p2sk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'p256_secret_key');
      return generate_P256_wallet(seed);
    } else {
      throw `Incorrect secret provided!`;
    }
  }

}
