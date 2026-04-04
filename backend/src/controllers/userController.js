const userService = require('../services/userService')

async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.id)
    res.status(200).json({ success: true, data: user })
  } catch (e) {
    next(e)
  }
}


async function updateMe(req, res, next) {
  try {
    const { fullName, phone } = req.body
    const user = await userService.updateUser(req.user.id, { fullName, phone })
    res.status(200).json({ success: true, data: user })
  } catch (e) {
    next(e)
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    await userService.changePassword(req.user.id, currentPassword, newPassword)
    res.status(200).json({ success: true, message: 'Password updated successfully' })
  } catch (e) {
    next(e)
  }
}

module.exports = { getMe, updateMe, changePassword }
