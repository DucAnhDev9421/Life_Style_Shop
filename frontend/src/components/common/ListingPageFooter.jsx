import { useTranslation } from 'react-i18next'

const Col = ({ title, keys }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-4 tracking-wide">
        {title}
      </h3>
      <ul className="space-y-2">
        {keys.map((k) => (
          <li key={k}>
            <button
              type="button"
              className="text-left text-sm text-blue-100 hover:text-white transition-colors"
            >
              {t(`listing.footer_links.${k}`)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Footer nền xanh như Figma LifeStyle Shop */
const ListingPageFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className="mt-16 bg-[#0071e3] pt-12 pb-12 text-white">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Col
          title={t('listing.footer_cols.support')}
          keys={['cs_contact', 'order_guide', 'returns']}
        />
        <Col
          title={t('listing.footer_cols.about')}
          keys={['who', 'recruit', 'sports_blog']}
        />
        <Col
          title={t('listing.footer_cols.offers')}
          keys={['points', 'voucher', 'fanpage']}
        />
      </div>
    </footer>
  )
}

export default ListingPageFooter
