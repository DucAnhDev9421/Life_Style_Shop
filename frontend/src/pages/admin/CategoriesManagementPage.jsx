import { useEffect, useState } from 'react'
import {
  Table, Input, Modal, Form, Switch, Dropdown, message,
} from 'antd'
import { Search, Plus, Edit2, Trash2, MoreVertical, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function StatusBadge({ status }) {
  const s = {
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    inactive: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  }[status] || {}
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg || 'bg-gray-100'} ${s.text || 'text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot || 'bg-gray-400'}`} />
      {s.label || status}
    </span>
  )
}

function CategoryModal({ open, onClose, onSuccess, editing }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          slug: editing.slug || '',
          description: editing.description || '',
          image: editing.image || '',
          status: editing.status === 'active',
        })
      } else {
        form.resetFields()
        form.setFieldsValue({ status: true, slug: '' })
      }
    }
  }, [open, editing, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive',
        slug: values.slug?.trim() ? values.slug.trim() : slugify(values.name),
      }
      if (editing) {
        await adminApi.updateCategory(editing._id, payload)
        message.success(t('admin.categories.edit_success', 'Category updated'))
      } else {
        await adminApi.createCategory(payload)
        message.success(t('admin.categories.create_success', 'Category created'))
      }
      onSuccess()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'An error occurred'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-2">
          <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 flex items-center justify-center flex-shrink-0">
            <Tag className="w-4 h-4 text-[#0071e3]" />
          </div>
          <span className="text-lg font-semibold text-[#1d1d1f]">
            {editing
              ? t('admin.categories.modal_edit_title', 'Edit Category')
              : t('admin.categories.modal_create_title', 'New Category')}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={editing
        ? t('admin.categories.save_changes', 'Save Changes')
        : t('admin.categories.create', 'Create')}
      okButtonProps={{ loading, className: '!rounded-full !bg-[#0071e3] hover:!bg-[#005bb5] border-0' }}
      cancelButtonProps={{ className: '!rounded-full' }}
      width={520}
      className="!rounded-2xl"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        requiredMark={false}
        onValuesChange={(_, all) => {
          if (!all.slug && all.name) {
            form.setFieldsValue({ slug: slugify(all.name) })
          }
        }}
      >
        <Form.Item
          name="name"
          label={<span className="text-sm font-medium text-[#1d1d1f]">{t('admin.categories.form_name', 'Category Name')}</span>}
          rules={[{ required: true, message: t('admin.categories.form_name_required', 'Category name is required') }]}
        >
          <Input
            placeholder={t('admin.categories.form_name_placeholder', 'e.g. Electronics, Fashion, Sports')}
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label={<span className="text-sm font-medium text-[#1d1d1f]">{t('admin.categories.form_slug', 'Slug')}</span>}
          rules={[
            {
              pattern: /^[a-z0-9-]*$/,
              message: t('admin.categories.form_slug_invalid', 'Only lowercase letters, numbers and hyphens'),
            },
          ]}
          extra={<span className="text-xs text-[#86868b]">{t('admin.categories.form_slug_hint', 'Leave blank to auto-generate from name')}</span>}
        >
          <Input
            placeholder={t('admin.categories.form_slug_placeholder', 'e.g. electronics, fashion')}
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="text-sm font-medium text-[#1d1d1f]">{t('admin.categories.form_description', 'Description')}</span>}
        >
          <Input.TextArea
            placeholder={t('admin.categories.form_description_placeholder', 'Brief description of this category')}
            rows={3}
            className="!rounded-xl"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="image"
          label={<span className="text-sm font-medium text-[#1d1d1f]">{t('admin.categories.form_image', 'Category Image URL')}</span>}
        >
          <Input
            placeholder="https://example.com/image.jpg"
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="text-sm font-medium text-[#1d1d1f]">{t('admin.categories.form_status', 'Status')}</span>}
          valuePropName="checked"
          extra={
            <span className="text-xs text-[#86868b]">
              Inactive categories won't appear on the storefront
            </span>
          }
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            className="[&_.ant-switch-checked]:!bg-[#0071e3]"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function CategoriesManagementPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getCategories()
      setCategories(data.data.categories || [])
    } catch (e) {
      console.error('Failed to fetch categories', e)
      message.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filtered = search.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories

  const handleEdit = (category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    fetchCategories()
  }

  const handleDelete = async () => {
    const { category } = deleteModal
    if (!category) return
    setDeleteLoading(true)
    try {
      await adminApi.deleteCategory(category._id)
      message.success('Category deleted')
      setCategories((prev) => prev.filter((c) => c._id !== category._id))
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to delete category')
    } finally {
      setDeleteLoading(false)
      setDeleteModal({ open: false, category: null })
    }
  }

  const columns = [
    {
      title: 'Category',
      key: 'category',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.image ? (
            <img
              src={record.image}
              alt={record.name}
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-[#d2d2d7]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1d1d1f] truncate max-w-[200px]">{record.name}</p>
            <p className="text-xs text-[#86868b] font-mono truncate max-w-[200px]">/{record.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      key: 'description',
      render: (_, record) => (
        <span className="text-sm text-[#86868b] max-w-[200px] line-clamp-2 block">
          {record.description || '—'}
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
                key: 'edit',
                label: (
                  <span className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit
                  </span>
                ),
                onClick: () => handleEdit(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                label: <span className="flex items-center gap-2 text-red-500"><Trash2 className="w-4 h-4" /> Delete</span>,
                onClick: () => setDeleteModal({ open: true, category: record }),
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
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            {t('admin.categories.title', 'Categories')}
          </h1>
          <p className="mt-1 text-sm text-[#86868b]">
            {t('admin.categories.subtitle', 'Organize your products into categories')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0071e3] hover:bg-[#005bb5] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(0,113,227,0.39)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('admin.categories.add', 'Add Category')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <Input
          placeholder={t('admin.categories.search_placeholder', 'Search categories...')}
          prefix={<Search className="w-4 h-4 text-[#86868b]" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!max-w-xs !rounded-xl"
          allowClear
        />
        <div className="ml-auto text-sm text-[#86868b]">
          {filtered.length > 0 ? `${filtered.length} ${t('admin.categories.items', 'categories')}` : ''}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="_id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-16 text-[#86868b]">
                <Tag className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">{t('admin.categories.empty', 'No categories found')}</p>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-3 text-sm font-semibold text-[#0071e3] hover:underline cursor-pointer"
                >
                  {t('admin.categories.empty_create', 'Create your first category')}
                </button>
              </div>
            ),
          }}
        />
      </div>

      {/* Create/Edit Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        editing={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title={t('admin.categories.delete_title', 'Delete Category')}
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, category: null })}
        onOk={handleDelete}
        okText={t('admin.categories.delete', 'Delete')}
        okButtonProps={{ danger: true, loading: deleteLoading, className: '!rounded-full' }}
        cancelButtonProps={{ className: '!rounded-full' }}
        className="!rounded-2xl"
      >
        <p className="text-sm text-[#86868b]">
          Are you sure you want to delete{' '}
          <strong className="text-[#1d1d1f]">{deleteModal.category?.name}</strong>?
          Products in this category will not be deleted.
        </p>
      </Modal>
    </div>
  )
}
