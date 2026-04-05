const express = require('express')
const orderController = require('../controllers/orderController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth)

router.get('/', orderController.getOrders)

module.exports = router
