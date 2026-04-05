import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchCart } from '../services/cartApi'
import { CartContext } from './cartContext.js'
import {
  buildSeedLines,
  safeRemove,
  safeUpdateQuantity,
} from './cartHelpers.js'

export function CartProvider({ children }) {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Luồng: mount → gọi fetchCart → map dòng; lỗi → seed local để không chặn UI.
   */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const mapped = await fetchCart()
        if (!cancelled) {
          setLines(mapped.filter((l) => l.quantity > 0))
        }
      } catch (e) {
        if (!cancelled) {
          setError(e)
          setLines(buildSeedLines())
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  /** Tạm tính = Σ (đơn giá × số lượng) — tự cập nhật khi `lines` đổi. */
  const subtotalVnd = useMemo(
    () =>
      lines.reduce(
        (sum, l) => sum + l.unitPriceVnd * l.quantity,
        0,
      ),
    [lines],
  )

  /** Phí ship cố định demo; sau này có thể lấy từ API checkout. */
  const shippingVnd = lines.length > 0 ? 30_000 : 0
  const totalVnd = subtotalVnd + shippingVnd

  const incrementLine = useCallback(async (cartItemId) => {
    setLines((prev) => {
      const next = prev.map((l) =>
        l.cartItemId === cartItemId
          ? { ...l, quantity: l.quantity + 1 }
          : l,
      )
      const line = next.find((l) => l.cartItemId === cartItemId)
      if (line) {
        void safeUpdateQuantity(cartItemId, line.quantity)
      }
      return next
    })
  }, [])

  /**
   * Giảm 1; nếu đang là 1 thì không đổi state — trả về false để UI bật popup xác nhận.
   * Dùng functional update để luôn đọc đúng số lượng mới nhất (tránh stale closure).
   */
  const decrementLine = useCallback(async (cartItemId) => {
    let shouldSync = false
    let nextQty = 0
    setLines((prev) => {
      const current = prev.find((l) => l.cartItemId === cartItemId)
      if (!current || current.quantity <= 1) return prev
      nextQty = current.quantity - 1
      shouldSync = true
      return prev.map((l) =>
        l.cartItemId === cartItemId ? { ...l, quantity: nextQty } : l,
      )
    })
    if (!shouldSync) return false
    await safeUpdateQuantity(cartItemId, nextQty)
    return true
  }, [])

  /** Sau khi user xác nhận popup khi bấm "-" ở số lượng 1. */
  const confirmRemoveLine = useCallback(async (cartItemId) => {
    await safeRemove(cartItemId)
    setLines((prev) => prev.filter((l) => l.cartItemId !== cartItemId))
  }, [])

  const refreshCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const mapped = await fetchCart()
      setLines(mapped.filter((l) => l.quantity > 0))
    } catch (e) {
      setError(e)
      setLines(buildSeedLines())
    } finally {
      setLoading(false)
    }
  }, [])

  /** Sau đặt hàng thành công: xóa giỏ local (sau này có thể gọi thêm API clear cart). */
  const clearCart = useCallback(() => {
    setLines([])
  }, [])

  const value = useMemo(
    () => ({
      lines,
      loading,
      error,
      itemCount,
      subtotalVnd,
      shippingVnd,
      totalVnd,
      incrementLine,
      decrementLine,
      confirmRemoveLine,
      refreshCart,
      clearCart,
    }),
    [
      lines,
      loading,
      error,
      itemCount,
      subtotalVnd,
      shippingVnd,
      totalVnd,
      incrementLine,
      decrementLine,
      confirmRemoveLine,
      refreshCart,
      clearCart,
    ],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}
