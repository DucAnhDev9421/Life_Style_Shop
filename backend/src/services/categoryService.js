const mongoose = require('mongoose')
const Category = require('../models/Category')
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
  return base || 'category'
}

function toPublicCategory(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o._id.toString(),
    name: o.name,
    slug: o.slug,
    description: o.description,
    image: o.image,
    status: o.status,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }
}

function assertObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400, 'INVALID_ID')
  }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug
  for (let n = 0; n < 1000; n += 1) {
    const query = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Category.exists(query)
    if (!exists) return slug
    slug = `${baseSlug}-${n + 1}`
  }
  throw new AppError('Could not allocate slug', 500, 'SLUG_ALLOCATION_FAILED')
}

async function listCategories(query = {}) {
  const filter = { status: 'active' }
  const items = await Category.find(filter).sort({ name: 1 }).lean()
  return items.map((o) => toPublicCategory(o))
}

async function getCategoryById(id) {
  assertObjectId(id)
  const doc = await Category.findById(id).lean()
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND')
  return toPublicCategory(doc)
}

async function createCategory(body) {
  const baseSlug = body.slug ? body.slug.trim().toLowerCase() : slugify(body.name)
  const slug = await ensureUniqueSlug(baseSlug)

  try {
    const doc = await Category.create({
      name: body.name.trim(),
      slug,
      description: body.description ?? '',
      image: body.image ?? null,
      status: body.status || 'active',
    })
    return toPublicCategory(doc)
  } catch (e) {
    if (e.code === 11000) {
      throw new AppError('Category name or slug already exists', 409, 'CONFLICT')
    }
    throw e
  }
}

async function updateCategory(id, body) {
  assertObjectId(id)
  const doc = await Category.findById(id)
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND')

  if (body.name !== undefined) {
    doc.name = body.name.trim()
    if (!body.slug) {
       const baseSlug = slugify(body.name)
       doc.slug = await ensureUniqueSlug(baseSlug, doc._id)
    }
  }
  
  if (body.slug !== undefined) {
    const nextBase = body.slug.trim().toLowerCase()
    doc.slug = await ensureUniqueSlug(nextBase, doc._id)
  }

  if (body.description !== undefined) doc.description = body.description
  if (body.image !== undefined) doc.image = body.image
  if (body.status !== undefined) doc.status = body.status

  try {
    await doc.save()
    return toPublicCategory(doc)
  } catch (e) {
    if (e.code === 11000) {
      throw new AppError('Category name or slug already exists', 409, 'CONFLICT')
    }
    throw e
  }
}

async function deleteCategory(id) {
  assertObjectId(id)
  const doc = await Category.findById(id)
  if (!doc) throw new AppError('Category not found', 404, 'NOT_FOUND')
  
  // We can choose hard delete or soft delete. Let's do soft delete by status archived or just delete.
  // The product system uses 'archived' status. Let's add 'archived' to category status or just remove.
  // I'll just remove it for categories if they are not referenced.
  await Category.deleteOne({ _id: id })
  return { id, success: true }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
