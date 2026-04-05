import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, Package, TrendingUp, TrendingDown, Layers, AlertTriangle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'

const CHART_COLORS = ['#0071e3', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

function formatMonth(year, month) {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('en', { month: 'short', year: '2-digit' })
}

function SummaryCard({ icon: Icon, label, value, subValue, color, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5ea] animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 bg-gray-200 rounded w-28" />
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-36" />
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
          {subValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${subValue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {subValue >= 0
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-xs font-semibold">{Math.abs(subValue)} new this month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + '15' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e5e5ea] rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-[#1d1d1f]">{label}</p>
        <p className="text-[#0071e3] font-medium">{payload[0].value} {payload[0].dataKey === 'newUsers' ? 'users' : 'products'}</p>
      </div>
    )
  }
  return null
}

export default function AdminAnalyticsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getAnalytics()
        setData(res.data)
      } catch (e) {
        console.error('Failed to fetch analytics', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const pieData = data?.productStatusBreakdown?.map((item, i) => ({
    name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
    value: item.count,
    color: CHART_COLORS[i % CHART_COLORS.length],
  })) || []

  const barData = []
  if (data?.monthlyNewUsers && data?.monthlyNewProducts) {
    const monthsMap = {}
    for (const u of data.monthlyNewUsers) {
      const key = formatMonth(u._id.year, u._id.month)
      monthsMap[key] = { ...(monthsMap[key] || {}), month: key, newUsers: u.count }
    }
    for (const p of data.monthlyNewProducts) {
      const key = formatMonth(p._id.year, p._id.month)
      monthsMap[key] = { ...(monthsMap[key] || {}), month: key, newProducts: p.count }
    }
    Object.keys(monthsMap)
      .sort((a, b) => new Date('01 ' + a) - new Date('01 ' + b))
      .forEach((key) => barData.push(monthsMap[key]))
  }

  const categoryData = data?.topCategories?.map((cat, i) => ({
    name: cat._id || 'Uncategorized',
    count: cat.count,
    color: CHART_COLORS[i % CHART_COLORS.length],
    percent: data.totalCategoryCount
      ? Math.round((cat.count / data.totalCategoryCount) * 100)
      : 0,
  })) || []

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
          {t('admin.analytics.title', 'Analytics')}
        </h1>
        <p className="mt-1 text-sm text-[#86868b]">
          {t('admin.analytics.subtitle', 'Insights into your store growth and performance')}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <SummaryCard
          icon={Users}
          label={t('admin.stats.total_users', 'Total Users')}
          value={data?.summary?.totalUsers ?? 0}
          subValue={data?.summary?.newUsersLast30Days}
          color="#0071e3"
          loading={loading}
        />
        <SummaryCard
          icon={Package}
          label={t('admin.stats.total_products', 'Total Products')}
          value={data?.summary?.totalProducts ?? 0}
          subValue={data?.summary?.newProductsLast30Days}
          color="#6366f1"
          loading={loading}
        />
        <SummaryCard
          icon={Layers}
          label={t('admin.stats.active_products', 'Active Products')}
          value={data?.summary?.activeProducts ?? 0}
          color="#10b981"
          loading={loading}
        />
        <SummaryCard
          icon={AlertTriangle}
          label={t('admin.stats.out_of_stock', 'Out of Stock')}
          value={data?.summary?.outOfStock ?? 0}
          color="#ef4444"
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Monthly Growth Chart */}
          <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6 mb-6">
            <h2 className="text-base font-semibold text-[#1d1d1f] mb-1">
              {t('admin.analytics.monthly_growth', 'Monthly Growth')}
            </h2>
            <p className="text-xs text-[#86868b] mb-6">
              {t('admin.analytics.monthly_growth_desc', 'New users and products added over the last 12 months')}
            </p>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#86868b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#86868b' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,113,227,0.05)' }} />
                  <Bar dataKey="newUsers" name="New Users" fill="#0071e3" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="newProducts" name="New Products" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <BarChart className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-sm">{t('admin.analytics.no_data', 'No data available yet')}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Product Status Breakdown */}
            <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6">
              <h2 className="text-base font-semibold text-[#1d1d1f] mb-1">
                {t('admin.analytics.product_status', 'Product Status Breakdown')}
              </h2>
              <p className="text-xs text-[#86868b] mb-6">
                {t('admin.analytics.product_status_desc', 'Distribution of products by their current status')}
              </p>
              {pieData.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e5ea',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-[#1d1d1f]">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1d1d1f]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#86868b]">
                  <p className="text-sm">{t('admin.analytics.no_data', 'No data available yet')}</p>
                </div>
              )}
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6">
              <h2 className="text-base font-semibold text-[#1d1d1f] mb-1">
                {t('admin.analytics.top_categories', 'Top Categories')}
              </h2>
              <p className="text-xs text-[#86868b] mb-6">
                {t('admin.analytics.top_categories_desc', 'Product count by category')}
              </p>
              {categoryData.length > 0 ? (
                <div className="space-y-4">
                  {categoryData.slice(0, 8).map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-sm text-[#1d1d1f] truncate">{cat.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#86868b] flex-shrink-0 ml-3">
                          {cat.count} ({cat.percent}%)
                        </span>
                      </div>
                      <div className="h-2 bg-[#f0f0f5] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${cat.percent}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#86868b]">
                  <p className="text-sm">{t('admin.analytics.no_data', 'No data available yet')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
