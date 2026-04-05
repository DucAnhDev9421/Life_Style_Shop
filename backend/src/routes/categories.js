const express = require('express')
const categoryController = require('../controllers/categoryController')
const { requireAuth, requireRoles } = require('../middleware/auth')

const router = express.Router()

router.get('/', categoryController.list)
router.get('/:id', categoryController.getById)

router.post('/', requireAuth, requireRoles('admin'), categoryController.create)
router.put('/:id', requireAuth, requireRoles('admin'), categoryController.update)
router.delete('/:id', requireAuth, requireRoles('admin'), categoryController.remove)

module.exports = router
