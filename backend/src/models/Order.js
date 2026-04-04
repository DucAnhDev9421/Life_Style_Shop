const mongoose = require('mongoose')

const ORDER_STATUSES = [
  'pending_payment',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
]

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: { type: String, default: '' },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending_payment',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      shippingFee: { type: Number, default: 0, min: 0 },
      taxTotal: { type: Number, default: 0, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'VND' },
    },
    shippingAddressSnapshot: {
      receiverName: { type: String, default: '' },
      receiverPhone: { type: String, default: '' },
      line1: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: 'VN' },
    },
    statusTimeline: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: { type: String, default: null },
      },
    ],
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

orderSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema)
module.exports.ORDER_STATUSES = ORDER_STATUSES
