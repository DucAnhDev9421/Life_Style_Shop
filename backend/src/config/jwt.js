function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === 'replace_with_secure_secret') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set to a strong value in production')
    }
  }
  return secret || 'dev-only-unsafe-jwt-secret-change-me'
}
function getAccessTokenExpiresIn() {
  return process.env.JWT_EXPIRE || '15m'
}

/** Parse REFRESH_TOKEN_EXPIRE like 7d, 12h, 30m into milliseconds from now. */
function getRefreshExpiresAt() {
  const raw = (process.env.REFRESH_TOKEN_EXPIRE || '7d').trim()
  const match = /^(\d+)([dhms])$/i.exec(raw)
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
  const value = parseInt(match[1], 10)
  const unit = match[2].toLowerCase()
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 }
  return new Date(Date.now() + value * multipliers[unit])
}

module.exports = {
  getJwtSecret,
  getAccessTokenExpiresIn,
  getRefreshExpiresAt,
}
