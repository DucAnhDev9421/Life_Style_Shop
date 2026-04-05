const { z } = require('zod')
const mongoose = require('mongoose')

const objectIdString = z
  .string()
  .trim()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), { message: 'Invalid id' })

const imagesSchema = z
  .array(z.string().url('Invalid image URL'))
  .max(20, 'Too many images')
  .default([])

const createProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    slug: z.string().trim().min(1).max(220).optional(),
    description: z.string().max(10000).optional().default(''),
    price: z.number().finite().min(0, 'Price must be >= 0'),
    stock: z.number().int().min(0, 'Stock must be >= 0'),
    images: imagesSchema.optional(),
    category: z.string().trim().max(120).optional().nullable(),
    status: z.enum(['draft', 'active']).optional(),
    sellerId: objectIdString.optional(),
  })
  .strict()

const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(220).optional(),
    description: z.string().max(10000).optional(),
    price: z.number().finite().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string().url('Invalid image URL')).max(20).optional(),
    category: z.string().trim().max(120).optional().nullable(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
  })
  .strict()

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  category: z.string().trim().max(120).optional(),
})

const productIdParamsSchema = z.object({
  id: objectIdString,
})

module.exports = {
  createProductSchema,
  updateProductSchema,
  listQuerySchema,
  productIdParamsSchema,
}
