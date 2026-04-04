import { App, Button, Card, Col, Row, Spin, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as productService from '../services/productService'
import * as wishlistService from '../services/wishlistService'
import { formatVnd } from '../utils/format'

const { Paragraph, Text } = Typography

const HomePage = () => {
  const { message } = App.useApp()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.fetchProducts({ page: 1, limit: 24 })
      setProducts(res.data?.items ?? [])
    } catch (e) {
      message.error(e.response?.data?.message || 'Không tải được danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    load()
  }, [load])

  const addWishlist = async (productId) => {
    if (!user) {
      message.warning('Đăng nhập để thêm yêu thích')
      return
    }
    try {
      await wishlistService.addWishlistItem({ productId })
      message.success('Đã thêm vào yêu thích')
    } catch (e) {
      message.error(e.response?.data?.message || 'Thêm wishlist thất bại')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
          Catalog
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-100">Sản phẩm</h2>
        <Paragraph className="max-w-2xl text-slate-300">
          Chọn sản phẩm, dùng nút &quot;Yêu thích&quot; hoặc copy <Text code>productId</Text> để tạo đơn /
          thêm wishlist trên các trang tương ứng.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <Card
              className="h-full border-slate-800 bg-slate-900/60"
              title={<span className="text-slate-100">{p.name}</span>}
              extra={
                <Text type="secondary" className="text-xs">
                  {formatVnd(p.price)}
                </Text>
              }
            >
              <p className="mb-2 line-clamp-3 text-sm text-slate-400">{p.description || '—'}</p>
              <Text copyable className="text-xs text-slate-500">
                {p._id}
              </Text>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="primary" size="small" onClick={() => addWishlist(p._id)}>
                  Yêu thích
                </Button>
                <Link to="/orders">
                  <Button size="small">Đặt hàng</Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {products.length === 0 && (
        <p className="text-slate-400">
          Chưa có sản phẩm. Chạy backend kết nối MongoDB — dev sẽ tự seed vài sản phẩm mẫu nếu DB trống.
        </p>
      )}
    </section>
  )
}

export default HomePage
