const crypto = require('crypto')

const key = crypto.randomBytes(32).toString('hex')

console.log('='.repeat(60))
console.log('TOTP Encryption Key Generated')
console.log('='.repeat(60))
console.log('\nAdd this to your .env file:\n')
console.log(`TOTP_ENCRYPTION_KEY="${key}"`)
console.log('\n' + '='.repeat(60))
console.log('⚠️  Keep this key SECRET and NEVER commit it to git!')
console.log('='.repeat(60))
