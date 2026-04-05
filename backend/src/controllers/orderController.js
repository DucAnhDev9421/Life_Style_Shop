const Order = require('../models/Order')

class OrderController {
  async getOrders(req, res, next) {
    try {
      // Find orders in DB
      let orders = await Order.find({ user: req.user.id })
        .populate('items.product')
        .sort({ createdAt: -1 })
      
      // MOCK DATA INJECTION FOR UI TESTING
      // If DB is empty because Checkout is not done, return fake data instead
      if (orders.length === 0) {
         return res.status(200).json({
            success: true,
            data: [
               {
                  _id: 'fake-order-id-12345',
                  createdAt: new Date().toISOString(),
                  totalAmount: 24500000,
                  status: 'processing',
                  items: [
                     {
                        product: {
                           name: 'iPhone 15 Pro Max',
                           thumbnail: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-pure-back-iphone-15-pro-max-natural-titanium-pure-front-2up-screen-usen.png',
                           slug: 'iphone-15-pro-max'
                        },
                        quantity: 1,
                        price: 24500000
                     }
                  ],
                  paymentMethod: 'cod',
                  paymentStatus: 'unpaid',
                  shippingAddress: {
                     fullName: req.user.fullName || 'Khách hàng',
                     phone: req.user.phone || '0987654321',
                     address: '123 Đường Tạm, Quận Giả Lập'
                  }
               }
            ]
         })
      }

      res.status(200).json({ success: true, data: orders })
    } catch (err) {
      next(err)
    }
  }

  async createOrder(req, res, next) {
    try {
      const { customer, paymentMethod, items, pricing } = req.body

      const orderItems = items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.unitPriceVnd
      }))

      const newOrder = await Order.create({
        user: req.user.id,
        items: orderItems,
        totalAmount: pricing.totalVnd,
        paymentMethod,
        shippingAddress: {
          fullName: customer.fullName,
          phone: customer.phone,
          address: customer.address
        }
      })

      res.status(201).json({
        success: true,
        data: newOrder
      })
    } catch (err) {
      console.error('[OrderController] createOrder Error:', err)
      next(err)
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
        .populate('items.product')
      
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' })
      }

      res.status(200).json({ success: true, data: order })
    } catch (err) {
      next(err)
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' })
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        return res.status(400).json({ success: false, message: 'Cannot cancel order in current status' })
      }

      order.status = 'cancelled'
      await order.save()

      res.status(200).json({ success: true, data: order })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new OrderController()
