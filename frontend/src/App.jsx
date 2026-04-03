import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ConfigProvider, theme } from 'antd'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#286af8',
          borderRadius: 8,
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
      }}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Life Style Shop</h1>
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link className="transition-colors hover:text-primary" to="/">
                Home
              </Link>
              <a
                className="transition-colors hover:text-primary"
                href={`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'}/health`}
                target="_blank"
                rel="noreferrer"
              >
                API Health
              </a>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">
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
