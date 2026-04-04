import { useMemo, useState } from 'react'
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
import ListingPageFooter from '../components/common/ListingPageFooter'
import { MOCK_PRODUCTS, SPORT_FILTERS } from '../data/mockProducts'
import { useTranslation } from 'react-i18next'

const SPORT_ICONS = {
  all: AppstoreOutlined,
  picnic: EnvironmentOutlined,
  running: RocketOutlined,
  warm: FireOutlined,
  swim: CloudOutlined,
  boxing: BoxPlotOutlined,
}

const ProductListPage = () => {
  const { t } = useTranslation()
  const [sport, setSport] = useState('boxing')
  const [sortBy, setSortBy] = useState('featured')
  const [, setWishTick] = useState(0)

  const visible = useMemo(() => {
    let list =
      sport === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter((p) => p.sportFilter === sport)

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
  }, [sport, sortBy])

  return (
    <div className="bg-white min-h-screen pb-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        <h1 className="text-center text-base sm:text-lg font-bold tracking-[0.35em] text-[#1d1d1f] mb-10 uppercase font-sans">
          {t('listing.product_list_title')}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <aside className="w-full lg:w-56 shrink-0">
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
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <span className="text-sm text-gray-500">
                {t('listing.showing_count', { count: visible.length })}
              </span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="min-w-[200px]"
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
              <p className="text-center text-gray-500 py-16">
                {t('listing.empty_category')}
              </p>
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

      <ListingPageFooter />
    </div>
  )
}

export default ProductListPage
