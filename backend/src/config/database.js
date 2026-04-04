const mongoose = require('mongoose')
const Product = require('../models/Product')

async function seedSampleProductsIfEmpty() {
  if (process.env.NODE_ENV === 'production') return
  const count = await Product.countDocuments()
  if (count > 0) return
  await Product.insertMany([
    {
      name: 'Classic Cotton Tee',
      slug: 'classic-cotton-tee',
      description: 'Áo thun cotton basic.',
      price: 199000,
      currency: 'VND',
      images: [],
      isActive: true,
    },
    {
      name: 'Everyday Sneakers',
      slug: 'everyday-sneakers',
      description: 'Giày thể thao hằng ngày.',
      price: 890000,
      currency: 'VND',
      images: [],
      isActive: true,
    },
    {
      name: 'Canvas Tote Bag',
      slug: 'canvas-tote-bag',
      description: 'Túi vải canvas.',
      price: 249000,
      currency: 'VND',
      images: [],
      isActive: true,
    },
  ])
  console.log('[db] Seeded sample products (dev only, empty catalog)')
}

async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  await seedSampleProductsIfEmpty()
}

module.exports = { connectDatabase }
