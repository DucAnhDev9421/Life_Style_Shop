import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin.nav.dashboard', end: true },
  { to: '/admin/products', icon: Package, labelKey: 'admin.nav.products', end: false },
  { to: '/admin/categories', icon: Tag, labelKey: 'admin.nav.categories', end: false },
  { to: '/admin/orders', icon: ShoppingCart, labelKey: 'admin.nav.orders', end: false },
  { to: '/admin/users', icon: Users, labelKey: 'admin.nav.users', end: false },
  { to: '/admin/analytics', icon: BarChart3, labelKey: 'admin.nav.analytics', end: false },
]

export default function AdminSidebar({ user }) {
  const { t } = useTranslation()

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col bg-white border-r border-[#e5e5ea] min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#e5e5ea]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0071e3] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="text-sm font-black tracking-tight text-[#1d1d1f] uppercase">
            Lifestyle Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
          {t('admin.nav.management', 'Management')}
        </p>
        {/* eslint-disable-next-line no-unused-vars */}
        {navItems.map(({ to, icon: Icon, labelKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#0071e3]/10 text-[#0071e3]'
                  : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-[#e5e5ea] space-y-0.5">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#0071e3]/10 text-[#0071e3]'
                : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {t('admin.nav.settings', 'Settings')}
        </NavLink>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#86868b] hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {t('admin.nav.logout', 'Sign Out')}
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-[#e5e5ea]">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}&background=0071e3&color=fff`
            }
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#1d1d1f] truncate">{user?.fullName || 'Admin'}</p>
            <p className="text-[11px] text-[#86868b] truncate capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
