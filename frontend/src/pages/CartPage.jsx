import { Link } from 'react-router-dom'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useCart } from '../context/useCart'
import CartItem from '../components/cart/CartItem'
import OrderSummary from '../components/cart/OrderSummary'
import RemoveItemConfirmModal from '../components/cart/RemoveItemConfirmModal'

/**
 * Trang Giỏ hàng: ghép CartItem + OrderSummary + modal xóa.
 *
 * Luồng số lượng:
 * - "+" → incrementLine → state đổi → subtotal/total trong context tự tính lại.
 * - "-" và qty > 1 → decrementLine.
 * - "-" và qty === 1 → mở modal; OK → confirmRemoveLine (API delete + bỏ dòng).
 */
function CartPage() {
  const { t } = useTranslation()
  const {
    lines,
    loading,
    subtotalVnd,
    shippingVnd,
    totalVnd,
    incrementLine,
    decrementLine,
    confirmRemoveLine,
  } = useCart()

  const [pendingRemoveId, setPendingRemoveId] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const pendingLine = lines.find((l) => l.cartItemId === pendingRemoveId)
  const pendingTitle = pendingLine?.catalogItemId
    ? t(`listing.catalog_items.${pendingLine.catalogItemId}.name`)
    : t('cart.fallback_product_name')

  const closeModal = () => {
    if (!confirming) setPendingRemoveId(null)
  }

  const handleConfirmRemove = async () => {
    if (!pendingRemoveId) return
    setConfirming(true)
    try {
      await confirmRemoveLine(pendingRemoveId)
      setPendingRemoveId(null)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="bg-[#fbfbfd] min-h-[calc(100vh-4rem)] pb-16 pt-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <nav className="text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#0071e3]">
            {t('productDetail.breadcrumb_home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1d1d1f] font-medium">{t('cart.title')}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mb-8">
          {t('cart.title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spin size="large" />
          </div>
        ) : lines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-600 mb-6">{t('cart.empty')}</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-sm font-bold px-8 py-3 hover:opacity-90 no-underline"
            >
              {t('cart.continue_shopping')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
            <div className="flex-1 min-w-0 space-y-4">
              {lines.map((line) => (
                <CartItem
                  key={line.cartItemId}
                  line={line}
                  onIncrement={() => incrementLine(line.cartItemId)}
                  onDecrement={() => decrementLine(line.cartItemId)}
                  onDecrementAtOne={() => setPendingRemoveId(line.cartItemId)}
                />
              ))}

              <div className="pt-2">
                <Link
                  to="/products"
                  className="text-sm font-semibold text-[#0071e3] hover:underline"
                >
                  ← {t('cart.continue_shopping')}
                </Link>
              </div>
            </div>

            <OrderSummary
              subtotalVnd={subtotalVnd}
              shippingVnd={shippingVnd}
              totalVnd={totalVnd}
              disabledCheckout={lines.length === 0}
            />
          </div>
        )}
      </div>

      <RemoveItemConfirmModal
        open={Boolean(pendingRemoveId)}
        productTitle={pendingTitle}
        confirming={confirming}
        onCancel={closeModal}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}

export default CartPage
