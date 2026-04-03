import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ConfigProvider } from 'antd'
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined,
  SearchOutlined
} from '@ant-design/icons'

function App() {
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
        {/* Very sleek, thin tech header */}
        <header className="sticky top-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-14">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center">
                <h1 className="text-lg font-bold tracking-tight text-black inline-flex items-center gap-2">
                  <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                  LIFESTYLE TECH
                </h1>
              </Link>
              
              <div className="hidden md:flex gap-6 items-center text-[12px] font-medium tracking-wide text-gray-600">
                <Link className="transition-colors hover:text-[#0071e3]" to="/mac">Mac</Link>
                <Link className="transition-colors hover:text-[#0071e3]" to="/ipad">iPad</Link>
                <Link className="transition-colors hover:text-[#0071e3]" to="/audio">Audio</Link>
                <Link className="transition-colors hover:text-[#0071e3]" to="/accessories">Accessories</Link>
              </div>
            </div>

            <div className="flex gap-6 items-center justify-end text-gray-500">
              <Link to="/search" className="transition-colors hover:text-black">
                <SearchOutlined className="text-[17px]" />
              </Link>
              <Link to="/wishlist" className="transition-colors hover:text-black">
                <HeartOutlined className="text-[17px]" />
              </Link>
              <Link to="/account" className="transition-colors hover:text-black">
                <UserOutlined className="text-[17px]" />
              </Link>
              <Link to="/cart" className="transition-colors hover:text-black flex items-center relative group">
                <ShoppingCartOutlined className="text-[17px]" />
                <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0071e3] text-[9px] font-bold text-white">
                  0
                </span>
              </Link>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
