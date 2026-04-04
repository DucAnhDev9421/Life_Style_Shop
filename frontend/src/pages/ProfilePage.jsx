import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'security'
  const [isFetching, setIsFetching] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watchPassword('newPassword', '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        const userData = response.data || response;
        resetProfile({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile information.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [resetProfile]);

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    try {
      const response = await userService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
      });
      if (response && response.success !== false) {
        toast.success('Profile updated successfully!');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, fullName: data.fullName, phone: data.phone }));
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    try {
      const response = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response && response.success !== false) {
        toast.success('Password changed successfully!');
        resetPassword();
      } else {
        toast.error('Failed to change password.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-[#f8f9fa]">
        <svg className="animate-spin h-8 w-8 text-[#0E5E76]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8f9fa] py-8 lg:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        
        {/* Page Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Account Settings</h2>
          <p className="text-gray-500 mt-2 text-[15px]">Manage your profile and security preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-[30%] xl:w-1/4 shrink-0">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-3.5 px-5 py-4 rounded-xl text-left font-semibold text-[15px] transition-all whitespace-nowrap lg:whitespace-normal ${activeTab === 'personal' ? 'bg-white text-[#0E5E76] shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'}`}
              >
                <UserOutlined className="text-[18px]" />
                Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3.5 px-5 py-4 rounded-xl text-left font-semibold text-[15px] transition-all whitespace-nowrap lg:whitespace-normal ${activeTab === 'security' ? 'bg-white text-[#0E5E76] shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'}`}
              >
                <LockOutlined className="text-[18px]" />
                Login & Security
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-[70%] xl:w-3/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[500px]">
              
              {/* Section 1: Personal Information */}
              {activeTab === 'personal' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 tracking-tight">Personal Information</h3>
                  
                  {/* Avatar Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                    <img
                      src="https://i.pravatar.cc/150?u=nhuttran"
                      alt="Avatar"
                      className="w-24 h-24 object-cover rounded-full border-[3px] border-[#0E5E76] shadow-md p-0.5 bg-white shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Profile Picture</h4>
                      <p className="text-sm text-gray-500 max-w-sm mt-1">Your avatar is currently managed by external identity.</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...registerProfile('fullName', { required: 'Full name is required' })}
                          className={`w-full px-4 py-3.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-all outline-none text-[15px] ${profileErrors.fullName ? 'border-red-400 focus:ring-red-400' : ''}`}
                        />
                        {profileErrors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-1">{profileErrors.fullName.message}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          {...registerProfile('phone')}
                          className="w-full px-4 py-3.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-all outline-none text-[15px]"
                        />
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...registerProfile('email')}
                        readOnly
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-100/70 text-gray-500 border border-gray-200 outline-none text-[15px] cursor-not-allowed"
                      />
                      <p className="text-[13px] text-gray-400 mt-2">Email address cannot be changed once created.</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-[#0E5E76] text-white font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-[#0b4d62] transition-colors flex items-center shadow-sm shadow-[#0E5E76]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {profileLoading ? (
                          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Section 2: Login & Security */}
              {activeTab === 'security' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 tracking-tight">Login & Security</h3>
                  <div className="mb-10 pb-8 border-b border-gray-100">
                    <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed">
                      Please enter your current password to change your password. We strongly recommend using a secure and unique password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-6 max-w-xl">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerPassword('currentPassword', { required: 'Current password is required' })}
                        className={`w-full px-4 py-3.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-all outline-none text-[15px] tracking-[0.2em] placeholder:tracking-normal ${passwordErrors.currentPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                      />
                      {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.currentPassword.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...registerPassword('newPassword', { 
                            required: 'New password is required',
                            minLength: { value: 6, message: 'Minimum 6 characters' }
                          })}
                          className={`w-full px-4 py-3.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-all outline-none text-[15px] tracking-[0.2em] placeholder:tracking-normal ${passwordErrors.newPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                        />
                        {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.newPassword.message}</p>}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...registerPassword('confirmNewPassword', { 
                            required: 'Please confirm new password',
                            validate: value => value === newPassword || 'Passwords do not match'
                          })}
                          className={`w-full px-4 py-3.5 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-2 focus:ring-[#0E5E76] focus:bg-white transition-all outline-none text-[15px] tracking-[0.2em] placeholder:tracking-normal ${passwordErrors.confirmNewPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                        />
                        {passwordErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{passwordErrors.confirmNewPassword.message}</p>}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-[#0E5E76] text-white font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-[#0b4d62] transition-colors flex items-center shadow-sm shadow-[#0E5E76]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {passwordLoading ? (
                          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
