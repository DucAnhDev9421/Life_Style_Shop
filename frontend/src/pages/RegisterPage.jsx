import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined, IdcardOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi'
import { notifyAuthChanged } from '../utils/authEvents'


export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      if (response.success) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user))
        notifyAuthChanged()
        message.success('Registration successful! Welcome!')
        navigate('/')
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#fbfbfd]">
      
      <div className="hidden lg:relative lg:block lg:flex-1 bg-[#000000]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute bg-gradient-to-tr from-[#0071e3] to-[#42a1f5] w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 top-1/4 -left-10 animate-pulse"></div>
          
          <img
            className="w-full h-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Mac Setup"
          />
          <div className="absolute top-12 left-12 right-12 z-10 text-white">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-2xl mb-6 border border-white/20">
               <div className="w-4 h-4 bg-[#0071e3] rounded-full" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 drop-shadow-md">Join the lifestyle.</h1>
            <p className="text-lg opacity-80 drop-shadow-sm max-w-md">Create an account to track orders, manage your wishlist, and check out faster.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Create account
            </h2>
            <p className="mt-2 text-sm text-[#86868b]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#0071e3] hover:text-[#0077ED] transition-colors">
                Sign in <RightOutlined className="text-[10px] ml-1" />
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-white px-6 py-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-2xl sm:px-10 border border-[#e5e5ea]">
              <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  name="fullName"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Full Name</span>}
                  rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                  <Input 
                    prefix={<IdcardOutlined className="text-[#86868b]" />} 
                    placeholder="Steve Jobs" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Email</span>}
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-[#86868b]" />} 
                    placeholder="steve@example.com" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Password</span>}
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 8, message: 'Password must be at least 8 characters long!' }
                  ]}
                  hasFeedback
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-[#86868b]" />}
                    placeholder="Minimum 8 characters" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label={<span className="text-[#1d1d1f] font-medium text-sm">Confirm Password</span>}
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-[#86868b]" />}
                    placeholder="Confirm your password" 
                    className="hover:border-[#0071e3] focus:border-[#0071e3]"
                  />
                </Form.Item>

                <Form.Item className="mb-0 mt-6">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="w-full h-11 bg-[#1d1d1f] hover:bg-[#000000] border-none font-semibold transition-all duration-300"
                    loading={loading}
                  >
                    {!loading && <span>Create Account</span>}
                  </Button>
                </Form.Item>
                <div className="mt-4 text-center">
                  <p className="text-[11px] text-[#86868b] leading-tight">
                    By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
