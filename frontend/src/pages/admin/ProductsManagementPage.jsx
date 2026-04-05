import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Input, Select, Table, Pagination, Modal, Dropdown, message } from 'antd'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Package,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'
import { formatVndAmount } from '../../utils/formatVnd'
import ProductModal from '../../components/admin/ProductModal'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    draft: { label: 'Draft', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    archived: { label: 'Archived', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  }
  const s = map[status] || map.draft
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export default function ProductsManagementPage() {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null })
  const [productModal, setProductModal] = useState({ open: false, product: null })

  const fetchProducts = async (pg = 1) => {
    setLoading(true)
    try {
      const params = {
        page: pg,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
      }
      const data = await adminApi.getProducts(params)
      let items = data.data.products || []
      if (search.trim()) {
        const q = search.toLowerCase()
        items = items.filter((p) => p.name.toLowerCase().includes(q))
      }
      setProducts(items)
      setTotal(data.data.pagination?.total || 0)
      setPage(pg)
    } catch (e) {
      console.error('Failed to fetch products', e)
      message.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await adminApi.updateProductStatus(productId, newStatus)
      message.success('Status updated')
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p)))
    } catch {
      message.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    const { product } = deleteModal
    if (!product) return
    try {
      await adminApi.deleteProduct(product._id)
      message.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p._id !== product._id))
      setTotal((prev) => prev - 1)
    } catch {
      message.error('Failed to delete product')
    } finally {
      setDeleteModal({ open: false, product: null })
    }
  }

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#f5f5f7] flex-shrink-0">
            {record.images?.[0] ? (
              <img src={record.images[0]} alt={record.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-5 h-5 text-[#d2d2d7]" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1d1d1f] truncate max-w-[200px]">{record.name}</p>
            <p className="text-xs text-[#86868b] truncate max-w-[200px]">{record.category || 'Uncategorized'}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record) => (
        <span className="text-sm font-semibold text-[#0071e3]">
          {formatVndAmount(record.price, i18n.language)}
        </span>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => (
        <span className={`text-sm font-medium ${record.stock === 0 ? 'text-red-500' : 'text-[#1d1d1f]'}`}>
          {record.stock}
        </span>
      ),
    },
    {
      title: 'Seller',
      key: 'seller',
      render: (_, record) => (
        <span className="text-sm text-[#86868b]">
          {record.seller?.fullName || '—'}
        </span>
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
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: (
                  <Link to={`/product/${record._id}`} className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> View
                  </Link>
                ),
              },
              {
                key: 'edit',
                label: (
                  <span className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit
                  </span>
                ),
                onClick: () => setProductModal({ open: true, product: record }),
              },
              { type: 'divider' },
              {
                key: 'status-active',
                label: 'Set Active',
                disabled: record.status === 'active',
                onClick: () => handleStatusChange(record._id, 'active'),
              },
              {
                key: 'status-draft',
                label: 'Set Draft',
                disabled: record.status === 'draft',
                onClick: () => handleStatusChange(record._id, 'draft'),
              },
              {
                key: 'status-archived',
                label: 'Archive',
                disabled: record.status === 'archived',
                onClick: () => handleStatusChange(record._id, 'archived'),
              },
              { type: 'divider' },
              {
                key: 'delete',
                label: <span className="text-red-500">Delete</span>,
                onClick: () => setDeleteModal({ open: true, product: record }),
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            {t('admin.products.title', 'Products')}
          </h1>
          <p className="mt-1 text-sm text-[#86868b]">
            {t('admin.products.subtitle', 'Manage your product inventory')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setProductModal({ open: true, product: null })}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0071e3] hover:bg-[#005bb5] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(0,113,227,0.39)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('admin.products.add', 'Add Product')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <Input
          placeholder={t('admin.products.search_placeholder', 'Search products...')}
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
          {total > 0 ? `${total} ${t('admin.products.items', 'items')}` : ''}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">{t('admin.products.empty', 'No products found')}</p>
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
              onChange={fetchProducts}
              size="small"
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t('admin.products.delete_confirm_title', 'Delete Product')}
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, product: null })}
        onOk={handleDelete}
        okText={t('admin.products.delete', 'Delete')}
        okButtonProps={{ danger: true, className: '!rounded-full' }}
        cancelButtonProps={{ className: '!rounded-full' }}
        className="!rounded-2xl"
      >
        <p className="text-sm text-[#86868b]">
          Are you sure you want to delete{' '}
          <strong className="text-[#1d1d1f]">{deleteModal.product?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Create / Edit Product Modal */}
      <ProductModal
        open={productModal.open}
        onClose={() => setProductModal({ open: false, product: null })}
        editing={productModal.product}
        onSuccess={() => {
          setProductModal({ open: false, product: null })
          fetchProducts(1)
        }}
      />
    </div>
  )
}
