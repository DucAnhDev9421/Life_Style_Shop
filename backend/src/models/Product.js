const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 220 },
    description: { type: String, default: '', maxlength: 10000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String, trim: true, default: null, maxlength: 120 },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

productSchema.index({ seller: 1, status: 1 })
productSchema.index({ category: 1, status: 1 })

module.exports = mongoose.model('Product', productSchema)
