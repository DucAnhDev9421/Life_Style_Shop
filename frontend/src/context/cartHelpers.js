import {
  removeCartItem,
  updateCartItemQuantity,
} from '../services/cartApi'
import { MOCK_PRODUCTS } from '../data/mockProducts'

/** Dữ liệu mẫu khi chưa có backend hoặc GET /cart lỗi — chỉ để demo UI. */
export function buildSeedLines() {
  return MOCK_PRODUCTS.slice(0, 3).map((p) => ({
    cartItemId: `local-${p.id}`,
    productId: p.id,
    catalogItemId: p.catalogItemId ?? null,
    quantity: p.id === 2 ? 2 : 1,
    unitPriceVnd: p.priceVnd,
    image: p.image,
  }))
}

/**
 * Gọi API cập nhật số lượng; trong DEV nếu API chưa có, ghi log và không throw
 * để vẫn chỉnh được state local (khi bạn nối API thật, có thể bỏ fallback này).
 */
export async function safeUpdateQuantity(cartItemId, quantity) {
  try {
    await updateCartItemQuantity(cartItemId, quantity)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(
        '[cart] updateCartItemQuantity failed — local state vẫn đổi trong DEV',
        err,
      )
      return
    }
    throw err
  }
}

export async function safeRemove(cartItemId) {
  try {
    await removeCartItem(cartItemId)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(
        '[cart] removeCartItem failed — local state vẫn đổi trong DEV',
        err,
      )
      return
    }
    throw err
  }
}
