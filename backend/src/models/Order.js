const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: false },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'e_wallet', 'vnpay', 'card'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
