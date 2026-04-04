const bcrypt = require('bcryptjs')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const { signAccessToken } = require('../middleware/auth')

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      throw new AppError('Email và mật khẩu là bắt buộc', 400, 'VALIDATION_ERROR')
    }
    const exists = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (exists) {
      throw new AppError('Email đã được đăng ký', 409, 'CONFLICT')
    }
    const passwordHash = await bcrypt.hash(String(password), 10)
    const user = await User.create({
      email: String(email).toLowerCase().trim(),
      passwordHash,
      name: name ? String(name).trim() : '',
    })
    const accessToken = signAccessToken(user)
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new AppError('Email và mật khẩu là bắt buộc', 400, 'VALIDATION_ERROR')
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
      '+passwordHash'
    )
    if (!user) {
      throw new AppError('Sai email hoặc mật khẩu', 401, 'UNAUTHORIZED')
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      throw new AppError('Sai email hoặc mật khẩu', 401, 'UNAUTHORIZED')
    }
    const accessToken = signAccessToken(user)
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function verify(req, res) {
  res.status(200).json({
    success: true,
    message: 'Token hợp lệ',
    data: {
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    },
  })
}

module.exports = { register, login, verify }
