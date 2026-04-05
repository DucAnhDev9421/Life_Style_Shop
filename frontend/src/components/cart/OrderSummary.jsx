import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'

/**
 * Cột phải: Tạm tính, phí vận chuyển, Tổng tiền.
 * Props được tính sẵn từ context ở parent — component thuần hiển thị.
 */
function OrderSummary({ subtotalVnd, shippingVnd, totalVnd, disabledCheckout }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const row = (label, amount) => (
    <div className="flex justify-between items-baseline gap-4 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-[#1d1d1f] tabular-nums">
        {formatVndAmount(amount, i18n.language)}
      </span>
    </div>
  )

  return (
    <aside className="w-full lg:max-w-sm shrink-0">
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
          {t('cart.order_summary')}
        </h2>

        <div className="space-y-4 mb-6">
          {row(t('cart.subtotal'), subtotalVnd)}
          {row(t('cart.shipping'), shippingVnd)}
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between items-baseline gap-4">
            <span className="text-base font-bold text-[#1d1d1f]">
              {t('cart.total')}
            </span>
            <span className="text-lg font-black text-[#0071e3] tabular-nums">
              {formatVndAmount(totalVnd, i18n.language)}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          disabled={disabledCheckout}
          className="!h-12 !rounded-full !font-bold"
          onClick={() => !disabledCheckout && navigate('/checkout')}
        >
          {t('cart.checkout')}
        </Button>

        <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
          {t('cart.summary_note')}
        </p>
      </div>
    </aside>
  )
}

export default OrderSummary
