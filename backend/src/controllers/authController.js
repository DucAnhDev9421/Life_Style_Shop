const { ZodError } = require('zod')
const authService = require('../services/authService')
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  profileSchema,
  changePasswordSchema,
  formatZodError,
} = require('../validators/auth')
const AppError = require('../utils/AppError')

async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body)
    const result = await authService.register(body)
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body)
    const result = await authService.login(body)
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function refresh(req, res, next) {
  try {
    const body = refreshSchema.parse(req.body)
    const result = await authService.refresh(body)
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id)
    res.status(200).json({
      success: true,
      data: { message: 'Logged out' },
    })
  } catch (e) {
    return next(e)
  }
}

async function verify(req, res, next) {
  try {
    const user = await authService.verifyUser(req.user.id)
    res.status(200).json({
      success: true,
      data: { valid: true, user },
    })
  } catch (e) {
    return next(e)
  }
}

async function updateProfile(req, res, next) {
  try {
    const body = profileSchema.parse(req.body)
    const user = await authService.updateProfile(req.user.id, body)
    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function changePassword(req, res, next) {
  try {
    const body = changePasswordSchema.parse(req.body)
    await authService.changePassword(req.user.id, body)
    res.status(200).json({
      success: true,
      data: { message: 'Password changed successfully' },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  verify,
  updateProfile,
  changePassword,
}
