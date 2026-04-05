import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'

/**
 * Cột "Đơn hàng của bạn": dòng sản phẩm, mã giảm giá, tổng tiền, nút hoàn tất.
 */
function CheckoutOrderSummary({
  lines,
  subtotalVnd,
  discountVnd,
  shippingVnd,
  totalVnd,
  couponDraft,
  onCouponDraftChange,
  onApplyCoupon,
  couponErrorKey,
  appliedCouponCode,
  onSubmit,
  submitting,
  disabledSubmit,
}) {
  const { t, i18n } = useTranslation()

  const row = (label, amount, opts = {}) => (
    <div
      className={`flex justify-between items-baseline gap-4 text-sm ${
        opts.emphasis ? 'pt-1' : ''
      }`}
    >
      <span className={opts.muted ? 'text-gray-500' : 'text-gray-600'}>{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          opts.discount ? 'text-emerald-600' : 'text-[#1d1d1f]'
        }`}
      >
        {opts.discount && discountVnd > 0 ? '−' : ''}
        {formatVndAmount(amount, i18n.language)}
      </span>
    </div>
  )

  return (
    <aside className="w-full lg:max-w-md shrink-0">
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
          {t('checkout.order_summary_title')}
        </h2>

        <ul className="mb-5 max-h-48 overflow-y-auto space-y-3 pr-1">
          {lines.map((line) => {
            const title = line.catalogItemId
              ? t(`listing.catalog_items.${line.catalogItemId}.name`)
              : t('cart.fallback_product_name')
            const lineTotal = line.unitPriceVnd * line.quantity
            return (
              <li key={line.cartItemId} className="flex gap-3 text-sm">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f7]">
                  <img src={line.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#1d1d1f] truncate">{title}</p>
                  <p className="text-xs text-gray-500">
                    × {line.quantity}
                  </p>
                </div>
                <p className="shrink-0 font-semibold tabular-nums text-[#1d1d1f]">
                  {formatVndAmount(lineTotal, i18n.language)}
                </p>
              </li>
            )
          })}
        </ul>

        {/* Mã giảm giá: nhập + Áp dụng — logic giả lập ở CheckoutPage */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-600 mb-2">{t('checkout.coupon_label')}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={couponDraft}
              onChange={(e) => onCouponDraftChange(e.target.value)}
              placeholder={t('checkout.coupon_placeholder')}
              className="!rounded-full !border-gray-200 flex-1"
              onPressEnter={onApplyCoupon}
            />
            <Button
              type="default"
              className="!rounded-full !font-semibold shrink-0"
              onClick={onApplyCoupon}
            >
              {t('checkout.coupon_apply')}
            </Button>
          </div>
          {couponErrorKey && (
            <p className="mt-1.5 text-sm text-red-600">{t(couponErrorKey)}</p>
          )}
          {appliedCouponCode && !couponErrorKey && (
            <p className="mt-1.5 text-xs text-emerald-600 font-medium">
              {t('checkout.coupon_applied', { code: appliedCouponCode })}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-6 border-t border-gray-100 pt-5">
          {row(t('cart.subtotal'), subtotalVnd)}
          {discountVnd > 0 &&
            row(t('checkout.discount'), discountVnd, { discount: true })}
          {row(t('cart.shipping'), shippingVnd)}
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between items-baseline gap-4">
            <span className="text-base font-bold text-[#1d1d1f]">{t('cart.total')}</span>
            <span className="text-lg font-black text-[#0071e3] tabular-nums">
              {formatVndAmount(totalVnd, i18n.language)}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={submitting}
          disabled={disabledSubmit}
          onClick={onSubmit}
          className="!h-12 !rounded-full !font-bold"
        >
          {t('checkout.place_order')}
        </Button>
      </div>
    </aside>
  )
}

export default CheckoutOrderSummary
