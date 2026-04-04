import { App, Button, Form, Input, Popconfirm, Space, Table, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as wishlistService from '../services/wishlistService'
import { formatVnd } from '../utils/format'

export default function WishlistPage() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState(null)
  const [addForm] = Form.useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await wishlistService.fetchWishlist()
      setWishlist(res.data)
    } catch (e) {
      message.error(e.response?.data?.message || 'Không tải được wishlist')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    load()
  }, [load])

  const items = wishlist?.items ?? []

  const onAdd = async () => {
    try {
      const values = await addForm.validateFields()
      await wishlistService.addWishlistItem({
        productId: values.productId.trim(),
        note: values.note || '',
      })
      message.success('Đã thêm vào yêu thích')
      addForm.resetFields()
      load()
    } catch (e) {
      if (e?.errorFields) return
      message.error(e.response?.data?.message || 'Thêm thất bại')
    }
  }

  const onSaveNote = async (productId, note) => {
    try {
      await wishlistService.updateWishlistItemNote(productId, note)
      message.success('Đã lưu ghi chú')
      load()
    } catch (e) {
      message.error(e.response?.data?.message || 'Lưu thất bại')
    }
  }

  const onRemove = async (productId) => {
    try {
      await wishlistService.removeWishlistItem(productId)
      message.success('Đã xóa')
      load()
    } catch (e) {
      message.error(e.response?.data?.message || 'Xóa thất bại')
    }
  }

  const onClear = async () => {
    try {
      await wishlistService.clearWishlist()
      message.success('Đã xóa toàn bộ')
      load()
    } catch (e) {
      message.error(e.response?.data?.message || 'Xóa thất bại')
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'name',
      render: (_, row) => {
        const p = row.productId
        if (p && typeof p === 'object') {
          return (
            <div>
              <Typography.Text strong>{p.name}</Typography.Text>
              <div className="text-xs text-slate-400">{p._id}</div>
            </div>
          )
        }
        return row.productId
      },
    },
    {
      title: 'Giá',
      key: 'price',
      width: 140,
      render: (_, row) => {
        const p = row.productId
        if (p && typeof p === 'object') return formatVnd(p.price)
        return '—'
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text, row) => (
        <Input.TextArea
          key={row.productId?._id || row.productId}
          defaultValue={text}
          rows={2}
          onBlur={(e) => {
            const next = e.target.value
            if (next !== (text || '')) {
              const id = typeof row.productId === 'object' ? row.productId._id : row.productId
              onSaveNote(id, next)
            }
          }}
        />
      ),
    },
    {
      title: 'Thêm lúc',
      dataIndex: 'addedAt',
      key: 'addedAt',
      width: 180,
      render: (d) => (d ? new Date(d).toLocaleString('vi-VN') : '—'),
    },
    {
      title: '',
      key: 'act',
      width: 100,
      render: (_, row) => {
        const id = typeof row.productId === 'object' ? row.productId._id : row.productId
        return (
          <Popconfirm title="Xóa khỏi yêu thích?" onConfirm={() => onRemove(id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Danh sách yêu thích</h2>
          <p className="text-sm text-slate-400">
            CRUD: xem danh sách, thêm (POST), sửa ghi chú (PATCH), xóa mục / xóa toàn bộ (DELETE).
          </p>
        </div>
        <Space>
          <Link to="/">
            <Button>Sản phẩm</Button>
          </Link>
          <Popconfirm title="Xóa hết wishlist?" onConfirm={onClear} disabled={items.length === 0}>
            <Button danger disabled={items.length === 0}>
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <Form form={addForm} layout="inline" className="flex flex-wrap gap-2" onFinish={onAdd}>
          <Form.Item
            name="productId"
            rules={[{ required: true, message: 'Nhập productId' }]}
            className="mb-0 min-w-[240px] flex-1"
          >
            <Input placeholder="Mongo ObjectId sản phẩm" />
          </Form.Item>
          <Form.Item name="note" className="mb-0 min-w-[200px] flex-1">
            <Input placeholder="Ghi chú (tuỳ chọn)" />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        rowKey={(row) => (typeof row.productId === 'object' ? row.productId._id : row.productId)}
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={false}
      />
    </div>
  )
}
