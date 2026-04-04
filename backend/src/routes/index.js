const express = require('express')

const authRoutes = require('./auth.routes')
const productsRoutes = require('./products.routes')
const ordersRoutes = require('./orders.routes')
const wishlistRoutes = require('./wishlist.routes')

const router = express.Router()

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

router.use('/auth', authRoutes)
router.use('/products', productsRoutes)
router.use('/orders', ordersRoutes)
router.use('/wishlist', wishlistRoutes)

module.exports = router
