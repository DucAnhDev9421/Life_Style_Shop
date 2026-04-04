const express = require('express')
const {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.use(authenticate)

router.post('/', createOrder)
router.get('/', listOrders)
router.get('/:id', getOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

module.exports = router
