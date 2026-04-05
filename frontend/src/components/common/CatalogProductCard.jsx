import { Link } from 'react-router-dom'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatVndAmount } from '../../utils/formatVnd'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice'
import toast from 'react-hot-toast'

/**
 * Thẻ sản phẩm kiểu Figma: ảnh, tên, size, giá VNĐ, tim góc dưới phải.
 * @param {'catalog'|'wishlist'} mode — catalog: tim viền; wishlist: tim đỏ, bỏ yêu thích.
 */
const CatalogProductCard = ({
  product,
  mode = 'catalog',
  onRemoveFromWishlist,
}) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: wishIds } = useSelector((state) => state.wishlist)

  const name = t(`listing.catalog_items.${product.catalogItemId}.name`)
  const sizeLine = t(`listing.catalog_items.${product.catalogItemId}.size`)
  const priceStr = formatVndAmount(product.priceVnd, i18n.language)
  const priceLabel = t('listing.price_line', { value: priceStr })

  const inWishlist =
    mode === 'wishlist'
      ? true
      : wishIds.includes(product.id)

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error(t('auth.login_required', 'Vui lòng đăng nhập để dùng chức năng yêu thích'))
      return
    }

    if (mode === 'wishlist' && onRemoveFromWishlist) {
      onRemoveFromWishlist()
      return
    }

    if (inWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product.id))
    }
  }

  return (
    <div className="relative flex flex-col bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col flex-1 p-3 sm:p-4 pb-12 text-left no-underline text-inherit"
      >
        <div className="relative w-full aspect-square rounded-md bg-[#f5f5f7] overflow-hidden">
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-3 text-sm font-bold text-[#1d1d1f] leading-snug line-clamp-2">
          {name}
        </p>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{sizeLine}</p>
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
