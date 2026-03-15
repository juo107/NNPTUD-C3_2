const { generateKeyPairSync } = require('crypto');
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});
require('fs').writeFileSync('private.key', privateKey);
require('fs').writeFileSync('public.key', publicKey);
console.log('Đã tạo private.key và public.key');