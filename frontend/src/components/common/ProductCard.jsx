import { Link } from 'react-router-dom'
import { HeartFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'

const ProductCard = ({
  product,
  wishlistActive = false,
  onRemoveFromWishlist,
}) => {
  const { t, i18n } = useTranslation()

  const title = product.catalogItemId
    ? t(`listing.catalog_items.${product.catalogItemId}.name`)
    : product.name
  const subtitle = product.catalogItemId
    ? t(`listing.catalog_items.${product.catalogItemId}.size`)
    : product.tagline
  const priceDisplay =
    product.priceVnd != null
      ? t('listing.price_line', {
          value: formatVndAmount(product.priceVnd, i18n.language),
        })
      : product.price

  return (
    <div className="relative">
      {wishlistActive && (
        <>
          <HeartFilled
            className="pointer-events-none absolute top-4 right-4 z-10 text-lg text-red-500 drop-shadow-sm"
            aria-hidden
          />
          {onRemoveFromWishlist && (
            <button
              type="button"
              onClick={onRemoveFromWishlist}
              className="absolute top-4 left-4 z-20 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#0071e3] bg-white/95 px-2 py-1 rounded-full border border-gray-200 shadow-sm"
            >
              {t('listing.remove_wishlist')}
            </button>
          )}
        </>
      )}
      <Link
        to={`/product/${product.id}`}
        className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#0071e3]/10 transition-shadow duration-300 group cursor-pointer flex flex-col items-center text-center no-underline text-inherit"
      >
        {product.isNew && (
          <p className="text-[#0071e3] text-[10px] font-bold uppercase tracking-widest mb-1">
            {t('products.new')}
          </p>
        )}
        <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-6">{subtitle}</p>

        <div className="relative w-full aspect-square mb-6">
          <img
            src={
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : (product.image || '')
            }
            alt=""
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="mt-auto w-full flex justify-between items-center bg-[#f5f5f7] rounded-full p-1 pl-4">
          <span className="text-sm font-semibold text-[#1d1d1f]">
            {priceDisplay}
          </span>
          <span className="bg-[#1d1d1f] text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-[#0071e3] transition-colors inline-block">
            {t('products.buy')}
          </span>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
