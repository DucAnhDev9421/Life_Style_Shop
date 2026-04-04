import { App as AntdApp, Button, ConfigProvider, theme } from 'antd'
import { Link, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/OrdersPage'
import WishlistPage from './pages/WishlistPage'

function AppHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-slate-800">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-xl font-bold text-slate-100 hover:text-sky-300">
          Life Style Shop
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="text-slate-300 hover:text-sky-300" to="/">
            Trang chủ
          </Link>
          {user ? (
            <>
              <Link className="text-slate-300 hover:text-sky-300" to="/orders">
                Đơn hàng
              </Link>
              <Link className="text-slate-300 hover:text-sky-300" to="/wishlist">
                Yêu thích
              </Link>
              <span className="hidden text-slate-500 sm:inline">{user.email}</span>
              <Button size="small" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Link className="text-sky-400 hover:text-sky-300" to="/login">
              Đăng nhập
            </Link>
          )}
          <a
            className="text-slate-400 hover:text-sky-300"
            href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'}/health`}
            target="_blank"
            rel="noreferrer"
          >
            API
          </a>
        </div>
      </nav>
    </header>
  )
}

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#38bdf8', borderRadius: 8 },
      }}
    >
      <AntdApp>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <AppHeader />
          <main className="mx-auto max-w-6xl px-6 py-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
