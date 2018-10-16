const bip39 = require('bip39');
const pbkdf2 = require('pbkdf2');
const sodium = require('libsodium-wrappers');

import base58 from './utils/base58';
import buffer from './utils/buffer';
import crypto from './crypto';
import curves from './crypto/curves';
import hex from './utils/hex';
import watermark from './utils/watermark';

function decrypt_seed(bytes, password) {
  const salt = bytes.slice(0, 8);
  const encrypted_seed = bytes.slice(8);
  const key = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
  try {
    return sodium.crypto_secretbox_open_easy(encrypted_seed, new Uint8Array(24), new Uint8Array(key));
  } catch (e) {
    console.error(e);
    return null;
  }
}

function encrypt_seed(seed, password) {
  const salt = sodium.randombytes_buf(8);
  const key = pbkdf2.pbkdf2Sync(password, new Buffer(salt), 32768, 32, 'sha512');
  const encrypted_seed = sodium.crypto_secretbox_easy(seed, new Uint8Array(24), new Uint8Array(key));
  return buffer.merge(salt, encrypted_seed);
}

function generate_ED25519_wallet_from_seed(secret, params) {
  const { password } = params;
  const kp = curves.Ed25519.ec.keyFromSecret(secret);
  return Object.assign(
    generate_ED25519_wallet_from_public(kp),
    {
      sk: password ? base58.encode(encrypt_seed(secret, password), 'ed25519_encrypted_seed')
                   : base58.encode(secret, 'ed25519_seed'),
      sign: function (bytes, w = watermark.generic) {
        const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
        const signature = kp.sign(hash).toBytes();
        return {
          signature: base58.encode(signature, 'ed25519_signature'),
          bytes: bytes + buffer.toHex(signature)
        }
      }
    }
  );
}

function generate_ED25519_wallet_from_public(kp) {
  const pk = kp.getPublic();
  return {
    curve: 'Ed25519',
    pk: base58.encode(pk, 'ed25519_public_key'),
    pkh: base58.encode(crypto.hash(pk, 20), 'ed25519_public_key_hash'),
    verify: function (signature, bytes, w = watermark.generic) {
      const decoded_sig = base58.decode(signature, 'ed25519_signature');
      const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
      return kp.verify(hash, buffer.toHex(decoded_sig));
    }
  };
}

function generate_Secp256k1_wallet_from_seed(secret, params) {
  const { password } = params;
  const keyPair = curves.Secp256k1.ec.keyFromPrivate(secret);
  return Object.assign(
    generate_Secp256k1_wallet_from_public(keyPair),
    {
      sk: password ? base58.encode(encrypt_seed(keyPair.getPrivate().toBuffer(), password), 'secp256k1_encrypted_secret_key')
                   : base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
      sign: function (bytes, w = watermark.generic) {
        const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
        const sigPair = keyPair.sign(hash);
        const signature = new Uint8Array([...sigPair.r.toArray(), ...sigPair.s.toArray()]);
        return {
          signature: base58.encode(signature, 'secp256k1_signature'),
          bytes: bytes + buffer.toHex(signature)
        }
      }
    }
  );
}

function generate_Secp256k1_wallet_from_public(pub) {
  const pk = pub.getPublic();
  const compressed_pub = new Buffer([
    pk.getY().isOdd() ? 3 : 2,
    ...pk.getX().toBuffer()
  ]);
  return {
    curve: 'Secp256k1',
    pk: base58.encode(compressed_pub, 'secp256k1_public_key'),
    pkh: base58.encode(crypto.hash(compressed_pub, 20), 'secp256k1_public_key_hash'),
    verify: function (signature, bytes, w = watermark.generic) {
      const decoded_sig = base58.decode(signature, 'secp256k1_signature');
      const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
      return pub.verify(hash, {
        r: new Uint8Array(decoded_sig.slice(0, 32)),
        s: new Uint8Array(decoded_sig.slice(32, 64))
      });
    }
  };
}

function generate_P256_wallet_from_seed(secret, params) {
  const { password } = params;
  const keyPair = curves.P256.ec.keyFromPrivate(secret);
  return Object.assign(
    generate_P256_wallet_from_public(keyPair),
    {
      sk: password ? base58.encode(encrypt_seed(keyPair.getPrivate().toBuffer(), password), 'p256_encrypted_secret_key')
                   : base58.encode(keyPair.getPrivate().toBuffer(), 'p256_secret_key'),
      sign: function (bytes, w = watermark.generic) {
        const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
        const sigPair = keyPair.sign(hash);
        const signature = new Uint8Array([...sigPair.r.toArray(), ...sigPair.s.toArray()]);
        return {
          signature: base58.encode(signature, 'p256_signature'),
          bytes: bytes + buffer.toHex(signature)
        }
      }
    }
  );
}

function generate_P256_wallet_from_public(pub) {
  const pk = pub.getPublic();
  const compressed_pub = new Buffer([
    pk.getY().isOdd() ? 3 : 2,
    ...pk.getX().toBuffer()
  ]);
  return {
    curve: 'P256',
    pk: base58.encode(compressed_pub, 'p256_public_key'),
    pkh: base58.encode(crypto.hash(compressed_pub, 20), 'p256_public_key_hash'),
    verify: function (signature, bytes, w = watermark.generic) {
      const decoded_sig = base58.decode(signature, 'p256_signature');
      const hash = crypto.hash(buffer.merge(w, hex.toBuffer(bytes)));
      return pub.verify(hash, {
        r: new Uint8Array(decoded_sig.slice(0, 32)),
        s: new Uint8Array(decoded_sig.slice(32, 64))
      });
    }
  };
}

module.exports = {

  create: function (params) {
    const mnemonic = bip39.generateMnemonic(160);
    return this.fromMnemonic(mnemonic, params);
  },

  fromMnemonic: function (mnemonic, params = {}) {
    let { curve } = params;
    if (typeof curve == 'undefined') curve = 'Ed25519';

    const seed = bip39.mnemonicToSeed(mnemonic, params.passphrase).slice(0, 32);
    let wallet;
    switch (curve) {
      case 'Ed25519':
        wallet = generate_ED25519_wallet_from_seed(seed, params);
        break;
      case 'Secp256k1':
        wallet = generate_Secp256k1_wallet_from_seed(seed, params);
        break;
      case 'P256':
        wallet = generate_P256_wallet_from_seed(seed, params);
        break;
      default:
        throw `Unknown curve ${curve}!`;
    }
    wallet.mnemonic = mnemonic;
    return wallet;
  },

  fromPrivate: function (sk, params = {}) {
    if (/^edsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'ed25519_seed');
      return generate_ED25519_wallet_from_seed(seed, params);
    } else if (/^edesk[a-km-zA-HJ-NP-Z1-9]{83}$/.test(sk)) {
      const { password } = params;
      const seed = decrypt_seed(
        base58.decode(sk, 'ed25519_encrypted_seed'),
        password
      );
      if (seed) return generate_ED25519_wallet_from_seed(seed, params);
      return {};
    } else if (/^spsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'secp256k1_secret_key');
      return generate_Secp256k1_wallet_from_seed(seed, params);
    } else if (/^spesk[a-km-zA-HJ-NP-Z1-9]{83}$/.test(sk)) {
      const { password } = params;
      const seed = decrypt_seed(
        base58.decode(sk, 'secp256k1_encrypted_secret_key'),
        password
      );
      if (seed) return generate_Secp256k1_wallet_from_seed(seed, params);
      return {};
    } else if (/^p2sk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'p256_secret_key');
      return generate_P256_wallet_from_seed(seed, params);
    } else if (/^p2esk[a-km-zA-HJ-NP-Z1-9]{83}$/.test(sk)) {
      const { password } = params;
      const seed = decrypt_seed(
        base58.decode(sk, 'p256_encrypted_secret_key'),
        password
      );
      if (seed) return generate_P256_wallet_from_seed(seed, params);
      return {};
    } else {
      throw `Incorrect secret provided!`;
    }
  },

  fromPublic: function (pk) {
    if (/^edpk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(pk)) {
      const decoded_pk = base58.decode(pk, 'ed25519_public_key');
      const kp = curves.Ed25519.ec.keyFromPublic(decoded_pk);
      return generate_ED25519_wallet_from_public(kp);
    } else if (/^sppk[a-km-zA-HJ-NP-Z1-9]{51}$/.test(pk)) {
      const compressed_pk = base58.decode(pk, 'secp256k1_public_key');
      const pubPoint = curves.Secp256k1.ec.curve.pointFromX(
        compressed_pk.slice(1),
        compressed_pk[0] === 3
       );
      return generate_Secp256k1_wallet_from_public(
        curves.Secp256k1.ec.keyFromPublic(pubPoint)
      );
    } else if (/^p2pk[a-km-zA-HJ-NP-Z1-9]{51}$/.test(pk)) {
      const compressed_pk = base58.decode(pk, 'p256_public_key');
      const pubPoint = curves.P256.ec.curve.pointFromX(
        compressed_pk.slice(1),
        compressed_pk[0] === 3
      );
      return generate_P256_wallet_from_public(
        curves.P256.ec.keyFromPublic(pubPoint)
      );
    } else {
      throw `Incorrect public key provided!`;
    }
  }

}
