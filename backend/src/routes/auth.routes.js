const express = require('express')
const { register, login, verify } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', authenticate, verify)

module.exports = router
