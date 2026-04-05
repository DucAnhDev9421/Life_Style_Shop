const { z } = require('zod')
const mongoose = require('mongoose')

const objectIdString = z
  .string()
  .trim()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), { message: 'Invalid id' })

const createCategorySchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    slug: z.string().trim().min(1).max(140).optional(),
    description: z.string().max(500).optional().default(''),
    image: z.string().url('Invalid image URL').optional().nullable(),
    status: z.enum(['active', 'inactive']).optional().default('active'),
  })
  .strict()

const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    slug: z.string().trim().min(1).max(140).optional(),
    description: z.string().max(500).optional(),
    image: z.string().url('Invalid image URL').optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .strict()

const categoryIdParamsSchema = z.object({
  id: objectIdString,
})

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamsSchema,
}
