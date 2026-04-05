import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { TrendingUp, TrendingDown, Package, Users, AlertTriangle, Layers, Eye, Edit2, MoreVertical } from 'lucide-react'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'
import { formatVndAmount } from '../../utils/formatVnd'

function StatCard({ icon: Icon, label, value, trend, trendLabel, color, loading }) {
  const { i18n } = useTranslation()
  const isPositive = trend > 0

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5ea] animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e5e5ea] hover:shadow-[0_4px_20px_rgba(0,113,227,0.08)] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-xs font-semibold">{Math.abs(trend)}%</span>
              <span className="text-xs text-[#86868b] font-normal">{trendLabel}</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '15' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    draft: { label: 'Draft', bg: 'bg-amber-50', text: 'text-amber-600' },
    archived: { label: 'Archived', bg: 'bg-gray-100', text: 'text-gray-500' },
    out_of_stock: { label: 'Out of Stock', bg: 'bg-red-50', text: 'text-red-500' },
  }
  const s = map[status] || map.draft
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminApi.getStats()
        setStats(data.data)
      } catch (e) {
        console.error('Failed to fetch stats', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const formattedValue = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            {t('admin.dashboard.title', 'Overview')}
          </h1>
          <p className="mt-1 text-sm text-[#86868b]">
            {t('admin.dashboard.subtitle', 'Monitor your store performance at a glance')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Package}
          label={t('admin.stats.total_products', 'Total Products')}
          value={formattedValue(stats?.totalProducts ?? 0)}
          trend={12}
          trendLabel={t('admin.stats.vs_last_month', 'vs last month')}
          color="#0071e3"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label={t('admin.stats.total_users', 'Total Users')}
          value={formattedValue(stats?.totalUsers ?? 0)}
          trend={8}
          trendLabel={t('admin.stats.vs_last_month', 'vs last month')}
          color="#6366f1"
          loading={loading}
        />
        <StatCard
          icon={Layers}
          label={t('admin.stats.active_products', 'Active Products')}
          value={formattedValue(stats?.activeProducts ?? 0)}
          color="#10b981"
          loading={loading}
        />
        <StatCard
          icon={AlertTriangle}
          label={t('admin.stats.out_of_stock', 'Out of Stock')}
          value={stats?.outOfStock ?? 0}
          color="#ef4444"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea]">
            <h2 className="text-base font-semibold text-[#1d1d1f]">
              {t('admin.dashboard.recent_products', 'Recent Products')}
            </h2>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#0071e3] hover:text-[#005bb5] transition-colors"
            >
              {t('admin.dashboard.view_all', 'View All')} →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spin size="large" />
            </div>
          ) : !stats?.recentProducts?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">{t('admin.dashboard.no_products', 'No products yet')}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f5f5f7]">
              {stats.recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#f5f5f7]/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#d2d2d7]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1d1d1f] truncate">{product.name}</p>
                    <p className="text-xs text-[#86868b]">{product.category || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[#0071e3]">
                      {formatVndAmount(product.price, i18n.language)}
                    </p>
                    <p className={`text-xs ${product.stock === 0 ? 'text-red-500 font-medium' : 'text-[#86868b]'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                    </p>
                  </div>
                  <StatusBadge status={product.stock === 0 ? 'out_of_stock' : product.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e5ea]">
            <h2 className="text-base font-semibold text-[#1d1d1f]">
              {t('admin.dashboard.top_categories', 'Top Categories')}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !stats?.topCategories?.length ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#86868b]">
                <p className="text-sm">{t('admin.dashboard.no_categories', 'No categories yet')}</p>
              </div>
            ) : (
              stats.topCategories.map((cat, idx) => (
                <div
                  key={cat._id || idx}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f5f5f7]/50 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: idx === 0 ? '#0071e3' : idx === 1 ? '#6366f1' : idx === 2 ? '#10b981' : '#f59e0b' }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1d1d1f] truncate">{cat._id || 'Uncategorized'}</p>
                    <p className="text-xs text-[#86868b]">{cat.count} {t('admin.dashboard.products', 'products')}</p>
                  </div>
                  <div className="w-20 h-1.5 bg-[#f0f0f5] rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((cat.count / (stats.topCategories[0]?.count || 1)) * 100)}%`,
                        backgroundColor: idx === 0 ? '#0071e3' : idx === 1 ? '#6366f1' : idx === 2 ? '#10b981' : '#f59e0b',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
