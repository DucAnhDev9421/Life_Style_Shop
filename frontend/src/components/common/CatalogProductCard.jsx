import { Link } from 'react-router-dom'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'

const STORAGE_KEY = 'lss_wishlist_ids'

function readWishlistIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'number')) {
        return parsed
      }
    }
  } catch {
    /* ignore */
  }
  return []
}

function writeWishlistIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

/**
 * Thẻ sản phẩm kiểu Figma: ảnh, tên, size, giá VNĐ, tim góc dưới phải.
 * @param {'catalog'|'wishlist'} mode — catalog: tim viền; wishlist: tim đỏ, bỏ yêu thích.
 */
const CatalogProductCard = ({
  product,
  mode = 'catalog',
  onWishlistChange,
  onRemoveFromWishlist,
}) => {
  const { t, i18n } = useTranslation()
  
  // Real API data properties
  const name = product.name
  const priceStr = formatVndAmount(product.price, i18n.language)
  const priceLabel = t('listing.price_line', { value: priceStr })
  
  // Use product.category or description as subtitle
  const subtitle = product.category || product.description?.substring(0, 50) + '...'

  const inWishlist =
    mode === 'wishlist'
      ? true
      : readWishlistIds().includes(product.id)

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (mode === 'wishlist' && onRemoveFromWishlist) {
      onRemoveFromWishlist()
      return
    }
    const ids = readWishlistIds()
    const has = ids.includes(product.id)
    const next = has ? ids.filter((i) => i !== product.id) : [...ids, product.id]
    writeWishlistIds(next)
    onWishlistChange?.()
  }

  return (
    <div className="relative flex flex-col bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col flex-1 p-3 sm:p-4 pb-12 text-left no-underline text-inherit"
      >
        <div className="relative w-full aspect-square rounded-md bg-[#f5f5f7] overflow-hidden">
          <img
            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || '')}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-3 text-sm font-bold text-[#1d1d1f] leading-snug line-clamp-2">
          {name}
        </p>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{subtitle}</p>
        <p className="mt-2 text-xs font-medium text-[#1d1d1f]">{priceLabel}</p>
      </Link>

      <button
        type="button"
        onClick={handleHeartClick}
        className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow border border-gray-200 text-base hover:bg-white transition-colors"
        aria-label={t('listing.heart_toggle_aria')}
      >
        {inWishlist || mode === 'wishlist' ? (
          <HeartFilled className="text-red-500" />
        ) : (
          <HeartOutlined className="text-gray-500" />
        )}
      </button>
    </div>
  )
}

export default CatalogProductCard
