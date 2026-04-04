import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);

      if (response && response.success) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 w-full bg-[#f8f9fa]">
      <div className="w-full max-w-md animate-fade-in-up">
        
        <div className="mb-8">
          <p className="text-[#0E5E76] font-bold text-[17px] mb-2 tracking-tight">Ethereal Athlete</p>
          <h2 className="text-[40px] font-bold text-[#1d1d1f] leading-tight tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium text-[15px]">
            Continue your journey toward precision and peace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-[13px] font-bold text-gray-600 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              className={`w-full px-4 py-3.5 rounded-xl bg-gray-100/80 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none text-[15px] ${errors.email ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[13px] font-bold text-gray-600 w-16">
                Password
              </label>
              <a href="#" className="text-[13px] font-bold text-[#0E5E76] hover:underline whitespace-nowrap">
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required'
              })}
              className={`w-full px-4 py-3.5 rounded-xl bg-gray-100/80 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none text-[15px] tracking-widest placeholder:tracking-normal ${errors.password ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E5E76] text-white font-semibold text-[15px] py-4 rounded-full hover:bg-[#0b4d62] transition-colors mt-6 h-[54px] flex justify-center items-center shadow-md shadow-[#0E5E76]/20"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button className="w-full mt-6 bg-white border border-gray-100 shadow-sm text-gray-700 font-semibold text-[15px] py-3.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-[18px] h-[18px]" />
          <span>Google</span>
        </button>

        <p className="mt-8 text-center text-[14px] text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#0E5E76] hover:underline">
            Join the collective
          </Link>
        </p>
      </div>
    </div>
  );
}
