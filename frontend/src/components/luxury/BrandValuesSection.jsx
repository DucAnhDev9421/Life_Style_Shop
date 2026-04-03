import { useTranslation } from 'react-i18next'

const BrandValuesSection = () => {
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-[#1d1d1f] font-bold mb-2">{t('values.delivery_title')}</h3>
            <p className="text-sm text-gray-500 font-medium">{t('values.delivery_desc')}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-[#1d1d1f] font-bold mb-2">{t('values.payment_title')}</h3>
            <p className="text-sm text-gray-500 font-medium">{t('values.payment_desc')}</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 bg-[#0071e3]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-[#1d1d1f] font-bold mb-2">{t('values.specialist_title')}</h3>
            <p className="text-sm text-gray-500 font-medium">{t('values.specialist_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandValuesSection
