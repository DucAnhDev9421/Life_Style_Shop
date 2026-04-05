const express = require('express')
const wishlistController = require('../controllers/wishlistController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth)

router.get('/', wishlistController.getWishlist)
router.post('/', wishlistController.add)
router.delete('/:productId', wishlistController.remove)

module.exports = router
