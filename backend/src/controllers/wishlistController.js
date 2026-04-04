const mongoose = require('mongoose')
const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

async function getOrCreateWishlist(userId) {
  let doc = await Wishlist.findOne({ userId })
  if (!doc) {
    doc = await Wishlist.create({ userId, items: [] })
  }
  return doc
}

async function getWishlist(req, res, next) {
  try {
    const doc = await getOrCreateWishlist(req.user._id)
    await doc.populate('items.productId')
    res.status(200).json({ success: true, message: 'OK', data: doc })
  } catch (err) {
    next(err)
  }
}

async function addItem(req, res, next) {
  try {
    const { productId, note } = req.body
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('productId không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      throw new AppError('Sản phẩm không tồn tại', 404, 'NOT_FOUND')
    }

    const doc = await getOrCreateWishlist(req.user._id)
    const pid = productId.toString()
    const existing = doc.items.find((i) => i.productId.toString() === pid)
    if (existing) {
      if (note !== undefined) existing.note = String(note).slice(0, 500)
      await doc.save()
      await doc.populate('items.productId')
      return res.status(200).json({
        success: true,
        message: 'Đã cập nhật mục yêu thích',
        data: doc,
      })
    }

    doc.items.push({
      productId,
      note: note !== undefined ? String(note).slice(0, 500) : '',
      addedAt: new Date(),
    })
    await doc.save()
    await doc.populate('items.productId')
    res.status(201).json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      data: doc,
    })
  } catch (err) {
    next(err)
  }
}

async function updateItem(req, res, next) {
  try {
    const { productId } = req.params
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('productId không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const { note } = req.body
    if (note === undefined) {
      throw new AppError('Cần gửi note để cập nhật', 400, 'VALIDATION_ERROR')
    }

    const doc = await getOrCreateWishlist(req.user._id)
    const item = doc.items.find((i) => i.productId.toString() === productId)
    if (!item) {
      throw new AppError('Không có sản phẩm này trong wishlist', 404, 'NOT_FOUND')
    }
    item.note = String(note).slice(0, 500)
    await doc.save()
    await doc.populate('items.productId')
    res.status(200).json({ success: true, message: 'Đã cập nhật ghi chú', data: doc })
  } catch (err) {
    next(err)
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('productId không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const doc = await Wishlist.findOne({ userId: req.user._id })
    if (!doc) {
      return res.status(200).json({
        success: true,
        message: 'OK',
        data: { userId: req.user._id, items: [] },
      })
    }
    doc.items = doc.items.filter((i) => i.productId.toString() !== productId)
    await doc.save()
    await doc.populate('items.productId')
    res.status(200).json({ success: true, message: 'Đã xóa khỏi wishlist', data: doc })
  } catch (err) {
    next(err)
  }
}

async function clearWishlist(req, res, next) {
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } },
      { upsert: true, new: true }
    )
    const doc = await getOrCreateWishlist(req.user._id)
    res.status(200).json({ success: true, message: 'Đã xóa toàn bộ wishlist', data: doc })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getWishlist,
  addItem,
  updateItem,
  removeItem,
  clearWishlist,
}
