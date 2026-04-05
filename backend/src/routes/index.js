const express = require('express')
const authRoutes = require('./auth')
const productRoutes = require('./products')
const categoryRoutes = require('./categories')
const adminRoutes = require('./admin')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/admin', adminRoutes)

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
