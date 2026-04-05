import { useEffect, useState } from 'react'
import { Table, Pagination, Input, Select, Tag, Spin, message, Dropdown } from 'antd'
import { Search, MoreVertical, Eye, UserCheck, UserX, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'customer', label: 'Customer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
  { value: 'pending_verification', label: 'Pending' },
]

function RoleBadge({ role }) {
  const map = {
    admin: { label: 'Admin', bg: 'bg-violet-50', text: 'text-violet-600' },
    seller: { label: 'Seller', bg: 'bg-blue-50', text: 'text-blue-600' },
    customer: { label: 'Customer', bg: 'bg-gray-100', text: 'text-gray-600' },
  }
  const s = map[role] || map.customer
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      {role === 'admin' && <ShieldCheck className="w-3 h-3" />}
      {s.label}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    locked: { label: 'Locked', bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500' },
    pending_verification: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  }
  const s = map[status] || map.active
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export default function UsersManagementPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchUsers = async (pg = 1) => {
    setLoading(true)
    try {
      const params = {
        page: pg,
        limit: 20,
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      }
      const data = await adminApi.getUsers(params)
      let items = data.data.users || []
      if (search.trim()) {
        const q = search.toLowerCase()
        items = items.filter(
          (u) =>
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      }
      setUsers(items)
      setTotal(data.data.pagination?.total || 0)
      setPage(pg)
    } catch (e) {
      console.error('Failed to fetch users', e)
      message.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminApi.updateUserStatus(userId, newStatus)
      message.success('User status updated')
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)))
    } catch {
      message.error('Failed to update user status')
    }
  }

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              record.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(record.fullName)}&background=0071e3&color=fff&size=40`
            }
            alt={record.fullName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1d1d1f] truncate max-w-[180px]">{record.fullName}</p>
            <p className="text-xs text-[#86868b] truncate max-w-[180px]">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => <RoleBadge role={record.role} />,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
    {
      title: 'Joined',
      key: 'createdAt',
      render: (_, record) => (
        <span className="text-sm text-[#86868b]">
          {new Date(record.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Last Login',
      key: 'lastLoginAt',
      render: (_, record) => (
        <span className="text-sm text-[#86868b]">
          {record.lastLoginAt ? new Date(record.lastLoginAt).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', label: <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> View Profile</span> },
              { type: 'divider' },
              {
                key: 'activate',
                label: <span className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600" /> Activate</span>,
                disabled: record.status === 'active',
                onClick: () => handleStatusChange(record._id, 'active'),
              },
              {
                key: 'lock',
                label: <span className="flex items-center gap-2"><UserX className="w-4 h-4 text-red-500" /> Lock Account</span>,
                disabled: record.status === 'locked',
                onClick: () => handleStatusChange(record._id, 'locked'),
              },
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
          {t('admin.users.title', 'Users')}
        </h1>
        <p className="mt-1 text-sm text-[#86868b]">
          {t('admin.users.subtitle', 'Manage user accounts, roles, and access')}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Input
          placeholder={t('admin.users.search_placeholder', 'Search by name or email...')}
          prefix={<Search className="w-4 h-4 text-[#86868b]" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!max-w-xs !rounded-xl"
          allowClear
        />
        <Select
          options={ROLE_OPTIONS}
          value={roleFilter}
          onChange={(v) => setRoleFilter(v)}
          className="!min-w-[130px]"
          popupClassName="rounded-xl"
        />
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          className="!min-w-[130px]"
          popupClassName="rounded-xl"
        />
        <div className="ml-auto text-sm text-[#86868b]">
          {total > 0 ? `${total} users` : ''}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <ShieldCheck className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">{t('admin.users.empty', 'No users found')}</p>
              </div>
            ),
          }}
        />
        {total > 20 && (
          <div className="flex justify-center py-4 border-t border-[#e5e5ea]">
            <Pagination
              current={page}
              total={total}
              pageSize={20}
              onChange={fetchUsers}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  )
}
