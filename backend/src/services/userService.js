const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const AppError = require('../utils/AppError')

exports.getUserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)
  return user
}


exports.updateUser = async (userId, data) => {
  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.phone !== undefined) updateData.phone = data.phone;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
  if (!user) throw new AppError('User not found', 404)
  return user
}

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+passwordHash')
  if (!user) throw new AppError('User not found', 404)

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isMatch) throw new AppError('Incorrect current password', 400)

  const salt = await bcrypt.genSalt(10)
  user.passwordHash = await bcrypt.hash(newPassword, salt)
  await user.save()

  return true
}
