import { Checkbox, Slider, Select, Drawer, Button } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ProductCard from '../components/common/ProductCard'
import { useTranslation } from 'react-i18next'

// Mock expanded product list
const searchResults = [
  ...Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    name: `Tech Gadget Model ${i + 1}`,
    tagline: i % 2 === 0 ? "Pro Performance" : "Sleek & Light",
    price: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
    image: i % 2 === 0 
      ? "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      : "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isNew: i < 3
  }))
];

const SearchResultsPage = () => {
  const { t } = useTranslation()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">{t('search.categories')}</h3>
        <div className="flex flex-col gap-3">
          <Checkbox>Mac (12)</Checkbox>
          <Checkbox>iPad (8)</Checkbox>
          <Checkbox>Audio (15)</Checkbox>
          <Checkbox>Accessories (34)</Checkbox>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">{t('search.price_range')}</h3>
        <Slider range defaultValue={[200, 1500]} max={3000} />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
          <span>$0</span>
          <span>$3000+</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">{t('search.features')}</h3>
        <div className="flex flex-col gap-3">
          <Checkbox>Noise Cancellation</Checkbox>
          <Checkbox>Wireless Charging</Checkbox>
          <Checkbox>Water Resistant</Checkbox>
          <Checkbox>M-Series Chip</Checkbox>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#fbfbfd] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">{t('search.breadcrumb')}</p>
            <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">Audio Equipment</h1>
            <p className="text-gray-500 mt-2">{t('search.showing', { count: 15 })}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              className="md:hidden flex items-center justify-center font-semibold bg-white border-gray-200"
              icon={<FilterOutlined />}
              onClick={() => setMobileFiltersOpen(true)}
            >
              {t('search.filters')}
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 hidden sm:block">{t('search.sort_by')}</span>
              <Select 
                defaultValue="featured"
                style={{ width: 160 }}
                options={[
                  { value: 'featured', label: t('search.sort_options.featured') },
                  { value: 'newest', label: t('search.sort_options.newest') },
                  { value: 'price_low', label: t('search.sort_options.price_low') },
                  { value: 'price_high', label: t('search.sort_options.price_high') },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FiltersContent />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Button size="large" className="px-10 rounded-full font-bold text-[#1d1d1f] border-gray-300">
                {t('products.load_more')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        title={t('search.filters')}
        placement="left"
        onClose={() => setMobileFiltersOpen(false)}
        open={mobileFiltersOpen}
        width={300}
      >
        <FiltersContent />
      </Drawer>
    </div>
  )
}

export default SearchResultsPage
