import { App, Button, Card, Form, Input, Tabs } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, register } = useAuth()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from || '/'

  const onLogin = async (values) => {
    setSubmitting(true)
    try {
      await login(values)
      message.success('Đăng nhập thành công')
      navigate(from, { replace: true })
    } catch (e) {
      message.error(e.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const onRegister = async (values) => {
    setSubmitting(true)
    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name,
      })
      message.success('Đăng ký thành công')
      navigate(from, { replace: true })
    } catch (e) {
      message.error(e.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card
        title="Tài khoản"
        className="border-slate-800 bg-slate-900/80"
        styles={{ header: { color: '#e2e8f0' } }}
      >
        <Tabs
          items={[
            {
              key: 'login',
              label: 'Đăng nhập',
              children: (
                <Form layout="vertical" onFinish={onLogin} className="text-slate-100">
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}
                  >
                    <Input placeholder="you@example.com" autoComplete="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: 'Nhập mật khẩu' }]}
                  >
                    <Input.Password autoComplete="current-password" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block loading={submitting}>
                    Đăng nhập
                  </Button>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Đăng ký',
              children: (
                <Form layout="vertical" onFinish={onRegister} className="text-slate-100">
                  <Form.Item name="name" label="Tên hiển thị">
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input autoComplete="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự' }]}
                  >
                    <Input.Password autoComplete="new-password" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block loading={submitting}>
                    Đăng ký
                  </Button>
                </Form>
              ),
            },
          ]}
        />
        <div className="mt-4 text-center text-sm text-slate-400">
          <Link className="text-sky-400 hover:text-sky-300" to="/">
            ← Về trang chủ
          </Link>
        </div>
      </Card>
    </div>
  )
}
