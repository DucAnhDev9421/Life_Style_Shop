const express = require('express')
const {
  getWishlist,
  addItem,
  updateItem,
  removeItem,
  clearWishlist,
} = require('../controllers/wishlistController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.use(authenticate)

router.get('/', getWishlist)
router.post('/items', addItem)
router.patch('/items/:productId', updateItem)
router.delete('/items/:productId', removeItem)
router.delete('/', clearWishlist)

module.exports = router
