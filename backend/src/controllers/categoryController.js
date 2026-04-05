const { ZodError } = require('zod')
const categoryService = require('../services/categoryService')
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamsSchema,
} = require('../validators/category')
const { formatZodError } = require('../validators/auth')
const AppError = require('../utils/AppError')

async function list(req, res, next) {
  try {
    const query = req.query
    const result = await categoryService.listCategories(query)
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    return next(e)
  }
}

async function getById(req, res, next) {
  try {
    const { id } = categoryIdParamsSchema.parse(req.params)
    const category = await categoryService.getCategoryById(id)
    res.status(200).json({ success: true, data: { category } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function create(req, res, next) {
  try {
    const body = createCategorySchema.parse(req.body)
    const category = await categoryService.createCategory(body)
    res.status(201).json({ success: true, data: { category } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function update(req, res, next) {
  try {
    const { id } = categoryIdParamsSchema.parse(req.params)
    const body = updateCategorySchema.parse(req.body)
    if (Object.keys(body).length === 0) {
      return next(new AppError('No fields to update', 400, 'VALIDATION_ERROR'))
    }
    const category = await categoryService.updateCategory(id, body)
    res.status(200).json({ success: true, data: { category } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function remove(req, res, next) {
  try {
    const { id } = categoryIdParamsSchema.parse(req.params)
    const result = await categoryService.deleteCategory(id)
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
}
