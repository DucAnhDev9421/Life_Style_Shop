const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 140 },
    description: { type: String, default: '', maxlength: 500 },
    image: { type: String, default: null },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
)

categorySchema.index({ status: 1 })

module.exports = mongoose.model('Category', categorySchema)
