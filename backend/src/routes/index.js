const express = require('express')
const authRoutes = require('./auth')
const userRoutes = require('./user')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Life Style Shop API v1',
  })
})

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API v1 is healthy',
  })
})

module.exports = router
