const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: null },
    avatarUrl: { type: String, default: null },
    role: {
      type: String,
      enum: ['guest', 'customer', 'seller', 'admin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'locked', 'pending_verification'],
      default: 'active',
    },
    isEmailVerified: { type: Boolean, default: false },
    wishlist: [{
      type: Number
    }],
    lastLoginAt: { type: Date, default: null },
    refreshTokenHash: { type: String, default: null, select: false },
    refreshTokenExpiresAt: { type: Date, default: null, select: false },
  },
  { timestamps: true }
)

userSchema.index({ role: 1, status: 1 })

module.exports = mongoose.model('User', userSchema)
