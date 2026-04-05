import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { authApi } from '../services/authApi'
import Sidebar from './profile/Sidebar'
import GeneralTab from './profile/GeneralTab'
import SecurityTab from './profile/SecurityTab'
import { notifyAuthChanged } from '../utils/authEvents'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.verify()
        setUser(data.data.user)
      } catch {
        toast.error('Session expired. Please log in again.')
        navigate('/login')
      } finally {
        setAuthLoading(false)
      }
    }
    fetchUser()
  }, [navigate])

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    notifyAuthChanged()
    navigate('/')
    toast.success('Logged out successfully')
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto animate-fade-in-up">

        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-[#1d1d1f]">User Profile</h1>
          <p className="mt-2 text-sm text-[#86868b]">
            Manage your personal settings, identity, and security options.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout}
          />

          <div className="flex-1 min-w-0">
            {activeTab === 'general' && <GeneralTab user={user} onUpdate={handleProfileUpdate} />}
            {activeTab === 'security' && <SecurityTab />}
          </div>

        </div>
      </div>
    </div>
  )
}
