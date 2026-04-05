const { ZodError } = require('zod')
const productService = require('../services/productService')
const {
  createProductSchema,
  updateProductSchema,
  listQuerySchema,
  productIdParamsSchema,
} = require('../validators/product')
const { formatZodError } = require('../validators/auth')
const AppError = require('../utils/AppError')

async function list(req, res, next) {
  try {
    const query = listQuerySchema.parse(req.query)
    const result = await productService.listProductsPublic(query)
    res.status(200).json({ success: true, data: result })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function getById(req, res, next) {
  try {
    const { id } = productIdParamsSchema.parse(req.params)
    const product = await productService.getProductByIdPublic(id)
    res.status(200).json({ success: true, data: { product } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function create(req, res, next) {
  try {
    const body = createProductSchema.parse(req.body)
    const product = await productService.createProduct(req.user, body)
    res.status(201).json({ success: true, data: { product } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function update(req, res, next) {
  try {
    const { id } = productIdParamsSchema.parse(req.params)
    const body = updateProductSchema.parse(req.body)
    if (Object.keys(body).length === 0) {
      return next(new AppError('No fields to update', 400, 'VALIDATION_ERROR'))
    }
    const product = await productService.updateProduct(req.user, id, body)
    res.status(200).json({ success: true, data: { product } })
  } catch (e) {
    if (e instanceof ZodError) {
      return next(new AppError(formatZodError(e), 400, 'VALIDATION_ERROR'))
    }
    return next(e)
  }
}

async function remove(req, res, next) {
  try {
    const { id } = productIdParamsSchema.parse(req.params)
    const result = await productService.deleteProduct(req.user, id)
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
