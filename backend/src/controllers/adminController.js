const User = require('../models/User')
const Product = require('../models/Product')
const Category = require('../models/Category')

async function getStats(req, res, next) {
  try {
    const [totalUsers, totalProducts, activeProducts, outOfStock] = await Promise.all([
      User.countDocuments({ role: { $in: ['customer', 'seller'] } }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: 0 }),
    ])

    const topCategories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    const recentProducts = await Product.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price stock category images status createdAt')
      .lean()

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        activeProducts,
        outOfStock,
        topCategories,
        recentProducts,
      },
    })
  } catch (e) {
    return next(e)
  }
}

async function listUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit
    const role = req.query.role
    const status = req.query.status

    const filter = {}
    if (role) filter.role = role
    if (status) filter.status = status
    filter.role = filter.role || {}
    if (!filter.role.$in) {
      filter.role = { $in: ['customer', 'seller', 'admin'] }
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('fullName email role status avatarUrl createdAt lastLoginAt')
        .lean(),
      User.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (e) {
    return next(e)
  }
}

async function getProductStats(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit
    const status = req.query.status
    const category = req.query.category

    const filter = {}
    if (status) filter.status = status
    if (category) filter.category = category

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name price stock category images status seller createdAt updatedAt')
        .populate('seller', 'fullName email')
        .lean(),
      Product.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (e) {
    return next(e)
  }
}

async function updateProductStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['draft', 'active', 'archived']
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      })
    }

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true },
    )
      .populate('seller', 'fullName email')
      .lean()

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, data: { product } })
  } catch (e) {
    return next(e)
  }
}

async function createProduct(req, res, next) {
  try {
    const body = req.body
    const seller = req.user.id
    const slug = body.slug || (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const product = await Product.create({ ...body, seller, slug })
    await product.populate('seller', 'fullName email')
    res.status(201).json({ success: true, data: { product } })
  } catch (e) {
    return next(e)
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const allowedFields = ['name', 'description', 'price', 'stock', 'images', 'category', 'status']
    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    }

    const product = await Product.findOneAndUpdate(
      { _id: id },
      updates,
      { new: true, runValidators: true },
    )
      .populate('seller', 'fullName email')
      .lean()

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, data: { product } })
  } catch (e) {
    return next(e)
  }
}

async function removeProduct(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOneAndDelete({ _id: id })
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (e) {
    return next(e)
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['active', 'locked', 'pending_verification']
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      })
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true },
    )
      .select('fullName email role status avatarUrl createdAt lastLoginAt')
      .lean()

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, data: { user } })
  } catch (e) {
    return next(e)
  }
}

async function getAnalytics(req, res, next) {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      totalProducts,
      activeProducts,
      outOfStock,
      newUsersLast30Days,
      newProductsLast30Days,
      topCategories,
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['customer', 'seller'] } }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: 0 }),
      User.countDocuments({
        role: { $in: ['customer', 'seller'] },
        createdAt: { $gte: thirtyDaysAgo },
      }),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ])

    const totalCategoryCount = topCategories.reduce((sum, c) => sum + c.count, 0)

    const productStatusBreakdown = await Product.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const monthlyNewUsers = await User.aggregate([
      { $match: { role: { $in: ['customer', 'seller'] }, createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const monthlyNewProducts = await Product.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProducts,
          activeProducts,
          outOfStock,
          newUsersLast30Days,
          newProductsLast30Days,
        },
        topCategories,
        totalCategoryCount,
        productStatusBreakdown,
        monthlyNewUsers,
        monthlyNewProducts,
      },
    })
  } catch (e) {
    return next(e)
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find({}).sort({ name: 1 }).lean()
    res.status(200).json({
      success: true,
      data: {
        categories: categories.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          status: c.status,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      },
    })
  } catch (e) {
    return next(e)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params
    const doc = await Category.findOneAndDelete({ _id: id })
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.status(200).json({ success: true, message: 'Category deleted' })
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  getStats,
  listUsers,
  getProductStats,
  updateProductStatus,
  createProduct,
  updateProduct,
  removeProduct,
  updateUserStatus,
  getAnalytics,
  listCategories,
  deleteCategory,
}
