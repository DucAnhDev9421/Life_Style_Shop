const Product = require('../models/Product')
const AppError = require('../utils/AppError')

async function list(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const filter = { isActive: true }
    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])
    res.status(200).json({
      success: true,
      message: 'OK',
      data: {
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product || !product.isActive) {
      throw new AppError('Không tìm thấy sản phẩm', 404, 'NOT_FOUND')
    }
    res.status(200).json({ success: true, message: 'OK', data: product })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById }
