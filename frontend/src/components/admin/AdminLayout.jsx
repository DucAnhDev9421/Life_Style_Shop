import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../../services/authApi'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authApi.verify()
        const u = data.data.user
        setUser(u)
        if (u.role !== 'admin' && u.role !== 'seller') {
          toast.error('Access denied. Admin or seller role required.')
          navigate('/')
        }
      } catch {
        toast.error('Session expired. Please log in again.')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-[100vh] items-center justify-center bg-[#fbfbfd]">
        <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[100vh] bg-[#f5f5f7]">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}
