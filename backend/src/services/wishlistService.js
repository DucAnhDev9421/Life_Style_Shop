const User = require('../models/User')
const AppError = require('../utils/AppError')

class WishlistService {
  async getWishlist(userId) {
    const user = await User.findById(userId).lean()
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    return user.wishlist
  }

  async addToWishlist(userId, productId) {
    const user = await User.findById(userId)
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId)
      await user.save()
    }
    
    return user.wishlist
  }

  async removeFromWishlist(userId, productId) {
    const user = await User.findById(userId)
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')

    const pId = Number(productId)
    user.wishlist = user.wishlist.filter(id => id !== pId)
    await user.save()

    return user.wishlist
  }
}

module.exports = new WishlistService()
