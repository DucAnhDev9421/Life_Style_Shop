import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      if (response.success) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        message.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#fbfbfd]">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-[#86868b]">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#0071e3] hover:text-[#0077ED] transition-colors">
                Sign up <RightOutlined className="text-[10px] ml-1" />
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-2xl sm:px-10 border border-[#e5e5ea]">
              <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Email address</span>}
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-[#86868b]" />} 
                    placeholder="Enter your email" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Password</span>}
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-[#86868b]" />}
                    placeholder="Enter your password" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-[#0071e3] hover:text-[#0077ED]">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <Form.Item className="mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ED] border-none font-semibold group flex items-center justify-center transition-all duration-300"
                    loading={loading}
                  >
                    {!loading && <span>Sign in</span>}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:relative lg:block lg:flex-1 bg-[#f5f5f7]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Abstract aesthetic shapes for modern look */}
          <div className="absolute bg-gradient-to-tr from-[#0071e3] to-[#42a1f5] w-96 h-96 rounded-full blur-[100px] opacity-20 -top-20 -left-20 animate-pulse"></div>
          <div className="absolute bg-gradient-to-bl from-purple-400 to-[#0071e3] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>
          
          <img
            // Apple-style aesthetic image. 
            className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-105"
            src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Tech Aesthetic"
          />
          <div className="absolute bottom-12 left-12 right-12 z-10">
            <div className="backdrop-blur-xl bg-white/30 p-8 rounded-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl font-bold text-white mb-2 shadow-sm drop-shadow-md">Welcome to LifeStyle Tech</h3>
              <p className="text-white/90 font-medium drop-shadow-sm">Discover the most advanced equipment with unparalleled elegance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
