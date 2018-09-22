export default {

  /* size: 20 */
  ed25519_public_key_hash: [6, 161, 159], // tz1(36)
  secp256k1_public_key_hash: [6, 161, 161], // tz2(36)
  p256_public_key_hash: [6, 161, 164], // tz3(36)

  /* size: 32 */
  ed25519_seed: [13, 15, 58, 7], // edsk(54)
  ed25519_public_key: [13, 15, 37, 217], // edpk(54)
  secp256k1_secret_key: [17, 162, 224, 201], // spsk(54)
  p256_secret_key: [16, 81, 238, 189], // p2sk(54)

  /* size: 56 */
  ed25519_encrypted_seed: [7, 90, 60, 179, 41], // edesk(88)
  secp256k1_encrypted_secret_key: [9, 237, 241, 174, 150], // spesk(88)
  p256_encrypted_secret_key: [9, 48, 57, 115, 171], // p2esk(88)

  /* size: 33 */
  secp256k1_public_key: [3, 254, 226, 86], // sppk(55)
  p256_public_key: [3, 178, 139, 127], // p2pk(55)

  /* size: 64 */
  ed25519_secret_key: [43, 246, 78, 7], // edsk(98)
  ed25519_signature: [9, 245, 205, 134, 18], // edsig(99)
  secp256k1_signature:  [13, 115, 101, 19, 63], // spsig1(99)
  p256_signature:  [54, 240, 44, 52], // p2sig(98)
  generic_signature: [4, 130, 43] // sig(96)

}
