import { Checkbox, Slider, Select, Drawer, Button, Input } from 'antd'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import { useTranslation } from 'react-i18next'
import {
  filterProducts,
  sortProducts,
  countByCategory,
} from '../utils/searchFilter'

const PRICE_MAX = 3000

const CATEGORY_IDS = ['mac', 'ipad', 'audio', 'accessories']

const FEATURE_IDS = [
  'noise_cancellation',
  'wireless_charging',
  'water_resistant',
  'm_series',
]

/** Mock cố định: có categoryId, priceValue, featureIds để lọc/sắp xếp tái lập được. */
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    tagline: 'M3 Max performance',
    categoryId: 'mac',
    priceValue: 2499,
    price: '$2,499.00',
    featureIds: ['m_series', 'wireless_charging'],
    isNew: true,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'iPad Pro 13"',
    tagline: 'Ultra Retina XDR',
    categoryId: 'ipad',
    priceValue: 1099,
    price: '$1,099.00',
    featureIds: ['m_series'],
    isNew: true,
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    tagline: 'Adaptive Audio',
    categoryId: 'audio',
    priceValue: 249,
    price: '$249.00',
    featureIds: ['noise_cancellation', 'wireless_charging', 'water_resistant'],
    isNew: true,
    image:
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Magic Keyboard',
    tagline: 'Sleek & Light',
    categoryId: 'accessories',
    priceValue: 349,
    price: '$349.00',
    featureIds: [],
    isNew: false,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Studio Display',
    tagline: '27" 5K Retina',
    categoryId: 'mac',
    priceValue: 1599,
    price: '$1,599.00',
    featureIds: [],
    isNew: false,
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'iPad Air',
    tagline: 'Serious power',
    categoryId: 'ipad',
    priceValue: 599,
    price: '$599.00',
    featureIds: ['m_series'],
    isNew: false,
    image:
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: 'HomePod mini',
    tagline: 'Room-filling sound',
    categoryId: 'audio',
    priceValue: 99,
    price: '$99.00',
    featureIds: ['wireless_charging'],
    isNew: false,
    image:
      'https://images.unsplash.com/photo-1612282130134-49b84fa8004f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'USB-C Charge Cable',
    tagline: '2m woven',
    categoryId: 'accessories',
    priceValue: 29,
    price: '$29.00',
    featureIds: [],
    isNew: false,
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
]

function toggleIdInList(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

const SearchResultsPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const query = searchParams.get('q') ?? ''
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX])
  const [sortBy, setSortBy] = useState('featured')

  const categoryCounts = useMemo(() => countByCategory(MOCK_PRODUCTS), [])

  const criteria = useMemo(
    () => ({
      query,
      categoryIds: selectedCategories,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      featureIds: selectedFeatures,
    }),
    [query, selectedCategories, priceRange, selectedFeatures]
  )

  const filtered = useMemo(
    () => filterProducts(MOCK_PRODUCTS, criteria),
    [criteria]
  )

  const visibleProducts = useMemo(
    () => sortProducts(filtered, sortBy),
    [filtered, sortBy]
  )

  const handleQueryChange = (e) => {
    const value = e.target.value
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">
          {t('search.categories')}
        </h3>
        <div className="flex flex-col gap-3">
          {CATEGORY_IDS.map((id) => (
            <Checkbox
              key={id}
              checked={selectedCategories.includes(id)}
              onChange={() =>
                setSelectedCategories((prev) => toggleIdInList(prev, id))
              }
            >
              {t(`search.category_labels.${id}`, {
                count: categoryCounts[id] ?? 0,
              })}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">
          {t('search.price_range')}
        </h3>
        <Slider
          range
          min={0}
          max={PRICE_MAX}
          value={priceRange}
          onChange={setPriceRange}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
          <span>$0</span>
          <span>${PRICE_MAX}+</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-bold text-[#1d1d1f] mb-4 text-sm uppercase tracking-wider">
          {t('search.features')}
        </h3>
        <div className="flex flex-col gap-3">
          {FEATURE_IDS.map((id) => (
            <Checkbox
              key={id}
              checked={selectedFeatures.includes(id)}
              onChange={() =>
                setSelectedFeatures((prev) => toggleIdInList(prev, id))
              }
            >
              {t(`search.feature_labels.${id}`)}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#fbfbfd] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="w-full md:flex-1 md:max-w-xl">
            <p className="text-sm text-gray-500 mb-2 font-medium">
              {t('search.breadcrumb')}
            </p>
            <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-4">
              {t('nav.shop')}
            </h1>
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder={t('search.query_placeholder')}
              value={query}
              onChange={handleQueryChange}
              className="rounded-full"
            />
            <p className="text-gray-500 mt-3">
              {t('search.showing', { count: visibleProducts.length })}
            </p>
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
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                {t('search.sort_by')}
              </span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 160 }}
                options={[
                  { value: 'featured', label: t('search.sort_options.featured') },
                  { value: 'newest', label: t('search.sort_options.newest') },
                  {
                    value: 'price_low',
                    label: t('search.sort_options.price_low'),
                  },
                  {
                    value: 'price_high',
                    label: t('search.sort_options.price_high'),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="hidden md:block w-64 flex-shrink-0">
            <FiltersContent />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <p className="text-center text-gray-500 py-16">
                {t('search.no_results')}
              </p>
            )}

            <div className="mt-16 flex justify-center">
              <Button
                size="large"
                className="px-10 rounded-full font-bold text-[#1d1d1f] border-gray-300"
              >
                {t('products.load_more')}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
