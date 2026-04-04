const crypto = require('crypto')

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex')
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString('base64url')
}


module.exports = {
  hashRefreshToken,
  generateRefreshToken,
}
