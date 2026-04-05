import { useMemo, useEffect } from 'react'
import { Button, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, removeFromWishlist } from '../store/wishlistSlice'
import CatalogProductCard from '../components/common/CatalogProductCard'
import ListingPageFooter from '../components/common/ListingPageFooter'
import { MOCK_PRODUCTS } from '../data/mockProducts'
import { useTranslation } from 'react-i18next'

const WishlistPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const wishlistState = useSelector((state) => state.wishlist) || {}
  const loading = wishlistState.loading
  const { user } = useSelector((state) => state.auth) || {}

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, user])

  const products = useMemo(() => {
    return (wishlistState.items || []).map(item => ({
      ...item,
      id: item._id || item.id
    }))
  }, [wishlistState.items])

  return (
    <div className="bg-white min-h-screen pb-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        <h1 className="text-center text-base sm:text-lg font-bold tracking-[0.35em] text-[#1d1d1f] mb-10 uppercase font-sans">
          {t('listing.wishlist_title')}
        </h1>

        {loading ? (
          <div className="text-center py-20"><Spin size="large" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">{t('listing.wishlist_empty')}</p>
            <Link to="/products">
              <Button type="primary" size="large" className="rounded-full px-8">
                {t('listing.wishlist_browse')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                mode="wishlist"
                onRemoveFromWishlist={() => dispatch(removeFromWishlist(product.id))}
              />
            ))}
          </div>
        )}
      </div>

      <ListingPageFooter />
    </div>
  )
}

export default WishlistPage
