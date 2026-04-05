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

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(50, "Full name is too long"),
  phone: z.string().regex(/^\d{10,11}$/, "Phone number must be 10-11 digits").optional().or(z.literal("").transform(() => undefined)),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("").transform(() => undefined)),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

function formatZodError(err) {
  const issues = err.issues || err.errors
  const first = issues && issues[0]
  return first ? first.message : 'Validation failed'
}

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  profileSchema,
  changePasswordSchema,
  formatZodError,
}
