const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  )
}

async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub).select('_id email role name')
    if (!user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }
    req.user = user
    next()
  } catch (e) {
    if (e instanceof AppError) return next(e)
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'))
    }
    next(e)
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'))
    }
    next()
  }
}

module.exports = { authenticate, requireRole, signAccessToken }
