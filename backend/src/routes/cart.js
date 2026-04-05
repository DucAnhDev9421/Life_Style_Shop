const express = require('express');
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.patch('/items/:id', cartController.updateQuantity);
router.delete('/items/:id', cartController.removeItem);

module.exports = router;
