import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (response && response.success) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful! Welcome!');
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 w-full bg-[#f8f9fa]">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-[32px] font-bold text-[#0E5E76] mb-2 tracking-tight">
            Create account
          </h2>
          <p className="text-gray-500 font-medium">
            Start your journey with Ethereal Athlete today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register('fullName', { required: 'Full name is required' })}
              className={`w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none ${errors.fullName ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              className={`w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none ${errors.email ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex gap-4">
            {/* Password */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' }
                })}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none ${errors.password ? 'ring-2 ring-red-400' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Confirm
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-colors outline-none ${errors.confirmPassword ? 'ring-2 ring-red-400' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E5E76] text-white font-semibold py-3.5 rounded-full hover:bg-[#0b4d62] transition-colors mt-4 flex justify-center items-center h-[52px]"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <div className="flex flex-col items-center">
                <span>Create</span>
                <span>Account</span>
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or join with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button className="w-full mt-6 bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
          <span>Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already part of the movement?{' '}
          <Link to="/login" className="font-bold text-[#0E5E76] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
