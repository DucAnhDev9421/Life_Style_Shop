const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const { getJwtSecret, getAccessTokenExpiresIn, getRefreshExpiresAt } = require('../config/jwt')
const { hashRefreshToken, generateRefreshToken } = require('../utils/token')

const BCRYPT_ROUNDS = 12

function toPublicUser(doc) {
  return {
    id: doc._id.toString(),
    email: doc.email,
    fullName: doc.fullName,
    role: doc.role,
    status: doc.status,
    isEmailVerified: doc.isEmailVerified,
    createdAt: doc.createdAt,
  }
}

function signAccessToken(user) {
  const secret = getJwtSecret()
  const expiresIn = getAccessTokenExpiresIn()
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      tokenUse: 'access',
    },
    secret,
    { expiresIn }
  )
}

async function issueTokens(userDoc) {
  const accessToken = signAccessToken(userDoc)
  const refreshToken = generateRefreshToken()
  const refreshHash = hashRefreshToken(refreshToken)
  const refreshTokenExpiresAt = getRefreshExpiresAt()

  userDoc.refreshTokenHash = refreshHash
  userDoc.refreshTokenExpiresAt = refreshTokenExpiresAt
  await userDoc.save()

  return { accessToken, refreshToken }
}

async function register({ email, password, fullName }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  let user
  try {
    user = await User.create({
      email,
      passwordHash,
      fullName,
      role: 'customer',
      status: 'active',
    })
  } catch (e) {
    if (e.code === 11000) {
      throw new AppError('Email is already registered', 409, 'EMAIL_ALREADY_EXISTS')
    }
    throw e
  }

  const tokens = await issueTokens(user)
  return { user: toPublicUser(user), ...tokens }
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select(
    '+passwordHash +refreshTokenHash +refreshTokenExpiresAt'
  )
  const invalid = new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')

  if (!user) {
    await bcrypt.compare(password, '$2a$12$invalidhashinvalidhashinvalidhashinva')
    throw invalid
  }

  if (user.status === 'locked') {
    throw new AppError('Account is locked', 403, 'ACCOUNT_LOCKED')
  }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    throw invalid
  }

  user.lastLoginAt = new Date()
  const tokens = await issueTokens(user)

  const fresh = await User.findById(user._id)
  return { user: toPublicUser(fresh), ...tokens }
}

async function refresh({ refreshToken }) {
  const hash = hashRefreshToken(refreshToken)
  const user = await User.findOne({ refreshTokenHash: hash }).select(
    '+refreshTokenHash +refreshTokenExpiresAt'
  )

  if (!user || !user.refreshTokenExpiresAt || user.refreshTokenExpiresAt <= new Date()) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN')
  }

  if (user.status === 'locked') {
    throw new AppError('Account is locked', 403, 'ACCOUNT_LOCKED')
  }

  const tokens = await issueTokens(user)
  const publicUser = await User.findById(user._id)
  return { user: toPublicUser(publicUser), ...tokens }
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, {
    $set: { refreshTokenHash: null, refreshTokenExpiresAt: null },
  })
}

async function verifyUser(userId) {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
  if (user.status === 'locked') {
    throw new AppError('Account is locked', 403, 'ACCOUNT_LOCKED')
  }
  return toPublicUser(user)
}

async function updateProfile(userId, data) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  )
  return toPublicUser(user)
}

async function changePassword(userId, { oldPassword, newPassword }) {
  const user = await User.findById(userId).select('+passwordHash')
  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!isMatch) throw new AppError('Old password incorrect', 400)

  user.passwordHash = await bcrypt.hash(newPassword, 12) // Sử dụng BCRYPT_ROUNDS = 12
  await user.save()
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyUser,
  updateProfile,
  changePassword
}
