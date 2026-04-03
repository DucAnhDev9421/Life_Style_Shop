import ProductCard from '../common/ProductCard'
import { useTranslation } from 'react-i18next'

const products = [
  {
    id: 1,
    name: "AirPods Max Pro",
    tagline: "High-level ANC",
    price: "$549.00",
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true
  },
  {
    id: 2,
    name: "Mechanical Keyboard X",
    tagline: "Tactile Precision",
    price: "$199.00",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: true
  },
  {
    id: 3,
    name: "Pro Display 32\"",
    tagline: "True Color Accuracy",
    price: "$1299.00",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: false
  },
  {
    id: 4,
    name: "Smart Watch Gen 4",
    tagline: "Track everything",
    price: "$399.00",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: false
  }
];

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CuratedProductsSection
