import { useEffect, useState } from 'react'
import { Table, Pagination, Input, Select, Spin, Dropdown } from 'antd'
import { Search, MoreVertical, Eye, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
  }
  const s = map[status?.toLowerCase()] || { label: status, bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

const MOCK_ORDERS = [
  {
    _id: 'ord-001',
    orderNumber: '#ORD-9421',
    customer: { fullName: 'Eleanor Maree', email: 'eleanor@prestige.com' },
    createdAt: '2024-10-24T10:30:00Z',
    status: 'shipped',
    totalAmount: 482000,
    itemCount: 3,
  },
  {
    _id: 'ord-002',
    orderNumber: '#ORD-9420',
    customer: { fullName: 'Julian Vane', email: 'j.vane@modernist.io' },
    createdAt: '2024-10-23T14:15:00Z',
    status: 'pending',
    totalAmount: 115000,
    itemCount: 1,
  },
  {
    _id: 'ord-003',
    orderNumber: '#ORD-9419',
    customer: { fullName: 'Sophia Laurent', email: 'sophia@vogue.fr' },
    createdAt: '2024-10-23T09:00:00Z',
    status: 'delivered',
    totalAmount: 1240000,
    itemCount: 5,
  },
  {
    _id: 'ord-004',
    orderNumber: '#ORD-9418',
    customer: { fullName: 'Isabella Chen', email: 'i.chen@design.sg' },
    createdAt: '2024-10-22T16:45:00Z',
    status: 'shipped',
    totalAmount: 290000,
    itemCount: 2,
  },
  {
    _id: 'ord-005',
    orderNumber: '#ORD-9417',
    customer: { fullName: 'Marcus Thorne', email: 'm.thorne@curator.io' },
    createdAt: '2024-10-21T11:20:00Z',
    status: 'cancelled',
    totalAmount: 580000,
    itemCount: 4,
  },
]

export default function OrdersManagementPage() {
  const { t, i18n } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    // Simulate API call — replace with actual adminApi.getOrders() when backend is ready
    const timer = setTimeout(() => {
      let items = [...MOCK_ORDERS]
      if (search.trim()) {
        const q = search.toLowerCase()
        items = items.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customer.fullName.toLowerCase().includes(q) ||
            o.customer.email.toLowerCase().includes(q),
        )
      }
      if (statusFilter) {
        items = items.filter((o) => o.status === statusFilter)
      }
      setOrders(items)
      setTotal(items.length)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [search, statusFilter])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: i18n.language === 'vi' ? 'VND' : 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const columns = [
    {
      title: 'Order',
      key: 'order',
      render: (_, record) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1d1d1f]">{record.orderNumber}</p>
          <p className="text-xs text-[#86868b]">{new Date(record.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1d1d1f] truncate max-w-[160px]">{record.customer.fullName}</p>
          <p className="text-xs text-[#86868b] truncate max-w-[160px]">{record.customer.email}</p>
        </div>
      ),
    },
    {
      title: 'Items',
      key: 'itemCount',
      render: (_, record) => (
        <span className="text-sm text-[#86868b]">{record.itemCount} item{record.itemCount !== 1 ? 's' : ''}</span>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => (
        <span className="text-sm font-semibold text-[#0071e3]">{formatCurrency(record.totalAmount)}</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', label: <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> View Details</span> },
              { key: 'invoice', label: <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Invoice</span> },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f5f7] transition-colors cursor-pointer">
            <MoreVertical className="w-4 h-4 text-[#86868b]" />
          </button>
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
          {t('admin.orders.title', 'Orders')}
        </h1>
        <p className="mt-1 text-sm text-[#86868b]">
          {t('admin.orders.subtitle', 'Track and manage all customer orders')}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Input
          placeholder={t('admin.orders.search_placeholder', 'Search orders, customers...')}
          prefix={<Search className="w-4 h-4 text-[#86868b]" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!max-w-xs !rounded-xl"
          allowClear
        />
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          className="!min-w-[150px]"
          popupClassName="rounded-xl"
        />
        <div className="ml-auto text-sm text-[#86868b]">
          {total > 0 ? `${total} orders` : ''}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">{t('admin.orders.empty', 'No orders found')}</p>
              </div>
            ),
          }}
        />
        {total > 10 && (
          <div className="flex justify-center py-4 border-t border-[#e5e5ea]">
            <Pagination current={page} total={total} pageSize={10} onChange={setPage} size="small" />
          </div>
        )}
      </div>
    </div>
  )
}
