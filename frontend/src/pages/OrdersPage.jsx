import {
  App,
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as orderService from '../services/orderService'
import { formatVnd } from '../utils/format'

const STATUS_COLORS = {
  pending_payment: 'gold',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'geekblue',
  delivered: 'green',
  completed: 'success',
  cancelled: 'default',
}

const ORDER_STATUSES = [
  'pending_payment',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
]

export default function OrdersPage() {
  const { message } = App.useApp()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [detail, setDetail] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(null)
  const [createForm] = Form.useForm()
  const [adminForm] = Form.useForm()

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await orderService.fetchOrders({ page, limit: 10 })
      setOrders(res.data?.items ?? [])
      setPagination(res.data?.pagination ?? { page: 1, limit: 10, total: 0 })
    } catch (e) {
      message.error(e.response?.data?.message || 'Không tải được đơn hàng')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    load(1)
  }, [load])

  const openDetail = async (id) => {
    try {
      const res = await orderService.fetchOrderById(id)
      setDetail(res.data)
    } catch (e) {
      message.error(e.response?.data?.message || 'Không tải chi tiết đơn')
    }
  }

  const onCreate = async () => {
    try {
      const values = await createForm.validateFields()
      const lines = (values.items || []).map((row) => ({
        productId: row.productId?.trim(),
        quantity: Number(row.quantity),
      }))
      await orderService.createOrder({
        items: lines,
        shippingFee: Number(values.shippingFee) || 0,
        taxTotal: Number(values.taxTotal) || 0,
        shippingAddressSnapshot: {
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          line1: values.line1,
          city: values.city,
          country: values.country || 'VN',
        },
      })
      message.success('Đã tạo đơn')
      setCreateOpen(false)
      createForm.resetFields()
      load(pagination.page)
    } catch (e) {
      if (e?.errorFields) return
      message.error(e.response?.data?.message || 'Tạo đơn thất bại')
    }
  }

  const onCancel = async (id) => {
    try {
      await orderService.cancelOrder(id)
      message.success('Đã hủy đơn')
      load(pagination.page)
      if (detail?._id === id) setDetail((d) => (d ? { ...d, status: 'cancelled' } : d))
    } catch (e) {
      message.error(e.response?.data?.message || 'Không hủy được đơn')
    }
  }

  const onAdminSave = async () => {
    if (!adminOpen) return
    const orderId = adminOpen._id
    try {
      const values = await adminForm.validateFields()
      await orderService.updateOrder(orderId, {
        status: values.status,
        paymentStatus: values.paymentStatus,
        timelineNote: values.timelineNote,
      })
      message.success('Đã cập nhật đơn (admin)')
      setAdminOpen(null)
      load(pagination.page)
      if (detail?._id === orderId) openDetail(orderId)
    } catch (e) {
      if (e?.errorFields) return
      message.error(e.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => (
        <Button type="link" className="p-0" onClick={() => openDetail(record._id)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, r) => formatVnd(r.pricing?.grandTotal),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => (d ? new Date(d).toLocaleString('vi-VN') : '—'),
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button size="small" onClick={() => openDetail(record._id)}>
            Chi tiết
          </Button>
          {user?.role === 'admin' && (
            <Button
              size="small"
              onClick={() => {
                setAdminOpen(record)
                adminForm.setFieldsValue({
                  status: record.status,
                  paymentStatus: record.paymentStatus,
                  timelineNote: '',
                })
              }}
            >
              Admin
            </Button>
          )}
          {record.status !== 'cancelled' && (
            <Popconfirm title="Hủy đơn này?" onConfirm={() => onCancel(record._id)}>
              <Button size="small" danger>
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Lịch sử đơn hàng</h2>
          <p className="text-sm text-slate-400">
            CRUD: tạo đơn, xem danh sách/chi tiết, admin cập nhật trạng thái, hủy đơn.
          </p>
        </div>
        <Space>
          <Link to="/">
            <Button>Sản phẩm</Button>
          </Link>
          <Button type="primary" onClick={() => setCreateOpen(true)}>
            Tạo đơn mới
          </Button>
        </Space>
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={orders}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (p) => load(p),
          showSizeChanger: false,
        }}
      />

      <Drawer
        title={detail ? `Đơn ${detail.orderNo}` : 'Chi tiết'}
        open={!!detail}
        onClose={() => setDetail(null)}
        width={520}
        className="[&_.ant-drawer-body]:bg-slate-950"
      >
        {detail && (
          <div className="space-y-4 text-slate-200">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Trạng thái">{detail.status}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán">{detail.paymentStatus}</Descriptions.Item>
              <Descriptions.Item label="Tổng">{formatVnd(detail.pricing?.grandTotal)}</Descriptions.Item>
            </Descriptions>
            <h4 className="font-medium">Sản phẩm</h4>
            <ul className="list-inside list-disc text-sm text-slate-300">
              {(detail.items || []).map((it, i) => (
                <li key={i}>
                  {it.name} × {it.quantity} — {formatVnd(it.lineTotal)}
                </li>
              ))}
            </ul>
            <h4 className="font-medium">Giao hàng</h4>
            <p className="text-sm text-slate-400">
              {[detail.shippingAddressSnapshot?.receiverName, detail.shippingAddressSnapshot?.line1]
                .filter(Boolean)
                .join(' — ') || '—'}
            </p>
            <h4 className="font-medium">Timeline</h4>
            <ul className="space-y-1 text-xs text-slate-400">
              {(detail.statusTimeline || []).map((t, i) => (
                <li key={i}>
                  {t.status} — {t.at ? new Date(t.at).toLocaleString('vi-VN') : ''}{' '}
                  {t.note ? `(${t.note})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Drawer>

      <Modal
        title="Tạo đơn"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={onCreate}
        okText="Tạo đơn"
        width={560}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{
            items: [{ productId: '', quantity: 1 }],
            shippingFee: 0,
            taxTotal: 0,
            country: 'VN',
          }}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" className="w-full">
                    <Form.Item
                      {...field}
                      name={[field.name, 'productId']}
                      label={field.name === 0 ? 'Product ID' : ''}
                      rules={[{ required: true, message: 'Nhập productId' }]}
                      className="mb-0 flex-1"
                    >
                      <Input placeholder="Mongo ObjectId sản phẩm" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'quantity']}
                      label={field.name === 0 ? 'SL' : ''}
                      rules={[{ required: true }]}
                      className="mb-0 w-24"
                    >
                      <InputNumber min={1} className="w-full" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        Xóa dòng
                      </Button>
                    )}
                  </Space>
                ))}
                <Button type="dashed" block onClick={() => add({ productId: '', quantity: 1 })}>
                  + Thêm dòng
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item name="shippingFee" label="Phí ship">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="taxTotal" label="Thuế">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="receiverName" label="Người nhận" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="receiverPhone" label="SĐT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="line1" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Quốc gia">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cập nhật đơn (Admin)"
        open={!!adminOpen}
        onCancel={() => setAdminOpen(null)}
        onOk={onAdminSave}
        destroyOnClose
      >
        <Form form={adminForm} layout="vertical">
          <Form.Item name="status" label="Trạng thái đơn" rules={[{ required: true }]}>
            <Select
              options={ORDER_STATUSES.map((s) => ({
                value: s,
                label: s,
              }))}
            />
          </Form.Item>
          <Form.Item name="paymentStatus" label="Trạng thái thanh toán" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'unpaid', label: 'unpaid' },
                { value: 'paid', label: 'paid' },
                { value: 'failed', label: 'failed' },
              ]}
            />
          </Form.Item>
          <Form.Item name="timelineNote" label="Ghi chú timeline">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
