import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProductListPage from './pages/ProductListPage'
import WishlistPage from './pages/WishlistPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import { Toaster } from 'react-hot-toast'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { ConfigProvider, Input } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useCart } from './context/useCart.js'
import { AUTH_CHANGED_EVENT } from './utils/authEvents.js'

function App() {
  const { t, i18n } = useTranslation()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [headerQ, setHeaderQ] = useState('')
  const user = localStorage.getItem('user');
  const location = useLocation()

  /** Tick để re-render header sau login/logout cùng tab (đồng bộ với nhánh xác thực). */
  const [, setAuthTick] = useState(0)

  useEffect(() => {
    const bump = () => setAuthTick((n) => n + 1)
    window.addEventListener(AUTH_CHANGED_EVENT, bump)
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, bump)
  }, [])

  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
  }

  const submitHeaderSearch = () => {
    const q = headerQ.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0071e3',
          colorBgBase: '#ffffff',
          fontFamily: 'Inter, -apple-system, sans-serif',
          borderRadius: 8,
        },
        components: {
          Button: {
            controlHeightLG: 44,
            borderRadiusLG: 22,
            primaryShadow: '0 4px 14px 0 rgba(0,113,227,0.39)',
          },
          Input: {
            controlHeightLG: 44,
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3] transition-colors duration-500 pb-10">
        <header className="sticky top-0 z-50 bg-[#0071e3]/95 backdrop-blur-md shadow-lg shadow-blue-900/10 border-b border-white/10 transition-all duration-300">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-18 py-3">
            {/* Brand Logo */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center group no-underline">
                <h1 className="text-xl font-black tracking-tighter text-white inline-flex items-center gap-2 mb-0">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <div className="w-2.5 h-2.5 bg-[#0071e3] rounded-full" />
                  </div>
                  LIFESTYLE
                </h1>
              </Link>

              {/* Main Desktop Navigation */}
              <div className="hidden lg:flex gap-8 items-center text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">
                <Link className="transition-all hover:text-white hover:tracking-[0.25em]" to="/products">{t('nav.shop')}</Link>
                <Link className="transition-all hover:text-white hover:tracking-[0.25em]" to="/blog">{t('nav.newsroom')}</Link>
                <Link className="transition-all hover:text-white hover:tracking-[0.25em]" to="/contact">{t('nav.contact', 'Contact')}</Link>
              </div>
            </div>

            {/* Quick Actions (Search, Cart, Wishlist, User, Lang) */}
            <div className="flex gap-6 items-center justify-end text-white">
              {/* Compact Search */}
              <div className="hidden sm:block">
                <Input
                  variant="borderless"
                  placeholder={t('layout.header_search_placeholder')}
                  value={headerQ}
                  onChange={(e) => setHeaderQ(e.target.value)}
                  onPressEnter={submitHeaderSearch}
                  prefix={<SearchOutlined className="text-gray-400 hover:text-[#0071e3] transition-colors cursor-pointer text-lg" onClick={submitHeaderSearch} />}
                  className="!w-80 !h-11 !bg-white !rounded-full !placeholder-gray-400 !text-gray-800 !text-sm !font-medium hover:!shadow-md focus:!w-96 transition-all duration-300 border-none px-4"
                />
              </div>

              <div className="flex gap-5 items-center">
                <Link to="/wishlist" title={t('listing.wishlist_title')} className="transition-all hover:text-white hover:scale-110 relative text-white/80">
                  <HeartOutlined className="text-[19px]" />
                </Link>
                <Link to="/orders" title="Lịch sử đơn hàng" className="transition-all hover:text-white hover:scale-110 relative text-white/80">
                  <ShoppingOutlined className="text-[19px]" />
                </Link>
                <Link to="/cart" className="transition-all hover:text-white hover:scale-110 flex items-center relative text-white/80 group">
                  <ShoppingCartOutlined className="text-[19px]" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-white text-[9px] font-black text-[#0071e3] shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                </Link>
                <Link to={isLoggedIn ? "/profile" : "/login"} title={isLoggedIn ? "Tài khoản" : "Đăng nhập"} className="transition-all hover:text-white hover:scale-110 text-white/80">
                  <UserOutlined className="text-[19px]" />
                </Link>
                <div className="h-4 w-px bg-white/20 mx-1" />
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-[10px] font-black text-white uppercase hover:text-blue-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-full border border-white/20"
                >
                  {i18n.language === 'vi' ? 'VI' : 'EN'}
                </button>
              </div>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
