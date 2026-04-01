import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Life Style Shop</h1>
          <div className="flex gap-4 text-sm">
            <Link className="hover:text-sky-300" to="/">
              Home
            </Link>
            <a
              className="hover:text-sky-300"
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
  )
}

export default App
