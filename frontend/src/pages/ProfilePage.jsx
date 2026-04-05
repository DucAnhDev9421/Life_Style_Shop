import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, UserRound, ShieldCheck } from 'lucide-react';
import { verifyUser } from './../store/authSlice';
import GeneralTab from './profile/GeneralTab';
import SecurityTab from './profile/SecurityTab';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(verifyUser()).unwrap();
      } catch (error) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        
        {/* Page Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-[#1d1d1f]">User Profile</h1>
          <p className="mt-2 text-sm text-[#86868b]">
            Manage your personal settings, identity, and security options.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5ea] overflow-hidden sticky top-24">
              <div className="p-6 text-center border-b border-[#e5e5ea]">
                <img 
                  src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0071e3&color=fff`}
                  alt="Avatar" 
                  className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
                />
                <h2 className="mt-4 text-xl font-semibold text-[#1d1d1f] truncate px-2">{user?.fullName || 'User'}</h2>
                <span className="inline-flex items-center justify-center mt-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-[10px] font-bold uppercase tracking-wider">
                  {user?.role || 'Customer'}
                </span>
              </div>
              
              <nav className="p-3 space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === 'general' 
                      ? 'bg-[#0071e3]/10 text-[#0071e3]' 
                      : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                  }`}
                >
                  <UserRound className={`w-5 h-5 ${activeTab === 'general' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  General Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === 'security' 
                      ? 'bg-[#0071e3]/10 text-[#0071e3]' 
                      : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                  }`}
                >
                  <ShieldCheck className={`w-5 h-5 ${activeTab === 'security' ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                  Security & Password
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'general' && <GeneralTab user={user} />}
            {activeTab === 'security' && <SecurityTab />}
          </div>

        </div>
      </div>
    </div>
  );
}
