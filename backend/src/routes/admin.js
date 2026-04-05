const express = require('express')
const adminController = require('../controllers/adminController')
const { requireAuth, requireRoles } = require('../middleware/auth')

const router = express.Router()

// All admin routes require authentication + admin or seller role
router.use(requireAuth, requireRoles('admin', 'seller'))

// Stats overview
router.get('/stats', adminController.getStats)
router.get('/analytics', adminController.getAnalytics)

// Users management
router.get('/users', adminController.listUsers)
router.patch('/users/:id/status', adminController.updateUserStatus)

// Products management
router.get('/products', adminController.getProductStats)
router.post('/products', adminController.createProduct)
router.patch('/products/:id', adminController.updateProduct)
router.patch('/products/:id/status', adminController.updateProductStatus)
router.delete('/products/:id', adminController.removeProduct)

// Categories management
router.get('/categories', adminController.listCategories)
router.delete('/categories/:id', adminController.deleteCategory)

module.exports = router
