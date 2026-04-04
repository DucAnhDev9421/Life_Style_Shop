import { useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProductListPage from './pages/ProductListPage'
import WishlistPage from './pages/WishlistPage'
import BlogPage from './pages/BlogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import { ConfigProvider, Input } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  SearchOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [headerQ, setHeaderQ] = useState('')

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
      <div className="min-h-screen bg-white text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3] pb-10">
        <header className="sticky top-0 z-50 bg-[#0071e3] shadow-md shadow-blue-900/20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-3 pb-2">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <Link
                to="/"
                className="shrink-0 text-center lg:text-left no-underline"
              >
                <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {t('layout.brand')}
                </span>
              </Link>

              <div className="flex flex-1 justify-center min-w-0">
                <Input
                  size="large"
                  allowClear
                  value={headerQ}
                  onChange={(e) => setHeaderQ(e.target.value)}
                  onPressEnter={submitHeaderSearch}
                  placeholder={t('layout.header_search_placeholder')}
                  prefix={
                    <SearchOutlined
                      className="text-gray-400 cursor-pointer hover:text-[#0071e3]"
                      onClick={submitHeaderSearch}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && submitHeaderSearch()
                      }
                    />
                  }
                  className="max-w-2xl w-full rounded-full bg-white border-0 shadow-inner"
                  styles={{
                    input: { backgroundColor: 'transparent' },
                  }}
                />
              </div>

              <div className="flex items-center justify-center lg:justify-end gap-5 text-white shrink-0">
                <Link
                  to="/cart"
                  className="relative flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <ShoppingCartOutlined className="text-xl" />
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#0071e3]">
                    0
                  </span>
                </Link>
                <Link
                  to="/wishlist"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <HeartOutlined className="text-xl" />
                </Link>
                <button
                  type="button"
                  className="text-blue-100 hover:text-white transition-colors"
                  aria-label="Chat"
                >
                  <MessageOutlined className="text-xl" />
                </button>
                <Link
                  to="/account"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <UserOutlined className="text-xl" />
                </Link>
                <div className="h-5 w-px bg-blue-300/80" />
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-xs font-bold uppercase text-white hover:text-blue-100 w-7"
                >
                  {i18n.language === 'vi' ? 'VI' : 'EN'}
                </button>
              </div>
            </div>

            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm font-medium text-blue-100 border-t border-white/10 mt-2"
              aria-label="Main"
            >
              <Link className="hover:text-white transition-colors" to="/products">
                {t('nav.shop')}
              </Link>
              <Link className="hover:text-white transition-colors" to="/search">
                {t('nav.collections')}
              </Link>
              <Link className="hover:text-white transition-colors" to="/blog">
                {t('nav.blog')}
              </Link>
              <span className="hover:text-white transition-colors cursor-default">
                {t('nav.contact')}
              </span>
              <span className="hover:text-white transition-colors cursor-default">
                {t('nav.about')}
              </span>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
