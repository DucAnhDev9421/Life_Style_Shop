import api from './api'

/**
 * Gói payload gửi POST /orders — giữ một chỗ để backend đổi contract chỉ sửa đây.
 *
 * @param {object} params
 * @param {object} params.customer — fullName, phone, email, address, note
 * @param {string} params.paymentMethod — vd: 'cod' | 'bank_transfer' | 'e_wallet'
 * @param {Array} params.items — dòng giỏ: productId, cartItemId, quantity, unitPriceVnd
 * @param {object} params.pricing — subtotalVnd, discountVnd, shippingVnd, totalVnd
 * @param {string|null} params.couponCode
 */
export function buildOrderPayload({
  customer,
  paymentMethod,
  items,
  pricing,
  couponCode,
}) {
  return {
    customer: {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || null,
      address: customer.address.trim(),
      note: customer.note?.trim() || '',
    },
    paymentMethod,
    items: items.map((l) => ({
      cartItemId: l.cartItemId,
      productId: l.productId,
      catalogItemId: l.catalogItemId ?? null,
      quantity: l.quantity,
      unitPriceVnd: l.unitPriceVnd,
    })),
    pricing: {
      subtotalVnd: pricing.subtotalVnd,
      discountVnd: pricing.discountVnd,
      shippingVnd: pricing.shippingVnd,
      totalVnd: pricing.totalVnd,
    },
    couponCode: couponCode || null,
  }
}

/**
 * POST tạo đơn — baseURL axios đã gồm /api/v1 nên path chỉ cần /orders.
 * Khi server dùng /api/orders không có v1, chỉnh VITE_API_BASE_URL hoặc path dưới đây.
 */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return data
}
