const mongoose = require('mongoose')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

function slugify(text) {
  const base = text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'product'
}

function toPublicProduct(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  
  let seller = o.seller
  if (o.seller && typeof o.seller === 'object' && o.seller._id) {
    seller = {
      id: o.seller._id.toString(),
      fullName: o.seller.fullName,
      email: o.seller.email,
      avatarUrl: o.seller.avatarUrl,
    }
  } else if (o.seller) {
    seller = o.seller.toString()
  }

  return {
    id: o._id.toString(),
    name: o.name,
    slug: o.slug,
    description: o.description,
    price: o.price,
    stock: o.stock,
    images: o.images,
    category: o.category,
    status: o.status,
    seller: seller,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }
}

function assertObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400, 'INVALID_ID')
  }
}

function isDuplicateKeyError(e) {
  return e && e.code === 11000
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug
  for (let n = 0; n < 1000; n += 1) {
    const query = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Product.exists(query)
    if (!exists) return slug
    slug = `${baseSlug}-${n + 1}`
  }
  throw new AppError('Could not allocate slug', 500, 'SLUG_ALLOCATION_FAILED')
}

function ownershipFilter(actor) {
  if (actor.role === 'admin') return {}
  if (actor.role === 'seller') return { seller: actor.id }
  throw new AppError('Forbidden', 403, 'FORBIDDEN')
}

async function listProductsPublic(query) {
  const filter = { status: 'active' }
  if (query.category) filter.category = query.category

  const skip = (query.page - 1) * query.limit
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
    Product.countDocuments(filter),
  ])

  return {
    items: items.map((o) => toPublicProduct(o)),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit) || 0,
  }
}

async function getProductByIdPublic(id) {
  assertObjectId(id)
  const doc = await Product.findOne({ _id: id, status: 'active' })
    .populate('seller', 'fullName email avatarUrl')
    .lean()
  if (!doc) throw new AppError('Product not found', 404, 'NOT_FOUND')
  return toPublicProduct(doc)
}

async function getProductBySlugPublic(slug) {
  const doc = await Product.findOne({ slug, status: 'active' })
    .populate('seller', 'fullName email avatarUrl')
    .lean()
  if (!doc) throw new AppError('Product not found', 404, 'NOT_FOUND')
  return toPublicProduct(doc)
}

function resolveSellerIdForCreate(actor, body) {
  if (actor.role === 'admin') {
    return body.sellerId || actor.id
  }
  if (actor.role === 'seller') {
    return actor.id
  }
  throw new AppError('Forbidden', 403, 'FORBIDDEN')
}

async function createProduct(actor, body) {
  const sellerId = resolveSellerIdForCreate(actor, body)
  assertObjectId(sellerId)

  const baseSlug = body.slug ? body.slug.trim().toLowerCase() : slugify(body.name)
  const slug = await ensureUniqueSlug(baseSlug)

  const status = body.status || 'active'

  try {
    const doc = await Product.create({
      name: body.name.trim(),
      slug,
      description: body.description ?? '',
      price: body.price,
      stock: body.stock,
      images: body.images || [],
      category: body.category ?? null,
      status,
      seller: sellerId,
    })
    return toPublicProduct(doc)
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      throw new AppError('Slug already exists', 409, 'SLUG_CONFLICT')
    }
    throw e
  }
}

async function findProductForMutation(id, actor) {
  assertObjectId(id)
  const extra = ownershipFilter(actor)
  const doc = await Product.findOne({ _id: id, ...extra })
  if (!doc) throw new AppError('Product not found', 404, 'NOT_FOUND')
  return doc
}

async function updateProduct(actor, id, body) {
  const doc = await findProductForMutation(id, actor)

  if (actor.role === 'seller' && body.status === 'archived') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN')
  }

  if (body.name !== undefined) doc.name = body.name.trim()
  if (body.description !== undefined) doc.description = body.description
  if (body.price !== undefined) doc.price = body.price
  if (body.stock !== undefined) doc.stock = body.stock
  if (body.images !== undefined) doc.images = body.images
  if (body.category !== undefined) doc.category = body.category
  if (body.status !== undefined) doc.status = body.status

  if (body.slug !== undefined) {
    const nextBase = body.slug.trim().toLowerCase()
    doc.slug = await ensureUniqueSlug(nextBase, doc._id)
  }

  try {
    await doc.save()
    return toPublicProduct(doc)
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      throw new AppError('Slug already exists', 409, 'SLUG_CONFLICT')
    }
    throw e
  }
}

async function deleteProduct(actor, id) {
  const doc = await findProductForMutation(id, actor)
  doc.status = 'archived'
  await doc.save()
  return { id: doc._id.toString(), status: 'archived' }
}

module.exports = {
  listProductsPublic,
  getProductByIdPublic,
  getProductBySlugPublic,
  createProduct,
  updateProduct,
  deleteProduct,
}
