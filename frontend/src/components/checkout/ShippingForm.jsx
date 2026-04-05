import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

/**
 * Thông tin giao hàng — controlled; lỗi hiển thị dưới từng ô (màu đỏ).
 */
function ShippingForm({ values, errors, onFieldChange }) {
  const { t } = useTranslation()

  const errMsg = (field) => {
    const code = errors[field]
    if (!code) return null
    return t(`checkout.errors.${field}_${code}`)
  }

  const fieldClass =
    'w-full rounded-xl border border-gray-200 bg-[#fbfbfd] px-4 py-2.5 text-sm text-[#1d1d1f] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]/30 outline-none transition-colors'

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
        {t('checkout.shipping_title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="co-fullName" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
            {t('checkout.field_full_name')}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="co-fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => onFieldChange('fullName', e.target.value)}
            className={fieldClass}
          />
          {errMsg('fullName') && (
            <p className="mt-1.5 text-sm text-red-600">{errMsg('fullName')}</p>
          )}
        </div>

        <div>
          <label htmlFor="co-phone" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
            {t('checkout.field_phone')}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="co-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t('checkout.phone_placeholder')}
            value={values.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            className={fieldClass}
          />
          {errMsg('phone') && (
            <p className="mt-1.5 text-sm text-red-600">{errMsg('phone')}</p>
          )}
        </div>

        <div>
          <label htmlFor="co-email" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
            {t('checkout.field_email')}
          </label>
          <input
            id="co-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            className={fieldClass}
          />
          {errMsg('email') && (
            <p className="mt-1.5 text-sm text-red-600">{errMsg('email')}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="co-address" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
            {t('checkout.field_address')}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <TextArea
            id="co-address"
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={values.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            className="!rounded-xl !border-gray-200 !bg-[#fbfbfd] !px-4 !py-2.5"
          />
          {errMsg('address') && (
            <p className="mt-1.5 text-sm text-red-600">{errMsg('address')}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="co-note" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">
            {t('checkout.field_note')}
          </label>
          <TextArea
            id="co-note"
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={values.note}
            onChange={(e) => onFieldChange('note', e.target.value)}
            className="!rounded-xl !border-gray-200 !bg-[#fbfbfd] !px-4 !py-2.5"
            placeholder={t('checkout.note_placeholder')}
          />
        </div>
      </div>
    </section>
  )
}

export default ShippingForm
