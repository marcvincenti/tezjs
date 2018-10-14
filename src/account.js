const bip39 = require('bip39');

import base58 from './utils/base58';
import black2B from './crypto/blake2B';
import buffer from './utils/buffer';
import curves from './crypto/curves';
import hex from './utils/hex';

function generate_ED25519_wallet_from_seed(secret) {
  const kp = curves.Ed25519.ec.keyFromSecret(secret);
  return Object.assign(
    generate_ED25519_wallet_from_public(kp),
    {
      sk: base58.encode(secret, 'ed25519_seed'),
      sign: function (bytes, watermark) {
        let buf = hex.toBuffer(bytes);
        if (typeof watermark !== 'undefined') {
          buf = buffer.merge(watermark, buf);
        }
        const signature = kp.sign(black2B.hash(32, buf)).toBytes();
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
    pkh: base58.encode(black2B.hash(20, pk), 'ed25519_public_key_hash'),
    verify: function (signature, bytes, watermark) {
      const decoded_sig = base58.decode(signature, 'ed25519_signature');
      let buf = hex.toBuffer(bytes);
      if (typeof watermark !== 'undefined') {
        buf = buffer.merge(watermark, buf);
      }
      return kp.verify(black2B.hash(32, buf), buffer.toHex(decoded_sig));
    }
  };
}

function generate_Secp256k1_wallet_from_seed(secret) {
  const keyPair = curves.Secp256k1.ec.keyFromPrivate(secret);
  return Object.assign(
    generate_Secp256k1_wallet_from_public(keyPair),
    {
      sk: base58.encode(keyPair.getPrivate().toBuffer(), 'secp256k1_secret_key'),
      sign: function (bytes, watermark) {
        let buf = hex.toBuffer(bytes);
        if (typeof watermark !== 'undefined') {
          buf = buffer.merge(watermark, buf);
        }
        const sigPair = keyPair.sign(black2B.hash(32, buf));
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
    pkh: base58.encode(black2B.hash(20, compressed_pub), 'secp256k1_public_key_hash'),
    verify: function (signature, bytes, watermark) {
      const decoded_sig = base58.decode(signature, 'secp256k1_signature');
      let buf = hex.toBuffer(bytes);
      if (typeof watermark !== 'undefined') {
        buf = buffer.merge(watermark, buf);
      }
      return pub.verify(black2B.hash(32, buf), {
        r: new Uint8Array(decoded_sig.slice(0, 32)),
        s: new Uint8Array(decoded_sig.slice(32, 64))
      });
    }
  };
}

function generate_P256_wallet_from_seed(secret) {
  const keyPair = curves.P256.ec.keyFromPrivate(secret);
  return Object.assign(
    generate_P256_wallet_from_public(keyPair),
    {
      sk: base58.encode(keyPair.getPrivate().toBuffer(), 'p256_secret_key'),
      sign: function (bytes, watermark) {
        let buf = hex.toBuffer(bytes);
        if (typeof watermark !== 'undefined') {
          buf = buffer.merge(watermark, buf);
        }
        const sigPair = keyPair.sign(black2B.hash(32, buf));
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
    pkh: base58.encode(black2B.hash(20, compressed_pub), 'p256_public_key_hash'),
    verify: function (signature, bytes, watermark) {
      const decoded_sig = base58.decode(signature, 'p256_signature');
      let buf = hex.toBuffer(bytes);
      if (typeof watermark !== 'undefined') {
        buf = buffer.merge(watermark, buf);
      }
      return pub.verify(black2B.hash(32, buf), {
        r: new Uint8Array(decoded_sig.slice(0, 32)),
        s: new Uint8Array(decoded_sig.slice(32, 64))
      });
    }
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
        wallet = generate_ED25519_wallet_from_seed(seed);
        break;
      case 'Secp256k1':
        wallet = generate_Secp256k1_wallet_from_seed(seed);
        break;
      case 'P256':
        wallet = generate_P256_wallet_from_seed(seed);
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
      return generate_ED25519_wallet_from_seed(seed);
    } else if (/^spsk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'secp256k1_secret_key');
      return generate_Secp256k1_wallet_from_seed(seed);
    } else if (/^p2sk[a-km-zA-HJ-NP-Z1-9]{50}$/.test(sk)) {
      const seed = base58.decode(sk, 'p256_secret_key');
      return generate_P256_wallet_from_seed(seed);
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
