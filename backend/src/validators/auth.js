const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().trim().min(2, 'Full name is required'),
})

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
})

function formatZodError(err) {
  const issues = err.issues || err.errors
  const first = issues && issues[0]
  return first ? first.message : 'Validation failed'
}

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  formatZodError,
}
