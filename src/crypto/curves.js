const elliptic = require('elliptic');

export default {

  Ed25519: {
    type: 'eddsa',
    ec: new elliptic.eddsa('ed25519')
  },

  Secp256k1: {
    type: 'ecdsa',
    ec: new elliptic.ec('secp256k1')
  },

  P256: {
    type: 'ecdsa',
    ec: new elliptic.ec('p256')
  }

}
