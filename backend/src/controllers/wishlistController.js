const wishlistService = require('../services/wishlistService')

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user.id)
      res.status(200).json({ success: true, data: wishlist })
    } catch (err) {
      next(err)
    }
  }

  async add(req, res, next) {
    try {
      const { productId } = req.body
      if (!productId) {
        return res.status(400).json({ success: false, message: 'productId is required' })
      }
      const wishlist = await wishlistService.addToWishlist(req.user.id, productId)
      res.status(200).json({ success: true, data: wishlist })
    } catch (err) {
      next(err)
    }
  }

  async remove(req, res, next) {
    try {
      const { productId } = req.params
      const wishlist = await wishlistService.removeFromWishlist(req.user.id, productId)
      res.status(200).json({ success: true, data: wishlist })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new WishlistController()
