import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, InputNumber } from 'antd'
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { getProductById } from '../data/products'

function ProductDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const product = useMemo(() => getProductById(id), [id])
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f]">{t('productDetail.not_found')}</h1>
        <p className="mt-4 text-gray-500">{t('productDetail.not_found_hint')}</p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-[#0071e3] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
        >
          {t('productDetail.back_shop')}
        </Link>
      </div>
    )
  }

  const mainSrc = product.images[activeImage] ?? product.image

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#0071e3]">
          {t('productDetail.breadcrumb_home')}
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-[#0071e3]">
          {t('productDetail.breadcrumb_shop')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1d1d1f]">
          {product.nameKey ? t(product.nameKey) : product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <img
              src={mainSrc}
              alt={product.nameKey ? t(product.nameKey) : product.name}
              className="h-full w-full object-contain"
            />
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={t('productDetail.gallery_label')}
          >
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === activeImage}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1 transition-colors ${
                  i === activeImage ? 'border-[#0071e3]' : 'border-transparent ring-1 ring-gray-200'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          {product.isNew && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3]">
              {t('products.new')}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1d1d1f] md:text-4xl">
            {product.nameKey ? t(product.nameKey) : product.name}
          </h1>
          <p className="mt-2 text-gray-500">
            {product.taglineKey ? t(product.taglineKey) : product.tagline}
          </p>
          <p className="mt-6 text-2xl font-semibold text-[#1d1d1f]">{product.price}</p>

          <p className="mt-6 text-base leading-relaxed text-gray-600">
            {t(product.descriptionKey)}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-gray-600">{t('productDetail.qty')}</span>
            <InputNumber
              min={1}
              max={99}
              value={qty}
              onChange={(v) => setQty(Number(v) || 1)}
              size="large"
              className="w-28"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              className="h-12 min-w-[200px] !rounded-full font-semibold shadow-lg shadow-blue-500/20"
            >
              {t('productDetail.add_cart')}
            </Button>
            <Button
              size="large"
              icon={<HeartOutlined />}
              className="h-12 min-w-[160px] !rounded-full border-gray-200 font-semibold"
            >
              {t('productDetail.wishlist')}
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">{t('productDetail.shipping')}</p>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1d1d1f]">
              {t('productDetail.specs_title')}
            </h2>
            <dl className="mt-4 space-y-3">
              {product.specs.map((row) => (
                <div
                  key={`${row.labelKey}-${row.valueKey || row.value || ''}`}
                  className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:justify-between"
                >
                  <dt className="text-sm text-gray-500">{t(row.labelKey)}</dt>
                  <dd className="text-sm font-medium text-[#1d1d1f]">
                    {row.valueKey ? t(row.valueKey) : row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
