const express = require('express')
const orderController = require('../controllers/orderController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth)

router.get('/', orderController.getOrders)
router.post('/', orderController.createOrder)
router.get('/:id', orderController.getOrderById)
router.patch('/:id/cancel', orderController.cancelOrder)

module.exports = router
