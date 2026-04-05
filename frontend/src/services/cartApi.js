import api from './api'

/**
 * Chuẩn hóa payload từ backend → danh sách dòng giỏ dùng trong UI.
 * Khi API thật khác cấu trúc, chỉnh mapper này một chỗ.
 *
 * Ví dụ backend trả về:
 * { items: [ { _id, productId, quantity, priceSnapshot, product: { name, image } } ] }
 */
export function mapCartResponseToLines(payload) {
  if (!payload) return []
  const raw = Array.isArray(payload) ? payload : payload.items || payload.cartItems
  if (!Array.isArray(raw)) return []
  return raw.map((row) => ({
    cartItemId: String(row.cartItemId ?? row._id ?? row.id),
    productId: row.productId ?? row.product?.id,
    catalogItemId: row.catalogItemId ?? row.product?.catalogItemId ?? null,
    quantity: Math.max(0, Number(row.quantity) || 0),
    unitPriceVnd: Number(row.unitPriceVnd ?? row.priceSnapshot ?? row.unitPrice ?? 0),
    image: row.image ?? row.product?.image ?? '',
  }))
}

/**
 * GET — lấy toàn bộ giỏ hàng của user hiện tại.
 * Trả mảng rỗng nếu backend trả 404 (endpoint chưa có), tránh crash UI.
 */
export async function fetchCart() {
  try {
    const { data } = await api.get('/cart')
    return mapCartResponseToLines(data)
  } catch (err) {
    if (err.response?.status === 404) return []
    throw err
  }
}

/**
 * PATCH/PUT — cập nhật số lượng một dòng giỏ trên DB.
 * Đổi method/path cho khớp contract backend (vd: PUT /cart/items/:id).
 */
export async function updateCartItemQuantity(cartItemId, quantity) {
  try {
    const { data } = await api.patch(`/cart/items/${cartItemId}`, { quantity })
    return data
  } catch (err) {
    if (err.response?.status === 404) return
    throw err
  }
}

/**
 * DELETE — xóa hẳn một dòng khỏi giỏ (sau khi user xác nhận popup).
 */
export async function removeCartItem(cartItemId) {
  try {
    await api.delete(`/cart/items/${cartItemId}`)
  } catch (err) {
    if (err.response?.status === 404) return
    throw err
  }
}
