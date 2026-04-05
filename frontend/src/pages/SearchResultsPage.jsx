import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  FireOutlined,
  CloudOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons'
import { Select, Button } from 'antd'
import CatalogProductCard from '../components/common/CatalogProductCard'
import { MOCK_PRODUCTS, SPORT_FILTERS } from '../data/mockProducts'
import { useTranslation } from 'react-i18next'
import {
  filterProducts,
} from '../utils/searchFilter'
import { formatVndAmount } from '../utils/formatVnd'

const SPORT_ICONS = {
  all: AppstoreOutlined,
  picnic: EnvironmentOutlined,
  running: RocketOutlined,
  warm: FireOutlined,
  swim: CloudOutlined,
  boxing: BoxPlotOutlined,
}

const PRICE_MAX = 6_000_000

const SearchResultsPage = () => {
  const { t, i18n } = useTranslation()
  const [sport, setSport] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX])
  const [, setWishTick] = useState(0)

  const filtered = useMemo(
    () =>
      filterProducts(MOCK_PRODUCTS, {
        categoryIds: [],
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        featureIds: [],
      }),
    [priceRange]
  )

  const visible = useMemo(() => {
    let list =
      sport === 'all'
        ? filtered
        : filtered.filter((p) => p.sportFilter === sport)

    const sortFns = {
      featured: (a, b) => {
        if (Boolean(a.isNew) !== Boolean(b.isNew)) return a.isNew ? -1 : 1
        return a.id - b.id
      },
      price_low: (a, b) => a.priceValue - b.priceValue,
      price_high: (a, b) => b.priceValue - a.priceValue,
      newest: (a, b) => b.id - a.id,
    }
    const cmp = sortFns[sortBy] || sortFns.featured
    return [...list].sort(cmp)
  }, [sport, sortBy, filtered])

  return (
    <div className="bg-white min-h-screen pb-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-gray-100">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">
            {t('search.breadcrumb')}
          </p>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-2">
            {t('nav.shop')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('listing.showing_count', { count: visible.length })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sport Filter Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('search.sort_by')}
              </h3>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="w-full"
                size="middle"
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

            {/* Sport Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('listing.product_list_title')}
              </h3>
              <nav className="flex flex-row lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-gray-100">
                {SPORT_FILTERS.map((id) => {
                  const Icon = SPORT_ICONS[id]
                  const active = sport === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSport(id)}
                      className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors shrink-0 lg:w-full border-l-4 ${
                        active
                          ? 'bg-[#0071e3]/10 text-[#0071e3] border-[#0071e3]'
                          : 'text-gray-600 hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0 ${
                          active ? 'bg-white shadow-sm' : 'bg-gray-100'
                        }`}
                      >
                        <Icon className="text-base text-[#1d1d1f]" />
                      </span>
                      <span>{t(`listing.sport_filters.${id}`)}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Price Range */}
            <div className="hidden lg:block">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('search.price_range')}
              </h3>
              <Select
                value={priceRange[1]}
                onChange={(val) => setPriceRange([0, val])}
                className="w-full"
                size="middle"
                options={[
                  { value: PRICE_MAX, label: t('search.price_all') },
                  { value: 500_000, label: `≤ ${formatVndAmount(500_000, i18n.language)}` },
                  { value: 1_000_000, label: `≤ ${formatVndAmount(1_000_000, i18n.language)}` },
                  { value: 2_000_000, label: `≤ ${formatVndAmount(2_000_000, i18n.language)}` },
                  { value: 3_000_000, label: `≤ ${formatVndAmount(3_000_000, i18n.language)}` },
                  { value: 5_000_000, label: `≤ ${formatVndAmount(5_000_000, i18n.language)}` },
                ]}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Bar */}
            <div className="flex lg:hidden gap-3 mb-6 overflow-x-auto pb-2">
              <Select
                value={sport}
                onChange={setSport}
                className="min-w-[140px]"
                size="middle"
                options={SPORT_FILTERS.map((id) => ({
                  value: id,
                  label: t(`listing.sport_filters.${id}`),
                }))}
              />
              <Select
                value={priceRange[1]}
                onChange={(val) => setPriceRange([0, val])}
                className="min-w-[160px]"
                size="middle"
                options={[
                  { value: PRICE_MAX, label: t('search.price_all') },
                  { value: 500_000, label: `≤ 500K` },
                  { value: 1_000_000, label: `≤ 1M` },
                  { value: 2_000_000, label: `≤ 2M` },
                  { value: 3_000_000, label: `≤ 3M` },
                  { value: 5_000_000, label: `≤ 5M` },
                ]}
              />
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="min-w-[140px]"
                size="middle"
                options={[
                  { value: 'featured', label: t('search.sort_options.featured') },
                  { value: 'newest', label: t('search.sort_options.newest') },
                  { value: 'price_low', label: t('search.sort_options.price_low') },
                  { value: 'price_high', label: t('search.sort_options.price_high') },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {visible.map((product) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  mode="catalog"
                  onWishlistChange={() => setWishTick((x) => x + 1)}
                />
              ))}
            </div>

            {visible.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">{t('search.no_results_title')}</h3>
                <p className="text-gray-500 text-sm">{t('search.no_results')}</p>
                <Button
                  type="primary"
                  className="mt-6 rounded-full font-semibold"
                  onClick={() => {
                    setSport('all')
                    setPriceRange([0, PRICE_MAX])
                    setSortBy('featured')
                  }}
                >
                  {t('search.clear_filters')}
                </Button>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Button
                size="large"
                className="px-10 rounded-full font-bold border-gray-300 text-[#1d1d1f]"
              >
                {t('products.load_more')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
