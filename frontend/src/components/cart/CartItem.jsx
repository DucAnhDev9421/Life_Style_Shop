import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'

/**
 * Một dòng sản phẩm trong giỏ: ảnh, tên, đơn giá, stepper +/- .
 * Layout: mobile xếp dọc, desktop ngang — giữ palette #0071e3 / #1d1d1f / #fbfbfd.
 */
function CartItem({ line, onIncrement, onDecrement, onDecrementAtOne }) {
  const { t, i18n } = useTranslation()

  const title = line.catalogItemId
    ? t(`listing.catalog_items.${line.catalogItemId}.name`)
    : t('cart.fallback_product_name')

  const lineTotal = line.unitPriceVnd * line.quantity
  const priceLine = formatVndAmount(lineTotal, i18n.language)

  const handleMinus = () => {
    if (line.quantity <= 1) {
      onDecrementAtOne()
      return
    }
    onDecrement()
  }

  return (
    <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="shrink-0 mx-auto sm:mx-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#f5f5f7]">
        <img
          src={line.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left min-w-0">
          <h2 className="text-base font-semibold text-[#1d1d1f] truncate">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatVndAmount(line.unitPriceVnd, i18n.language)}
            <span className="mx-1">×</span>
            {line.quantity}
          </p>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <div
            className="inline-flex items-center rounded-full border border-gray-200 bg-[#fbfbfd] p-1"
            role="group"
            aria-label={t('cart.quantity_controls')}
          >
            <button
              type="button"
              onClick={handleMinus}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] hover:bg-white hover:shadow-sm transition-all"
              aria-label={t('cart.decrease_aria')}
            >
              <MinusOutlined className="text-xs" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] hover:bg-white hover:shadow-sm transition-all"
              aria-label={t('cart.increase_aria')}
            >
              <PlusOutlined className="text-xs" />
            </button>
          </div>

          <p className="text-sm font-bold text-[#1d1d1f] tabular-nums min-w-[7rem] text-right">
            {priceLine}
          </p>
        </div>
      </div>
    </article>
  )
}

export default CartItem
