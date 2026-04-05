const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

class CartController {
  async getCart(req, res, next) {
    try {
      let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { productId, quantity = 1 } = req.body;
      const product = await Product.findById(productId);
      if (!product) throw new AppError('Product not found', 404);

      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
      }

      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ 
          product: productId, 
          quantity: Number(quantity),
          priceSnapshot: product.price
        });
      }

      await cart.save();
      await cart.populate('items.product');
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const { id: cartItemId } = req.params;
      const { quantity } = req.body;
      
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) throw new AppError('Cart not found', 404);

      const item = cart.items.id(cartItemId);
      if (!item) throw new AppError('Item not found', 404);

      item.quantity = Number(quantity);
      await cart.save();
      await cart.populate('items.product');
      
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      const { id: cartItemId } = req.params;
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) throw new AppError('Cart not found', 404);

      cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
      await cart.save();
      await cart.populate('items.product');
      
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
