const express = require('express')
const userController = require('../controllers/userController')
const { requireAuth } = require('../middleware/auth')
const router = express.Router()

// All user routes require authentication
router.use(requireAuth)
router.get('/me', userController.getMe)
router.patch('/update-me', userController.updateMe)
router.put('/change-password', userController.changePassword)

module.exports = router
