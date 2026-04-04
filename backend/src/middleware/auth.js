const jwt = require('jsonwebtoken')
const { getJwtSecret } = require('../config/jwt')
const AppError = require('../utils/AppError')


function requireAuth(req, _res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'))
  }
  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'))
  }
  try {
    const payload = jwt.verify(token, getJwtSecret())
    if (payload.tokenUse !== 'access') {
      return next(new AppError('Invalid token type', 401, 'INVALID_TOKEN'))
    }
    req.user = {
      id: payload.sub,
      role: payload.role,
    }
    return next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401, 'TOKEN_EXPIRED'))
    }
    return next(new AppError('Invalid access token', 401, 'INVALID_TOKEN'))
  }
}

module.exports = { requireAuth }
