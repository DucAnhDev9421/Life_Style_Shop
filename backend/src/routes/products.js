const express = require('express')
const productController = require('../controllers/productController')
const { requireAuth, requireRoles } = require('../middleware/auth')

const router = express.Router()

router.get('/', productController.list)
router.get('/:id', productController.getById)
router.get('/slug/:slug', productController.getBySlug)

router.post('/', requireAuth, requireRoles('admin', 'seller'), productController.create)
router.put('/:id', requireAuth, requireRoles('admin', 'seller'), productController.update)
router.delete('/:id', requireAuth, requireRoles('admin', 'seller'), productController.remove)

module.exports = router
