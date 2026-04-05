import { useTranslation } from 'react-i18next'

const METHOD_IDS = ['cod', 'bank_transfer', 'e_wallet']

/**
 * Chọn một phương thức thanh toán (radio — chỉ một active).
 */
function PaymentMethod({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
        {t('checkout.payment_title')}
      </h2>

      <fieldset className="space-y-3">
        <legend className="sr-only">{t('checkout.payment_title')}</legend>
        {METHOD_IDS.map((id) => {
          const selected = value === id
          return (
            <label
              key={id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                selected
                  ? 'border-[#0071e3] bg-[#0071e3]/5 ring-1 ring-[#0071e3]/20'
                  : 'border-gray-200 bg-[#fbfbfd] hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={id}
                checked={selected}
                onChange={() => onChange(id)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0071e3]"
              />
              <span className="text-sm font-medium text-[#1d1d1f] leading-snug">
                {t(`checkout.payment_${id}`)}
              </span>
            </label>
          )
        })}
      </fieldset>
    </section>
  )
}

export default PaymentMethod
