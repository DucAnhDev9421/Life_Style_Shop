import { useEffect, useState } from 'react'
import {
  Modal, Form, Input, InputNumber, Select, Switch, message,
} from 'antd'
import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminApi } from '../../services/adminApi'

const { TextArea } = Input

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

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export default function ProductModal({ open, onClose, onSuccess, editing }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (open) {
      const loadCategories = async () => {
        try {
          const res = await adminApi.getCategories()
          const cats = res.data.categories || []
          setCategories(cats.map((c) => ({ value: c.name, label: c.name })))
        } catch {
          setCategories([])
        }
      }
      loadCategories()

      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          slug: editing.slug || '',
          description: editing.description || '',
          price: editing.price,
          stock: editing.stock,
          category: editing.category || undefined,
          images: editing.images?.join(', ') || '',
          status: editing.status === 'active',
        })
      } else {
        form.resetFields()
        form.setFieldsValue({ status: true, stock: 0, price: 0, slug: '' })
      }
    }
  }, [open, editing, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const images = values.images
        ? values.images.split(',').map((s) => s.trim()).filter(Boolean)
        : []
      const payload = {
        name: values.name,
        slug: values.slug?.trim() ? values.slug.trim() : slugify(values.name),
        description: values.description || '',
        price: Number(values.price) || 0,
        stock: Number(values.stock) || 0,
        category: values.category || null,
        images,
        status: values.status ? 'active' : 'draft',
      }
      setLoading(true)
      if (editing) {
        await adminApi.updateProduct(editing._id, payload)
        message.success(t('admin.products.edit_success', 'Product updated'))
      } else {
        await adminApi.createProduct(payload)
        message.success(t('admin.products.create_success', 'Product created'))
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
            <Package className="w-4 h-4 text-[#0071e3]" />
          </div>
          <span className="text-lg font-semibold text-[#1d1d1f]">
            {editing
              ? t('admin.products.modal_edit_title', 'Edit Product')
              : t('admin.products.modal_create_title', 'New Product')}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={editing
        ? t('admin.products.save_changes', 'Save Changes')
        : t('admin.products.create', 'Create')}
      okButtonProps={{ loading, className: '!rounded-full !bg-[#0071e3] hover:!bg-[#005bb5] border-0' }}
      cancelButtonProps={{ className: '!rounded-full' }}
      width={580}
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
          label={<span className="text-sm font-medium text-[#1d1d1f]">Product Name</span>}
          rules={[{ required: true, message: 'Product name is required' }]}
        >
          <Input
            placeholder="e.g. Wireless Headphones Pro"
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label={<span className="text-sm font-medium text-[#1d1d1f]">Slug</span>}
          extra={<span className="text-xs text-[#86868b]">Leave blank to auto-generate from name</span>}
          rules={[
            {
              pattern: /^[a-z0-9-]*$/,
              message: 'Only lowercase letters, numbers and hyphens',
            },
          ]}
        >
          <Input
            placeholder="e.g. wireless-headphones-pro"
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label={<span className="text-sm font-medium text-[#1d1d1f]">Price (VND)</span>}
            rules={[{ required: true, message: 'Price is required' }]}
          >
            <InputNumber
              min={0}
              step={1000}
              size="large"
              className="!w-full !rounded-xl"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v.replace(/,/g, '')) || 0}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label={<span className="text-sm font-medium text-[#1d1d1f]">Stock</span>}
            rules={[{ required: true, message: 'Stock is required' }]}
          >
            <InputNumber
              min={0}
              size="large"
              className="!w-full !rounded-xl"
              placeholder="0"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="category"
          label={<span className="text-sm font-medium text-[#1d1d1f]">Category</span>}
        >
          <Select
            allowClear
            placeholder="Select or type a category"
            size="large"
            className="!rounded-xl"
            options={categories}
            showSearch
            mode={false}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={null}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="text-sm font-medium text-[#1d1d1f]">Description</span>}
        >
          <TextArea
            placeholder="Describe this product..."
            rows={3}
            className="!rounded-xl"
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item
          name="images"
          label={<span className="text-sm font-medium text-[#1d1d1f]">Image URLs</span>}
          extra={<span className="text-xs text-[#86868b]">Separate multiple URLs with commas</span>}
        >
          <Input
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            size="large"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="text-sm font-medium text-[#1d1d1f]">Visibility</span>}
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Draft"
            className="[&_.ant-switch-checked]:!bg-[#0071e3]"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
