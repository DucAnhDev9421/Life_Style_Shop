import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SearchResultsPage from './pages/SearchResultsPage'
import BlogPage from './pages/BlogPage'
import { ConfigProvider } from 'antd'
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0071e3', // Tech blue
          colorBgBase: '#ffffff',
          fontFamily: 'Inter, -apple-system, sans-serif',
          borderRadius: 8, // Smooth rounded corners for tech
        },
        components: {
          Button: {
            controlHeightLG: 44,
            borderRadiusLG: 22, // Pill shaped buttons
            primaryShadow: '0 4px 14px 0 rgba(0,113,227,0.39)',
          },
          Input: {
            controlHeightLG: 44,
            borderRadiusLG: 8,
          }
        }
      }}
    >
      <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3] pb-10">
        {/* Sleek ocean blue tech header */}
        <header className="sticky top-0 z-50 bg-[#0071e3] shadow-lg shadow-blue-500/20 transition-all duration-300">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-14">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center">
                <h1 className="text-lg font-bold tracking-tight text-white inline-flex items-center gap-2">
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#0071e3] rounded-full animate-pulse" />
                  </div>
                  LIFESTYLE TECH
                </h1>
              </Link>
              
              <div className="hidden md:flex gap-6 items-center text-[12px] font-bold uppercase tracking-widest text-blue-50">
                <Link className="transition-colors hover:text-white" to="/search">{t('nav.shop')}</Link>
                <Link className="transition-colors hover:text-white" to="/mac">{t('nav.mac')}</Link>
                <Link className="transition-colors hover:text-white" to="/ipad">{t('nav.ipad')}</Link>
                <Link className="transition-colors hover:text-white" to="/blog">{t('nav.newsroom')}</Link>
              </div>
            </div>

            <div className="flex gap-5 items-center justify-end text-blue-100">
              <Link to="/search" className="transition-colors hover:text-white">
                <SearchOutlined className="text-[17px]" />
              </Link>
              <Link to="/wishlist" className="transition-colors hover:text-white">
                <HeartOutlined className="text-[17px]" />
              </Link>
              <Link to="/account" className="transition-colors hover:text-white">
                <UserOutlined className="text-[17px]" />
              </Link>
              <Link to="/cart" className="transition-colors hover:text-white flex items-center relative group">
                <ShoppingCartOutlined className="text-[17px]" />
                <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#0071e3]">
                  0
                </span>
              </Link>
              
              <div className="h-4 w-px bg-blue-300 ml-1" />
              
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="text-xs font-bold text-white uppercase hover:text-blue-200 transition-colors cursor-pointer w-6"
              >
                {i18n.language === 'vi' ? 'VI' : 'EN'}
              </button>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
