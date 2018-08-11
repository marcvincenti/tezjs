var elliptic = require('elliptic');

export default {

  Ed25519: {
    name: 'Ed25519',
    type: 'eddsa'
  },

  Secp256k1: {
    name: 'Secp256k1',
    type: 'ecdsa',
    ec: new elliptic.ec('secp256k1')
  },

  P256: {
    name: 'P256',
    type: 'ecdsa',
    ec: new elliptic.ec('p256')
  }

}
