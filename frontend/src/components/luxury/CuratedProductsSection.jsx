import ProductCard from '../common/ProductCard'
import { useTranslation } from 'react-i18next'
import { PRODUCTS } from '../../data/products'

const CuratedProductsSection = () => {
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
            {t('products.title')} 
            <span className="text-gray-500"> {t('products.subtitle')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CuratedProductsSection
