const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')
const { ORDER_STATUSES } = require('../models/Order')

function generateOrderNo() {
  return `LS-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

const CUSTOMER_CANCEL_STATUSES = ['pending_payment', 'confirmed', 'processing']

function assertOrderAccess(order, user) {
  const isOwner = order.userId.toString() === user._id.toString()
  const isAdmin = user.role === 'admin'
  if (!isOwner && !isAdmin) {
    throw new AppError('Không có quyền xem đơn hàng này', 403, 'FORBIDDEN')
  }
}

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddressSnapshot, shippingFee, taxTotal } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Danh sách sản phẩm không hợp lệ', 400, 'VALIDATION_ERROR')
    }

    const lines = []
    let currency = 'VND'
    for (const line of items) {
      const productId = line.productId
      const quantity = Number(line.quantity)
      if (!mongoose.isValidObjectId(productId) || !Number.isFinite(quantity) || quantity < 1) {
        throw new AppError('Mỗi dòng cần productId hợp lệ và quantity >= 1', 400, 'VALIDATION_ERROR')
      }
      const product = await Product.findById(productId)
      if (!product || !product.isActive) {
        throw new AppError(`Sản phẩm không tồn tại: ${productId}`, 400, 'VALIDATION_ERROR')
      }
      currency = product.currency || 'VND'
      const unitPrice = product.price
      const lineTotal = Math.round(unitPrice * quantity)
      lines.push({
        productId: product._id,
        sku: product.slug,
        name: product.name,
        unitPrice,
        quantity,
        lineTotal,
      })
    }

    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
    const ship = Math.max(0, Number(shippingFee) || 0)
    const tax = Math.max(0, Number(taxTotal) || 0)
    const grandTotal = subtotal + ship + tax

    const order = await Order.create({
      orderNo: generateOrderNo(),
      userId: req.user._id,
      status: 'pending_payment',
      paymentStatus: 'unpaid',
      items: lines,
      pricing: {
        subtotal,
        shippingFee: ship,
        taxTotal: tax,
        grandTotal,
        currency: currency || 'VND',
      },
      shippingAddressSnapshot: {
        receiverName: shippingAddressSnapshot?.receiverName ?? '',
        receiverPhone: shippingAddressSnapshot?.receiverPhone ?? '',
        line1: shippingAddressSnapshot?.line1 ?? '',
        city: shippingAddressSnapshot?.city ?? '',
        country: shippingAddressSnapshot?.country ?? 'VN',
      },
      statusTimeline: [{ status: 'pending_payment', note: 'Đơn được tạo' }],
    })

    res.status(201).json({
      success: true,
      message: 'Tạo đơn thành công',
      data: order,
    })
  } catch (err) {
    next(err)
  }
}

async function listOrders(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const status = req.query.status

    const filter = {}
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id
    } else if (req.query.userId && mongoose.isValidObjectId(req.query.userId)) {
      filter.userId = req.query.userId
    }
    if (status && ORDER_STATUSES.includes(String(status))) {
      filter.status = status
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      message: 'OK',
      data: {
        items: orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getOrder(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError('ID đơn hàng không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const order = await Order.findById(req.params.id)
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, 'NOT_FOUND')
    }
    assertOrderAccess(order, req.user)
    res.status(200).json({ success: true, message: 'OK', data: order })
  } catch (err) {
    next(err)
  }
}

async function updateOrder(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      throw new AppError('Chỉ admin mới được cập nhật đơn hàng', 403, 'FORBIDDEN')
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError('ID đơn hàng không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const order = await Order.findById(req.params.id)
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, 'NOT_FOUND')
    }

    const { status, paymentStatus, timelineNote } = req.body
    if (status !== undefined) {
      if (!ORDER_STATUSES.includes(String(status))) {
        throw new AppError('Trạng thái đơn không hợp lệ', 400, 'VALIDATION_ERROR')
      }
      order.status = status
      order.statusTimeline.push({
        status,
        note: timelineNote || null,
        at: new Date(),
      })
    }
    if (paymentStatus !== undefined) {
      const allowed = ['unpaid', 'paid', 'failed']
      if (!allowed.includes(String(paymentStatus))) {
        throw new AppError('paymentStatus không hợp lệ', 400, 'VALIDATION_ERROR')
      }
      order.paymentStatus = paymentStatus
    }

    await order.save()
    res.status(200).json({ success: true, message: 'Cập nhật đơn thành công', data: order })
  } catch (err) {
    next(err)
  }
}

async function deleteOrder(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError('ID đơn hàng không hợp lệ', 400, 'VALIDATION_ERROR')
    }
    const order = await Order.findById(req.params.id)
    if (!order) {
      throw new AppError('Không tìm thấy đơn hàng', 404, 'NOT_FOUND')
    }

    const isOwner = order.userId.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (order.status === 'cancelled') {
      throw new AppError('Đơn đã bị hủy trước đó', 409, 'CONFLICT')
    }

    if (isAdmin) {
      if (['completed'].includes(order.status)) {
        throw new AppError('Không hủy đơn đã hoàn tất', 422, 'INVALID_STATE')
      }
    } else if (isOwner) {
      if (!CUSTOMER_CANCEL_STATUSES.includes(order.status)) {
        throw new AppError('Không thể hủy đơn ở trạng thái hiện tại', 422, 'INVALID_STATE')
      }
    } else {
      throw new AppError('Không có quyền hủy đơn này', 403, 'FORBIDDEN')
    }

    order.status = 'cancelled'
    order.statusTimeline.push({
      status: 'cancelled',
      note: isAdmin ? 'Hủy bởi admin' : 'Hủy bởi khách hàng',
      at: new Date(),
    })
    await order.save()

    res.status(200).json({
      success: true,
      message: 'Đơn đã được hủy',
      data: order,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
}
